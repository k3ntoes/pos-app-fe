import { AuthContext } from "@/features/auth/AuthContext";
import { UnitContext } from "@/features/units/UnitContext";
import type { User } from "@/types/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("filters menu items based on user permissions", () => {
    const mockUser: User = {
      id: "1",
      username: "admin",
      email: "admin@pos.com",
      name: "Admin",
      role: { id: "r1", name: "Staff", permissions: ["users:read"] },
      must_change_password: false,
      status: "ACTIVE",
      created_at: "",
    };

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider
            value={{
              user: mockUser,
              isLoading: false,
              isAuthenticated: true,
              mustChangePassword: false,
              login: vi.fn(),
              logout: vi.fn(),
              changePassword: vi.fn(),
              refreshSession: vi.fn(),
            }}
          >
            <UnitContext.Provider
              value={{
                units: [],
                activeUnit: null,
                setActiveUnit: vi.fn(),
                userAssignments: [],
                isLoadingUnits: false,
                refreshUnits: vi.fn(),
              }}
            >
              <Sidebar />
            </UnitContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.queryByText("Roles")).not.toBeInTheDocument();
  });
});
