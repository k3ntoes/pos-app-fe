# 02 — Users, Roles, and Units Feature

> [!NOTE]
> Dokumen ini merinci fitur administrasi awal (Users, Roles, Units). Rujukan arsitektur merujuk pada [01-frontend-architecture.md](01-frontend-architecture.md) dan [10-frontend-folder-structure.md](10-frontend-folder-structure.md). Kontrak API, format error, paginasi, dan terminologi **`unit_scope`** vs **`unit_id`** merujuk pada Single Source of Truth di [05-api-contract.md](05-api-contract.md) serta katalog respons di [07-example-response-shapes.md](07-example-response-shapes.md).

## Latar
Fitur ini adalah fitur admin web pertama yang paling masuk akal dibangun, karena backend sudah memiliki domain Users & Roles, Unit, dan mekanisme auth yang cukup matang. Fitur ini juga mengajarkan struktur list/detail/form yang nanti bisa digunakan untuk fitur lain.

## Goal fitur
Frontend web harus memungkinkan admin yang berwenang untuk:
- melihat dan mencari user
- membaca dan mengelola role
- melihat unit dan konfigurasi unit
- men-assign user ke role dalam unit tertentu (`unit_id`)
- memahami konteks unit saat ini melalui `unit_scope`

Semua ini tetap tunduk pada aturan backend; UI hanya menyajikan dan mengoordinasi, bukan menerapkan kebijakan izin.

## Navigasi awal
Navigasi web harus mengikuti bounded context yang ada. Urutan awal yang masuk akal:
- Users
- Roles
- Units
- Audit Log (lihat [03-audit-feature.md](03-audit-feature.md))

Navigasi ini bukan fix final; bisa dirapikan lagi, tapi harus tetap selaras dengan konteks domain, bukan menu ad-hoc.

## User list
Layar user list wajib memiliki:
- search atau filter yang berguna
- pagination
- sorting yang masuk akal
- kolom yang membantu identifikasi: username, nama, status, email jika ada, unit/scope jika relevan (`unit_scope`)
- aksi per baris yang dibutuhkan dan diizinkan
- loading state, empty state, dan error state yang eksplisit

Kolom dan aksi tidak harus memuat semua property user; pilih yang mendukung tugas admin, bukan yang hanya “tersedia di model”.

## User detail
Detail user sebaiknya:
- menampilkan informasi dasar user
- menampilkan status secara jelas: ACTIVE / SUSPENDED / DEACTIVATED
- memberikan akses ke tindakan yang sah, seperti suspend, reactivate, deactivate, atau manage assignment
- menunjukkan bahwa perubahan status mempengaruhi sesi, tanpa menyalin logika server

Status tidak boleh ditampilkan sebagai teks biasa tanpa konteks; beri label yang dimengerti pengguna dan visual yang konsisten.

## User form
Form create/edit wajib:
- menggunakan React Hook Form + Zod (merujuk pada [09-coding-rules.md](09-coding-rules.md))
- memvalidasi input di sisi klien sesuai kebijakan yang relevan
- menyampaikan error dengan jelas (termasuk mapping error 422 `form.setError()`)
- merefleksikan kebijakan password backend bila form terkait password
- tidak menampilkan atau meminta password mentah dalam tempat yang salah

Form adalah tempat di mana UX harus membantu, bukan sekadar validasi pesan teknis.

## Role list
Role list sebaiknya:
- menampilkan nama role, kode role, deskripsi
- menandakan sistem vs kustom, karena sistem role immutable
- menyoroti bahwa perubahan role mempengaruhi semua user yang diberi role itu
- memungkinkan tindakan role yang diizinkan

Role bukan entitas yang dihapus seenak mudah. UI harus mencerminkan aturan: custom role bisa dihapus hanya jika tidak ada assignment yang merujuknya.

## Role detail / role permission editor
Jika layar role memungkinkan:
- tampilkan permission yang melekat pada role
- berikan UI untuk add/remove permission jika diizinkan
- tegaskan bahwa perubahan permission harus segera tercerminkan di sisi klien
- jangan biarkan UI membuat perubahan yang tidak tahu adanya konsekuensi izin

Dari sisi arsitektur backend, perubahan permission harus menginvalidasi cache otorisasi yang terpengaruh. Frontend tidak perlu mengetahui detail itu, tapi harus siap merespons bahwa perubahan terlihat setelah mutasi.

