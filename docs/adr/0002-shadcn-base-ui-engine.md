# shadcn/ui dengan Base UI Engine

- **Status:** Accepted
- **Context:** shadcn/ui per mid-2026 mendukung dua headless engine: Radix UI (engine lama) dan Base UI by MUI (default baru). Radix UI masih didukung tapi pengembangan melambat sejak diakuisisi WorkOS. Base UI mencapai stable v1.0 di late 2025, dibangun oleh tim aktif MUI.
- **Decision:** Gunakan shadcn/ui dengan Base UI sebagai headless engine (`npx shadcn@latest init --base base`).
- **Consequences:** Positif: mengikuti arah default shadcn, API lebih modern (tanpa `asChild` prop), engineering aktif. Negatif: tutorial dan contoh komunitas masih banyak yang menggunakan Radix; beberapa komponen mungkin belum tersedia di Base UI registry shadcn.
