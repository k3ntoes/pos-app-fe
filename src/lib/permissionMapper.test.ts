import { describe, expect, it } from "vitest";
import { normalizePermission, sanitizePermissions } from "./permissionMapper";

describe("permissionMapper", () => {
  it("returns permission strings as-is", () => {
    expect(normalizePermission("users:create")).toBe("users:create");
    expect(normalizePermission("pos:cashier")).toBe("pos:cashier");
    expect(normalizePermission("users:read")).toBe("users:read");
  });

  it("sanitizes permissions list against valid permissions as-is", () => {
    const raw = ["users:create", "invalid:perm", "pos:cashier"];
    const valid = ["users:create", "pos:cashier"];
    const result = sanitizePermissions(raw, valid);

    expect(result).toEqual(["users:create", "pos:cashier"]);
  });
});
