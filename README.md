# TEVORLI — Preview

Arabic/English Digital Solutions website for Jordan. Next.js static export, TypeScript, React, Tailwind, Lucide, Zod, and local Inter/Cairo fonts. No database, authentication, backend contact form, analytics, payments, internal shop-system integrations, or application credentials.

## Approved configuration

- TEVORLI · Digital Solutions · Jordan · **Built Smart. Built Secure.**
- Email: [tevorli.digital.solutions@gmail.com](mailto:tevorli.digital.solutions@gmail.com)
- Instagram: [@tevorli](https://www.instagram.com/tevorli/)
- Palette: Midnight Navy `#081220`, Electric Blue `#2563EB`, Sky Blue `#60A5FA`, White `#FFFFFF`.
- Five service groups: Websites & Landing Pages; Digital Menus; Smart QR Solutions; Digital Business Cards & NFC; Digital Catalogs & Smart Pages.
- Pricing: **Request a Quote**. Privacy/security included without extra fees, with no absolute security guarantees.
- No WhatsApp, phone, office address, registered legal identity or custom domain is claimed. Legal registration is unconfirmed. Policies remain drafts. The work page does not claim client projects.

**Protected remote Preview: BLOCKED pending Vercel access/network configuration. Public production release: BLOCKED.** See [deployment checklist](DEPLOYMENT_CHECKLIST.md), [security report](SECURITY_AUDIT_REPORT.md), and [QA report](QA_TEST_REPORT.md).

The owner uploaded TEVORLI-Brand-Kit-FINAL (1).zip, but its transfer exceeds the file tool limit of 32 MiB. The archive could not be downloaded or inspected; original logo/T assets are not yet usable in the checkout. The current brand text and blank favicon are placeholders, not a replacement logo. Supply the approved assets before brand-complete review.

## Setup and local preview

Use Node 24.19.0 (`.node-version`) and npm; Node >=22 is supported. Use this existing isolated checkout; do not create a worktree unless requested.

```sh
cd /workspace/tevorli
npm ci --no-fund --no-audit
# Work on the development branch, never main:
git branch --show-current
npm run build:preview
npm run test:deployment
npm start
```

Use `/ar/` and `/en/`; exported `/` serves Arabic. For editing use `npm run dev` and explicit locale paths. Stop the static server before rebuilding and restart afterward: its CSP is read at startup. Processes do not survive environment snapshots even if installed files do.

`vercel.json` runs `npm run build:preview`. That command rejects `VERCEL_ENV=production` and main/master branches. `build:vercel` remains a local artifact builder and does not deploy anything. Actual Vercel Production deployment must stay disabled/unapproved.

All pages and exported HTTP headers remain **noindex, nofollow** even if an origin is supplied. `robots.txt` disallows crawling. These do not restrict access: Vercel Deployment Protection must be configured and verified before the remote preview is considered protected. No protection setting has been applied remotely yet.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm audit
npm run test:secrets
npm run test:e2e
npm run test:deployment
# With the matching static server running:
npm run test:security
npm run test:performance
```

Run only one Playwright invocation at a time. Run Lighthouse after browser/security scans finish to avoid CPU contention. Current result files are in ignored `artifacts/`; historical evidence is separated under `artifacts/previous-release/`. Scripts fail on actual test failures; do not infer success from file existence alone.

The default three browser projects use installed Chromium. Set `CHROMIUM_PATH` for a different executable. Additional Firefox/WebKit checks require their Playwright browser downloads and system libraries; see QA report for actual availability. Browser profiles are not evidence of Safari or real iOS compatibility.

## Content and routes

`lib/site.ts` contains bilingual service/page copy, allowlisted locale/route validation and optional public HTTPS origin validation. `lib/contact.ts` contains only owner-approved **public** contact links. The header receives only its required labels, keeping Zod and unrelated content out of its client import graph. There are 12 content routes per language, including five detail pages. The old landing-pages, nfc-cards and business-pages URLs redirect to their grouped canonical service routes on the local server and in the Vercel manifest.

Email links open the visitor's configured mail application. Instagram opens an external service with noopener/noreferrer. Tests verify destinations and popup navigation with a local fixture; they do not send email or establish external account availability. No messages were sent during verification.

`.env.example` contains no credentials. The application requires no secret. Optional `NEXT_PUBLIC_SITE_URL` is public metadata, not a secret, and cannot enable indexing. Vercel deployment credentials belong only in secure environment settings or authenticated tooling, never in the repository/chat/client bundle. Do not add a mail provider or backend form without separate implementation and abuse/privacy testing.

The font license notices are included under `public/licenses/`. Next's global-not-found support is experimental in the pinned version; keep its regression tests on upgrades. Read [Vercel deployment instructions](docs/DEPLOYMENT.md) before any external action. No custom domain, paid service, or Production deployment is authorized.
