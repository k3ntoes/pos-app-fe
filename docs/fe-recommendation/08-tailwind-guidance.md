# 08 — Tailwind CSS & UI Component Styling Guidance (SSOT)

> [!NOTE]
> Panduan penggunaan Tailwind CSS, standar warna badge status, styling dialog modal, dan tabel data agar konsisten dengan desain POS Application.

---

## 1. Standar Warna Badge Status
- **User Status**:
  - `ACTIVE`: `bg-emerald-100 text-emerald-800 border-emerald-200`
  - `INACTIVE`: `bg-slate-100 text-slate-800 border-slate-200`
  - `SUSPENDED`: `bg-rose-100 text-rose-800 border-rose-200`
- **Unit Status (`is_active`)**:
  - `true`: `bg-emerald-100 text-emerald-800`
  - `false`: `bg-slate-100 text-slate-800`

---

## 2. Styling Dialog Modal Khusus
- **Blocking Change Password Modal**: Menggunakan backdrop gelap (`bg-slate-900/70 backdrop-blur-sm`) tanpa tombol tutup (*close button*) agar pengguna wajib menyelesaikan perubahan password sesuai ADR-0002.
- **Temporary Password Copy Modal**: Desain card monspaced untuk menampilkan password sementara dengan tombol *Copy to Clipboard* berikon (Lucide Icons) dan feedback visual sukses tersalin.

---

## 3. Data Tables & Forms Styling
- **Data Tables**: Menggunakan `divide-y divide-slate-200`, header `bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider`, serta baris hover `hover:bg-slate-50/50`.
- **Form Controls**: Input dengan ring fokus `focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border-slate-300 shadow-sm`.

---
⬅ **Sebelumnya:** [Dokumen 07 — Contoh Bentuk Respons](07-example-response-shapes.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 09 — Aturan Penulisan Kode](09-coding-rules.md)
