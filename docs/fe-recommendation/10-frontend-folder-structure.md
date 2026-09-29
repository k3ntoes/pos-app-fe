# 10 — Struktur Folder Frontend

Dokumen ini menetapkan struktur folder yang rapi untuk project frontend. Tujuannya agar:
- tim tahu di mana menulis kode baru,
- pola type-safe dan reusable lebih mudah dijaga,
- fitur tidak menjadi campur aduk antara logic, UI, dan util.

Folder ini bersifat panduan, rujukan terkait dapat dilihat pada [Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md) dan [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md).

---

## 1. Prinsip Folder

1. **Fitur adalah unit organisasi utama**
   - satu fitur punya satu ruang lingkup yang jelas
   - fitur berisi UI, hook, dan logic khusus fitur tersebut
   - fitur tidak boleh menyebar tanpa pola

2. **Komponen shared dipisah dari fitur**
   - komponen umum masuk `components/`
   - fitur tidak boleh mengandalkan duplikasi komponen kecil di tiap folder fitur

3. **API, Schemas, dan transform terpisah dari presentasi**
   - endpoint dan mapping respons di `api/`
   - skema validasi Zod di `schemas/`
   - transform dan util murni di `lib/`
   - kode UI tidak boleh berisi logika transform yang berulang

4. **Types didefinisikan dekat dengan penggunaannya, tapi tetap konsisten**
   - types untuk response, DTO, props, dan hook result harus ada
   - jangan menebak bentuk respons; modelkan bentuk yang dikonsumsi

5. **Hooks dipisah menurut ruang lingkup**
   - hook umum lintas fitur masuk `hooks/`
   - hook khusus fitur boleh masuk `features/` bila tidak digunakan di tempat lain

---

## 2. Struktur Dasar yang Disarankan

```text
pos-app-fe/
  src/
    app/
      providers.tsx
      router.tsx
      queryClient.ts
      toast.tsx
    api/
      client.ts
      auth.ts
      users.ts
      roles.ts
      units.ts
      audit.ts
      error.ts
    schemas/
      auth.ts
      users.ts
      roles.ts
      units.ts
    components/
      layout/
        AppShell.tsx
        Header.tsx
        Sidebar.tsx
        UnitSwitcher.tsx
        Page.tsx
      ui/
        Button.tsx
        Input.tsx
        Badge.tsx
        Card.tsx
        Select.tsx
        Toast.tsx
        Skeleton.tsx
        EmptyState.tsx
        Dialog.tsx
      forms/
        FormField.tsx
        FormError.tsx
      tables/
        BaseTable.tsx
        Pagination.tsx
        TableSkeleton.tsx
        EmptyTable.tsx
        ErrorTable.tsx
    features/
      auth/
        LoginPage.tsx
        LoginForm.tsx
        useLogin.ts
        types.ts
      users/
        UsersList.tsx
        UsersTable.tsx
        UserDetail.tsx
        CreateUserForm.tsx
        EditUserForm.tsx
        useUsers.ts
        useUserDetail.ts
        useCreateUser.ts
        useEditUser.ts
        types.ts
      roles/
        RolesList.tsx
        RolesTable.tsx
        RoleDetail.tsx
        RoleEditorForm.tsx
        useRoles.ts
        useRoleDetail.ts
        useEditRolePermissions.ts
        types.ts
      units/
        UnitsList.tsx
        UnitsTable.tsx
        UnitSwitcher.tsx
        useUnits.ts
        types.ts
      audit/
        AuditList.tsx
        AuditTable.tsx
        AuditFilters.tsx
        AuditDetail.tsx
        useAudit.ts
        types.ts
    hooks/
      useToast.ts
      useConfirm.ts
      usePermissions.ts
    lib/
      api/
        error.ts
        pagination.ts
        queryKeys.ts
      format/
        date.ts
        url.ts
        id.ts
      validate/
        password.ts
    types/
      api.ts
      common.ts
      features.ts
      ui.ts
    theme/
      tokens.ts
      tailwind.config.ts
      globals.css
    index.tsx
    App.tsx
```

---

## 3. Penjelasan per Folder

### `app/`
- inisialisasi aplikasi
- router
- query client
- toast/notifikasi provider
- pembeda antara konfigurasi aplikasi dan fitur

### `api/`
- endpoint definitions
- request builder dengan dukungan CSRF ([Dokumen 01 — Arsitektur Frontend](01-frontend-architecture.md))
- transform error dari bentuk standar ([Dokumen 05 — Kontrak API](05-api-contract.md))
- mapping/DTO sederhana bila perlu
- **tidak** boleh berisi JSX atau komponen UI

### `schemas/`
- definisi skema Zod untuk validasi form dan payload klien
- selaras dengan kontrak API dan validasi backend

### `components/`
- komponen presentasional yang digunakan berulang
- `layout/` untuk kerangka aplikasi ([Dokumen 04 — Praktik Terbaik UI/UX](04-uiux-best-practices.md))
- `ui/` untuk elemen dasar (Tailwind CSS + Headless primitives)
- `forms/` untuk pola form (React Hook Form)
- `tables/` untuk pola tabel (TanStack Table)

### `features/`
- halaman/feature utuh (seperti manajemen user, role, unit sesuai [Dokumen 02 — Modul Pengguna, Peran, & Unit](02-features-users-roles-units.md) dan audit log [Dokumen 03 — Modul Audit Log](03-audit-feature.md))
- UI + hook khusus fitur
- types khusus fitur bila perlu

### `hooks/`
- hook yang digunakan lintas fitur
- contoh: `useToast`, `useConfirm`, `usePermissions`

### `lib/`
- fungsi murni dan transform
- error mapping, pagination helper, query key builder, format helper
- tidak boleh berisi JSX

### `types/`
- types global/shared
- types untuk API, common, dan UI
- bila types terlalu spesifik ke satu fitur, taruh di `features/<fitur>/types.ts`

### `theme/`
- design token
- konfigurasi Tailwind ([Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md))
- global style

---

## 4. Cara Memisahkan Fitur

Setiap fitur sebaiknya memiliki pola yang sama:
- halaman utama
- komponen tabel/list
- komponen form bila ada
- hook untuk fetching/mutasi (TanStack Query)
- types untuk respons dan payload

Contoh pola users ([Dokumen 02 — Modul Pengguna, Peran, & Unit](02-features-users-roles-units.md)):
- `features/users/UsersList.tsx` → halaman/list
- `features/users/UsersTable.tsx` → tabel khusus users (TanStack Table)
- `features/users/CreateUserForm.tsx` → form khusus users (React Hook Form + Zod)
- `features/users/useUsers.ts` → query + pagination orchestration
- `features/users/useCreateUser.ts` → mutasi orchestration + error mapping 422
- `features/users/types.ts` → types respons, DTO, dan query result

---

## 5. Ringkasan
Struktur folder ini menjamin pemisahan tanggung jawab yang bersih antara server state, client state, validasi Zod, dan presentasi UI, sesuai rujukan [Dokumen 12 — Spesifikasi Stack Definitif](12-stack-specification.md) dan [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md).

---
⬅ **Sebelumnya:** [Dokumen 09 — Aturan & Konvensi Kode](09-coding-rules.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 11 — Tooling & Biome](11-tooling-and-biome.md)
