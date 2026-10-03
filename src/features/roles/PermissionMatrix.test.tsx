import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PermissionMatrix } from "./PermissionMatrix";

describe("PermissionMatrix", () => {
  it("renders permission groups and checkboxes", () => {
    const onChange = vi.fn();
    render(<PermissionMatrix selectedPermissions={[]} onChange={onChange} />);

    expect(screen.getByText("Manajemen Users")).toBeInTheDocument();
    expect(screen.getByText("Buat User Baru")).toBeInTheDocument();
  });

  it("toggles permission when clicked", () => {
    const onChange = vi.fn();
    render(<PermissionMatrix selectedPermissions={[]} onChange={onChange} />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(["users:create"]);
  });
});
