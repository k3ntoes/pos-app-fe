import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RolePermissionToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSystemRole: boolean;
  onSelectAllVisible: (select: boolean) => void;
  onResetToInitial: () => void;
  hasChanges: boolean;
}

export function RolePermissionToolbar({
  searchQuery,
  onSearchChange,
  isSystemRole,
  onSelectAllVisible,
  onResetToInitial,
  hasChanges,
}: RolePermissionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Cari izin atau domain..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white"
        />
      </div>

      {!isSystemRole && (
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelectAllVisible(true)}
            className="text-xs"
          >
            Pilih Semua (Hasil Filter)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelectAllVisible(false)}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Kosongkan (Hasil Filter)
          </Button>
          {hasChanges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetToInitial}
              className="text-xs text-amber-700 hover:bg-amber-50"
            >
              Reset Perubahan
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
