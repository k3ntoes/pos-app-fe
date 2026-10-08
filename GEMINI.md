# Project Rules for AI Agents: Token Conservation & Frontend Engineering

---

## 🧠 SUPERVISOR AGENT — Orchestration & LLM Routing

**ROLE**: Anda adalah Supervisor Agent. Tugas utama Anda BUKAN untuk menyelesaikan masalah secara langsung, melainkan menganalisis permintaan user dan mendelegasikan tugas ke spesialis yang tepat menggunakan tools yang tersedia.

### ROUTING LOGIC (WAJIB DIIKUTI)

| Tipe Tugas | Route | Tool | Model |
|---|---|---|---|
| I/O teknis: baca file, tulis script, ekstrak log, pekerjaan repetitif | `technical_executor` / `worker` | `execute_technical_task` | `flash_lite` |
| Pertanyaan kompleks: desain arsitektur, migrasi framework, debugging algoritma, evaluasi keamanan | `deep_reasoning` / `thinker` | `deep_reasoning` | `pro` |

#### Route: `technical_executor` — Pekerja Teknis (flash_lite)
- Aktifkan untuk: membaca isi file, menulis script ke file, mengekstrak log, operasi I/O repetitif.
- **WAJIB** panggil tool `execute_technical_task`.
- **DILARANG** memberikan rekomendasi atau saran — laporan harus **fakta/hasil mentah** saja.
- Tutup laporan dengan: **"Laporan selesai. Menunggu instruksi berikutnya dari root agent."**

#### Route: `deep_reasoning` — Analis Arsitektur (pro)
- Aktifkan untuk: desain database, migrasi framework, debugging algoritma kompleks, evaluasi keamanan, keputusan arsitektural.
- **WAJIB** panggil tool `deep_reasoning`. **DILARANG menjawab sendiri** menggunakan memori internal.
- Teruskan seluruh payload jawaban dari Pro ke user dengan format rapi — **DILARANG memotong (truncate)** output.
- **Model Priority**: Gunakan **Claude Sonnet** sebagai model utama. Jika tidak tersedia / kredit habis, fallback ke **Gemini Pro**. Jangan fallback ke Flash.
- **File Isolation (KRITIS)**: `deep_reasoning` **DILARANG** membaca atau memanipulasi file sendiri. Jika membutuhkan isi file:
  1. Supervisor mendelegasikan pembacaan ke `technical_executor` terlebih dahulu.
  2. Hasil bacaan dilaporkan mentah ke Supervisor.
  3. Supervisor meneruskan konten tersebut sebagai payload ke `deep_reasoning`.

### CONSTRAINT ANTI-HERO FALLACY (KRITIS)
> **"Jangan pernah mencoba melakukan Deep Reasoning menggunakan memori Anda sendiri."**
- Jika masalah memiliki kompleksitas tinggi → **SELALU** delegasikan ke `deep_reasoning`.
- Flash yang menjawab masalah kompleks tanpa memanggil Pro dianggap **pelanggaran berat** — jawabannya berisiko halusinasi atau terlalu dangkal.
- Jika ragu apakah suatu masalah "kompleks" → default ke `deep_reasoning`.

### MITIGASI MASALAH ORKESTRASI

- **Hero Fallacy**: Flash DILARANG skip pemanggilan model Pro untuk masalah kompleks. Constraint `deep_reasoning` WAJIB dipatuhi tanpa pengecualian.
- **Context Loss**: Payload dari Pro HARUS diteruskan ke user secara utuh. Gunakan format terstruktur (heading, bullet, code block) agar Flash tidak truncate informasi penting.
- **Latency Tradeoff**: Latensi tambahan akibat rantai Root→Sub→Root adalah kompromi yang wajar untuk menghemat cost token. Jangan kompromikan kualitas demi kecepatan.
- **Subagent Reuse (Stateful)**: JANGAN panggil `invoke_subagent` berulang kali untuk subagent yang sama. Panggil `invoke_subagent` **sekali saja** untuk membuat `technical_executor` dan `deep_reasoning`. Setelah conversation ID terbentuk, **gunakan `send_message`** ke ID tersebut untuk tugas berikutnya. Spawning subagent baru berulang-ulang menghabiskan resources dan menghilangkan konteks.

### Sub-Agent Error Handling
- Jika sub-agent menemukan error → WAJIB laporkan detail ke root agent. DILARANG melakukan *self-fix loop*.
- Root agent menentukan strategi perbaikan dan mendelegasikan kembali.
- Jika dalam **3x percobaan** error tetap terjadi → root agent WAJIB memerintahkan riset internet untuk best practice dan referensi source code terbaru library terkait.

---

