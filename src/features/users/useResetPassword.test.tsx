import { usersApi } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { useResetPassword } from "./useResetPassword";

vi.mock("@/api/users", () => ({
  usersApi: {
    resetPassword: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useResetPassword", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    expect(result.current.confirmUser).toBeNull();
    expect(result.current.successData).toBeNull();
    expect(result.current.isResetting).toBe(false);
  });

  it("handles triggerReset, cancelReset, and confirmReset successfully", async () => {
    const mockResponse = {
      user_id: "user-123",
      temporary_password: "temp-pass-456",
      must_change_password: true,
      message: "Password reset successful",
    };
    vi.mocked(usersApi.resetPassword).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.triggerReset({ id: "user-123", name: "Bagus" });
    });

    expect(result.current.confirmUser).toEqual({ id: "user-123", name: "Bagus" });

    await act(async () => {
      result.current.confirmReset();
    });

    expect(usersApi.resetPassword).toHaveBeenCalledWith("user-123");
    expect(result.current.confirmUser).toBeNull();
    expect(result.current.successData).toEqual({
      temporaryPassword: "temp-pass-456",
      userName: "Bagus",
    });

    act(() => {
      result.current.closeSuccessModal();
    });

    expect(result.current.successData).toBeNull();
  });
});
