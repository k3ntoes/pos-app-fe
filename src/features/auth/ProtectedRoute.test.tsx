import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  it("redirects to /login when unauthenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      mustChangePassword: false,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Dashboard")).not.toBeInTheDocument();
  });

  it("hard redirects to /change-password when mustChangePassword is true", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      mustChangePassword: true,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/change-password" element={<div>Change Password Page</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Change Password Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Dashboard")).not.toBeInTheDocument();
  });

  it("renders children when authenticated and mustChangePassword is false", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      mustChangePassword: false,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Dashboard")).toBeInTheDocument();
  });
});
