# TEVORLI — review Preview

Bilingual Digital Solutions website for Jordan: **Built Smart. Built Secure.** Next.js App Router static export, React, TypeScript, Tailwind, Lucide, Zod, local Inter/Cairo fonts. No database, accounts, backend form, tracking, paid integration or shop-system integration.

## Review changes

- Owner-supplied horizontal logo in header/footer/404; supplied favicon, Apple icon, T mark and desktop background. Selected assets are unchanged; `docs/brand-assets.sha256.json` and `npm run test:deployment` verify source/export integrity. See [asset notes](docs/BRAND_ASSETS.md).
- Explicit route scroll reset to the top, route focus management, same-route reset, initial/deep section hashes, and correct section focus. Modifier/new-tab/external links keep normal browser behavior. Initial load does not steal keyboard focus from the skip link.
- Five clearer service cards, audience guidance, a genuine help card, and native keyboard-accessible FAQs. No fabricated projects, reviews, achievements or contact details.
- Per-service quote links open the approved email with a safely encoded service subject. Contact/Instagram alternatives stay available; no message is sent automatically.
- Reduced-motion support, intrinsic logo dimensions, lazy noncritical SVGs, lightweight mobile artwork and no new animation library or third-party requests.

Approved contact: [tevorli.digital.solutions@gmail.com](mailto:tevorli.digital.solutions@gmail.com) · [Instagram @tevorli](https://www.instagram.com/tevorli/). No phone or WhatsApp. Pricing is project-based Request a Quote. Privacy/security are included, never an absolute guarantee. Legal registration and custom domain are unconfirmed; policies remain drafts.

## Status and hosting

Local build/functional/security evidence is in [QA_TEST_REPORT.md](QA_TEST_REPORT.md) and [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md). Review and launch steps are in [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

The owner supplied the existing protected Preview URL: `https://tevorli-mh3zk947z-dentfiy.vercel.app/`. It is a previous immutable deployment, not automatically the newest one. GitHub shows an existing successful Vercel integration for branch `preview/tevorli`; pushing this branch can update its Preview through that integration. GitHub status/dashboard evidence is tracked separately from a direct current application URL.

Vercel Authentication settings have not been changed or disabled. They are reported enabled by the owner; independent enforcement and authenticated-page checks remain unverified because this environment's proxy denied access to that app host before reaching Vercel, and the Vercel API token requirement has no saved binding. A CONNECT proxy 403 is not a Vercel Authentication result. The dashboard host is also blocked by network policy. Required observed host additions are saved in the environment draft, not automatically applied to runtime.

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
