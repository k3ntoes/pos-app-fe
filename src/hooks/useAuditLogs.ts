import { auditApi } from "@/api/audit";
import type { AuditLogFilterParams } from "@/types/audit";
import { useQuery } from "@tanstack/react-query";

export function useAuditLogs(params: AuditLogFilterParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditApi.getLogs(params),
    placeholderData: (prev) => prev,
  });
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: ["audit-log", id],
    queryFn: () => auditApi.getLogById(id as string),
    enabled: Boolean(id),
  });
}
