import { AppShell } from "@/components/layout/AppShell";
import { AuditLogListPage } from "@/features/audit";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ChangePasswordPage } from "@/features/auth/ChangePasswordPage";
import { GuestRoute } from "@/features/auth/GuestRoute";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { CreateRolePage } from "@/features/roles/CreateRolePage";
import { EditRolePage } from "@/features/roles/EditRolePage";
import { RoleDetailPage } from "@/features/roles/RoleDetailPage";
import { RoleListPage } from "@/features/roles/RoleListPage";
import { UnitListPage } from "@/features/units/UnitListPage";
import { CreateUserPage } from "@/features/users/CreateUserPage";
import { EditUserPage } from "@/features/users/EditUserPage";
import { UserDetailPage } from "@/features/users/UserDetailPage";
import { UserListPage } from "@/features/users/UserListPage";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: "/login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
      {
        element: (
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            element: <App />,
          },
          {
            path: "/users",
            element: <UserListPage />,
          },
          {
            path: "/users/new",
            element: <CreateUserPage />,
          },
          {
            path: "/users/:id",
            element: <UserDetailPage />,
          },
          {
            path: "/users/:id/edit",
            element: <EditUserPage />,
          },
          {
            path: "/roles",
            element: <RoleListPage />,
          },
          {
            path: "/roles/new",
            element: <CreateRolePage />,
          },
          {
            path: "/roles/:id",
            element: <RoleDetailPage />,
          },
          {
            path: "/roles/:id/edit",
            element: <EditRolePage />,
          },
          {
            path: "/units",
            element: <UnitListPage />,
          },
          {
            path: "/pos",
            element: <div className="p-4 text-xl font-bold">POS Cashier Page</div>,
          },
          {
            path: "/audit-logs",
            element: <AuditLogListPage />,
          },
          {
            path: "/audit",
            element: <AuditLogListPage />,
          },
        ],
      },
    ],
  },
]);
