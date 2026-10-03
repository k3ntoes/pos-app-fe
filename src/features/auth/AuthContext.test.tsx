import { authApi } from "@/api/auth";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("@/api/auth", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
    changePassword: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, isAuthenticated, mustChangePassword, login, logout, changePassword } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "logged-in" : "logged-out"}</div>
      <div data-testid="user-name">{user?.name || "none"}</div>
      <div data-testid="must-change">{mustChangePassword ? "yes" : "no"}</div>
      <button
        type="button"
        onClick={() => login({ username_or_email: "admin", password: "password" })}
      >
        Login
      </button>
      <button type="button" onClick={() => logout()}>
        Logout
      </button>
      <button
        type="button"
        onClick={() =>
          changePassword({
            current_password: "old",
            new_password: "newpassword123",
            confirm_password: "newpassword123",
          })
        }
      >
        ChangePassword
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads unauthenticated session successfully", async () => {
    vi.mocked(authApi.getMe).mockRejectedValueOnce(new Error("Unauthorized"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out");
    });
  });

  it("handles login and session state", async () => {
    vi.mocked(authApi.getMe).mockRejectedValueOnce(new Error("Unauthorized"));
    vi.mocked(authApi.login).mockResolvedValueOnce({
      status: "success",
      csrf_token: "token-123",
      must_change_password: false,
    });
    vi.mocked(authApi.getMe).mockResolvedValueOnce({
      id: "1",
      username: "admin",
      email: "admin@pos.com",
      name: "Admin User",
      role: { id: "1", name: "Admin", permissions: [] },
      must_change_password: false,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out");
    });

    await act(async () => {
      await userEvent.click(screen.getByText("Login"));
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-in");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Admin User");
  });
});
