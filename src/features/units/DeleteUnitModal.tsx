import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Unit } from "@/types/unit";

interface DeleteUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unit?: Unit | null;
  isLoading?: boolean;
}

export function DeleteUnitModal({
  isOpen,
  onClose,
  onConfirm,
  unit,
  isLoading,
}: DeleteUnitModalProps) {
  if (!unit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hapus Unit / Cabang</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus unit{" "}
            <strong className="text-gray-900">{unit?.name}</strong> (
            <span className="font-mono">{unit?.code}</span>)? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