## Unit list
Unit list sebaiknya:
- menampilkan nama unit dan status aktif/tidak aktif (`unit_id` dan atribut unit)
- membantu admin memahami batas kepemilikan data
- mendukung aksi yang relevan jika diizinkan

Unit adalah batas data di backend. Itu berarti banyak layar di admin web nanti akan terikat konteks unit ini.

## Unit assignment UI & Terminologi (SSOT)
User-to-role assignment di backend dan frontend dibedakan secara tegas melalui terminologi berikut:
- **`unit_scope`**: Daftar hak akses unit user (menentukan unit mana saja yang diizinkan diakses oleh user dalam profil/otorisasi).
- **`unit_id`**: ID unit spesifik tempat user ditugaskan atau tempat transaksi/resource dicatat (`unit_id` bernilai `null` jika global).
- Multiple assignment bersifat aditif.

Jadi UI assignment harus:
- memungkinkan memilih role untuk user dalam unit tertentu (`unit_id`)
- memungkinkan melihat global assignment vs scoped assignment (`unit_scope`)
- menampilkan bahwa assignment tetap ada meskipun user suspended atau deactivated
- tidak menyatakan bahwa assignment otomatis hilang saat status berubah

UI harus menghindari asumsi bahwa assignment = user = akses statis; itu hubungan scoped dan union.

## Unit switcher
Unit/store switcher wajib ada di header. Alasannya:
- perubahan unit mengubah perspektif data
- banyak layar terikat unit
- akses global memungkinkan melihat semua unit, tapi tetap perlu konteks

Saran perilaku:
- tampilkan unit saat ini dengan jelas
- biarkan pindah unit tanpa reload halaman penuh jika memungkinkan
- sesuaikan list dan aksi dengan unit yang sedang dipilih, kecuali resource global

## Permission-aware visibility
Frontend tidak boleh menampilkan menu atau tombol yang tidak relevan. Tapi tetap:
- sembunyikan apa yang tidak bisa digunakan, bukan hanya supaya “rapi”
- tangani 403 secara eksplisit jika akses dibutuhkan (merujuk pada [05-api-contract.md](05-api-contract.md))
- gunakan permission set untuk menentukan visibilitas, bukan hardcode role name

Izin yang relevan di area ini adalah:
- `users:read`, `users:manage`
- `roles:read`, `roles:manage`
- `units:read`, `units:manage`

Frontend bisa gunakan izin ini untuk:
- Apakah user bisa melihat menu Users
- Apakah tombol create/edit/hapus muncul
- Apakah role editor ditampilkan

## Read-only vs manage
Beberapa hal wajib dibedakan sejak awal:
- baca saja vs kelola
- lihat list vs buat/edit
- lihat detail vs hapus/suspend/reactivate

Ini bukan cuma keindahan; ini perspektif UX yang nyata. Pengguna yang tidak punya izin memang sebaiknya tidak melihat tombol yang menyesatkan.

## Load dan invalidasi
Setelah membuat, mengedit, atau menghapus:
- refresh list yang relevan
- invalidasi cache TanStack Query yang tepat
- jangan biarkan UI tampak konsisten padahal datanya sudah berubah

## Error dan 403 di fitur ini
Jika user mencoba aksi tanpa izin:
- tampilkan pesan jelas, bukan popups aneh atau redirect tanpa konteks
- tetap pada layar yang sama bila memungkinkan (menghindari logout paksa untuk 403)
- beri cara ke tindakan yang mungkin diizinkan

Dan selalu sediakan `request_id` di error sehingga support bisa melacak peristiwa.

## Ringkasan
Fitur Users, Roles, dan Units adalah pondasi admin web. Mulai dari list yang terpaginasikan, detail yang informatif, form yang terarah, assignment yang memahami konteks unit (`unit_scope` vs `unit_id`), dan navigasi yang dikendalikan permission. Jangan mengejar tampilan mewah dulu; bangun pola yang konsisten, aman, dan bisa dikembangkan. Rujuk [05-api-contract.md](05-api-contract.md) dan [07-example-response-shapes.md](07-example-response-shapes.md) untuk detail payload.

---
⬅ **Sebelumnya:** [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 03 — Fitur Audit Log](03-audit-feature.md)
