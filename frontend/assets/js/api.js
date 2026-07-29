/**
 * api.js — VeloraSec API Service Layer
 * ============================================================
 * PLACEHOLDER FILE — Semua fungsi API di sini adalah STUB.
 *
 * Saat DEMO_MODE = true (default):
 *   → Fungsi-fungsi ini TIDAK dipanggil; data berasal dari
 *     konstanta hardcoded di script.js.
 *
 * Saat DEMO_MODE = false (setelah Phase 11 — Integrasi):
 *   → Fungsi-fungsi ini akan dipanggil dan mengirim request
 *     HTTP ke backend Flask via fetch().
 *
 * CARA MENGIMPLEMENTASIKAN (per fungsi):
 *   1. Hapus `_notImplemented(...)` dari dalam fungsi
 *   2. Ganti dengan `return _request(endpoint, options)`
 *   3. Pastikan endpoint Flask sudah tersedia dan diuji
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


/**
 * _notImplemented() — penanda stub yang belum diimplementasikan.
 * Dipanggil oleh setiap fungsi stub. Mengembalikan Promise.reject
 * agar error handling di caller tetap bekerja dengan async/await.
 *
 * @param {string} fnName - nama fungsi yang belum diimplementasikan
 * @returns {Promise<never>}
 */
function _notImplemented(fnName) {
  const msg = `[api.js] ${fnName}() belum diimplementasikan. `
    + `Set DEMO_MODE=false dan implementasikan request ke Flask.`;
  console.warn(msg);
  return Promise.reject(new ApiError(501, msg));
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
   * Response:       { access_token: string, refresh_token: string, user: UserObject }
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ access_token: string, refresh_token: string, user: Object }>}
   */
  async function login(email, password) {
    // TODO (Phase 11): Implementasikan dengan kode di bawah
    // const data = await _request('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    // TokenManager.save(data.access_token, data.refresh_token);
    // SessionManager.save(data.user);
    // return data;
    return _notImplemented('AuthAPI.login');
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
   * @returns {Promise<{ message: string, user: Object }>}
   */
  async function register(username, email, password) {
    // TODO (Phase 11):
    // return _request('/api/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ username, email, password }),
    // });
    return _notImplemented('AuthAPI.register');
  }

  /**
   * Logout user — menghapus token dari localStorage.
   * Opsional: bisa call ke server untuk blacklist token.
   *
   * Flask endpoint: POST /api/auth/logout  (opsional)
   * Headers:        Authorization: Bearer <access_token>
   * Response:       { message: 'Logout successful' }
   *
   * @returns {Promise<void>}
   */
  async function logout() {
    // TODO (Phase 11): Opsional — invalidate token di server
    // try {
    //   await _request('/api/auth/logout', { method: 'POST' });
    // } catch { /* ignore server error saat logout */ }
    // finally {
    //   SessionManager.clearAll();
    // }

    // Saat ini: cukup hapus token lokal
    SessionManager.clearAll();
    return Promise.resolve();
  }

  /**
   * Memperbarui access token menggunakan refresh token.
   * Dipanggil otomatis oleh interceptor saat access token expired.
   *
   * Flask endpoint: POST /api/auth/refresh
   * Headers:        Authorization: Bearer <refresh_token>
   * Response:       { access_token: string }
   *
   * @returns {Promise<{ access_token: string }>}
   */
  async function refreshToken() {
    // TODO (Phase 11):
    // const refreshTok = TokenManager.getRefresh();
    // if (!refreshTok) throw new ApiError(401, 'No refresh token');
    // const data = await _request('/api/auth/refresh', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${refreshTok}` },
    // });
    // TokenManager.save(data.access_token);
    // return data;
    return _notImplemented('AuthAPI.refreshToken');
  }

  /**
   * Mengirim email reset password ke alamat yang diberikan.
   *
   * Flask endpoint: POST /api/auth/forgot-password
   * Request body:   { email: string }
   * Response:       { message: string }
   *
   * @param {string} email
   * @returns {Promise<{ message: string }>}
   */
  async function forgotPassword(email) {
    // TODO (Phase 11):
    // return _request('/api/auth/forgot-password', {
    //   method: 'POST',
    //   body: JSON.stringify({ email }),
    // });
    return _notImplemented('AuthAPI.forgotPassword');
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
   * Response:       UserObject { id, username, email, created_at, ... }
   *
   * @returns {Promise<Object>}
   */
  async function getMe() {
    // TODO (Phase 11):
    // return _request('/api/users/me');
    return _notImplemented('UserAPI.getMe');
  }

  /**
   * Memperbarui profil user yang sedang login.
   *
   * Flask endpoint: PUT /api/users/me
   * Request body:   { username?: string, email?: string, password?: string }
   * Response:       { message: string, user: UserObject }
   *
   * @param {{ username?: string, email?: string, password?: string }} payload
   * @returns {Promise<Object>}
   */
  async function updateMe(payload) {
    // TODO (Phase 11):
    // return _request('/api/users/me', {
    //   method: 'PUT',
    //   body: JSON.stringify(payload),
    // });
    return _notImplemented('UserAPI.updateMe');
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
   * Flask endpoint: GET /api/progress
   * Response:       { progress: [{ module_id, is_completed, completed_at }] }
   *
   * @returns {Promise<{ progress: Array }>}
   */
  async function getAll() {
    // TODO (Phase 11):
    // return _request('/api/progress');
    return _notImplemented('ProgressAPI.getAll');
  }

  /**
   * Menandai sebuah modul sebagai selesai atau belum selesai.
   *
   * Flask endpoint: POST /api/progress
   * Request body:   { module_id: string, is_completed: boolean }
   * Response:       { message: string, progress: ProgressObject }
   *
   * @param {string}  moduleId
   * @param {boolean} isCompleted
   * @returns {Promise<Object>}
   */
  async function update(moduleId, isCompleted) {
    // TODO (Phase 11):
    // return _request('/api/progress', {
    //   method: 'POST',
    //   body: JSON.stringify({ module_id: moduleId, is_completed: isCompleted }),
    // });
    return _notImplemented('ProgressAPI.update');
  }

  /**
   * Mereset semua progress user.
   *
   * Flask endpoint: DELETE /api/progress
   * Response:       { message: string }
   *
   * @returns {Promise<{ message: string }>}
   */
  async function resetAll() {
    // TODO (Phase 11):
    // return _request('/api/progress', { method: 'DELETE' });
    return _notImplemented('ProgressAPI.resetAll');
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
   * Query params:   ?category=<string> (opsional, untuk filter per kategori)
   * Response:       { results: [{ id, category, score, total, taken_at }] }
   *
   * @param {string} [category] - filter berdasarkan kategori (opsional)
   * @returns {Promise<{ results: Array }>}
   */
  async function getResults(category) {
    // TODO (Phase 11):
    // const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    // return _request(`/api/quiz/results${qs}`);
    return _notImplemented('QuizAPI.getResults');
  }

  /**
   * Menyimpan hasil quiz yang baru diselesaikan.
   *
   * Flask endpoint: POST /api/quiz/results
   * Request body:   { category: string, score: number, total: number }
   * Response:       { message: string, result: QuizResultObject }
   *
   * @param {string} category - nama kategori quiz
   * @param {number} score    - jumlah jawaban benar
   * @param {number} total    - jumlah total soal
   * @returns {Promise<Object>}
   */
  async function saveResult(category, score, total) {
    // TODO (Phase 11):
    // return _request('/api/quiz/results', {
    //   method: 'POST',
    //   body: JSON.stringify({ category, score, total }),
    // });
    return _notImplemented('QuizAPI.saveResult');
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
   * Menggantikan localStorage 'cyb-planner' saat DEMO_MODE = false.
   *
   * Flask endpoint: GET /api/planner
   * Response:       { tasks: [{ task_key, is_done, updated_at }] }
   *
   * @returns {Promise<{ tasks: Array }>}
   */
  async function getAll() {
    // TODO (Phase 11):
    // return _request('/api/planner');
    return _notImplemented('PlannerAPI.getAll');
  }

  /**
   * Toggle status selesai/belum selesai untuk satu task planner.
   *
   * Flask endpoint: POST /api/planner/:taskKey
   * Request body:   { is_done: boolean }
   * Response:       { message: string, task: PlannerTaskObject }
   *
   * @param {string}  taskKey  - format: 'w0d0', 'w1d3', dst.
   * @param {boolean} isDone
   * @returns {Promise<Object>}
   */
  async function updateTask(taskKey, isDone) {
    // TODO (Phase 11):
    // return _request(`/api/planner/${encodeURIComponent(taskKey)}`, {
    //   method: 'POST',
    //   body: JSON.stringify({ is_done: isDone }),
    // });
    return _notImplemented('PlannerAPI.updateTask');
  }

  /**
   * Mereset semua task planner user ke kondisi awal (belum selesai).
   *
   * Flask endpoint: DELETE /api/planner
   * Response:       { message: string }
   *
   * @returns {Promise<{ message: string }>}
   */
  async function resetAll() {
    // TODO (Phase 11):
    // return _request('/api/planner', { method: 'DELETE' });
    return _notImplemented('PlannerAPI.resetAll');
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
   * Menggantikan data hardcoded di buildDashboard() di script.js.
   *
   * Flask endpoint: GET /api/dashboard/summary
   * Response:
   * {
   *   completion_pct: number,    // persentase modul selesai
   *   streak_days: number,       // streak login hari berturut-turut
   *   total_xp: number,          // total XP user
   *   recent_activity: Array,    // 5 aktivitas terakhir
   *   quiz_stats: {              // statistik quiz
   *     total_attempts: number,
   *     avg_score_pct: number,
   *     best_category: string,
   *   },
   * }
   *
   * @returns {Promise<Object>}
   */
  async function getSummary() {
    // TODO (Phase 11):
    // return _request('/api/dashboard/summary');
    return _notImplemented('DashboardAPI.getSummary');
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
