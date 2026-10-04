# POS App Frontend — Design System & UI Specification

> [!IMPORTANT]
> Dokumen ini mendefinisikan standar visual, palet warna, tipografi, token `@theme` Tailwind CSS v4, ergonomi sentuh POS, dan mitigasi kelelahan mata serta slip-trap yang berlaku mutlak untuk seluruh modul antarmuka POS Admin & Kasir Web.

---

## 1. Color Palette, Psychology & Glare Resistance

Palet warna dirancang untuk meminimalkan kelelahan mata (*eye fatigue*) selama shift 8+ jam di bawah lampu retail yang terang (*overhead retail glare*), menghindari *stark white* (`#ffffff` murni) dan *pure black* (`#000000`).

### 1.1 Brand Primary & Trust Color
- **Primary 50**: `#eef2ff`
- **Primary 100**: `#e0e7ff`
- **Primary 200**: `#c7d2fe`
- **Primary 300**: `#a5b4fc`
- **Primary 400**: `#818cf8`
- **Primary 500**: `#6366f1` (Brand Accent & Interactive States)
- **Primary 600**: `#2563eb` (Trust Indigo / Main Transaction Action - WCAG AAA compliant)
- **Primary 700**: `#1d4ed8` (Active / Pressed state)
- **Primary 800**: `#1e40af`
- **Primary 900**: `#1e3a8a`

### 1.2 Neutral / Slate Surfaces (Glare Resistance)
- **Off-White Canvas / App Background**: `#f8fafc` (Slate 50) / `#f1f5f9` (Slate 100)
- **Dark Mode Soft-Slate Surface**: `#0f172a` (Slate 900) dengan kontras tinggi untuk mencegah silau pada perangkat operasional malam hari atau gudang redup.
- **Card & Surface**: `#ffffff` (Light Card Surface) / `#1e293b` (Dark Card Surface)
- **Border & Dividers**: `#e2e8f0` (Slate 200) untuk batas halus tanpa ketajaman berlebih.
- **Muted Text & Placeholders**: `#64748b` (Slate 500) hingga `#475569` (Slate 600) untuk memastikan teks sekunder tetap terbaca tanpa mendistraksi perhatian kasir.

### 1.3 Semantic Color Psychology & Alarm Fatigue Prevention
- **Success / Emerald**:
  - `emerald-500`: `#10b981` (Completed Transaction, Positive Balance, Stock Normal)
  - `emerald-700`: `#047857` (High contrast text on success badges)
- **Warning / Amber**:
  - `amber-500`: `#f59e0b` (Low Stock Alert, Pending Status, Non-destructive Attention)
  - `amber-700`: `#b45309` (High contrast text on warning badges)
- **Destructive / Red (Exclusive)**:
  - `rose-600`: `#e11d48` (Dilarang keras digunakan untuk warning biasa. Eksklusif dialokasikan untuk aksi destruktif: Void Transaction, Delete Item, Hapus Data).
- **Alarm Fatigue Prevention**: Pembatasan penggunaan warna merah menyala agar kasir tidak mengalami mati rasa visual (*alarm fatigue*), memastikan setiap kemunculan warna merah langsung menarik atensi kesadaran penuh.

---

## 2. WCAG 2.1 AAA Contrast & Critical Elements (7:1)

Seluruh elemen keuangan kritis (Total Belanja, Kembalian, Status Pembayaran) wajib mematuhi target kontras level **AAA (7:1)** terhadap latar belakang untuk memastikan keterbacaan instan di bawah *overhead retail glare*:
- **Total Belanja / Grand Total**: Wajib menggunakan teks tebal `font-mono tabular-nums text-slate-900 bg-slate-100` atau setara dengan rasio kontras minimum 7:1.
- **Kembalian (Change Amount)**: Warna kontras tinggi dengan badge latar belakang emerald/slate yang memenuhi rasio kontras 7:1 untuk menghindari kesalahan hitung manual kasir di penghujung shift.

---

## 3. Fitts's Law, Touch Ergonomics & Hick's Law

### 3.1 Touch Ergonomics & Tap Targets
- **Minimum Tap Target**: `44px x 44px` (`min-h-11 min-w-[44px]`).
- **Recommended POS Numpad & Payment Buttons**: `48px x 48px` hingga `56px` dengan jarak pemisah (*spacing*) minimal `8px` untuk mencegah salah sentuh (*fat finger error*) pada layar sentuh POS (*touchscreen terminal*).

### 3.2 Hick's Law & Rapid Scanning
- **Quick-Action Payment Methods**: Pengelompokan metode pembayaran utama (Tunai, QRIS, EDC) dalam grid terstruktur untuk mempercepat pemindaian visual (*rapid scanning*) dan mengurangi waktu transaksi per pelanggan.
- **Secondary Menu**: Opsi pembayaran sekunder disembunyikan dalam menu dropdown/drawer terstruktur agar kasir tidak terbebani secara kognitif (*cognitive overload*) saat melayani antrean panjang.

---

## 4. Slip Traps Prevention & Destructive Action Isolation

Untuk mencegah kesalahan fatal (*slip-trap*) kasir saat melayani antrean cepat:
- **Spatial Isolation**: Tombol destruktif (Void Order / Cancel Transaction) wajib dipisahkan secara spasial minimal **16px hingga 24px** dari tombol Checkout utama.
- **Two-Step Confirmation**: Setiap aksi Void/Delete wajib memicu modal konfirmasi 2 langkah (*explicit confirmation modal*) dengan jeda keamanan interaktif.

