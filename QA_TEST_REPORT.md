# TEVORLI — Preview QA report

Date: 2026-10-20. Tested target: current **local static export**. Requested hosted target: **protected Vercel Preview**, currently blocked by Vercel authentication/network access. No remote URL or protection result exists; no Production deploy, custom domain purchase, paid service or outgoing message was performed.

## Changes verified

- Official public email and Instagram in contact/footer and communication controls; mailto destination, Instagram new-tab navigation with noopener/noreferrer, no phone/WhatsApp, and no backend form.
- Five owner-approved standalone service groups; Request a Quote; security/privacy included without additional charges or absolute guarantees. Internal shop-system integrations are explicitly excluded.
- Supplied navy/blue/sky/white palette and local Inter/Cairo fonts. No alternate logo/T was invented. The uploaded Brand Kit ZIP exceeds the tool's 32 MiB transfer limit and could not be downloaded or inspected; direct original SVG/PNG assets or a smaller archive are required for logo integration.
- Arabic RTL/English LTR, root/service language switching, responsive mobile/tablet/desktop layouts, working internal links and quote-to-contact journeys.
- Old service URLs redirect to the grouped canonical pages, including safe rejection of inherited object-property names in local alias handling.
- Preview noindex metadata, X-Robots-Tag and robots disallow. Optional public origin cannot enable indexing. Vercel build guard refuses Production and main/master.

## Environment and commands

Node 24.19.0, npm 11.9.0, Next 16.4.2, React 19.3.1, TypeScript 6.0.3, ESLint 10.13.0, Vitest 5.0.5, Playwright 1.64.1, axe Playwright 4.14.0, Lighthouse 13.5.0. Versions/lockfile remain pinned.

```sh
npm run build:preview
npm run test:deployment
npm run lint
npm run typecheck
npm test -- --reporter=json --outputFile=artifacts/vitest.json
npm audit --json > artifacts/npm-audit.json
npm run test:secrets
npm start
# Matching static export, only one browser invocation at a time:
npm run test:security
npm run test:e2e
npm run test:performance
```

No existing assertions were disabled or validation bypassed. The second review fixed a local alias own-property edge case and reran the relevant HTTP, browser and SAST checks. Lighthouse measured the same unchanged static application build; the final server fix only restricts invalid alias names, not rendering, CSS/JS delivery or compression.

## Final local results

| Check                                     | Result                                                     |
| ----------------------------------------- | ---------------------------------------------------------- |
| Production static build (`build:preview`) | PASS                                                       |
| TypeScript / ESLint                       | PASS / PASS                                                |
| Vitest                                    | 4 passed, 0 failed                                         |
| Playwright                                | 36 passed, 0 failed, 0 skipped; 3 Chromium profiles        |
| Accessibility                             | 72 localized page scans; no configured A/AA violations     |
| HTTP security assertions                  | 29 passed, including 3 invalid alias-name regressions      |
| Dependency audit                          | 0 reported vulnerabilities across installed dependencies   |
| Semgrep                                   | 29 reviewed findings; 0 scan errors; 203 rules, 42 targets |
| Source secret signatures                  | No findings; limited scope                                 |
| Vercel output manifest                    | PASS locally; hosted verification NOT RUN                  |
| Production/main/master guard              | 3 expected rejections verified                             |

Browser run (UTC): 2026-10-20T13:40:01.331Z; 68.3 seconds. Counts come from this completed run.

### Local Lighthouse

| Locale | Profile | Performance | Accessibility | Best practices | SEO | LCP ms | CLS    |
| ------ | ------- | ----------- | ------------- | -------------- | --- | ------ | ------ |
| ar     | mobile  | 96          | 100           | 100            | 63  | 2516   | 0.0000 |
| ar     | desktop | 100         | 100           | 100            | 63  | 548    | 0.0000 |
| en     | mobile  | 96          | 100           | 100            | 63  | 2521   | 0.0000 |
| en     | desktop | 100         | 100           | 100            | 63  | 554    | 0.0000 |

Lighthouse completed successfully: all four measurements meet the local >=90 performance and >=95 accessibility gates. SEO 63 is intentional because Preview is blocked from indexing. These are synthetic local scores, not hosted/field measurements or security guarantees. Framework unused-JavaScript and CSS observations remain in raw reports.

## Browser and accessibility scope

The default projects are Chromium desktop, Pixel 7 and iPad Mini device profiles. All 24 localized content routes are visited in each profile with axe WCAG 2 A/AA + 2.1 AA checks (**72 page scans**), H1/metadata/locale/layout checks and resolution of every internal link. Additional widths are 320, 360, 768, 1024 and 1440 in both languages. E2E also covers all three old service aliases in each locale, contact/footer links, quote labels on all five cards, CSP blocking, rejected submissions, mobile menu/Escape, skip navigation and unknown-route recovery.

The Instagram popup test intercepts the exact approved URL with a **local fixture**; it proves link/button navigation, not remote Instagram availability. Direct Instagram HTTP access returned a network proxy 403. Mailto hrefs are verified; OS mail-client configuration, mailbox availability and message delivery are NOT VERIFIED. No email or social message was sent.

Firefox download failed with HTTP 403 for its official browser artifact URLs. WebKit 27.2 and FFmpeg downloaded, but WebKit launch failed before page testing because libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen and libGLESv2 are absent. The install-deps dry run could not resolve required packages and sudo is unavailable. **Firefox/WebKit functional tests: NOT RUN (environment blockers). Actual Safari/iOS: NOT VERIFIED.** WebKit on Linux would not by itself prove Safari compatibility.

Screenshots of desktop/mobile/tablet home pages in both languages are retained. The layout follows the approved supplied colors and bilingual text direction. Original logo conformity cannot be checked until the oversized archive is made available in a readable form. Automated accessibility is not a complete WCAG claim; actual assistive-technology/human review remains NOT VERIFIED.

## Hosted Preview and release status

- Preview URL: **NOT AVAILABLE**. Vercel CLI reports logged out; no project binding; direct Vercel API and GitHub API denied by proxy policy.
- Deployment Protection/free availability, anonymous access denial, authorized access, Git integration and project/commit identity: **NOT VERIFIED**.
- Hosted build, HTTPS/TLS, security header propagation, routing/aliases/404, external contacts, responsive/accessibility/Lighthouse: **NOT RUN** until an authorized protected Preview exists.
- Production release: **BLOCKED — FIXES REQUIRED**. Asset accessibility, legal review/registration disclosure, domain and hosted verification remain outstanding; separate explicit Production approval is required.
- Source branch/push outcome and exact access actions are recorded in DEPLOYMENT_CHECKLIST.md. Cloud draft changes do not apply runtime networking, populate credentials or deploy the website.

Current raw evidence: `artifacts/playwright.json`, `vitest.json`, `npm-audit.json`, `semgrep.json`, `secret-scan.json`, `dynamic-security.json`, `deployment-check.json`, `preview-guards.json`, `webkit-availability.json`, Lighthouse JSON and screenshots. Earlier revision evidence is under `artifacts/previous-release/`; it is not substituted for current test results. Secret signatures are limited and do not scan Git history/entropy.
