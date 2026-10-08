# Auth & RBAC Domain Context

Glossary of domain terms and architectural concepts related to Authentication, Permissions, Roles, Assignments, and Security for the POS Application Frontend.

## Permission

String izin granular (contoh: `users:read`, `roles:manage`) yang diberikan via Role. Permission tidak melekat langsung ke user melainkan ke Role yang di-assign ke user.

## Role

Kumpulan permissions yang di-assign ke user dalam konteks unit tertentu atau global. Terbagi menjadi System Role (immutable, tidak bisa dihapus) dan Custom Role (bisa dihapus jika tidak ada assignment aktif).

## System Role

Role bawaan backend yang bersifat immutable: `owner`, `admin_gudang`, `admin_keuangan`, `supervisor`, `kasir`. Tidak dapat dimodifikasi atau dihapus dari UI.

## Global Assignment

Role assignment dengan `unit_id: null`, berarti user memiliki role tersebut di semua unit.

## Scoped Assignment

Role assignment dengan `unit_id` bernilai spesifik, berarti user memiliki role tersebut hanya di unit tersebut.

## Effective Permissions

Agregasi permission yang berlaku untuk user di Active Unit: gabungan permission dari Global Assignment dan Scoped Assignment yang cocok dengan unit aktif. Di-load eager saat login, disimpan di AuthContext.

## Temporary Password

Password satu kali yang di-generate otomatis oleh backend saat admin membuat user baru. Dikembalikan hanya sekali di response `POST /api/v1/users`. FE wajib menampilkannya via modal non-dismissible hingga admin mengkonfirmasi sudah menyalinnya.

## must_change_password

Flag boolean di response login. Jika `true`, FE wajib hard redirect ke halaman ganti password dan memblokir akses ke semua route lain hingga password diganti.

## CSRF Token

Token keamanan yang wajib disertakan sebagai header `X-CSRF-Token` pada semua request mutasi (POST, PUT, PATCH, DELETE). Diperoleh dari response login dan dikelola oleh HTTP client layer.

## Granular Role Mutation

Operasi penugasan dan pencabutan hak akses role pengguna yang dikelola per assignment secara atomik melalui endpoint granular `POST /api/v1/users/{user_id}/roles` dan `DELETE /api/v1/users/{user_id}/roles/{assignment_id}`, terpisah dari operasi pembaruan profil user dasar (`PATCH /api/v1/users/{user_id}`).

## Role Assignment UI Pattern

Pola antarmuka pengguna hybrid untuk manipulasi penugasan role:
1. Quick Action Modal di halaman daftar pengguna (`/users`).
2. Tabel interaktif penugasan di halaman detail pengguna (`/users/:id`).
3. Shortcut UI pada halaman edit pengguna (`/users/:id/edit`) menggantikan input field array lama.

## Smart Role Filtering

Mekanisme pencegahan kesalahan input (*Poka-yoke*) pada dialog penugasan role di mana unit "Global (Semua Unit)" (`unit_id: null`) diletakkan di posisi teratas, dan opsi role yang sudah dimiliki pengguna pada unit terpilih dinonaktifkan secara otomatis dari dropdown pilihan.

## Guarded Role Revocation

Mekanisme pencabutan penugasan role yang diisolasi dengan dialog konfirmasi destruktif sebelum mutasi `DELETE` dikirimkan ke backend. Proteksi lockout dan otorisasi ditegakkan secara mutlak oleh backend.

