"""
utils/decorators.py — Custom Route Decorators
==============================================
Custom decorators untuk route protection di luar @jwt_required() standar.

Contoh penggunaan:
    from utils.decorators import admin_required

    @app.route('/admin/stats')
    @admin_required()
    def admin_stats():
        ...
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user import User


def admin_required():
    """
    Decorator untuk endpoint yang hanya boleh diakses oleh admin.
    Menggabungkan JWT verification + admin role check dalam satu decorator.

    Penggunaan:
        @blueprint.route('/admin/something')
        @admin_required()
        def admin_only_endpoint():
            ...

    Response jika bukan admin:
        { "error": "Forbidden", "message": "...", "status": 403 }
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Verifikasi JWT terlebih dahulu
            verify_jwt_in_request()

            # Cek apakah user adalah admin
            user_id = int(get_jwt_identity())
            user    = User.query.get(user_id)

            if not user:
                return jsonify({
                    'error':   'Unauthorized',
                    'message': 'User tidak ditemukan.',
                    'status':  401,
                }), 401

            if not user.is_admin:
                return jsonify({
                    'error':   'Forbidden',
                    'message': 'Endpoint ini hanya dapat diakses oleh administrator.',
                    'status':  403,
                }), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper
