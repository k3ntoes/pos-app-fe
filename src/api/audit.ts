import type { AuditLog, AuditLogFilterParams, AuditLogListResponse } from "@/types/audit";
import { apiClient } from "./client";

export const auditApi = {
  getLogs: async (params?: AuditLogFilterParams): Promise<AuditLogListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.action) searchParams.set("action", params.action);
    if (params?.resource_type) searchParams.set("resource_type", params.resource_type);
    if (params?.start_date) searchParams.set("start_date", params.start_date);
    if (params?.end_date) searchParams.set("end_date", params.end_date);
    if (params?.user_id) searchParams.set("user_id", params.user_id);

    const query = searchParams.toString();
    const url = `/api/v1/audit-logs${query ? `?${query}` : ""}`;
    const res = await apiClient.get<
      AuditLogListResponse | { data: AuditLog[]; meta: AuditLogListResponse["meta"] } | AuditLog[]
    >(url);

    if (res && typeof res === "object" && "data" in res && "meta" in res) {
      return res as AuditLogListResponse;
    }
    const list = Array.isArray(res)
      ? res
      : ((res as Record<string, unknown>)?.data as AuditLog[]) || [];
    const page = params?.page || 1;
    const pageSize = params?.per_page || 10;
    return {
      data: list,
      meta: {
        page,
        page_size: pageSize,
        total_items: list.length,
        total_pages: Math.ceil(list.length / pageSize) || 1,
      },
    };
  },

  getLogById: async (id: string): Promise<AuditLog> => {
    const res = await apiClient.get<{ data: AuditLog } | AuditLog>(`/api/v1/audit-logs/${id}`);
    return ("data" in res && res.data ? res.data : res) as AuditLog;
  },
};
