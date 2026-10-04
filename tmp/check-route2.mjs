import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:5173";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiCalls = [];
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/api/v1/auth/login") || url.includes("/auth/me")) {
      apiCalls.push({ type: "request", url, method: req.method(), time: Date.now() });
    }
  });
  page.on("response", (res) => {
    const url = res.url();
    if (url.includes("/api/v1/auth/login") || url.includes("/auth/me")) {
      apiCalls.push({ type: "response", url, status: res.status(), time: Date.now() });
    }
  });

  await page.route("**/api/v1/auth/login", async (route) => {
    apiCalls.push({ type: "route-login-intercepted", time: Date.now() });
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: { status: "ok", csrf_token: "t", user: { id: "u1" } },
    });
  });

  await page.route("**/auth/me", async (route) => {
    apiCalls.push({ type: "route-me-intercepted", time: Date.now() });
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      json: { id: "u1", username: "superadmin" },
    });
  });

  await page.goto(baseUrl + "/login");
  console.log("after goto login url", page.url());

  const inputs = await page.locator("input").all();
  console.log("input count", inputs.length);
  for (const el of inputs) {
    console.log("input name", await el.getAttribute("name"), "type", await el.getAttribute("type"));
  }

  await browser.close();
  console.log("api calls", JSON.stringify(apiCalls, null, 2));
})();
