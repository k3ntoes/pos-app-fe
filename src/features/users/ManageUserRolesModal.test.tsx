import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ManageUserRolesModal } from "./ManageUserRolesModal";

const mockAssignRole = vi.fn();
const mockRevokeRole = vi.fn();

vi.mock("@/hooks/useManageUserRoles", () => ({
  useManageUserRoles: vi.fn(),
}));

import { useManageUserRoles } from "@/hooks/useManageUserRoles";

describe("ManageUserRolesModal", () => {
  const sampleActiveRoles = [
    {
      id: "asg-1",
      user_id: "usr-1",
      role_id: "role-admin",
      role_code: "SUPER_ADMIN",
      role_name: "Super Admin",
      is_system: true,
      unit_id: null,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "asg-2",
      user_id: "usr-1",
      role_id: "role-cashier",
      role_code: "CASHIER",
      role_name: "Kasir",
      is_system: false,
      unit_id: "unit-1",
      created_at: "2026-01-02T00:00:00Z",
    },
  ];

  const sampleUnits = [
    { id: "unit-1", name: "Cabang Jakarta", is_active: true },
    { id: "unit-2", name: "Cabang Bandung", is_active: true },
  ];

  const sampleRoles = [
    { id: "role-admin", name: "Super Admin", code: "SUPER_ADMIN", is_system: true },
    { id: "role-cashier", name: "Kasir", code: "CASHIER", is_system: false },
    { id: "role-inventory", name: "Staff Gudang", code: "INVENTORY", is_system: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useManageUserRoles as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      activeRoles: sampleActiveRoles,
      isLoadingActiveRoles: false,
      units: sampleUnits,
      isLoadingUnits: false,
      roles: sampleRoles,
      isLoadingRoles: false,
      assignRole: mockAssignRole,
      isAssigning: false,
      revokeRole: mockRevokeRole,
      isRevoking: false,
      refetchActiveRoles: vi.fn(),
    });
  });

  it("renders active roles with unit scopes and system badges", () => {
    render(
      <ManageUserRolesModal
        open={true}
        userId="usr-1"
        userName="John Doe"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Kelola Role: John Doe")).toBeInTheDocument();
    expect(screen.getAllByText("Semua Unit (Global)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cabang Jakarta").length).toBeGreaterThan(0);
    expect(screen.getByText("System Role")).toBeInTheDocument();
    expect(screen.getByText("Custom Role")).toBeInTheDocument();
  });

  it("applies smart role filtering: disables role if already assigned on selected unit", async () => {
    render(
      <ManageUserRolesModal
        open={true}
        userId="usr-1"
        userName="John Doe"
        onClose={vi.fn()}
      />,
    );

    const unitSelect = screen.getByLabelText("Pilih Unit");
    const roleSelect = screen.getByLabelText("Pilih Role");

    // By default unit is Global (Semua Unit)
    // Super Admin is already assigned globally
    const adminOption = screen.getByRole("option", { name: /Super Admin \(Sudah Ditugaskan\)/i });
    expect(adminOption).toBeDisabled();

    // Staff Gudang is NOT assigned globally
    const inventoryOption = screen.getByRole("option", { name: "Staff Gudang" });
    expect(inventoryOption).not.toBeDisabled();

    // Switch unit to Cabang Jakarta (where Kasir is assigned)
    await userEvent.selectOptions(unitSelect, "unit-1");

    const cashierOption = screen.getByRole("option", { name: /Kasir \(Sudah Ditugaskan\)/i });
    expect(cashierOption).toBeDisabled();
  });

  it("assigns a new role when form submitted", async () => {
    mockAssignRole.mockResolvedValueOnce(undefined);

    render(
      <ManageUserRolesModal
        open={true}
        userId="usr-1"
        userName="John Doe"
        onClose={vi.fn()}
      />,
    );

    const roleSelect = screen.getByLabelText("Pilih Role");
    await userEvent.selectOptions(roleSelect, "role-inventory");

    const assignBtn = screen.getByRole("button", { name: /Tugaskan Role/i });
    expect(assignBtn).toBeEnabled();

    await userEvent.click(assignBtn);
    expect(mockAssignRole).toHaveBeenCalledWith({
      unitId: null,
      roleId: "role-inventory",
    });
  });

  it("shows confirmation dialog and revokes role on confirm", async () => {
    mockRevokeRole.mockResolvedValueOnce(undefined);

    render(
      <ManageUserRolesModal
        open={true}
        userId="usr-1"
        userName="John Doe"
        onClose={vi.fn()}
      />,
    );

    const revokeButtons = screen.getAllByRole("button", { name: /Cabut/i });
    // Click revoke on first item
    await userEvent.click(revokeButtons[0]);

    // Confirmation dialog appears
    expect(screen.getByText("Cabut Role Pengguna")).toBeInTheDocument();
    expect(
      screen.getByText(/Apakah Anda yakin ingin mencabut role/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Ya, Cabut Role" });
    await userEvent.click(confirmBtn);

    expect(mockRevokeRole).toHaveBeenCalledWith("asg-1");
  });
});
