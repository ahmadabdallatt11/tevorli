import aliases from "../lib/service-aliases.json" with { type: "json" };
import http from "node:http";
import { gzipSync } from "node:zlib";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const headers = JSON.parse(
  await readFile(path.join(root, "security-headers.json"), "utf8"),
);
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
};
const privateNames = new Set(["_headers", "security-headers.json"]);
const server = http.createServer(async (req, res) => {
  const security = { ...headers };
  if (process.env.NODE_ENV !== "production")
    security["Content-Security-Policy"] = security[
      "Content-Security-Policy"
    ].replace("; upgrade-insecure-requests", "");
  res.setHeader("Content-Security-Policy", security["Content-Security-Policy"]);
  for (const [key, value] of Object.entries(security))
    res.setHeader(key, value);
  res.setHeader("Cache-Control", "no-cache");
  if (!["GET", "HEAD"].includes(req.method || "")) {
    res.writeHead(405, {
      Allow: "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(req.method === "HEAD" ? "" : "Method not allowed");
    return;
  }
  try {
    const url = new URL(req.url, "http://static.invalid");
    let pathname = decodeURIComponent(url.pathname);
    const alias = pathname.match(/^\/(ar|en)\/services\/([^/]+)\/?$/);
    if (alias && Object.hasOwn(aliases, alias[2])) {
      res.writeHead(308, {
        Location: `/${alias[1]}/services/${aliases[alias[2]]}/`,
      });
      res.end();
      return;
    }
    const segments = pathname.split("/");
    if (
      segments.some((s) => s.startsWith(".") || s.includes("\\")) ||
      privateNames.has(segments.at(-1))
    ) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        req.method === "HEAD"
          ? ""
          : await readFile(path.join(root, "404.html")),
      );
      return;
    }
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}${path.sep}`) && file !== root) {
      res.writeHead(404);
      res.end();
      return;
    }
    let info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        res.writeHead(308, {
          Location: pathname.replace(/^\/+/, "/") + "/" + url.search,
        });
        res.end();
        return;
      }
      file = path.join(file, "index.html");
      info = await stat(file);
    }
    if (!info.isFile()) throw new Error("Not a file");
    let body = await readFile(file);
    if (
      body.length > 1024 &&
      /\bgzip\b/.test(req.headers["accept-encoding"] || "") &&
      [".html", ".css", ".js", ".json", ".txt", ".svg", ".xml"].includes(
        path.extname(file),
      )
    ) {
      body = gzipSync(body);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Content-Length": body.length,
      ...(pathname.startsWith("/_next/static/")
        ? { "Cache-Control": "public, max-age=31536000, immutable" }
        : {}),
    });
    res.end(req.method === "HEAD" ? "" : body);
  } catch (error) {
    if (error instanceof URIError) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad request");
      return;
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      req.method === "HEAD" ? "" : await readFile(path.join(root, "404.html")),
    );
  }
});
server.requestTimeout = 10000;
server.headersTimeout = 10000;
server.maxHeadersCount = 60;
server.keepAliveTimeout = 5000;
server.listen(port, "0.0.0.0", () =>
  console.log(`TEVORLI static server listening on ${port}`),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => server.close(() => process.exit(0)));
