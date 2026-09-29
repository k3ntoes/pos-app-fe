# 11 — Tooling & Biome

Dokumen ini berfokus secara spesifik pada konfigurasi lingkungan pengembangan, runner **Bun**, skrip build **Vite**, konfigurasi linter & formatter **Biome (`biome.json`)**, serta quality gate sebelum commit.

Rujukan terkait arsitektur dan struktur project dapat dibaca pada [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md), [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md), dan [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md). Spesifikasi penuh dependensi terdapat pada [Dokumen 12 — Spesifikasi Stack Definitif](12-stack-specification.md).

---

## 1. Konfigurasi Bun & Skrip Vite

Project menggunakan **Bun** sebagai package manager dan runner utama serta **Vite** sebagai bundler. Rincian daftar stack, versi library, dan dependensi aplikasi sepenuhnya merujuk pada [Dokumen 12 — Spesifikasi Stack Definitif](12-stack-specification.md).


---

## 2. Konfigurasi Biome (`biome.json`)

Biome digunakan sebagai satu alat tunggal yang cepat untuk *formatting* dan *linting*. Konfigurasi didefinisikan di root project frontend (`biome.json`):

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "style": {
        "useConst": "error",
        "noParameterAssign": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

---

## 3. Aturan Lint & Format Rules
- **Formatting:** Indentasi 2 spasi, lebar baris maksimal 100 karakter, menggunakan trailing comma bilamana perlu.
- **Linting:** Menandai variabel/import yang tidak terpakai sebagai error, melarang penggunaan `any` tanpa alasan yang jelas ([Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md)), serta memastikan penulisan kode bersih dari *anti-patterns*.
- Biome tidak menggantikan *TypeScript type checking* (`tsc --noEmit`), melainkan berjalan beriringan sebagai lapis pertama penjaga kualitas gaya kode ([Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md)).

---

## 4. Pre-commit Check & CI Pipeline
Untuk memastikan tidak ada kode yang melanggar format atau lint masuk ke repository:
- **Husky / Lefthook (Opsional/Disarankan):** Menjalankan `bun run lint` pada tahap pre-commit.
- **Continuous Integration (CI):** Pipeline GitHub Actions / GitLab CI wajib menjalankan:
  1. `bun install --frozen-lockfile`
  2. `bun run lint` (Biome check)
  3. `tsc --noEmit` (TypeScript strict type check)
  4. `bun run build` (Vite production build test)

---
⬅ **Sebelumnya:** [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 12 — Spesifikasi Stack Definitif](12-stack-specification.md)
