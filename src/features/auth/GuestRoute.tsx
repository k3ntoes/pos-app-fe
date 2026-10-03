import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, mustChangePassword, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-sm font-medium text-gray-600">Memuat sesi...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
