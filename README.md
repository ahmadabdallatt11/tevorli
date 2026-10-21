# TEVORLI — review Preview

Bilingual Digital Solutions website for Jordan: **Built Smart. Built Secure.** Next.js App Router static export, React, TypeScript, Tailwind, Lucide, Zod, local Inter/Cairo fonts. No database, accounts, backend form, tracking, paid integration or shop-system integration.

## Review changes

- Owner-supplied horizontal logo in header/footer/404; supplied favicon, Apple icon and T mark. The background remains available in the asset kit; the new hero uses a lightweight CSS service studio. Selected assets are unchanged; `docs/brand-assets.sha256.json` and `npm run test:deployment` verify source/export integrity. See [asset notes](docs/BRAND_ASSETS.md).
- Explicit route scroll reset to the top, route focus management, same-route reset, initial/deep section hashes, repeated section clicks and history navigation. One scroll operation handles section links, with a 20px target margin and no sticky-header offset. Modifier/new-tab/external links keep normal browser behavior. Initial load does not steal keyboard focus from the skip link.
- Five clearer service cards, audience guidance, a genuine help card, and native keyboard-accessible FAQs. No fabricated projects, reviews, achievements or contact details.
- All quote CTAs open the bilingual `/ar/quote/` or `/en/quote/` page. Choose Gmail in a browser (works without a Windows mail handler), a configured mail app, or copy the address. Copy denial selects the address for manual copy. A validated service ID preserves the localized subject across language changes; query-only navigation updates it. Generic contact options remain usable without JavaScript. External compose links use a fixed recipient/host, encoded subjects, control-character removal and no automatic sending. Gmail may require Google sign-in; OS mail registration and actual delivery are outside browser automation.
- Reduced-motion support, intrinsic logo dimensions and a localized normal-flow hero illustration. No overlapping floating panels or added animation dependency. No third-party resource requests on page load; Gmail/Instagram open only after a visitor selects them. About-page decoration and footer links use layout space without covering text.

