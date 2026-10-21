import assert from "node:assert/strict";
import { validateStaticHeaders } from "../security/headers.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const origin = "http://127.0.0.1:3000";
const results = [];
const tests = [
  ["/en/services/__proto__/", 404],
  ["/en/services/constructor/", 404],
  ["/ar/services/toString/", 404],
  ["/en/quote/", 200],
  ["/ar/quote/?service=websites", 200],
  ["/en/quote/?service=__proto__&next=https://attacker.invalid", 200],
  ["/en/quote/?service=%3Cimg%20src=x%20onerror=alert(1)%3E", 200],
  ["/", 200],
  ["/ar/", 200],
  ["/en/services/websites/", 200],
  ["/en/missing/", 404],
  ["/.env", 404],
  ["/.env.local", 404],
  ["/.git/config", 404],
  ["/package.json", 404],
  ["/next.config.ts", 404],
  ["/security-headers.json", 404],
  ["/_headers", 404],
  ["/api/contact", 404],
  ["/api/auth", 404],
  ["/%2eenv", 404],
  ["/%5c..%5c.env", 404],
  ["/en/%3Cscript%3Ealert(1)%3C/script%3E/", 404],
  ["/en/%E0%A4%A/", 400],
  ["/en/?q=%3Cimg%20src=x%20onerror=alert(1)%3E", 200],
  ["/en/?next=https://attacker.invalid", 200],
];
for (const [url, status] of tests) {
  const response = await fetch(origin + url, { redirect: "manual" });
  const body = await response.text();
  validateStaticHeaders(response.headers);
  assert.equal(response.status, status, url);
  for (const header of [
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "permissions-policy",
    "referrer-policy",
    "cross-origin-opener-policy",
    "strict-transport-security",
  ])
    assert.ok(response.headers.get(header), `${url}: missing ${header}`);
  const csp = response.headers.get("content-security-policy");
  assert.match(csp, /script-src 'self' 'sha256-/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.match(csp, /form-action 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.ok(!response.headers.has("x-powered-by"));
  assert.ok(!response.headers.has("set-cookie"));
  assert.ok(!response.headers.has("location"));
  assert.ok(!body.includes("<img src=x onerror=alert(1)>"));
  assert.ok(!body.includes("Error: ENOENT"));
  assert.ok(!body.includes("node_modules/"));
  results.push({ url, status: response.status, passed: true });
}
for (const method of ["POST", "PUT", "DELETE", "PATCH", "OPTIONS"]) {
  const r = await fetch(origin + "/ar/contact/", {
    method,
    body: method === "OPTIONS" ? undefined : "malicious submission",
  });
  assert.equal(r.status, 405);
  assert.equal(r.headers.get("allow"), "GET, HEAD");
  results.push({ method, status: r.status, passed: true });
}
const head = await fetch(origin + "/en/", { method: "HEAD" });
assert.equal(head.status, 200);
assert.equal((await head.text()).length, 0);
results.push({ method: "HEAD", status: 200, passed: true });
const redirect = await fetch(
  origin + "/en/services?next=https://attacker.invalid",
  { redirect: "manual" },
);
assert.equal(redirect.status, 308);
assert.equal(
  redirect.headers.get("location"),
  "/en/services/?next=https://attacker.invalid",
);
results.push({ redirect: "same-origin trailing slash", passed: true });
await mkdir("artifacts", { recursive: true });
await writeFile(
  "artifacts/dynamic-security.json",
  JSON.stringify(
    {
      tool: "Focused Node.js HTTP assertions (not OWASP ZAP)",
      timestamp: new Date().toISOString(),
      origin,
      results,
    },
    null,
    2,
  ),
);
console.log(`${results.length} focused dynamic security checks passed.`);
