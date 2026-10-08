import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "./format";

describe("format helpers", () => {
  describe("formatDate", () => {
    it("formats valid ISO date string correctly", () => {
      const formatted = formatDate("2026-10-01T00:00:00Z");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Oktober");
    });

    it("formats Date object correctly", () => {
      const date = new Date(2026, 9, 15);
      const formatted = formatDate(date);
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Oktober");
    });

    it("handles null, undefined, or invalid date gracefully", () => {
      expect(formatDate(null)).toBe("-");
      expect(formatDate(undefined)).toBe("-");
      expect(formatDate("invalid-date")).toBe("-");
    });
  });

  describe("formatCurrency", () => {
    it("formats number to IDR currency correctly", () => {
      const formatted = formatCurrency(150000);
      expect(formatted).toContain("150.000");
    });

    it("handles zero or invalid number gracefully", () => {
      expect(formatCurrency(0)).toContain("0");
      expect(formatCurrency(Number.NaN)).toBe("Rp 0");
    });
  });
});
