# Unit Context di localStorage + React Context

- **Status:** Accepted
- **Context:** Unit aktif adalah global app state yang menentukan scope data dan Effective Permissions. Pilihan storage: URL Search Param (tidak persisten lintas halaman tanpa setup kompleks), localStorage (persisten, tidak bocor ke URL), atau session cookie server-side (butuh endpoint tambahan).
- **Decision:** Simpan Active Unit di localStorage untuk persistensi lintas refresh, mirror ke React Context sebagai single source of truth in-memory selama sesi. Invalidasi dilakukan saat logout atau 401.
- **Consequences:** Positif: unit tetap terpilih setelah refresh, tidak ada kompleksitas URL, tidak butuh endpoint tambahan di backend. Negatif: potensi stale state jika unit dihapus dari backend saat user sedang login (dimitigasi dengan validasi saat fetch roles).
