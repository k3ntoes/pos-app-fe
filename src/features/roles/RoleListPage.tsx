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
import { useRoleList } from "@/hooks/useRoleList";
import { Link } from "react-router-dom";
import { DeleteRoleModal } from "./DeleteRoleModal";

export function RoleListPage() {
  const {
    search,
    deleteModalRole,
    isLoading,
    filteredRoles,
    deleteMutation,
    handleSearch,
    handleDelete,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  } = useRoleList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Roles</h1>
          <p className="text-sm text-gray-500">
            Kelola role dan hak akses (permissions) granular untuk pengguna sistem POS.
          </p>
        </div>
        <Link
          to="/roles/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 bg-blue-600 text-white hover:bg-blue-700 shadow h-11 px-4 py-2"
        >
          + Tambah Role
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Input
          placeholder="Cari berdasarkan nama atau deskripsi role..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
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
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="sm">
                            Aksi
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link to={`/roles/${role.id}`} />}>
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link to={`/roles/${role.id}/edit`} />}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenDeleteModal(role)}
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
        onClose={handleCloseDeleteModal}
        onConfirm={(id) => handleDelete(id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
