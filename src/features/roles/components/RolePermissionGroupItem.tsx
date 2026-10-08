import { Button } from "@/components/ui/button";
import type { BackendPermissionGroup, PermissionType } from "@/types/permission";

export type PermissionGroupItemData = BackendPermissionGroup;

interface RolePermissionGroupItemProps {
  group: PermissionGroupItemData;
  draftPermissions: Set<PermissionType>;
  searchQuery: string;
  isSystemRole: boolean;
  onToggle: (permId: PermissionType) => void;
  onSelectGroup: (groupPerms: { permission: string }[], select: boolean) => void;
}

export function RolePermissionGroupItem({
  group,
  draftPermissions,
  searchQuery,
  isSystemRole,
  onToggle,
  onSelectGroup,
}: RolePermissionGroupItemProps) {
  const groupPerms = group.permissions;
  const selectedCountInGroup = groupPerms.filter((p) => draftPermissions.has(p.permission)).length;
  const allGroupSelected = groupPerms.every((p) => draftPermissions.has(p.permission));

  const filteredPerms = groupPerms.filter((perm) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      group.description.toLowerCase().includes(query) ||
      perm.description.toLowerCase().includes(query) ||
      perm.permission.toLowerCase().includes(query)
    );
  });

  if (filteredPerms.length === 0) return null;

  return (
    <div
      key={group.description}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{group.description}</h3>
          <p className="text-xs text-gray-500">
            {selectedCountInGroup} dari {groupPerms.length} aktif
          </p>
        </div>
        {!isSystemRole && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectGroup(groupPerms, !allGroupSelected)}
              className="text-xs h-7 px-2"
            >
              {allGroupSelected ? "Batalkan Semua" : "Pilih Semua"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredPerms.map((perm) => {
          const isChecked = draftPermissions.has(perm.permission);
          return (
            <label
              key={perm.permission}
              className={`flex items-start space-x-3 p-2.5 rounded-md border transition-colors ${
                isSystemRole ? "cursor-default opacity-80" : "cursor-pointer hover:bg-gray-50"
              } ${isChecked ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(perm.permission)}
                disabled={isSystemRole}
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
}
