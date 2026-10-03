import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { UserDetailPage } from "./UserDetailPage";

vi.mock("@/api/users", () => ({
  usersApi: {
    getUserById: vi.fn(),
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
});
