import { unitsApi } from "@/api/units";
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
import type { CreateUnitInput, UpdateUnitInput } from "@/schemas/unit";
import type { Unit } from "@/types/unit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteUnitModal } from "./DeleteUnitModal";
import { UnitFormModal } from "./UnitFormModal";

export function UnitListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", search, statusFilter],
    queryFn: () =>
      unitsApi.getUnits({
        search: search || undefined,
        is_active:
          statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
      }),
  });

  const units = data?.units || [];
  const totalUnits = data?.total || units.length;
  const activeUnits = units.filter((u) => u.is_active).length;
  const inactiveUnits = units.filter((u) => !u.is_active).length;

  const createMutation = useMutation({
    mutationFn: (payload: CreateUnitInput) => unitsApi.createUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUnitInput }) =>
      unitsApi.updateUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsFormOpen(false);
      setSelectedUnit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitsApi.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsDeleteOpen(false);
      setUnitToDelete(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (unit: Unit) => unitsApi.updateUnit(unit.id, { is_active: !unit.is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });

  const handleFormSubmit = (formData: CreateUnitInput | UpdateUnitInput) => {
    if (selectedUnit) {
      updateMutation.mutate({ id: selectedUnit.id, payload: formData as UpdateUnitInput });
    } else {
      createMutation.mutate(formData as CreateUnitInput);
    }
  };

  const handleOpenCreate = () => {
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteOpen(true);
  };

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            aria-label="Filter status"
            className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
                          <DropdownMenuItem onClick={() => toggleStatusMutation.mutate(unit)}>
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
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        unit={selectedUnit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteUnitModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => unitToDelete && deleteMutation.mutate(unitToDelete.id)}
        unit={unitToDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
