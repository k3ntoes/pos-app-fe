# 00 — Frontend Overview & System Context (SSOT)

> [!NOTE]
> Dokumen ini adalah ikhtisar umum (Overview) arsitektur frontend POS Application, yang merujuk pada Single Source of Truth (SSOT), Context Map, Architecture Decision Records (`docs/adr/`), serta implementasi backend FastAPI yang sebenarnya.

---

## 1. Visi & Tujuan Sistem
POS Application dirancang sebagai sistem Point of Sales (POS) enterprise-grade yang modular, aman, dan terukur. Backend dibangun menggunakan arsitektur Domain-Driven Design (DDD) dengan FastAPI (Python), sementara frontend dirancang sebagai Single Page Application (SPA) modern berbasis React, TypeScript, Tailwind CSS, dan TanStack Query.

---

## 2. Bounded Contexts (Merujuk `CONTEXT-MAP.md`)
Sistem dibagi menjadi beberapa bounded contexts yang terisolasi namun terintegrasi secara bersih:
1. **Auth Context**: Mengelola sesi autentikasi, login web (cookie-based), login mobile (JWT Bearer), perubahan password, logout, dan rate limiting.
2. **Users Context**: Manajemen data pengguna, profil mandiri (`/me`), status pengguna (`ACTIVE`, `INACTIVE`, `SUSPENDED`), dan reset password.
3. **Roles Context**: Manajemen role RBAC (Role-Based Access Control), kustom vs sistem (`is_system`), dan pemetaan permission granular.
4. **Units Context**: Manajemen unit/cabang toko (`code`, `name`, `address`, `is_active`), serta keterikatan operasional via `unit_id`.
5. **Audit Context**: Logging immutable di tingkat backend via Redis Stream dan dedicated audit database untuk ketertelusuran keamanan dan aktivitas operasional.

---

## 3. Arsitektur Dual-Auth (Web vs Mobile)
Frontend harus mengakomodasi dua model autentikasi yang didukung backend:
- **Web Admin Portal**: Menggunakan HttpOnly Secure Cookies (`pos_session` untuk identitas sesi dan `pos_csrf` untuk proteksi CSRF). Header **`X-CSRF-Token`** wajib disertakan pada setiap request mutasi state (`POST`, `PUT`, `PATCH`, `DELETE`).
- **Mobile / API Client**: Menggunakan header **`Authorization: Bearer <access_token>`** dengan token JWT access (masa berlaku 15 menit / 900 detik) dan mekanisme refresh token via endpoint `/auth/mobile/refresh`.

---

## 4. Kepatuhan pada ADR (Architecture Decision Records)
- **ADR-0001**: Pemilihan library inti (React, TanStack Query, Tailwind CSS, React Hook Form, Zod).
- **ADR-0002**: *Must-Change-Password Restricted Session*. Jika `must_change_password: true` pada response login/session, frontend wajib mengarahkan user atau menampilkan modal wajib ganti password sebelum dapat mengakses fitur aplikasi lainnya.
- **ADR-0003**: *System Role Assignment Super Admin Only*. Penugasan role sistem eksklusif dikendalikan oleh Super Admin.
- **ADR-0004**: *Single Default Super Admin Role*. Struktur bootstrap memastikan adanya akun Super Admin default pada saat inisialisasi sistem.

---

## 5. Ringkasan Dokumen
Dokumen ini menjadi landasan konseptual untuk seluruh spesifikasi frontend lanjutan (arsitektur, fitur, UI/UX, dan kontrak API).

---
📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md)
