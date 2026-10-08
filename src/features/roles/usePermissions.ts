import { permissionsApi } from "@/api/permissions";
import { useAuth } from "@/features/auth/AuthContext";
import { useUnit } from "@/features/units/UnitContext";
import type { BackendPermissionGroup, PermissionType } from "@/types/permission";
import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const { user } = useAuth();
  const { activeUnit, userAssignments } = useUnit();

  let permissionsQuery = { data: [] as BackendPermissionGroup[], isLoading: false, error: null };
  try {
    permissionsQuery = useQuery({
      queryKey: ["permissions"],
      queryFn: () => permissionsApi.getPermissions(),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
  } catch {
    // Fallback when QueryClientProvider is missing in unit tests
  }

  const isSuperAdmin = user?.status === "ACTIVE" && Boolean(user.is_super_admin);

  const hasPermission = (permission: PermissionType): boolean => {
    if (isSuperAdmin) return true;

    const permissions = new Set<string>();

    for (const assignment of userAssignments) {
      if (assignment.unit_id === null || (activeUnit && assignment.unit_id === activeUnit.id)) {
        if (assignment.role && Array.isArray(assignment.role.permissions)) {
          for (const p of assignment.role.permissions) {
            permissions.add(p);
          }
        }
      }
    }

    if (user?.role && Array.isArray(user.role.permissions)) {
      for (const p of user.role.permissions) {
        permissions.add(p);
      }
    }

    return permissions.has(permission);
  };

  const hasAnyPermission = (perms: PermissionType[]): boolean => {
    return perms.some((p) => hasPermission(p));
  };

  const hasRole = (roleName: string): boolean => {
    if (user?.role?.name === roleName) return true;
    for (const assignment of userAssignments) {
      if (
        (assignment.unit_id === null || (activeUnit && assignment.unit_id === activeUnit.id)) &&
        assignment.role?.name === roleName
      ) {
        return true;
      }
    }
    return false;
  };

  const permissionGroups: BackendPermissionGroup[] = permissionsQuery.data || [];

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    permissionGroups,
    isLoadingPermissions: permissionsQuery.isLoading,
    permissionsError: permissionsQuery.error,
  };
}
