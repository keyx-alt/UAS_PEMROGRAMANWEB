"""
routes/users.py — User Profile Routes
=======================================
Blueprint: users_bp | Prefix: /api/users

Endpoints (semua membutuhkan JWT):
    GET /api/users/me  → ambil profil user yang sedang login
    PUT /api/users/me  → update profil user (username, email, password)
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from services.user_service import update_user_profile

users_bp = Blueprint('users', __name__, url_prefix='/api/users')


# ── GET /api/users/me ─────────────────────────────────────────────────────

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """
    Ambil profil user yang sedang login.

    Header: Authorization: Bearer <access_token>

    Response 200:
        { "user": UserObject }
    """
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'NotFound', 'message': 'User tidak ditemukan.', 'status': 404}), 404

    return jsonify({'user': user.to_dict()}), 200


# ── PUT /api/users/me ─────────────────────────────────────────────────────

@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    """
    Update profil user yang sedang login.
    Bisa update satu atau lebih field sekaligus.

    Header: Authorization: Bearer <access_token>

    Request body (semua opsional, minimal satu harus ada):
        {
            "username": str,   // opsional
            "email":    str,   // opsional
            "password": str    // opsional
        }

    Response 200:
        { "message": str, "user": UserObject }

    Response 400:
        { "error": "ValidationError", "message": str, "status": 400 }
    """
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    user, error_msg = update_user_profile(user_id, data)
    if error_msg:
        return jsonify({'error': 'ValidationError', 'message': error_msg, 'status': 400}), 400

    return jsonify({
        'message': 'Profil berhasil diperbarui.',
        'user':    user.to_dict(),
    }), 200
