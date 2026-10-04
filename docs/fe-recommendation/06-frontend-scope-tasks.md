# 06 — Frontend Scope & Implementation Tasks (SSOT)

> [!NOTE]
> Rincian tugas (task breakdown) dan ruang lingkup implementasi frontend yang selaras dengan seluruh kapabilitas backend, kontrak API, dan ADR proyek.

---

## 1. Ruang Lingkup & Task Breakdown

### A. Core Foundation & API Client
- [ ] **API Client Setup**: Konfigurasi Axios/Fetch dengan `withCredentials: true` (`credentials: 'include'`).
- [ ] **CSRF & Request ID Interceptors**: Otomatis menyuntikkan header `X-CSRF-Token` (dari cookie `pos_csrf`) untuk request mutasi (`POST`, `PUT`, `PATCH`, `DELETE`) dan header `X-Request-ID`.
- [ ] **Unified Error Handling**: Interceptor global untuk memetakan `ErrorResponse` backend (`type`, `code`, `message`, `request_id`, `details`) ke UI toast atau form validation errors.

### B. Authentication & Session Guard
- [ ] **Web Login**: Form login (`POST /auth/login`), penyimpanan token CSRF di memori state, handling cookie `pos_session`.
- [ ] **Mobile Login (Opsional/Client)**: Support Bearer Token (`POST /auth/mobile/login`, `/refresh`).
- [ ] **Session Validation**: Query `GET /auth/me` saat inisialisasi aplikasi.
- [ ] **Blocking Change Password Flow**: Pengecekan flag **`must_change_password`** (ADR-0002). Jika `true`, tampilkan modal ubah password blocking sebelum navigasi diizinkan.
- [ ] **Logout**: Pemanggilan `POST /auth/logout` dan pembersihan state lokal.

### C. Users Feature (`/api/v1/users`)
- [ ] **User List Table**: Integrasi `GET /api/v1/users` dengan paginasi (`page`, `page_size`, `meta.total_pages`) dan badge status (`ACTIVE`, `INACTIVE`, `SUSPENDED`).
- [ ] **User Creation Modal**: Form `CreateUserRequest` (`username`, `email`, `full_name`). Menampilkan dialog sukses berisi **`temporary_password`** dengan tombol *Copy to Clipboard*.
- [ ] **User Status Management**: Aksi `PATCH /api/v1/users/{id}/status`.
- [ ] **Password Reset Modal**: Aksi `POST /api/v1/users/{id}/reset-password` dan dialog temporary password baru.
- [ ] **Self Profile Update**: Form `PATCH /api/v1/users/me` untuk update profil mandiri.
- [ ] **Admin Profile Update**: Form `PATCH /api/v1/users/{id}` untuk update oleh admin.

### D. Roles & Permissions Feature (`/api/v1/roles`, `/api/v1/permissions`)
- [ ] **Role List & Detail**: Integrasi `GET /api/v1/roles` dan `GET /api/v1/roles/{role_id}`.
- [ ] **Role CRUD**: Form pembuatan (`CreateRoleRequest`) dan penyuntingan (`UpdateRoleRequest`).
- [ ] **Permission Matrix Editor**: Integrasi `GET /api/v1/permissions` dan `PUT /api/v1/roles/{role_id}/permissions` dengan checklist interaktif.
- [ ] **System Role Badge**: Menandai role dengan `is_system=true` dan menerapkan pembatasan akses sesuai ADR-0003.

### E. Units Feature (`/api/v1/units`)
- [ ] **Unit List & Search**: Integrasi `GET /api/v1/units` dengan filter pencarian dan status aktif.
- [ ] **Unit CRUD**: Form pembuatan (`CreateUnitRequest` dengan validasi pattern `code`) dan penyuntingan (`UpdateUnitRequest`).
- [ ] **Unit Deletion**: Aksi penghapusan unit (`DELETE /api/v1/units/{id}`).

### F. User Role Assignments (`/api/v1/users/{user_id}/roles`)
- [ ] **Assignments View**: Tabel daftar role dan unit yang diemban oleh user (`GET /api/v1/users/{user_id}/roles`).
- [ ] **Assign Role Modal**: Form penugasan role (`AssignRoleRequest`) dengan selector role dan unit picker (mendukung unit UUID, `"GLOBAL"`, atau `null`).
- [ ] **Unassign Role Action**: Aksi penghapusan penugasan role (`DELETE /api/v1/users/{user_id}/roles/{assignment_id}`).

---
⬅ **Sebelumnya:** [Dokumen 05 — Kontrak API](05-api-contract.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 07 — Contoh Bentuk Respons](07-example-response-shapes.md)
