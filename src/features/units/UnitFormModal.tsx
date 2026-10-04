import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUnitForm } from "@/hooks/useUnitForm";
import type { CreateUnitInput, UpdateUnitInput } from "@/schemas/unit";
import type { Unit } from "@/types/unit";

interface UnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUnitInput | UpdateUnitInput) => void;
  unit?: Unit | null;
  isLoading?: boolean;
}

export function UnitFormModal({ isOpen, onClose, onSubmit, unit, isLoading }: UnitFormModalProps) {
  const { form, isEditing, codeError, handleSubmit } = useUnitForm({ unit, onSubmit });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Unit / Cabang" : "Tambah Unit / Cabang Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah informasi detail unit atau cabang."
              : "Masukkan detail informasi untuk unit atau cabang baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <div className="space-y-1">
              <Label htmlFor="code">Kode Unit</Label>
              <Input
                id="code"
                placeholder="mis. JKT-01"
                className="font-mono uppercase"
                {...register("code" as never)}
              />
              {codeError?.message && <p className="text-xs text-red-500">{codeError.message}</p>}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Nama Cabang / Unit</Label>
            <Input id="name" placeholder="mis. Cabang Jakarta Pusat" {...register("name")} />
            {errors.name?.message && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Alamat (Opsional)</Label>
            <textarea
              id="address"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Jl. Sudirman No. 123, Jakarta"
              {...register("address")}
            />
            {errors.address?.message && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("is_active")}
            />
            <Label htmlFor="is_active" className="text-sm font-medium leading-none cursor-pointer">
              Status Aktif
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
