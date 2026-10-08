import type { BackendPermissionGroup } from "@/types/permission";
import { apiClient } from "./client";

export const permissionsApi = {
  getPermissions: async (): Promise<BackendPermissionGroup[]> => {
    const res = await apiClient.get<
      { data: BackendPermissionGroup[] } | BackendPermissionGroup[] | string[]
    >("/api/v1/permissions");

    const data =
      res && typeof res === "object" && "data" in res ? (res as { data: unknown }).data : res;

    if (Array.isArray(data)) {
      // If backend returns legacy list of strings
      if (data.length > 0 && typeof data[0] === "string") {
        return [
          {
            description: "Sistem",
            permissions: (data as string[]).map((p) => ({
              description: p,
              permission: p,
            })),
          },
        ];
      }
      return data as BackendPermissionGroup[];
    }
    return [];
  },
};
