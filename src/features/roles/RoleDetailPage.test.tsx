import { rolesApi } from "@/api/roles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RoleDetailPage } from "./RoleDetailPage";

vi.mock("@/features/roles/usePermissions", () => ({
  usePermissions: () => ({
    permissionGroups: [
      {
        description: "Manajemen Pengguna",
        permissions: [
          { description: "Lihat Pengguna", permission: "users:read" },
          { description: "Kelola Pengguna", permission: "users:manage" },
          { description: "Akses Kasir", permission: "pos:cashier" },
        ],
      },
    ],
    isLoadingPermissions: false,
    permissionsError: null,
  }),
}));

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoleById: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "role-1" }),
  };
});

describe("RoleDetailPage", () => {
  it("renders role detail information and grouped permissions", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(rolesApi.getRoleById).mockResolvedValueOnce({
      id: "role-1",
      name: "Cashier",
      description: "Cashier role description",
      is_system: false,
      permissions: ["pos:cashier"],
      assigned_users_count: 5,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RoleDetailPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(async () => {
      expect(screen.getByText("Cashier")).toBeInTheDocument();
      expect(screen.getByText("Cashier role description")).toBeInTheDocument();
      expect(screen.getByText("5 user")).toBeInTheDocument();
      expect(await screen.findByText("Manajemen Pengguna")).toBeInTheDocument();
    });
  });
});
