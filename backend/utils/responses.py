"""
utils/responses.py — Response Helpers
=======================================
Helper functions untuk membuat response JSON yang konsisten di semua endpoint.

Contoh penggunaan:
    from utils.responses import success, error

    return success({'user': user.to_dict()}, message='Profil berhasil diperbarui.')
    return error('Email sudah terdaftar.', status=409)
"""

from flask import jsonify


# Map HTTP status → nama error standar
_HTTP_ERROR_NAMES = {
    400: 'BadRequest',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'NotFound',
    405: 'MethodNotAllowed',
    409: 'Conflict',
    422: 'UnprocessableEntity',
    429: 'TooManyRequests',
    500: 'InternalServerError',
    501: 'NotImplemented',
}


def success(data: dict | list | None = None, message: str | None = None, status: int = 200):
    """
    Build success response.

    Args:
        data:    dict atau list untuk dimasukkan ke response body.
                 Jika dict → field-nya di-merge ke response root.
                 Jika list atau tipe lain → dimasukkan ke key 'data'.
        message: pesan sukses opsional.
        status:  HTTP status code (default 200).

    Returns:
        Tuple (Response, status_code)

    Contoh:
        return success({'user': user.to_dict()}, 'Profil diperbarui')
        # → {"user": {...}, "message": "Profil diperbarui"}, 200
    """
    body = {}
    if message:
        body['message'] = message
    if data is not None:
        if isinstance(data, dict):
            body.update(data)
        else:
            body['data'] = data
    return jsonify(body), status


def error(message: str, status: int = 400, error_key: str | None = None):
    """
    Build error response.

    Args:
        message:   pesan error yang akan ditampilkan ke user.
        status:    HTTP status code.
        error_key: override nama error (default: dari _HTTP_ERROR_NAMES).

    Returns:
        Tuple (Response, status_code)

    Contoh:
        return error('Email sudah terdaftar.', 409)
        # → {"error": "Conflict", "message": "Email sudah terdaftar.", "status": 409}, 409
    """
    body = {
        'error':   error_key or _HTTP_ERROR_NAMES.get(status, 'Error'),
        'message': message,
        'status':  status,
    }
    return jsonify(body), status
