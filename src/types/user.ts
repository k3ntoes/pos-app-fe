export type UserStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface UnitRoleAssignment {
  unit_id: string;
  role_id: string;
  unit_name?: string;
  role_name?: string;
}

export interface UserRoleAssignmentResponse {
  id: string;
  user_id: string;
  role_id: string;
  role_code: string;
  role_name: string;
  is_system: boolean;
  unit_id?: string | null;
  created_at: string;
}

export interface UserListItem {
  id: string;
  full_name: string;
  name?: string;
  username: string;
  email: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  unit_role_assignments: UnitRoleAssignment[];
}

export interface UserDetail extends UserListItem {
  must_change_password: boolean;
}

export type User = UserDetail;

export interface UpdateSelfProfilePayload {
  full_name?: string;
  email?: string;
}

export interface CreateUserPayload {
  username: string;
  full_name: string;
  name?: string;
  email?: string | null;
  unit_role_assignments?: UnitRoleAssignment[];
}

export interface UpdateUserPayload {
  full_name?: string;
  name?: string;
  email?: string | null;
  unit_role_assignments?: UnitRoleAssignment[];
}

export interface CreateUserResponse extends UserDetail {
  temporary_password: string;
}

export interface ResetPasswordResponse {
  user_id: string;
  temporary_password: string;
  must_change_password: boolean;
  message: string;
}

export interface UserFilterParams {
  page?: number;
  page_size?: number;
  per_page?: number;
  search?: string;
  status?: UserStatus | "";
  unit_id?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedUsersResponse {
  data: UserListItem[];
  meta: PaginationMeta;
}
