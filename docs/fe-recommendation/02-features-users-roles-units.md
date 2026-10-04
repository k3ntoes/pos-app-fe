# 02 — Features: Users, Roles, Units & Permissions (SSOT)

> [!NOTE]
> Spesifikasi fungsional untuk modul Users, Roles, Units, dan Permissions selaras dengan implementasi backend DTO dan aturan ADR.

---

## 1. Modul Users (`/api/v1/users`)
- **List Users (`GET /api/v1/users`)**: Mendukung paginasi (`page`, `page_size`) dan unit-scoped permission (`USERS_READ`). Mengembalikan `UserListResponse`.
- **Create User (`POST /api/v1/users`)**: Membutuhkan permission `USERS_MANAGE`. Payload `CreateUserRequest` (`username`, `email`, `full_name`). Mengembalikan `CreateUserResponse` (201 Created) yang menyertakan field **`temporary_password`** (wajib ditampilkan via modal dialog dengan tombol *Copy to Clipboard*).
- **Update User Status (`PATCH /api/v1/users/{user_id}/status`)**: Mengubah status pengguna (`ACTIVE`, `INACTIVE`, `SUSPENDED`) via `UpdateUserStatusRequest`.
- **Reset Password (`POST /api/v1/users/{user_id}/reset-password`)**: Menghasilkan password sementara baru dan mengembalikan `ResetPasswordResponse` (`temporary_password`, `must_change_password: true`).
- **Self Profile Update (`PATCH /api/v1/users/me`)**: Memungkinkan user memperbarui `full_name` atau `email` mereka sendiri.
- **Admin Update User (`PATCH /api/v1/users/{user_id}`)**: Memperbarui profil user oleh admin (`AdminUpdateUserRequest`).

---

## 2. Modul Roles & Permissions (`/api/v1/roles`, `/api/v1/permissions`)
- **List & Detail Roles (`GET /api/v1/roles`, `GET /api/v1/roles/{role_id}`)**: Mengelola role RBAC dengan paginasi dan filter `is_system`.
- **Create & Update Role (`POST /api/v1/roles`, `PUT /api/v1/roles/{role_id}`)**: Manajemen nama, deskripsi, dan kode role.
- **Update Role Permissions (`PUT /api/v1/roles/{role_id}/permissions`)**: Memperbarui daftar permission granular (`list[str]`).
- **System Role & ADR Compliance**:
  - Role sistem (`is_system=true`) dilindungi dari penghapusan sembarangan.
  - **ADR-0003**: Penugasan role sistem eksklusif dikendalikan oleh Super Admin.
  - **ADR-0004**: Single Default Super Admin Role diinisialisasi saat bootstrap sistem.

---

## 3. Modul Units (`/api/v1/units`)
- **Unit CRUD (`GET /api/v1/units`, `POST /api/v1/units`, `GET /api/v1/units/{id}`, `PATCH /api/v1/units/{id}`, `DELETE /api/v1/units/{id}`)**:
  - `CreateUnitRequest`: `code` (pattern alfanumerik/dash), `name`, `address`, `is_active`.
  - `UpdateUnitRequest`: Memperbarui nama, alamat, atau status aktif unit.

---

## 4. User Role Assignments (`/api/v1/users/{user_id}/roles`)
- **List Assignments (`GET /api/v1/users/{user_id}/roles`)**: Mengembalikan daftar `UserRoleAssignmentResponse` beserta informasi `unit_id`.
- **Assign Role (`POST /api/v1/users/{user_id}/roles`)**: Payload `AssignRoleRequest` (`role_id`, `unit_id`). `unit_id` dapat berupa UUID unit spesifik, string `"GLOBAL"`, atau `null`.
- **Unassign Role (`DELETE /api/v1/users/{user_id}/roles/{assignment_id}`)**: Menghapus penugasan role (204 No Content).

---
⬅ **Sebelumnya:** [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 03 — Fitur Audit](03-audit-feature.md)
