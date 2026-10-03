import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DeleteRoleModal } from "./DeleteRoleModal";

describe("DeleteRoleModal", () => {
  it("disables delete button and shows alert when assigned users > 0", () => {
    const role = {
      id: "role-1",
      name: "Administrator",
      is_system: true,
      permissions: [],
      assigned_users_count: 3,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    };

    render(<DeleteRoleModal role={role} isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByText(/Role ini masih digunakan oleh/i)).toBeInTheDocument();
    const deleteButton = screen.getByRole("button", { name: /Hapus Role/i });
    expect(deleteButton).toBeDisabled();
  });

  it("enables delete button when assigned users is 0", () => {
    const role = {
      id: "role-2",
      name: "Custom Role",
      is_system: false,
      permissions: [],
      assigned_users_count: 0,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    };

    render(<DeleteRoleModal role={role} isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />);

    const deleteButton = screen.getByRole("button", { name: /Hapus Role/i });
    expect(deleteButton).toBeEnabled();
  });
});
