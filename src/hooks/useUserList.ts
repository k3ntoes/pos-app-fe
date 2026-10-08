import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import type { UserListItem, UserStatus } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export function useUserList() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<UserStatus | "">("");
  const [unitFilter, setUnitFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const [statusModalUser, setStatusModalUser] = React.useState<UserListItem | null>(null);
  const [manageRolesUser, setManageRolesUser] = React.useState<UserListItem | null>(null);

  const handleOpenManageRolesModal = (user: UserListItem) => {
    setManageRolesUser(user);
  };

  const handleCloseManageRolesModal = () => {
    setManageRolesUser(null);
  };

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

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (type: "status" | "unit", val: string) => {
    if (type === "status") {
      setStatusFilter(val as UserStatus | "");
    } else {
      setUnitFilter(val);
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (id: string, status: UserStatus) => {
    statusMutation.mutate({ id, status });
  };

  const handleOpenStatusModal = (user: UserListItem) => {
    setStatusModalUser(user);
  };

  const handleCloseStatusModal = () => {
    setStatusModalUser(null);
  };

  return {
    page,
    perPage,
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
    isStatusUpdating: statusMutation.isPending,
    handleSort,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleStatusChange,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleOpenManageRolesModal,
    handleCloseManageRolesModal,
  };
}
