import assert from "node:assert/strict";

export function validateStaticHeaders(headers, { https = false } = {}) {
  const csp = headers.get("content-security-policy") || "";
  const directives = new Map(
    csp.split(";").map((d) => {
      const [name, ...values] = d.trim().split(/\s+/);
      return [name, values];
    }),
  );
  for (const key of [
    "default-src",
    "object-src",
    "base-uri",
    "frame-ancestors",
    "form-action",
  ])
    assert.deepEqual(directives.get(key), ["'none'"], key);
  const script = directives.get("script-src") || [];
  assert.ok(script.includes("'self'"), "script self missing");
  assert.ok(
    script.some((v) => /^'sha256-[A-Za-z0-9+/]{43}='$/.test(v)),
    "hashed inline policy missing",
  );
  assert.ok(
    script.every(
      (v) => v === "'self'" || /^'sha256-[A-Za-z0-9+/]{43}='$/.test(v),
    ),
    "unapproved script source",
  );
  assert.deepEqual(directives.get("connect-src"), ["'self'"]);
  assert.deepEqual(directives.get("font-src"), ["'self'"]);
  if (https) assert.ok(directives.has("upgrade-insecure-requests"));
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(
    headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(headers.get("cross-origin-opener-policy"), "same-origin");
  const hsts = headers.get("strict-transport-security") || "";
  assert.ok(
    Number(hsts.match(/(?:^|;)\s*max-age=(\d+)/i)?.[1]) >= 31536000,
    "HSTS lifetime too short",
  );
  const permissions = headers.get("permissions-policy") || "";
  for (const feature of [
    "camera",
    "microphone",
    "geolocation",
    "payment",
    "usb",
  ])
    assert.ok(permissions.includes(`${feature}=()`), `permission ${feature}`);
  assert.ok(headers.get("x-robots-tag")?.includes("noindex"));
  assert.equal(
    headers.get("set-cookie"),
    null,
    "static app must not issue cookies",
  );
  assert.equal(headers.get("x-powered-by"), null);
}

// Reusable stateful-project contract; NOT evidence of an existing app session.
export function validateSessionCookie(cookie) {
  const attributes = cookie
    .split(";")
    .slice(1)
    .map((v) => v.trim().toLowerCase());
  assert.ok(attributes.includes("secure"), "Secure required");
  assert.ok(attributes.includes("httponly"), "HttpOnly required");
  assert.ok(
    attributes.some((v) => v === "samesite=lax" || v === "samesite=strict"),
    "reviewed SameSite required",
  );
  if (cookie.startsWith("__Host-")) {
    assert.ok(attributes.includes("path=/"));
    assert.ok(!attributes.some((v) => v.startsWith("domain=")));
  }
}
