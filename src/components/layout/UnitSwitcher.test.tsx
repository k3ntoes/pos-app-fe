import { UnitContext } from "@/features/units/UnitContext";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UnitSwitcher } from "./UnitSwitcher";

describe("UnitSwitcher", () => {
  it("renders active unit and switches unit on click", async () => {
    const setActiveUnit = vi.fn();
    const units = [
      {
        id: "1",
        code: "U1",
        name: "Store A",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "2",
        code: "U2",
        name: "Store B",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ];

    render(
      <UnitContext.Provider
        value={{
          units,
          activeUnit: units[0],
          setActiveUnit,
          userAssignments: [],
          isLoadingUnits: false,
          refreshUnits: vi.fn(),
        }}
      >
        <UnitSwitcher />
      </UnitContext.Provider>,
    );

    expect(screen.getByText("Store A")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Store A"));

    await waitFor(() => {
      expect(screen.getByText("Store B")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Store B"));

    expect(setActiveUnit).toHaveBeenCalledWith(units[1]);
  });
});