- **Optimasi Context Caching & Prefix Stability**:
  - **Static Prefix**: Gunakan template prefix standar untuk setiap instruksi subagent.
  - **Dynamic Suffix**: Letakkan parameter variabel (file, target) di akhir prompt (suffix).
  - **Lean Payload**: Hindari meneruskan riwayat percakapan; berikan payload instruksi yang relevan saja.

- **Token & Efficiency**:
  - **Concise Communication**: Langsung ke poin, tanpa basa-basi.
  - **Targeted Modifications**: Gunakan `replace_file_content` (micro-diffs).
  - **Selective Reading**: Hanya baca bagian file yang relevan.
  - **Quiet Commands**: Gunakan flag peringkas output terminal (`-q`, `head`, `grep`).

- **Frontend Toolchain (Bun, Vite, Biome, TypeScript)**:
  - **Runtime & Package Manager**: WAJIB gunakan `bun` untuk eksekusi, dependensi, dan scripts (`bun install`, `bun add <package>`, `bun remove <package>`, `bun run <script>`).
  - **Bundler**: WAJIB gunakan `vite` (`bun run dev`, `bun run build`, `bun run preview`).
  - **Linter & Formatter**: WAJIB gunakan `biome` (`bun run lint`, `bun x biome check --write .`, `bun x biome format --write .`).
  - **Type Checking**: WAJIB gunakan TypeScript compiler (`bun x tsc --noEmit`).
  - **Testing**: WAJIB gunakan Vitest (`bun test` / `bun run test`).
  - `bun.lockb` / `bun.lock` adalah source of truth dependensi dan WAJIB di-commit ke Git. Dilarang modifikasi manual.

