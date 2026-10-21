import assert from "node:assert/strict";

// For future API products: seed synthetic users/tenants and inject ephemeral
// fixture tokens. Never target Production or use customer sessions.
export async function verifyAuthContract(base, cases, credentials = {}) {
  const origin = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname),
    "Only isolated loopback targets allowed",
  );
  assert.ok(
    !origin.username && !origin.password && !origin.search && !origin.hash,
  );
  const categories = new Set(cases.map((c) => c.category));
  for (const name of [
    "unauthenticated",
    "expired-token",
    "wrong-role",
    "cross-tenant",
    "ownership",
    "authorized",
  ])
    assert.ok(categories.has(name), `Missing auth contract: ${name}`);
  let executed = 0;
  for (const item of cases) {
    const target = new URL(item.path, origin);
    assert.equal(
      target.origin,
      origin.origin,
      "Cross-origin contract forbidden",
    );
    const denied = item.category !== "authorized";
    assert.ok(
      denied
        ? [401, 403, 404].includes(item.status)
        : item.status >= 200 && item.status < 300,
    );
    const headers = {};
    if (item.tokenRef) {
      assert.ok(
        credentials[item.tokenRef],
        "Missing synthetic fixture credential",
      );
      headers.Authorization = `Bearer ${credentials[item.tokenRef]}`;
    }
    const response = await fetch(target, {
      method: item.method || "GET",
      headers,
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(
      response.status,
      item.status,
      `${item.category} contract failed`,
    );
    executed++;
  }
  return executed;
}
