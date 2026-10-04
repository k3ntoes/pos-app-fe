import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:5173";
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

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

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

  await page.route("**/api/v1/roles**", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: [{ id: "role-1", name: "Super Admin", is_system: true }],
    });
  });

  await page.goto(baseUrl + "/login");
  await page.waitForLoadState("domcontentloaded");

  const h1 = await page
    .locator("h1")
    .first()
    .textContent()
    .catch(() => null);
  console.log("h1 after domcontentloaded:", h1);

  const inputs = await page.locator("input").all();
  console.log("input count after domcontentloaded:", inputs.length);

  await page.screenshot({ path: "tmp/login-after-domcontentloaded.png" }).catch(() => {});

  await page.setContent(await page.content(), { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("domcontentloaded");

  const h1After = await page
    .locator("h1")
    .first()
    .textContent()
    .catch(() => null);
  console.log("h1 after setContent domcontentloaded:", h1After);

  const inputsAfter = await page.locator("input").all();
  console.log("input count after setContent domcontentloaded:", inputsAfter.length);

  await page.screenshot({ path: "tmp/login-after-setcontent.png" }).catch(() => {});

  await browser.close();
})();
