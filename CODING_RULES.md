# POS App Frontend — Definitive Coding Rules & Standards

> [!IMPORTANT]
> Dokumen ini adalah panduan dan aturan baku (Coding Rules) untuk pengembangan frontend POS Admin Web. Seluruh kontributor wajib mematuhi spesifikasi definitif, arsitektur, penanganan error, manajemen state, dan aturan tooling yang tertera di dokumen ini agar selaras 100% dengan dokumen rekomendasi fe (`docs/fe-recommendation/`), ADR (`docs/adr/`), dan [DESIGN.md](./DESIGN.md).

---

## 1. Stack Teknologi Definitif & Spesifikasi Manifest

Frontend POS dibangun dengan stack teknologi modern yang telah dikunci dalam ADR dan spesifikasi arsitektur:

1. **Runtime & Package Manager**: **Bun** (eksekusi super cepat, script runner, dan package management).
2. **Build Tool & Bundler**: **Vite** (standar SPA React dengan HMR optimal).
3. **Library UI & Bahasa**: **React v18+** dengan **TypeScript (Strict Mode)** untuk type safety end-to-end tanpa tipe `any` implisit.
4. **Routing & Navigasi**: **React Router v6+** (nested routes dan route guards berbasis permission).
5. **Server State Management**: **TanStack Query v5** (caching otomatis, invalidasi mutasi, zero manual server-state duplication).
6. **Data Presentation**: **TanStack Table v8** (headless table berperforma tinggi untuk server-side pagination, sorting, dan filtering).
7. **Form State & Validasi**: **React Hook Form v7+** dipadukan dengan **Zod** schema validation (selaras dengan DTO backend).
8. **Styling & UI Components**: 
   - **Tailwind CSS v4** dengan pendekatan CSS-first `@theme` (tanpa `tailwind.config.js`). Rujuk [DESIGN.md](./DESIGN.md) untuk spesifikasi palet warna, tipografi, dan token lengkap.
   - **shadcn/ui** menggunakan **Base UI Engine** (`npx shadcn@latest init --base base`) sesuai ADR 0002.
9. **Tooling, Linting & Formatting**: **Biome** (linter dan formatter tunggal berkecepatan tinggi menggantikan ESLint/Prettier).
10. **Utilitas Tambahan**: **Sonner** (Toast notifications), **Lucide React** (ikon SVG konsisten), dan manipulasi tanggal standar ringan (`date-fns`/`dayjs`).

---

## 2. Batasan Arsitektur & Modularitas Kode

1. **Batas Ukuran File (LOC Limit)**:
   - Target ideal: **150 – 250 LOC** per file.
   - Hard ceiling: **Max 300 LOC**. Wajib melakukan pemecahan modul (modularisasi) jika mendekati batas.
2. **Larangan Duplikasi State**:
   - **Dilarang keras** menduplikasi server state (hasil query API) ke dalam React local state (`useState` / Redux store manual). Seluruh data dari backend wajib dikelola oleh **TanStack Query**.
   - UI state navigasional dan filter wajib diletakkan di **URL Query Params**. UI state lokal volatil (modal open/close, tab aktif) menggunakan `useState`.
3. **Pemisahan Lapisan (Layering Boundaries)**:
   - Lapisan API (`api/`) murni melakukan HTTP request dan interceptor tanpa komponen UI.
   - Komponen presentasional (`components/`) murni merender UI dan memancarkan aksi (`onAction`).
   - Custom hooks (`hooks/`) menjembatani data fetching, mutasi, dan transformasi state bisnis.

---

## 3. Kontrak API, Response Shapes, & Penanganan Error HTTP

Backend FastAPI bertindak sebagai **Single Source of Truth (SSOT)** untuk kontrak data, format waktu UTC (`Z`), dan paginasi.

### 3.1 Standar Format Data & Kontrak API
- **Format Waktu**: Seluruh timestamp menggunakan format ISO 8601 UTC dengan akhiran `Z` (contoh: `2026-10-03T09:00:00Z`).
- **Naming Convention**: Properti JSON menggunakan `snake_case` untuk menyamakan DTO FastAPI backend.
- **Paginasi Standar**: Response list menyertakan metadata (`total`, `page`, `size`, `pages`) dengan parameter query `page` dan `size`.

### 3.2 HTTP Error Handling Rules
1. **HTTP 401 (Unauthorized)**:
   - Klien **wajib** melakukan redirect global ke halaman login (`/login`) dan membersihkan sesi. Tidak boleh menelan error 401 secara diam-diam.
2. **HTTP 403 (Forbidden)**:
   - Klien menampilkan **inline alert / toast warning** (menggunakan Sonner) bahwa akses ditolak.
   - **Dilarang keras** melakukan logout atau redirect ke login untuk error 403 (karena user sudah terotentikasi, namun kurang izin pada resource tersebut).
3. **HTTP 422 (Unprocessable Entity / Validation Error)**:
   - Frontend **wajib** memetakan payload `error.details` ke React Hook Form menggunakan metode **`form.setError()`** agar pesan error tampil langsung di bawah field yang bersangkutan.

---

## 4. Manajemen Unit Context & Effective Permissions

