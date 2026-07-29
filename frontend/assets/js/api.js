/**
 * api.js — VeloraSec API Service Layer
 * ============================================================
 * Menghubungkan frontend ke Flask backend via HTTP requests.
 *
 * Semua fungsi mengirim request ke endpoint Flask yang sebenarnya
 * menggunakan _request() wrapper dengan JWT authentication.
 *
 * Depends on: config.js, token.js
 * Load order: config.js → token.js → api.js
 * ============================================================
 */

'use strict';

// ===========================================================
//  INTERNAL: API ERROR CLASS
// ===========================================================

/**
 * Custom error class untuk response error dari API.
 * Selalu throw ApiError dari dalam _request() agar caller
 * bisa membedakan network error vs API error.
 */
class ApiError extends Error {
  /**
   * @param {number} status  - HTTP status code (400, 401, 403, 404, 500, dst.)
   * @param {string} message - pesan error dari server atau default
   * @param {Object} data    - raw response body dari server (jika ada)
   */
  constructor(status, message, data = {}) {
    super(message);
    this.name    = 'ApiError';
    this.status  = status;
    this.data    = data;
  }
}


// ===========================================================
//  INTERNAL: CORE FETCH WRAPPER
// ===========================================================

/**
 * _request() — wrapper internal untuk semua fetch call ke Flask.
 *
 * Fitur:
 *   - Otomatis menyertakan Authorization: Bearer <token>
 *   - Timeout menggunakan AbortController
 *   - Parse JSON response secara otomatis
 *   - Throw ApiError untuk semua response non-2xx
 *   - Handle 204 No Content (return null)
 *
 * @param {string} endpoint  - path endpoint, misal '/api/auth/login'
 * @param {Object} [options] - fetch options (method, body, headers, dst.)
 * @returns {Promise<any>}   - parsed JSON response, atau null untuk 204
 * @throws {ApiError}        - untuk semua response error (4xx, 5xx)
 * @throws {ApiError}        - dengan status 408 untuk request timeout
 *
 * @example
 * const data = await _request('/api/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password }),
 * });
 */
async function _request(endpoint, options = {}) {
  const token = TokenManager.get();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId  = setTimeout(
    () => controller.abort(),
    VELORASEC_CONFIG.REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      `${VELORASEC_CONFIG.API_BASE_URL}${endpoint}`,
      { ...options, headers, signal: controller.signal }
    );

    clearTimeout(timeoutId);

    // --- Handle error responses ---
    if (!response.ok) {
      let errorBody = {};
      try { errorBody = await response.json(); } catch { /* ignore parse error */ }
      throw new ApiError(
        response.status,
        errorBody.message || errorBody.error || `HTTP ${response.status}`,
        errorBody
      );
    }

    // --- 204 No Content → tidak ada body untuk di-parse ---
    if (response.status === 204) return null;

    return await response.json();

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout — server tidak merespons dalam batas waktu.');
    }
    throw err; // re-throw ApiError atau network error lainnya
  }
}


// ===========================================================
//  AUTH API
// ===========================================================
// Flask Blueprint: routes/auth.py
// Prefix: /api/auth
// ===========================================================

