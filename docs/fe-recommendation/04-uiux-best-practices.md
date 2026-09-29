# 04 — UI/UX Best Practices

## Filosofi utama
Admin web yang baik tidak harus terlihat rumit. Tujuannya adalah:
- pengguna tahu ke mana harus pergi,
- data mudah discan,
- aksi mudah ditemukan dan dipahami,
- error tidak membingungkan,
- konsistensi terasa langsung.

Jangan mengejar kepadatan informasi atau dekorasi. Prioritaskan kejelasan, prediktabilitas, dan kepercayaan pengguna.

## Design token dan sistem desain
Mulai dengan design token, bukan warna hex yang menempel di komponen.

Tailwind sebaiknya digunakan melalui token, bukan melalui kelas utilitas warna yang berantakan. Dengan kata lain, atur style di Tailwind, tapi kendalikan palet dan skalalah dari tempat yang sama. Pendekatan dan pemetaan token ini diatur lebih lanjut pada [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md).

Token yang wajib ada sejak awal:
- warna utama dan netral
- warna semantik: sukses, peringatan, error/danger, info
- skala spacing
- radius
- skala typografi
- variasi gelap/terang bila diaplikasikan

Dengan token yang jelas, komponen jadi lebih mudah dikembangkan dan lebih sulit salah pasang.

## Warna
Pilih palet yang terbatas dan terarah.

Aturan praktis:
- satu warna utama yang konsisten untuk tindakan dan identitas brand
- satu keluarga netral untuk latar, teks, dan garis
- warna semantik digunakan secara terbatas dan bermakna
- jangan gunakan banyak warna untuk memberi kesan “hidup”; itu sering bikin UI terlihat berisik
- jangan pakai warna sebagai satu-satunya indikator makna; beri label juga

Pastikan kontras minimal memenuhi aksesibilitas dasar. Lebih baik cek kontras karena warna yang kelihatan “enak” belum tentu cukup mengenai teks.

## Tipografi
Gunakan keluarga font yang sedikit dan terkelola.

Saran:
- 1 keluarga utama untuk teks umum
- 1 keluarga atau variasi heading bila benar-benar dibutuhkan
- jangan pakai terlalu banyak ukuran/berat sembarangan
- buat skala ukuran yang diulang di seluruh layar

Line-height dan ukuran kaki harus mendukung bacaan tanpa kekuasaan. Di admin, terlalu padat sering lebih buruk daripada terlalu sederhana.

## Spacing dan grid
Admin web harus terasa terstruktur.

Praktik:
- gunakan spacing yang diulang, bukan magic pixel di tiap komponen
- grup elemen terkait dengan jarak yang lebih rapat
- beri ruang antar grup yang lebih lebar
- jangan biar elemen terasa tercampur karena jarak tidak konsisten

Grid membantu list, form, dan panel tetap lurus. Lebih penting lagi, grid mencegah tampilan acak.

## Visual hierarchy
Halaman harus bisa dipindai cepat.

Cara mencapainya:
- tampilkan perkara paling penting lebih menonjol
- gunakan ukuran, posisi, dan kontras dengan sengaja
- jangan sebar semua elemen setara
- bagi konten menjadi bagian yang memiliki hubungan jelas

Contoh umum di dashboard:
- ringkasan utama lebih menonjol daripada detail
- tombol tindakan utama lebih terlihat daripada tindakan mikro
- label dan metadata tidak berebut perhatian dengan tindakan utama

## Navigasi
Navigasi harus tampak stabil dan masuk akal.

Saran:
- sidebar atau top nav yang konsisten
- label navigasi jelas dan tidak mengandalkan asumsi internal
- kelompokkanfitur yang berhubungan
- beri cara kembali dan konteks pada halaman dalam

Navigasi yang baik mengurangi beban pengetahuan pengguna dan mempercepat tujuannya.

## Tombol dan tindakan
Tombol adalah bahasa utama admin web.

Praktek:
- gunakan variasi tombol untuk makna yang berbeda, tapi jangan berlebihan
- tindakan utama harus lebih menonjol daripada tindakan aksesori
- subgroupkan tindakan terkait
- beri label yang menjelaskan apa yang terjadi, bukan kata implisit yang ambigu
- hindari terlalu banyak tombol dalam satu baris yang sama

