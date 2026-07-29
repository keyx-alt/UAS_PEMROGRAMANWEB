"""
config.py — Konfigurasi Flask VeloraSec
========================================
Mendukung tiga environment: development, testing, production.
Semua nilai sensitif dibaca dari file .env via python-dotenv.

Cara pakai:
    from config import config_map
    app.config.from_object(config_map['development'])
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env dari direktori backend/ (tempat file ini berada)
load_dotenv()


class Config:
    """Base configuration — shared by all environments."""

    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-fallback-change-in-production')

    # ── Database ─────────────────────────────────────────────────────────
    _DB_HOST     = os.environ.get('DB_HOST',     'localhost')
    _DB_PORT     = os.environ.get('DB_PORT',     '3306')
    _DB_USER     = os.environ.get('DB_USER',     'root')
    _DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    _DB_NAME     = os.environ.get('DB_NAME',     'velorasec')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{_DB_USER}:{_DB_PASSWORD}"
        f"@{_DB_HOST}:{_DB_PORT}/{_DB_NAME}?charset=utf8mb4"
    )
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 1800,
        'pool_pre_ping': True,

        # Maksimal hanya 2 koneksi tetap
        'pool_size': 2,

        # Jangan membuat koneksi tambahan
        'max_overflow': 0,
    }

    # ── JWT ───────────────────────────────────────────────────────────────
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-fallback-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_MINUTES', 15))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES_DAYS', 30))
    )
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME    = 'Authorization'
    JWT_HEADER_TYPE    = 'Bearer'

    # ── CORS ──────────────────────────────────────────────────────────────
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            'CORS_ORIGINS',
            'http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000',
        ).split(',')
        if origin.strip()
    ]


class DevelopmentConfig(Config):
    """Development — debug aktif, error detail terlihat."""
    DEBUG = True
    # Set True untuk melihat semua query SQL di terminal (verbose)
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    """Testing — pakai SQLite in-memory agar tidak butuh MySQL."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI    = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES   = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES  = timedelta(hours=1)
    SQLALCHEMY_ENGINE_OPTIONS  = {}   # SQLite tidak butuh pool config


class ProductionConfig(Config):
    """Production — debug off, strict security."""
    DEBUG           = False
    SQLALCHEMY_ECHO = False


# ── Mapping nama → class config ────────────────────────────────────────────
config_map: dict[str, type[Config]] = {
    'development': DevelopmentConfig,
    'testing':     TestingConfig,
    'production':  ProductionConfig,
}
