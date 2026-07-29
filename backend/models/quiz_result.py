"""
models/quiz_result.py — Model QuizResult
==========================================
Merepresentasikan tabel 'quiz_results' di database MySQL.
Satu baris = satu sesi quiz yang sudah diselesaikan user.
Multiple entries per user diperbolehkan (riwayat quiz lengkap).

Kolom:
    id       INT  PK AUTO_INCREMENT
    user_id  INT  FK → users.id (CASCADE DELETE)
    category VARCHAR(100) — nama kategori quiz ('Network', 'Web', dll.)
    score    SMALLINT — jumlah jawaban benar
    total    SMALLINT — jumlah total soal
    taken_at DATETIME — waktu quiz diselesaikan
"""

from datetime import datetime, timezone
from extensions import db


class QuizResult(db.Model):
    __tablename__ = 'quiz_results'

    # ── Kolom ─────────────────────────────────────────────────────────────
    id       = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id  = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
    )
    category = db.Column(db.String(100), nullable=False)
    score    = db.Column(db.SmallInteger, nullable=False)
    total    = db.Column(db.SmallInteger, nullable=False)
    taken_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ── Computed Property ─────────────────────────────────────────────────

    @property
    def score_pct(self) -> float:
        """Hitung persentase score (0.0 – 100.0)."""
        return round((self.score / self.total) * 100, 1) if self.total > 0 else 0.0

    # ── Serialization ─────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        return {
            'id':        self.id,
            'category':  self.category,
            'score':     self.score,
            'total':     self.total,
            'score_pct': self.score_pct,
            'taken_at':  self.taken_at.isoformat() if self.taken_at else None,
        }

    def __repr__(self) -> str:
        return f'<QuizResult user={self.user_id} {self.category} {self.score}/{self.total}>'
