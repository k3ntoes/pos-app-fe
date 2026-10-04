# 10 — Frontend Folder Structure & Modular Organization (SSOT)

> [!NOTE]
> Struktur direktori modular berbasis bounded contexts/features untuk menjaga skalabilitas dan pemisahan tanggung jawab (*separation of concerns*).

---

## 1. Pohon Direktori (Directory Tree)

```text
src/
├── app/                  # Router setup, layout root, providers (TanStack Query)
├── components/           # Komponen UI global (Button, Modal, Table, Toast)
├── features/             # Modul berbasis bounded contexts (Feature-driven)
│   ├── auth/             # Login, Change Password, Session Guard
│   ├── users/            # User list, create modal, status toggle, role assignments
│   ├── roles/            # Role CRUD & Permission Matrix editor
│   └── units/            # Unit management & store locations
├── hooks/                # Hooks and logic
├── lib/                  # API client instance, interceptors, error parsers
├── types/                # Global TypeScript definitions & API contract types
└── utils/                # Helper functions (formatters, date parsers)
```

---

## 2. Penjelasan Direktori Utama
- **`src/features/`**: Setiap bounded context memiliki sub-folder sendiri yang berisi komponen, hooks, dan API services spesifik untuk modul tersebut.
- **`src/lib/api-client.ts`**: Klien HTTP terpusat dengan interceptor CSRF, Request ID, dan error handling.

---
⬅ **Sebelumnya:** [Dokumen 09 — Aturan Penulisan Kode](09-coding-rules.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md)
