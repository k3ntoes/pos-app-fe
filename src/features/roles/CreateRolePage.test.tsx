import { rolesApi } from "@/api/roles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CreateRolePage } from "./CreateRolePage";

vi.mock("@/features/roles/usePermissions", () => ({
  usePermissions: () => ({
    permissionGroups: [
      {
        description: "Manajemen Pengguna",
        permissions: [
          { description: "Lihat Pengguna", permission: "users:read" },
          { description: "Kelola Pengguna", permission: "users:manage" },
        ],
      },
    ],
    isLoadingPermissions: false,
    permissionsError: null,
  }),
}));

vi.mock("@/api/roles", () => ({
  rolesApi: {
    createRole: vi.fn(),
  },
}));

describe("CreateRolePage", () => {
  it("validates form fields and submits new role", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(rolesApi.createRole).mockResolvedValueOnce({
      id: "role-new",
      name: "Supervisor",
      description: "Supervisor role",
      is_system: false,
      permissions: ["users:read"],
      assigned_users_count: 0,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateRolePage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Tambah Role Baru/i)).toBeInTheDocument();
    expect(await screen.findByText("Manajemen Pengguna")).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Nama Role/i);
    fireEvent.change(nameInput, { target: { value: "Supervisor" } });

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole("button", { name: /Simpan Role/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(rolesApi.createRole).toHaveBeenCalled();
    });
  });
});
