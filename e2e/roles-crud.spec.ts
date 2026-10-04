import { expect, test } from "@playwright/test";

test("roles list tampil setelah login", async ({ page }) => {
  await page.goto("/roles");
  await expect(page).not.toHaveURL(/login/);
  await expect(page.getByRole("heading", { name: /manajemen roles/i })).toBeVisible();
});

test("bisa membuka halaman buat role baru", async ({ page }) => {
  await page.goto("/roles/new");
  await expect(page).not.toHaveURL(/login/);
  await expect(page.getByRole("heading", { name: /tambah role/i })).toBeVisible();
});

test("bisa membuka detail role", async ({ page }) => {
  await page.goto("/roles");
  await expect(page).not.toHaveURL(/login/);
  const h1 = page.getByRole("heading", { name: /manajemen roles/i });
  await expect(h1).toBeVisible({ timeout: 20000 });
  const tableRows = page.getByRole("row");
  await tableRows.first().waitFor({ state: "visible", timeout: 20000 });
  await tableRows.first().getByRole("link").first().click();
  await expect(page).not.toHaveURL(/login/);
  await expect(page).not.toHaveURL(/roles\/new/);
  await expect(page).toHaveURL(/roles\/[^/]+$/);
});