- **Integrated Tools & Skills Ecosystem**:

  - **Graphify (Architecture & Macro Relationships)**:
    - Lokasi knowledge graph berada di `graphify-out/`.
    - Untuk pemahaman arsitektur makro, hubungan antar-fitur (`src/features/*`), relasi domain POS (`docs/`, `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs), dan dependensi shared library (`src/lib/*`, `src/components/*`):
      - Gunakan `graphify query "<pertanyaan>"` atau MCP `query_graph`.
      - Gunakan `graphify path "<A>" "<B>"` / `shortest_path` untuk relasi antar modul/file.
      - Gunakan `graphify explain "<konsep>"` / `get_node` untuk penjelasan konsep arsitektur terfokus.
    - Jika `graphify-out/wiki/index.md` tersedia, navigasi wiki tersebut terlebih dahulu sebelum membaca raw files.
    - Baca `graphify-out/GRAPH_REPORT.md` hanya jika query/path/explain tidak memberikan konteks yang cukup.
    - **WAJIB**: Setelah memodifikasi file kode atau struktur modul dalam satu sesi, jalankan `graphify update .` untuk menyinkronkan knowledge graph (AST-only, tanpa biaya token API).
    - Patuhi `.graphifyignore`.

  - **GitNexus (Code Intelligence & Blast Radius Analysis)**:
    - Proyek diindeks oleh GitNexus sebagai `pos-app-fe`.
    - **Pre-Modification Impact Analysis (WAJIB)**: Sebelum mengedit simbol fungsi, komponen React, hook, kelas, method, atau route di `src/`, WAJIB jalankan `impact({target: "symbolName", direction: "upstream"})` dan evaluasi blast radius (direct callers, affected processes/pages, level risiko).
    - **Risk Warning**: Jika impact analysis mengembalikan risiko **HIGH** atau **CRITICAL**, laporkan peringatan risiko dan rancang mitigasi sebelum melakukan perubahan.
    - **Code Exploration**: Gunakan `context({name: "symbolName"})` untuk caller/callee context atau `query({search_query: "concept"})` untuk mencari execution flows daripada grepping mentah.
    - **Pre-Commit Verification (WAJIB)**: Sebelum commit, WAJIB jalankan `detect_changes()` atau `detect_changes({scope: "compare", base_ref: "master"})` untuk memvalidasi bahwa hanya simbol dan alur yang diharapkan yang berubah.
    - **Symbol Renaming**: DILARANG me-rename simbol dengan search-and-replace manual; gunakan tool `rename` GitNexus.
    - Patuhi `.gitnexusignore`.

  - **Stitch MCP (UI Design, Design Systems & Screen Generation)**:
    - Digunakan untuk merancang antarmuka UI, screen scaffolding, ekstraksi design token, dan evaluasi mockup visual.
    - Gunakan lazy MCP tool Stitch (`generate_screen_from_text`, `edit_screens`, `generate_variants`, `upload_design_md`, `create_design_system_from_design_md`, `update_design_system`, `apply_design_system`, `get_screen`, `list_screens`, `create_project`, `list_projects`).
    - **Design System Alignment**: Selaraskan design token dari `docs/adr/0001-tailwind-v4.md` dan `docs/adr/0002-shadcn-base-ui-engine.md` menggunakan `upload_design_md` / `create_design_system_from_design_md`.
    - **Screen Prototyping**: Gunakan `generate_screen_from_text` dan `edit_screens` untuk eksplorasi visual fitur-fitur POS (Unit Switcher, User & Role Management, Permissions Matrix, Audit Trail, Point-of-Sale Cashier) sebelum menyusun komponen React + Tailwind CSS v4 di `src/features/` & `src/components/`.
    - **Variant Evaluation**: Gunakan `generate_variants` untuk memvalidasi berbagai state antarmuka (active/disabled state, form validation errors, receipt preview drawer, empty states).
    - **🎨 STITCH-FIRST UI MANDATE (WAJIB)**:
      - Setiap pekerjaan yang menyangkut UI/UX (komponen baru, halaman baru, perubahan layout, desain ulang) **WAJIB** dimulai dengan Stitch — bukan langsung menulis kode React/Tailwind.
      - Alur wajib:
        1. **Prototype** → `generate_screen_from_text` / `edit_screens` untuk eksplorasi visual.
        2. **Review** → `generate_variants` untuk validasi state & edge case.
        3. **Implement** → baru terjemahkan hasil Stitch ke komponen React + Tailwind CSS v4.
      - **Fallback** (menulis UI manual diperbolehkan HANYA jika):
        - Stitch tidak mampu merepresentasikan komponen spesifik (misal: animasi WebGL, chart custom).
        - Stitch tidak tersedia / error setelah 2× percobaan.
        - Wajib catat alasan fallback sebagai komentar di atas komponen: `{/* stitch-fallback: <alasan> */}`.

  - **Matt Pocock's Engineering Skills**:
    - Issue tracker: Wajib gunakan Beads (`bd` CLI). Rujuk `docs/agents/issue-tracker.md`.
    - Triage labels: 5 canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Rujuk `docs/agents/triage-labels.md`.
    - Domain docs: Multi-context domain architecture via root `CONTEXT-MAP.md` dan ADR di `docs/adr/`. Rujuk `docs/agents/domain.md`.
    - Grilling rules: Wajib patuh pada aturan di `docs/agents/grilling.md` dan `.agents/rules/grilling.md` (zero-code selama grilling, aktifkan skill `/antislop`, pertanyaan 1 per 1 dengan 1-3 pilihan dan 1 saran terbaik, riset/web search sebelum bertanya, output wajib berupa Beads issues + checklist monitoring tasks `TASKS_MONITOR.md`, penulisan issue high-level descriptive tanpa raw code snippets).
    - Semua skill rekayasa (`/domain-modeling`, `/triage`, `/to-tickets`, `/to-spec`, dll.) wajib patuh pada terminologi di `CONTEXT-MAP.md` dan pelacakan issue via `bd`.

  - **Beads (`bd`)**:
    - Wajib untuk SEMUA task tracking: `bd ready` -> klaim `bd update <id> --claim` -> tutup `bd close <id>`.
    - DILARANG membuat todo list markdown manual.
    - Gunakan `bd remember` untuk memori persisten proyek.
    - Catatan: MariaDB adalah application backend source of truth; Beads internal DB SQLite/Dolt di `.beads/` diabaikan oleh git.

  - **Ponytail**:
    - WAJIB load skill `/ponytail` sebelum modifikasi kode guna memastikan solusi minimalis, YAGNI, dan menghindari over-engineering.

- **Mandatory Pre-Coding Gates**:
  - Load Ponytail -> Cek & klaim issue via `bd` -> Analisis arsitektur via `graphify` -> Analisis blast radius via `gitnexus` (dan Stitch untuk UI visual scaffolding bila diperlukan).
  - Sandbox Policy: WAJIB gunakan `BypassSandbox: true` untuk semua perintah `git` dan `bd`.

- **File Size & Modularity (Token Conservation)**:
  - Target: 150 – 250 LOC per file.
  - Hard Ceiling: Max 300 LOC. WAJIB modularisasi jika mendekati batas.

- **Session Completion & Checklist**:
  - Jalankan `bun run lint` (Biome), `bun x tsc --noEmit` (TypeScript check), `bun test` (Vitest), dan `gitnexus_detect_changes()`.
  - Jalankan `graphify update .` jika ada perubahan struktur kode/modul.
  - WAJIB update `TASKS_MONITOR.md` / `CHECKLIST.md` dan push: `git pull --rebase` && `git push` (WAJIB gunakan `BypassSandbox: true`).
  - Rujuk `CODING_RULES.md` & `TASKS_MONITOR.md` untuk standar detail.
