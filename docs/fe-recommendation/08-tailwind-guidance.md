# 08 — Tailwind Guidance

Dokumen ini menjelaskan cara menggunakan Tailwind agar konsisten dengan fondasi yang sudah ditetapkan serta selaras dengan prinsip visual UI/UX pada [Dokumen 04 — UI/UX Best Practices](04-uiux-best-practices.md). Tailwind dipakai sebagai lapisan styling, bukan sebagai tempat menumpuk keputusan desain acak.

Prinsip utamanya:
- tetapkan token dulu
- abstrak komponen daripada menulis ulang utility di tiap halaman
- jangan pakai kelas warna atau spacing sembarangan
- jaga konsistensi dan aksesibilitas

---

## 1. Cara pakai Tailwind dalam project ini

Tailwind digunakan untuk:
- layout
- spacing
- typography
- warna dasar dan komponen
- status and decoration yang masuk ke token

Tailwind **tidak** digunakan sebagai:
- ganti sistem token
- tempat menulis ulang palet warna per komponen
- pembenaran kelas utilitas yang berantakan dan sulit dicari lagi

Artinya, bila sebuah nilai warna atau spacing sering dipakai, ia harus masuk ke token/theme, bukan disematkan ulang di tiap komponen.

---

## 2. Konfigurasi Tailwind yang disarankan

Konfigurasi sebaiknya mencerminkan token yang sudah ditetapkan. Bagian yang wajib ada:

### Warna
- warna brand utama
- warna netral
- warna semantik: sukses, peringatan, error/danger, info

Contoh pemetaan dalam konfigurasi Tailwind (konseptual):
- `brand.primary`
- `neutral.*`
- `semantic.success`
- `semantic.warning`
- `semantic.danger`
- `semantic.info`

Setiap warna yang dipakai di komponen sebaiknya merujuk ke nama ini, bukan hex literal.

### Spacing
- tetapkan spacing scale yang diulang
- gunakan nilai yang sama untuk padding, margin, gap, dan grid gap di seluruh layar
- jangan campur magic number

Contoh konseptual:
- `space.1`, `space.2`, `space.3`, dst sesuai skala yang disepakati

### Radius
- radius kecil untuk elemen padat
- radius lebih besar untuk card/dialog
- radius tetap di dalam satu sistem, jangan acak

### Typography
- gunakan skala ukuran yang ada
- pilih keluarga font terbatas
- tetapkan line-height dan weight di mana-mana di sistem, bukan di tiap komponen

### Variasi tema
- siapkan variasi terang/terang untuk bila nanti ada dark mode
- jangan buat tema gelap dengan menulis ulang warna per komponen; buat dari token yang sama

---

## 3. Token dan Tailwind

Token adalah sumber kebenaran; Tailwind adalah cara menggunakannya.

Praktek:
- bila warna, spacing, atau radius dipakai di lebih dari satu komponen, nama token harus ada
- komponen sebaiknya tidak bergantung pada hex literal
- jika ada nilai baru yang sering dipakai, nilai itu sebaiknya masuk token, bukan kelas ad-hoc

Contoh pola yang baik:
- komponen pakai `bg-brand-primary` atau `text-neutral-900` yang di-map dari token
- komponen pakai skala spacing yang sama di seluruh halaman

Contoh pola yang buruk:
- satu tabel pakai warna biru tersendiri, satu card pakai hijau lain, tanpa nama sistemik
- jarak antar elemen beda di tiap halaman tanpa pola

---

## 4. Komponen fondasi yang disarankan

Mengikuti arsitektur komponen dalam [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) dan struktur folder/komponen pada [Dokumen 10 — Struktur Folder & Komponen Frontend](10-frontend-folder-structure.md), buat komponen kelas awal sekali, lalu pakai lagi. Contoh:
- tombol utama
- tombol aksesori
- badge
- card
- input dasar
- label
- skeleton
- empty state panel
- pagination control
- table base
- toast/notification container

