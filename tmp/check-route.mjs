import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:5173";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: { status: "ok", csrf_token: "t", user: { id: "u1" } },
    });
  });

  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: { id: "u1", username: "superadmin" },
    });
  });

  await page.goto(baseUrl + "/login");
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();

  try {
    await page.waitForURL(/\//, { timeout: 20000 });
    console.log("after login url", page.url());
  } catch (e) {
    console.log("waitForURL failed", e.message.slice(0, 300));
  }

  console.log("page url finally", page.url());
  console.log("title", await page.title());

  await browser.close();
})();
