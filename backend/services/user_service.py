"""
services/user_service.py — User Profile Business Logic
=======================================================
Logic update profil user yang dipisah dari route handler.
Dipanggil dari routes/users.py.
"""

import re
from extensions import db
from models.user import User

_EMAIL_PATTERN    = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
_USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_.\-]+$')


def update_user_profile(user_id: int, data: dict) -> tuple:
    """
    Update satu atau lebih field profil user.

    Args:
        user_id: ID user yang akan diupdate.
        data:    dict dengan field yang diupdate (username, email, password).
                 Tidak semua field harus ada — hanya field yang ada yang diupdate.

    Returns:
        (User, None)       jika berhasil.
        (None, str_error)  jika gagal — str_error adalah pesan error untuk user.

    Contoh:
        user, err = update_user_profile(3, {'username': 'newname'})
        if err:
            return jsonify({'error': err}), 400
    """
    user = User.query.get(user_id)
    if not user:
        return None, 'User tidak ditemukan.'

    allowed_keys = {'username', 'email', 'password'}
    provided     = {k for k in data if k in allowed_keys}

    if not provided:
        return None, 'Tidak ada field yang bisa diupdate. Field yang diizinkan: username, email, password.'

    # ── Update Username ───────────────────────────────────────────────────
    if 'username' in provided:
        username = data['username']
        if not isinstance(username, str):
            return None, 'Username harus berupa teks.'
        username = username.strip()
        if not username:
            return None, 'Username tidak boleh kosong.'
        if len(username) < 3:
            return None, 'Username minimal 3 karakter.'
        if len(username) > 50:
            return None, 'Username maksimal 50 karakter.'
        if not _USERNAME_PATTERN.match(username):
            return None, 'Username hanya boleh mengandung huruf, angka, underscore (_), titik (.), atau dash (-).'
        conflict = User.query.filter(
            User.username == username,
            User.id != user_id,
        ).first()
        if conflict:
            return None, 'Username sudah digunakan oleh akun lain.'
        user.username = username

    # ── Update Email ──────────────────────────────────────────────────────
    if 'email' in provided:
        email = data['email']
        if not isinstance(email, str):
            return None, 'Email harus berupa teks.'
        email = email.strip().lower()
        if not email:
            return None, 'Email tidak boleh kosong.'
        if not _EMAIL_PATTERN.match(email):
            return None, 'Format email tidak valid.'
        if len(email) > 255:
            return None, 'Email terlalu panjang (maksimal 255 karakter).'
        conflict = User.query.filter(
            User.email == email,
            User.id != user_id,
        ).first()
        if conflict:
            return None, 'Email sudah digunakan oleh akun lain.'
        user.email = email

    # ── Update Password ───────────────────────────────────────────────────
    if 'password' in provided:
        password = data['password']
        if not isinstance(password, str):
            return None, 'Password harus berupa teks.'
        if len(password) < 8:
            return None, 'Password minimal 8 karakter.'
        if len(password) > 128:
            return None, 'Password maksimal 128 karakter.'
        user.set_password(password)

    db.session.commit()
    return user, None
