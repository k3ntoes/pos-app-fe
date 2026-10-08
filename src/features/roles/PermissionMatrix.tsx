import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/roles/usePermissions";
import type { BackendPermissionGroup, PermissionType } from "@/types/permission";
import { useMemo } from "react";

export function useDynamicPermissionGroups(): {
  groups: BackendPermissionGroup[];
  isLoading: boolean;
  error: unknown;
} {
  let groups: BackendPermissionGroup[] = [];
  let isLoading = false;
  let error: unknown = null;
  try {
    const p = usePermissions();
    groups = p.permissionGroups;
    isLoading = p.isLoadingPermissions;
    error = p.permissionsError;
  } catch {
    groups = [];
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: groups from hook
  const memoizedGroups = useMemo(() => groups, [JSON.stringify(groups)]);

  return {
    groups: memoizedGroups,
    isLoading,
    error,
  };
}

interface PermissionMatrixProps {
  selectedPermissions: PermissionType[];
  onChange: (permissions: PermissionType[]) => void;
  readOnly?: boolean;
  permissionGroups?: BackendPermissionGroup[];
}

export function PermissionMatrix({
  selectedPermissions,
  onChange,
  readOnly = false,
  permissionGroups: propPermissionGroups,
}: PermissionMatrixProps) {
  const dynamic = useDynamicPermissionGroups();
  const groups = propPermissionGroups ?? dynamic.groups;
  const isLoading = propPermissionGroups ? false : dynamic.isLoading;
  const error = propPermissionGroups ? null : dynamic.error;

  const handleToggle = (permissionId: PermissionType) => {
    if (readOnly) return;
    if (selectedPermissions.includes(permissionId)) {
      onChange(selectedPermissions.filter((p) => p !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  const handleSelectAllGroup = (groupPerms: { permission: string }[]) => {
    if (readOnly) return;
    const permIds = groupPerms.map((p) => p.permission);
    const combined = Array.from(new Set([...selectedPermissions, ...permIds]));
    onChange(combined);
  };

  const handleDeselectAllGroup = (groupPerms: { permission: string }[]) => {
    if (readOnly) return;
    const permIds = new Set(groupPerms.map((p) => p.permission));
    onChange(selectedPermissions.filter((p) => !permIds.has(p)));
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500 animate-pulse text-sm">
        Memuat data permissions dari server...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500 text-sm">
        Gagal memuat daftar permissions dari server.
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        Tidak ada data permissions yang tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupPerms = group.permissions || [];
        const selectedCount = groupPerms.filter((p) =>
          selectedPermissions.includes(p.permission),
        ).length;
        const allSelected =
          groupPerms.length > 0 &&
          groupPerms.every((p) => selectedPermissions.includes(p.permission));

        return (
          <div
            key={group.description}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{group.description}</h3>
                <p className="text-xs text-gray-500">
                  {selectedCount} dari {groupPerms.length} aktif
                </p>
              </div>
              {!readOnly && groupPerms.length > 0 && (
                <div className="flex items-center space-x-2">
                  {allSelected ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeselectAllGroup(groupPerms)}
                      className="text-xs h-7 px-2"
                    >
                      Batalkan Semua
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllGroup(groupPerms)}
                      className="text-xs h-7 px-2"
                    >
                      Pilih Semua
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupPerms.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.permission);
                return (
                  <label
                    key={perm.permission}
                    className={`flex items-start space-x-3 p-2.5 rounded-md border transition-colors ${
                      readOnly ? "cursor-default opacity-80" : "cursor-pointer hover:bg-gray-50"
                    } ${isChecked ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(perm.permission)}
                      disabled={readOnly}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900">{perm.description}</p>
                      <p className="text-[10px] font-mono text-gray-500">{perm.permission}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
