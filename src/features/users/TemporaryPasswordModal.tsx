import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/lib/clipboard";
import * as React from "react";
import { toast } from "sonner";

interface TemporaryPasswordModalProps {
  open: boolean;
  temporaryPassword: string;
  userName: string;
  isReset?: boolean;
  onClose: () => void;
}

export function TemporaryPasswordModal({
  open,
  temporaryPassword,
  userName,
  isReset = false,
  onClose,
}: TemporaryPasswordModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [acknowledged, setAcknowledged] = React.useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(temporaryPassword);
    if (success) {
      setCopied(true);
      toast.success("Password sementara berhasil disalin ke clipboard");
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error("Gagal menyalin password");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Password Sementara {isReset ? "Reset User" : "User Baru"}</DialogTitle>
          <DialogDescription>
            {isReset ? "Password untuk " : "Akun untuk "}
            <span className="font-semibold text-gray-900">{userName}</span>{" "}
            {isReset ? "berhasil di-reset." : "berhasil dibuat."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <p className="text-sm font-medium text-amber-800">Peringatan Keamanan Penting:</p>
            <p className="mt-1 text-xs text-amber-700">
              Password sementara ini hanya ditampilkan sekali. Pastikan Anda menyalin dan
              menyampaikannya secara aman kepada user yang bersangkutan. User wajib mengubah
              password saat login pertama kali.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={temporaryPassword}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono tracking-wide text-gray-900 select-all"
            />
            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              className="shrink-0 min-h-11"
            >
              {copied ? "Disalin!" : "Salin Password"}
            </Button>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="ack"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="ack" className="text-sm text-gray-700 select-none">
              Saya sudah menyalin password sementara ini dengan aman.
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={!acknowledged}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Tutup & Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
