# 02 — Users, Roles, and Units Feature

> [!NOTE]
> Dokumen ini merinci fitur administrasi awal (Users, Roles, Units). Rujukan arsitektur merujuk pada [01-frontend-architecture.md](01-frontend-architecture.md) dan [10-frontend-folder-structure.md](10-frontend-folder-structure.md). Kontrak API, format error, paginasi, dan terminologi **`unit_id`** merujuk pada Single Source of Truth di [05-api-contract.md](05-api-contract.md) serta katalog respons di [07-example-response-shapes.md](07-example-response-shapes.md).

## Latar
Fitur ini adalah fitur admin web pertama yang paling masuk akal dibangun, karena backend sudah memiliki domain Users & Roles, Unit, dan mekanisme auth yang cukup matang. Fitur ini juga mengajarkan struktur list/detail/form yang nanti bisa digunakan untuk fitur lain.

## Goal fitur
Frontend web harus memungkinkan admin yang berwenang untuk:
- melihat dan mencari user
- membaca dan mengelola role
- melihat unit dan konfigurasi unit
- men-assign user ke role dalam unit tertentu (`unit_id`)
- memahami konteks unit saat ini melalui role assignments — scope unit user **tidak** disimpan sebagai field langsung di user object, melainkan berasal dari sub-endpoint role assignments (`/api/v1/users/{user_id}/roles`)

Semua ini tetap tunduk pada aturan backend; UI hanya menyajikan dan mengoordinasi, bukan menerapkan kebijakan izin.

## Navigasi awal
Navigasi web harus mengikuti bounded context yang ada. Urutan awal yang masuk akal:
- Users
- Roles
- Units *(saat ini ditunda — backend endpoint `/api/v1/units` belum tersedia)*
- Audit Log (lihat [03-audit-feature.md](03-audit-feature.md))

Navigasi ini bukan fix final; bisa dirapikan lagi, tapi harus tetap selaras dengan konteks domain, bukan menu ad-hoc.

## User list
Layar user list wajib memiliki:
- search atau filter yang berguna
- pagination
- sorting yang masuk akal
- kolom yang membantu identifikasi: username, nama, status, email jika ada — informasi scope unit user **tidak** tersedia sebagai field langsung pada user object; scope unit diperoleh dari endpoint role assignments secara terpisah
- aksi per baris yang dibutuhkan dan diizinkan
- loading state, empty state, dan error state yang eksplisit

Kolom dan aksi tidak harus memuat semua property user; pilih yang mendukung tugas admin, bukan yang hanya "tersedia di model".

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
- tidak menampilkan atau meminta password mentah dalam tempat yang salah

> [!IMPORTANT]
> Form **create user** tidak memerlukan input password dari pengguna. Backend menerima hanya `username`, `email` (opsional), dan `full_name`. Password sementara (`temporary_password`) di-generate otomatis oleh backend dan dikembalikan di response create user. FE cukup menampilkan `temporary_password` tersebut kepada admin setelah user berhasil dibuat, agar bisa diteruskan ke pengguna baru.

Form adalah tempat di mana UX harus membantu, bukan sekadar validasi pesan teknis.

## Role list
Role list sebaiknya:
- menampilkan nama role, kode role, deskripsi
- menandakan sistem vs kustom, karena sistem role immutable (ditandai dengan field `is_system: true` di response role)
- menyoroti bahwa perubahan role mempengaruhi semua user yang diberi role itu
- memungkinkan tindakan role yang diizinkan

Role bukan entitas yang dihapus seenak mudah. UI harus mencerminkan aturan: custom role bisa dihapus hanya jika tidak ada assignment yang merujuknya.

System roles yang tersedia di backend: `owner` (semua permission), `admin_gudang`, `admin_keuangan`, `supervisor`, `kasir`. Semua system role bersifat immutable (`is_system: true`) dan tidak dapat diubah atau dihapus melalui UI.

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

> [!WARNING]
> Backend API untuk Units (`/api/v1/units`) **belum tersedia**. Domain model `Unit` sudah ada di backend, namun API router untuk endpoint ini belum diimplementasikan. Fitur Unit list di FE bergantung sepenuhnya pada endpoint tersebut dan tidak dapat dibangun hingga backend endpoint siap.

Unit adalah batas data di backend. Itu berarti banyak layar di admin web nanti akan terikat konteks unit ini.

## Unit assignment UI & Terminologi (SSOT)
User-to-role assignment di backend dan frontend dibedakan secara tegas melalui terminologi berikut:
- **Unit scope user**: Ditentukan oleh kumpulan role assignments yang dimiliki user, bukan oleh field tunggal di user object. Endpoint `/api/v1/users/{user_id}/roles` mengembalikan semua `UserRoleAssignment` milik user. Setiap assignment memiliki `unit_id`; jika `unit_id` bernilai `null`, assignment tersebut bersifat global (berlaku di semua unit).
- **`unit_id`**: ID unit spesifik tempat user ditugaskan atau tempat transaksi/resource dicatat (`unit_id` bernilai `null` jika global).
- Multiple assignment bersifat aditif.

Jadi UI assignment harus:
- memungkinkan memilih role untuk user dalam unit tertentu (`unit_id`)
- memungkinkan melihat global assignment (assignment dengan `unit_id: null`) vs scoped assignment (assignment dengan `unit_id` spesifik) melalui data dari `/api/v1/users/{user_id}/roles`
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
- sembunyikan apa yang tidak bisa digunakan, bukan hanya supaya "rapi"
- tangani 403 secara eksplisit jika akses dibutuhkan (merujuk pada [05-api-contract.md](05-api-contract.md))
- gunakan permission set untuk menentukan visibilitas, bukan hardcode role name

Backend memiliki 16 permission string yang tersedia:

| Grup | Permissions |
|---|---|
| Users | `users:read`, `users:manage` |
| Roles | `roles:read`, `roles:manage` |
| Units | `units:read`, `units:manage` |
| Products | `products:read`, `products:manage` |
| Inventory | `inventory:read`, `inventory:manage` |
| Orders | `orders:read`, `orders:create`, `orders:void` |
| Sales | `sales:report` |
| Finance | `finance:read`, `finance:manage` |

> [!NOTE]
> FE admin web saat ini hanya mengekspos permission grup **Users, Roles, dan Units** (`users:read`, `users:manage`, `roles:read`, `roles:manage`, `units:read`, `units:manage`). Permission bisnis lain (`products:*`, `inventory:*`, `orders:*`, `sales:report`, `finance:*`) relevan untuk FE di fase berikutnya dan belum perlu diekspos di admin web ini.

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
Fitur Users, Roles, dan Units adalah pondasi admin web. Mulai dari list yang terpaginasikan, detail yang informatif, form yang terarah, assignment yang memahami konteks unit (scope ditentukan oleh role assignments via `/api/v1/users/{user_id}/roles`, bukan field tunggal di user object), dan navigasi yang dikendalikan permission. Jangan mengejar tampilan mewah dulu; bangun pola yang konsisten, aman, dan bisa dikembangkan. Rujuk [05-api-contract.md](05-api-contract.md) dan [07-example-response-shapes.md](07-example-response-shapes.md) untuk detail payload.

---
⬅ **Sebelumnya:** [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 03 — Fitur Audit Log](03-audit-feature.md)
