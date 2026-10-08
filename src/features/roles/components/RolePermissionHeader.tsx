import { Badge } from "@/components/ui/badge";
import type { RoleListItem } from "@/types/role";

interface RolePermissionHeaderProps {
  role: RoleListItem | null;
  isSystemRole: boolean;
  activeCount: number;
  percentage: number;
}

export function RolePermissionHeader({
  role,
  isSystemRole,
  activeCount,
  percentage,
}: RolePermissionHeaderProps) {
  if (!role) return null;

  return (
    <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold text-gray-900">Manage Permissions: {role.name}</h2>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isSystemRole ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"
          }`}
        >
          {isSystemRole ? "System Role (Read-only)" : "Custom Role"}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        {role.description || "Atur hak akses granular per domain untuk role ini."}
      </p>

      {/* Progress pill */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">Total Aktif:</span>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {activeCount} Permissions
          </Badge>
        </div>
        <div className="flex items-center space-x-3 w-1/2 max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 w-9 text-right">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
