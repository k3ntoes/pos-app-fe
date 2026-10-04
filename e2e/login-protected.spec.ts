import { expect, test } from "@playwright/test";

test("akses halaman terproteksi tanpa auth mengarah ke /login", async ({ page }) => {
  await page.goto("/users");
  await expect(page).toHaveURL(/\/login/);
});

test("setelah login bisa akses halaman berproteksi", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await expect(page).toHaveURL(/\//);
});