---

## 5. Tabular Figures (`tabular-nums`) Wajib

Seluruh representasi angka numerik, harga satuan, subtotal, diskon, pajak, dan kembalian **wajib** menggunakan utilitas Tailwind `tabular-nums` (`font-variant-numeric: tabular-nums`) untuk memastikan perataan vertikal yang konsisten:
```css
.tabular-data {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
```

---

## 6. Tipografi & Tailwind CSS v4 `@theme`

### 6.1 Font Families
- **Sans**: `Inter, system-ui, -apple-system, sans-serif` (digunakan untuk seluruh UI label, form, navigation, dan body text).
- **Mono**: `JetBrains Mono, Geist Mono, monospace` (Wajib digunakan untuk seluruh angka mata uang, harga, quantity, dan tabular data).

### 6.2 Blok `@theme` Tailwind v4
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --color-primary-500: #6366f1;
  --color-primary-600: #2563eb;
  --color-background: #f8fafc;
  --color-foreground: #0f172a;
  --color-surface-dark: #0f172a;
  --color-destructive: #e11d48;
}
```

---

## 7. Component Guidelines & Accessibility Checklist

### 7.1 Component States
- **Hover**: Shift background by 1 shade for tactile feedback.
- **Active / Pressed**: Immediate visual scale down or border color reinforcement.
- **Focus Ring**: Explicit `ring-2 ring-primary-500 ring-offset-2` for keyboard and accessibility navigation.

### 7.2 Accessibility Checklist
1. **Color Contrast**: 7:1 ratio for critical financial digits.
2. **Screen Reader Support**: ARIA labels on all POS action pads.
3. **Keyboard Shortcuts**: Escape to dismiss modals, Enter to confirm quick checkout.

---

## 8. POS Layout Breakpoints & Grid System

### 8.1 Breakpoint Strategy
- **Mobile / Handheld POS (`< 768px`)**: Single-column view with bottom sheet cart.
- **Tablet POS (`768px - 1280px`)**: Two-column split layout (Catalog grid + Sticky Cart).
- **Desktop Admin (`> 1280px`)**: Three-column dashboard view with collapsible sidebar and advanced analytics filters.

### 8.2 Spacing & Padding Tokens
- Base unit: `4px`.
- Common padding: `p-4` (16px) for cards, `p-6` (24px) for major containers.

---

## 9. State Management & Offline Resilience UI

- **Sync Status Indicator**: Badge status koneksi real-time di header untuk memantau sinkronisasi database offline/online.
- **Offline Transaction Queue**: Penanda visual antrean transaksi lokal saat jaringan terputus, memastikan kasir tetap dapat memproses pembayaran tanpa interupsi.

---

## 10. Micro-interactions & Haptic/Visual Feedback

- **Success Pulse**: Animasi ringkas pada total kembalian saat transaksi sukses tercatat.
- **Error Shake**: Efek getar visual halus pada form input saat terjadi kesalahan scan barcode atau nominal pembayaran kurang.

---

## 11. Design System Governance & Versioning Protocol
- **Single Source of Truth**: `DESIGN.md` adalah referensi mutlak yang disinkronkan secara periodik ke Stitch MCP.
- **Change Request Workflow**: Setiap usulan perubahan warna atau token wajib melalui peninjauan UX matrix dan persetujuan arsitek frontend.

---

## 12. QA & Automated Design Lints
- **Visual Regression Tests**: Pemeriksaan berkala menggunakan Playwright untuk memastikan tidak ada pergeseran tata letak pada layar POS utama.
- **Contrast Audits**: Setiap komponen baru wajib diuji kontras warna WCAG 2.1 AAA sebelum di-merge ke branch utama.

---

## 13. Performance & Rendering Budgets for POS UI
- **Initial Load Budget**: Bundle JavaScript utama POS < 150KB gzip untuk memastikan cold start < 1.5 detik pada perangkat tablet kasir standar.
- **Frame Rate Target**: 60 FPS konstan pada animasi drawer, modal popover, dan interaksi numpad kasir tanpa lag.
- **Memory Footprint**: Pembersihan interval listener dan caching efektif dengan TanStack Query untuk mencegah memory leak selama shift operasi non-stop.

---

## 14. Browser Compatibility & Progressive Enhancement
- **Target Environments**: Chromium-based browsers (Chrome, Edge) on POS tablets and admin terminals.
- **Progressive Enhancement**: Fallback fonts and standard CSS variables for robust rendering across diverse operating systems.
- **Offline Storage Strategy**: Local IndexedDB fallback for transaction records to guarantee zero data loss during connectivity drops.
- **Hardware Integration Standards**: Native barcode scanner and receipt printer SDK wrapper compliance.

---

## 15. Compliance & Enforcement

1. **Design Token Integrity**: Dilarang keras menggunakan warna di luar spesifikasi token.
2. **Ergonomic Audit**: Setiap komponen POS kasir wajib lolos validasi tap target 48px dan isolasi tombol destruktif.
3. **Accessibility Verification**: Mematuhi standar WCAG 2.1 AAA pada komponen finansial utama.
4. **Code Quality**: Mematuhi aturan Biome formatter dan menjaga LOC file kode di bawah 300 baris.
