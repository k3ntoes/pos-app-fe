import { expect, test } from "@playwright/test";

test("halaman users bisa diakses setelah login", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.goto("/users");
  await expect(page).not.toHaveURL(/login/);
});

test("halaman create user bisa diakses setelah login", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.goto("/users/create");
  await expect(page).not.toHaveURL(/login/);
});
