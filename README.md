# SIAKAD SMA

Sistem Informasi Akademik Sekolah Menengah Atas berbasis web untuk membantu pengelolaan data akademik, jadwal, absensi, penilaian, dan monitoring kegiatan belajar mengajar.

## Overview

SIAKAD SMA dikembangkan dengan arsitektur:

`React + Vite → Laravel REST API → MySQL`

Sistem menggunakan role-based access control sehingga setiap pengguna memperoleh akses sesuai tanggung jawabnya.

## Roles

- **TU** — pengelolaan dan administrasi data akademik
- **Wakakur** — pengelolaan serta monitoring kegiatan akademik dan KBM
- **Guru Mata Pelajaran** — jadwal, absensi, dan penilaian
- **Wali Kelas** — monitoring siswa, rekap absensi, dan rekap nilai kelas
- **Siswa** — melihat informasi akademik yang tersedia untuk akun siswa

## Main Modules

### Authentication & Authorization
- Login pengguna
- Laravel Sanctum
- Role-based route protection
- Protected frontend routes
- Session/token handling

### Jadwal
- Manajemen jadwal
- Relasi guru, kelas, dan mata pelajaran
- Workflow jadwal
- Monitoring jadwal
- Tampilan berdasarkan role

### Absensi
- Pengisian absensi berdasarkan jadwal
- Validasi hak akses guru
- Penyimpanan status kehadiran siswa
- Rekap absensi
- Tampilan berdasarkan role

### Penilaian
- Input nilai oleh guru
- Validasi akses berdasarkan jadwal
- Rekap nilai
- Tampilan nilai siswa
- Rekap nilai untuk Wali Kelas

### Monitoring KBM
- Monitoring kegiatan belajar mengajar
- Data jadwal sebagai sumber monitoring
- Tampilan monitoring untuk Wakakur

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Laravel 13 |
| API | Laravel REST API |
| Authentication | Laravel Sanctum |
| Database | MySQL |
| Language | JavaScript, PHP |

## Project Structure

```text
siakad_sma/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
└── docs/
```

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/nabilsupardy4422/siakad_sma.git
cd siakad_sma
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure the MySQL database in `.env`, then run:

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Make sure the frontend API configuration points to the running Laravel backend.

## Architecture

```text
┌─────────────────────┐
│     React + Vite    │
│      Frontend       │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│    Laravel 13 API   │
│ Authentication/RBAC │
│      Controllers     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│        MySQL        │
│ Academic Data Store │
└─────────────────────┘
```

## Development Focus

Project ini berfokus pada pengembangan sistem akademik berbasis web dengan pemisahan frontend dan backend, REST API, role-based authorization, serta integrasi data antar modul akademik.

## Author

**Nabil Adillah Supardy**

Universitas Islam Negeri Imam Bonjol Padang
