"""
extensions.py — Flask Extensions
==================================
Semua Flask extension di-instantiate di sini (tanpa app object)
untuk menghindari circular import.

Pattern ini disebut "Application Factory Pattern":
- Extension dibuat tanpa app → belum terikat ke app manapun
- Extension di-init dengan app via .init_app(app) di dalam create_app()

Cara import di file lain:
    from extensions import db, jwt, bcrypt
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Database ORM
db = SQLAlchemy()

# Database migration manager
migrate = Migrate()

# JWT authentication manager
jwt = JWTManager()

# Password hashing
bcrypt = Bcrypt()

# Cross-Origin Resource Sharing
cors = CORS()
