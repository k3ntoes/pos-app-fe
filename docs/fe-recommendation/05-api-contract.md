# 05 — API Contract for Admin Web (SSOT)

> [!NOTE]
> Dokumen ini adalah **Single Source of Truth (SSOT)** untuk kontrak API, standar error, format timestamp, paginasi, aturan CSRF, dan standardisasi istilah domain (`unit_id`) di lingkungan frontend. Rujuk dokumen lain seperti [01-frontend-architecture.md](01-frontend-architecture.md), [02-features-users-roles-units.md](02-features-users-roles-units.md), [03-audit-feature.md](03-audit-feature.md), dan [07-example-response-shapes.md](07-example-response-shapes.md) untuk implementasi konkret.

---

## 1. Konvensi Umum & SSOT

### 1.1 Base URL dan Versi
Backend menggunakan **dua prefix URL** yang terpisah berdasarkan jenis endpoint:

| Prefix | Kelompok Endpoint | Contoh |
|---|---|---|
| `/auth/` | Auth & Session | `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/change-password` |
| `/api/v1/` | Resource API | `/api/v1/users`, `/api/v1/roles`, `/api/v1/permissions` |

- Frontend (FE) memanggil API secara relatif terhadap host yang dikonfigurasi pada klien HTTP.

### 1.2 Format Timestamp (SSOT)
- Seluruh timestamp dikembalikan dalam format **RFC3339 / ISO8601 UTC** dan wajib berakhiran `Z`.
- Contoh: `2026-09-27T05:00:00Z`.
- FE menampilkan waktu lokal bila diperlukan untuk kenyamanan visual, namun perbandingan logika bisnis tetap merujuk pada timestamp UTC baku.

### 1.3 Struktur Paginasi Standar (SSOT)
Setiap endpoint list/koleksi wajib mengembalikan metadata paginasi dengan struktur seragam:
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
- `page`: Halaman aktif (integer, min 1).
- `page_size`: Jumlah item per halaman (integer).
- `total_items`: Total keseluruhan item di database.
- `total_pages`: Total keseluruhan halaman.

### 1.4 Autentikasi CSRF & Session Cookie (SSOT)
- Sesi web menggunakan HttpOnly Secure Cookie untuk otentikasi.
- Mutasi state (`POST`, `PUT`, `PATCH`, `DELETE`) **wajib** menyertakan header **`X-CSRF-Token`** yang dibaca dari cookie CSRF/set token yang di-set oleh backend saat login/inisialisasi session.

### 1.5 Terminologi Domain: `unit_id` (SSOT)
- **`unit_id`**: Menyatakan ID unit spesifik yang terikat pada entitas data atau transaksi operasional tertentu (misalnya unit tempat transaksi dicatat atau resource dialokasikan).
- **Info akses unit user** tidak tersimpan sebagai field langsung di `UserResponse`. Informasi tersebut didapat dari endpoint:
  ```
  GET /api/v1/users/{user_id}/roles
  ```
  Endpoint ini mengembalikan daftar `UserRoleAssignment` yang masing-masing memiliki field **`unit_id`**. Nilai `unit_id: null` berarti assignment berlaku secara global (tidak terikat unit tertentu).

---

## 2. Kontrak Error Standar & HTTP Status (SSOT)

Seluruh error dari backend dikembalikan dengan struktur JSON seragam:
```json
{
  "type": "validation_error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed.",
  "request_id": "019kj2h3k2hj2h3...",
  "details": [{"field": "username", "message": "This field is required."}]
}
```

- `type` *(str)*: Kategori error.
- `code` *(str)*: Kode error spesifik.
- `message` *(str)*: Pesan error yang dapat dibaca manusia.
- `request_id` *(str)*: ID unik request untuk keperluan pelacakan/debugging.
- `details` *(list[dict] | null)*: Daftar detail error (tiap item adalah dict), atau `null` jika tidak ada detail tambahan.

### 2.1 Definisi HTTP Status Code
- **`200 OK`**: Permintaan sukses (GET, PUT, PATCH).
- **`201 Created`**: Pembuatan resource baru sukses (POST).
- **`400 Bad Request`**: Permintaan tidak valid secara sintaksis atau parameter rusak.
- **`401 Unauthorized`**: Sesi tidak valid, kedaluwarsa, atau belum terotentikasi (wajib trigger global redirect login).
- **`403 Forbidden`**: User terotentikasi namun tidak memiliki izin/role yang cukup (tampilkan inline alert, tanpa logout paksa).
- **`404 Not Found`**: Resource yang diminta tidak ditemukan.
- **`409 Conflict`**: Konflik state data (misalnya duplikasi unique key).
- **`422 Unprocessable Entity`**: Gagal validasi data form/input (wajib dipetakan ke React Hook Form melalui `form.setError()`).
- **`500 Internal Server Error`**: Kegagalan tak terduga di server (tampilkan pesan generik dan `request_id` untuk pelacakan).

---

## 3. Auth, Session, dan Penanganan Error
Merujuk pada [02-features-users-roles-units.md](02-features-users-roles-units.md) dan [09-coding-rules.md](09-coding-rules.md):
- **401**: Sesi habis atau tidak sah; FE mengarahkan user ke halaman login.
- **403**: Akses ditolak; FE menampilkan pesan inline dan menjaga state aplikasi tetap utuh.

---

## 4. Resource Terkait
- **User Resource**: Berisi atribut `id`, `username`, `full_name`, `email`, `status`, `is_super_admin`, `must_change_password`, `created_at`, `updated_at`. Rincian bentuk payload ada di [07-example-response-shapes.md](07-example-response-shapes.md).
  > [!NOTE]
  > Info akses unit user **tidak** tersedia sebagai field di `UserResponse`. Gunakan endpoint `GET /api/v1/users/{user_id}/roles` untuk mendapatkan daftar `UserRoleAssignment` beserta `unit_id`-nya.
- **Role & Permission Resource**: RBAC role, kustom vs sistem, dan permission konstan.
- **Unit Resource**: Manajemen unit dan `unit_id`.
- **Audit Resource**: Log audit operasional dan keamanan, merujuk ke [03-audit-feature.md](03-audit-feature.md).

---

## 5. Ringkasan Dokumen
Kontrak ini adalah rujukan utama (SSOT) bagi [09-coding-rules.md](09-coding-rules.md) dan [07-example-response-shapes.md](07-example-response-shapes.md). Setiap perubahan pada struktur error, paginasi, CSRF, timestamp, atau terminologi unit wajib diperbarui di sini terlebih dahulu.

---
⬅ **Sebelumnya:** [Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 06 — Lingkup Pekerjaan & Tugas](06-frontend-scope-tasks.md)
