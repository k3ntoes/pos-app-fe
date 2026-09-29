# Project Rules for AI Agents: Token Conservation

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

- **Python Toolchain (uv)**:
  - WAJIB gunakan `uv` untuk eksekusi, dependensi, dan environment.
  - Eksekusi: `uv run <command>` (contoh: `uv run pytest`, `uv run ruff check`, `uv run pyright`).
  - Dependensi: `uv add <package>`, `uv remove <package>`, `uv sync`.
  - `uv.lock` adalah source of truth dependensi dan WAJIB di-commit ke Git. Dilarang modifikasi `uv.lock` manual.

- **Integrated Skills Ecosystem**:
  - **Matt Pocock's Engineering Skills**:
    - Issue tracker: Wajib gunakan Beads (`bd` CLI). Rujuk `docs/agents/issue-tracker.md`.
    - Triage labels: 5 canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Rujuk `docs/agents/triage-labels.md`.
    - Domain docs: Multi-context domain architecture via root `CONTEXT-MAP.md` dan ADR di `docs/adr/` & `app/domain/<context>/docs/adr/`. Rujuk `docs/agents/domain.md`.
    - Grilling rules: Wajib patuh pada aturan di `docs/agents/grilling.md` dan `.agents/rules/grilling.md` (zero-code selama grilling, aktifkan skill `/antislop`, pertanyaan 1 per 1 dengan 1-3 pilihan dan 1 saran terbaik, riset/web search sebelum bertanya, output wajib berupa Beads issues + checklist monitoring tasks `TASKS_MONITOR.md`, penulisan issue high-level descriptive tanpa raw code snippets).
    - Semua skill rekayasa (`/domain-modeling`, `/triage`, `/to-tickets`, `/to-spec`, dll.) wajib patuh pada terminologi di `CONTEXT-MAP.md` dan pelacakan issue via `bd`.

  - **Beads (`bd`)**:
    - Wajib untuk SEMUA task tracking: `bd ready` -> klaim `bd update <id> --claim` -> tutup `bd close <id>`.
    - DILARANG membuat todo list markdown manual.
    - Gunakan `bd remember` untuk memori persisten proyek.
    - Catatan: Project ini TIDAK menggunakan Dolt. MariaDB adalah application source of truth.
  - **GitNexus**:
    - WAJIB jalankan impact analysis (`impact({target: symbolName, direction: "upstream"})`) sebelum mengedit simbol fungsi, kelas, atau method.
    - WAJIB jalankan `detect_changes()` sebelum commit untuk memvalidasi blast radius.
    - Gunakan `query` atau `context` untuk eksplorasi execution flow dan call graph.
  - **Graphify**:
    - Gunakan untuk pemetaan visual/struktural arsitektur makro codebase (`graphify-out/`).
    - Jalankan pembaruan relasi struktural saat terjadi perubahan modul besar.
  - **Ponytail**:
    - WAJIB load skill `/ponytail` sebelum modifikasi kode guna memastikan solusi minimalis, YAGNI, dan menghindari over-engineering.

- **Mandatory Pre-Coding Gates**:
  - Load Ponytail -> Cek & klaim issue via `bd` -> Analisis blast radius via `gitnexus`.
  - Sandbox Policy: WAJIB gunakan `BypassSandbox: true` untuk semua perintah `git` dan `bd`.

- **File Size & Modularity (Token Conservation)**:
  - Target: 150 – 250 LOC per file.
  - Hard Ceiling: Max 300 LOC. WAJIB modularisasi jika mendekati batas.

- **Session Completion & Checklist**:
  - Jalankan `gitnexus_detect_changes()` dan `uv run pytest`.
  - WAJIB update `CHECKLIST.md` dan push: `git pull --rebase` && `git push` (WAJIB gunakan `BypassSandbox: true`).
  - Rujuk `CODING_RULES.md` & `CHECKLIST.md` untuk standar detail.
