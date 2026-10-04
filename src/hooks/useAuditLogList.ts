import type { AuditLog, AuditLogFilterParams } from "@/types/audit";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditLogs } from "./useAuditLogs";

export function useAuditLogList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const action = searchParams.get("action") || "";
  const resource_type = searchParams.get("resource_type") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const filters: AuditLogFilterParams = React.useMemo(
    () => ({
      page,
      per_page,
      search,
      action,
      resource_type,
      start_date,
      end_date,
    }),
    [page, per_page, search, action, resource_type, start_date, end_date],
  );

  const { data, isLoading } = useAuditLogs(filters);
  const logs = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, page_size: 10, total_items: 0, total_pages: 1 };

  const [selectedLogForDiff, setSelectedLogForDiff] = React.useState<AuditLog | null>(null);

  const handleFilterChange = (newFilters: Partial<AuditLogFilterParams>) => {
    const nextParams = new URLSearchParams(searchParams);
    for (const [key, val] of Object.entries(newFilters)) {
      if (val !== undefined && val !== "") {
        nextParams.set(key, String(val));
      } else {
        nextParams.delete(key);
      }
    }
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
  };

  return {
    filters,
    logs,
    isLoading,
    meta,
    selectedLogForDiff,
    setSelectedLogForDiff,
    handleFilterChange,
    handleReset,
    handlePageChange,
  };
}
