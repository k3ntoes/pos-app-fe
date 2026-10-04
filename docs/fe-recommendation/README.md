# Dokumen Rekomendasi Frontend — POS Application (SSOT Index)

Selamat datang di pusat dokumentasi rekomendasi arsitektur, kontrak API, dan panduan implementasi Frontend untuk **POS Application**. Seluruh dokumen di bawah ini disusun sebagai **Single Source of Truth (SSOT)** yang sepenuhnya selaras dengan arsitektur backend FastAPI, Context Map, dan Architecture Decision Records (`docs/adr/`).

---

## 📑 Daftar Isi Dokumen (00 s.d. 12)

1. **[00 — Frontend Overview & System Context](00-frontend-overview.md)**
   - Ikhtisar sistem, bounded contexts (Auth, Users, Roles, Units, Audit), arsitektur dual-auth (Web vs Mobile), dan kepatuhan pada ADRs.
2. **[01 — Frontend Architecture & Client Configuration](01-frontend-architecture.md)**
   - Konfigurasi HTTP client (`withCredentials`, CSRF header, interceptors), session guard, dan penanganan `must_change_password` (ADR-0002).
3. **[02 — Features: Users, Roles, Units & Permissions](02-features-users-roles-units.md)**
   - Spesifikasi fungsional manajemen User (temporary password, reset, status), Roles (RBAC, system role, ADR-0003/0004), Units, dan User Role Assignments.
4. **[03 — Audit Feature & Traceability](03-audit-feature.md)**
   - Arsitektur audit backend (Redis Stream, consumer, immutable logs) dan ketertelusuran frontend via header `X-Request-ID`.
5. **[04 — UI/UX Best Practices & Component Guidelines](04-uiux-best-practices.md)**
   - Panduan UI/UX, modal blokade wajib ganti password, dialog *copy-to-clipboard* password sementara, dan badge status warna.
6. **[05 — API Contract for Admin Web & Mobile (SSOT)](05-api-contract.md)**
   - Kontrak API lengkap: Base URL, timestamp ISO8601, format paginasi, error schema standar (`ErrorResponse`), dan daftar seluruh endpoint FastAPI.
7. **[06 — Frontend Scope & Implementation Tasks](06-frontend-scope-tasks.md)**
   - Rincian tugas implementasi (task breakdown) dari fondasi hingga modul fitur lengkap.
8. **[07 — Example Response Shapes (JSON Fixtures Catalog)](07-example-response-shapes.md)**
   - Katalog konkret payload JSON (fixtures) untuk request dan response seluruh endpoint backend.
9. **[08 — Tailwind CSS & UI Component Styling Guidance](08-tailwind-guidance.md)**
   - Standarisasi warna badge status, styling modal khusus, tabel data, dan form controls.
10. **[09 — Frontend Coding Rules & TypeScript Standards](09-coding-rules.md)**
    - Aturan penulisan kode, TypeScript strict mode, Zod validation schemas, dan isolasi custom hooks TanStack Query.
11. **[10 — Frontend Folder Structure & Modular Organization](10-frontend-folder-structure.md)**
    - Struktur direktori modular berbasis *feature-driven bounded contexts*.
12. **[11 — Tooling, Linter, & Biome Configuration](11-tooling-and-biome.md)**
    - Standar tooling modern, Biome formatter & linter, serta TypeScript 5.x.
13. **[12 — Tech Stack Specification](12-stack-specification.md)**
    - Spesifikasi pustaka inti (React, Vite/Next.js, Tailwind CSS, TanStack Query, React Hook Form + Zod, Lucide).

---
*Dokumen ini diperbarui secara berkala sesuai dengan evolusi backend dan keputusan arsitektur proyek.*
