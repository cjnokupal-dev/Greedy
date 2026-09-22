// GREEDY — dev auto-login (localhost only)
// Only runs when the page is served from localhost/127.0.0.1.
// In production (real domain), this is a no-op.

const DEV_USER = "cj";
const DEV_PASS = "rus";

function isLocalhost() {
  const h = location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local");
}

export async function autoLogin() {
  if (!isLocalhost()) {
    return { ok: false, error: "not_local" };
  }

  const { Cloud } = await import("./cloud.js");

  try {
    let r = await Cloud.login(DEV_USER, DEV_PASS);
    if (r.ok) {
      console.log("[autoLogin] dev login as", DEV_USER);
      return r;
    }

    r = await Cloud.register(DEV_USER, DEV_PASS);
    if (r.ok) {
      console.log("[autoLogin] dev register + login");
      return r;
    }

    return r;
  } catch (e) {
    return { error: "network" };
  }
}
