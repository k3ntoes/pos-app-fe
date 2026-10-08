import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditUserPage } from "./EditUserPage";

vi.mock("@/api/users", () => ({
  usersApi: {
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    getUserRoles: vi.fn().mockResolvedValue([]),
    assignUserRole: vi.fn(),
    removeUserRole: vi.fn(),
  },
}));

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn().mockResolvedValue({ units: [], total: 0 }),
  },
}));

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoles: vi.fn().mockResolvedValue([]),
  },
}));

describe("EditUserPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders profile fields and active roles summary without role array inputs", async () => {
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
        <MemoryRouter initialEntries={["/users/usr-1/edit"]}>
          <Routes>
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Budi Santoso")).toBeInTheDocument();
      expect(screen.getByDisplayValue("budi@pos.com")).toBeInTheDocument();
    });

    // Periksa bahwa tidak ada tombol "+ Tambah Penugasan" lama
    expect(screen.queryByText("+ Tambah Penugasan")).not.toBeInTheDocument();

    // Periksa bahwa ringkasan role dan tombol shortcut "Kelola Role" tersedia
    expect(screen.getByText("Cabang A")).toBeInTheDocument();
    expect(screen.getByText("Kasir")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kelola Role/i })).toBeInTheDocument();
  });

  it("opens ManageUserRolesModal when clicking Kelola Role shortcut button", async () => {
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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/users/usr-1/edit"]}>
          <Routes>
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Budi Santoso")).toBeInTheDocument();
    });

    const shortcutBtn = screen.getByRole("button", { name: /Kelola Role/i });
    fireEvent.click(shortcutBtn);

    await waitFor(() => {
      expect(screen.getByText(/Kelola Role: Budi Santoso/i)).toBeInTheDocument();
    });
  });

  it("submits only profile fields to updateUser endpoint", async () => {
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

    vi.mocked(usersApi.updateUser).mockResolvedValue({
      id: "usr-1",
      name: "Budi Santoso Updated",
      full_name: "Budi Santoso Updated",
      username: "budi",
      email: "budi@pos.com",
      status: "ACTIVE",
      must_change_password: false,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      unit_role_assignments: [],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/users/usr-1/edit"]}>
          <Routes>
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Budi Santoso")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Nama Lengkap/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Budi Santoso Updated");

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(usersApi.updateUser).toHaveBeenCalledWith("usr-1", {
        name: "Budi Santoso Updated",
        email: "budi@pos.com",
      });
    });
  });
});
