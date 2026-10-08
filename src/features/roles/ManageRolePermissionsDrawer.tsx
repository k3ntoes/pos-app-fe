import { rolesApi } from "@/api/roles";
import { useAuth } from "@/features/auth/AuthContext";
import { useDynamicPermissionGroups } from "@/features/roles/PermissionMatrix";
import { RolePermissionFooter } from "@/features/roles/components/RolePermissionFooter";
import { RolePermissionGroupItem } from "@/features/roles/components/RolePermissionGroupItem";
import { RolePermissionHeader } from "@/features/roles/components/RolePermissionHeader";
import { RolePermissionToolbar } from "@/features/roles/components/RolePermissionToolbar";
import { SelfEditConfirmationDialog } from "@/features/roles/components/SelfEditConfirmationDialog";
import { sanitizePermissions } from "@/lib/permissionMapper";
import type { PermissionType } from "@/types/permission";
import type { RoleListItem } from "@/types/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ManageRolePermissionsDrawerProps {
  role: RoleListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_PERMISSIONS_COUNT = 16;

export function ManageRolePermissionsDrawer({
  role,
  open,
  onOpenChange,
}: ManageRolePermissionsDrawerProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { groups } = useDynamicPermissionGroups();

  const [searchQuery, setSearchQuery] = useState("");
  const [draftPermissions, setDraftPermissions] = useState<Set<PermissionType>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    Math.max(0, Math.round((activeCount / TOTAL_PERMISSIONS_COUNT) * 100)),
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
        if (select) {
          next.add(p.permission);
        } else {
          next.delete(p.permission);
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
            if (select) {
              next.add(perm.permission);
            } else {
              next.delete(perm.permission);
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

  if (!open || !role) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden animate-in slide-in-from-right duration-300">
        <RolePermissionHeader
          role={role}
          isSystemRole={isSystemRole}
          activeCount={activeCount}
          percentage={percentage}
        />

        <div className="py-3">
          <RolePermissionToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSystemRole={isSystemRole}
            onSelectAllVisible={handleSelectAllVisible}
            onResetToInitial={handleResetToInitial}
            hasChanges={hasChanges}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 my-2">
          {groups.map((group) => (
            <RolePermissionGroupItem
              key={group.description}
              group={group}
              draftPermissions={draftPermissions}
              searchQuery={searchQuery}
              isSystemRole={isSystemRole}
              onToggle={handleToggle}
              onSelectGroup={handleSelectGroup}
            />
          ))}
        </div>

        <RolePermissionFooter
          onCancel={() => onOpenChange(false)}
          onReset={handleResetToInitial}
          onSave={handlePreSave}
          hasChanges={hasChanges}
          isSystemRole={isSystemRole}
          isPending={updatePermissionsMutation.isPending}
        />

        <SelfEditConfirmationDialog
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={executeSave}
        />
      </div>
    </div>
  );
}
