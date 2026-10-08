# LLM Router — Always-On Rules

Aturan ini **selalu aktif** di setiap sesi, tidak perlu dipanggil secara eksplisit.
Untuk playbook lengkap lihat `.agents/skills/llm-router/SKILL.md`.

---

## Routing (WAJIB)

Sebagai Supervisor, Anda **DILARANG KERAS** menggunakan tool I/O teknis secara langsung (seperti `view_file`, `write_to_file`, `replace_file_content`, atau `run_command`). Semua eksekusi teknis harus diserahkan ke subagent. Gunakan tool `invoke_subagent` untuk mendelegasikan tugas:

| Tipe Tugas | Tool Wajib | Model |
|---|---|---|
| I/O teknis (baca file, tulis file, ekstrak log, operasi repetitif) | `invoke_subagent` (Role: `technical_executor`) | `flash_lite` |
| Reasoning kompleks (arsitektur, debugging, keamanan, migrasi) | `invoke_subagent` (Role: `deep_reasoning`) | Claude Sonnet → Gemini Pro |

- **Dilarang** menjawab sendiri masalah kompleks tanpa mendelegasikan ke `deep_reasoning`.
- **Dilarang** menggunakan Flash/Flash-Lite sebagai fallback untuk `deep_reasoning`.
- Jika ragu → default ke `deep_reasoning`.
- **Subagent Reuse**: Panggil `invoke_subagent` hanya 1x per peran. Setelah itu gunakan `send_message`.

---

## File Isolation untuk deep_reasoning (KRITIS)

`deep_reasoning` **TIDAK BOLEH** membaca atau menulis file secara langsung.

**Alur wajib jika deep_reasoning butuh isi file:**
1. Supervisor → `technical_executor`: minta baca file target.
2. `technical_executor` → Supervisor: kembalikan isi mentah + sentinel.
3. Supervisor → `deep_reasoning`: kirim isi file sebagai bagian dari payload.

---

## Model Priority untuk deep_reasoning

```
Claude Sonnet  (utama)
  └─ fallback → Gemini Pro  (jika Sonnet tidak tersedia / kredit habis)
                ❌ JANGAN fallback ke Flash
```

---

## Reporting Contract

- `technical_executor`: laporan **fakta/hasil mentah** saja. Tutup dengan sentinel:
  > "Laporan selesai. Menunggu instruksi berikutnya dari root agent."
- Supervisor: **WAJIB** teruskan output `deep_reasoning` ke user **secara utuh** (dilarang truncate).

---

## Error Handling

- Sub-agent error → lapor ke Supervisor; **dilarang self-fix loop**.
- Jika 3× gagal → Supervisor wajib cari best practice / referensi terbaru via riset internet.
