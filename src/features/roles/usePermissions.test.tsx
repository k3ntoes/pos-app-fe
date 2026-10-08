import { AuthContext } from "@/features/auth/AuthContext";
import { UnitContext } from "@/features/units/UnitContext";
import type { User } from "@/types/auth";
import type { Unit, UserRoleAssignment } from "@/types/unit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePermissions } from "./usePermissions";

const TestConsumer = () => {
  const { hasPermission, hasRole } = usePermissions();
  return (
    <div>
      <div data-testid="can-users-read">{hasPermission("USERS_READ") ? "yes" : "no"}</div>
      <div data-testid="can-users-create">{hasPermission("USERS_CREATE") ? "yes" : "no"}</div>
      <div data-testid="has-owner">{hasRole("Owner") ? "yes" : "no"}</div>
    </div>
  );
};

describe("usePermissions", () => {
  it("evaluates permissions correctly based on active unit and user roles", () => {
    const mockUser: User = {
      id: "1",
      username: "admin",
      email: "admin@pos.com",
      name: "Admin",
      role: { id: "r1", name: "Staff", permissions: ["USERS_READ"] },
      must_change_password: false,
      status: "ACTIVE",
      created_at: "",
    };

    const mockAssignments: UserRoleAssignment[] = [
      {
        id: "a1",
        user_id: "1",
        role_id: "r2",
        unit_id: "unit-1",
        role: { id: "r2", name: "Manager", permissions: ["USERS_READ", "USERS_CREATE"] },
      },
    ];

    const mockActiveUnit: Unit = {
      id: "unit-1",
      code: "U1",
      name: "Unit 1",
      status: "ACTIVE",
      created_at: "",
      updated_at: "",
    };

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
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
              units: [mockActiveUnit],
              activeUnit: mockActiveUnit,
              setActiveUnit: vi.fn(),
              userAssignments: mockAssignments,
              isLoadingUnits: false,
              refreshUnits: vi.fn(),
            }}
          >
            <TestConsumer />
          </UnitContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("can-users-read")).toHaveTextContent("yes");
    expect(screen.getByTestId("can-users-create")).toHaveTextContent("yes");
    expect(screen.getByTestId("has-owner")).toHaveTextContent("no");
  });
});
