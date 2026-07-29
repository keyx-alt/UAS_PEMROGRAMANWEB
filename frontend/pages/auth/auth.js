/**
 * auth.js — VeloraSec Auth Logic (JWT-Ready)
 * ============================================================
 * Scope  : login.html, register.html, forgot-password.html
 * Depends: config.js → token.js → api.js (load order di HTML)
 *
 * DEMO_MODE = true  (default):
 *   → Simulasi auth dengan setTimeout, response mirror struktur Flask.
 *   → Token demo disimpan via TokenManager agar alur identik.
 *
 * DEMO_MODE = false (Phase 11 — Integrasi):
 *   → Ganti setiap _simulate*() dengan VeloraSec.API.Auth.*()
 *   → Tidak ada perubahan lain yang diperlukan di file ini.
 *
 * Cara migrasi per fungsi — cari komentar: [MIGRATE → Phase 11]
 * ============================================================
 */

'use strict';

// ===========================================================
//  CONSTANTS
// ===========================================================

const AUTH_REDIRECT = {
  AFTER_LOGIN:    '../index.html#dashboard',
  AFTER_REGISTER: 'login.html',
  AFTER_LOGOUT:   'login.html',
};

// ===========================================================
//  PAGE INIT — cek sesi saat halaman auth dimuat
// ===========================================================

(function initAuthPage() {
  /**
   * Jika user sudah punya token valid saat membuka login/register,
   * langsung redirect ke dashboard — tidak perlu login ulang.
   *
   * Catatan: Ini hanya cek token EXISTS + belum expired secara lokal.
   * Validasi server terjadi saat fetch ke endpoint Flask.
   */
  if (typeof TokenManager !== 'undefined' && TokenManager.isLoggedIn() && !TokenManager.isExpired()) {
    window.location.replace(AUTH_REDIRECT.AFTER_LOGIN);
  }
})();

// ===========================================================
//  UI UTILITIES
// ===========================================================

/**
 * Toggle visibilitas password pada input field.
 * @param {string} inputId - ID elemen input
 * @param {HTMLElement} btn - tombol toggle yang diklik
 */
function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  btn.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}

/**
 * Menampilkan pesan status di container auth (error / success / info).
 * @param {string} containerId - ID container pesan
 * @param {'error'|'success'|'info'} type
 * @param {string} text - teks pesan (HTML diizinkan)
 */
function showAuthMsg(containerId, type, text) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const colors = { error: 'var(--danger)', success: 'var(--success)', info: 'var(--secondary)' };
  const icons  = { error: 'fa-circle-xmark', success: 'fa-circle-check', info: 'fa-circle-info' };
  const boxCls = type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info';
  el.style.display = 'flex';
  el.innerHTML = `
    <div class="box box-${boxCls}" style="width:100%;font-size:12px">
      <i class="fas ${icons[type]} box-icon" style="color:${colors[type]}"></i>
      <span>${text}</span>
    </div>`;
}

/**
 * Toggle loading state pada tombol submit.
 * @param {string}  btnId     - ID elemen button
 * @param {boolean} isLoading - true = loading, false = restore
 * @param {string}  loadText  - teks saat loading
 * @param {string}  idleHtml  - HTML asli tombol (untuk restore)
 */
