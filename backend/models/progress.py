"""
models/progress.py — Model UserProgress
=========================================
Merepresentasikan tabel 'user_progress' di database MySQL.
Satu baris = progress satu modul untuk satu user.

Kolom:
    id           INT  PK AUTO_INCREMENT
    user_id      INT  FK → users.id (CASCADE DELETE)
    module_id    VARCHAR(50) — ID modul, misal: 'net-1', 'web-3'
    is_completed BOOLEAN DEFAULT FALSE
    completed_at DATETIME NULL — diset saat is_completed=True

Constraint:
    UNIQUE (user_id, module_id) — satu user hanya punya satu baris per modul
"""

from datetime import datetime, timezone
from extensions import db


class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    __table_args__ = (
        # Cegah duplikasi: satu user hanya punya satu baris per modul
        db.UniqueConstraint('user_id', 'module_id', name='uq_user_module'),
    )

    # ── Kolom ─────────────────────────────────────────────────────────────
    id           = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id      = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
    )
    module_id    = db.Column(db.String(50), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)

    # ── Serialization ─────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        return {
            'id':           self.id,
            'module_id':    self.module_id,
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }

    def __repr__(self) -> str:
        status = 'completed' if self.is_completed else 'incomplete'
        return f'<UserProgress user={self.user_id} module={self.module_id} [{status}]>'
