import type { PermissionType } from "./permission";

export interface RoleListItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_system: boolean;
  permissions: PermissionType[];
  assigned_users_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoleDetail extends RoleListItem {}

export interface CreateRolePayload {
  name: string;
  code?: string | null;
  description?: string;
  permissions?: PermissionType[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: PermissionType[];
}

export interface UpdateRolePermissionsPayload {
  permissions: string[];
}

export interface PermissionDomain {
  domain: string;
  title: string;
  permissions: {
    id: PermissionType;
    label: string;
    description?: string;
  }[];
}

export interface GetRolesParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_system?: boolean;
}

export type GetRolesQuery = GetRolesParams;
