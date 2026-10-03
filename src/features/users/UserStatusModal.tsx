import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import type { UserStatus } from "@/types/user";
import * as React from "react";

interface UserStatusModalProps {
  open: boolean;
  userName: string;
  currentStatus: UserStatus;
  onClose: () => void;
  onConfirm: (newStatus: UserStatus) => void;
  isLoading?: boolean;
}

export function UserStatusModal({
  open,
  userName,
  currentStatus,
  onClose,
  onConfirm,
  isLoading,
}: UserStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<UserStatus>(currentStatus);

  React.useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Status User</DialogTitle>
          <DialogDescription>
            Ubah status akun untuk <span className="font-semibold text-gray-900">{userName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
              Status Baru
            </label>
            <Select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
            >
              <option value="ACTIVE">ACTIVE - Aktif & dapat login</option>
              <option value="SUSPENDED">SUSPENDED - Ditangguhkan sementara</option>
              <option value="DEACTIVATED">DEACTIVATED - Dinonaktifkan permanen</option>
            </Select>
          </div>
        </div>
        <DialogFooter className="space-x-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(selectedStatus)}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