Approved contact: [tevorli.digital.solutions@gmail.com](mailto:tevorli.digital.solutions@gmail.com) · [Instagram @tevorli](https://www.instagram.com/tevorli/). No phone or WhatsApp. Pricing is project-based Request a Quote. Privacy/security are included, never an absolute guarantee. Legal registration and custom domain are unconfirmed; policies remain drafts.

## Status and hosting

Local build/functional/security evidence is in [QA_TEST_REPORT.md](QA_TEST_REPORT.md) and [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md). Review and launch steps are in [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

The owner supplied the existing protected Preview URL: `https://tevorli-mh3zk947z-dentfiy.vercel.app/`. It is a previous immutable deployment, not automatically the newest one. GitHub shows an existing successful Vercel integration for branch `preview/tevorli`; pushing this branch can update its Preview through that integration. GitHub status/dashboard evidence is tracked separately from a direct current application URL.

Vercel Authentication settings have not been changed or disabled. The owner-provided prior immutable Preview now responds over verified HTTPS with HTTP 302 to `vercel.com/sso-api`, without returning app content to an unauthenticated request. The dashboard is reachable too; the earlier proxy block is resolved for those exact hosts. This does not verify the newest deployment's direct app URL, protected page content or app headers. Authorized Vercel access remains unavailable; the optional token requirement has no binding. See artifacts/hosted-protection.json and the checklist for scoped evidence. Required reusable environment settings are saved separately from runtime and need review/save/publication.

No Production deploy command, custom domain, purchase or paid service is authorized. `vercel.json` uses a build guard that rejects `VERCEL_ENV=production` and main/master. Preview remains noindex in meta, HTTP headers and robots regardless of optional public origin. **noindex is not access control.** Existing platform protection must remain enabled through review.

## Setup

Node 24.19.0 (`.node-version`), npm; Node >=22 accepted. Use this existing isolated checkout, without a worktree unless requested.

```sh
cd /workspace/tevorli
npm ci --no-fund --no-audit
# On preview/tevorli for a guarded Preview build:
npm run build:preview
npm run test:deployment
npm start
```

Use `/ar/` and `/en/`; exported `/` is Arabic. `npm run dev` is for editing at explicit locale paths. The local-only artifact builder `npm run build:vercel` also supports a pinned detached checkout and does not deploy. Stop the static server before a rebuild, then restart: its CSP is loaded at startup. Installed files can survive a snapshot, running processes cannot.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm audit
npm run test:secrets
npm run test:deployment
npm run test:e2e
# Run after browser scans finish, with the matching server still running:
npm run test:security
npm run test:performance
```

Run only one Playwright command at a time. Standard E2E uses `/usr/bin/chromium` (or `CHROMIUM_PATH`) for desktop/Pixel 7/iPad Mini profiles. Additional engine configuration reuses the full suite:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/tevorli-browsers npx playwright install firefox
PLAYWRIGHT_BROWSERS_PATH=/tmp/tevorli-browsers TEST_BROWSER=firefox npx playwright test --config playwright.additional.config.ts
# Only where WebKit and required host libraries are available:
PLAYWRIGHT_BROWSERS_PATH=/tmp/tevorli-browsers TEST_BROWSER=webkit npx playwright test --config playwright.additional.config.ts
```

Firefox became downloadable after the network settings changed. See the current QA report for actual completed engine results. WebKit was downloaded but lacks host libraries; real Safari/iOS and human screen-reader review are separate unverified checks. Lighthouse is synthetic local measurement, not field performance or a security guarantee.

Reports/artifacts are under ignored `artifacts/`; prior revision evidence is kept separately. `test:secrets` scans authored source and exported text files with limited signatures, never reports values, and is not a Git-history/entropy audit. Semgrep finding dispositions are in the security report.

## Structure and configuration

`components/navigation-effects.tsx` handles scroll/focus; `brand-logo.tsx` serves the supplied SVG; `lib/experience.ts` contains bilingual guidance/FAQs; `lib/contact.ts` holds public contact/quote URI helpers; `lib/site.ts` holds typed locale/routes/service content. There are 12 content routes per locale, plus root/custom 404. Fixed legacy aliases preserve old service links. Unknown locales/services and malformed paths fail safely.

No application secret is needed. `.env.example` contains only instructions; `NEXT_PUBLIC_*` data is public. Keep deployment credentials in secure settings/authenticated tooling, never source or chat. Optional HTTPS origin is validated metadata only and cannot enable Preview indexing. Self-hosted font license notices are under `public/licenses/`. Next's global-not-found feature is experimental; regression tests cover its current export.

Before domain launch: obtain owner content/design sign-off, confirm responsible legal/policy wording without inventing registration, verify hosted protection/app behavior and real-domain DNS/TLS/redirects/canonical metadata. Production and indexing require a separate explicit authorization. Do not purchase a domain or activate a paid feature.


## Automated security baseline

See [security/README.md](security/README.md), [SECURITY.md](SECURITY.md), [release gates](security/RELEASE_CHECKLIST.md) and [manual settings](security/MANUAL_SETTINGS.md). A read-only GitHub Actions workflow covers PRs, development/release pushes and weekly scans: Semgrep CE, Gitleaks history/export, npm audit, application/headers/API-boundary regression and passive isolated ZAP. CodeQL runs for public repositories or explicitly opted-in already-licensed private repositories; Dependabot YAML does not itself enable alerts. Current run evidence and limits are in SECURITY_AUDIT_REPORT.md. Never interpret checked-in configuration as verified hosted CI or branch-rule enforcement.

The standalone [TEVORLI template](templates/tevorli-security/README.md) mirrors the tested core and includes agent instructions, workflow/configuration, onboarding, risk policy, reporting and release checklists. Update canonical files and run `python3 security/template.py sync` plus `check` after changes.
