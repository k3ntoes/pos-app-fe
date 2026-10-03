# Project Rules for AI Agents: Token Conservation & Frontend Engineering

- **Root Agent (Strict Manager)**:
  - Root agent bertindak HANYA sebagai Manager/Orchestrator dan High-level Planner.
  - DILARANG melakukan manipulasi file, riset, atau eksekusi teknis langsung.
  - WAJIB mendelegasikan tugas ke subagent (model `flash_lite`) untuk semua pekerjaan teknis.
  - Hanya menerima ringkasan laporan dari subagent.

- **Sub-Agent Reporting Protocol (STRICT)**:
  - Sub-agent HANYA boleh melaporkan **fakta/hasil mentah** dari tugas yang diberikan (contoh: hasil analisis, output command, daftar temuan).
  - Sub-agent **DILARANG KERAS**:
    - Memberikan saran, rekomendasi, atau opini tentang langkah berikutnya.
    - Mengambil keputusan di luar lingkup tugas yang diberikan.
    - Menyarankan pendekatan alternatif kecuali diminta root agent.
    - Memulai pekerjaan tambahan yang tidak diminta secara eksplisit.
  - Sub-agent harus menutup laporannya dengan: **"Laporan selesai. Menunggu instruksi berikutnya dari root agent."**
  - Root agent **WAJIB** mengevaluasi laporan secara mandiri dan menentukan langkah selanjutnya — tidak boleh langsung menyetujui saran dari sub-agent.

- **Sub-Agent Error Handling**:
  - Jika sub-agent menemukan error, WAJIB melaporkan detail error ke root agent. DILARANG melakukan *self-fix loop*.
  - Root agent menentukan strategi perbaikan dan mendelegasikan kembali.
  - Jika dalam 3x percobaan perbaikan error tetap terjadi, root agent WAJIB memerintahkan riset ke internet untuk best practice dan referensi source code terbaru terkait library yang digunakan.

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
