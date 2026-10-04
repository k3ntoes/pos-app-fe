# 05 — API Contract for Admin Web & Mobile (SSOT)

> [!NOTE]
> Dokumen ini adalah **Single Source of Truth (SSOT)** untuk kontrak API, standar error, format timestamp, paginasi, aturan CSRF, otentikasi Bearer/Cookie, dan standardisasi istilah domain di lingkungan frontend. Rujuk dokumen lain seperti [01-frontend-architecture.md](01-frontend-architecture.md), [02-features-users-roles-units.md](02-features-users-roles-units.md), [03-audit-feature.md](03-audit-feature.md), dan [07-example-response-shapes.md](07-example-response-shapes.md) untuk implementasi konkret.

---

## 1. Konvensi Umum & SSOT

### 1.1 Base URL dan Versi
Backend menggunakan prefix URL yang terpisah berdasarkan kelompok fungsional:

| Prefix | Kelompok Endpoint | Contoh |
|---|---|---|
| `/auth/` | Web Authentication & Session | `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/change-password` |
| `/auth/mobile/` | Mobile Authentication (JWT) | `/auth/mobile/login`, `/auth/mobile/refresh`, `/auth/mobile/me` |
| `/api/v1/` | Resource API (Users, Roles, Units, Permissions) | `/api/v1/users`, `/api/v1/roles`, `/api/v1/units`, `/api/v1/permissions` |

- Frontend (FE) memanggil API secara relatif terhadap host yang dikonfigurasi pada klien HTTP.

### 1.2 Format Timestamp (SSOT)
- Seluruh timestamp dikembalikan dalam format **RFC3339 / ISO8601 UTC** dan wajib berakhiran `Z`.
- Contoh: `2026-09-27T05:00:00Z`.
- FE menampilkan waktu lokal bila diperlukan untuk kenyamanan visual, namun perbandingan logika bisnis tetap merujuk pada timestamp UTC baku.

