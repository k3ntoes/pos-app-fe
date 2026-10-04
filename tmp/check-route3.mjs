import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:5173";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const authUser = {
    id: "user-1",
    username: "superadmin",
    email: "superadmin@example.test",
    full_name: "Super Admin",
    name: "Super Admin",
    role: {
      id: "role-1",
      name: "Super Admin",
      code: "SUPER_ADMIN",
      permissions: ["users.view", "roles.view", "units.switch"],
      is_system: true,
    },
    must_change_password: false,
    status: "ACTIVE",
    is_super_admin: true,
    created_at: new Date().toISOString(),
  };

  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: authUser,
    });
  });

  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: {
        status: "ok",
        csrf_token: "mock-csrf",
        access_token: "mock-access",
        refresh_token: "mock-refresh",
        user: authUser,
      },
    });
  });

  await page.goto(baseUrl + "/login");
  await page.waitForLoadState("domcontentloaded");
  await page.setContent(await page.content(), { waitUntil: "domcontentloaded" });

  const h1 = await page
    .locator("h1")
    .first()
    .textContent()
    .catch(() => null);
  console.log("login h1 text", h1);

  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.waitFor({ state: "visible" });
  await usernameInput.fill("superadmin");

  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.waitFor({ state: "visible" });
  await passwordInput.fill("Admin123");

  await page.getByRole("button", { name: /login/i }).click();

  await page.waitForURL(/\/$/, { timeout: 20000 }).catch(() => {});
  console.log("after login url", page.url());

  const rolesUrl = baseUrl + "/roles";
  await page.goto(rolesUrl);
  await page.waitForLoadState("networkidle");
  const rolesH1 = await page
    .locator("h1")
    .first()
    .textContent()
    .catch(() => null);
  console.log("roles h1", rolesH1);

  await browser.close();
})();
