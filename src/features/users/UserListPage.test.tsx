import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { UserListPage } from "./UserListPage";

vi.mock("@/api/users", () => ({
  usersApi: {
    getUsers: vi.fn(),
    updateUserStatus: vi.fn(),
  },
}));

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn(),
  },
}));

describe("UserListPage", () => {
  it("renders user list table and items", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(usersApi.getUsers).mockResolvedValueOnce({
      data: [
        {
          id: "usr-1",
          full_name: "Budi Santoso",
          name: "Budi Santoso",
          username: "budi",
          email: "budi@pos.com",
          status: "ACTIVE",
          created_at: "2026-10-01T00:00:00Z",
          updated_at: "2026-10-01T00:00:00Z",
          unit_role_assignments: [
            { unit_id: "unit-1", role_id: "role-1", unit_name: "Cabang A", role_name: "Kasir" },
          ],
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
        page: 1,
        page_size: 10,
        total_items: 1,
        total_pages: 1,
      },
    });

    vi.mocked(unitsApi.getUnits).mockResolvedValueOnce({
      units: [{ id: "unit-1", name: "Cabang A", code: "CBA", type: "STORE", is_active: true }],
      total: 1,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserListPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Manajemen Users/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
      expect(screen.getByText("@budi")).toBeInTheDocument();
      expect(screen.getByText("budi@pos.com")).toBeInTheDocument();
      expect(screen.getAllByText("Cabang A").length).toBeGreaterThan(0);
      expect(screen.getByText("Kasir")).toBeInTheDocument();
    });
  });

  it("opens manage roles modal when clicking Kelola Role menu", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(usersApi.getUsers).mockResolvedValueOnce({
      data: [
        {
          id: "usr-1",
          full_name: "Budi Santoso",
          name: "Budi Santoso",
          username: "budi",
          email: "budi@pos.com",
          status: "ACTIVE",
          created_at: "2026-10-01T00:00:00Z",
          updated_at: "2026-10-01T00:00:00Z",
          unit_role_assignments: [],
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
        page: 1,
        page_size: 10,
        total_items: 1,
        total_pages: 1,
      },
    });

    vi.mocked(unitsApi.getUnits).mockResolvedValueOnce({
      units: [],
      total: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserListPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    const menuTrigger = screen.getByRole("button", { name: /Open menu/i });
    await userEvent.click(menuTrigger);

    const kelolaRoleItem = screen.getByText("Kelola Role");
    expect(kelolaRoleItem).toBeInTheDocument();
    await userEvent.click(kelolaRoleItem);

    expect(screen.getByText(/Kelola Role: Budi Santoso/i)).toBeInTheDocument();
  });
});
