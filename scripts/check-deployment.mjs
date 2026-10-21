import { validateStaticHeaders } from "../security/headers.mjs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { readFile, access, mkdir, writeFile } from "node:fs/promises";
const config = JSON.parse(await readFile(".vercel/output/config.json", "utf8"));
const headers = JSON.parse(await readFile("out/security-headers.json", "utf8"));
assert.equal(config.version, 3);
validateStaticHeaders(new Headers(headers), { https: true });
assert.equal(headers["X-Robots-Tag"], "noindex, nofollow, noarchive");
assert.deepEqual(config.routes[0].headers, headers);
for (const locale of ["ar", "en"]) {
  for (const slug of [
    "",
    "services",
    "services/websites",
    "services/digital-menus",
    "services/qr-solutions",
    "services/business-cards",
    "services/catalogs",
    "work",
    "about",
    "contact",
    "quote",
    "privacy",
    "terms",
  ]) {
    const src = `/${locale}/${slug ? `${slug}/` : ""}`;
    const route = config.routes.find((r) => r.src === src);
    assert.ok(route, src);
    await access(`.vercel/output/static${route.dest}`);
  }
}
assert.equal(config.routes.at(-1).status, 404);
assert.equal(config.routes.at(-1).dest, "/404.html");
assert.ok(
  config.routes.some((r) => r.status === 405 && r.methods.includes("POST")),
);
await assert.rejects(access(".vercel/output/static/security-headers.json"));
await assert.rejects(access(".vercel/output/static/_headers"));
await mkdir("artifacts", { recursive: true });
await writeFile(
  "artifacts/deployment-check.json",
  JSON.stringify(
    {
      passed: true,
      scope:
        "Local Vercel Build Output API v3 manifest and filesystem; not a remote deployment",
      localizedPages: 26,
      routingEntries: config.routes.length,
      cspBytes: Buffer.byteLength(headers["Content-Security-Policy"]),
    },
    null,
    2,
  ),
);
console.log(
  "Vercel manifest, 26 localized routes, root, 404, method guard and security headers verified locally.",
);

const approvedAssets = JSON.parse(
  await readFile("docs/brand-assets.sha256.json", "utf8"),
);
for (const [name, expected] of Object.entries(approvedAssets)) {
  for (const root of ["public", ".vercel/output/static"]) {
    const actual = createHash("sha256")
      .update(await readFile(`${root}/${name}`))
      .digest("hex");
    assert.equal(
      actual,
      expected,
      `Approved brand asset changed: ${root}/${name}`,
    );
  }
}
console.log(
  `${Object.keys(approvedAssets).length} approved brand assets match the supplied files in source and deployment output.`,
);
