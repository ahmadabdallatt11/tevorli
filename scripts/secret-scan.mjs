import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const skip = new Set([
  ".git",
  ".vercel",
  "node_modules",
  ".next",
  "out",
  "artifacts",
  "test-results",
  "playwright-report",
]);
const includeExport = process.argv.includes("--include-export");
if (includeExport) skip.delete("out");
const patterns = [
  ["Private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{50,}\b/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  [
    "API secret assignment",
    /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][A-Za-z0-9_+/-]{24,}["']/i,
  ],
];
let scanned = 0;
const findings = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(e.name) || e.name === "package-lock.json") continue;
    const file = path.join(dir, e.name);
    if (e.isDirectory()) await walk(file);
    else if (e.isFile()) {
      if (
        !/\.(?:[cm]?js|jsx|ts|tsx|json|html|css|svg|txt|md|xml)$/i.test(
          e.name,
        ) &&
        !e.name.startsWith(".") &&
        e.name !== "LICENSE"
      )
        continue;
      scanned++;
      const text = await readFile(file, "utf8");
      for (const [rule, re] of patterns)
        if (re.test(text)) findings.push({ file, rule });
    }
  }
}
await walk(".");
await mkdir("artifacts", { recursive: true });
await writeFile(
  "artifacts/secret-scan.json",
  JSON.stringify(
    {
      tool: "Local pattern-based scan; no history/entropy scan",
      scope: includeExport
        ? "source and static export text files"
        : "source text files",
      scanned,
      findings,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ scanned, findings }));
if (findings.length) process.exitCode = 1;
