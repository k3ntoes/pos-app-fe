# Eager Permission Loading ke AuthContext

- **Status:** Accepted
- **Context:** `GET /auth/me` tidak mengembalikan permissions atau roles — hanya identity dasar (id, username, email, status, is_super_admin). Navigasi dan route guard harus dikontrol berdasarkan permission (bukan hardcoded role). Lazy loading permissions menyebabkan nav "berkedip" (tampil lalu hilang setelah permission di-load).
- **Decision:** Setelah `/auth/me` sukses, langsung fetch `GET /api/v1/users/{id}/roles`, agregasi Effective Permissions berdasarkan Active Unit, simpan di AuthContext. Di-recompute saat user ganti Active Unit.
- **Consequences:** Positif: nav akurat sejak render pertama, tidak ada berkedip, route guard bisa bekerja synchronous. Negatif: satu extra HTTP request di setiap fresh login atau page refresh.
