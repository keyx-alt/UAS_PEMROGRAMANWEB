"""
models/user.py — Model User
=============================
Merepresentasikan tabel 'users' di database MySQL.

Kolom:
    id            INT  PK AUTO_INCREMENT
    username      VARCHAR(50) UNIQUE NOT NULL
    email         VARCHAR(255) UNIQUE NOT NULL
    password_hash VARCHAR(255) NOT NULL
    is_active     BOOLEAN DEFAULT TRUE
    is_admin      BOOLEAN DEFAULT FALSE
    created_at    DATETIME
    updated_at    DATETIME (auto-update)

Relasi:
    one-to-many dengan UserProgress, QuizResult, PlannerTask
    (CASCADE delete: hapus user → hapus semua datanya)
"""

from datetime import datetime, timezone
from extensions import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'

    # ── Kolom ─────────────────────────────────────────────────────────────
    id            = db.Column(db.Integer,     primary_key=True, autoincrement=True)
    username      = db.Column(db.String(50),  unique=True, nullable=False, index=True)
    email         = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active     = db.Column(db.Boolean, default=True,  nullable=False)
    is_admin      = db.Column(db.Boolean, default=False, nullable=False)
    created_at    = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at    = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ── Relasi ────────────────────────────────────────────────────────────
    # lazy=True: data relasi diload hanya saat diakses (efficient)
    # cascade='all, delete-orphan': hapus user → hapus semua data terkait
    progress      = db.relationship(
        'UserProgress', backref='user', lazy=True, cascade='all, delete-orphan'
    )
    quiz_results  = db.relationship(
        'QuizResult',   backref='user', lazy=True, cascade='all, delete-orphan'
    )
    planner_tasks = db.relationship(
        'PlannerTask',  backref='user', lazy=True, cascade='all, delete-orphan'
    )

    # ── Password Methods ──────────────────────────────────────────────────

    def set_password(self, password: str) -> None:
        """Hash password dengan bcrypt dan simpan ke password_hash."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Verifikasi plaintext password terhadap hash yang tersimpan."""
        return bcrypt.check_password_hash(self.password_hash, password)

    # ── Serialization ─────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        """
        Konversi User ke dictionary yang aman untuk JSON response.
        TIDAK menyertakan password_hash.
        """
        return {
            'id':         self.id,
            'username':   self.username,
            'email':      self.email,
            'is_active':  self.is_active,
            'is_admin':   self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f'<User #{self.id} {self.username} ({self.email})>'
