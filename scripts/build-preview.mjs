import { spawnSync, execFileSync } from "node:child_process";
const target = process.env.VERCEL_ENV;
if (target === "production")
  throw new Error(
    "Production deployment is disabled. Only an authorized Preview build is allowed.",
  );
const branch =
  process.env.VERCEL_GIT_COMMIT_REF ||
  execFileSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).trim();
if (!branch || ["main", "master"].includes(branch))
  throw new Error("Preview requires a separate development branch.");
console.log(`Preparing Preview from development branch: ${branch}`);
const result = spawnSync("npm", ["run", "build:vercel"], {
  stdio: "inherit",
  env: process.env,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
