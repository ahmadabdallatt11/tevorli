# TEVORLI — desktop contact, responsive and security QA

Date: 2026-10-20. Branch: `preview/tevorli`. Results apply to the matching current local static export, not authenticated hosted application content. No Production deployment, domain purchase, paid feature, tracking or backend form was added.

## Changes verified

- All Request a Quote CTAs open a dedicated bilingual quote page. A service-specific request carries only an allowlisted service ID; its translated name is retained across language switching and browser history. Query-only navigation back to a generic quote resets the selection correctly.
- The quote/contact pages offer Gmail in a browser, a configured mail app, copy email and Instagram. Gmail avoids relying on a Windows mail handler and may require Google sign-in. Copy failure selects the address for manual keyboard/phone copying. Generic contact options remain visible without JavaScript. No action sends a message automatically.
- Footer includes a direct Gmail alternative to mailto. No device sniffing or forced OS setting change was added. Mailto still depends on a configured mail client; browser automation does not establish OS registration or mailbox delivery.
- Replaced the floating hero mockup with a localized service-studio illustration using the approved T and five actual services, laid out in normal flow. No new animation dependency or loaded hero background. Logo/image originals remain unchanged and verified.
- Anchor clicks use one scroll operation instead of competing native/JavaScript/CSS scrolling. Targets align at a 20px margin; repeated clicks, history, deep links, route-top reset and reduced motion are tested. The quote shortcut opens the quote route instead of a distant CTA section.
- Footer links keep their space without splitting Arabic labels. The about-page decorative arrow occupies its own grid cell and is hidden on narrow screens, so it cannot cover the slogan.
- All content retains the approved email, Instagram, five standalone services and project-based pricing. No fabricated work, reviews, phone, WhatsApp or company claims.

## Actual final local results

| Check | Result |
| --- | --- |
| Production static build | PASS; 26 localized pages, Arabic root and custom 404 |
| Vercel manifest | PASS; routes, aliases, method guards and generated headers |
| Original assets | 9 SHA-256 source/export matches |
| TypeScript / ESLint | PASS / PASS |
| Unit tests | 11 passed; 0 failed |
| Chromium E2E | 63 passed; 0 failed, skipped or flaky; desktop, Pixel 7 and iPad Mini emulation |
| Accessibility | 78 localized axe WCAG 2 A/AA + 2.1 AA scans; no configured violations |
| HTTP security | 33 passed; malformed paths, query injection, secrets paths, methods and headers |
| Dependency audit | 0 vulnerabilities reported, including development dependencies |
| Secret signatures | 216 source/export text files; 0 findings; limited signatures, not entropy/history |
| Semgrep | 203 rules; 55 targets; 18 reviewed findings; 0 scan errors |
| Existing prior hosted Preview | TLS verification passed; HTTP 302 to Vercel SSO; unauthenticated app content not returned |
| Newest authenticated hosted app | NOT VERIFIED; direct URL/session access remains outstanding |
| Firefox / WebKit / actual Safari | NOT EXECUTED on this revision; prior environment launch failures remain documented |

Final Chromium run: 2026-10-20T18:13:29.133000+03:00 (Asia/Amman), 118.9s. Raw counters: expected=63, unexpected=0, skipped=0, flaky=0. Earlier candidate runs are superseded by this matching final 63-case run. The last pass also verifies the studio is contained without clipped content at small widths.

## Lighthouse — local synthetic run

| Locale | Profile | Performance | Accessibility | Best practices | SEO | LCP ms | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ar | mobile | 95 | 100 | 100 | 66 | 2905 | 0.0000 |
| ar | desktop | 100 | 100 | 100 | 66 | 587 | 0.0000 |
| en | mobile | 95 | 100 | 100 | 66 | 2883 | 0.0000 |
| en | desktop | 100 | 100 | 100 | 66 | 600 | 0.0000 |

All configured performance/accessibility gates passed. Desktop/mobile profiles were checked in Lighthouse output, not inferred from labels. Mobile LCP is about 2.91s Arabic / 2.88s English in this run and remains a performance improvement opportunity; these are not real-user field metrics. SEO is deliberately constrained by Preview noindex/robots. Preview indexing was not enabled to raise a score.

