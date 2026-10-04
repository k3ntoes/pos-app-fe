import { expect, test } from "@playwright/test";

test("halaman utama redirect ke login jika belum auth", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test("halaman login bisa diakses", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
});

test("login gagal dengan kredensial salah", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("salah");
  await page.getByRole("button", { name: /login/i }).click();
  await expect(page).toHaveURL(/\/login/);
});
