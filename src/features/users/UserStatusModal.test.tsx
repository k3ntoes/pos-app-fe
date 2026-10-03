import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserStatusModal } from "./UserStatusModal";

describe("UserStatusModal", () => {
  it("renders status modal and submits status change", async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <UserStatusModal
        open={true}
        userName="Budi"
        currentStatus="ACTIVE"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />,
    );

    expect(screen.getByText(/Ubah Status User/i)).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "SUSPENDED");

    const saveBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    expect(saveBtn).toBeEnabled();

    await userEvent.click(saveBtn);
    expect(handleConfirm).toHaveBeenCalledWith("SUSPENDED");
  });
});
