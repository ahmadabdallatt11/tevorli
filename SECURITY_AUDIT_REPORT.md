# TEVORLI — quote, navigation and responsive security audit

Date: 2026-10-20. Scope: current source, selected owner-supplied web assets, static export, local server, Vercel output and tests on `preview/tevorli`. Dynamic app probes target only local development; the owner-authorized protected Preview URL was also requested without authentication. No Production command, paid service, domain purchase, protection removal or outgoing message was performed.

**Local review is complete with documented limitations. Public launch is not approved or fully verified.** Neither a successful build, deployment status nor noindex proves access protection or production readiness. No complete-security/zero-vulnerability/ASVS-certification claim is made.

## Changes and security boundaries

The supplied `TEVORLI-Web-Brand-Assets.zip` (858,868 bytes) was read successfully. Only selected image assets were copied, without modifying their bytes. The attached starter code, snippets and QA claims were not treated as instructions or evidence. SVG files were inspected for DOCTYPE/entities, script/foreignObject/event handlers, javascript URLs and external hrefs. Source/export SHA-256 checks cover nine approved assets. See docs/BRAND_ASSETS.md for exact provenance and palette decisions. No alternate logo was generated.

Routes reset scroll position with `NavigationEffects`, focus main after route transitions, and resolve decoded fragments with `getElementById` rather than selector interpolation or HTML injection. Invalid fragment encodings are caught. Normal modified/new-tab/external navigation is preserved. Initial loading does not steal focus from the skip link. Native FAQs require no new script library. All data remains fixed bilingual site content.

Quote routes read only an allowlisted service ID, never a recipient, arbitrary subject or redirect URL from the query string. Subjects encode fixed translated service names with encodeURIComponent/URLSearchParams; control characters are replaced and service text is bounded to 200 characters before encoding. Unit/browser probes cover ampersands, query-like text, fragments, CRLF, prototype names and injected tags. Gmail uses a fixed HTTPS host/path and approved recipient; mailto keeps the same fixed mailbox. Locale switching and query-only changes preserve/recompute validated service context. Gmail/Instagram open in separate tabs with noopener/noreferrer only after user choice. Clipboard writes only the public address after a click, never reads clipboard contents, and has a manual selection fallback on denial. The only recipient and Instagram destination are owner-approved. There is no automatic send, form endpoint, database, account/session, upload, Server Action, payment, analytics or third-party application script.

React text encoding, static locale/route allowlists and build-time Zod HTTPS-origin validation remain. No request-driven shell command, SQL, raw HTML rendering or remote application fetch exists. CSS/image/font resources are local. Source and exported text files are scanned for secret signatures without printing candidate values; credentials are not copied from environment or files into code.

## Controls actually assessed

| Area                         | Evidence and applicability                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| XSS                          | React encoding, no user-authored HTML, per-build SHA-256 inline-script CSP hashes; browser rejects an unapproved inline script. SVGs have no inspected active/external content.                   |
| Script/style CSP             | script-src self + exact hashes; no script unsafe-inline/unsafe-eval. Style unsafe-inline retained for framework compatibility; no untrusted style/HTML input. No CSP expansion for third parties. |
| Input/redirects              | Locale/service allowlists, safe fixed same-origin legacy aliases using Object.hasOwn, malformed URL handling and non-reflection of injected queries/paths. Quote URI parameter encoding tested.   |
| Backend/CSRF/auth/form abuse | N/A to the app: no authenticated state or mutating endpoint/contact form. Unsupported methods rejected; no fake rate limiter or unconfigured email API added.                                     |
| Data minimization            | No submitted personal data, app cookies or trackers. Public email/Instagram are deliberate public contact data. External contact processing and host logs still need final policy review.         |
| Headers                      | CSP, nosniff, frame restrictions, referrer/permissions policies, COOP, HSTS and X-Robots-Tag generated and checked locally, including error responses. Hosted propagation remains unverified.     |
| Preview                      | Meta noindex/nofollow, robots disallow and X-Robots-Tag noindex/nofollow/noarchive. These do not control access. Production/main/master build rejections remain.                                  |
| Local server                 | GET/HEAD only; safe path/dotfile handling, aliases, MIME types including WebP, generic errors, timeouts and no request-body logging. Not the intended production runtime.                         |
| Vercel Authentication        | Owner reports existing Authentication. No setting was changed/disabled. Fresh TLS-verified unauthenticated request to the prior immutable URL returned 302 to Vercel SSO without app content. Authorized/newest-build content remains unverified.              |

