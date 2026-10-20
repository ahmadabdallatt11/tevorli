import { readdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const root = path.resolve("out");
export async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const lists = await Promise.all(
    entries.map((e) =>
      e.isDirectory()
        ? filesUnder(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    ),
  );
  return lists.flat();
}
// Root is a static copy of Arabic home. All navigation uses explicit locale paths.
await copyFile(path.join(root, "ar/index.html"), path.join(root, "index.html"));
const files = await filesUnder(root);
const hashes = new Set();
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    if (!/\bsrc\s*=/.test(match[1]))
      hashes.add(
        `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
      );
  }
}
const csp = [
  "default-src 'none'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");
const headers = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};
await writeFile(
  path.join(root, "security-headers.json"),
  JSON.stringify(headers, null, 2) + "\n",
);
await writeFile(
  path.join(root, "_headers"),
  "/*\n" +
    Object.entries(headers)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n") +
    "\n",
);
const origin = process.env.NEXT_PUBLIC_SITE_URL;
if (origin) {
  const pages = files.filter(
    (f) => f.endsWith("/index.html") && /\/(ar|en)\//.test(f),
  );
  const urls = pages.map(
    (f) =>
      `${origin.replace(/\/$/, "")}/${path.relative(root, path.dirname(f)).split(path.sep).join("/")}/`,
  );
  await writeFile(
    path.join(root, "sitemap.xml"),
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls
        .map(
          (url) =>
            `<url><loc>${url.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url>`,
        )
        .join("") +
      "</urlset>",
  );
}
await writeFile(path.join(root, "robots.txt"), "User-agent: *\nDisallow: /\n");
const size = Buffer.byteLength(csp);
console.log(
  `Exported security policy: ${hashes.size} inline hashes, ${size} bytes. Root: Arabic. Sitemap: ${Boolean(origin)}.`,
);
if (size > 16000)
  throw new Error(
    "CSP exceeds conservative 16 KB single-header budget. Review deployment limits.",
  );
