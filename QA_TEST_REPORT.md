# TEVORLI — complete review QA report

Date: 2026-10-20. Source branch: `preview/tevorli`. Tests below target the current matching local static export. They are not substituted for authenticated hosted testing. No Production command, custom domain purchase, protection removal, tracking, backend form or paid feature was performed.

## User-visible improvements

- The supplied web asset ZIP is readable and its selected original files are integrated: logo in header/footer/404, real favicon/Apple icon, desktop background and lightweight approved white T. Nine asset fingerprints match source and exported output; no replacement logo was created.
- New routes begin at the top, footer/same-route navigation resets document position, and exact/deep section links scroll to and focus their target. Initial focus remains suitable for keyboard skip navigation. Modified/new-tab/external links retain normal behavior.
- The five approved service groups have clearer audience guidance and project-based quote labels. A help card directs uncertain visitors to real contact channels; native FAQs answer pricing/scope/languages/security questions without new JavaScript dependencies.
- Per-service Request a Quote opens the approved mailbox with a safely encoded subject, plus an accessible alternative contact link. No message is sent automatically. Approved email/Instagram are retained; no phone, WhatsApp, reviews, projects or company metrics were invented.
- Inter/Cairo stay self-hosted. Intrinsic logo dimensions prevent image layout shift; noncritical images are lazy; the mobile decorative background was removed after LCP analysis and an unnecessary image client was avoided. New movement is limited; reduced-motion preferences are explicitly tested.

## Environment and reproducible commands

Node 24.19.0, npm 11.9.0, Next 16.4.2, React 19.3.1, TypeScript 6.0.3, ESLint 10.13.0, Vitest 5.0.5, Playwright 1.64.1, axe Playwright 4.14.0, Lighthouse 13.5.0. The dependency lock remains pinned.

```sh
npm run build:preview
npm run test:deployment
npm run lint
npm run typecheck
npm test -- --reporter=json --outputFile=artifacts/vitest.json
npm audit --json > artifacts/npm-audit.json
npm run test:secrets
npm start
# Matching server, one browser invocation at a time:
npm run test:security
npm run test:e2e
npm run test:performance
```

An extra engine runner is available with `playwright.additional.config.ts` and TEST_BROWSER=firefox/webkit. It does not silently replace Chromium coverage or mix its JSON result file. Actual engine failure results are documented below.

## Final measured local results

| Check                              | Actual final result                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Production static build / manifest | PASS; 24 localized routes plus root/404, headers, aliases, method guard          |
| Approved assets                    | 9 source/export SHA-256 matches; original supplied bytes                         |
| TypeScript / ESLint                | PASS / PASS                                                                      |
| Unit tests                         | 6 passed, 0 failed; includes quote-URI parameter injection cases                 |
| Chromium E2E                       | 45 passed, 0 failed, 0 skipped; 3 profiles                                       |
| Accessibility                      | 72 localized axe A/AA scans; no configured violations                            |
| HTTP security                      | 29 passed                                                                        |
| npm audit                          | 0 reported vulnerabilities across all installed dependencies                     |
| Secret signatures                  | No findings in source and exported text; limited signatures, not entropy/history |
| Semgrep                            | 26 reviewed findings, 0 errors; 203 effective rules / 52 targets                 |
| Firefox runner                     | 15 launch failures; 0 successful app cases; environment diagnosis below          |
| WebKit / real Safari               | Engine lacks host libraries / NOT VERIFIED                                       |
| Hosted app/Authentication/TLS      | NOT VERIFIED independently; existing Git integration status is separate          |

Final Chromium run (UTC): 2026-10-20T14:24:32.924Z; duration 98.0s. Current JSON expected=45, unexpected=0, skipped=0, flaky=0.

### Final Lighthouse (local synthetic)

| Locale | Profile | Performance | Accessibility | Best practices | SEO | LCP ms | CLS    |
| ------ | ------- | ----------- | ------------- | -------------- | --- | ------ | ------ |
| ar     | mobile  | 95          | 100           | 100            | 66  | 2817   | 0.0000 |
| ar     | desktop | 100         | 100           | 100            | 66  | 617    | 0.0000 |
| en     | mobile  | 94          | 100           | 100            | 66  | 2403   | 0.0000 |
| en     | desktop | 100         | 100           | 100            | 66  | 640    | 0.0000 |

All four measurements passed the configured performance >=90 and accessibility >=95 gates. SEO 66 is intentionally limited by Preview noindex; it was not raised by removing that protection. Scores are synthetic, not field Core Web Vitals or security guarantees. Arabic simulated mobile LCP remains above the 2.5s good threshold; preserve this observation for real-device/hosted follow-up. CLS is zero in these measurements.