const AuthAPI = (() => {

  /**
   * Login user dengan email dan password.
   * Menyimpan token ke localStorage via TokenManager.
   *
   * Flask endpoint: POST /api/auth/login
   * Request body:   { email: string, password: string }
   * Response:       { access_token, refresh_token, user }
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} parsed JSON response dari Flask
   */
  async function login(email, password) {
    const resp = await _request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Flask response flat JSON: { access_token, refresh_token, user }
    if (resp.access_token) {
      TokenManager.save(resp.access_token, resp.refresh_token);
      if (resp.user) SessionManager.save(resp.user);
    }

    return resp;
  }

  /**
   * Mendaftarkan user baru.
   *
   * Flask endpoint: POST /api/auth/register
   * Request body:   { username: string, email: string, password: string }
   * Response:       { message: string, user: UserObject }
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async function register(username, email, password) {
    return _request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  /**
   * Logout user — invalidate token di server lalu hapus lokal.
   *
   * Flask endpoint: POST /api/auth/logout
   * Headers:        Authorization: Bearer <access_token>
   * Response:       { message: string }
   *
   * @returns {Promise<void>}
   */
  async function logout() {
    try {
      await _request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore server error saat logout — tetap bersihkan lokal
    } finally {
      SessionManager.clearAll();
    }
  }

  /**
   * Memperbarui access token menggunakan refresh token.
   * Dipanggil otomatis oleh interceptor saat access token expired.
   *
   * Flask endpoint: POST /api/auth/refresh
   * Headers:        Authorization: Bearer <refresh_token>
   * Response:       { access_token: string }
   *
   * @returns {Promise<Object>}
   */
  async function refreshToken() {
    const refreshTok = TokenManager.getRefresh();
    if (!refreshTok) throw new ApiError(401, 'No refresh token');

    const resp = await _request('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${refreshTok}` },
    });

    // Flask response flat JSON: { access_token }
    if (resp.access_token) {
      TokenManager.save(resp.access_token);
    }

    return resp;
  }

  /**
   * Mengirim email reset password ke alamat yang diberikan.
   *
   * Flask endpoint: POST /api/auth/forgot-password
   * Request body:   { email: string }
   * Response:       { message: string }
   *
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async function forgotPassword(email) {
    return _request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  return Object.freeze({ login, register, logout, refreshToken, forgotPassword });

})();


// ===========================================================
//  USER API
// ===========================================================
// Flask Blueprint: routes/users.py
// Prefix: /api/users
// ===========================================================

const UserAPI = (() => {

  /**
   * Mendapatkan profil user yang sedang login.
   *
   * Flask endpoint: GET /api/users/me
   * Headers:        Authorization: Bearer <token>
   * Response:       { user: UserObject }
   *
   * @returns {Promise<Object>}
   */
  async function getMe() {
    return _request('/api/users/me');
  }

  /**
   * Memperbarui profil user yang sedang login.
   *
   * Flask endpoint: PUT /api/users/me
   * Request body:   { full_name?, bio?, avatar_url?, current_password?, new_password? }
   * Response:       { message: string, user: UserObject }
   *
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async function updateMe(payload) {
    return _request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  return Object.freeze({ getMe, updateMe });

})();


// ===========================================================
//  PROGRESS API
// ===========================================================
// Flask Blueprint: routes/progress.py
// Prefix: /api/progress
// ===========================================================

const ProgressAPI = (() => {

  /**
   * Mendapatkan semua progress modul user yang sedang login.
   *
   * Flask endpoint: GET /api/progress/
   * Response:       { progress: [ProgressObject] }
   *
   * @returns {Promise<Object>}
   */
  async function getAll() {
    return _request('/api/progress/');
  }

  /**
   * Membuat atau memperbarui progress entry untuk sebuah modul.
   *
   * Flask endpoint: POST /api/progress/
   * Request body:   { module_id: string, is_completed: boolean }
   * Response:       { message: string, progress: ProgressObject }
   *
   * @param {string} moduleId - identifier modul
   * @param {boolean} isCompleted - status selesai
   * @returns {Promise<Object>}
   */
  async function update(moduleId, isCompleted) {
    return _request('/api/progress/', {
      method: 'POST',
      body: JSON.stringify({ module_id: moduleId, is_completed: isCompleted }),
    });
  }

  /**
   * Mereset semua progress user.
   *
   * Flask endpoint: DELETE /api/progress/
   * Response:       { message: string }
   *
   * @returns {Promise<Object>}
   */
  async function resetAll() {
    return _request('/api/progress/', { method: 'DELETE' });
  }

  return Object.freeze({ getAll, update, resetAll });

})();


// ===========================================================
//  QUIZ API
// ===========================================================
// Flask Blueprint: routes/quiz.py
// Prefix: /api/quiz
// ===========================================================

