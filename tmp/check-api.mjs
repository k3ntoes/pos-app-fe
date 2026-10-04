const base = "http://localhost:8001/api/v1";

async function go() {
  console.log("base", base);
  let loginResp, meResp;
  try {
    loginResp = await fetch(base + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "superadmin", password: "Admin123" }),
    });
  } catch (e) {
    loginResp = e;
  }
  try {
    meResp = await fetch(base + "/auth/me");
  } catch (e) {
    meResp = e;
  }

  const loginStatus =
    loginResp instanceof Response
      ? {
          status: loginResp.status,
          ok: loginResp.ok,
          body: await loginResp.text().catch(() => null),
        }
      : loginResp;

  const meStatus =
    meResp instanceof Response
      ? { status: meResp.status, ok: meResp.ok, body: await meResp.text().catch(() => null) }
      : meResp;

  console.log(JSON.stringify({ loginStatus, meStatus }, null, 2));
}

go().catch((e) => console.error(e));
