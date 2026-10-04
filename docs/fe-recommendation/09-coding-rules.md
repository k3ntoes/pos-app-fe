# 09 — Frontend Coding Rules & TypeScript Standards (SSOT)

> [!NOTE]
> Aturan penulisan kode, strict mode TypeScript, validasi Zod yang mencerminkan DTO Pydantic backend, dan pengelolaan custom hooks TanStack Query.

---

## 1. Aturan Penulisan Kode & TypeScript Strict Mode
- **TypeScript Strict**: `strict: true` diaktifkan secara mutlak. Penggunaan `any` dilarang keras kecuali untuk transisi data mentah pihak ketiga yang harus segera di-parse dengan Zod.
- **Zod Schemas**: Setiap DTO backend (CreateUserRequest, UpdateUnitRequest, AssignRoleRequest, dll.) wajib memiliki skema Zod padanannya di frontend untuk validasi runtime form sebelum dikirim ke API.
- **Naming Conventions**:
  - Komponen React: PascalCase (`UserListTable.tsx`).
  - Hooks & Utilities: camelCase (`useUsers.ts`, `formatDate.ts`).
  - Tipe & Interface: PascalCase (`UserResponse`, `RoleData`).

---

## 2. Isolasi TanStack Query Hooks
- Setiap domain feature (`users`, `roles`, `units`, `auth`) wajib memiliki file custom hooks tersendiri (misalnya `src/features/users/api/use-users.ts`) yang membungkus pemanggilan TanStack Query (`useQuery`, `useMutation`).
- Mutasi data wajib menyertakan logika `onSuccess` untuk melakukan invalidasi query keys yang relevan secara otomatis.

---
⬅ **Sebelumnya:** [Dokumen 08 — Panduan Tailwind CSS](08-tailwind-guidance.md) | 📑 **[Indeks Dokumen](README.md)** | ➡ **Selanjutnya:** [Dokumen 10 — Struktur Folder Frontend](10-frontend-folder-structure.md)