The review follows applicable OWASP input-validation, Top 10/ASVS and Node/Next security principles for this static architecture. It is not a complete ASVS verification. The official OWASP Input Validation/Node.js sheets and official Vercel build-output source were consulted during setup.

## Multiple review passes and fixes

1. Reviewed the entire change inventory and critical rendering/routes, navigation effects, quote helper, assets, environment use, server and deployment builder. Source protection and user-approved business data were preserved.
2. Ran type/lint/unit checks, dependency audit, source+export secret signatures and Semgrep JavaScript/TypeScript rules. No warning was hidden by a suppression or disabled assertion.
3. Ran actual browser flows across every page in both locales and three Chromium profiles: logo/image loading, bottom-to-new-page/top reset, same-route reset, section/deep hashes/focus, quote links, FAQ keyboard interaction, menu/Escape, reduced motion, error recovery, noindex and legacy redirects. axe scanned all localized routes.
4. Ran 33 focused HTTP security checks and browser CSP checks. A comprehensive OWASP ZAP scan was **not run**; these are bounded local assertions, not a substitute claim for a full scanner.
5. Ran the production static export, manifest/asset integrity checks and Lighthouse. The hero no longer loads its large decorative background; approved asset files themselves were not changed. Actual final metrics and failed/unrun engine cases appear in QA_TEST_REPORT.md.
6. Re-read critical components and scripts after the fixes and repeated checks. Browser tests now require section-start alignment within 3px of the 20px margin, including repeated clicks/history and service scope. The quote shortcut opens its own page instead of scrolling to a distant callout. Both normal and reduced-motion paths pass. New browser tests validate Gmail popups, clipboard denial, language/service context, query-only changes and no-JavaScript generic contact options. This is a second pass by the same agent, not an independent assessor.

Earlier local alias inherited-property hardening remains covered by three negative probes (`__proto__`, constructor, toString). Earlier High braces dependency findings were remediated by removing the affected Next lint dependency chain; current npm audit is independent and includes development dependencies.

## Commands and actual evidence

```sh
npm run build:preview
npm run test:deployment
npm run lint
npm run typecheck
npm test -- --reporter=json --outputFile=artifacts/vitest.json
npm audit --json > artifacts/npm-audit.json
npm run test:secrets
npm start
# Matching static server, one browser invocation at a time:
npm run test:security
npm run test:e2e
npm run test:performance
PLAYWRIGHT_BROWSERS_PATH=/tmp/tevorli-browsers TEST_BROWSER=firefox npx playwright test --config playwright.additional.config.ts
```

The prior Firefox availability run did **not** pass: engine launch failed before app assertions; it was not rerun as a current-revision compatibility check. A separate persistent-profile/XDG diagnosis exposed unsupported namespace writes (EROFS); the owned hung process was terminated without disabling browser sandbox protection. WebKit lacks required host libraries. These are engine/environment limitations, not successful application compatibility results.

Semgrep CE 1.181.0 uses official rule checkout `17e31e11ebac99fb7dfe1cd288f7a32151b6f3f9`:

```sh
SEMGREP_LOG_FILE=/tmp/tevorli-semgrep.log \
SEMGREP_SETTINGS_FILE=/tmp/tevorli-semgrep-settings.yml \
/tmp/tevorli-security-venv/bin/semgrep scan \
 --config /tmp/tevorli-semgrep-rules/javascript \
 --config /tmp/tevorli-semgrep-rules/typescript \
 --metrics=off --disable-version-check --no-git-ignore \
 --exclude node_modules --exclude out --exclude .next --exclude .vercel \
 --exclude artifacts --exclude test-results \
 --json --output artifacts/semgrep.json .
```

