# POS App Frontend - Tasks Monitoring

Dokumen ini berisi checklist alur pengerjaan / claim order monitoring untuk frontend POS App.

## Ringkasan Status Isu

| Beads Issue ID | Judul | Prioritas | Status | Dependency |
|----------------|-------|-----------|--------|------------|
| [`pos-app-fe-ie5`](#pos-app-fe-ie5) | Setup project foundation & tooling | P1 | Closed | Blocks: `pos-app-fe-xz2` |
| [`pos-app-fe-xz2`](#pos-app-fe-xz2) | Implementasi Auth Shell (login, logout, session, CSRF) | P1 | Closed | Depends on: `pos-app-fe-ie5`<br>Blocks: `pos-app-fe-aep` |
| [`pos-app-fe-aep`](#pos-app-fe-aep) | Implementasi App Shell (header, unit switcher, navigasi permission-aware) | P1 | Closed | Depends on: `pos-app-fe-xz2`<br>Blocks: `pos-app-fe-0x9`, `pos-app-fe-0rg` |
| [`pos-app-fe-0x9`](#pos-app-fe-0x9) | Implementasi fitur Users | P2 | Closed | Depends on: `pos-app-fe-aep` |
| [`pos-app-fe-0rg`](#pos-app-fe-0rg) | Implementasi fitur Roles | P2 | Closed | Depends on: `pos-app-fe-aep` |
| [`pos-app-fe-jnd`](#pos-app-fe-jnd) | Add change password menu in Header | P2 | Closed | - |
| [`pos-app-fe-6s4`](#pos-app-fe-6s4) | Fix edit user HTTP method to PATCH | P1 | Closed | - |

---

## Detail Checklist Subtask

### <a id="pos-app-fe-6s4"></a>7. pos-app-fe-6s4: Fix edit user HTTP method to PATCH
- **Prioritas:** P1
- **Status:** Closed
- **Dependency:** -
- **Subtasks:**
  - [x] Ubah HTTP method pada fungsi `updateUser` di `src/api/users.ts` dari `PUT` menjadi `PATCH`.
  - [x] Jalankan validasi lint, tsc, dan build.

### <a id="pos-app-fe-ie5"></a>1. pos-app-fe-ie5: Setup project foundation & tooling
- **Prioritas:** P1
- **Status:** Closed
- **Dependency:** Blocks `pos-app-fe-xz2`
- **Subtasks:**
  - [x] Inisialisasi Vite + React + TypeScript strict
  - [x] Konfigurasi Tailwind v4 (`@theme`)
  - [x] Setup linter & formatter (Biome)
  - [x] Setup Lefthook pre-commit hooks
  - [x] Integrasi TanStack Query
  - [x] Setup React Router v6
  - [x] Konfigurasi shadcn/ui + Base UI engine
  - [x] Install & setup Sonner (toast notifications)
  - [x] Install & setup date-fns
  - [x] Pembuatan HTTP client + CSRF helper

---

### <a id="pos-app-fe-xz2"></a>2. pos-app-fe-xz2: Implementasi Auth Shell (login, logout, session, CSRF)
- **Prioritas:** P1
- **Status:** Closed
- **Dependency:** Depends on `pos-app-fe-ie5`, Blocks `pos-app-fe-aep`
- **Subtasks:**
  - [x] Implementasi Login form (React Hook Form + Zod)
  - [x] Implementasi auto-injection CSRF token header pada HTTP client
  - [x] Implementasi pengecekan sesi `GET /auth/me`
  - [x] Implementasi Logout handler
  - [x] Implementasi 401 redirect / 403 alert interceptor
  - [x] Konfigurasi Route guards
  - [x] Implementasi hard redirect ke `/change-password` jika `must_change_password` aktif

---

### <a id="pos-app-fe-aep"></a>3. pos-app-fe-aep: Implementasi App Shell (header, unit switcher, navigasi permission-aware)
- **Prioritas:** P1
- **Status:** Closed
- **Dependency:** Depends on `pos-app-fe-xz2`, Blocks `pos-app-fe-0x9`, `pos-app-fe-0rg`
- **Subtasks:**
  - [x] Implementasi Layout shell (header, sidebar, content area)
  - [x] Implementasi Unit switcher di header (localStorage + React Context)
  - [x] Implementasi Eager permission loading (`GET /api/v1/users/{id}/roles` ke AuthContext)
  - [x] Implementasi permission-aware menu visibility
  - [x] Implementasi recompute permission saat unit diganti

---

### <a id="pos-app-fe-0x9"></a>4. pos-app-fe-0x9: Implementasi fitur Users
- **Prioritas:** P2
- **Status:** Closed
- **Dependency:** Depends on `pos-app-fe-aep`
- **Subtasks:**
  - [x] Implementasi User list (TanStack Table dengan server-side pagination, sort, & filter)
  - [x] Pembuatan halaman Detail user
  - [x] Implementasi Create user form (dedicated page RHF + Zod)
  - [x] Implementasi Non-dismissible temporary password modal
  - [x] Implementasi Edit user form
  - [x] Implementasi Status update modal (ACTIVE / SUSPENDED / DEACTIVATED)
  - [x] Implementasi manajemen Role assignment

---

### <a id="pos-app-fe-0rg"></a>5. pos-app-fe-0rg: Implementasi fitur Roles
- **Prioritas:** P2
- **Status:** Closed
- **Dependency:** Depends on `pos-app-fe-aep`
- **Subtasks:**
  - [x] Implementasi Role list (TanStack Table dengan `is_system` badge)
  - [x] Pembuatan halaman Detail role
  - [x] Implementasi Create/edit role form (dedicated page) dengan permission editor 16 permissions yang dikelompokkan
  - [x] Implementasi perlindungan immutable system roles
  - [x] Implementasi Delete role modal (hanya aktif jika tidak ada active assignments)

---

### <a id="pos-app-fe-jnd"></a>6. pos-app-fe-jnd: Add change password menu in Header
- **Prioritas:** P2
- **Status:** Closed
- **Dependency:** -
- **Subtasks:**
  - [x] Modifikasi `Header.tsx` menggunakan `DropdownMenu`.

---

## Catatan Arsitektur
- `CONTEXT.md` telah dipecah menjadi multi-context domain architecture (`docs/domain/`, `CONTEXT-MAP.md`).
