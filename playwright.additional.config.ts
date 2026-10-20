import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";
const browser = process.env.TEST_BROWSER ?? "firefox";
if (browser !== "firefox" && browser !== "webkit")
  throw new Error("TEST_BROWSER must be firefox or webkit.");
export default defineConfig({
  ...base,
  outputDir: `test-results/${browser}`,
  reporter: [
    ["list"],
    ["json", { outputFile: `artifacts/playwright-${browser}.json` }],
  ],
  projects: [
    {
      name: `${browser}-desktop`,
      use: devices[
        browser === "firefox" ? "Desktop Firefox" : "Desktop Safari"
      ],
    },
  ],
});
