export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "STATUS_CHANGE"
  | "PASSWORD_RESET"
  | "ROLE_ASSIGNMENT"
  | string;

export interface AuditLogChanges {
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  username?: string | null;
  user_email?: string | null;
  action: AuditAction;
  resource_type: string;
  resource_id?: string | null;
  changes?: AuditLogChanges | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface AuditLogFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  action?: string;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}
