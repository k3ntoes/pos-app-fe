import { authApi } from "@/api/auth";
import type { ChangePasswordPayload, LoginPayload, User } from "@/types/auth";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (payload: LoginPayload) => {
    try {
      await authApi.login(payload);
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      toast.success("Login berhasil");
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Login gagal");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout network errors
    } finally {
      setUser(null);
      toast.success("Logout berhasil");
    }
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    try {
      await authApi.changePassword(payload);
      toast.success("Password berhasil diubah");
      if (user) {
        setUser({ ...user, must_change_password: false });
      }
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Gagal mengubah password");
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    mustChangePassword: !!user?.must_change_password,
    login,
    logout,
    changePassword,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children ?? <Outlet />}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
