import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ChangePasswordPage } from "./ChangePasswordPage";

const mockChangePassword = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => ({
    changePassword: mockChangePassword,
    mustChangePassword: true,
  }),
}));

describe("ChangePasswordPage", () => {
  it("renders change password form elements", () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole("heading", { name: /Ubah Password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Password Saat Ini/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password Baru$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Konfirmasi Password Baru/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Simpan Password Baru/i })).toBeInTheDocument();
  });

  it("shows validation errors for short password or mismatched confirmation", async () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>,
    );

    await userEvent.type(screen.getByLabelText(/Password Saat Ini/i), "oldpass");
    await userEvent.type(screen.getByLabelText(/^Password Baru$/i), "short");
    await userEvent.type(screen.getByLabelText(/Konfirmasi Password Baru/i), "different");
    await userEvent.click(screen.getByRole("button", { name: /Simpan Password Baru/i }));

    expect(await screen.findByText(/Password baru minimal 8 karakter/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Konfirmasi password tidak cocok dengan password baru/i),
    ).toBeInTheDocument();
  });

  it("submits form successfully with valid matching passwords", async () => {
    mockChangePassword.mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>,
    );

    await userEvent.type(screen.getByLabelText(/Password Saat Ini/i), "oldpass123");
    await userEvent.type(screen.getByLabelText(/^Password Baru$/i), "newsecurepass123");
    await userEvent.type(screen.getByLabelText(/Konfirmasi Password Baru/i), "newsecurepass123");
    await userEvent.click(screen.getByRole("button", { name: /Simpan Password Baru/i }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        current_password: "oldpass123",
        new_password: "newsecurepass123",
        confirm_password: "newsecurepass123",
      });
    });
  });
});
