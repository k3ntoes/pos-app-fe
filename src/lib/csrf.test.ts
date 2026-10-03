import { afterEach, describe, expect, it, vi } from "vitest";
import { getCsrfToken, getCsrfTokenFromCookie, getCsrfTokenFromMeta } from "./csrf";

describe("CSRF Helper", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    for (const el of document.querySelectorAll('meta[name="csrf-token"]')) {
      el.remove();
    }
  });

  it("should extract CSRF token from cookie", () => {
    vi.spyOn(document, "cookie", "get").mockReturnValue("pos_csrf=test-csrf-cookie-token");
    expect(getCsrfTokenFromCookie()).toBe("test-csrf-cookie-token");
    expect(getCsrfToken()).toBe("test-csrf-cookie-token");
  });

  it("should extract CSRF token from meta tag", () => {
    vi.spyOn(document, "cookie", "get").mockReturnValue("");
    const meta = document.createElement("meta");
    meta.name = "csrf-token";
    meta.content = "test-csrf-meta-token";
    document.head.appendChild(meta);

    expect(getCsrfTokenFromMeta()).toBe("test-csrf-meta-token");
    expect(getCsrfToken()).toBe("test-csrf-meta-token");
  });

  it("should return null when no token is present", () => {
    vi.spyOn(document, "cookie", "get").mockReturnValue("");
    expect(getCsrfToken()).toBeNull();
  });
});
