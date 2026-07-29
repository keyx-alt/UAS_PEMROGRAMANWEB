# VeloraSec — Cybersecurity Learning Hub

> Platform edukasi cybersecurity terstruktur — dari nol hingga Security Analyst profesional.

---

## Status Proyek

🚧 **Under Active Development**

Proyek sedang dalam transformasi dari **website statis** menjadi **aplikasi web full-stack**.

| Komponen | Status |
|---|---|
| Frontend (HTML/CSS/JS) | ✅ Aktif |
| Backend (Flask) | 🔴 Belum dimulai |
| Database (MySQL) | 🔴 Belum dimulai |
| Authentication (JWT) | 🔴 Belum dimulai |
| Deployment | 🔴 Belum dimulai |

---

## Teknologi

### Frontend (Existing)
- HTML5 + Vanilla CSS + Vanilla JavaScript
- Font Awesome 6.5 (CDN)
- SPA routing berbasis URL hash

### Backend (Planned)
- **Runtime:** Python 3.11+
- **Framework:** Flask
- **Database:** MySQL 8+
- **Authentication:** JWT (JSON Web Token)
- **Server:** Gunicorn + Nginx

---

## Struktur Proyek

```
VeloraSec-main/
├── .gitignore
├── README.md                    ← file ini
│
├── docs/                        ← dokumentasi proyek
│   └── AUDIT_VELORASEC.md       ← laporan audit teknis
│
├── frontend/                    ← semua aset frontend
│   ├── assets/
│   │   ├── css/                 → style.css (global stylesheet)
│   │   ├── fonts/               → web fonts (placeholder)
│   │   ├── icons/               → favicon icons (PNG)
│   │   ├── images/              → gambar/ilustrasi (placeholder)
│   │   └── js/                  → script.js (global JS)
│   └── pages/
│       ├── index.html           → halaman utama (SPA)
│       ├── auth/                → login, register, forgot-password
│       ├── guides/              → panduan tool cybersecurity
│       │   ├── Ghidra/
│       │   ├── Nmap/
│       │   ├── OwaspZap/
│       │   ├── Tcpdump/
│       │   └── Wireshark/
│       └── misc/                → halaman pendukung (about, 404, dsb.)
│
├── backend/                     ← backend Flask (planned)
│   ├── README.md
│   ├── models/                  → database models
│   ├── routes/                  → API route handlers
│   ├── services/                → business logic
│   └── utils/                   → helper functions
│
└── database/                    ← skema & migrasi database (planned)
    └── README.md
```

---

## Fase Pengembangan

| Fase | Nama | Status |
|---|---|---|
| Phase 1 | Audit Proyek | ✅ Selesai |
| Phase 2 | Refactor Struktur Folder | ✅ Selesai |
| Phase 3 | Refactor CSS | 🟡 Sedang |
| Phase 4 | Refactor JavaScript | ❌ Belum |
| Phase 5 | Component Reusable | ❌ Belum |
| Phase 6 | Persiapan Backend | ❌ Belum |
| Phase 7 | Backend Flask | ❌ Belum |
| Phase 8 | Database MySQL | ❌ Belum |
| Phase 9 | Authentication | ❌ Belum |
| Phase 10 | Dashboard Admin | ❌ Belum |
| Phase 11 | Integrasi Frontend-Backend | ❌ Belum |
| Phase 12 | Deployment | ❌ Belum |

---

## Development Setup

### Menjalankan Frontend (Static)

Cukup buka `frontend/pages/index.html` di browser, atau gunakan Live Server:

```bash
# VS Code — Install extension "Live Server"
# Klik kanan index.html → Open with Live Server
```

### Menjalankan Backend (Coming Soon)

```bash
# Clone repository
git clone <repo-url>
cd VeloraSec-main

# Setup virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r backend/requirements.txt

# Setup environment variables
cp backend/.env.example backend/.env
# Edit .env sesuai konfigurasi lokal

# Jalankan Flask
flask --app backend/app run --debug
```

---

## Dokumentasi

- 📄 [Laporan Audit Teknis](docs/AUDIT_VELORASEC.md) — analisis mendalam kondisi proyek saat ini

---

## Disclaimer

> Semua konten hanya untuk tujuan edukasi. Selalu dapatkan izin tertulis sebelum menguji sistem apapun. Unauthorized access adalah tindakan ilegal.

---

*VeloraSec v4.1.0 — Hack Responsibly | For Educational Use Only*
