export type Permission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "roles.view"
  | "roles.create"
  | "roles.edit"
  | "roles.delete"
  | "inventory.view"
  | "inventory.manage"
  | "sales.pos"
  | "sales.refund"
  | "reports.view"
  | "settings.store"
  | "units.switch"
  | "audit.view";

export interface Role {
  id: string;
  name: string;
  code?: string;
  permissions: Permission[];
  is_system?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  name?: string;
  role: Role;
  must_change_password: boolean;
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  is_super_admin?: boolean;
  created_at: string;
}

export interface AuthSession {
  user: User;
  csrf_token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface MobileLoginPayload {
  username: string;
  password: string;
  device_id?: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface AuthResponse {
  status: string;
  csrf_token: string;
  must_change_password?: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: User;
}
