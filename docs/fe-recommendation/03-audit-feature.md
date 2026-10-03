# 03 — Audit Feature

> [!NOTE]
> Dokumen ini merinci fitur log audit. Kontrak API, paginasi, format timestamp RFC3339 UTC (`Z`), serta filter berdasarkan **`unit_id`** merujuk pada Single Source of Truth (SSOT) di [05-api-contract.md](05-api-contract.md). Struktur arsitektur dan folder mengacu pada [01-frontend-architecture.md](01-frontend-architecture.md) dan [10-frontend-folder-structure.md](10-frontend-folder-structure.md), sedangkan contoh payload merujuk pada [07-example-response-shapes.md](07-example-response-shapes.md).

> [!WARNING]
> **Status Backend (per Oktober 2026):** API endpoint untuk membaca audit log (`GET /api/v1/audit` atau setara) **belum diimplementasikan** di backend. Domain model `AuditEvent` dan pipeline Redis Stream sudah ada, tapi endpoint HTTP untuk konsumsi FE belum tersedia. Implementasi fitur Audit di FE bergantung pada tersedianya endpoint ini.

## Latar
Audit bukan fitur tambahan kecil. Dari sisi backend, `AuditEvent` adalah salah satu konsep paling terhubung dan memiliki pipeline sendiri: publisher ke Redis Stream, konsumen, penyimpanan audit terpisah, retensi 1 tahun, dan aturan baca terbatas.

Domain model `AuditEvent` sudah tersedia di backend dengan fields: `event_id`, `event_type`, `timestamp`, `user_id`, `request_id`, `ip_address`, `detail`. Namun, endpoint API publik untuk membaca data audit belum diimplementasikan. Backend saat ini sudah mempublikasikan event audit ke Redis Stream (contohnya: event `auth.access_denied` saat terjadi 403), tapi belum ada endpoint GET untuk konsumsi dari FE.

Artinya tampilan audit di admin web akan dibangun setelah backend menyediakan endpoint, bukan sebelumnya.

## Goal
Admin web harus bisa:
- membaca log audit yang diizinkan
- memfilter peristiwa berdasarkan parameter yang berguna
- menelusuri kapan siapa melakukan apa
- memanfaatkan audit sebagai sumber korelasi operasional

Debugging internal bukan tujuan tampilan audit; tujuan utamanya adalah pertanyaan operasional dan keamanan yang bisa dijawab oleh pengguna berwenang.

## Who can read
Di backend, akses audit diperkirakan terbatas pada `is_super_admin=true` atau role `owner`. Aturan ini akan dikonfirmasi saat backend mengimplementasikan endpoint audit beserta permission check-nya — belum ada permission string spesifik untuk audit dalam registry permission backend saat ini.

Frontend harus:
- tidak menampilkan audit jika user tidak berwenang
- tidak mencoba menembus aturan ini dengan asumsi UI bisa memperlihatkan sesuatu yang sebenarnya tidak diizinkan

Jika akses tidak diizinkan, beri respons yang benar (penanganan HTTP 403 merujuk ke [05-api-contract.md](05-api-contract.md)), bukan pesan kosong yang menyesatkan.

## Tampilan list
List audit sebaiknya:
- terpaginasikan (mengikuti struktur paginasi standar SSOT di [05-api-contract.md](05-api-contract.md))
- berisi filter yang berguna
- menampilkan timestamp yang jelas berformat RFC3339 UTC dengan akhiran `Z`
- memungkinkan penelusuran kronologis
- memiliki loading, empty, dan error state yang konsisten

Gunakan TanStack Table untuk pola ini, seperti fitur lain.

## Kolom yang disarankan
Tidak semua kolom harus ditampilkan dalam satu tampilan rapat. Pilih yang memudahkan penelusuran:
- waktu kejadian (format RFC3339 UTC `Z`)
- aktor (user atau entitas yang terlibat, sesuai apa yang dimiliki backend — field `user_id`)
- tipe aksi/peristiwa (field `event_type`)
- unit yang terkait melalui **`unit_id`**, bila ada
- ringkasan tindakan, bukan teks teknis yang tidak perlu (dari field `detail`)
- referensi yang membantu korelasi (`request_id`), bukan detail internal yang berantakan

Prioritaskan kekinian dan kejelasan, bukan kepadatan kolom.

