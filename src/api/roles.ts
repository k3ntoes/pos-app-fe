import type { CreateRolePayload, RoleDetail, RoleListItem, UpdateRolePayload } from "@/types/role";
import { apiClient } from "./client";

export const rolesApi = {
  getRoles: async (params?: { page?: number; page_size?: number; search?: string }): Promise<
    RoleListItem[]
  > => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    const url = `/api/v1/roles${query ? `?${query}` : ""}`;
    const res = await apiClient.get<{ data: RoleListItem[] } | RoleListItem[]>(url);
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  getRoleById: async (id: string): Promise<RoleDetail> => {
    const res = await apiClient.get<{ data: RoleDetail } | RoleDetail>(`/api/v1/roles/${id}`);
    return ("data" in res && res.data ? res.data : res) as RoleDetail;
  },

  createRole: async (payload: CreateRolePayload): Promise<RoleDetail> => {
    const res = await apiClient.post<{ data: RoleDetail } | RoleDetail>("/api/v1/roles", payload);
    return ("data" in res && res.data ? res.data : res) as RoleDetail;
  },

  updateRole: async (id: string, payload: UpdateRolePayload): Promise<RoleDetail> => {
    const res = await apiClient.put<{ data: RoleDetail } | RoleDetail>(
      `/api/v1/roles/${id}`,
      payload,
    );
    return ("data" in res && res.data ? res.data : res) as RoleDetail;
  },

  updateRolePermissions: async (roleId: string, permissions: string[]): Promise<RoleDetail> => {
    const res = await apiClient.put<{ data: RoleDetail } | RoleDetail>(
      `/api/v1/roles/${roleId}/permissions`,
      { permissions },
    );
    return ("data" in res && res.data ? res.data : res) as RoleDetail;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/roles/${id}`);
  },
};