Komponen ini jangan dibangun ulang di tiap fitur. Mereka should receive variation via props or variantClassName, bukan melalui duplikasi kelas di tiap layar.

---

## 5. Pola kelas yang disarankan

Saran penulisan (diatur oleh aturan linting dan formatting pada [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md) serta konvensi kode pada [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md)):
- kelompokkan kelas secara visual: layout, spacing, warna, typografi, status
- jika satu komponen terlalu padat, pisah ke komponen kecil
- jangan buat baris kelas seakan-akan kode acak; ia harus bisa dibaca kembali

Contoh pola:
```tsx
<button
  className="
    inline-flex items-center justify-center
    rounded
    px-3 py-1.5
    text-sm font-medium
    hover:bg-brand-primary-hover
    focus-visible:ring-2 focus-visible:ring-ring
  "
>
  Simpan
</button>
```

Yang penting bukan bentuk literal ini, tapi:
- variant kelas yang konsisten
- tidak disematkan warna hex di sini
- focus dan aksesibilitas diperhatikan

---

## 6. Dark mode

Jika project ingin mendukung tema gelap:
- buat variasi warna di token
- pilih strategi kelas dark di Tailwind
- jangan mengubah kontras atau makna warna secara sembarangan
- pastikan teks tetap terbaca

Dark mode bukan “tema ramai”. Dark mode harus tetap terasa seperti aplikasi yang sama.

---

## 7. Aksesibilitas dalam Tailwind

Tailwind tidak otomatis menjamin aksesibilitas. Jadi:

- kontras warna harus dicek, bukan diasumsikan
- fokus harus terlihat di semua komponen interaktif
- label dan aria harus disesuaikan dengan komponen, bukan hanya visually hidden
- icon tidak boleh menjadi satu-satunya indikator makna

Jadi Tailwind bisa dipakai untuk aksesibilitas bila dipakai dengan disiplin.

---

## 8. Apa yang dihindari

- penggunaan warna hex literal di tiap komponen
- variasi tombol terlalu banyak tanpa makna
- spacing acak yang tidak mengikuti skala
- komponen tabel/form diseret ke tiap fitur tanpa abstraksi
- visual hierarchy yang didorong oleh warna “menarik” daripada oleh fungsinya
- tema yang berubah-ubah tiap layar

---

## 9. Contoh token awal

Ini bukan warna final. Ini hanya contoh struktur yang bisa diisi nanti.

```ts
// contoh konseptual, bukan konfigurasi final
export const tokens = {
  brand: {
    primary: '...',
    primaryHover: '...',
  },
  neutral: {
    bg: '...',
    surface: '...',
    text: '...',
    textMuted: '...',
    border: '...',
  },
  semantic: {
    success: '...',
    warning: '...',
    danger: '...',
    info: '...',
  },
  spacing: {
    1: '...',
    2: '...',
    3: '...',
    // dst
  },
  radius: {
    sm: '...',
    md: '...',
    lg: '...',
  },
  type: {
    body: '...',
    heading: '...',
    small: '...',
  },
};
```

Konfigurasi Tailwind nanti bisa mengacu ke nilai ini sehingga komponen tidak mengambil hex sendiri-sendiri.

---

## 10. Ringkasan

Tailwind dipakai melalui token, bukan melalui kelas warna sprei. Tetapkan palet, spacing, radius, dan typography di satu tempat. Abstrak komponen fondasi (mengacu ke [Dokumen 10 — Struktur Folder & Komponen Frontend](10-frontend-folder-structure.md)). Pastikan kontras, fokus, dan label tetap utuh. Jika masih ragu, lebih sedikit variasi dan lebih konsisten biasanya lebih baik.

---
⬅ **Sebelumnya:** [Dokumen 07 — Bentuk Contoh Respon API](07-example-response-shapes.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md)
