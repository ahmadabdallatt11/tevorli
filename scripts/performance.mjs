import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
try {
  for (const locale of ["ar", "en"])
    for (const formFactor of ["mobile", "desktop"]) {
      const report = await lighthouse(
        `http://127.0.0.1:3000/${locale}/`,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
        },
        formFactor === "desktop" ? desktopConfig : undefined,
      );
      const lhr = report.lhr;
      if (lhr.configSettings.formFactor !== formFactor) {
        throw new Error(
          `Unexpected Lighthouse profile: ${lhr.configSettings.formFactor}`,
        );
      }
      await writeFile(
        `artifacts/lighthouse-${locale}-${formFactor}.json`,
        report.report,
      );
      const scores = Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      );
      results.push({
        locale,
        formFactor,
        scores,
        lcp: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        failedAudits: Object.values(lhr.audits)
          .filter(
            (a) =>
              a.score !== null &&
              a.score < 1 &&
              a.scoreDisplayMode !== "informative",
          )
          .map((a) => ({ id: a.id, title: a.title, score: a.score })),
      });
    }
} finally {
  await chrome.kill();
}
await writeFile(
  "artifacts/performance-summary.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (
  results.some((r) => r.scores.performance < 90 || r.scores.accessibility < 95)
)
  process.exitCode = 1;
