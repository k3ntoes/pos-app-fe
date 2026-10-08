import { RolePermissionFooter } from "@/features/roles/components/RolePermissionFooter";
import { RolePermissionGroupItem } from "@/features/roles/components/RolePermissionGroupItem";
import { RolePermissionHeader } from "@/features/roles/components/RolePermissionHeader";
import { RolePermissionToolbar } from "@/features/roles/components/RolePermissionToolbar";
import { SelfEditConfirmationDialog } from "@/features/roles/components/SelfEditConfirmationDialog";
import { useRolePermissionsManager } from "@/features/roles/hooks/useRolePermissionsManager";
import type { RoleListItem } from "@/types/role";

interface ManageRolePermissionsDrawerProps {
  role: RoleListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageRolePermissionsDrawer({
  role,
  open,
  onOpenChange,
}: ManageRolePermissionsDrawerProps) {
  const {
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
    isPending,
    handleToggle,
    handleSelectGroup,
    handleSelectAllVisible,
    handleResetToInitial,
    handlePreSave,
    executeSave,
  } = useRolePermissionsManager(role, open, onOpenChange);

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
          isPending={isPending}
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
