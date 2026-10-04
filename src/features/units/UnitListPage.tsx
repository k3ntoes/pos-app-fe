import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUnitList } from "@/hooks/useUnitList";
import { DeleteUnitModal } from "./DeleteUnitModal";
import { UnitFormModal } from "./UnitFormModal";

export function UnitListPage() {
  const {
    search,
    statusFilter,
    isFormOpen,
    selectedUnit,
    isDeleteOpen,
    unitToDelete,
    units,
    totalUnits,
    activeUnits,
    inactiveUnits,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    handleSearch,
    handleFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseForm,
    handleCloseDelete,
    handleFormSubmit,
    handleConfirmDelete,
    handleToggleStatus,
  } = useUnitList();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Manajemen Unit & Cabang
          </h1>
          <p className="text-sm text-gray-500">
            Kelola daftar unit dan cabang operasional POS Anda.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="inline-flex items-center gap-2">
          + Tambah Unit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Unit Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Unit Nonaktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-500">{inactiveUnits}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Cari unit atau kode..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            aria-label="Filter status"
            className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data unit...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Gagal memuat data unit.</div>
        ) : units.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Tidak ada unit ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Kode Unit
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Cabang
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Alamat
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tanggal Dibuat
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900 tabular-nums">
                      {unit.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{unit.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {unit.address || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {unit.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200">
                          Nonaktif
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(unit.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-900">
                          <span className="sr-only">Buka menu</span>
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            role="img"
                            aria-label="Menu icon"
                          >
                            <title>Menu</title>
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleOpenEdit(unit)}>
                            Edit Unit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(unit)}>
                            {unit.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(unit)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Hapus Unit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UnitFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        unit={selectedUnit}
        isLoading={isCreating || isUpdating}
      />

      <DeleteUnitModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        unit={unitToDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
