# 04 — UI/UX Best Practices & Component Guidelines (SSOT)

> [!NOTE]
> Panduan implementasi UI/UX, alur dialog khusus (`must_change_password`), badge status, dan picker komponen berbasis Tailwind CSS.

---

## 1. UX Flow Khusus: Wajib Ganti Password (ADR-0002)
- **Modal Blokade Wajib Ganti Password**: Jika response login atau `/auth/me` mengembalikan `must_change_password: true`, frontend wajib menampilkan dialog modal ubah password yang tidak dapat ditutup (*blocking*).
- Form meminta `current_password` dan `new_password`, kemudian memanggil `/auth/change-password`. Setelah sukses, modal tertutup dan state aplikasi dilanjutkan.

---

## 2. Dialog Temporary Password & Copy-to-Clipboard
- Saat admin membuat user baru (`POST /api/v1/users`) atau mereset password (`POST /api/v1/users/{id}/reset-password`), backend mengembalikan password sementara (`temporary_password`).
- Frontend wajib menyajikan dialog sukses yang menampilkan password tersebut dengan tombol **"Copy to Clipboard"** agar admin dapat menyampaikannya kepada pengguna ybs.

---

## 3. Visual Badge & Status Styling
- **User Status**:
  - `ACTIVE`: Badge hijau (Emerald).
  - `INACTIVE`: Badge abu-abu (Slate).
  - `SUSPENDED`: Badge merah (Rose).
- **Unit Status (`is_active`)**:
  - `true`: Badge aktif hijau.
  - `false`: Badge non-aktif abu-abu.

---

## 4. Role & Unit Picker Component
- Pada form penugasan role (`AssignRoleRequest`), sediakan pemilih unit yang mendukung opsi **Global** (`"GLOBAL"` atau `null`) serta daftar unit aktif untuk unit-scoped assignment.

---
⬅ **Sebelumnya:** [Dokumen 03 — Fitur Audit](03-audit-feature.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 05 — Kontrak API](05-api-contract.md)
