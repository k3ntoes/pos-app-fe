import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
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
import type { UserListItem, UserStatus } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserStatusModal } from "./UserStatusModal";

export function UserListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<UserStatus | "">("");
  const [unitFilter, setUnitFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const [statusModalUser, setStatusModalUser] = React.useState<UserListItem | null>(null);

  const { data: unitsResponse } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsApi.getUnits(),
  });
  const units = unitsResponse?.units ?? [];

  const { data: usersData, isLoading } = useQuery({
    queryKey: [
      "users",
      {
        page,
        per_page: perPage,
        search,
        status: statusFilter,
        unit_id: unitFilter,
        sort_by: sortBy,
        sort_dir: sortDir,
      },
    ],
    queryFn: () =>
      usersApi.getUsers({
        page,
        per_page: perPage,
        search,
        status: statusFilter,
        unit_id: unitFilter,
        sort_by: sortBy,
        sort_dir: sortDir,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Status user berhasil diperbarui");
      setStatusModalUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal memperbarui status user");
    },
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

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
        <Button asChild className="min-h-[44px]">
          <Link to="/users/new">+ Tambah User</Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1">
          <Input
            placeholder="Cari nama, username, atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as UserStatus | "");
              setPage(1);
            }}
            className="w-[160px]"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="DEACTIVATED">DEACTIVATED</option>
          </Select>
          <Select
            value={unitFilter}
            onChange={(e) => {
              setUnitFilter(e.target.value);
              setPage(1);
            }}
            className="w-[180px]"
          >
            <option value="">Semua Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
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
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Nama / Username {sortBy === "name" && (sortDir === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penugasan Unit</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                Dibuat {sortBy === "created_at" && (sortDir === "asc" ? "▲" : "▼")}
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
              usersData?.data?.map((user: UserListItem) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.unit_role_assignments?.map((assignment) => (
                        <span
                          key={`${assignment.unit_id}-${assignment.role_id}`}
                          className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                        >
                          {assignment.unit_name || assignment.unit_id} (
                          {assignment.role_name || assignment.role_id})
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-100 text-gray-600">
                        ⋮
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right">
                        <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusModalUser(user)}>
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
        {usersData?.meta && usersData.meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500 tabular-nums">
              Menampilkan halaman {usersData.meta.page} dari {usersData.meta.total_pages} (Total:{" "}
              {usersData.meta.total_items} user)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="min-h-[36px]"
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= usersData.meta.total_pages}
                onClick={() => setPage(page + 1)}
                className="min-h-[36px]"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {statusModalUser && (
        <UserStatusModal
          open={!!statusModalUser}
          userName={statusModalUser.name}
          currentStatus={statusModalUser.status}
          onClose={() => setStatusModalUser(null)}
          onConfirm={(newStatus) =>
            statusMutation.mutate({ id: statusModalUser.id, status: newStatus })
          }
          isLoading={statusMutation.isPending}
        />
      )}
    </div>
  );
}
