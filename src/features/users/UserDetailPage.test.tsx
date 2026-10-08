import { rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { UserDetailPage } from "./UserDetailPage";

vi.mock("@/api/users", () => ({
  usersApi: {
    getUserById: vi.fn(),
    getUserRoles: vi.fn().mockResolvedValue([]),
    removeUserRole: vi.fn(),
    assignUserRole: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn().mockResolvedValue({
      units: [{ id: "unit-1", name: "Cabang A", is_active: true }],
      total: 1,
    }),
  },
}));

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoles: vi.fn().mockResolvedValue([]),
  },
}));

describe("UserDetailPage", () => {
  it("renders user details and assigned roles", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(usersApi.getUserById).mockResolvedValue({
      id: "usr-1",
      name: "Budi Santoso",
      username: "budi",
      email: "budi@pos.com",
      status: "ACTIVE",
      must_change_password: false,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      unit_role_assignments: [
        { unit_id: "unit-1", role_id: "role-1", unit_name: "Cabang A", role_name: "Kasir" },
      ],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/users/usr-1"]}>
          <Routes>
            <Route path="/users/:id" element={<UserDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
      expect(screen.getByText(/budi@pos.com/i)).toBeInTheDocument();
      expect(screen.getByText("Cabang A")).toBeInTheDocument();
      expect(screen.getByText("Kasir")).toBeInTheDocument();
    });
  });

  it("opens add role modal and revocation dialog interactively", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(usersApi.getUserById).mockResolvedValue({
      id: "usr-1",
      name: "Budi Santoso",
      username: "budi",
      email: "budi@pos.com",
      status: "ACTIVE",
      must_change_password: false,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      unit_role_assignments: [
        { unit_id: "unit-1", role_id: "role-1", unit_name: "Cabang A", role_name: "Kasir" },
      ],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/users/usr-1"]}>
          <Routes>
            <Route path="/users/:id" element={<UserDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // 1. Test opening Add Role modal
    const addRoleButton = screen.getByRole("button", { name: /\+ Tambah Role/i });
    fireEvent.click(addRoleButton);
    await waitFor(() => {
      expect(screen.getByText(/Kelola Role: Budi Santoso/i)).toBeInTheDocument();
    });

    // 2. Test opening Revocation confirmation dialog
    const revokeButton = screen.getByRole("button", { name: /Cabut role Kasir/i });
    fireEvent.click(revokeButton);
    await waitFor(() => {
      expect(screen.getByText(/Cabut Role Pengguna/i)).toBeInTheDocument();
      expect(screen.getByText(/Apakah Anda yakin ingin mencabut role/i)).toBeInTheDocument();
    });
  });

  it("handles reset password flow interactively", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(usersApi.getUserById).mockResolvedValue({
      id: "usr-1",
      name: "Budi Santoso",
      username: "budi",
      email: "budi@pos.com",
      status: "ACTIVE",
      must_change_password: false,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      unit_role_assignments: [],
    });

    vi.mocked(usersApi.resetPassword).mockResolvedValue({
      message: "Password reset successfully",
      temporary_password: "TempPassword123!",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/users/usr-1"]}>
          <Routes>
            <Route path="/users/:id" element={<UserDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // Click Reset Password button
    const resetButton = screen.getByRole("button", { name: /Reset Password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText(/Konfirmasi Reset Password/i)).toBeInTheDocument();
    });

    // Confirm reset
    const confirmButton = screen.getByRole("button", { name: /Ya, Reset Password/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/Password Sementara User Baru/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("TempPassword123!")).toBeInTheDocument();
    });
  });
});
