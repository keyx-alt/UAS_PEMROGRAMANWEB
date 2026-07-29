"""
app.py — Flask Application Factory
=====================================
VeloraSec Backend API v1.0

Cara menjalankan (dari folder backend/):
    flask run
    flask run --debug
    flask --app app run --debug

Cara dengan environment tertentu:
    set FLASK_ENV=production
    flask run
"""

import os
from flask import Flask, jsonify
from dotenv import load_dotenv

# Load .env dari folder backend/ (current working directory saat flask run)
load_dotenv()


def create_app(config_name: str | None = None) -> Flask:
    """
    Application factory — membuat dan mengkonfigurasi Flask app.

    Args:
        config_name: 'development' | 'testing' | 'production'.
                     Jika None, baca dari env var FLASK_ENV (default: development).

    Returns:
        Flask app instance yang sudah fully configured.
    """
    app = Flask(__name__, static_folder="../frontend", static_url_path="")

    # ── Load Configuration ────────────────────────────────────────────────
    from config import config_map
    env = config_name or os.environ.get('FLASK_ENV', 'development')
    cfg = config_map.get(env, config_map['development'])
    app.config.from_object(cfg)

    # ── Initialize Extensions ─────────────────────────────────────────────
    from extensions import db, migrate, jwt, bcrypt, cors
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(
        app,
        resources={r'/api/*': {'origins': app.config['CORS_ORIGINS']}},
        supports_credentials=True,
    )

    # ── Import Models ─────────────────────────────────────────────────────
    # WAJIB: import semua model di dalam app context agar Flask-Migrate
    # bisa mendeteksi tabel saat 'flask db migrate' dijalankan.
    with app.app_context():
        from models import user, progress, quiz_result, planner  # noqa: F401

    # ── Register Blueprints ───────────────────────────────────────────────
    from routes import register_blueprints
    register_blueprints(app)

    # ── JWT Error Callbacks ───────────────────────────────────────────────
    _register_jwt_callbacks(jwt)

    # ── Global HTTP Error Handlers ────────────────────────────────────────
    _register_error_handlers(app)

    # ── Health Check ──────────────────────────────────────────────────────
    @app.route('/api/health')
    def health():
        """Quick health check — verifikasi server berjalan."""
        return jsonify({
            'status':  'ok',
            'version': '1.0.0',
            'env':     env,
        }), 200

    # ── Static File Routes (Render Deployment) ────────────────────────────
    @app.route("/")
    def index():
        return app.send_static_file("pages/index.html")

    @app.route("/<path:path>")
    def static_proxy(path):
        # Fallback agar semua asset (css, js, images) bisa diakses dari root url
        return app.send_static_file(path)

    return app


# ── JWT Callbacks ─────────────────────────────────────────────────────────

def _register_jwt_callbacks(jwt_manager) -> None:
    """Daftarkan callback untuk semua kondisi error JWT."""

    @jwt_manager.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error':   'TokenExpired',
            'message': 'Access token sudah kadaluarsa. Gunakan refresh token untuk memperbarui.',
            'status':  401,
        }), 401

    @jwt_manager.invalid_token_loader
    def invalid_token_callback(error_string):
        return jsonify({
            'error':   'InvalidToken',
            'message': f'Token tidak valid: {error_string}',
            'status':  401,
        }), 401

    @jwt_manager.unauthorized_loader
    def missing_token_callback(error_string):
        return jsonify({
            'error':   'Unauthorized',
            'message': 'Authorization header tidak ditemukan atau formatnya salah (harus: Bearer <token>).',
            'status':  401,
        }), 401

    @jwt_manager.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error':   'TokenRevoked',
            'message': 'Token sudah tidak berlaku. Silakan login ulang.',
            'status':  401,
        }), 401

    @jwt_manager.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({
            'error':   'FreshTokenRequired',
            'message': 'Operasi ini membutuhkan fresh token. Silakan login ulang.',
            'status':  401,
        }), 401


# ── Global Error Handlers ─────────────────────────────────────────────────

def _register_error_handlers(app: Flask) -> None:
    """Daftarkan global HTTP error handlers dengan format JSON yang konsisten."""

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'BadRequest', 'message': str(e.description), 'status': 400}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized', 'message': str(e.description), 'status': 401}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'error': 'Forbidden', 'message': str(e.description), 'status': 403}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'NotFound', 'message': 'Endpoint tidak ditemukan.', 'status': 404}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({'error': 'MethodNotAllowed', 'message': str(e.description), 'status': 405}), 405

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({'error': 'UnprocessableEntity', 'message': str(e.description), 'status': 422}), 422

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            'error':   'InternalServerError',
            'message': 'Terjadi kesalahan internal server. Cek log untuk detail.',
            'status':  500,
        }), 500
