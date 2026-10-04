# 11 — Tooling, Linter, & Biome Configuration (SSOT)

> [!NOTE]
> Standar tooling modern, linting, formatting, dan penggunaan Biome untuk menjaga kualitas kode frontend.

---

## 1. Tooling Modern
- **Package Manager**: pnpm (direkomendasikan) atau npm/yarn.
- **Formatter & Linter**: **Biome** digunakan untuk formatting (`biome format`) dan linting (`biome lint`) berkecepatan tinggi, menggantikan konfigurasi ESLint/Prettier yang terfragmentasi.
- **TypeScript**: Versi 5.x dengan pemeriksaan tipe yang ketat.

---

## 2. Aturan Biome & Git Hooks
- Konfigurasi `biome.json` memastikan indentasi, penataan spasi, dan urutan import konsisten di seluruh tim pengembang.
- Pre-commit hooks (Husky / lint-staged) disarankan untuk menjalankan Biome check sebelum melakukan commit kode.

---
⬅ **Sebelumnya:** [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 12 — Spesifikasi Tech Stack](12-stack-specification.md)
