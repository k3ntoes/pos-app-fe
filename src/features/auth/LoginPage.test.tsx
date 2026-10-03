import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const mockLogin = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginPage", () => {
  it("renders login form elements", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole("heading", { name: /Login POS App/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    await userEvent.type(screen.getByLabelText(/Username/i), "admin");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "admin",
        password: "password123",
      });
    });
  });
});
