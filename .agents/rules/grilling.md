# Aturan Fase Grilling (Grilling Phase Rules)

## 1. Lingkup & Pemicu (Scope & Triggers)
Aturan ini WAJIB dipatuhi oleh seluruh AI Agent (Root maupun Worker) saat berada dalam fase **Grilling**, yang dipicu melalui:
- Slash command `/grill-me`
- Slash command `/grill-with-docs`
- Pemanggilan skill `grilling`
- Sesi tanya-jawab eksplorasi arsitektur, klarifikasi requirement, atau perencanaan implementasi sebelum coding.

## 2. Larangan Implementasi Kode (Zero Code Implementation)
- **DILARANG KERAS** memodifikasi, membuat, atau menulis kode implementasi aplikasi selama fase grilling berlangsung.
- Fase ini HANYA diperuntukkan bagi **Tanya Jawab (Q&A)**, stress-test ide, identifikasi asumsi, klarifikasi arsitektur, dan pemetaan decision tree / frontier.
- Investigasi teknis yang diperbolehkan hanya sebatas pembacaan kode (read-only) atau inspeksi fakta untuk menjawab pertanyaan frontier.

## 3. Protokol Interview & Pertanyaan (Interview & Question Protocol)
Selama proses tanya jawab berlangsung, AI Agent WAJIB mematuhi aturan berikut:

### A. Aktifkan Skill `/antislop` (Anti-Slop Protocol)
- **WAJIB** mengaktifkan skill `/antislop` untuk mencegah timbulnya AI SLOP (teks berbunga-bunga, penjelasan bertele-tele, basa-basi kosong, spekulasi tanpa dasar, dan boilerplate yang tidak esensial).
- Seluruh komunikasi harus ringkas, tajam, profesional, dan fokus pada substansi teknis/arsitektur.

### B. Pertanyaan Bertahap Satu per Satu (One Question at a Time)
- **DILARANG** mengajukan rentetan atau banyak pertanyaan sekaligus dalam satu respon.
- Ajukan pertanyaan secara sekuensial **1 per 1** agar fokus diskusi tetap terjaga.
- Setiap pertanyaan **WAJIB** menyertakan:
  - **1 sampai 3 rekomendasi pilihan jawaban** yang terstruktur dan realistis.
  - **1 saran/rekomendasi terbaik** yang ditandai secara tegas (misal: `➡️ (Rekomendasi Terbaik): ...`) disertai alasan teknis singkat.

### C. Riset Terlebih Dahulu (Research-First & Web Search)
- **WAJIB** melakukan riset terlebih dahulu sebelum merumuskan pertanyaan:
  - Periksa file lokal, dokumentasi arsitektur di `docs/`, dan kode yang ada.
  - Lakukan pencarian web/internet jika diperlukan untuk memvalidasi best practice atau spesifikasi teknologi.
- **Tujuan**:
  - Mencegah menanyakan fakta yang sebenarnya bisa dicari/diverifikasi sendiri oleh AI Agent.
  - Memastikan pertanyaan tidak keluar dari konteks grilling (*in-context*).
  - Menghindari topik diskusi melebar ke hal-hal yang tidak relevan atau spekulatif.

## 4. Output Wajib Sesi Grilling (Deliverables)
Sesi grilling baru dinyatakan selesai secara sukses jika menghasilkan dua output berikut:
1. **Beads Issues (`bd create`)**:
   - Seluruh plan implementasi hasil kesepakatan dipecah menjadi beads issue terstruktur.
   - Setiap issue memiliki scope kecil, modular, dan memiliki relasi dependensi yang jelas (`bd dep add`).
2. **File Markdown Checklist Monitoring Tasks (`TASKS_MONITOR.md`)**:
   - File checklist monitoring yang memuat:
     - Urutan eksekusi/klaim task (*claim order*).
     - ID Beads Issue lengkap (contoh: `bd-xxx`).
     - Judul dan ringkasan tugas.
     - Status pengerjaan (Pending / Claimed / Done).
     - Link atau referensi dependensi antar-task.
   - Berfungsi sebagai papan kendali (dashboard) dan acuan worker agent saat klaim pekerjaan.

## 5. Standar Penulisan Issue untuk Low-Reasoning Worker Agent
Mengingat plan akan dieksekusi oleh AI worker agent dengan kemampuan berpikir terbatas (low-reasoning / `flash_lite`):
- **Gunakan High-Level Descriptive Language**: Tuliskan instruksi secara deskriptif, terstruktur, padat, dan jelas mengenai apa yang harus dicapai.
- **DILARANG Menyertakan Snippet Kode Mentah**:
  - Jangan menuliskan contoh potongan kode implementasi mentah di dalam deskripsi issue.
  - Alasan: Potongan kode mentah menyebabkan worker mengalami halusinasi, terpaku pada implementasi sempit, melanggar pola arsitektur yang sudah ada, atau keluar dari objektif utama.
- **Informasi Wajib di Setiap Issue**:
  - Konteks & Tujuan (Goal) fungsional tingkat tinggi.
  - Batasan Arsitektur & Aturan Domain (misal: Clean Architecture, layer DDD, pemisahan DTO vs Domain vs Persistence).
  - Target Modul / File / Area yang boleh disentuh.
  - Acceptance Criteria yang terukur dan eksplisit (Do & Don't).
  - Perintah verifikasi dan pengujian yang harus dijalankan (`uv run pytest ...`, `uv run ruff check ...`).

## 6. Transisi Selesai (Handoff Protocol)
- AI Agent TIDAK BOLEH memulai eksekusi klaim issue sebelum:
  1. Frontier pertanyaan grilling habis (semua cabang keputusan terjawab).
  2. Beads issues selesai dibuat.
  3. File checklist monitoring (`TASKS_MONITOR.md`) selesai dibuat.
  4. Pengguna (User) memberikan persetujuan eksplisit terhadap hasil breakdown task.
