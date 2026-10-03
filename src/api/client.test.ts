import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./client";
import { ApiError } from "./error";

describe("API Client", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("should successfully fetch JSON data", async () => {
    const mockData = { id: 1, name: "POS Terminal" };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockData,
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await apiClient<{ id: number; name: string }>("/api/test");
    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith("/api/test", expect.any(Object));
  });

  it("should throw ApiError on failure response", async () => {
    const errorBody = { message: "Validation failed", code: "VALIDATION_ERROR" };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => errorBody,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient("/api/fail")).rejects.toThrow(ApiError);
    try {
      await apiClient("/api/fail");
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(422);
      expect(apiErr.code).toBe("VALIDATION_ERROR");
      expect(apiErr.message).toBe("Validation failed");
    }
  });
});
