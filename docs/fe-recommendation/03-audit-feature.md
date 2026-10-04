# 03 — Audit Feature & Traceability (SSOT)

> [!NOTE]
> Panduan arsitektur audit backend dan peran frontend dalam memastikan ketertelusuran aktivitas dan keamanan sistem.

---

## 1. Arsitektur Audit Backend
- **Event Streaming**: Backend menggunakan event streaming via Redis Stream untuk mendistribusikan log audit operasional dan keamanan secara asynchronous.
- **Audit Consumer**: Worker backend memproses event dan mencatatnya ke dalam database audit khusus (immutable audit logs).
- **Integritas**: Log audit tidak dapat diubah atau dihapus melalui API reguler untuk menjamin akuntabilitas kepatuhan (compliance).

---

## 2. Peran Frontend dalam Audit Traceability
- **Automatic Logging**: Setiap aksi mutasi state (pembuatan user, perubahan role, manajemen unit, login, ganti password) otomatis dicatat oleh backend berdasarkan konteks sesi user.
- **Request ID Traceability**: Frontend wajib menyertakan atau meneruskan header **`X-Request-ID`** pada setiap request API. Jika terjadi error atau investigasi insiden, nilai `request_id` dari response error dapat digunakan untuk mencocokkan log audit backend.
- **Audit Viewer (Rekomendasi UI)**: Pada fase implementasi frontend lanjutan, disiapkan komponen UI Audit Viewer untuk menampilkan riwayat aktivitas operasional bagi Administrator.

---
⬅ **Sebelumnya:** [Dokumen 02 — Fitur Pengguna, Peran, & Unit](02-features-users-roles-units.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md)
