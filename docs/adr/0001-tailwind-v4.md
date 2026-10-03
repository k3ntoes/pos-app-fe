# Tailwind CSS v4

- **Status:** Accepted
- **Context:** Proyek greenfield. Dokumen BE menyebut "v3+ / v4" tanpa keputusan final. Tailwind v4 memperkenalkan CSS-first config (`@theme` di CSS, tidak ada `tailwind.config.js`), performa build lebih cepat, dan merupakan arah resmi Tailwind.
- **Decision:** Gunakan Tailwind CSS v4 sejak awal.
- **Consequences:** Positif: tidak ada beban migrasi dari v3, design token langsung di CSS `@theme`, bundling lebih cepat. Negatif: beberapa plugin komunitas yang masih v3-only tidak bisa digunakan; dokumentasi tutorial online masih didominasi v3.
