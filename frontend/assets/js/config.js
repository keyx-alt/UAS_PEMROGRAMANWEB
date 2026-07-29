/**
 * config.js — VeloraSec Frontend Configuration
 * ============================================================
 * File ini adalah satu-satunya tempat untuk mengubah konfigurasi
 * koneksi frontend ↔ backend Flask.
 *
 * CARA MIGRASI KE LIVE BACKEND:
 *   1. Ganti API_BASE_URL ke URL server Flask kamu
 *   2. Set DEMO_MODE = false
 *   3. Pastikan backend sudah berjalan dan endpoint tersedia
 *
 * JANGAN hardcode URL atau key di file lain.
 * Selalu baca dari VELORASEC_CONFIG.
 * ============================================================
 */

'use strict';

const VELORASEC_CONFIG = Object.freeze({

  // ----------------------------------------------------------
  // API Flask Backend
  // ----------------------------------------------------------
  // Development : 'http://localhost:5000'
  // Staging     : 'https://staging-api.velorasec.io'
  // Production  : window.location.origin
  API_BASE_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
      ? "http://localhost:5000" 
      : window.location.origin,

  // ----------------------------------------------------------
  // Demo Mode
  // ----------------------------------------------------------
  // true  → semua data hardcoded di script.js (state saat ini)
  // false → semua data berasal dari API Flask (setelah Phase 11)
  //
  // Ubah ke false HANYA setelah backend live dan semua endpoint
  // di api.js sudah diimplementasikan.
  DEMO_MODE: false,

  // ----------------------------------------------------------
  // Versi Aplikasi
  // ----------------------------------------------------------
  APP_VERSION: '4.1.0',

  // ----------------------------------------------------------
  // localStorage Keys
  // ----------------------------------------------------------
  // Gunakan keys ini secara konsisten — jangan buat keys baru
  // di file lain tanpa mendaftarkannya di sini.
  TOKEN_KEY:         'vs_access_token',
  REFRESH_TOKEN_KEY: 'vs_refresh_token',
  USER_KEY:          'vs_user',
  PLANNER_KEY:       'cyb-planner',   // key lama — tetap dipakai untuk kompatibilitas
  XP_KEY:            'cyb-xp',        // key lama — tetap dipakai untuk kompatibilitas

  // ----------------------------------------------------------
  // Request Settings
  // ----------------------------------------------------------
  REQUEST_TIMEOUT_MS: 10000,          // 10 detik
  MAX_RETRY_ATTEMPTS: 2,

  // ----------------------------------------------------------
  // Feature Flags (untuk kontrol fitur per-environment)
  // ----------------------------------------------------------
  FEATURES: Object.freeze({
    QUIZ_ENABLED:    true,
    PLANNER_ENABLED: true,
    XP_ENABLED:      true,
    AUTH_REQUIRED:   true,            // backend auth sudah live
  }),

});