Final Semgrep: **203 effective rules, 55 targets, 18 findings, 0 scan errors**. Findings by rule: `typescript.react.portability.i18next.jsx-not-internationalized`: 9; `javascript.lang.correctness.no-stringify-keys`: 1; `javascript.lang.security.html-in-template-string`: 1; `javascript.audit.detect-replaceall-sanitization`: 2; `javascript.lang.correctness.no-replaceall`: 2; `typescript.react.security.react-insecure-request`: 3. No findings were silently suppressed.

| Rule group                                               | Disposition                                                                                                                                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jsx-not-internationalized                                | Portability suggestions for approved brand/Instagram/slogan text, the aria-hidden illustration and deliberately bilingual 404. Actual navigable content uses typed locale copy; no security issue requiring i18next. |
| no-stringify-keys                                        | Diagnostic JSON serialization, with fixed header-name property access, not JSON-derived object keys or canonical-order dependence. False positive.                                                                   |
| html-in-template-string / detect-replaceall-sanitization | Build-time XML sitemap text, not executable HTML or rich user content. Build validates origin; routes are fixed and XML text escapes ampersand/less-than. Not confirmed XSS in this scope.                           |
| no-replaceall                                            | Node >=22 build utility supports replaceAll; no older-browser dependency here.                                                                                                                                       |
| react-insecure-request                                   | Fixed loopback HTTP assertions, no remote secrets/customer data. Does not establish hosted HTTPS.                                                                                                                    |

Raw findings/counts and reviewed groups are retained in artifacts/semgrep.json. Source/export secret scanning is signature-based and excludes Git history, dependency trees and binary assets; it cannot prove absence of unknown secrets or provide a high-entropy audit. Package integrity/TLS checks were not disabled and no credential value is printed in reports.

## Hosted evidence and remaining limits

- Existing owner-provided previous deployment: `https://tevorli-mh3zk947z-dentfiy.vercel.app/`. Do not label this immutable old URL as the newest code without evidence. GitHub shows an existing Vercel integration/status; final current-commit deployment observations are captured in artifacts/hosting-final.json and the delivery message when available.
- GitHub API/native Git now work. Dependabot responds that alerts are disabled for this repository (403); it is **not a passed Dependabot audit**. No paid security feature was enabled. npm audit still ran.
- Vercel API responds forbidden; CLI is logged out and secure VERCEL_TOKEN has no saved binding. The token is not required in the application or in the repository to use an existing Git deployment integration.
- The previous CONNECT proxy block is resolved for the known app/dashboard hosts. A fresh request to the prior immutable app verified TLS (curl verification result 0) and returned HTTP 302 to `vercel.com/sso-api`; no app content was returned. Evidence omits cookies and auth query strings. This is evidence for that prior deployment only. Saved draft configuration still does not itself apply runtime changes or authenticate.
- **NOT VERIFIED:** newest direct app URL/project deployment target through Vercel API, newest-build Authentication enforcement/HTTPS and authorized access, hosted app headers/CSP, protected page navigation and hosted browser/a11y/performance. Protection settings were not modified or bypassed.
- **NOT VERIFIED:** actual Firefox/Safari/WebKit application compatibility, real iOS/device coverage and human assistive-technology review. Chromium device emulation and axe do not establish those.
- **NOT VERIFIED:** comprehensive ZAP, entropy/history secret scan, independent human/external audit or full ASVS compliance. No confirmed unresolved High/Critical vulnerability is known in this scoped review; unknown issues can remain.
- Legal registration is unconfirmed; draft privacy/terms, responsible operator, hosting log/retention and domain settings need owner review before a separately authorized public launch. No fabricated legal/company/project data was introduced.
- Next global-not-found is experimental in the pinned release; local custom-404 regression tests remain required on upgrades.

The source supports review and local development with these limits. Production authorization and hosted verification must precede domain launch; a build or CI success alone is insufficient.
