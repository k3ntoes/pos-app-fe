import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];
  const networkErrors = [];

  page.on("console", (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  page.on("pageerror", (err) => {
    pageErrors.push({
      message: err.message,
      stack: err.stack,
    });
  });

  page.on("requestfailed", (request) => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure() ? request.failure().errorText : "Unknown",
      method: request.method(),
    });
  });

  try {
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0", timeout: 10000 });
  } catch (e) {
    console.log("Navigation error/timeout:", e.message);
  }

  // Wait a bit for any asynchronous errors / effects
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await browser.close();

  console.log(
    JSON.stringify(
      {
        consoleLogs,
        pageErrors,
        networkErrors,
      },
      null,
      2,
    ),
  );
})();
