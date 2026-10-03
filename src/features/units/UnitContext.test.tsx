import { unitsApi } from "@/api/units";
import { AuthProvider } from "@/features/auth/AuthContext";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnitProvider, useUnit } from "./UnitContext";

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn(),
    getUserUnits: vi.fn(),
  },
}));

vi.mock("@/api/auth", () => ({
  authApi: {
    getMe: vi.fn().mockResolvedValue({
      id: "u1",
      username: "admin",
      email: "admin@pos.com",
      name: "Admin",
      role: { id: "r1", name: "Owner", permissions: ["users:read"] },
      must_change_password: false,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    }),
  },
}));

const TestConsumer = () => {
  const { units, activeUnit, setActiveUnit } = useUnit();
  return (
    <div>
      <div data-testid="active-unit">{activeUnit ? activeUnit.name : "none"}</div>
      <div data-testid="units-count">{units.length}</div>
      {units.map((u) => (
        <button key={u.id} type="button" onClick={() => setActiveUnit(u)}>
          Select {u.name}
        </button>
      ))}
    </div>
  );
};

describe("UnitContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("fetches units and auto-selects the first unit", async () => {
    vi.mocked(unitsApi.getUnits).mockResolvedValueOnce({
      units: [
        { id: "1", code: "U1", name: "Store A", is_active: true, created_at: "", updated_at: "" },
        { id: "2", code: "U2", name: "Store B", is_active: true, created_at: "", updated_at: "" },
      ],
      total: 2,
    });
    vi.mocked(unitsApi.getUserUnits).mockResolvedValueOnce([]);

    render(
      <AuthProvider>
        <UnitProvider>
          <TestConsumer />
        </UnitProvider>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("units-count")).toHaveTextContent("2");
      expect(screen.getByTestId("active-unit")).toHaveTextContent("Store A");
    });
  });

  it("allows switching active unit and persists to localStorage", async () => {
    vi.mocked(unitsApi.getUnits).mockResolvedValueOnce({
      units: [
        { id: "1", code: "U1", name: "Store A", is_active: true, created_at: "", updated_at: "" },
        { id: "2", code: "U2", name: "Store B", is_active: true, created_at: "", updated_at: "" },
      ],
      total: 2,
    });
    vi.mocked(unitsApi.getUserUnits).mockResolvedValueOnce([]);

    render(
      <AuthProvider>
        <UnitProvider>
          <TestConsumer />
        </UnitProvider>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("active-unit")).toHaveTextContent("Store A");
    });

    await userEvent.click(screen.getByText("Select Store B"));

    expect(screen.getByTestId("active-unit")).toHaveTextContent("Store B");
    expect(localStorage.getItem("pos_active_unit")).toContain("Store B");
  });
});
