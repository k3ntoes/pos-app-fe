# ADR 0006: Centralized Clipboard Utility & Admin Password Management

## Status
Accepted

## Context
Saat ini, aplikasi menggunakan `navigator.clipboard.writeText` secara langsung di dalam komponen `TemporaryPasswordModal`. Hal ini menimbulkan kerentanan terhadap error jika dijalankan di konteks non-secure (HTTP selain localhost) atau pada environment pengujian (seperti Jest/Vitest tanpa mock clipboard). Selain itu, fitur reset password admin untuk user memerlukan standardisasi utilitas clipboard yang aman dengan fallback (menggunakan `document.execCommand('copy')` atau elemen textarea tersembunyi).

## Decision
1. Membuat utilitas terpusat `copyToClipboard` yang menangani pemeriksaan environment, promise-based clipboard API, dan fallback DOM manual.
2. Mengintegrasikan API reset password di backend serta menambahkan UI reset password pada halaman daftar user (`UserListPage`) dan detail user (`UserDetailPage`).
3. Menggunakan modal konfirmasi password sementara yang serupa dengan pembuatan user baru.

## Consequences
- Penyalinan teks ke clipboard menjadi lebih tahan terhadap error (robust) di berbagai browser dan environment pengujian.
- Memudahkan pengelolaan reset password oleh admin secara konsisten.