1. **Unit Context Storage (ADR 0004)**:
   - Active Unit (toko/cabang aktif) disimpan di **`localStorage`** untuk persistensi lintas refresh, dan di-mirror ke **React Context** sebagai *single source of truth* in-memory selama sesi.
2. **Eager Permission Loading (ADR 0003)**:
   - Endpoint dasar `/auth/me` hanya mengembalikan identitas dasar (tanpa permissions/roles).
   - Setelah `/auth/me` sukses, frontend **wajib** langsung mengambil data roles via `GET /api/v1/users/{id}/roles`, mengagregasi **Effective Permissions** berdasarkan Active Unit yang dipilih, dan menyimpannya di `AuthContext`.
   - Perubahan Active Unit melalui **Unit Switcher** di header wajib memicu recompute Effective Permissions secara sinkronus.

---

## 5. Struktur Folder Frontend Standar

Struktur direktori wajib mematuhi standar modular:
- `src/app/`: Root application provider, router, dan layout utama.
- `src/components/`: Komponen UI reusable global (shadcn/ui base).
- `src/features/`: Modul fitur bisnis (auth, users, roles, units, products, transactions, audit).
- `src/hooks/`: Custom hooks global aplikasi.
- `src/services/`: HTTP client interceptor dan endpoint API wrappers.
- `src/types/`: Definisi TypeScript types & interfaces global.
- `src/utils/`: Fungsi utilitas helper murni (formatters, date handlers).

---

## 6. Aturan Tooling, Biome, & Tailwind CSS v4

1. **Biome Configuration**:
   - Gunakan format dan linting dari Biome dengan indentasi spasi 2, tanda kutip ganda/tunggal konsisten, serta sorting imports otomatis.
   - Jalankan pemeriksaan linter sebelum melakukan commit atau push.
2. **Tailwind CSS v4 CSS-First `@theme`**:
   - Definisikan custom design tokens langsung di file CSS utama menggunakan direktif `@theme` (menggantikan konfigurasi JavaScript lama). Rujuk spesifikasi [DESIGN.md](./DESIGN.md).
   - Hindari penggunaan inline hex acak; gunakan kelas utilitas Tailwind atau variabel token tema yang telah ditetapkan.

---

## 7. Standar Engineering, Issue Tracking, & Kualitas Kode

1. **Task Tracking (`bd` / Beads)**:
   - Wajib menggunakan Beads (`bd`) untuk seluruh pelacakan tugas (`bd ready`, `bd update <id> --claim`, `bd close <id>`). Dilarang membuat TODO list markdown manual.
2. **Code Intelligence & Impact Analysis (GitNexus)**:
   - **Wajib** menjalankan impact analysis (`impact({target: symbolName, direction: "upstream"})`) sebelum mengedit fungsi, kelas, atau method.
   - **Wajib** menjalankan `detect_changes()` sebelum commit untuk memverifikasi blast radius.
3. **Prinsip Minimalis & YAGNI (Ponytail)**:
   - Terapkan solusi paling minimal, bersih, dan langsung bekerja (YAGNI). Gunakan fitur native platform dan pustaka standar sebelum membuat abstraksi atau dependensi kustom yang berlebihan.
4. **Verifikasi Sesi & Penutupan Tugas**:
   - Pastikan seluruh perubahan divalidasi dengan pengujian lokal dan pemindaian `detect_changes()` sebelum diserahkan kepada root agent.

---

## 8. Git Branching & Konvensi Commit

1. **Conventional Commits**:
   - Gunakan format commit standar: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
   - Setiap commit harus merujuk ke task Beads yang relevan apabila memungkinkan.
2. **Pre-commit Quality Gates**:
   - Jalankan Biome check dan pastikan tidak ada error type-checking TypeScript sebelum melakukan push atau handoff.

---

## 9. Penanganan Error Kritis & Fallback UI

1. **Error Boundaries**:
   - Setiap modul fitur utama wajib dibungkus dengan Error Boundary untuk mencegah crash total pada aplikasi SPA.
2. **Loading & Empty States**:
   - Setiap komponen data-fetching wajib menyediakan indikator loading (Skeleton/Spinner) dan empty state yang ramah pengguna.

---

## 10. Performance Optimization & Bundle Hygiene

1. **Code Splitting & Lazy Loading**:
   - Gunakan `React.lazy` dan `Suspense` untuk memuat halaman route besar secara asinkron guna mempercepat initial load time.
2. **Dependency Audit**:
   - Hindari penambahan dependensi npm baru tanpa persetujuan eksplisit. Selalu prioritaskan pustaka yang ada dalam manifest stack definitif.

---

## 11. Testing & Quality Verification

1. **Test Runner (Bun / Vitest)**:
   - Jalankan pengujian unit menggunakan runner yang kompatibel dengan Bun untuk memastikan integritas logika bisnis.
2. **Quality Gates Check**:
   - Pastikan build sukses tanpa warning TypeScript dan Biome sebelum menyerahkan hasil pekerjaan.

---

## 12. Knowledge Preservation & Persistence

1. **Persistent Memory (`bd remember`)**:
   - Gunakan `bd remember` untuk mencatat pengetahuan proyek yang persisten dan penting. Dilarang membuat file `MEMORY.md` ad-hoc.
