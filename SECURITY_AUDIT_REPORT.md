# TEVORLI — Preview security audit

Date: 2026-10-20. Scope: current local source, static Next export, Vercel Build Output API manifest, local validation server and tests. Dynamic probes target only `127.0.0.1:3000`. No production deployment, custom domain, purchase, paid feature, client data or outgoing message was used.

**Release status: BLOCKED — FIXES REQUIRED for hosted Preview and public launch.** Local preparation is verified as described below. Remote Preview URL, Deployment Protection, HTTPS and Vercel behavior remain **NOT VERIFIED**, because Vercel is unauthenticated and its API is blocked by the cloud proxy. No assertion of complete security, absence of vulnerabilities or ASVS certification is made.

## Current configuration and review

Approved public email/Instagram and five standalone service groups are configured. No phone/WhatsApp, office, registered company identity or completed client project is fabricated. Legal registration/domain are unconfirmed; policies are drafts. The supplied Brand Kit ZIP exceeds the 32 MiB transfer limit and was not inspected; original logo/T files are not usable yet; text and blank favicon remain honest placeholders. Palette and Inter/Cairo use the supplied settings.

The application exports static pages; it has no database, user accounts, sessions, API, Server Actions, uploads, payments or backend form. Locale and route allowlists are checked, the optional HTTPS origin uses Zod validation, and React renders text with escaping. No raw HTML rendering, request-driven remote fetch, arbitrary redirect destination or shell interpolation exists in the application.

Email/Instagram are public contact data, not secrets. Email links open the visitor's mail client. Instagram opens a new tab with noopener/noreferrer and no embedded widget. Contact tests use a local popup fixture; they do not establish mailbox delivery or remote Instagram availability and no messages were sent.

The assessment applies relevant OWASP Top 10/ASVS principles, input-validation and Node.js security guidance to this actual static scope. OWASP Input Validation and Node.js cheat sheets were consulted during initial setup. It is not a complete ASVS audit or external penetration test.

| Control                          | Result / boundary                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| XSS/output encoding              | React text rendering, no untrusted HTML, CSP script hashes for each build, no script unsafe-inline/unsafe-eval; browser regression test blocks unapproved inline JavaScript.                                                                                              |
| Injection/SSRF                   | No SQL, command-executing request handler or server-side outbound application fetch. Fixed local test/build requests are distinct from public behavior.                                                                                                                   |
| CSRF/auth/session                | N/A: no authenticated or state-changing app features. No fake auth/rate-limiting implementation was added.                                                                                                                                                                |
| Forms/spam/rate limits/retention | N/A to disabled backend submissions. Unsupported methods are rejected. Any future form requires server validation, request/body/time limits, rate limits, spam controls, privacy/retention and email-provider testing before activation.                                  |
| Redirects                        | Three fixed same-origin service aliases; canonical URLs generated from approved service IDs. Local alias membership uses own-property checking. No `next` query value is used as a target.                                                                                |
| Headers                          | CSP, MIME sniff protection, frame restrictions, Permissions Policy, Referrer Policy, COOP, HSTS and X-Robots-Tag in the export. Local checks pass; hosted propagation/TLS NOT VERIFIED.                                                                                   |
| CSP tradeoff                     | Style unsafe-inline retained for framework compatibility. No user CSS/HTML is accepted. Same-origin scripts plus exact SHA-256 hashes are allowed. Regenerate on every build; do not inject scripts afterward.                                                            |
| Preview indexing                 | Meta noindex/nofollow, HTTP noindex/nofollow/noarchive, robots disallow regardless of optional origin. **Not access control.**                                                                                                                                            |
| Production guard                 | Vercel build command rejects Production target and main/master branches; three rejection cases executed. This does not prevent a project administrator overriding settings, prebuilt uploads or manual deployments, so do not claim platform-level Production prevention. |
| Privacy                          | No app trackers, cookies or form collection. External email/Instagram and hosting logs have their own processing/retention; final legal review is pending.                                                                                                                |
| Secrets                          | No app credential required; none checked into source or client code. Limited source pattern scan passed. Vercel credential requirement was saved for secure entry only; no value was supplied or copied.                                                                  |
| Local server                     | Dotfile/traversal guards, generic errors, GET/HEAD only, request/header timeouts, no request-body logging. It is an internal test utility; intended hosted runtime is Vercel static delivery.                                                                             |

## Review passes and remediation

1. Source review covered locale/content routes, contact destinations, header props/client import boundaries, aliases, build/export utilities, environment use and Vercel output. TypeScript/ESLint and browser behavior provide separate checks.
2. Automated analysis ran npm audit, Semgrep CE with official public JavaScript/TypeScript rules, and source secret signatures. No known confirmed High/Critical issue remains in the assessed code. Zero audit records does not prove no undiscovered issue exists.
3. Functional browser coverage includes both locales, all current pages/links, responsive profiles/widths, quote paths, popup destination fixture, root/service language switching, error recovery and absent form behavior.
4. Local dynamic tests cover sensitive paths, malformed input, query/path injection non-reflection, unsupported methods, redirects, security headers and CSP behavior. **OWASP ZAP was not run**; this is a focused HTTP/browser assessment of a static site, not an equivalent comprehensive scanner.
5. Production export, type check, lint, unit/E2E, axe and Lighthouse ran; actual counts/scores are in QA_TEST_REPORT.md.
6. A fresh second review by the same agent re-read critical components, scripts and generated routes after edits. It found an inherited-property edge case in the local alias lookup: `__proto__`, `constructor` and `toString` could be treated as aliases. **Low severity / correctness-hardening:** targets remained same-origin, but unknown paths should not redirect. Fixed with `Object.hasOwn` and added three negative HTTP regressions. Relevant tests and SAST were rerun after this change. This was not a separate human assessor.

