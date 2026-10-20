import aliases from "../lib/service-aliases.json" with { type: "json" };
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
const target = ".vercel/output";
await mkdir(target, { recursive: true });
await rm(`${target}/static`, { recursive: true, force: true });
await cp("out", `${target}/static`, { recursive: true });
for (const name of ["_headers", "security-headers.json"])
  await rm(`${target}/static/${name}`, { force: true });
const headers = JSON.parse(await readFile("out/security-headers.json", "utf8"));
const routes = [
  { src: "/.*", headers, continue: true },
  {
    src: "/.*",
    methods: ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    status: 405,
    headers: { Allow: "GET, HEAD" },
  },
  {
    src: "/_next/static/.*",
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    continue: true,
  },
];
async function indexRoutes(dir = "out") {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) await indexRoutes(path.join(dir, e.name));
    else if (e.name === "index.html") {
      const relative = path.relative("out", dir).split(path.sep).join("/");
      if (relative === "_not-found" || relative === "404") continue;
      const url = relative ? `/${relative}/` : "/";
      if (relative)
        routes.push({
          src: `/${relative}`,
          status: 308,
          headers: { Location: url },
        });
      routes.push({ src: url, dest: `${url}index.html` });
    }
  }
}
for (const locale of ["ar", "en"])
  for (const [from, to] of Object.entries(aliases))
    routes.push({
      src: `/${locale}/services/${from}/?`,
      status: 308,
      headers: { Location: `/${locale}/services/${to}/` },
    });
await indexRoutes();
routes.push(
  { handle: "filesystem" },
  { src: "/.*", dest: "/404.html", status: 404 },
);
const config = { version: 3, routes };
await writeFile(
  `${target}/config.json`,
  JSON.stringify(config, null, 2) + "\n",
);
console.log(
  `Vercel Build Output API v3: ${routes.length} routing entries with generated CSP.`,
);
