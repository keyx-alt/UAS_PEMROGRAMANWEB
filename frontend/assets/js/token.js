/**
 * token.js — VeloraSec Token & Session Manager
 * ============================================================
 * Mengelola JWT access token, refresh token, dan data sesi user
 * di localStorage.
 *
 * Digunakan oleh: api.js, auth.js
 * Depends on:     config.js (VELORASEC_CONFIG)
 *
 * PENTING: Semua akses ke token & user session HARUS melewati
 * TokenManager dan SessionManager — jangan baca localStorage
 * secara langsung di file lain.
 * ============================================================
 */

'use strict';

// ===========================================================
//  TOKEN MANAGER — mengelola JWT access & refresh token
// ===========================================================

const TokenManager = (() => {

  /**
   * Mendapatkan access token dari localStorage.
   * @returns {string|null}
   */
  function get() {
    return localStorage.getItem(VELORASEC_CONFIG.TOKEN_KEY);
  }

  /**
   * Mendapatkan refresh token dari localStorage.
   * @returns {string|null}
   */
  function getRefresh() {
    return localStorage.getItem(VELORASEC_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Menyimpan access token (dan opsional refresh token) ke localStorage.
   * @param {string} accessToken
   * @param {string} [refreshToken]
   */
  function save(accessToken, refreshToken) {
    if (!accessToken) return;
    localStorage.setItem(VELORASEC_CONFIG.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(VELORASEC_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Menghapus semua token dari localStorage (logout).
   */
  function clear() {
    localStorage.removeItem(VELORASEC_CONFIG.TOKEN_KEY);
    localStorage.removeItem(VELORASEC_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Memeriksa apakah user saat ini memiliki access token valid.
   * Catatan: ini hanya memeriksa keberadaan token, bukan validitasnya
   * di server. Validasi nyata terjadi saat request ke API.
   * @returns {boolean}
   */
  function isLoggedIn() {
    return !!get();
  }

  /**
   * Memeriksa apakah access token sudah kadaluarsa berdasarkan payload JWT.
   * Tidak memverifikasi signature — verifikasi dilakukan oleh server.
   * @returns {boolean}
   */
  function isExpired() {
    const token = get();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const nowSec = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp < nowSec : false;
    } catch {
      return true; // jika token tidak bisa di-decode, anggap expired
    }
  }

  /**
   * Mendapatkan user ID dari payload JWT tanpa request ke server.
   * @returns {number|null}
   */
  function getUserIdFromToken() {
    const token = get();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.user_id || null;
    } catch {
      return null;
    }
  }

  return Object.freeze({ get, getRefresh, save, clear, isLoggedIn, isExpired, getUserIdFromToken });

})();


// ===========================================================
//  SESSION MANAGER — mengelola data user yang sedang login
// ===========================================================

const SessionManager = (() => {

  /**
   * Menyimpan data user ke localStorage setelah login sukses.
   * @param {{ id: number, username: string, email: string }} user
   */
  function save(user) {
    if (!user) return;
    try {
      localStorage.setItem(VELORASEC_CONFIG.USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[SessionManager] Gagal menyimpan data user:', e);
    }
  }

  /**
   * Mengambil data user dari localStorage.
   * @returns {{ id: number, username: string, email: string }|null}
   */
  function get() {
    try {
      const raw = localStorage.getItem(VELORASEC_CONFIG.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Menghapus data user dari localStorage.
   */
  function clear() {
    localStorage.removeItem(VELORASEC_CONFIG.USER_KEY);
  }

  /**
   * Menghapus semua data sesi — token + user (full logout).
   */
  function clearAll() {
    TokenManager.clear();
    clear();
  }

  return Object.freeze({ save, get, clear, clearAll });

})();
