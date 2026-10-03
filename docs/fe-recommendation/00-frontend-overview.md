# 00 — Frontend Overview

## Tujuan
Dokumen ini mendefinisikan arah, prinsip, dan fondasi teknis untuk **admin web console** dari pos-app.  
Backend sudah berjalan untuk beberapa konteks saja; frontend dikembangkan sebagai client resmi pertama, berbasis stack modern, dan mengikuti pola yang sama dengan arsitektur backend.

## Cakupan awal
Frontend pertama dibatasi hanya untuk **admin web**. Alasannya:
- Backend saat ini sudah mendukung operasional di area Auth dan Users/Roles.
- Domain bisnis seperti Sales / Cashier / Inventory / PO belum ada implementasi backend yang cukup.
- Membangun UI untuk domain yang belum ada berisiko merusak karena kontrak API belum stabil.

Cakupan v1 frontend yang masuk akal:
- Shell aplikasi: layout, header, navigasi, unit switcher
- Autentikasi web: login / logout, CSRF, sesi
- Admin feature: Users, Roles

Fitur yang ditunda:
- Units (backend API belum tersedia)
- Audit Log (backend API belum tersedia, domain model dan pipeline Redis ada tapi endpoint GET belum ada)
- Sales / Cashier screens
- Inventory screens
- Purchase Order screens
- Finance dan produksi lanjutan lainnya

## Client resmi backend
Backend mendukung dua jenis klien:
- **Web browser** → session cookie + CSRF
- **Android** → Bearer JWT + refresh token (backend mobile auth sudah tersedia di `/auth/mobile/...`; FE Android client ditunda)

Frontend pertama hanya menangani klien web. Backend sudah mengimplementasikan full mobile auth endpoints di `/auth/mobile/...`, namun FE Android client-nya yang ditunda — bukan sisi backend. Jangan mencoba menyatukan keduanya dalam satu codebase responsif dengan asumsi identik; perbedaan koneksi, sesi, dan interaksi terlalu besar.

## Stack Teknologi Ringkas
Pemilihan stack teknologi untuk admin web frontend berfokus pada performa, ekosistem React modern, dan keselarasan tipe data dengan DTO backend. 
- Untuk rincian lengkap arsitektur dan prinsip, lihat [01-frontend-architecture.md](01-frontend-architecture.md).
- Untuk spesifikasi lengkap stack, library, dan tooling pilihan (Vite, TanStack Query, React Hook Form, Zod, Tailwind CSS, dll.), lihat [12-stack-specification.md](12-stack-specification.md).

## Prinsip fondasi
1. Backend ada sebagai sumber kebenaran. Frontend tidak boleh mengabaikan aturan server hanya karena UI menyembunyikan sesuatu.
2. Authorization tetap server-side. Frontend boleh sembunyikan fitur, tapi harus siap tangani 403 dengan baik.
3. Aturan paginasi, error handling, dan format error shape sepenuhnya merujuk pada [Dokumen 05 — Kontrak API](05-api-contract.md).
4. Navigasi dan visibilitas menu dihaluskan berdasarkan permission, bukan hardcoded role.
5. Unit/store switcher adalah elemen wajib karena assignment user bisa scoped per unit atau global.

## Hubungan dengan backend
Frontend mengikuti konvensi yang sudah ditetapkan di sisi server. Konvensi itu diturunkan ke tim frontend lewat dokumen kontrak API, bukan dengan merujuk file sumber backend.

Rincian konvensi utama, endpoint, timestamp RFC3339 UTC `Z`, error shape standar, paginasi, session cookies, dan proteksi CSRF sepenuhnya merujuk pada Single Source of Truth (SSOT) di [Dokumen 05 — Kontrak API](05-api-contract.md).


Formulasi izin, role, dan aturan bisnis tidak dirujuk dari struktur direktori backend. Tim FE harus membacanya dari API dan dari kontrak izin yang didefinisikan dalam dokumen FE.

Dokumen ini tidak menulis ulang seluruh kontrak endpoint. Ia mendefinisikan arah, pilihan teknis, dan pola UI/UX yang akan diterapkan.

## Struktur dokumen lanjutan
Dokumen ini adalah pintu masuk. Seri dokumen rekomendasi frontend selengkapnya meliputi:
- [01-frontend-architecture.md](01-frontend-architecture.md) — Arsitektur inti, state management, dan error handling
- [02-features-users-roles-units.md](02-features-users-roles-units.md) — Spesifikasi fitur Users, Roles, dan Units
- [03-audit-feature.md](03-audit-feature.md) — Spesifikasi fitur Audit Log & tracking
- [04-uiux-best-practices.md](04-uiux-best-practices.md) — Panduan UI/UX, tata letak, dan aksesibilitas
- [05-api-contract.md](05-api-contract.md) — Kontrak integrasi API backend dan standar format
- [06-frontend-scope-tasks.md](06-frontend-scope-tasks.md) — Ruang lingkup tugas dan backlog implementasi
- [07-example-response-shapes.md](07-example-response-shapes.md) — Contoh struktur JSON response API
- [08-tailwind-guidance.md](08-tailwind-guidance.md) — Panduan styling Tailwind CSS & design token
- [09-coding-rules.md](09-coding-rules.md) — Standar penulisan kode dan konvensi
- [10-frontend-folder-structure.md](10-frontend-folder-structure.md) — Struktur direktori dan modular feature-based layout
- [11-tooling-and-biome.md](11-tooling-and-biome.md) — Konfigurasi tooling, build, linter, dan formatter
- [12-stack-specification.md](12-stack-specification.md) — Spesifikasi detail stack teknologi & library pilihan

---
📑 **[Kembali ke Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md)
