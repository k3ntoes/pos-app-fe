import { rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CreateUserPage } from "./CreateUserPage";

vi.mock("@/api/users", () => ({
  usersApi: {
    createUser: vi.fn(),
  },
}));

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn(),
  },
}));

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoles: vi.fn(),
  },
}));

describe("CreateUserPage", () => {
  it("validates form inputs and submits successfully", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(unitsApi.getUnits).mockResolvedValue({
      units: [{ id: "unit-1", name: "Cabang A", code: "CBA", type: "STORE", is_active: true }],
      total: 1,
    });
    vi.mocked(rolesApi.getRoles).mockResolvedValue([
      { id: "role-1", name: "Kasir", description: "Kasir role" },
    ]);
    vi.mocked(usersApi.createUser).mockResolvedValueOnce({
      id: "usr-new",
      name: "Ani",
      username: "ani",
      email: "ani@pos.com",
      status: "ACTIVE",
      must_change_password: true,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      unit_role_assignments: [{ unit_id: "unit-1", role_id: "role-1" }],
      temporary_password: "TempPass123!",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateUserPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Tambah User Baru/i)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/Contoh: Budi Santoso/i), "Ani");
    await userEvent.type(screen.getByPlaceholderText(/Contoh: budisantoso/i), "ani");
    await userEvent.type(screen.getByPlaceholderText(/Contoh: budi@pos.com/i), "ani@pos.com");

    const selects = screen.getAllByRole("combobox");
    await userEvent.selectOptions(selects[0], "unit-1");
    await userEvent.selectOptions(selects[1], "role-1");

    await userEvent.click(screen.getByRole("button", { name: /Simpan & Buat User/i }));

    await waitFor(() => {
      expect(usersApi.createUser).toHaveBeenCalled();
      expect(screen.getByText(/Password Sementara User Baru/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("TempPass123!")).toBeInTheDocument();
    });
  });
});
