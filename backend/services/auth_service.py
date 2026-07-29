"""
services/auth_service.py — Auth Business Logic
================================================
Fungsi validasi untuk input register dan login.
Dipisah dari routes agar mudah ditest secara unit.
"""

import re

# ── Konstanta ─────────────────────────────────────────────────────────────

_USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_.\-]+$')
_EMAIL_PATTERN    = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

USERNAME_MIN = 3
USERNAME_MAX = 50
PASSWORD_MIN = 8
PASSWORD_MAX = 128


# ── Fungsi Validasi ───────────────────────────────────────────────────────

def validate_register_data(data: dict) -> str | None:
    """
    Validasi data input untuk endpoint register.

    Args:
        data: dict dari request.get_json()

    Returns:
        str pesan error jika ada validasi yang gagal
        None jika semua valid
    """
    username = data.get('username', '')
    email    = data.get('email', '')
    password = data.get('password', '')

    # Normalisasi
    if isinstance(username, str):
        username = username.strip()
    if isinstance(email, str):
        email = email.strip()

    # ── Username ───────────────────────────────────────────────────────────
    if not username:
        return 'Username wajib diisi.'
    if not isinstance(username, str):
        return 'Username harus berupa teks.'
    if len(username) < USERNAME_MIN:
        return f'Username minimal {USERNAME_MIN} karakter.'
    if len(username) > USERNAME_MAX:
        return f'Username maksimal {USERNAME_MAX} karakter.'
    if not _USERNAME_PATTERN.match(username):
        return 'Username hanya boleh mengandung huruf, angka, underscore (_), titik (.), atau dash (-).'

    # ── Email ──────────────────────────────────────────────────────────────
    if not email:
        return 'Email wajib diisi.'
    if not isinstance(email, str):
        return 'Email harus berupa teks.'
    if not _EMAIL_PATTERN.match(email):
        return 'Format email tidak valid.'
    if len(email) > 255:
        return 'Email terlalu panjang (maksimal 255 karakter).'

    # ── Password ───────────────────────────────────────────────────────────
    if not password:
        return 'Password wajib diisi.'
    if not isinstance(password, str):
        return 'Password harus berupa teks.'
    if len(password) < PASSWORD_MIN:
        return f'Password minimal {PASSWORD_MIN} karakter.'
    if len(password) > PASSWORD_MAX:
        return f'Password maksimal {PASSWORD_MAX} karakter.'

    return None


def validate_login_data(data: dict) -> str | None:
    """
    Validasi data input untuk endpoint login.

    Args:
        data: dict dari request.get_json()

    Returns:
        str pesan error jika ada validasi yang gagal
        None jika semua valid
    """
    email    = data.get('email', '')
    password = data.get('password', '')

    if not email or not isinstance(email, str) or not email.strip():
        return 'Email wajib diisi.'
    if not password or not isinstance(password, str):
        return 'Password wajib diisi.'

    return None
