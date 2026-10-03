import type {
  CreateUnitPayload,
  Unit,
  UnitFilterParams,
  UnitListResponse,
  UpdateUnitPayload,
  UserRoleAssignment,
} from "@/types/unit";
import { apiClient } from "./client";

export const unitsApi = {
  getUnits: async (params?: UnitFilterParams): Promise<UnitListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.is_active !== undefined) {
      queryParams.append("is_active", String(params.is_active));
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const res = await apiClient.get<UnitListResponse | { data: UnitListResponse } | Unit[]>(
      `/api/v1/units${queryStr}`,
    );

    if (Array.isArray(res)) {
      return { units: res, total: res.length };
    }
    if (
      res &&
      typeof res === "object" &&
      "units" in res &&
      Array.isArray((res as UnitListResponse).units)
    ) {
      return res as UnitListResponse;
    }
    if (res && typeof res === "object" && "data" in res && res.data) {
      const data = (res as { data: unknown }).data;
      if (Array.isArray(data)) {
        return { units: data as Unit[], total: (data as Unit[]).length };
      }
      if (data && typeof data === "object" && "units" in data) {
        return data as UnitListResponse;
      }
    }
    return { units: [], total: 0 };
  },

  getUnitById: async (id: string): Promise<Unit> => {
    const res = await apiClient.get<Unit | { data: Unit }>(`/api/v1/units/${id}`);
    if (res && typeof res === "object" && "data" in res && res.data) {
      return (res as { data: Unit }).data;
    }
    return res as Unit;
  },

  createUnit: async (payload: CreateUnitPayload): Promise<Unit> => {
    const res = await apiClient.post<Unit | { data: Unit }>("/api/v1/units", payload);
    if (res && typeof res === "object" && "data" in res && res.data) {
      return (res as { data: Unit }).data;
    }
    return res as Unit;
  },

  updateUnit: async (id: string, payload: UpdateUnitPayload): Promise<Unit> => {
    const res = await apiClient.patch<Unit | { data: Unit }>(`/api/v1/units/${id}`, payload);
    if (res && typeof res === "object" && "data" in res && res.data) {
      return (res as { data: Unit }).data;
    }
    return res as Unit;
  },

  deleteUnit: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/units/${id}`);
  },

  getUserUnits: async (userId: string): Promise<UserRoleAssignment[]> => {
    const res = await apiClient.get<{ data: UserRoleAssignment[] } | UserRoleAssignment[]>(
      `/api/v1/users/${userId}/roles`,
    );
    return Array.isArray(res) ? res : res.data || [];
  },
};
