"""
routes/planner.py — Study Planner Routes
==========================================
Blueprint: planner_bp | Prefix: /api/planner

Endpoints (semua membutuhkan JWT):
    GET    /api/planner              → semua task planner user
    POST   /api/planner/<task_key>   → toggle status task (done ↔ not done)
    DELETE /api/planner              → reset semua task planner user
"""

import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.planner import PlannerTask

planner_bp = Blueprint('planner', __name__, url_prefix='/api/planner')

# Format task_key yang valid: w{angka}d{angka} — misal: w0d0, w1d3, w3d6
_TASK_KEY_PATTERN = re.compile(r'^w\d+d\d+$')


# ── GET /api/planner ──────────────────────────────────────────────────────

@planner_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    """
    Ambil semua task planner user yang sedang login.

    Response 200:
        {
            "tasks": [
                { "id": int, "task_key": str, "is_done": bool, "updated_at": str },
                ...
            ]
        }
    """
    user_id = int(get_jwt_identity())
    tasks   = PlannerTask.query.filter_by(user_id=user_id).all()

    return jsonify({'tasks': [t.to_dict() for t in tasks]}), 200


# ── POST /api/planner/<task_key> ──────────────────────────────────────────

@planner_bp.route('/<string:task_key>', methods=['POST'])
@jwt_required()
def toggle_task(task_key: str):
    """
    Toggle status task (done ↔ not done).
    Jika task belum ada di DB → buat baru dengan is_done=True.
    Jika task sudah ada → balik nilai is_done.

    URL param:
        task_key: format w{n}d{n}, contoh: w0d0, w1d3

    Response 200:
        { "message": str, "task": PlannerTaskObject }

    Response 400:
        { "error": "ValidationError", "message": str, "status": 400 }
    """
    user_id = int(get_jwt_identity())

    # Validasi format task_key
    if not _TASK_KEY_PATTERN.match(task_key):
        return jsonify({
            'error':   'ValidationError',
            'message': f'Format task_key tidak valid: "{task_key}". Contoh yang benar: w0d0, w1d3, w3d6.',
            'status':  400,
        }), 400

    task = PlannerTask.query.filter_by(user_id=user_id, task_key=task_key).first()

    if task is None:
        # Task belum ada — buat baru dengan is_done=True (toggle dari default False)
        task = PlannerTask(user_id=user_id, task_key=task_key, is_done=True)
        db.session.add(task)
        action = 'ditandai selesai'
    else:
        # Task ada — balik statusnya
        task.is_done = not task.is_done
        action = 'ditandai selesai' if task.is_done else 'ditandai belum selesai'

    db.session.commit()

    return jsonify({
        'message': f'Task {task_key} berhasil {action}.',
        'task':    task.to_dict(),
    }), 200


# ── DELETE /api/planner ───────────────────────────────────────────────────

@planner_bp.route('/', methods=['DELETE'])
@jwt_required()
def reset_tasks():
    """
    Reset semua task planner user (hapus semua baris user dari tabel).

    Response 200:
        { "message": str }
    """
    user_id = int(get_jwt_identity())
    deleted = PlannerTask.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({
        'message': f'Semua task planner berhasil direset. {deleted} task dihapus.'
    }), 200
