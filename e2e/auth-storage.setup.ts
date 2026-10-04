import { test as setup } from "@playwright/test";

setup("authenticate sebagai admin", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/\//);
  await page.context().storageState({ path: "auth-storage.json" });
});
