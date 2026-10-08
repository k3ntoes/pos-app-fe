import { rolesApi } from "@/api/roles";
import { useAuth } from "@/features/auth/AuthContext";
import { useDynamicPermissionGroups } from "@/features/roles/PermissionMatrix";
import { sanitizePermissions } from "@/lib/permissionMapper";
import type { PermissionType } from "@/types/permission";
import type { RoleListItem } from "@/types/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function useRolePermissionsManager(
  role: RoleListItem | null,
  _open: boolean,
  onOpenChange: (open: boolean) => void,
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { groups } = useDynamicPermissionGroups();

  const [searchQuery, setSearchQuery] = useState("");
  const [draftPermissions, setDraftPermissions] = useState<Set<PermissionType>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const totalPermissionsCount = useMemo(() => {
    return groups.reduce((acc, group) => acc + group.permissions.length, 0);
  }, [groups]);

  const initialPermissions = useMemo(() => {
    const sanitized = sanitizePermissions(role?.permissions || []);
    return new Set(sanitized as PermissionType[]);
  }, [role]);

  useEffect(() => {
    if (role) {
      const sanitized = sanitizePermissions(role.permissions || []);
      setDraftPermissions(new Set(sanitized as PermissionType[]));
      setSearchQuery("");
    }
  }, [role]);

  const isSystemRole = Boolean(role?.is_system);

  const activeCount = draftPermissions.size;
  const percentage = Math.min(
    100,
    Math.max(
      0,
      Math.round((activeCount / (totalPermissionsCount > 0 ? totalPermissionsCount : 16)) * 100),
    ),
  );

  const hasChanges = useMemo(() => {
    if (!role) return false;
    if (draftPermissions.size !== initialPermissions.size) return true;
    for (const p of draftPermissions) {
      if (!initialPermissions.has(p)) return true;
    }
    return false;
  }, [draftPermissions, initialPermissions, role]);

  const updatePermissionsMutation = useMutation({
    mutationFn: async (permissions: string[]) => {
      if (!role) return;
      const cleanPayload = sanitizePermissions(permissions);
      return await rolesApi.updateRolePermissions(role.id, cleanPayload);
    },
    onSuccess: () => {
      toast.success("Permission role berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      if (role) {
        queryClient.invalidateQueries({ queryKey: ["role", role.id] });
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal memperbarui permission role");
    },
  });

  const handleToggle = (permId: PermissionType) => {
    if (isSystemRole) return;
    setDraftPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  const handleSelectGroup = (groupPerms: { permission: string }[], select: boolean) => {
    if (isSystemRole) return;
    setDraftPermissions((prev) => {
      const next = new Set(prev);
      for (const p of groupPerms) {
        const typedPerm = p.permission as PermissionType;
        if (select) {
          next.add(typedPerm);
        } else {
          next.delete(typedPerm);
        }
      }
      return next;
    });
  };

  const handleSelectAllVisible = (select: boolean) => {
    if (isSystemRole) return;
    setDraftPermissions((prev) => {
      const next = new Set(prev);
      const query = searchQuery.toLowerCase().trim();

      for (const group of groups) {
        for (const perm of group.permissions) {
          const matches =
            !query ||
            group.description.toLowerCase().includes(query) ||
            perm.description.toLowerCase().includes(query) ||
            perm.permission.toLowerCase().includes(query);

          if (matches) {
            const typedPerm = perm.permission as PermissionType;
            if (select) {
              next.add(typedPerm);
            } else {
              next.delete(typedPerm);
            }
          }
        }
      }
      return next;
    });
  };

  const handleResetToInitial = () => {
    setDraftPermissions(new Set(initialPermissions));
  };

  const executeSave = () => {
    const payload = Array.from(draftPermissions);
    updatePermissionsMutation.mutate(payload);
  };

  const handlePreSave = () => {
    if (!role) return;
    const isEditingSelf = user?.role?.name === role.name;
    if (isEditingSelf) {
      setShowConfirmModal(true);
    } else {
      executeSave();
    }
  };

  return {
    groups,
    searchQuery,
    setSearchQuery,
    draftPermissions,
    showConfirmModal,
    setShowConfirmModal,
    isSystemRole,
    activeCount,
    percentage,
    hasChanges,
    isPending: updatePermissionsMutation.isPending,
    handleToggle,
    handleSelectGroup,
    handleSelectAllVisible,
    handleResetToInitial,
    handlePreSave,
    executeSave,
  };
}
