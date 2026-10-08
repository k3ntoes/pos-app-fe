import { usePermissions } from "@/features/roles/usePermissions";
import { useAuditLogList } from "@/hooks/useAuditLogList";
import { Activity, ShieldAlert } from "lucide-react";
import { AuditDiffViewerModal } from "./AuditDiffViewerModal";
import { AuditFilterBar } from "./AuditFilterBar";
import { AuditTable } from "./AuditTable";

export function AuditLogListPage() {
  const { hasPermission } = usePermissions();
  const canReadAudit = hasPermission("audit:read");

  const {
    filters,
    logs,
    isLoading,
    meta,
    selectedLogForDiff,
    setSelectedLogForDiff,
    handleFilterChange,
    handleReset,
    handlePageChange,
  } = useAuditLogList();

  if (!canReadAudit) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-4 text-red-800">
          <ShieldAlert className="w-10 h-10 shrink-0 text-red-600" />
          <div>
            <h2 className="text-lg font-bold">Akses Ditolak</h2>
            <p className="text-sm">
              Anda tidak memiliki izin (`audit:read`) untuk mengakses Audit Trail.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-indigo-600" />
            Audit Trail & Aktivitas Sistem
          </h1>
          <p className="text-sm text-gray-500">
            Pantau seluruh aktivitas penting, perubahan data, dan riwayat keamanan sistem POS.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <AuditFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

      {/* Table */}
      <AuditTable
        logs={logs}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.total_pages}
        onPageChange={handlePageChange}
        onViewDetail={(log) => setSelectedLogForDiff(log)}
      />

      {/* Diff Viewer Modal */}
      <AuditDiffViewerModal
        log={selectedLogForDiff}
        isOpen={Boolean(selectedLogForDiff)}
        onClose={() => setSelectedLogForDiff(null)}
      />
    </div>
  );
}
