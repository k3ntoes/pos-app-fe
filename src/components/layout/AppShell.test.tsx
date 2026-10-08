import { AuthProvider } from "@/features/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

vi.mock("@/api/auth", () => ({
  authApi: {
    getMe: vi.fn().mockResolvedValue({
      id: "u1",
      username: "admin",
      email: "admin@pos.com",
      name: "Admin User",
      role: { id: "r1", name: "Admin", permissions: ["users:read"] },
      must_change_password: false,
      status: "ACTIVE",
      created_at: "",
    }),
    logout: vi.fn(),
  },
}));

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi
      .fn()
      .mockResolvedValue([
        { id: "1", code: "U1", name: "Store A", status: "ACTIVE", created_at: "", updated_at: "" },
      ]),
    getUserUnits: vi.fn().mockResolvedValue([]),
  },
}));

describe("AppShell", () => {
  it("renders header, sidebar, and content area", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("POS App")).toBeInTheDocument();
      expect(screen.getByText("Admin User")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Store A")).toBeInTheDocument();
    });
  });
});
