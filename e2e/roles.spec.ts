import { expect, test } from "@playwright/test";

test("halaman roles bisa diakses setelah login", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').fill("password123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.goto("/roles");
  // Jika tidak terproteksi berarti halaman bisa diakses
  await expect(page).not.toHaveURL(/login/);
});