const QuizAPI = (() => {

  /**
   * Mendapatkan riwayat hasil quiz user yang sedang login.
   *
   * Flask endpoint: GET /api/quiz/results
   * Response:       { results: [QuizResultObject] }
   *
   * @returns {Promise<Object>}
   */
  async function getResults() {
    return _request('/api/quiz/results');
  }

  /**
   * Menyimpan hasil quiz yang baru diselesaikan.
   *
   * Flask endpoint: POST /api/quiz/results
   * Request body:   { category: string, score: int, total: int }
   * Response:       { message: string, result: QuizResultObject }
   *
   * @param {string} category - kategori quiz
   * @param {number} score - skor
   * @param {number} total - total pertanyaan
   * @returns {Promise<Object>}
   */
  async function saveResult(category, score, total) {
    return _request('/api/quiz/results', {
      method: 'POST',
      body: JSON.stringify({ category, score, total }),
    });
  }

  return Object.freeze({ getResults, saveResult });

})();


// ===========================================================
//  PLANNER API
// ===========================================================
// Flask Blueprint: routes/planner.py
// Prefix: /api/planner
// ===========================================================

const PlannerAPI = (() => {

  /**
   * Mendapatkan semua task planner user yang sedang login.
   *
   * Flask endpoint: GET /api/planner/
   * Response:       { tasks: [PlannerTaskObject] }
   *
   * @returns {Promise<Object>}
   */
  async function getAll() {
    return _request('/api/planner/');
  }

  /**
   * Toggle status selesai/belum selesai untuk satu task planner.
   *
   * Flask endpoint: POST /api/planner/<task_key>
   * Response:       { message: string, task: PlannerTaskObject }
   *
   * @param {string} taskKey - identifier task (misal: 'task_1', 'w0d0')
   * @returns {Promise<Object>}
   */
  async function updateTask(taskKey) {
    return _request(`/api/planner/${encodeURIComponent(taskKey)}`, {
      method: 'POST',
    });
  }

  /**
   * Mereset semua task planner user (hapus semua dari database).
   *
   * Flask endpoint: DELETE /api/planner/
   * Response:       { message: string }
   *
   * @returns {Promise<Object>}
   */
  async function resetAll() {
    return _request('/api/planner/', { method: 'DELETE' });
  }

  return Object.freeze({ getAll, updateTask, resetAll });

})();


// ===========================================================
//  DASHBOARD API
// ===========================================================
// Flask endpoint: GET /api/dashboard/summary
// Menggabungkan progress + quiz + planner dalam satu call
// ===========================================================

const DashboardAPI = (() => {

  /**
   * Mendapatkan ringkasan dashboard user (aggregated data).
   *
   * Flask endpoint: GET /api/dashboard/summary
   * Response:
   * {
   *   completion_pct: float,
   *   streak_days: int,
   *   total_xp: int,
   *   recent_activity: [...],
   *   quiz_stats: {...}
   * }
   *
   * @returns {Promise<Object>}
   */
  async function getSummary() {
    return _request('/api/dashboard/summary');
  }

  return Object.freeze({ getSummary });

})();


// ===========================================================
//  PUBLIC API FACADE
// ===========================================================
// Ekspor semua modul sebagai satu objek VeloraSec.API
// Gunakan ini untuk memanggil API dari file lain:
//
//   VeloraSec.API.Auth.login(email, password)
//   VeloraSec.API.Progress.update('net-1', true)
//   VeloraSec.API.Quiz.saveResult('Network', 8, 10)
// ===========================================================

const VeloraSec = window.VeloraSec || {};

VeloraSec.API = Object.freeze({
  Auth:      AuthAPI,
  User:      UserAPI,
  Progress:  ProgressAPI,
  Quiz:      QuizAPI,
  Planner:   PlannerAPI,
  Dashboard: DashboardAPI,
});

VeloraSec.Token   = TokenManager;
VeloraSec.Session = SessionManager;

window.VeloraSec = VeloraSec;
