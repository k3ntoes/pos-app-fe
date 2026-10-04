import { rolesApi } from "@/api/roles";
import type { RoleListItem } from "@/types/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export function useRoleList() {
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

  const handleSearch = (value: string) => setSearch(value);
  const handleDelete = (id: string) => deleteMutation.mutate(id);
  const handleOpenDeleteModal = (role: RoleListItem) => setDeleteModalRole(role);
  const handleCloseDeleteModal = () => setDeleteModalRole(null);

  return {
    search,
    deleteModalRole,
    rolesData,
    isLoading,
    filteredRoles,
    deleteMutation,
    handleSearch,
    handleDelete,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  };
}
