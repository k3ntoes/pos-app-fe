import { rolesApi } from "@/api/roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RoleListItem } from "@/types/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeleteRoleModal } from "./DeleteRoleModal";

export function RoleListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [deleteModalRole, setDeleteModalRole] = React.useState<RoleListItem | null>(null);

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.getRoles(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role berhasil dihapus");
      setDeleteModalRole(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal menghapus role");
    },
  });

  const filteredRoles = React.useMemo(() => {
    if (!rolesData) return [];
    if (!search.trim()) return rolesData;
    const term = search.toLowerCase();
    return rolesData.filter(
      (role) =>
        role.name.toLowerCase().includes(term) || role.description?.toLowerCase().includes(term),
    );
  }, [rolesData, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Roles</h1>
          <p className="text-sm text-gray-500">
            Kelola role dan hak akses (permissions) granular untuk pengguna sistem POS.
          </p>
        </div>
        <Button asChild className="min-h-[44px]">
          <Link to="/roles/new">+ Tambah Role</Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Input
          placeholder="Cari berdasarkan nama atau deskripsi role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Role</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah User</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Memuat data roles...
                </TableCell>
              </TableRow>
            ) : filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada role ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-gray-900">{role.name}</TableCell>
                  <TableCell>
                    {role.is_system ? (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        System Role
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Custom Role
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{role?.assigned_users_count ?? 0}</span> user
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-indigo-600">
                      {role.permissions?.length || 0} permissions
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Aksi
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/roles/${role.id}`)}>
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/roles/${role.id}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteModalRole(role)}
                          disabled={role.is_system}
                          className={
                            role.is_system
                              ? "opacity-55 cursor-not-allowed text-gray-400"
                              : "text-red-600"
                          }
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteRoleModal
        role={deleteModalRole}
        isOpen={Boolean(deleteModalRole)}
        onClose={() => setDeleteModalRole(null)}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