## Functional, visual and security coverage

All 13 routes per language are visited and internal destinations checked, including service details, quote, contact, about, work, legal pages and recovery from 404. Checks include H1/title/description, lang/dir, no horizontal overflow, logos/favicons, five service cards, menus/Escape, keyboard skip links/FAQs/copy fallback, route focus, reduced motion, unindexed Preview and safe legacy redirects.

Layout geometry and actual button hit-testing cover 320/390/760/820/1024/1280/1440 widths in both locales; existing 320/360/768/1024/1440 checks also pass. Hero content and illustration, quote panels and header pieces do not overlap. Home, quote and about screenshots were captured in both locales across all three profiles; desktop Arabic, mobile English and representative home/about screenshots were visually reviewed. This does not claim every possible device or a human screen-reader assessment.

Browser security probes reject unknown/prototype/tag/URL-like service values and ignore arbitrary recipient/redirect query parameters. Compose destinations and recipients stay fixed. External Gmail/Instagram popup navigation is tested using local fixtures with exact URL assertions; no email or Instagram message was sent. Successful fixture navigation is not proof of Google account availability, mail-client configuration or delivery. CSP blocks an unapproved inline script, and no CSP relaxation was needed for Gmail links. See SECURITY_AUDIT_REPORT.md for reviewed findings and limits.

## Hosted and browser limitations

- Prior immutable URL: `https://tevorli-mh3zk947z-dentfiy.vercel.app/`. A fresh unauthenticated request now passes TLS verification and receives 302 to `vercel.com/sso-api`, without app content. The earlier CONNECT proxy block is resolved for this host and the dashboard. This older URL must not be labeled as the current revised source.
- GitHub–Vercel deployment status/dashboard evidence for the final pushed commit is saved separately in artifacts/hosting-final.json. A completed deployment is not proof of the authenticated hosted app's behavior.
- Vercel CLI/API access is not authenticated and no secure token binding is present. Newest direct URL, project settings and authorized content/header/CSP/navigation/a11y/performance checks remain unverified. Authentication settings were not removed or bypassed.
- Firefox: a previous 15-case attempt failed at launch before application assertions. Diagnosis exposed namespace writes rejected with EROFS; an owned hung process was terminated without disabling the sandbox. This was not rerun as a current-revision app test.
- WebKit previously failed launch for missing GTK4/Graphene/Harfbuzz-ICU/manette/hyphen/GLES libraries. Actual Safari/iOS, real hardware and human assistive-technology tests remain unverified.
- Dependabot alerts are disabled for this repository; this is not a passed Dependabot audit. npm audit ran independently.
- Comprehensive ZAP, entropy/history secret scanning, full ASVS/WCAG conformance and independent external security review are not claimed.

## Reproduction and release decision

Node 24.19.0, npm 11.9.0, Next 16.4.2, React 19.3.1, TypeScript 6.0.3, ESLint 10.13.0, Vitest 5.0.5, Playwright 1.64.1, axe 4.14.0, Lighthouse 13.5.0. Runtime/dependency declarations and lockfile are unchanged.

```sh
npm run typecheck
npm run lint
npm test -- --reporter=json --outputFile=artifacts/vitest.json
# Stop only an earlier local server you started before rebuilding:
npm run build:preview
npm run test:deployment
npm start
# Use the matching build/server. One browser suite at a time:
npm run test:security
npm run test:e2e
npm run test:performance
npm audit --json > artifacts/npm-audit.json
npm run test:secrets
```

**Ready for owner review with documented limits. Public launch is not yet fully verified or approved.** Remaining launch work is authenticated newest-Preview verification, Firefox/Safari coverage where supported, owner design/content/policy sign-off, supplied domain/DNS and separately authorized Production/indexing/origin configuration. No confirmed unresolved High/Critical issue is known within this scoped review; unknown issues can remain.

Evidence: artifacts/playwright.json, vitest.json, npm-audit.json, semgrep.json, secret-scan.json, dynamic-security.json, deployment-check.json, hosted-protection.json, performance-summary.json, Lighthouse reports and localized screenshots. Earlier results are retained separately in artifacts/previous-release/.
