import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PermissionMatrix } from "./PermissionMatrix";

const mockGroups = [
  {
    description: "Manajemen Users",
    permissions: [
      { permission: "users:create", description: "Buat User Baru" },
      { permission: "users:read", description: "Lihat Users" },
    ],
  },
];

describe("PermissionMatrix", () => {
  it("renders permission groups and checkboxes", () => {
    const onChange = vi.fn();
    render(
      <PermissionMatrix
        selectedPermissions={[]}
        onChange={onChange}
        permissionGroups={mockGroups}
      />,
    );

    expect(screen.getByText("Manajemen Users")).toBeDefined();
    expect(screen.getByText("Buat User Baru")).toBeDefined();
  });

  it("toggles permission when clicked", () => {
    const onChange = vi.fn();
    render(
      <PermissionMatrix
        selectedPermissions={[]}
        onChange={onChange}
        permissionGroups={mockGroups}
      />,
    );

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(["users:create"]);
  });
});
