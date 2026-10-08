import type {
  CreateUserPayload,
  CreateUserResponse,
  PaginatedUsersResponse,
  ResetPasswordResponse,
  UpdateSelfProfilePayload,
  UpdateUserPayload,
  User,
  UserDetail,
  UserFilterParams,
  UserListItem,
  UserRoleAssignmentResponse,
  UserStatus,
} from "@/types/user";
import { apiClient } from "./client";

export const usersApi = {
  getUsers: async (params?: UserFilterParams): Promise<PaginatedUsersResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.unit_id) searchParams.set("unit_id", params.unit_id);
    if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
    if (params?.sort_dir) searchParams.set("sort_dir", params.sort_dir);

    const query = searchParams.toString();
    const url = `/api/v1/users${query ? `?${query}` : ""}`;
    const res = await apiClient.get<PaginatedUsersResponse>(url);
    if (res && typeof res === "object" && "data" in res && "meta" in res) {
      return res;
    }
    const resObj = res as Record<string, unknown>;
    const list = Array.isArray(res) ? res : (resObj?.data as UserListItem[]) || [];
    const page = params?.page || 1;
    const pageSize = params?.page_size || params?.per_page || 10;
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

  getUserById: async (id: string): Promise<UserDetail> => {
    const res = await apiClient.get<{ data: UserDetail } | UserDetail>(`/api/v1/users/${id}`);
    return ("data" in res && res.data ? res.data : res) as UserDetail;
  },

  createUser: async (payload: CreateUserPayload): Promise<CreateUserResponse> => {
    const res = await apiClient.post<{ data: CreateUserResponse } | CreateUserResponse>(
      "/api/v1/users",
      payload,
    );
    return ("data" in res && res.data ? res.data : res) as CreateUserResponse;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<UserDetail> => {
    const res = await apiClient.patch<{ data: UserDetail } | UserDetail>(
      `/api/v1/users/${id}`,
      payload,
    );
    return ("data" in res && res.data ? res.data : res) as UserDetail;
  },

  updateUserStatus: async (id: string, status: UserStatus): Promise<UserDetail> => {
    const res = await apiClient.patch<{ data: UserDetail } | UserDetail>(
      `/api/v1/users/${id}/status`,
      { status },
    );
    return ("data" in res && res.data ? res.data : res) as UserDetail;
  },

  resetPassword: async (userId: string): Promise<ResetPasswordResponse> => {
    const res = await apiClient.post<{ data: ResetPasswordResponse } | ResetPasswordResponse>(
      `/api/v1/users/${userId}/reset-password`,
    );
    return ("data" in res && res.data ? res.data : res) as ResetPasswordResponse;
  },

  assignUserRole: async (id: string, unit_id: string | null, role_id: string): Promise<void> => {
    await apiClient.post(`/api/v1/users/${id}/roles`, { unit_id, role_id });
  },

  getUserRoles: async (userId: string): Promise<UserRoleAssignmentResponse[]> => {
    const res = await apiClient.get<
      { data: UserRoleAssignmentResponse[] } | UserRoleAssignmentResponse[]
    >(`/api/v1/users/${userId}/roles`);
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  removeUserRole: async (userId: string, assignmentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${userId}/roles/${assignmentId}`);
  },

  updateMe: async (payload: UpdateSelfProfilePayload): Promise<User> => {
    const res = await apiClient.patch<{ data: User } | User>("/api/v1/users/me", payload);
    return ("data" in res && res.data ? res.data : res) as User;
  },
};
