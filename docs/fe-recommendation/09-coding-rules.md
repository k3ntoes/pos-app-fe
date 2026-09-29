# 09 — Coding Rules for AI Implementation

> [!NOTE]
> Dokumen ini adalah pedoman implementasi frontend praktis. Rujukan spesifikasi kontrak error, paginasi, format waktu RFC3339 UTC, dan CSRF mengacu pada Single Source of Truth (SSOT) di [05-api-contract.md](05-api-contract.md). Struktur arsitektur merujuk pada [01-frontend-architecture.md](01-frontend-architecture.md) dan [10-frontend-folder-structure.md](10-frontend-folder-structure.md).

---

## 1. Prinsip Utama & Clean Code

### 1.1 Prinsip Penulisan Kode
- Nama fungsi, variabel, dan komponen harus menjelaskan maksud secara eksplisit.
- Fungsi pendek dengan satu tanggung jawab utama.
- Hindari duplikasi logika; manfaatkan utilitas dan custom hook yang ada.

### 1.2 Pemisahan Logika dan Komponen
- Komponen presentasional (`components/`) murni merender UI berdasarkan props dan memancarkan aksi (`onAction`).
- Logika fetching, caching, mutasi, dan transformasi data dipisahkan ke TanStack Query hooks dan API client (`api/`).

---

## 2. Aturan Praktis Penanganan Error & Respon API

### 2.1 Penanganan HTTP 401 (Unauthorized)
- Ketika API mengembalikan status `401`, klien **wajib** melakukan redirect global ke halaman login / menyatakan sesi habis (`/login`).
- Tidak boleh menelan error 401 secara diam-diam.

### 2.2 Penanganan HTTP 403 (Forbidden)
- Ketika API mengembalikan status `403`, klien menampilkan **inline alert / toast warning** bahwa akses ditolak.
- **Dilarang keras** melakukan logout paksa atau mengalihkan user ke halaman login untuk error 403, karena user sudah terotentikasi namun tidak memiliki izin spesifik pada aksi/resource tersebut.

### 2.3 Penanganan HTTP 422 (Unprocessable Entity / Validation Error)
- Ketika API mengembalikan status `422` dengan payload `error.details`, frontend **wajib** memetakan pesan error tersebut ke React Hook Form menggunakan metode **`form.setError()`** agar pesan error muncul langsung di bawah field form yang bersangkutan.

---

## 3. Aturan State Management

### 3.1 Larangan Duplikasi Server State
- **Dilarang keras** menduplikasi data server (hasil query API) ke dalam React local state (`useState` / Redux store manual).
- Seluruh server state **wajib** dikelola sepenuhnya menggunakan data dan cache dari **TanStack Query**.

### 3.2 Penanganan UI State
- UI state yang bersifat navigasional atau filter pencarian wajib diletakkan di **URL query params** (menggunakan React Router / search params).
- UI state lokal yang volatil (misalnya status buka/tutup modal, tab aktif) cukup menggunakan `useState` minimal di komponen terkait.

---

## 4. Library-Specific Rules

### 4.1 TanStack Query
- Gunakan query key yang konsisten dan hierarkis.
- Wajib melakukan invalidasi cache (`queryClient.invalidateQueries`) setelah mutasi berhasil.

### 4.2 React Hook Form + Zod
- Validasi form klien wajib menggunakan Zod schema yang selaras dengan backend DTO.
- Tangkap error 422 melalui `form.setError()`.

---

## 5. Dokumen Terkait
- Kontrak API & SSOT: [05-api-contract.md](05-api-contract.md)
- Katalog Respon JSON: [07-example-response-shapes.md](07-example-response-shapes.md)
- Struktur Folder: [10-frontend-folder-structure.md](10-frontend-folder-structure.md)
- Panduan Tailwind: [08-tailwind-guidance.md](08-tailwind-guidance.md)

---
⬅ **Sebelumnya:** [Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md)