### 1.3 Struktur Paginasi Standar (SSOT)
Setiap endpoint list/koleksi (seperti Users, Roles) wajib mengembalikan metadata paginasi dengan struktur seragam:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 124,
    "total_pages": 7
  }
}
```
- `page`: Halaman aktif (integer, min 1, query parameter `page`).
- `page_size`: Jumlah item per halaman (integer, min 1, max 100, query parameter `page_size`).
- `total_items`: Total keseluruhan item di database.
- `total_pages`: Total keseluruhan halaman.

### 1.4 Autentikasi CSRF & Session Cookie (Web) vs Bearer Token (Mobile)
- **Web Session**: Menggunakan HttpOnly Secure Cookie bernama **`pos_session`**.
- **Web CSRF**: Menggunakan cookie **`pos_csrf`** dengan atribut:
  - `httponly=False` (agar dapat dibaca oleh JavaScript frontend).
  - `secure=True` (wajib HTTPS di produksi).
  - `samesite=Lax`.
  - **Injeksi Header**: Setiap request mutasi state (`POST`, `PUT`, `PATCH`, `DELETE`) **wajib** menyertakan header **`X-CSRF-Token`** yang nilainya diambil dari cookie `pos_csrf` atau response login.
- **Mobile Authentication**: Menggunakan header **`Authorization: Bearer <access_token>`** dengan token JWT access yang memiliki masa berlaku `expires_in: 900` detik (15 menit), disertai mekanisme refresh token via endpoint `/auth/mobile/refresh`.

### 1.5 Terminologi Domain: `unit_id` & `UserRoleAssignment` (SSOT)
- **`unit_id`**: Menyatakan ID unit spesifik yang terikat pada entitas data atau operasi tertentu.
- **Akses Unit User**: Informasi unit user tidak tersimpan sebagai field langsung di `UserResponse`, melainkan diperoleh melalui endpoint:
  ```
  GET /api/v1/users/{user_id}/roles
  ```
  Endpoint ini mengembalikan daftar `UserRoleAssignmentResponse` yang masing-masing memiliki field **`unit_id`** (berupa UUID atau nilai khusus `"GLOBAL"` jika berlaku secara global).

---

## 2. Kontrak Error Standar & HTTP Status (SSOT)

Seluruh error dari backend dikembalikan dengan struktur JSON seragam (`ErrorResponse`):
```json
{
  "type": "ValidationError",
  "code": "VALIDATION_ERROR",
  "message": "Validation error",
  "request_id": "019kj2h3k2hj2h3...",
  "details": [
    {
      "loc": ["body", "username"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

### 2.1 Definisi HTTP Status Code
- **`200 OK`**: Permintaan sukses (GET, PUT, PATCH).
- **`201 Created`**: Pembuatan resource baru sukses (POST).
- **`204 No Content`**: Penghapusan resource sukses tanpa body balasan (DELETE).
- **`400 Bad Request`**: Permintaan tidak valid secara sintaksis.
- **`401 Unauthorized`**: Sesi habis atau kredensial salah (wajib trigger redirect login).
- **`403 Forbidden`**: User terotentikasi namun tidak memiliki izin/permission yang cukup.
- **`404 Not Found`**: Resource yang diminta tidak ditemukan.
- **`409 Conflict`**: Konflik state data (misalnya duplikasi unique key / username).
- **`422 Unprocessable Entity`**: Gagal validasi skema Pydantic (`RequestValidationError`).
- **`429 Too Many Requests`**: Melebihi batasan rate limiter (contoh pada login/refresh).
- **`500 Internal Server Error`**: Kegagalan server tak terduga.

---

## 3. Daftar Lengkap Endpoint API

### 3.1 Health Check (Public)
- `GET /health` — Cek status server (Status 200 OK).
- `GET /health/ready` — Cek kesiapan service dan database (Status 200 OK).

### 3.2 Web Authentication (`/auth`)
- `POST /auth/login` — Rate limit 5 req/60s. Body: `LoginRequest` (`username`, `password`). Mengatur cookies `pos_session` & `pos_csrf`. Mengembalikan `{"status": "success", "csrf_token": "...", "must_change_password": bool}`.
- `POST /auth/change-password` — Auth: Web session + CSRF header. Body: `ChangePasswordRequest` (`current_password`, `new_password`).
- `POST /auth/logout` — Auth: Web session + CSRF header. Menghapus cookie sesi dan CSRF.
- `GET /auth/me` — Auth: Web session. Mengembalikan profil user (`UserResponse`).

### 3.3 Mobile Authentication (`/auth/mobile`)
- `POST /auth/mobile/login` — Rate limit 5 req/60s. Body: `MobileLoginRequest` (`username`, `password`). Mengembalikan `TokenResponse` (`access_token`, `refresh_token`, `token_type`, `expires_in`, `must_change_password`).
- `POST /auth/mobile/refresh` — Rate limit 10 req/60s. Body: `RefreshRequest` (`refresh_token`). Mengembalikan `TokenResponse`.
- `POST /auth/mobile/change-password` — Auth: Bearer token. Body: `ChangePasswordMobileRequest`.
- `POST /auth/mobile/logout` — Auth: Bearer token.
- `GET /auth/mobile/me` — Auth: Bearer token. Mengembalikan profil user (`UserResponse`).

### 3.4 Permissions (`/api/v1/permissions`)
- `GET /api/v1/permissions` — Auth: Required. Permission: `ROLES_READ`. Mengembalikan `list[str]` seluruh permission sistem.

### 3.5 Roles (`/api/v1/roles`)
- `GET /api/v1/roles` — Query: `page`, `page_size`, `is_system`. Permission: `ROLES_READ`. Response: `RoleListResponse`.
- `POST /api/v1/roles` — Body: `CreateRoleRequest` (`name`, `description`, `code`). Permission: `ROLES_MANAGE`. Response: `RoleResponse` (201).
- `GET /api/v1/roles/{role_id}` — Permission: `ROLES_READ`. Response: `RoleResponse`.
- `PUT /api/v1/roles/{role_id}` — Body: `UpdateRoleRequest` (`name`, `description`). Permission: `ROLES_MANAGE`. Response: `RoleResponse`.
- `DELETE /api/v1/roles/{role_id}` — Permission: `ROLES_MANAGE`. Response: `204 No Content`.
- `PUT /api/v1/roles/{role_id}/permissions` — Body: `UpdateRolePermissionsRequest` (`permissions: list[str]`). Permission: `ROLES_MANAGE`. Response: `RoleResponse`.

### 3.6 Units (`/api/v1/units`)
- `GET /api/v1/units` — Query: `is_active`, `search`. Permission: `UNITS_READ`. Response: `UnitListResponse`.
- `POST /api/v1/units` — Body: `CreateUnitRequest` (`code`, `name`, `address`, `is_active`). Permission: `UNITS_MANAGE`. Response: `UnitResponse` (201).
- `GET /api/v1/units/{unit_id}` — Permission: `UNITS_READ`. Response: `UnitResponse`.
- `PATCH /api/v1/units/{unit_id}` — Body: `UpdateUnitRequest` (`name`, `address`, `is_active`). Permission: `UNITS_MANAGE`. Response: `UnitResponse`.
- `DELETE /api/v1/units/{unit_id}` — Permission: `UNITS_MANAGE`. Response: `204 No Content`.

### 3.7 Users (`/api/v1/users`)
- `GET /api/v1/users` — Query: `page`, `page_size`. Permission: `USERS_READ` (unit scoped). Response: `UserListResponse`.
- `POST /api/v1/users` — Body: `CreateUserRequest` (`username`, `email`, `full_name`). Permission: `USERS_MANAGE`. Response: `CreateUserResponse` (201, menyertakan `temporary_password`).
- `GET /api/v1/users/{user_id}` — Permission: `USERS_READ` (unit scoped). Response: `UserResponse`.
- `PATCH /api/v1/users/{user_id}` — Body: `AdminUpdateUserRequest` (`email`, `full_name`). Permission: `USERS_MANAGE`. Response: `UserResponse`.
- `PATCH /api/v1/users/me` — Body: `UpdateSelfProfileRequest` (`full_name`, `email`). Auth: Logged-in user. Response: `UserResponse`.
- `PATCH /api/v1/users/{user_id}/status` — Body: `UpdateUserStatusRequest` (`status`: `ACTIVE`, `INACTIVE`, `SUSPENDED`). Permission: `USERS_MANAGE`. Response: `UserResponse`.
- `POST /api/v1/users/{user_id}/reset-password` — Permission: `USERS_MANAGE`. Response: `ResetPasswordResponse` (menyertakan `temporary_password` dan `must_change_password: true`).
- `GET /api/v1/users/{user_id}/roles` — Permission: `USERS_READ` (unit scoped). Response: `list[UserRoleAssignmentResponse]`.
- `POST /api/v1/users/{user_id}/roles` — Body: `AssignRoleRequest` (`role_id`, `unit_id`). Permission: `USERS_MANAGE` (dengan aturan penugasan role sistem eksklusif Super Admin sesuai ADR-0003). Response: `UserRoleAssignmentResponse` (201).
- `DELETE /api/v1/users/{user_id}/roles/{assignment_id}` — Permission: `USERS_MANAGE`. Response: `204 No Content`.

---

## 4. Resource Terkait
- Rincian contoh payload JSON (fixtures) untuk setiap endpoint di atas dapat dilihat secara lengkap di [07-example-response-shapes.md](07-example-response-shapes.md).

---

## 5. Ringkasan Dokumen
Kontrak ini adalah rujukan utama (SSOT) bagi [09-coding-rules.md](09-coding-rules.md) dan [07-example-response-shapes.md](07-example-response-shapes.md). Setiap perubahan pada struktur error, paginasi, CSRF, timestamp, atau terminologi unit wajib diperbarui di sini terlebih dahulu.

---
⬅ **Sebelumnya:** [Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 06 — Lingkup Pekerjaan & Tugas](06-frontend-scope-tasks.md)
