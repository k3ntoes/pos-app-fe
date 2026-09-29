# 06 — Frontend Scope dan Tasks

Dokumen ini memecah cakupan frontend ke dalam ruang lingkup yang bisa ditangani secara berurutan. Ini bukan bug tracker; ini panduan ruang lingkup yang bisa dikonversi ke task oleh tim, dengan rujukan langsung ke dokumen spesifikasi seperti [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md), [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md), [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md), dan [Dokumen 05 — Kontrak API Backend](05-api-contract.md).

Aturan umum:
- setiap fitur harus punya list, detail, dan form bila relevan
- semua list wajib pagination dan state konsisten
- semua mutasi wajib punya feedback dan invalidation
- izin dan status harus terlihat, bukan tersembunyi

---

## 0. Pre-FE setup
Deliverables awal sebelum masuk fitur (didukung oleh panduan di [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md) dan [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md)):
- project Vite + React siap
- TypeScript dan Tailwind terkonfigurasi (styling foundation sesuai [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md))
- design token dasar ada: warna utama, netral, semantik, spacing, radius, typografi
- query client, router, dan toast/notification terinisialisasi
- error mapper dasar ada
- CSRF helper ada untuk web login

Konteks FE tidak boleh dimulai dari nol di tengah fitur.

---

## 1. Auth shell
Tujuan: aplikasi bisa login, tahu siapa user, dan siap navigasi. (Sesuai arsitektur auth dan transport pada [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) serta [Dokumen 05 — Kontrak API Backend](05-api-contract.md)).

Deliverables:
- halaman login web
- CSRF handling terintegrasi
- setelah login, fetch identitas dan konteks awal
- menyimpan (secara aman dan sesuai kebijakan) konteks sesi yang sah
- logout masuk akal dan membersihkan state lokal
- 401 ditangani: arahkan/minta login kembali
- 403 tidak dianggap login baru

Screen yang masuk:
- Login
- Identity setelah login
- Logout flow

Fitur ini adalah fondasi untuk all subsequent screens.

---

## 2. Navigasi dan shell admin
Tujuan: admin web terasa seperti aplikasi utuh (menggunakan struktur komponen dari [Dokumen 10 — Struktur Folder & Komponen Frontend](10-frontend-folder-structure.md)).

Deliverables:
- header stabil dengan unit switcher
- navigasi utama: Users, Roles, Units, Audit Log
- navigasi dikendalikan permission
- layout konten yang konsisten di semua halaman

Prinsip:
- unit switcher wajib ada
- menu tidak muncul sembarangan
- halaman dalam punya konteks dan cara kembali

---

## 3. Users feature
Deliverables (mengacu pada modul pengguna dan manajemen akses di [Dokumen 02 — Modul Users, Roles, & Units](02-features-users-roles-units.md)):
- user list dengan pagination, search/filter bila server support
- user detail
- form create/edit user
- status user: ACTIVE / SUSPENDED / DEACTIVATED
- aksi yang diizinkan: suspend, reactivate, deactivate, assignment bila relevan

Screen ini mengajarkan pattern list/detail/form.

---

## 4. Roles feature
Deliverables (mengacu pada [Dokumen 02 — Modul Users, Roles, & Units](02-features-users-roles-units.md)):
- role list
- role detail
- role permission editor bila diizinkan
- tanda sistem vs kustom
- aturan hapus role kustom hanya bila tidak ada assignment

Screen ini mengajarkan relationship-oriented editing.

---

## 5. Units feature
Deliverables (mengacu pada [Dokumen 02 — Modul Users, Roles, & Units](02-features-users-roles-units.md)):
- unit list
- unit context switcher di header
- tindakan unit bila diizinkan

Unit adalah batas data; layar lain perlu konteks ini.

---

## 6. Audit feature
Deliverables (mengacu pada detail fitur di [Dokumen 03 — Fitur Audit Log](03-audit-feature.md)):
- audit list terpaginasikan
- filter: rentang waktu, aktor, tipe aksi, unit, pencarian sederhana bila support
- urutan penelusuran kronologis
- detail peristiwa bila relevan
- izin baca audit dihormati

Audit dibangun cukup awal karena ini concern utama operasional dan keamanan.

---

## 7. Pencoretan pola umum
Setelah fitur pertama jadi, FE wajib mencoreng pola umum ini (mempertimbangkan [Dokumen 04 — UI/UX Best Practices](04-uiux-best-practices.md) dan [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md)):
- query key yang konsisten
- error mapper yang sama di semua layar
- table abstraction yang dipakai berulang
- form abstraction dasar
- loading/empty/error state yang mirip di semua list
- Toast/feedback yang sama di semua mutasi

Tanpa ini, setiap fitur terlihat berdiri sendiri dan susah dipelihara.

---

## 8. Yang ditunda
Tidak masuk ruang lingkup awal (seperti dijelaskan pada [Dokumen 00 — Frontend Overview](00-frontend-overview.md)):
- Sales / Cashier
- Inventory
- Purchase Order
- Finance screens lanjutan

Alasannya sama seperti di dokumen overview: domain belum merupakan cakupan backend awal.

---

## Ringkasan ruang lingkup
Mulai dari setup ([Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md)), lalu auth shell ([Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) & [Dokumen 05 — Kontrak API Backend](05-api-contract.md)), lalu navigasi, lalu Users/Roles/Units ([Dokumen 02 — Modul Users, Roles, & Units](02-features-users-roles-units.md)) dan Audit ([Dokumen 03 — Fitur Audit Log](03-audit-feature.md)). Setiap fitur wajib punya list/detail/form bila relevan, pagination, feedback, dan visibility berbasis izin. Jangan mulai fitur baru sebelum pola umum tercoreng.

---
⬅ **Sebelumnya:** [Dokumen 05 — Kontrak API Backend](05-api-contract.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 07 — Bentuk Contoh Respon API](07-example-response-shapes.md)

