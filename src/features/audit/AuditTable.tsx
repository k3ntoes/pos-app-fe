import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AuditLog } from "@/types/audit";
import { Eye } from "lucide-react";
import type React from "react";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (log: AuditLog) => void;
}

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-green-100 text-green-800 border-green-200";
    case "UPDATE":
    case "STATUS_CHANGE":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "DELETE":
      return "bg-red-100 text-red-800 border-red-200";
    case "LOGIN":
    case "LOGOUT":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
        Memuat data audit log...
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
        Tidak ada audit log ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-sm text-gray-600">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-900">
                  {log.username || log.user_email || log.user_id || "System"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionBadgeVariant(
                      log.action,
                    )}`}
                  >
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{log.resource_type}</span>
                  {log.resource_id && (
                    <span
                      className="text-xs text-gray-500 block truncate max-w-37.5"
                      title={log.resource_id}
                    >
                      ID: {log.resource_id}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500 font-mono">
                  {log.ip_address || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(log)}
                    className="h-8 px-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                    title="Lihat Perubahan"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          Halaman <span className="font-medium text-gray-700">{page}</span> dari{" "}
          <span className="font-medium text-gray-700">{Math.max(1, totalPages)}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};