An earlier design candidate scored 93 on mobile because its decorative background became the LCP image. The mobile background work was removed, the lighter supplied T variant used, and an unnecessary image client avoided. Final tests and metrics above are from the resulting matching build. No original SVG bytes were edited to obtain the improvement.

## Functional and accessibility coverage

All 24 localized content routes (12 per language) are exercised across Chromium desktop, Pixel 7 and iPad Mini profiles. There are 72 axe page scans for configured WCAG 2 A/AA and 2.1 AA rules, plus H1, title/description, lang/dir, internal-link destination and horizontal-overflow assertions. Additional widths are 320/360/768/1024/1440 in both languages. Device profiles do not prove actual iOS/Android hardware or Safari compatibility.

The suite covers home → services → detail → language switch → alternate contact; exact quote-recipient/encoded subject; footer contacts and Instagram popup destination using a local fixture; absence of form/phone/WhatsApp; all five quote labels; all three legacy aliases per locale; root language switching; keyboard skip/menu/Escape/focus; FAQs by Enter; logo/image loading; missing/invalid/injected routes; rejected submissions; CSP inline blocking; Preview noindex; footer-to-route top reset, repeated-route reset, direct hash entry and all homepage section targets; reduced-motion preference.

Initial last-section tests incorrectly demanded an exact near-top alignment even where the document end prevents that on a tall tablet. The test was fixed to require the exact last target to be visible/focused under native scroll clamping. Earlier sections still require near-top alignment; no route-top assertion was disabled. Final tests passed after the correction.

Full-page screenshots in both locales and all Chromium profiles were inspected, particularly approved logo readability, Arabic direction, mobile card hierarchy, contact wrapping and FAQ/CTA layout. User design/content sign-off remains distinct from these checks.

## Failed, blocked and unrun checks

- **Firefox:** now downloadable after network changes; the 15-case Firefox run recorded **15 launch failures, 0 application passes**, before application assertions could execute. Standard temporary profiles failed to launch. A supported persistent-profile/XDG diagnosis reached the browser but exposed content-process namespace writes rejected with EROFS (`/proc/self/uid_map`); the owned hung process was terminated. Browser sandbox protections were not disabled. These are diagnosed environment failures, not passing Firefox tests or confirmed app defects.
- **WebKit:** downloaded, but a current launch check fails for absent GTK4/Graphene/Harfbuzz-ICU/manette/hyphen/GLES libraries. No app test executed. **Actual Safari/iOS and real device testing: NOT VERIFIED.**
- **Hosted Preview:** owner supplied `https://tevorli-mh3zk947z-dentfiy.vercel.app/`, a previous immutable deployment reportedly protected by Vercel Authentication. The environment's CONNECT proxy rejected that host before Vercel; **TLS/certificate/protection enforcement/content verification are NOT VERIFIED**, not failed authentication tests.
- **New hosted deployment:** GitHub exposes Vercel integration status/dashboard links. Final push/deployment status is saved separately in artifacts/hosting-final.json when observed; a green build is not proof of the hosted flows. Do not label the old owner-provided URL as the newest deployed code. Authorized Vercel API access is not available, so direct current URL and settings remain bounded by actual evidence.
- **Dependabot:** API now reachable, but alerts are disabled for this repository (403). Not a passed alert audit. npm audit was executed independently.
- Instagram test uses a local popup fixture and exact destination assertions; mailbox delivery/OS mail client and remote Instagram account availability are not proven. No email or social message was sent.
- Human screen-reader assessment, comprehensive WCAG conformance, full ZAP/commercial scan, entropy/history secret scanning and independent human security review are not claimed.

## Domain and release readiness

**Local review: READY WITH DOCUMENTED LIMITATIONS. Public/domain launch: NOT APPROVED / NOT FULLY VERIFIED.** Domain purchase/connection and Production deployment are outside current authorization.

The original asset-transfer blocker is resolved. What remains is owner review, authorized hosted app/protection/TLS/header/navigation verification, responsible-operator/policy/log-retention review without fabricated legal registration, a supplied owned domain and explicit Production permission. A deliberate Production/indexing configuration change, verified origin, DNS/certificate/canonical redirects/hreflang/social metadata/sitemap and post-launch checks must follow that permission. Preview must stay protected and unindexed throughout.

Raw current evidence: artifacts/playwright.json, vitest.json, npm-audit.json, semgrep.json, secret-scan.json (source + exported text), dynamic-security.json, deployment-check.json, preview-guards.json, firefox-availability.json, playwright-firefox.json, webkit-availability.json, hosted-protection.json, screenshots and Lighthouse JSON. Previous-revision evidence is separate under artifacts/previous-release/.
