import { Button } from "@/components/ui/button";

interface RolePermissionFooterProps {
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
  isSystemRole: boolean;
  isPending: boolean;
}

export function RolePermissionFooter({
  onCancel,
  onReset,
  onSave,
  hasChanges,
  isSystemRole,
  isPending,
}: RolePermissionFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Tutup
        </Button>
        {hasChanges && !isSystemRole && (
          <Button type="button" variant="ghost" onClick={onReset} className="text-gray-600">
            Reset
          </Button>
        )}
      </div>

      {!isSystemRole ? (
        <Button type="button" onClick={onSave} disabled={!hasChanges || isPending}>
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      ) : (
        <span className="text-xs text-amber-700 font-medium">
          System Role tidak dapat dimodifikasi.
        </span>
      )}
    </div>
  );
}
