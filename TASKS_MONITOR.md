# POS App Frontend - Tasks Monitoring

Dokumen ini berisi checklist alur pengerjaan / claim order monitoring untuk frontend POS App.

## Ringkasan Status Isu

| Beads Issue ID | Judul | Prioritas | Status | Dependency |
|----------------|-------|-----------|--------|------------|
| [`pos-app-fe-ie5`](#pos-app-fe-ie5) | Setup project foundation & tooling | P1 | Ready / Open | Blocks: `pos-app-fe-xz2` |
| [`pos-app-fe-xz2`](#pos-app-fe-xz2) | Implementasi Auth Shell (login, logout, session, CSRF) | P1 | Blocked | Depends on: `pos-app-fe-ie5`<br>Blocks: `pos-app-fe-aep` |
| [`pos-app-fe-aep`](#pos-app-fe-aep) | Implementasi App Shell (header, unit switcher, navigasi permission-aware) | P1 | Blocked | Depends on: `pos-app-fe-xz2`<br>Blocks: `pos-app-fe-0x9`, `pos-app-fe-0rg` |
| [`pos-app-fe-0x9`](#pos-app-fe-0x9) | Implementasi fitur Users | P2 | Blocked | Depends on: `pos-app-fe-aep` |
| [`pos-app-fe-0rg`](#pos-app-fe-0rg) | Implementasi fitur Roles | P2 | Blocked | Depends on: `pos-app-fe-aep` |

---

## Detail Checklist Subtask

### <a id="pos-app-fe-ie5"></a>1. pos-app-fe-ie5: Setup project foundation & tooling
- **Prioritas:** P1
- **Status:** Ready / Open
- **Dependency:** Blocks `pos-app-fe-xz2`
- **Subtasks:**
  - [ ] Inisialisasi Vite + React + TypeScript strict
  - [ ] Konfigurasi Tailwind v4 (`@theme`)
  - [ ] Setup linter & formatter (Biome)
  - [ ] Setup Lefthook pre-commit hooks
  - [ ] Integrasi TanStack Query
  - [ ] Setup React Router v6
  - [ ] Konfigurasi shadcn/ui + Base UI engine
  - [ ] Install & setup Sonner (toast notifications)
  - [ ] Install & setup date-fns
  - [ ] Pembuatan HTTP client + CSRF helper

---

### <a id="pos-app-fe-xz2"></a>2. pos-app-fe-xz2: Implementasi Auth Shell (login, logout, session, CSRF)
- **Prioritas:** P1
- **Status:** Blocked (Depends on `pos-app-fe-ie5`)
- **Dependency:** Depends on `pos-app-fe-ie5`, Blocks `pos-app-fe-aep`
- **Subtasks:**
  - [ ] Implementasi Login form (React Hook Form + Zod)
  - [ ] Implementasi auto-injection CSRF token header pada HTTP client
  - [ ] Implementasi pengecekan sesi `GET /auth/me`
  - [ ] Implementasi Logout handler
  - [ ] Implementasi 401 redirect / 403 alert interceptor
  - [ ] Konfigurasi Route guards
  - [ ] Implementasi hard redirect ke `/change-password` jika `must_change_password` aktif

---

### <a id="pos-app-fe-aep"></a>3. pos-app-fe-aep: Implementasi App Shell (header, unit switcher, navigasi permission-aware)
- **Prioritas:** P1
- **Status:** Blocked (Depends on `pos-app-fe-xz2`)
- **Dependency:** Depends on `pos-app-fe-xz2`, Blocks `pos-app-fe-0x9`, `pos-app-fe-0rg`
- **Subtasks:**
  - [ ] Implementasi Layout shell (header, sidebar, content area)
  - [ ] Implementasi Unit switcher di header (localStorage + React Context)
  - [ ] Implementasi Eager permission loading (`GET /api/v1/users/{id}/roles` ke AuthContext)
  - [ ] Implementasi permission-aware menu visibility
  - [ ] Implementasi recompute permission saat unit diganti

---

### <a id="pos-app-fe-0x9"></a>4. pos-app-fe-0x9: Implementasi fitur Users
- **Prioritas:** P2
- **Status:** Blocked (Depends on `pos-app-fe-aep`)
- **Dependency:** Depends on `pos-app-fe-aep`
- **Subtasks:**
  - [ ] Implementasi User list (TanStack Table dengan server-side pagination, sort, & filter)
  - [ ] Pembuatan halaman Detail user
  - [ ] Implementasi Create user form (dedicated page RHF + Zod)
  - [ ] Implementasi Non-dismissible temporary password modal
  - [ ] Implementasi Edit user form
  - [ ] Implementasi Status update modal (ACTIVE / SUSPENDED / DEACTIVATED)
  - [ ] Implementasi manajemen Role assignment

---

### <a id="pos-app-fe-0rg"></a>5. pos-app-fe-0rg: Implementasi fitur Roles
- **Prioritas:** P2
- **Status:** Blocked (Depends on `pos-app-fe-aep`)
- **Dependency:** Depends on `pos-app-fe-aep`
- **Subtasks:**
  - [ ] Implementasi Role list (TanStack Table dengan `is_system` badge)
  - [ ] Pembuatan halaman Detail role
  - [ ] Implementasi Create/edit role form (dedicated page) dengan permission editor 16 permissions yang dikelompokkan
  - [ ] Implementasi perlindungan immutable system roles
  - [ ] Implementasi Delete role modal (hanya aktif jika tidak ada active assignments)

---

## Catatan Arsitektur
- `CONTEXT.md` telah dipecah menjadi multi-context domain architecture (`docs/domain/`, `CONTEXT-MAP.md`).
