export interface BackendPermissionItem {
  description: string;
  permission: string;
}

export interface BackendPermissionGroup {
  description: string;
  permissions: BackendPermissionItem[];
}

export type PermissionType = string;
