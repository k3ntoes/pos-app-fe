# 12 — Spesifikasi Stack Definitif

Dokumen ini adalah spesifikasi dependensi definitif & *architectural boundaries* untuk frontend admin web POS. 

Tujuannya:
- memastikan tidak ada dependensi ganda atau redundan,
- menetapkan batasan arsitektural yang tegas,
- merujuk langsung ke bab [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md), [Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md), [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md), dan [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md).

---

## 1. Tabel Manifest Dependensi Inti

Berikut adalah daftar pustaka definitif yang diizinkan dalam project frontend:

| Pustaka / Tools | Versi / Status | Peran / Tanggung Jawab | Alasan Pemilihan (Rationale) |
| :--- | :--- | :--- | :--- |
| **Bun** | Terkini (Runtime) | Package manager, test runner, & script execution | Kecepatan instalasi dan eksekusi skrip yang superior dibanding npm/yarn. |
| **Vite** | Latest stable | Build tool & bundler | Standar industri untuk SPA React dengan HMR yang sangat cepat. |
| **React** | v18+ | Library UI fundamental | Komponen deklaratif, ekosistem luas, dan kestabilan jangka panjang. |
| **TypeScript** | Strict mode | Bahasa pemrograman / type checking | Menjamin type safety end-to-end dari API kontrak hingga komponen UI. |
| **React Router** | v6+ | Routing & navigation | Routing modular berbasis nested routes dan perlindungan route (route guard). |
| **TanStack Query** | v5+ | Server state management | Caching otomatis, refetching, pagination, dan invalidasi mutasi yang handal. |
| **TanStack Table** | v8+ | Data presentation (Tabel) | Headless table berkinerja tinggi untuk server-side pagination, sorting, & filtering. |
| **React Hook Form** | v7+ | Form state & performance | Manajemen state form tanpa re-render berlebihan (uncontrolled inputs). |
| **Zod** | Latest | Skema validasi & inferensi tipe | Validasi runtime yang selaras sempurna dengan type inference TypeScript. |
| **Tailwind CSS** | v3+ / v4 | Styling framework | Utilitas CSS yang konsisten, cepat, dan mudah di-maintain. |
| **Lucide React** | Latest | Iconography | Set icon SVG ringan yang seragam dan konsisten. |
| **date-fns** / **dayjs** | Latest | Manipulasi & format tanggal | Format timestamp UTC (`Z`) ke lokal dengan ringan dan modular. |
| **Sonner** / Toast | Latest | Notifikasi kilat (Toast) | Feedback mutasi dan error satu kali tampil yang bersih. |
| **Biome** | Latest | Linter & Formatter | Tooling tunggal yang sangat cepat untuk format dan linting kode. |

---

## 2. Architectural Boundaries yang Tegas

Untuk menjaga kesederhanaan dan performa, batasan arsitektur berikut bersifat **mutlak**:

1. **Larangan Redux / Zustand (Kecuali Syarat Khusus)**:
   - Jika server state sudah ditangani oleh **TanStack Query**, dilarang menggunakan global state manager seperti Redux atau Zustand untuk data dari server.
   - UI state yang bersifat lokal atau temporer harus diselesaikan menggunakan React local state (`useState`, `useReducer`), React Context terbatas, atau **URL Search Params** (untuk filter tabel, pagination, dan tab aktif).
   - Zustand hanya boleh dipertimbangkan jika kompleksitas client-state global murni meningkat secara masif dan terbukti tidak cukup dengan React Context.

2. **Keterikatan Lapisan (Layering Boundaries)**:
   - Lapisan API (`api/`) murni melakukan HTTP request dan interceptor tanpa komponen UI ([Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md)).
   - Komponen UI tidak boleh melakukan fetch mentah; harus melalui custom hook ([Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md)).
   - Styling wajib mematuhi design token Tailwind tanpa menyelipkan inline hex acak ([Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md)).

---

## 3. Integrasi & Rujukan Antar Dokumen
Spesifikasi ini terhubung erat dengan dokumen panduan lainnya:
- **Arsitektur & Alur Data:** Rujuk [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md).
- **Modul & Fitur:** Rujuk [Dokumen 02 — Modul Pengguna, Peran, & Unit](02-features-users-roles-units.md) dan [Dokumen 03 — Modul Audit Log](03-audit-feature.md).
- **Panduan UI/UX & API:** Rujuk [Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md), [Dokumen 05 — Kontrak API](05-api-contract.md), dan [Dokumen 07 — Contoh Bentuk Respons API](07-example-response-shapes.md).
- **Aturan Kode & Struktur:** Rujuk [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md), [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md), dan [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md).

---

## 4. Ringkasan
Dokumen ini menetapkan batasan definitif agar pengembangan frontend tetap ramping, cepat, dan konsisten tanpa penambahan dependensi spekulatif yang melanggar prinsip *lean architecture* ([Dokumen 00 — Ikhtisar & Orientasi](00-frontend-overview.md)).

---
⬅ **Sebelumnya:** [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md) | 📑 **[Indeks Dokumen](README.md)**
