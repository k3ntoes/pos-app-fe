import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResetPasswordDialogProps {
  open: boolean;
  userName?: string;
  isResetting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ResetPasswordDialog({
  open,
  userName,
  isResetting,
  onConfirm,
  onClose,
}: ResetPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Reset Password</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin mereset password untuk user{" "}
            <span className="font-semibold text-gray-900">{userName}</span>? Password baru akan
            dibuatkan secara acak oleh sistem.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isResetting}>
            Batal
          </Button>
          <Button onClick={onConfirm} disabled={isResetting}>
            {isResetting ? "Mereset..." : "Ya, Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
