import { apiClient } from "./client";

export const permissionsApi = {
  getPermissions: async (): Promise<string[]> => {
    const res = await apiClient.get<{ data: string[] } | string[]>("/api/v1/permissions");
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },
};
