import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelfEditConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SelfEditConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: SelfEditConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-amber-800">Peringatan Sesi Aktif</DialogTitle>
          <DialogDescription className="text-gray-600 space-y-2 pt-2">
            <p>
              Anda sedang mengubah permission untuk{" "}
              <strong className="text-gray-900">role Anda sendiri</strong> yang sedang aktif
              digunakan dalam sesi saat ini.
            </p>
            <p>
              Menghapus hak akses tertentu dari role Anda dapat menyebabkan Anda kehilangan akses
              atau pembatasan navigasi secara instan setelah disimpan.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Tetap Lanjutkan & Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
