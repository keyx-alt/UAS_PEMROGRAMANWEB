"""
routes/quiz.py — Quiz Results Routes
=======================================
Blueprint: quiz_bp | Prefix: /api/quiz

Endpoints (semua membutuhkan JWT):
    GET  /api/quiz/results              → riwayat hasil quiz user (opsional: ?category=)
    POST /api/quiz/results              → simpan hasil quiz baru
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.quiz_result import QuizResult

quiz_bp = Blueprint('quiz', __name__, url_prefix='/api/quiz')


# ── GET /api/quiz/results ─────────────────────────────────────────────────

@quiz_bp.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    """
    Ambil riwayat hasil quiz user.
    Bisa difilter per kategori via query parameter.

    Query params:
        category (opsional): filter berdasarkan kategori quiz

    Response 200:
        {
            "results": [
                {
                    "id": int,
                    "category": str,
                    "score": int,
                    "total": int,
                    "score_pct": float,
                    "taken_at": str
                },
                ...
            ]
        }
    """
    user_id  = int(get_jwt_identity())
    category = request.args.get('category', '').strip()

    query = QuizResult.query.filter_by(user_id=user_id)

    if category:
        query = query.filter_by(category=category)

    results = query.order_by(QuizResult.taken_at.desc()).all()

    return jsonify({'results': [r.to_dict() for r in results]}), 200


# ── POST /api/quiz/results ────────────────────────────────────────────────

@quiz_bp.route('/results', methods=['POST'])
@jwt_required()
def save_result():
    """
    Simpan hasil quiz yang baru diselesaikan.

    Request body:
        { "category": str, "score": int, "total": int }

    Response 201:
        { "message": str, "result": QuizResultObject }

    Response 400:
        { "error": "ValidationError", "message": str, "status": 400 }
    """
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    category = data.get('category', '')
    score    = data.get('score')
    total    = data.get('total')

    # Validasi category
    if not category or not isinstance(category, str) or not category.strip():
        return jsonify({
            'error':   'ValidationError',
            'message': 'category wajib diisi dan harus berupa string.',
            'status':  400,
        }), 400

    # Validasi score
    if score is None or not isinstance(score, int) or score < 0:
        return jsonify({
            'error':   'ValidationError',
            'message': 'score wajib diisi, harus integer, dan tidak boleh negatif.',
            'status':  400,
        }), 400

    # Validasi total
    if total is None or not isinstance(total, int) or total <= 0:
        return jsonify({
            'error':   'ValidationError',
            'message': 'total wajib diisi, harus integer positif.',
            'status':  400,
        }), 400

    # Score tidak boleh melebihi total
    if score > total:
        return jsonify({
            'error':   'ValidationError',
            'message': f'score ({score}) tidak boleh melebihi total ({total}).',
            'status':  400,
        }), 400

    result = QuizResult(
        user_id  = user_id,
        category = category.strip(),
        score    = score,
        total    = total,
    )
    db.session.add(result)
    db.session.commit()

    return jsonify({
        'message': 'Hasil quiz berhasil disimpan.',
        'result':  result.to_dict(),
    }), 201
