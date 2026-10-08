import { rolesApi } from "@/api/roles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RoleListPage } from "./RoleListPage";
import { AuthProvider } from "@/features/auth/AuthContext";

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoles: vi.fn(),
    deleteRole: vi.fn(),
  },
}));

describe("RoleListPage", () => {
  it("renders role list table, is_system badge, and actions", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(rolesApi.getRoles).mockResolvedValueOnce([
      {
        id: "role-1",
        name: "Administrator",
        description: "Full system access",
        is_system: true,
        permissions: ["USERS_CREATE", "USERS_READ"],
        assigned_users_count: 2,
        created_at: "2026-10-01T00:00:00Z",
        updated_at: "2026-10-01T00:00:00Z",
      },
      {
        id: "role-2",
        name: "Cashier",
        description: "POS cashier access",
        is_system: false,
        permissions: ["POS_CASHIER"],
        assigned_users_count: 0,
        created_at: "2026-10-01T00:00:00Z",
        updated_at: "2026-10-01T00:00:00Z",
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <RoleListPage />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Manajemen Roles/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Administrator")).toBeInTheDocument();
      expect(screen.getByText("System Role")).toBeInTheDocument();
      expect(screen.getByText("Cashier")).toBeInTheDocument();
      expect(screen.getByText("Custom Role")).toBeInTheDocument();
    });
  });
});
