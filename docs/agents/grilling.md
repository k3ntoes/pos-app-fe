# Aturan Fase Grilling (Grilling Phase Rules)

Panduan ini mengatur batasan perilaku, output wajib, dan standar penulisan tugas saat AI Agent berada dalam mode atau fase **Grilling**.

## 1. Lingkup & Pemicu (Scope & Triggers)
Aturan ini aktif dan WAJIB dipatuhi oleh seluruh AI Agent (baik Root Agent maupun Worker Agent) saat:
- Menggunakan slash command `/grill-me`
- Menggunakan slash command `/grill-with-docs`
- Menjalankan skill `grilling`
- Berada dalam sesi interaktif tanya-jawab untuk klarifikasi kebutuhan, eksplorasi arsitektur, atau perencanaan teknis sebelum penulisan kode.

## 2. Larangan Implementasi Kode (Strict Zero-Code Policy)
- **DILARANG KERAS** menulis, mengubah, membuat, atau menghapus kode aplikasi (source code) selama fase grilling berlangsung.
- Fase ini **HANYA** diperuntukkan bagi:
  - Tanya jawab (Q&A) terstruktur dengan user.
  - Stress-test ide, validasi konsep, dan pembongkaran asumsi tersembunyi.
  - Menjelajahi *decision tree* hingga seluruh *frontier* pertanyaan habis.
- **Investigasi yang diizinkan**: Hanya investigasi fakta berbasis baca-saja (*read-only*) terhadap file/repositori untuk menjawab pertanyaan frontier. Tidak ada modifikasi kode yang diizinkan.

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
Sesi grilling dinyatakan tuntas HANYA jika menghasilkan 2 (dua) artefak output berikut:

### A. Beads Issues (`bd create`)
- Seluruh rencana implementasi hasil grilling dipecah menjadi issue Beads yang modular, terfokus, dan terukur.
- Menentukan relasi dependensi antar-issue secara eksplisit menggunakan `bd dep add`.
- Diberi label yang sesuai (misalnya `ready-for-agent`).

### B. Checklist Monitoring Tasks Markdown (`TASKS_MONITOR.md`)
File markdown checklist monitoring tugas yang ditempatkan di root atau lokasi kerja terkait, memuat:
- **Urutan Klaim Kerja (*Claim Order*)**: Urutan logis pengerjaan task berdasarkan dependensi.
- **ID Issue Lengkap**: Menyertakan ID beads issue (misal `bd-001`, `bd-002`) untuk memudahkan eksekusi `bd show <id>` dan `bd update <id> --claim`.
- **Ringkasan Tugas**: Judul dan sasaran utama tiap task.
- **Acceptance Criteria & Verification**: Poin pengujian atau verifikasi singkat.
- **Status Tracker**: Indikator progres (`[ ] Pending`, `[-] In Progress`, `[x] Completed`).

## 5. Standar Penulisan Issue untuk Low-Reasoning Worker Agent
Karena rencana implementasi akan dieksekusi oleh AI Worker Agent dengan kemampuan reasoning terbatas (misal model `flash_lite` atau worker konteks sempit):

### A. Gunakan High-Level Descriptive Language
- Jelaskan maksud, batas domain, kontrak, dan perilaku yang diharapkan menggunakan bahasa deskriptif tingkat tinggi yang presisi.
- Formulasikan kebutuhan dalam bentuk aturan bisnis, boundary arsitektur, dan kriteria keberhasilan yang lugas.

### B. DILARANG Menyertakan Snippet Kode Mentah (No Raw Code Snippets)
- **Jangan** menyertakan contoh potongan kode implementasi mentah (raw code snippets) dalam deskripsi issue.
- **Rasional**: Potongan kode mentah memicu worker mengalami halusinasi, terpaku pada cuplikan sintaks yang tidak lengkap/out-of-context, melanggar pola arsitektur yang sudah ada, atau melenceng dari tujuan utama.

### C. Elemen Wajib dalam Setiap Issue Plan
Setiap issue Beads wajib memiliki komponen terstruktur berikut:
1. **Goal / Objective**: Apa tujuan spesifik dan fungsi yang ingin dicapai.
2. **Context & Boundaries**: Bounded context terkait, modul target, dan layer arsitektur (Clean Architecture / DDD).
3. **Allowed Files**: Batasan eksplisit file/direktori mana yang boleh diubah atau ditambah.
4. **Explicit Acceptance Criteria (Do & Don't)**: Daftar kriteria apa yang harus terpenuhi dan apa yang dilarang.
5. **Verification Steps**: Perintah pengujian eksplisit yang harus dijalankan dan dipastikan lolos (misal `uv run pytest <path>`, `uv run ruff check`).

## 6. Protokol Transisi / Handoff
- Sesi grilling TIDAK BOLEH ditutup dan pengerjaan koding TIDAK BOLEH dimulai sebelum:
  1. Seluruh cabang keputusan selesai terjawab (frontier kosong).
  2. Beads issues selesai dibuat dan diverifikasi relasi dependensinya.
  3. File checklist monitoring (`TASKS_MONITOR.md`) selesai disusun.
  4. Pengguna (User) memberikan persetujuan eksplisit terhadap daftar issue dan checklist monitoring tersebut.
