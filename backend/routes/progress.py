"""
routes/progress.py — Module Progress Routes
=============================================
Blueprint: progress_bp | Prefix: /api/progress

Endpoints (semua membutuhkan JWT):
    GET    /api/progress  → ambil semua progress modul user
    POST   /api/progress  → upsert progress satu modul
    DELETE /api/progress  → reset semua progress user
"""

from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.progress import UserProgress

progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')


# ── GET /api/progress ────────────────────────────────────────────────────

@progress_bp.route('/', methods=['GET'])
@jwt_required()
def get_progress():
    """
    Ambil semua progress modul user yang sedang login.

    Response 200:
        {
            "progress": [
                { "id": int, "module_id": str, "is_completed": bool, "completed_at": str|null },
                ...
            ]
        }
    """
    user_id  = int(get_jwt_identity())
    progress = UserProgress.query.filter_by(user_id=user_id).all()

    return jsonify({'progress': [p.to_dict() for p in progress]}), 200


# ── POST /api/progress ───────────────────────────────────────────────────

@progress_bp.route('/', methods=['POST'])
@jwt_required()
def update_progress():
    """
    Upsert progress satu modul.
    Jika module_id belum ada → INSERT baru.
    Jika module_id sudah ada → UPDATE status.

    Request body:
        { "module_id": str, "is_completed": bool }

    Response 200:
        { "message": str, "progress": ProgressObject }
    """
    user_id  = int(get_jwt_identity())
    data     = request.get_json(silent=True) or {}

    module_id    = data.get('module_id', '')
    is_completed = data.get('is_completed')

    # Validasi
    if not module_id or not isinstance(module_id, str) or not module_id.strip():
        return jsonify({
            'error':   'ValidationError',
            'message': 'module_id wajib diisi dan harus berupa string.',
            'status':  400,
        }), 400

    if is_completed is None or not isinstance(is_completed, bool):
        return jsonify({
            'error':   'ValidationError',
            'message': 'is_completed wajib diisi dan harus boolean (true atau false).',
            'status':  400,
        }), 400

    module_id = module_id.strip()

    # Upsert: cari existing, buat baru jika tidak ada
    progress = UserProgress.query.filter_by(
        user_id=user_id,
        module_id=module_id,
    ).first()

    if progress is None:
        progress = UserProgress(user_id=user_id, module_id=module_id)
        db.session.add(progress)

    progress.is_completed = is_completed
    progress.completed_at = datetime.now(timezone.utc) if is_completed else None
    db.session.commit()

    return jsonify({
        'message':  'Progress berhasil diperbarui.',
        'progress': progress.to_dict(),
    }), 200


# ── DELETE /api/progress ─────────────────────────────────────────────────

@progress_bp.route('/', methods=['DELETE'])
@jwt_required()
def reset_progress():
    """
    Reset semua progress modul user (hapus semua baris user ini dari tabel).

    Response 200:
        { "message": str }
    """
    user_id = int(get_jwt_identity())
    deleted = UserProgress.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({
        'message': f'Semua progress berhasil direset. {deleted} modul dihapus.'
    }), 200
