"""
routes/dashboard.py — Dashboard Summary Route
==============================================
Blueprint: dashboard_bp | Prefix: /api/dashboard

Endpoints (membutuhkan JWT):
    GET /api/dashboard/summary → aggregated data: progress, XP, activity, quiz stats

Response ini digunakan oleh frontend VeloraSec.API.Dashboard.getSummary()
yang dipanggil dari buildDashboard() di script.js (saat DEMO_MODE = false).
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.progress import UserProgress
from models.quiz_result import QuizResult
from models.planner import PlannerTask

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

TOTAL_TASKS = 30


# ── GET /api/dashboard/summary ────────────────────────────────────────────

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    """
    Aggregated dashboard data untuk user yang sedang login.
    """
    user_id = int(get_jwt_identity())

    # ── Progress Stats dari PlannerTask ───────────────────────────────────
    completed_tasks = PlannerTask.query.filter_by(
        user_id=user_id,
        is_done=True
    ).count()

    completion_pct = round((completed_tasks / TOTAL_TASKS) * 100, 1) if TOTAL_TASKS > 0 else 0.0
    total_xp       = completed_tasks * 10   # 10 XP per task selesai

    # ── Recent Activity (5 task terakhir diselesaikan) ────────────────────
    recent_completed = (
        PlannerTask.query
        .filter_by(user_id=user_id, is_done=True)
        .order_by(PlannerTask.updated_at.desc())
        .limit(5)
        .all()
    )
    
    recent_activity = [
        {
            'type':      'planner',
            'task_key':  p.task_key,
            'timestamp': p.updated_at.isoformat() if p.updated_at else None,
        }
        for p in recent_completed
    ]

    # ── Quiz Stats ────────────────────────────────────────────────────────
    all_quiz       = QuizResult.query.filter_by(user_id=user_id).all()
    total_attempts = len(all_quiz)
    avg_score_pct  = 0.0
    best_category  = None

    if all_quiz:
        # Hitung rata-rata score keseluruhan
        pct_list = [
            (r.score / r.total * 100)
            for r in all_quiz
            if r.total > 0
        ]
        avg_score_pct = round(sum(pct_list) / len(pct_list), 1) if pct_list else 0.0

        # Cari kategori dengan rata-rata score tertinggi
        cat_scores: dict[str, list[float]] = {}
        for r in all_quiz:
            if r.total > 0:
                cat_scores.setdefault(r.category, []).append(r.score / r.total * 100)

        if cat_scores:
            best_category = max(
                cat_scores,
                key=lambda c: sum(cat_scores[c]) / len(cat_scores[c]),
            )

    return jsonify({
        'completed_tasks': completed_tasks,
        'total_tasks':     TOTAL_TASKS,
        'completion_pct':  completion_pct,
        'streak_days':     0,            # TODO: implementasi streak logic
        'total_xp':        total_xp,
        'recent_activity': recent_activity,
        'quiz_stats': {
            'total_attempts': total_attempts,
            'avg_score_pct':  avg_score_pct,
            'best_category':  best_category,
        },
    }), 200
