"""
routes/auth.py — Authentication Routes
=========================================
Blueprint: auth_bp | Prefix: /api/auth

Endpoints:
    POST /api/auth/register        → daftar user baru
    POST /api/auth/login           → login, return access + refresh token
    POST /api/auth/refresh         → perbarui access token dengan refresh token
    POST /api/auth/logout          → logout (stateless: instruksi hapus token lokal)
    POST /api/auth/forgot-password → placeholder (selalu return sukses)
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from extensions import db
from models.user import User
from services.auth_service import validate_register_data, validate_login_data

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


# ── POST /api/auth/register ───────────────────────────────────────────────

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Daftarkan user baru.

    Request body:
        { "username": str, "email": str, "password": str }

    Response 201:
        { "message": str, "user": UserObject }

    Response 400:
        { "error": "ValidationError", "message": str, "status": 400 }

    Response 409:
        { "error": "Conflict", "message": str, "status": 409 }
    """
    data = request.get_json(silent=True) or {}

    # Validasi input
    error_msg = validate_register_data(data)
    if error_msg:
        return jsonify({'error': 'ValidationError', 'message': error_msg, 'status': 400}), 400

    username = data['username'].strip()
    email    = data['email'].strip().lower()
    password = data['password']

    # Cek uniqueness email
    if User.query.filter_by(email=email).first():
        return jsonify({
            'error':   'Conflict',
            'message': 'Email sudah terdaftar. Gunakan email lain atau login.',
            'status':  409,
        }), 409

    # Cek uniqueness username
    if User.query.filter_by(username=username).first():
        return jsonify({
            'error':   'Conflict',
            'message': 'Username sudah digunakan. Coba username lain.',
            'status':  409,
        }), 409

    # Buat user baru
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'Registrasi berhasil. Silakan login.',
        'user':    user.to_dict(),
    }), 201


# ── POST /api/auth/login ──────────────────────────────────────────────────

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user.

    Request body:
        { "email": str, "password": str }

    Response 200:
        { "access_token": str, "refresh_token": str, "user": UserObject }

    Response 401:
        { "error": "Unauthorized", "message": str, "status": 401 }
    """
    data = request.get_json(silent=True) or {}

    error_msg = validate_login_data(data)
    if error_msg:
        return jsonify({'error': 'ValidationError', 'message': error_msg, 'status': 400}), 400

    email    = data['email'].strip().lower()
    password = data['password']

    user = User.query.filter_by(email=email).first()

    # Gunakan pesan yang sama untuk email salah dan password salah
    # (mencegah user enumeration attack)
    if not user or not user.check_password(password):
        return jsonify({
            'error':   'Unauthorized',
            'message': 'Email atau password salah.',
            'status':  401,
        }), 401

    if not user.is_active:
        return jsonify({
            'error':   'Forbidden',
            'message': 'Akun tidak aktif. Hubungi administrator.',
            'status':  403,
        }), 403

    # Generate tokens — identity menggunakan string(user.id)
    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'access_token':  access_token,
        'refresh_token': refresh_token,
        'user':          user.to_dict(),
    }), 200


# ── POST /api/auth/refresh ────────────────────────────────────────────────

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Perbarui access token menggunakan refresh token.
    Header: Authorization: Bearer <refresh_token>

    Response 200:
        { "access_token": str }
    """
    user_id      = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 200


# ── POST /api/auth/logout ─────────────────────────────────────────────────

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user.
    Implementasi stateless — instruksi ke client untuk menghapus token lokal.

    Untuk blacklist token (stateful logout), tambahkan JTI blocklist di Phase 9.

    Response 200:
        { "message": str }
    """
    return jsonify({
        'message': 'Logout berhasil. Hapus access_token dan refresh_token di sisi client.'
    }), 200


# ── POST /api/auth/forgot-password ────────────────────────────────────────

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Kirim instruksi reset password ke email.
    PLACEHOLDER: selalu return sukses tanpa kirim email sungguhan.
    Implementasi email nyata akan ditambahkan di fase berikutnya.

    Request body:
        { "email": str }

    Response 200:
        { "message": str }

    Selalu return 200 meski email tidak terdaftar
    (mencegah user enumeration attack).
    """
    data  = request.get_json(silent=True) or {}
    email = data.get('email', '').strip()

    if not email:
        return jsonify({
            'error':   'ValidationError',
            'message': 'Email wajib diisi.',
            'status':  400,
        }), 400

    # TODO (Phase berikutnya): Generate reset token, simpan ke DB,
    # kirim email dengan link reset via Flask-Mail atau SendGrid.

    # Selalu return sukses (jangan bocorkan apakah email terdaftar atau tidak)
    return jsonify({
        'message': (
            'Jika email tersebut terdaftar, '
            'instruksi reset password telah dikirim ke inbox kamu. '
            'Cek juga folder spam/junk.'
        )
    }), 200
