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
