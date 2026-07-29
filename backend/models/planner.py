"""
models/planner.py — Model PlannerTask
=======================================
Merepresentasikan tabel 'planner_tasks' di database MySQL.
Satu baris = status satu task dalam 30-Day Study Planner untuk satu user.

Format task_key: 'wXdY' — week X, day Y (misal: w0d0, w1d3, w3d6)

Kolom:
    id         INT  PK AUTO_INCREMENT
    user_id    INT  FK → users.id (CASCADE DELETE)
    task_key   VARCHAR(20) — format: w0d0, w1d3, dst.
    is_done    BOOLEAN DEFAULT FALSE
    updated_at DATETIME (auto-update saat is_done diubah)

Constraint:
    UNIQUE (user_id, task_key) — satu user hanya punya satu row per task
"""

from datetime import datetime, timezone
from extensions import db


class PlannerTask(db.Model):
    __tablename__ = 'planner_tasks'
    __table_args__ = (
        # Cegah duplikasi: satu user hanya punya satu baris per task_key
        db.UniqueConstraint('user_id', 'task_key', name='uq_user_task'),
    )

    # ── Kolom ─────────────────────────────────────────────────────────────
    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id    = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
    )
    task_key   = db.Column(db.String(20), nullable=False)
    is_done    = db.Column(db.Boolean, default=False, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ── Serialization ─────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        return {
            'id':         self.id,
            'task_key':   self.task_key,
            'is_done':    self.is_done,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f'<PlannerTask user={self.user_id} key={self.task_key} done={self.is_done}>'
