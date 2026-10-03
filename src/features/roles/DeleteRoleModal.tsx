import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RoleListItem } from "@/types/role";

interface DeleteRoleModalProps {
  role: RoleListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isDeleting?: boolean;
}

export function DeleteRoleModal({
  role,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteRoleModalProps) {
  if (!role) return null;

  const hasUsers = (role?.assigned_users_count ?? 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Role: {role?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm text-gray-700">
          {hasUsers ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              <span className="font-semibold">Peringatan:</span> Role ini masih digunakan oleh{" "}
              <span className="font-bold">{role?.assigned_users_count ?? 0} user</span>. Role tidak
              dapat dihapus sebelum seluruh user dipindahkan atau dicabut penugasannya.
            </div>
          ) : (
            <p>
              Apakah Anda yakin ingin menghapus role{" "}
              <span className="font-semibold">{role?.name}</span> secara permanen? Tindakan ini
              tidak dapat dibatalkan.
            </p>
          )}
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => role?.id && onConfirm(role.id)}
            disabled={hasUsers || isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
