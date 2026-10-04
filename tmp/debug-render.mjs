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
  const page = await browser.newPage();

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

  await page.route("**/api/v1/users**", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: [{ id: "user-1", username: "superadmin" }],
    });
  });

  await page.goto(baseUrl + "/login");
  await page.waitForLoadState("domcontentloaded");

  await page.evaluate(() => {
    window.__rendered = document.documentElement.outerHTML.length;
    window.__hasForm = document.querySelector("form") !== null;
    window.__hasUsernameInput = document.querySelector('input[name="username"]') !== null;
    window.__hasPasswordInput = document.querySelector('input[name="password"]') !== null;
  });

  console.log(
    "after domcontentloaded:",
    await page.evaluate(() => ({
      renderedLen: window.__rendered,
      hasForm: window.__hasForm,
      hasUsernameInput: window.__hasUsernameInput,
      hasPasswordInput: window.__hasPasswordInput,
    })),
  );

  await page.evaluate(() => {
    window.location.reload();
  });

  await page.waitForLoadState("domcontentloaded");

  await page.evaluate(() => {
    window.__afterReload = {
      renderedLen: document.documentElement.outerHTML.length,
      hasForm: document.querySelector("form") !== null,
      hasUsernameInput: document.querySelector('input[name="username"]') !== null,
      hasPasswordInput: document.querySelector('input[name="password"]') !== null,
    };
  });

  console.log("after reload:", await page.evaluate(() => window.__afterReload));

  await browser.close();
})();
