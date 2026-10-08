import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserList } from "@/hooks/useUserList";
import type { UserStatus } from "@/types/user";
import { Link } from "react-router-dom";
import { ManageUserRolesModal } from "./ManageUserRolesModal";
import { UserStatusModal } from "./UserStatusModal";

export function UserListPage() {
  const {
    page,
    search,
    statusFilter,
    unitFilter,
    sortBy,
    sortDir,
    statusModalUser,
    manageRolesUser,
    units,
    usersData,
    isLoading,
    handleSort,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleStatusChange,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleOpenManageRolesModal,
    handleCloseManageRolesModal,
  } = useUserList();

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 border-green-200">ACTIVE</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">SUSPENDED</Badge>;
      case "DEACTIVATED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">DEACTIVATED</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Users</h1>
          <p className="text-sm text-gray-500">
            Kelola pengguna sistem POS beserta penugasan unit dan role.
          </p>
        </div>
        <Link
          to="/users/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 bg-blue-600 text-white hover:bg-blue-700 shadow h-11 px-4 py-2"
        >
          + Tambah User
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1">
          <Input
            placeholder="Cari nama, username, atau email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-40"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="DEACTIVATED">DEACTIVATED</option>
          </Select>
          <Select
            value={unitFilter}
            onChange={(e) => handleFilterChange("unit", e.target.value)}
            className="w-45"
          >
            <option value="">Semua Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("name")}
              >
                Nama / Username {sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Penugasan Unit & Role</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("status")}
              >
                Status {sortBy === "status" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("created_at")}
              >
                Dibuat {sortBy === "created_at" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Memuat data user...
                </TableCell>
              </TableRow>
            ) : !usersData?.data || usersData.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              usersData.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.unit_role_assignments?.map((assignment) => (
                        <div
                          key={`${assignment.unit_id}-${assignment.role_id}`}
                          className="text-xs flex items-center gap-1.5"
                        >
                          <span className="font-medium text-gray-700">
                            {assignment.unit_name || assignment.unit_id}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                            {assignment.role_name || assignment.role_id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <span className="font-bold">•••</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link to={`/users/${user.id}`} />}>
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link to={`/users/${user.id}/edit`} />}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenManageRolesModal(user)}>
                          Kelola Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenStatusModal(user)}>
                          Ubah Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {usersData?.meta && usersData.meta.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Menampilkan halaman {usersData.meta.current_page} dari {usersData.meta.last_page}{" "}
              (Total {usersData.meta.total} user)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= usersData.meta.last_page}
                onClick={() => handlePageChange(page + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {statusModalUser && (
        <UserStatusModal
          user={statusModalUser}
          isOpen={Boolean(statusModalUser)}
          onClose={handleCloseStatusModal}
          onConfirm={(status) => handleStatusChange(statusModalUser.id, status)}
        />
      )}

      {manageRolesUser && (
        <ManageUserRolesModal
          open={Boolean(manageRolesUser)}
          userId={manageRolesUser.id}
          userName={manageRolesUser.name || manageRolesUser.full_name}
          onClose={handleCloseManageRolesModal}
        />
      )}
    </div>
  );
}
