import { rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import type { RoleListItem } from "@/types/role";
import type { Unit } from "@/types/unit";
import type { UserRoleAssignmentResponse } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UseManageUserRolesProps {
  userId?: string;
}

export function useManageUserRoles({ userId }: UseManageUserRolesProps) {
  const queryClient = useQueryClient();

  const userRolesQuery = useQuery<UserRoleAssignmentResponse[]>({
    queryKey: ["user-roles", userId],
    queryFn: () => (userId ? usersApi.getUserRoles(userId) : Promise.resolve([])),
    enabled: Boolean(userId),
  });

  const unitsQuery = useQuery<{ units: Unit[]; total: number }>({
    queryKey: ["units-list"],
    queryFn: () => unitsApi.getUnits({ is_active: true }),
  });

  const rolesQuery = useQuery<RoleListItem[]>({
    queryKey: ["roles-list"],
    queryFn: () => rolesApi.getRoles(),
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({
      unitId,
      roleId,
    }: {
      unitId: string | null;
      roleId: string;
    }) => {
      if (!userId) throw new Error("User ID tidak valid");
      return usersApi.assignUserRole(userId, unitId, roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role berhasil ditugaskan");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Gagal menugaskan role");
    },
  });

  const revokeRoleMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      if (!userId) throw new Error("User ID tidak valid");
      return usersApi.removeUserRole(userId, assignmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role berhasil dicabut");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Gagal mencabut role");
    },
  });

  return {
    activeRoles: userRolesQuery.data || [],
    isLoadingActiveRoles: userRolesQuery.isLoading,
    units: unitsQuery.data?.units || [],
    isLoadingUnits: unitsQuery.isLoading,
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    assignRole: assignRoleMutation.mutateAsync,
    isAssigning: assignRoleMutation.isPending,
    revokeRole: revokeRoleMutation.mutateAsync,
    isRevoking: revokeRoleMutation.isPending,
    refetchActiveRoles: userRolesQuery.refetch,
  };
}
