# 07 — Example Response Shapes (JSON Fixtures Catalog)

> [!NOTE]
> Katalog konkret payload JSON (fixtures) yang dikonsumsi oleh frontend. Seluruh penjelasan teoretis mengenai paginasi, error standar, dan aturan CSRF merujuk pada Single Source of Truth (SSOT) di [05-api-contract.md](05-api-contract.md).


---

## 1. Katalog Error Standar

Merujuk pada [05-api-contract.md](05-api-contract.md). Semua error dari backend memiliki shape berikut:

```json
{
  "type": "NotFoundError",
  "code": "NOT_FOUND",
  "message": "Resource yang diminta tidak ditemukan.",
  "request_id": "019kj2h3k2hj2h3...",
  "details": null
}
```

Contoh error autentikasi (401):
```json
{
  "type": "AuthenticationError",
  "code": "INVALID_CREDENTIALS",
  "message": "Username atau password salah.",
  "request_id": "019abc...",
  "details": null
}
```

Contoh error otorisasi (403):
```json
{
  "type": "AuthorizationError",
  "code": "PERMISSION_DENIED",
  "message": "Anda tidak memiliki izin untuk melakukan aksi ini.",
  "request_id": "019def...",
  "details": null
}
```

---

## 2. Auth & Session

> [!IMPORTANT]
> Prefix auth endpoint adalah `/auth/`, **bukan** `/api/v1/`. Perhatikan pembedaan antara web auth (cookie-based + CSRF) dan mobile auth (JWT token-based).

### 2a. Web Auth — `POST /auth/login`

**Respons Sukses (200):**
```json
{
  "status": "success",
  "csrf_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "must_change_password": false
}
```

Jika user wajib ganti password saat pertama login:
```json
{
  "status": "success",
  "csrf_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "must_change_password": true
}
```

**Respons Error (401):**
```json
{
  "type": "AuthenticationError",
  "code": "INVALID_CREDENTIALS",
  "message": "Username atau password salah.",
  "request_id": "019abc...",
  "details": null
}
```

### 2b. Mobile Auth — `POST /auth/mobile/login`

**Respons Sukses (200) — TokenResponse:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900,
  "must_change_password": false
}
```

---

## 3. Identitas User

> [!IMPORTANT]
> Path yang benar adalah `GET /auth/me`, **bukan** `/api/v1/auth/me`.

### `GET /auth/me` — Respons (200)

```json
{
  "id": "019abc-uuid-...",
  "username": "budi.admin",
  "email": "budi@example.com",
  "full_name": "Budi Santoso",
  "status": "ACTIVE",
  "is_super_admin": false
}
```

Field `status` memiliki kemungkinan nilai: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`.

---

## 4. Users Resource (`/api/v1/users`)

### 4a. UserResponse — struktur field lengkap

```json
{
  "id": "019abc-uuid-...",
  "username": "budi.admin",
  "email": "budi@example.com",
  "full_name": "Budi Santoso",
  "status": "ACTIVE",
  "is_super_admin": false,
  "must_change_password": false,
  "created_at": "2026-01-15T08:00:00Z",
  "updated_at": "2026-09-27T05:00:00Z"
}
```

### 4b. `GET /api/v1/users` — UserListResponse

```json
{
  "data": [
    {
      "id": "019abc-uuid-...",
      "username": "budi.admin",
      "email": "budi@example.com",
      "full_name": "Budi Santoso",
      "status": "ACTIVE",
      "is_super_admin": false,
      "must_change_password": false,
      "created_at": "2026-01-15T08:00:00Z",
      "updated_at": "2026-09-27T05:00:00Z"
    },
    {
      "id": "019def-uuid-...",
      "username": "sari.gudang",
      "email": "sari@example.com",
      "full_name": "Sari Dewi",
      "status": "ACTIVE",
      "is_super_admin": false,
      "must_change_password": true,
      "created_at": "2026-03-10T09:30:00Z",
      "updated_at": "2026-09-28T10:00:00Z"
    },
    {
      "id": "019ghi-uuid-...",
      "username": "andi.kasir",
      "email": null,
      "full_name": "Andi Permana",
      "status": "SUSPENDED",
      "is_super_admin": false,
      "must_change_password": false,
      "created_at": "2026-04-01T07:00:00Z",
      "updated_at": "2026-09-30T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 124,
    "total_pages": 7
  }
}
```

### 4c. `POST /api/v1/users` — CreateUserResponse

Request body (`CreateUserRequest`):
```json
{
  "username": "tono.staff",
  "email": "tono@example.com",
  "full_name": "Tono Hartono"
}
```