Earlier dependency remediation removed the High braces chain pulled by eslint-config-next; current maintained ESLint/TypeScript/React Hooks tooling has no reported npm audit vulnerability. Historical results are separated under artifacts/previous-release and are not current evidence.

## Commands and evidence

From `/workspace/tevorli` on `preview/tevorli`:

```sh
npm run build:preview
npm run test:deployment
npm run lint
npm run typecheck
npm test -- --reporter=json --outputFile=artifacts/vitest.json
npm audit --json > artifacts/npm-audit.json
npm run test:secrets
npm start
# With the matching static server running, sequential browser runs:
npm run test:security
npm run test:e2e
npm run test:performance
```

Production guard rejection cases were invoked with `VERCEL_ENV=production` or `VERCEL_GIT_COMMIT_REF=main/master` and must exit nonzero before building. These are expected rejections, not failures of the accepted Preview build.

Semgrep 1.181.0 runs with official rules checkout `17e31e11ebac99fb7dfe1cd288f7a32151b6f3f9`; registry semgrep.dev access was denied, so the official Git checkout is used without TLS bypass:

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

Current scan: **203 rules, 42 targets, 29 reviewed findings, 0 scan errors**. These findings are not a clean-scan claim; every group is assessed below.

| Rule group                     | Findings  | Assessment                                                                                                                                                                                                                          |
| ------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jsx-not-internationalized      | 20 INFO   | Brand/service name Instagram, approved English slogan, aria-hidden decorative mockup, and deliberately bilingual 404. Actual page copy/routes are Arabic/English. These are portability suggestions, not confirmed security issues. |
| no-stringify-keys              | 1 WARNING | JSON diagnostic report serialization with fixed header-property access; no JSON-derived object key or canonical-order reliance. False positive.                                                                                     |
| html-in-template-string        | 1 WARNING | Build-time XML sitemap text, not HTML execution or user rich content. Origin validated by Zod during build; route text is fixed and XML text escapes ampersand/less-than. Not confirmed XSS in this scope.                          |
| detect-replaceall-sanitization | 2 INFO    | Same XML text escaping, not an attempt to sanitize user HTML.                                                                                                                                                                       |
| no-replaceall                  | 2 WARNING | Node >=22 build utility supports replaceAll; not an older-browser code path.                                                                                                                                                        |
| react-insecure-request         | 3 ERROR   | Fixed loopback HTTP test destinations, no remote personal data/credentials. Not insecure production fetching. Production TLS remains unverified separately.                                                                         |

No warning was silently suppressed, no assertions were disabled, and no security verification/checksum/TLS protection was bypassed. Secret scanning is a limited signature check, excluding dependency/generated trees, Git history and lockfile; it is not a high-entropy/history scan.

## Access findings and remaining risk

- Vercel CLI 64.7.0 reports **Logged out** after supported writable XDG locations were used. No project link or VERCEL_TOKEN was present. No anonymous temporary deploy was attempted.
- `api.vercel.com`, `api.github.com` and the direct Instagram URL returned proxy HTTP 403. Native Git read succeeds and initially returned no refs; this does not establish API/write/Vercel integration access. Native Git write to `preview/tevorli` subsequently succeeded and the remote ref was verified; no main ref was written. GitHub API/Vercel integration access remains unverified.
- Required observed domains and a VERCEL_TOKEN requirement are saved in the cloud draft. Saving does not apply live network changes, populate secrets, authenticate Vercel or publish. Enter credentials only securely in settings; never chat or source.
- **NOT VERIFIED:** actual Preview URL/project/Git integration, free Deployment Protection availability/settings, logged-out denial/authorized access, hosted headers/TLS/redirects/404 and hosted tests. noindex is not a substitute for any of these.
- **NOT VERIFIED:** Firefox (download returned 403), WebKit (downloaded but fails launch due to missing host libraries), actual Safari/iOS and human screen-reader review. Install-deps dry-run could not locate required system packages; no sudo/system installation capability was available.
- **NOT VERIFIED:** Dependabot alerts (GitHub API denied), full ZAP/commercial SAST/ASVS conformance or independent human audit.
- The original logo assets could not be extracted from the oversized uploaded ZIP; no substitute logo was created. Legal registration is unconfirmed, policies need qualified review, hosting log/region/retention settings are unknown, and no custom domain exists. None of those facts are replaced with invented data.
- Next global-not-found is experimental in the pinned release; custom-404 regressions cover the local export only.

Local tests/evidence do not make a hosted preview protected or a public release ready. Do not deploy Production or activate paid services without explicit authorization.
