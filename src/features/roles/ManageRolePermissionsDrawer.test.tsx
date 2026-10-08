import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ManageRolePermissionsDrawer } from "./ManageRolePermissionsDrawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockRole = {
  id: "role-1",
  name: "Cashier",
  code: "cashier",
  description: "Cashier role",
  is_system: false,
  permissions: ["POS_CASHIER" as const],
  assigned_users_count: 2,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("ManageRolePermissionsDrawer", () => {
  it("renders drawer correctly when open", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ManageRolePermissionsDrawer role={mockRole} open={true} onOpenChange={() => {}} />
        </AuthProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Manage Permissions: Cashier")).toBeDefined();
    expect(screen.getByPlaceholderText(/cari izin atau domain/i)).toBeDefined();
  });
});