> Field `email` bersifat opsional.

**Respons Sukses (201) — CreateUserResponse (UserResponse + `temporary_password`):**
```json
{
  "id": "019xyz-uuid-...",
  "username": "tono.staff",
  "email": "tono@example.com",
  "full_name": "Tono Hartono",
  "status": "ACTIVE",
  "is_super_admin": false,
  "must_change_password": true,
  "created_at": "2026-10-02T15:00:00Z",
  "updated_at": "2026-10-02T15:00:00Z",
  "temporary_password": "Tmp@8x2pQ!"
}
```

> [!IMPORTANT]
> Field `temporary_password` **hanya muncul pada respons `POST /api/v1/users`** (create user). Tampilkan sekali kepada admin dan tidak disimpan di state persisten.

---

## 5. Role Assignments (`/api/v1/users/{user_id}/roles`)

### `GET /api/v1/users/{user_id}/roles` — list[UserRoleAssignmentResponse]

**Contoh: user dengan role global (tanpa scope unit) dan role unit-scoped:**
```json
[
  {
    "id": "019ra1-uuid-...",
    "user_id": "019abc-uuid-...",
    "role_id": "019role1-uuid-...",
    "role_code": "owner",
    "role_name": "Owner",
    "is_system": true,
    "unit_id": null,
    "created_at": "2026-01-15T08:00:00Z"
  },
  {
    "id": "019ra2-uuid-...",
    "user_id": "019abc-uuid-...",
    "role_id": "019role2-uuid-...",
    "role_code": "kasir",
    "role_name": "Kasir",
    "is_system": true,
    "unit_id": "019unit-pusat-uuid-...",
    "created_at": "2026-03-20T10:00:00Z"
  }
]
```

**Keterangan field:**
- `unit_id: null` → role berlaku secara global (tidak terikat unit tertentu)
- `unit_id: "uuid"` → role berlaku hanya dalam lingkup unit tersebut
- `is_system: true` → role sistem bawaan, tidak dapat dihapus

---

## 6. Roles Resource (`/api/v1/roles`)

### `GET /api/v1/roles` — RoleListResponse

```json
{
  "data": [
    {
      "id": "019role1-uuid-...",
      "code": "owner",
      "name": "Owner",
      "description": "Akses penuh ke seluruh sistem.",
      "is_system": true,
      "permissions": [
        "users:read", "users:manage",
        "roles:read", "roles:manage",
        "units:read", "units:manage",
        "products:read", "products:manage",
        "inventory:read", "inventory:manage",
        "orders:read", "orders:create", "orders:void",
        "sales:report",
        "finance:read", "finance:manage"
      ],
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    },
    {
      "id": "019role2-uuid-...",
      "code": "supervisor",
      "name": "Supervisor",
      "description": "Mengawasi operasional unit.",
      "is_system": true,
      "permissions": [
        "users:read",
        "units:read",
        "orders:read",
        "sales:report"
      ],
      "created_at": "2026-02-10T09:00:00Z",
      "updated_at": "2026-09-15T14:30:00Z"
    },
    {
      "id": "019role3-uuid-...",
      "code": "kasir",
      "name": "Kasir",
      "description": "Akses terbatas untuk transaksi kasir.",
      "is_system": true,
      "permissions": [
        "orders:read",
        "orders:create"
      ],
      "created_at": "2026-02-10T09:00:00Z",
      "updated_at": "2026-09-15T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 3,
    "total_pages": 1
  }
}
```

**Keterangan field:**
- `is_system: true` → role sistem yang tidak dapat dimodifikasi atau dihapus
- `permissions` → array string kode permission yang dimiliki role tersebut

---

## 7. Unit-Scoped Records

Contoh data record berlingkup unit (`unit_id`):
```json
{
  "id": "019txn-uuid-...",
  "unit_id": "019unit-pusat-uuid-...",
  "reference_number": "TXN-2026-001",
  "created_at": "2026-09-27T05:00:00Z"
}
```

---

## 8. Dokumen Terkait
- Rujukan utama kontrak API: [05-api-contract.md](05-api-contract.md)
- Arsitektur Frontend: [01-frontend-architecture.md](01-frontend-architecture.md)
- Modul Pengguna & Unit: [02-features-users-roles-units.md](02-features-users-roles-units.md)
- Aturan Penanganan Kode: [09-coding-rules.md](09-coding-rules.md)

---
⬅ **Sebelumnya:** [Dokumen 06 — Lingkup Pekerjaan & Tugas](06-frontend-scope-tasks.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md)