## Filter yang berguna
Filter harus mendukung kebutuhan nyata:
- rentang waktu
- aktor / user (`user_id`)
- tipe aksi (`event_type`)
- unit terkait (`unit_id`)
- pencarian teks sederhana bila relevan

Jangan membuat filter yang rumit tapi tidak dipakai. Lebih baik sedikit filter yang nyata daripada banyak filter yang membingungkan.

## Urutan
Audit umumnya dibaca secara kronologis. Urutan default sebaiknya mendukung menelusuri kejadian dari waktu ke waktu dalam arah yang mudah dipahami.

## Korelasi dengan error
Penanganan error, format error standar, dan korelasi `request_id` sepenuhnya merujuk pada Single Source of Truth (SSOT) di [Dokumen 05 — Kontrak API](05-api-contract.md). Audit berfungsi sebagai rekaman kejadian di backend untuk mendukung penelusuran peristiwa operasional dan keamanan.


## Visualisasi
Audit adalah log kejadian; biasanya tidak perlu semua chart. Tapi bila ada kebutuhan:
- ringkasan agregat bisa membantu, misalnya seberapa banyak kejadian dalam periode tertentu
- jangan berikan visual yang menyesatkan atau yang hanya memberi ilusi insight
- pertahankan fokus pada fakta, bukan presentasi yang mengkilap

Jika visualisasi terlalu dominan, audit bisa kehilangan fungsinya sebagai alat penelusuran.

## Tampilan detail
Bila user membuka peristiwa tertentu:
- berikan konteks yang cukup
- tampilkan timestamp berformat RFC3339 UTC `Z` yang jelas
- tunjukkan aktor dan scope/unit (`unit_id`) jika tersedia
- jangan memuat teks internal yang tidak membantu

Detail sebaiknya menjawab: apa terjadi, kapan, siapa/apa yang terlibat, dan mengapa relevan.

## Performa dan pagination
Karena audit berpotensi besar:
- gunakan pagination standar sejak awal ([05-api-contract.md](05-api-contract.md))
- jangan coba "load all"
- siapkan kasus besar dengan cara yang konsisten

Konsistensi dengan fitur list lainnya akan membuat admin web terasa lebih kohesif.

## Hubungan dengan fitur lain
Audit nanti bisa jadi titik temu antara beberapa konteks (seperti [02-features-users-roles-units.md](02-features-users-roles-units.md)):
- perubahan user/role/unit yang tercatat
- kegagalan otorisasi yang tercatat
- peristiwa operasional yang penting

Maka tampilan audit perlu tetap terstruktur meski nanti semakin banyak asal peristiwa. Jangan membuatnya terlalu khusus ke satu konteks sehingga nanti sulit digeneralisasi.

## Kapan fitur ini dibangun

> [!IMPORTANT]
> Fitur Audit di FE **tidak bisa dibangun sekarang** karena backend endpoint belum tersedia. Implementasinya akan dimulai setelah backend menyediakan endpoint GET untuk mengakses audit log.

Build order yang diperbarui:
1. Admin web batch pertama: **Users, Roles** (backend endpoint tersedia)
2. Admin web batch kedua: **Units** (setelah backend endpoint `/api/v1/units` tersedia)
3. Admin web batch ketiga: **Audit Log** (setelah backend endpoint audit tersedia)

Audit tetap penting dan bukan item tersier — ia akan menjadi bagian dari fondasi admin saat backend siap.

## Kesalahan yang harus dihindari
- membuat audit sekadar log teknis yang tidak membantu
- memuat terlalu banyak kolom atau terlalu banyak detail internal
- membuat filter yang berantakan
- memperlihatkan audit tanpa mempedulikan izin (403 handling)
- membuat tampilan audit terlalu berbeda dari fitur list lain sehingga sulit dipelihara
- membangun FE Audit sebelum endpoint backend tersedia

## Ringkasan
Audit layak dibangun sebagai layar administrasi utama, tapi harus menunggu backend endpoint tersedia terlebih dahulu. Fokus pada penelusuran yang jelas, filter yang berguna (`unit_id`, `event_type`, `user_id`), pagination standar, timestamp RFC3339 UTC `Z`, dan izin yang benar. Tidak perlu memakainya sebagai halaman dashboard yang penuh widget; cukup sebagai alat penelusuran kejadian yang dapat diandalkan.

---
⬅ **Sebelumnya:** [Dokumen 02 — Modul Pengguna, Peran, & Unit](02-features-users-roles-units.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md)
