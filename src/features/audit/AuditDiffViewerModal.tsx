import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AuditLog } from "@/types/audit";
import type React from "react";

interface AuditDiffViewerModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDiffViewerModal: React.FC<AuditDiffViewerModalProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!log) return null;

  const oldValues = log.changes?.old_values || log.changes?.before || null;
  const newValues = log.changes?.new_values || log.changes?.after || log.changes || null;

  const renderJson = (data: unknown) => {
    if (!data) return <span className="text-gray-400 italic">Tidak ada data</span>;
    if (typeof data === "object") {
      return (
        <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto font-mono text-gray-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }
    return <span className="text-sm text-gray-800">{String(data)}</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className="max-w-3xl w-full">
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Perubahan Audit Log</DialogTitle>
            <DialogDescription>
              Action: <span className="font-semibold text-gray-900">{log.action}</span> pada
              resource <span className="font-semibold text-gray-900">{log.resource_type}</span> (
              {log.resource_id || "-"})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Nilai Lama (Old Values)</h4>
                {renderJson(oldValues)}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Nilai Baru (New Values)</h4>
                {renderJson(newValues)}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-1">
              <div>
                <span className="font-medium text-gray-700">User:</span>{" "}
                {log.username || log.user_email || log.user_id || "System"}
              </div>
              <div>
                <span className="font-medium text-gray-700">IP Address:</span>{" "}
                {log.ip_address || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-700">User Agent:</span>{" "}
                {log.user_agent || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Waktu:</span>{" "}
                {new Date(log.created_at).toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};
