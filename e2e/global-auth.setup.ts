import { test as setup } from "@playwright/test";

setup("mock backend API dan login pakai fetch manual", async ({ page, request }) => {
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
      permissions: [
        "users.view",
        "users.create",
        "users.edit",
        "users.delete",
        "roles.view",
        "roles.create",
        "roles.edit",
        "roles.delete",
        "inventory.view",
        "inventory.manage",
        "sales.pos",
        "sales.refund",
        "reports.view",
        "settings.store",
        "units.switch",
        "audit.view",
      ],
      is_system: true,
    },
    must_change_password: false,
    status: "ACTIVE",
    is_super_admin: true,
    created_at: new Date().toISOString(),
  };

  // Mock API ini pakai route halaman, bukan request context
  page.route("**/api/v1/auth/login", async (route) => {
    const body = await route
      .request()
      .postDataJSON()
      .catch(() => ({}));
    if (body?.username === "superadmin" && body?.password === "Admin123") {
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
    } else {
      await route.fulfill({
        status: 401,
        headers: { "Content-Type": "application/json" },
        json: { type: "UnauthorizedError", code: "HTTP_401", message: "Invalid credentials" },
      });
    }
  });

  page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: authUser,
    });
  });

  page.route("**/api/v1/roles*", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        json: [
          {
            id: "role-1",
            name: "Super Admin",
            code: "SUPER_ADMIN",
            description: "Role sistem utama",
            assigned_users_count: 1,
            permissions: ["users.view", "roles.view"],
            is_system: true,
          },
          {
            id: "role-2",
            name: "Kasir",
            code: "CASHIER",
            description: "Role kasir",
            assigned_users_count: 0,
            permissions: ["sales.pos"],
            is_system: false,
          },
        ],
      });
    } else {
      await route.fulfill({
        status: 405,
        headers: { "Content-Type": "application/json" },
        json: { type: "MethodNotAllowed", code: "HTTP_405", message: "Method not allowed" },
      });
    }
  });

  page.route("**/api/v1/users*", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        json: [
          {
            id: "user-1",
            username: "superadmin",
            email: "superadmin@example.test",
            full_name: "Super Admin",
            status: "ACTIVE",
            role: { id: "role-1", name: "Super Admin" },
          },
        ],
      });
    } else {
      await route.fulfill({
        status: 405,
        headers: { "Content-Type": "application/json" },
        json: { type: "MethodNotAllowed", code: "HTTP_405", message: "Method not allowed" },
      });
    }
  });

  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");
  await page.locator('input[name="username"]').waitFor({ state: "visible" });
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').waitFor({ state: "visible" });
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/[/]$/, { timeout: 20000 }).catch(() => {});

  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");

  await request.get("http://localhost:5173/");
  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");

  await page.locator('input[name="username"]').waitFor({ state: "visible" });
  await page.locator('input[name="username"]').fill("superadmin");
  await page.locator('input[name="password"]').waitFor({ state: "visible" });
  await page.locator('input[name="password"]').fill("Admin123");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/[\/]$/, { timeout: 20000 }).catch(() => {});
});