function setLoadingState(btnId, isLoading, loadText, idleHtml) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = isLoading;
  if (isLoading) {
    btn._idleHtml = btn.innerHTML; // simpan HTML asli
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadText}`;
  } else {
    btn.innerHTML = idleHtml || btn._idleHtml || btn.innerHTML;
  }
}

// ===========================================================
//  PASSWORD STRENGTH METER (register.html)
// ===========================================================

/**
 * Kalkulasi dan tampilkan kekuatan password secara real-time.
 * Dipanggil via oninput pada input#reg-pw.
 * @param {string} val - nilai password saat ini
 */
function updatePwStrength(val) {
  const bar   = document.getElementById('pw-strength-bar');
  const label = document.getElementById('pw-strength-label');
  if (!bar || !label) return;

  let score = 0;
  if (val.length >= 8)           score++;
  if (val.length >= 12)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { w: '0%',   bg: 'transparent',     txt: '' },
    { w: '25%',  bg: 'var(--danger)',    txt: 'WEAK' },
    { w: '50%',  bg: 'var(--warn)',      txt: 'FAIR' },
    { w: '75%',  bg: 'var(--secondary)', txt: 'GOOD' },
    { w: '90%',  bg: 'var(--success)',   txt: 'STRONG' },
    { w: '100%', bg: 'var(--primary)',   txt: 'EXCELLENT' },
  ];
  const lvl = levels[Math.min(score, 5)];
  bar.style.width      = lvl.w;
  bar.style.background = lvl.bg;
  label.textContent    = lvl.txt ? `STRENGTH: ${lvl.txt}` : '';
  label.style.color    = lvl.bg;
}

// ===========================================================
//  DEMO SIMULATIONS (aktif hanya saat DEMO_MODE = true)
// ===========================================================
//
// Fungsi-fungsi ini mensimulasikan response dari Flask backend.
// Response structure-nya sengaja IDENTIK dengan format yang
// akan dikembalikan Flask agar saat DEMO_MODE = false,
// tidak ada perubahan lain di file ini.
//

/**
 * Simulasi POST /api/auth/login
 * Menyimpan token demo ke localStorage via TokenManager.
 * @param {string} email
 * @returns {Promise<{access_token: string, user: Object}>}
 */
function _simulateLogin(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeToken = btoa(`demo:${email}:${Date.now()}`);
      // Simpan token demo — alur identik dengan real JWT
      if (typeof TokenManager !== 'undefined') {
        TokenManager.save(fakeToken, null);
        SessionManager.save({
          id:         0,
          username:   email.split('@')[0],
          email:      email,
          is_demo:    true,
        });
      }
      resolve({
        access_token: fakeToken,
        refresh_token: null,
        user: { id: 0, username: email.split('@')[0], email },
      });
    }, 900);
  });
}

/**
 * Simulasi POST /api/auth/register
 * @param {string} username
 * @param {string} email
 * @returns {Promise<{message: string, user: Object}>}
 */
function _simulateRegister(username, email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Account created successfully.',
        user: { id: 0, username, email },
      });
    }, 900);
  });
}

/**
 * Simulasi POST /api/auth/forgot-password
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
function _simulateForgotPassword(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `Reset link sent to ${email}` });
    }, 1200);
  });
}

// ===========================================================
//  LOGIN
// ===========================================================

/**
 * Handler untuk tombol AUTHENTICATE di login.html.
 * Dipanggil via onclick="handleLogin()" di HTML.
 *
 * Alur:
 *   1. Validasi input
 *   2. Set loading state
 *   3. [MIGRATE → Phase 11] Ganti _simulateLogin() dengan:
 *        await VeloraSec.API.Auth.login(email, pw);
 *   4. Tampilkan sukses dan redirect
 *   5. Tangani error jika gagal
 */
async function handleLogin() {
  console.log("HANDLE LOGIN DIPANGGIL");

  const email = document.getElementById('login-email')?.value.trim();
  const pw    = document.getElementById('login-pw')?.value;

  console.log("Email:", email);

  if (!email || !pw) {
    showAuthMsg('login-msg', 'error', 'Email and password are required.');
    return;
  }

  console.log("DEMO_MODE =", VELORASEC_CONFIG?.DEMO_MODE);

  try {
    setLoadingState('login-btn', true, 'Authenticating...');
    showAuthMsg('login-msg', 'info', 'Authenticating...');
    
    if (typeof VELORASEC_CONFIG !== 'undefined' && !VELORASEC_CONFIG.DEMO_MODE) {
      await VeloraSec.API.Auth.login(email, pw);
    } else {
      await _simulateLogin(email);
    }

    showAuthMsg('login-msg', 'success', 'Login successful! Redirecting to dashboard...');
    setTimeout(() => {
        window.location.href = AUTH_REDIRECT.AFTER_LOGIN;
    }, 5000);

  } catch (err) {
    const msg = _resolveAuthError(err, {
      401: 'Email atau password salah.',
      429: 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.',
      default: 'Login gagal. Periksa koneksi dan coba lagi.',
    });
    showAuthMsg('login-msg', 'error', msg);
    setLoadingState('login-btn', false);
  }
}

// ===========================================================
//  REGISTER
// ===========================================================

/**
 * Handler untuk tombol CREATE ACCOUNT di register.html.
 * Dipanggil via onclick="handleRegister()" di HTML.
 *
 * Alur:
 *   1. Validasi semua field
 *   2. Set loading state
 *   3. [MIGRATE → Phase 11] Ganti _simulateRegister() dengan:
 *        await VeloraSec.API.Auth.register(username, email, pw);
 *   4. Tampilkan sukses dan redirect ke login.html
 *   5. Tangani error jika gagal
 */
async function handleRegister() {
  const username = document.getElementById('reg-username')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const pw       = document.getElementById('reg-pw')?.value;
  const pw2      = document.getElementById('reg-pw2')?.value;
  const tos      = document.getElementById('reg-tos')?.checked;

  // ── Validasi ──
  if (!username || !email || !pw || !pw2) {
    showAuthMsg('reg-msg', 'error', 'All fields are required.');
    return;
  }
  if (username.length < 3) {
    showAuthMsg('reg-msg', 'error', 'Username must be at least 3 characters.');
    return;
  }
  if (!email.includes('@')) {
    showAuthMsg('reg-msg', 'error', 'Enter a valid email address.');
    return;
  }
  if (pw.length < 8) {
    showAuthMsg('reg-msg', 'error', 'Password must be at least 8 characters.');
    return;
  }
  if (pw !== pw2) {
    showAuthMsg('reg-msg', 'error', 'Passwords do not match.');
    return;
  }
  if (!tos) {
    showAuthMsg('reg-msg', 'error', 'You must agree to the ethical use policy.');
    return;
  }

  setLoadingState('reg-btn', true, 'Creating account...');
  showAuthMsg('reg-msg', 'info', 'Creating your account...');

  try {
    if (typeof VELORASEC_CONFIG !== 'undefined' && !VELORASEC_CONFIG.DEMO_MODE) {
      // ── [MIGRATE → Phase 11] Real API ──────────────────────────────
      // await VeloraSec.API.Auth.register(username, email, pw);
      // ────────────────────────────────────────────────────────────────
      await VeloraSec.API.Auth.register(username, email, pw);
    } else {
      // ── DEMO MODE: simulasi ──
      await _simulateRegister(username, email);
    }

    showAuthMsg('reg-msg', 'success',
      `Welcome, <strong>${username}</strong>! Account created. Redirecting to login...`);
    setTimeout(() => { window.location.href = AUTH_REDIRECT.AFTER_REGISTER; }, 1400);

  } catch (err) {
    const msg = _resolveAuthError(err, {
      409: 'Email atau username sudah digunakan.',
      422: 'Data tidak valid. Periksa kembali inputmu.',
      default: 'Registrasi gagal. Periksa koneksi dan coba lagi.',
    });
    showAuthMsg('reg-msg', 'error', msg);
    setLoadingState('reg-btn', false);
  }
}

// ===========================================================
//  LOGOUT
// ===========================================================

/**
 * Handler logout — bersihkan token dan redirect ke login.
 * Dipanggil dari elemen manapun yang memiliki onclick="handleLogout()".
 * (Contoh: tombol logout di sidebar index.html)
 *
 * Alur:
 *   1. Panggil VeloraSec.API.Auth.logout() — opsional invalidate token di server
 *   2. Bersihkan token & session local
 *   3. Redirect ke login.html
 *
 * [MIGRATE → Phase 11]: logout() di api.js sudah menangani server call + clear lokal.
 */
function handleLogout() {
  if (typeof VeloraSec !== 'undefined') {
    VeloraSec.API.Auth.logout().finally(() => {
      window.location.href = AUTH_REDIRECT.AFTER_LOGOUT;
    });
  } else {
    // Fallback jika api.js belum dimuat (misal dipanggil dari konteks yang salah)
    if (typeof TokenManager !== 'undefined') TokenManager.clear();
    if (typeof SessionManager !== 'undefined') SessionManager.clear();
    window.location.href = AUTH_REDIRECT.AFTER_LOGOUT;
  }
}

// ===========================================================
//  FORGOT PASSWORD
// ===========================================================

/**
 * Handler untuk tombol SEND RESET LINK di forgot-password.html.
 * Dipanggil via onclick="handleForgotPassword()" di HTML.
 *
 * [MIGRATE → Phase 11]: Ganti _simulateForgotPassword() dengan
 *   await VeloraSec.API.Auth.forgotPassword(email);
 */
async function handleForgotPassword() {
  const email = document.getElementById('forgot-email')?.value.trim();

  if (!email) {
    showAuthMsg('forgot-msg', 'error', 'Please enter your email address.');
    return;
  }
  if (!email.includes('@')) {
    showAuthMsg('forgot-msg', 'error', 'Enter a valid email address.');
    return;
  }

  const btn = document.querySelector('#card-request .cyber-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  }

  try {
    if (typeof VELORASEC_CONFIG !== 'undefined' && !VELORASEC_CONFIG.DEMO_MODE) {
      // ── [MIGRATE → Phase 11] Real API ──────────────────────────────
      // await VeloraSec.API.Auth.forgotPassword(email);
      // ────────────────────────────────────────────────────────────────
      await VeloraSec.API.Auth.forgotPassword(email);
    } else {
      await _simulateForgotPassword(email);
    }

    const sub = document.getElementById('success-sub');
    if (sub) sub.textContent = `> Reset link sent to ${email}`;
    document.getElementById('card-request').style.display = 'none';
    document.getElementById('card-success').style.display = '';

  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND RESET LINK';
    }
    showAuthMsg('forgot-msg', 'error', 'Gagal mengirim email. Coba lagi dalam beberapa saat.');
  }
}

/**
 * Reset form forgot-password ke kondisi awal.
 * Dipanggil via onclick="resetToForm()" dari card-success.
 */
function resetToForm() {
  const btn = document.querySelector('#card-request .cyber-btn');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND RESET LINK';
  }
  const emailInput = document.getElementById('forgot-email');
  if (emailInput) emailInput.value = '';
  const msg = document.getElementById('forgot-msg');
  if (msg) msg.style.display = 'none';
  document.getElementById('card-success').style.display = 'none';
  document.getElementById('card-request').style.display = '';
}

// ===========================================================
//  ERROR RESOLVER
// ===========================================================

/**
 * Terjemahkan error (ApiError atau Error generik) ke pesan user-friendly.
 * @param {Error} err - error yang ditangkap dari catch block
 * @param {Object} statusMessages - map status code → pesan kustom
 * @returns {string} pesan error untuk ditampilkan ke user
 */
function _resolveAuthError(err, statusMessages = {}) {
  if (err && err.name === 'ApiError') {
    return statusMessages[err.status] || err.message || statusMessages.default || 'Terjadi kesalahan.';
  }
  // Network error, timeout, dll.
  if (err && err.message && err.message.toLowerCase().includes('fetch')) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internetmu.';
  }
  return statusMessages.default || 'Terjadi kesalahan. Coba lagi.';
}