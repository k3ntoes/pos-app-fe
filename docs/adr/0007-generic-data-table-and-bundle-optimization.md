# ADR 0007: Generic DataTable Architecture & Bundle Optimization

## Status
Accepted

## Context
Seiring berkembangnya fitur-fitur admin POS (Users, Roles, Units, Audit Logs), terdapat kebutuhan untuk menyeragamkan presentasi data tabel secara modular dan konsisten. Sebelumnya, tabel di setiap halaman fitur diimplementasikan secara terpisah dengan boilerplate paginasi dan sorting yang berulang. Selain itu, terdapat sejumlah dependensi npm eksternal yang redundan atau tidak digunakan secara optimal (seperti `react-hot-toast`, `@base-ui-components/react`, `cn`, `shadcn`, dan pustaka eksternal manipulasi tanggal `date-fns`), yang berpotensi memperbesar ukuran bundle produksi.

## Decision
1. **Generic DataTable Architecture**: Membangun komponen tabel generik berbasis TanStack Table v8 di `src/components/data-table/` yang mencakup `DataTable.tsx` dan `DataTablePagination.tsx`, serta dipisahkan dari primitif shadcn `src/components/ui/table.tsx`.
2. **Bundle Slimming & Dependency Cleanup**: Menghapus dependensi produksi yang tidak terpakai (`react-hot-toast`, `@base-ui-components/react`, `cn`, `shadcn`, `date-fns`) dan memindahkan `puppeteer` ke `devDependencies`.
3. **Native Web API Helpers**: Menggantikan dependensi `date-fns` dengan utilitas tanggal dan mata uang berbasis Web API standar (`Intl.DateTimeFormat` dan `Intl.NumberFormat`) di `src/lib/format.ts`.

## Consequences
- **Positif**: Ukuran bundle produksi lebih ramping dan bersih, konsistensi UI tabel meningkat di seluruh fitur admin, pemeliharaan kode menjadi terpusat, serta pengujian unit tabel menjadi lebih mudah dan terisolasi.
- **Negatif**: Membutuhkan sedikit penyesuaian pada komponen halaman fitur (seperti `UserListPage`) untuk mengadopsi definisi kolom (`ColumnDef`) TanStack Table.
