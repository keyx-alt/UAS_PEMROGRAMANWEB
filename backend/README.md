# Backend — VeloraSec

> Backend Flask untuk platform VeloraSec Cybersecurity Learning Hub.

---

## Status

🟢 **Aktif Dikembangkan** — Phase 7 (Backend Flask) sedang berjalan.

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| Framework | Flask 3.0.3 |
| Database ORM | Flask-SQLAlchemy |
| Migration | Flask-Migrate (Alembic) |
| Authentication | Flask-JWT-Extended |
| Password Hashing | Flask-Bcrypt |
| CORS | Flask-CORS |
| Database Driver | PyMySQL |
| Database | MySQL 8+ via XAMPP |

---

## Struktur Folder

```
backend/
├── app.py              → Flask app factory (create_app)
├── config.py           → konfigurasi dev/testing/production
├── extensions.py       → Flask extensions (db, jwt, bcrypt, cors)
├── requirements.txt    → Python dependencies
├── .env.example        → template environment variables
│
├── models/             → SQLAlchemy database models
│   ├── __init__.py
│   ├── user.py         → model User (tabel: users)
│   ├── progress.py     → model UserProgress (tabel: user_progress)
│   ├── quiz_result.py  → model QuizResult (tabel: quiz_results)
│   └── planner.py      → model PlannerTask (tabel: planner_tasks)
│
├── routes/             → API route handlers (Flask Blueprints)
│   ├── __init__.py     → register_blueprints()
│   ├── auth.py         → /api/auth/*
│   ├── users.py        → /api/users/*
│   ├── progress.py     → /api/progress/*
│   ├── quiz.py         → /api/quiz/*
│   ├── planner.py      → /api/planner/*
│   └── dashboard.py    → /api/dashboard/*
│
├── services/           → business logic (terpisah dari routes)
│   ├── __init__.py
│   ├── auth_service.py → validasi input register & login
│   └── user_service.py → logic update profil user
│
└── utils/              → helper functions
    ├── __init__.py
    ├── responses.py    → success() & error() response helpers
    └── decorators.py   → @admin_required() decorator
```

---

## Endpoint API

### Health Check
```
GET    /api/health                → cek status server
```

### Authentication
```
POST   /api/auth/register        → daftar user baru
POST   /api/auth/login           → login, return JWT token
POST   /api/auth/refresh         → refresh access token (gunakan refresh token)
POST   /api/auth/logout          → logout (stateless)
POST   /api/auth/forgot-password → reset password (placeholder)
```

### User
```
GET    /api/users/me             → profil user yang sedang login  [JWT]
PUT    /api/users/me             → update profil                  [JWT]
```

### Progress
```
GET    /api/progress             → semua progress modul user      [JWT]
POST   /api/progress             → upsert progress satu modul     [JWT]
DELETE /api/progress             → reset semua progress           [JWT]
```

### Quiz
```
GET    /api/quiz/results         → riwayat hasil quiz             [JWT]
GET    /api/quiz/results?category=Network  → filter per kategori  [JWT]
POST   /api/quiz/results         → simpan hasil quiz baru         [JWT]
```

### Planner
```
GET    /api/planner              → semua task planner user        [JWT]
POST   /api/planner/<task_key>   → toggle task (w0d0, w1d3, ...)  [JWT]
DELETE /api/planner              → reset semua task planner       [JWT]
```

### Dashboard
```
GET    /api/dashboard/summary    → aggregated dashboard data      [JWT]
```

---

## Setup & Menjalankan

### Prasyarat
1. **Python 3.11+** terinstall
2. **XAMPP** terinstall dan MySQL sudah distart dari XAMPP Control Panel
3. Database `velorasec` sudah dibuat di phpMyAdmin

### Langkah Setup

```powershell
# 1. Masuk ke folder backend
cd backend

# 2. Buat virtual environment
python -m venv venv

# 3. Aktifkan virtual environment
venv\Scripts\activate    # Windows

# 4. Install dependencies
pip install -r requirements.txt

# 5. Buat file .env dari template
copy .env.example .env
# Edit .env — sesuaikan SECRET_KEY, JWT_SECRET_KEY, dan DB_PASSWORD jika perlu

# 6. Inisialisasi migrasi database
flask db init

# 7. Generate migrasi pertama (buat semua tabel)
flask db migrate -m "initial migration"

# 8. Jalankan migrasi (buat tabel di database)
flask db upgrade

# 9. Jalankan development server
flask run
```

Server akan berjalan di: **http://localhost:5000**

### Test Cepat

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Register user
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST -ContentType "application/json" `
  -Body '{"username":"testuser","email":"test@test.com","password":"Test1234!"}'

# Login
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"Test1234!"}'
```

---

*VeloraSec Backend v1.0 | Phase 7*


Backend akan mulai dikembangkan setelah Phase 6 (Persiapan Backend) selesai.

---

## Rencana Teknologi

| Komponen | Teknologi |
|---|---|
| Framework | Python Flask |
| Database ORM | SQLAlchemy |
| Authentication | Flask-JWT-Extended |
| Validasi | Marshmallow / Pydantic |
| CORS | Flask-CORS |
| Server | Gunicorn |

---

## Rencana Struktur

```
backend/
├── app.py                   → Flask app entry point
├── config.py                → konfigurasi (dev/staging/production)
├── requirements.txt         → Python dependencies
├── .env.example             → template environment variables
│
├── models/                  → SQLAlchemy database models
│   ├── __init__.py
│   ├── user.py              → model User
│   ├── progress.py          → model UserProgress
│   ├── quiz_result.py       → model QuizResult
│   └── planner.py           → model PlannerTask
│
├── routes/                  → API route handlers (Blueprints)
│   ├── __init__.py
│   ├── auth.py              → POST /api/auth/login, /register, /refresh
│   ├── users.py             → GET/PUT /api/users/me
│   ├── progress.py          → GET/POST /api/progress
│   ├── quiz.py              → GET/POST /api/quiz
│   └── planner.py           → GET/POST/DELETE /api/planner
│
├── services/                → business logic (terpisah dari routes)
│   ├── __init__.py
│   ├── auth_service.py      → logika autentikasi & JWT
│   ├── user_service.py      → operasi user
│   └── progress_service.py  → kalkulasi & update progress
│
└── utils/                   → helper functions
    ├── __init__.py
    ├── decorators.py        → @token_required, @admin_required
    └── validators.py        → input validation helpers
```

---

## Rencana Endpoint API

### Authentication
```
POST   /api/auth/register     → daftarkan user baru
POST   /api/auth/login        → login, return JWT token
POST   /api/auth/refresh      → refresh access token
POST   /api/auth/logout       → invalidate token
```

### User
```
GET    /api/users/me          → profil user saat ini
PUT    /api/users/me          → update profil
```

### Progress
```
GET    /api/progress          → semua progress user
POST   /api/progress          → update progress modul
DELETE /api/progress/:id      → reset progress item
```

### Quiz
```
GET    /api/quiz/results      → riwayat hasil quiz user
POST   /api/quiz/results      → simpan hasil quiz
```

### Planner
```
GET    /api/planner           → semua task planner user
POST   /api/planner/:key      → toggle task selesai/belum
DELETE /api/planner           → reset semua planner
```

---

## Cara Mulai (Setelah Phase 7 Dimulai)

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Buat virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi lokal

# 5. Inisialisasi database
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# 6. Jalankan development server
flask --app app run --debug
```

---

*Lihat [Laporan Audit](../docs/AUDIT_VELORASEC.md) untuk roadmap pengembangan lengkap.*
