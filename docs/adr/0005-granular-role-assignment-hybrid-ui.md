# Granular Role Assignment dengan Hybrid UI & Pemisahan Form Profil

- **Status:** Accepted
- **Context:** Backend menyediakan endpoint granular untuk otorisasi per penugasan role (`POST /api/v1/users/{user_id}/roles` dan `DELETE /api/v1/users/{user_id}/roles/{assignment_id}`). Namun sebelumnya, frontend menggabungkan penugasan role ke dalam field array di form profil (`EditUserPage`) yang dikirim sekaligus via `PATCH /api/v1/users/{id}`, sementara halaman daftar (`/users`) dan detail (`/users/:id`) hanya menampilkan data penugasan secara statis/read-only tanpa kontrol mutasi.
- **Decision:**
  1. **Pemisahan Tanggung Jawab & Single Source of Truth:** Hapus input array role dari `EditUserPage` dan skema submit `PATCH /api/v1/users/{id}` untuk mencegah risiko race condition dan penimpaan (*overwrite*) state role yang sudah basi (*stale*). Ganti dengan ringkasan badge role aktif dan tombol shortcut menuju dialog penugasan role.
  2. **Pola Hybrid UI (Shared Component):** Sediakan modal aksi cepat *"Kelola Role"* di dropdown menu baris tabel daftar pengguna (`/users`) dan ubah tabel penugasan di halaman detail (`/users/:id`) menjadi tabel interaktif lengkap dengan tombol *"+ Tambah Role"* dan tombol cabut per baris. Keduanya menggunakan modal/dialog penugasan bersama (*shared component*).
  3. **Smart Role Filtering:** Form penugasan role baru menempatkan unit *"Global (Semua Unit)"* (`unit_id: null`) di posisi teratas, dan opsi role yang sudah aktif dimiliki pengguna pada unit terpilih dinonaktifkan secara otomatis (*fail-safe / Poka-yoke*).
  4. **Guarded Role Revocation:** Mutasi `DELETE` diisolasi dengan dialog konfirmasi destruktif, sementara penegakan otorisasi dan proteksi lockout ditangani mutlak oleh backend.
- **Consequences:**
  - **Positif:** Ergonomi operasional admin POS meningkat drastis (dapat mengubah hak akses kasir/staf langsung dari tabel tanpa berpindah halaman), menghilangkan risiko penimpaan data peran yang tidak disengaja dari form profil, dan selaras dengan endpoint granular backend.
  - **Negatif:** Diperlukan sinkronisasi cache TanStack Query yang disiplin (`users`, `user detail`, dan `user roles`) agar perubahan di modal langsung tercermin di semua tampilan tanpa reload.
