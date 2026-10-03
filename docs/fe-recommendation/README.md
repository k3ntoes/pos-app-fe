# Rekomendasi Arsitektur & Spesifikasi Frontend POS

Panduan arsitektur frontend web POS, kontrak integrasi API backend, coding standards, dan spesifikasi stack teknologi.

## 🧭 Alur Baca (Reading Path) Berdasarkan Peran

- **Arsitek / Lead FE:**
  [00-frontend-overview.md](00-frontend-overview.md) → [12-stack-specification.md](12-stack-specification.md) → [01-frontend-architecture.md](01-frontend-architecture.md) → [05-api-contract.md](05-api-contract.md) → [10-frontend-folder-structure.md](10-frontend-folder-structure.md) → [11-tooling-and-biome.md](11-tooling-and-biome.md)

- **Pengembang Fitur:**
  [00-frontend-overview.md](00-frontend-overview.md) → [01-frontend-architecture.md](01-frontend-architecture.md) → [05-api-contract.md](05-api-contract.md) → [07-example-response-shapes.md](07-example-response-shapes.md) → [09-coding-rules.md](09-coding-rules.md) → [02-features-users-roles-units.md](02-features-users-roles-units.md) → [03-audit-feature.md](03-audit-feature.md)

- **UI/UX & Styling:**
  [00-frontend-overview.md](00-frontend-overview.md) → [04-uiux-best-practices.md](04-uiux-best-practices.md) → [08-tailwind-guidance.md](08-tailwind-guidance.md) → [01-frontend-architecture.md](01-frontend-architecture.md) → [10-frontend-folder-structure.md](10-frontend-folder-structure.md)

---

## 📑 Daftar Dokumen

| No. | Dokumen | Topik Utama | Peran Utama |
| :--- | :--- | :--- | :--- |
| 00 | [00-frontend-overview.md](00-frontend-overview.md) | Gambaran umum, cakupan v1 admin web, prinsip dasar | Semua Peran |
| 01 | [01-frontend-architecture.md](01-frontend-architecture.md) | Arsitektur inti, state management, error handling | Arsitek & Lead FE |
| 02 | [02-features-users-roles-units.md](02-features-users-roles-units.md) | Spesifikasi fitur Users, Roles, Units | Pengembang Fitur |
| 03 | [03-audit-feature.md](03-audit-feature.md) | Spesifikasi fitur Audit Log & tracking | Pengembang Fitur |
| 04 | [04-uiux-best-practices.md](04-uiux-best-practices.md) | Panduan UI/UX, prinsip layout, aksesibilitas | UI/UX & Styling |
| 05 | [05-api-contract.md](05-api-contract.md) | Kontrak integrasi API backend, format error & pagination | Arsitek & Pengembang Fitur |
| 06 | [06-frontend-scope-tasks.md](06-frontend-scope-tasks.md) | Ruang lingkup tugas dan backlog implementasi | Project Manager / Lead FE |
| 07 | [07-example-response-shapes.md](07-example-response-shapes.md) | Contoh struktur JSON response API backend | Pengembang Fitur |
| 08 | [08-tailwind-guidance.md](08-tailwind-guidance.md) | Panduan styling Tailwind CSS & design token | UI/UX & Styling |
| 09 | [09-coding-rules.md](09-coding-rules.md) | Standar penulisan kode, linting, dan konvensi | Pengembang Fitur |
| 10 | [10-frontend-folder-structure.md](10-frontend-folder-structure.md) | Struktur direktori dan modular feature-based layout | Arsitek & Lead FE |
| 11 | [11-tooling-and-biome.md](11-tooling-and-biome.md) | Konfigurasi tooling, build, linter, dan formatter | Arsitek & Lead FE |
| 12 | [12-stack-specification.md](12-stack-specification.md) | Spesifikasi detail stack teknologi & library pilihan | Arsitek & Lead FE |

---

## 💡 Prinsip Inti

1. **Single Source of Truth:** Backend (MariaDB / FastAPI) adalah sumber kebenaran mutlak; frontend tunduk pada aturan server, otorisasi, dan validasi bisnis.
2. **Modular Feature-Based:** Pengorganisasian direktori berbasis fitur (`features/`) untuk menjaga isolasi domain dan skalabilitas kode.
3. **Zero Bloat:** Pemilihan library yang ringan, teruji, dan langsung pada sasaran (YAGNI, menghindari over-engineering).
4. **Form & Zod Bridging:** Validasi form terpusat menggunakan React Hook Form yang diikat dengan skema Zod untuk konsistensi tipe client-side dan DTO mapping.

---

## 🚦 Status Backend Readiness (per Oktober 2026)

| Fitur FE | Status Backend |
| :--- | :--- |
| Auth (login, logout, me) | ✅ Tersedia |
| Users CRUD + Role Assignment | ✅ Tersedia |
| Roles CRUD + Permission Editor | ✅ Tersedia |
| Permissions List | ✅ Tersedia |
| Units CRUD | ❌ Endpoint `/api/v1/units` belum ada |
| Audit Log | ❌ Endpoint belum ada (domain & Redis pipeline ada) |
| Mobile Auth (JWT) | ✅ Backend tersedia di `/auth/mobile/...` — FE Android client ditunda |

> [!IMPORTANT]
> FE hanya boleh membangun fitur yang endpoint backend-nya sudah tersedia. Lihat detail di [06-frontend-scope-tasks.md](06-frontend-scope-tasks.md).
