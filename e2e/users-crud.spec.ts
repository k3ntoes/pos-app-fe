import { expect, test } from "@playwright/test";

test("users list tampil setelah login", async ({ page }) => {
  await page.goto("/users");
  await expect(page).not.toHaveURL(/login/);
  await expect(page.getByRole("heading", { name: /manajemen pengguna/i })).toBeVisible();
});

test("bisa membuka halaman buat user baru", async ({ page }) => {
  await page.goto("/users/new");
  await expect(page).not.toHaveURL(/login/);
  await expect(page.getByRole("heading", { name: /tambah pengguna/i })).toBeVisible();
});

test("bisa membuka detail user", async ({ page }) => {
  await page.goto("/users");
  await expect(page).not.toHaveURL(/login/);
  const h1 = page.getByRole("heading", { name: /manajemen pengguna/i });
  await expect(h1).toBeVisible({ timeout: 20000 });
  const tableRows = page.getByRole("row");
  await tableRows.first().waitFor({ state: "visible", timeout: 20000 });
  await tableRows.first().getByRole("link").first().click();
  await expect(page).not.toHaveURL(/login/);
  await expect(page).not.toHaveURL(/users\/new/);
  await expect(page).toHaveURL(/users\/[^/]+$/);
});
