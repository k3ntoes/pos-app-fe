---
name: llm-router
description: >
  Supervisor Agent routing playbook. Determines whether an incoming task should
  be dispatched to `technical_executor` (flash_lite, I/O work) or `deep_reasoning`
  (Claude Sonnet / Gemini Pro, complex reasoning). Also enforces the file-isolation
  contract for deep_reasoning. Activate whenever you need to decide *how* to
  delegate a task, not *what* to do.
---

# LLM Router — Supervisor Playbook

## 1. Decision Tree

```
Incoming task
│
├─ Is it I/O / repetitive / file work?
│   (read file, write script, extract log, run grep, parse output)
│   └─→  Route: TECHNICAL_EXECUTOR
│         Tool : execute_technical_task
│         Model: flash_lite
│         Rule : report raw facts only; end with sentinel phrase
│
└─ Does it require reasoning / judgment / architecture?
    (DB design, migration plan, algo debug, security eval, ADR decision)
    └─→  Route: DEEP_REASONING
          Tool : deep_reasoning
          Model: Claude Sonnet  (fallback → Gemini Pro; never Flash)
          Rule : Supervisor must pre-fetch any files via technical_executor
                 then pass content as payload — deep_reasoning never touches files
```

> **Ragu?** Default ke `deep_reasoning`. Salah route ke Pro lebih murah
> daripada jawaban halusinasi dari Flash.

---

## 2. File-Fetch Protocol (sebelum memanggil deep_reasoning)

Jika task membutuhkan konten file:

```
Step 1 — Supervisor → technical_executor
  Instruksi: "Baca file <path>, kembalikan isi mentah."

Step 2 — technical_executor → Supervisor
  Laporan: isi file verbatim.
  Sentinel: "Laporan selesai. Menunggu instruksi berikutnya dari root agent."

Step 3 — Supervisor → deep_reasoning
  Payload: [konteks task] + [isi file dari Step 2]
  deep_reasoning tidak perlu akses filesystem sama sekali.
```

---

## 3. Model Priority untuk deep_reasoning

| Priority | Model | Kondisi |
|---|---|---|
| 1 (Utama) | **Claude Sonnet** | Default — gunakan selalu |
| 2 (Fallback) | **Gemini Pro** | Claude tidak tersedia / rate-limited / kredit habis |
| ❌ (Dilarang) | Flash / Flash-Lite | Tidak boleh digunakan untuk deep reasoning |

Jika Sonnet gagal mid-session → selesaikan tugas dengan Gemini Pro; catat di laporan
bahwa fallback digunakan.

---

## 4. Reporting Contract

### technical_executor output
- Hanya fakta/hasil mentah (output command, isi file, list temuan).
- **DILARANG**: saran, rekomendasi, langkah selanjutnya, opini.
- Tutup selalu dengan: **"Laporan selesai. Menunggu instruksi berikutnya dari root agent."**

### deep_reasoning output
- Jawaban lengkap, terstruktur (heading → bullet → code block).
- Supervisor **WAJIB** forward payload Pro secara utuh ke user — **dilarang truncate**.

---

## 5. Error Handling

1. Sub-agent error → WAJIB laporkan detail ke Supervisor. **Dilarang self-fix loop.**
2. Supervisor menentukan strategi dan re-delegate.
3. Setelah **3× gagal** → Supervisor memerintahkan riset internet:
   - Cari best practice resmi.
   - Cari referensi source code library terbaru.
   - Baru delegasikan ulang dengan konteks baru.

---

## 6. Anti-Patterns (DILARANG)

| Anti-Pattern | Penjelasan |
|---|---|
| Hero Fallacy | Flash menjawab masalah kompleks tanpa memanggil Pro |
| Silent Fallback | Supervisor diam-diam turun ke Flash saat Pro gagal |
| Context Truncation | Supervisor memotong output Pro sebelum diteruskan ke user |
| Direct File Access | deep_reasoning membaca/menulis file sendiri tanpa melalui technical_executor |
| Self-Fix Loop | Sub-agent mencoba memperbaiki errornya sendiri tanpa lapor Supervisor |
