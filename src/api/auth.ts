import { clearCsrfToken, setCsrfToken } from "@/lib/csrf";
import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  MobileLoginPayload,
  RefreshTokenPayload,
  User,
} from "@/types/auth";
import { apiClient } from "./client";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", payload);
    if (res.csrf_token) {
      setCsrfToken(res.csrf_token);
    }
    return res;
  },

  mobileLogin: async (payload: MobileLoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/mobile/login", payload);
    if (res.csrf_token) {
      setCsrfToken(res.csrf_token);
    }
    return res;
  },

  refreshToken: async (payload: RefreshTokenPayload): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/refresh", payload);
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    clearCsrfToken();
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<{ data: User } | User>("/auth/me");
    return ("data" in res && res.data ? res.data : res) as User;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiClient.post("/auth/change-password", payload);
  },
};