Tindakan destruktif atau sensitif punya klarifikasi yang sesuai, terutama suspend/deactivate/revoke/assign.

## Form
Form sebaiknya terasa seperti alat, bukan interogasi.

Praktik:
- label jelas dan dekat dengan input
- placeholder bukan pengganti label
- validasi langsung bila memungkinkan
- pesan error terikat ke field yang relevan (misalnya penanganan error validasi 422 seperti diuraikan dalam [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md))
- urutan form mengikuti alur yang masuk akal

Form yang baik membantu user menyelesaikan sesuatu, tidak sekadar mengumpulkan input.

## Feedback
User harus tahu apa yang terjadi.

Saran:
- loading state yang konsisten
- notifikasi sukses dan error yang terbaca
- state kosong yang informatif, bukan hanya ruang kosong
- tidak ada status “tersembunyi” yang membuat user menebak

Feedback yang baik mencegah pengguna mengulangi tindakan yang tidak perlu.

## Loading dan empty state
Daftar dan halaman harus punya status yang wajar.

Praktik:
- saat pemuatan, beri indikator yang kalau tidak menipu
- saat kosong, beri pesan yang menjelaskan mengapa, bukan hanya “tidak ada data”
- saat error, arahkan atau beri cara lanjut yang mungkin

Keadaan ini bukan hal kecil; mereka sering menentukan apakah UI terasa matang.

## Error
Error harus ditangani sebagai bagian dari UX, bukan only log error. Arsitektur penanganan error (termasuk penanganan inline feedback/error 403 & 422) diatur secara komprehensif pada [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) dan konvensi pada [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md).

Prinsip:
- pesan harus dimengerti pengguna
- beri langkah berikutnya bila memungkinkan
- pertahankan `request_id` di tempat yang bisa dicapai bila perlu korelasi
- 403 dan 401 punya makna berbeda dan harus tidak ditangani mirip

Error yang good UX tidak perlu teknis yang kasar; cukup jujur, terbatas, dan membantu.

## Aksesibilitas
Aksesibilitas bukan lanjutan; itu bagian dari kualitas dasar, yang mencakup navigasi keyboard (fokus interaktif, urutan tab) dan responsivitas layout di berbagai ukuran layar perangkat admin.

Yang wajib diperhatikan:
- kontras teks dan latar
- label form yang benar
- fokus keyboard yang terlihat (`focus-visible`)
- urutan fokus yang masuk akal
- aria-live atau setara untuk notifikasi penting
- keterbacaan icon dan makna yang tidak hanya mengandalkan warna
- responsivitas tata letak admin (mobile, tablet, desktop)

Pola ini harus diterapkan di komponen berulang sesuai dengan [Dokumen 10 — Struktur Folder & Komponen Frontend](10-frontend-folder-structure.md) dan [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md).

## Tema dan Tailwind
Mulai dengan tema yang konsisten.

Saran:
- pilih satu tema dasar daripada mencampur-campur gaya
- tetapkan palet dan skalalah di Tailwind config/theme dulu, bukan mengatur hex per komponen (mengikuti [Dokumen 08 — Tailwind Guidance](08-tailwind-guidance.md))
- bila nanti ingin tema gelap, buat dari token yang sama, bukan merontokkan komponen
- jangan ubah tema sesuka hati di tiap halaman; itu bikin admin web terasa terpecah

Tema bukan tentang estetika kosong. Itu tentang konsistensi yang memudahkan pengguna membaca layar.

## Jangan lakukan ini
- terlalu banyak warna dan variasi tombol
- form padat tanpa label yang jelas
- list tanpa pagination, empty state, atau error state
- navigasi yang berubah-ubah arti tiap halaman
- komunikasi error yang ambigu atau teknis berlebihan
- UI yang meniru “dashboard ramai” tanpa tujuan

## Ringkasan
UI/UX admin web yang baik dibangun dari token yang jelas, spacing yang disiplin, tipografi terbatas, hierarki visual yang sengaja dirancang, dan feedback yang konsisten. Buat halaman menjadi mudah discan dan tindakan mudah dipahami. Jika ada keraguan, lebih sederhana dan lebih konsisten biasanya lebih baik.

---
⬅ **Sebelumnya:** [Dokumen 03 — Fitur Audit Log](03-audit-feature.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 05 — Kontrak API Backend](05-api-contract.md)

