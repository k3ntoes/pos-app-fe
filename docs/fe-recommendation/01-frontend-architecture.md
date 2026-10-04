# 01 — Frontend Architecture & Client Configuration (SSOT)

> [!NOTE]
> Panduan teknis arsitektur frontend, konfigurasi API client, strategi caching TanStack Query, dan penanganan session guard serta `must_change_password` (ADR-0002).

---

## 1. Konfigurasi API Client (Axios / Fetch)
Klien HTTP frontend wajib dikonfigurasi dengan parameter keamanan berikut:
- **Credentials**: `withCredentials: true` (jika menggunakan Axios) atau `credentials: 'include'` (jika menggunakan `fetch`) agar HttpOnly cookies (`pos_session`, `pos_csrf`) dikirim secara otomatis pada setiap request Web Admin.
- **CSRF Header**: Interceptor otomatis membaca nilai cookie `pos_csrf` (atau memori state) dan menyertakannya pada header **`X-CSRF-Token`** untuk method `POST`, `PUT`, `PATCH`, dan `DELETE`.
- **Request ID**: Membaca atau mengirimkan header **`X-Request-ID`** untuk ketertelusuran log bersama backend.
- **Global Error Interceptor**:
  - **401 Unauthorized**: Sesi habis atau tidak sah; bersihkan state lokal dan arahkan pengguna ke halaman login (`/login`).
  - **403 Forbidden**: Akses ditolak; tampilkan notifikasi inline (toast/alert) tanpa memaksa logout.
  - **429 Too Many Requests**: Batasan rate limit tercapai; tampilkan pesan peringatan cooldown.
  - **422 Unprocessable Entity**: Validasi gagal; ekstrak field `details` untuk dipetakan ke form errors.

---

## 2. Session Guard & `must_change_password` (ADR-0002)
- Setiap kali user melakukan login atau mengambil data sesi aktif (`GET /auth/me`), frontend wajib memeriksa properti **`must_change_password`**.
- Jika `must_change_password === true`, router/guard frontend wajib mengarahkan user atau menampilkan **Modal Wajib Ganti Password** secara blocking. User tidak diizinkan menavigasi modul lain sebelum berhasil mengganti password melalui endpoint `/auth/change-password` atau `/auth/mobile/change-password`.

---

## 3. Strategi Caching & Query Key Convention (TanStack Query)
Frontend menggunakan TanStack Query dengan konvensi Query Key yang konsisten agar invalidasi cache akurat:
- `['auth', 'me']`: Data profil user aktif.
- `['users']` & `['users', userId]`: Daftar user dan detail user tunggal.
- `['roles']` & `['roles', roleId]`: Daftar role dan detail role.
- `['units']` & `['units', unitId]`: Daftar unit dan detail unit.
- `['permissions']`: Daftar seluruh permission sistem.

---
⬅ **Sebelumnya:** [Dokumen 00 — Ikhtisar Frontend](00-frontend-overview.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 02 — Fitur Pengguna, Peran, & Unit](02-features-users-roles-units.md)
