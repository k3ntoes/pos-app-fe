# 07 — Example Response Shapes (JSON Fixtures Catalog)

> [!NOTE]
> Katalog konkret payload JSON (fixtures) yang dikonsumsi oleh frontend. Seluruh penjelasan teoretis mengenai paginasi, error standar, dan aturan CSRF merujuk pada Single Source of Truth (SSOT) di [05-api-contract.md](05-api-contract.md).


---

## 1. Katalog Error Standar
Merujuk pada [05-api-contract.md](05-api-contract.md):
```json
{
  "type": "authorization_error",
  "code": "permission_denied",
  "message": "You do not have permission to perform this action.",
  "request_id": "019kj2h3k2hj2h3..."
}
```

---

## 2. Katalog Autentikasi & Login

### Respons Sukses Login
```json
{
  "status": "success",
  "csrf_token": "token_csrf_here"
}
```

### Respons Error Login (401 / Throttle)
```json
{
  "type": "authentication_error",
  "code": "invalid_credentials",
  "message": "Invalid credentials",
  "request_id": "019..."
}
```

---

## 3. Katalog User Resource

### Identitas User (`/api/v1/auth/me`)
```json
{
  "id": "019abc...",
  "username": "budi.admin",
  "email": "budi@example.com",
  "full_name": "Budi Santoso",
  "status": "ACTIVE",
  "is_super_admin": false,
  "unit_scope": null
}
```

### Daftar User dengan Paginasi (`/api/v1/users`)
```json
{
  "data": [
    {
      "id": "019abc...",
      "username": "budi.admin",
      "full_name": "Budi Santoso",
      "email": "budi@example.com",
      "status": "ACTIVE",
      "unit_scope": null
    },
    {
      "id": "019def...",
      "username": "sari.gudang",
      "full_name": "Sari Dewi",
      "email": "sari@example.com",
      "status": "ACTIVE",
      "unit_scope": "019unit..."
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

---

## 4. Katalog Unit Resource & Unit-Scoped Records
Contoh data record berlingkup unit (`unit_id`):
```json
{
  "id": "019txn...",
  "unit_id": "019unit-pusat...",
  "reference_number": "TXN-2026-001",
  "created_at": "2026-09-27T05:00:00Z"
}
```

---

## 5. Dokumen Terkait
- Rujukan utama kontrak API: [05-api-contract.md](05-api-contract.md)
- Arsitektur Frontend: [01-frontend-architecture.md](01-frontend-architecture.md)
- Modul Pengguna & Unit: [02-features-users-roles-units.md](02-features-users-roles-units.md)
- Aturan Penanganan Kode: [09-coding-rules.md](09-coding-rules.md)

---
⬅ **Sebelumnya:** [Dokumen 06 — Lingkup Pekerjaan & Tugas](06-frontend-scope-tasks.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md)
