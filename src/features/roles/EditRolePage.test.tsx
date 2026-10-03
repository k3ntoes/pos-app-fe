import { rolesApi } from "@/api/roles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { EditRolePage } from "./EditRolePage";

vi.mock("@/api/roles", () => ({
  rolesApi: {
    getRoleById: vi.fn(),
    updateRole: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "role-1" }),
  };
});

describe("EditRolePage", () => {
  it("renders edit role form and enforces system role immutability", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(rolesApi.getRoleById).mockResolvedValueOnce({
      id: "role-1",
      name: "Administrator",
      description: "Admin system role",
      is_system: true,
      permissions: ["users:create"],
      assigned_users_count: 1,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditRolePage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Edit Role: Administrator/i)).toBeInTheDocument();
      expect(screen.getByText("System Role")).toBeInTheDocument();
      const nameInput = screen.getByLabelText(/Nama Role/i) as HTMLInputElement;
      expect(nameInput.readOnly).toBe(true);
    });
  });
});
