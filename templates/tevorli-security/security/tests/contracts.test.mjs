import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { validateStaticHeaders, validateSessionCookie } from "../headers.mjs";
import { verifyAuthContract } from "../auth-contract.mjs";

const valid = new Headers({
  "Content-Security-Policy":
    "default-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; script-src 'self' 'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='; connect-src 'self'; font-src 'self'; upgrade-insecure-requests",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "X-Robots-Tag": "noindex",
});

test("static policy accepts the intended boundary", () =>
  validateStaticHeaders(valid, { https: true }));
for (const mutation of [
  "unsafe-inline",
  "unsafe-eval",
  "https://attacker.invalid",
  "*",
])
  test(`weak script policy fails: ${mutation}`, () => {
    const headers = new Headers(valid);
    headers.set(
      "Content-Security-Policy",
      headers
        .get("Content-Security-Policy")
        .replace("script-src 'self'", `script-src 'self' ${mutation}`),
    );
    assert.throws(() => validateStaticHeaders(headers));
  });
for (const field of [
  "x-content-type-options",
  "x-frame-options",
  "strict-transport-security",
  "permissions-policy",
  "x-robots-tag",
])
  test(`missing header fails: ${field}`, () => {
    const headers = new Headers(valid);
    headers.delete(field);
    assert.throws(() => validateStaticHeaders(headers));
  });
test("unexpected static cookies fail", () => {
  const headers = new Headers(valid);
  headers.set("set-cookie", "fixture=value");
  assert.throws(() => validateStaticHeaders(headers));
});
test("stateful cookie contract rejects insecure flags", () => {
  validateSessionCookie(
    "__Host-session=fixture; Path=/; Secure; HttpOnly; SameSite=Lax",
  );
  for (const cookie of [
    "session=fixture",
    "session=fixture; Secure; SameSite=Lax",
    "session=fixture; HttpOnly; SameSite=Lax",
    "session=fixture; Secure; HttpOnly; SameSite=None",
    "__Host-session=fixture; Secure; HttpOnly; SameSite=Lax; Path=/; Domain=example.test",
  ])
    assert.throws(() => validateSessionCookie(cookie));
});
test("static auth/API exemption cannot silently survive adding endpoints", async () => {
  const profile = JSON.parse(await readFile("security/project.json", "utf8"));
  assert.equal(
    profile.architecture,
    "static-export",
    "Adapt profile and real server authorization tests before introducing APIs",
  );
  assert.equal(profile.application_auth, false);
  assert.equal(profile.api, false);
  assert.equal(profile.database, false);
  for (const root of ["app", "pages/api"]) {
    let files = [];
    try {
      files = await readdir(root, { recursive: true });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    assert.ok(
      !files.some((name) => /(?:^|\/)route\.[jt]s$/.test(name)),
      "New API requires security profile and authorization review",
    );
    if (root === "pages/api") assert.equal(files.length, 0);
  }
});

test("reusable auth harness executes deny/allow cases and detects bypass", async () => {
  const categories = [
    "unauthenticated",
    "expired-token",
    "wrong-role",
    "cross-tenant",
    "ownership",
    "authorized",
  ];
  let bypass = false;
  const server = createServer((req, res) => {
    res.writeHead(bypass ? 200 : req.url === "/authorized" ? 200 : 403);
    res.end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const cases = categories.map((category) => ({
    category,
    path: `/${category}`,
    status: category === "authorized" ? 200 : 403,
  }));
  try {
    assert.equal(await verifyAuthContract(base, cases), 6);
    bypass = true;
    await assert.rejects(verifyAuthContract(base, cases));
    await assert.rejects(verifyAuthContract("https://example.com", cases));
    await assert.rejects(verifyAuthContract(base, cases.slice(1)));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
