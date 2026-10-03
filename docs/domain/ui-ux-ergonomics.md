# UI/UX & Frontend Ergonomics Domain Context

Glossary of domain terms and architectural concepts related to Frontend Ergonomics & UI/UX Domain Terms for the POS Application Frontend.

## Frontend Ergonomics & UI/UX Domain Terms

### Glanceability & Tabular Figures

Kemampuan kasir untuk membaca informasi layar secara instan dalam waktu <0.5 detik. Wajib menggunakan `tabular-nums` pada seluruh data angka agar digit sejajar secara vertikal.

### POS Touch Ergonomics & Tap Target

Standar ukuran sentuh minimum 44x44px (rekomendasi 48x48px untuk tombol pembayaran & numpad) dengan spacing minimal 8px untuk mengeliminasi kesalahan sentuh di layar sentuh POS.

### Destructive Action Isolation (Slip Traps Prevention)

Teknik isolasi spasial (minimal 16–24px) antara tombol aksi destruktif (Void, Delete) dan tombol transaksi utama (Checkout) untuk mencegah slip-trap fatal.

### Alarm Fatigue Prevention (Semantic Restraint)

Pembatasan penggunaan warna merah murni (`rose-600`) khusus untuk aksi destruktif, menggunakan amber untuk warning, agar kasir tidak mengalami mati rasa visual (alarm fatigue).

### Glare & Eye Fatigue Resistance

Penggunaan latar belakang off-white slate (`#f8fafc` / `#f1f5f9`) dan dark mode soft-slate (`#0f172a`) untuk meredam pantulan cahaya lampu retail (*overhead glare*) selama shift 8+ jam.
