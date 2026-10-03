import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TemporaryPasswordModal } from "./TemporaryPasswordModal";

describe("TemporaryPasswordModal", () => {
  it("renders modal with temporary password and disabled close button until checkbox checked", async () => {
    const handleClose = vi.fn();
    render(
      <TemporaryPasswordModal
        open={true}
        temporaryPassword="TempPassword123!"
        userName="John Doe"
        onClose={handleClose}
      />,
    );

    expect(screen.getByText(/Password Sementara User Baru/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("TempPassword123!")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Tutup & Selesai/i });
    expect(closeBtn).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(closeBtn).toBeEnabled();
    await userEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
