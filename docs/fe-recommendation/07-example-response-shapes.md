# 07 — Example Response Shapes (JSON Fixtures Catalog)

> [!NOTE]
> Katalog konkret payload JSON (fixtures) yang dikonsumsi oleh frontend. Seluruh penjelasan teoretis mengenai paginasi, error standar, aturan CSRF, dan kontrak endpoint merujuk pada Single Source of Truth (SSOT) di [05-api-contract.md](05-api-contract.md).

---

## 1. Katalog Error Standar & Validasi

Merujuk pada [05-api-contract.md](05-api-contract.md). Semua error dari backend memiliki shape seragam `ErrorResponse`:

### Contoh Error 404 Not Found
```json
{
  "type": "NotFoundError",
  "code": "NOT_FOUND",
  "message": "Resource yang diminta tidak ditemukan.",
  "request_id": "019kj2h3k2hj2h3...",
  "details": null
}
```

### Contoh Error 401 Unauthorized
```json
{
  "type": "UnauthorizedError",
  "code": "HTTP_401",
  "message": "Invalid credentials",
  "request_id": "019abc...",
  "details": null
}
```

### Contoh Error 403 Forbidden
```json
{
  "type": "ForbiddenError",
  "code": "HTTP_403",
  "message": "Permission denied",
  "request_id": "019def...",
  "details": null
}
```

### Contoh Error 422 Unprocessable Entity (Validation Error)
```json
{
  "type": "ValidationError",
  "code": "VALIDATION_ERROR",
  "message": "Validation error",
  "request_id": "019val...",
  "details": [
    {
      "loc": ["body", "username"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

---

## 2. Auth & Session

### 2a. Web Auth — `POST /auth/login`
**Request Body (`LoginRequest`):**
```json
{
  "username": "budi.admin",
  "password": "SecurePassword123!"
}
```

**Respons Sukses (200):**
```json
{
  "status": "success",
  "csrf_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "must_change_password": false
}
```

### 2b. Mobile Auth — `POST /auth/mobile/login`
**Request Body (`MobileLoginRequest`):**
```json
{
  "username": "budi.mobile",
  "password": "SecurePassword123!"
}
```

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

## 3. Identitas User (`GET /auth/me` & `GET /auth/mobile/me`)

**Respons Sukses (200) — UserResponse:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
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
*Field `status` nilai yang valid: `ACTIVE`, `INACTIVE`, `SUSPENDED`.*

---

## 4. Permissions Resource (`/api/v1/permissions`)

### `GET /api/v1/permissions` — Respons Sukses (200)
```json
[
  "ROLES_MANAGE",
  "ROLES_READ",
  "UNITS_MANAGE",
  "UNITS_READ",
  "USERS_MANAGE",
  "USERS_READ"
]
```

---

## 5. Roles Resource (`/api/v1/roles`)

### 5a. RoleResponse
```json
{
  "id": "223e4567-e89b-12d3-a456-426614174000",
  "code": "cashier",
  "name": "Cashier",
  "description": "Kasir toko utama",
  "is_system": false,
  "permissions": [
    "UNITS_READ"
  ],
  "created_at": "2026-02-10T10:00:00Z",
  "updated_at": "2026-02-10T10:00:00Z"
}
```

### 5b. `GET /api/v1/roles` — RoleListResponse (200)
```json
{
  "data": [
    {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "code": "cashier",
      "name": "Cashier",
      "description": "Kasir toko utama",
      "is_system": false,
      "permissions": ["UNITS_READ"],
      "created_at": "2026-02-10T10:00:00Z",
      "updated_at": "2026-02-10T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 1,
    "total_pages": 1
  }
}
```

### 5c. `POST /api/v1/roles` — Request Body (`CreateRoleRequest`)
```json
{
  "name": "Supervisor",
  "description": "Supervisor operasional toko",
  "code": "supervisor"
}
```

### 5d. `PUT /api/v1/roles/{role_id}/permissions` — Request Body (`UpdateRolePermissionsRequest`)
```json
{
  "permissions": [
    "UNITS_READ",
    "USERS_READ"
  ]
}
```

---

## 6. Units Resource (`/api/v1/units`)

### 6a. UnitResponse
```json
{
  "id": "323e4567-e89b-12d3-a456-426614174000",
  "code": "STORE-01",
  "name": "Cabang Jakarta Selatan",
  "address": "Jl. Jend. Sudirman No. 1",
  "is_active": true,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z"
}
```

### 6b. `GET /api/v1/units` — UnitListResponse (200)
```json
{
  "units": [
    {
      "id": "323e4567-e89b-12d3-a456-426614174000",
      "code": "STORE-01",
      "name": "Cabang Jakarta Selatan",
      "address": "Jl. Jend. Sudirman No. 1",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### 6c. `POST /api/v1/units` — Request Body (`CreateUnitRequest`)
```json
{
  "code": "STORE-02",
  "name": "Cabang Bandung",
  "address": "Jl. Asia Afrika No. 10",
  "is_active": true
}
```

---

## 7. Users Resource (`/api/v1/users`)

### 7a. `GET /api/v1/users` — UserListResponse (200)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "budi.admin",
      "email": "budi@example.com",
      "full_name": "Budi Santoso",
      "status": "ACTIVE",
      "is_super_admin": false,
      "must_change_password": false,
      "created_at": "2026-01-15T08:00:00Z",
      "updated_at": "2026-09-27T05:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 1,
    "total_pages": 1
  }
}
```

### 7b. `POST /api/v1/users` — Request Body (`CreateUserRequest`) & Response (`CreateUserResponse` - 201)
**Request Body:**
```json
{
  "username": "andi.cashier",
  "email": "andi@example.com",
  "full_name": "Andi Pratama"
}
```

**Response (201 Created):**
```json
{
  "id": "423e4567-e89b-12d3-a456-426614174000",
  "username": "andi.cashier",
  "email": "andi@example.com",
  "full_name": "Andi Pratama",
  "status": "ACTIVE",
  "is_super_admin": false,
  "must_change_password": true,
  "created_at": "2026-10-04T12:00:00Z",
  "updated_at": "2026-10-04T12:00:00Z",
  "temporary_password": "TempPassword999!"
}
```

### 7c. User Role Assignments (`GET /api/v1/users/{user_id}/roles`)
**Response (200):**
```json
[
  {
    "id": "523e4567-e89b-12d3-a456-426614174000",
    "user_id": "423e4567-e89b-12d3-a456-426614174000",
    "role_id": "223e4567-e89b-12d3-a456-426614174000",
    "role_code": "cashier",
    "role_name": "Cashier",
    "is_system": false,
    "unit_id": "323e4567-e89b-12d3-a456-426614174000",
    "created_at": "2026-10-04T12:05:00Z"
  }
]
```

### 7d. `POST /api/v1/users/{user_id}/roles` — Request Body (`AssignRoleRequest`)
```json
{
  "role_id": "223e4567-e89b-12d3-a456-426614174000",
  "unit_id": "323e4567-e89b-12d3-a456-426614174000"
}
```
*(Catatan: `unit_id` juga dapat bernilai string `"GLOBAL"` atau `null`)*

---

## 8. Ringkasan Dokumen
Katalog JSON fixtures ini merujuk secara penuh pada [05-api-contract.md](05-api-contract.md). Seluruh struktur di atas bersumber langsung dari skema Pydantic (`app/application/`) dan router FastAPI di codebase backend.

---
⬅ **Sebelumnya:** [Dokumen 06 — Lingkup Pekerjaan & Tugas](06-frontend-scope-tasks.md) | 📑 **[Indeks Dokumen](README.md)**
