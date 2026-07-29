"""
routes/__init__.py — Blueprint Registration
=============================================
Daftarkan semua Blueprint ke Flask app.
Dipanggil dari create_app() di app.py.
"""


def register_blueprints(app) -> None:
    """Import dan register semua route blueprints ke Flask app."""

    from routes.auth      import auth_bp
    from routes.users     import users_bp
    from routes.progress  import progress_bp
    from routes.quiz      import quiz_bp
    from routes.planner   import planner_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(quiz_bp)
    app.register_blueprint(planner_bp)
    app.register_blueprint(dashboard_bp)
