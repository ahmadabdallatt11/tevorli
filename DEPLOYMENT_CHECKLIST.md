# TEVORLI review and domain-readiness checklist

Allowed: changes on `preview/tevorli` and protected Preview through the existing Git–Vercel integration. Not allowed: Production deploy, protection removal, domain purchase, paid services or unapproved integrations.

## Completed locally

- [x] Approved public email/Instagram and five project-priced services; no fabricated phone/WhatsApp, projects, reviews or achievements.
- [x] Supplied web Brand Kit read and selected logos/icons copied without changes. Header/footer/404 use the logo; favicon replaced. Nine source/export asset hashes verified.
- [x] New pages start at top; same-page return links reset position; section/deep hashes target and focus the actual section. Keyboard and reduced-motion journeys tested.
- [x] Dedicated bilingual quote route with browser Gmail, mail app and clipboard/manual-copy options; validated service context survives locale and query-only changes. No backend form or new runtime dependency.
- [x] Localized hero studio, separated footer links and about-page decoration; layout bounds, control hit-testing and exact anchor alignment tested at laptop and phone widths.
- [x] Production static build, type/lint/unit/E2E/axe/HTTP security checks, dependency audit, source+export secret signatures and SAST run. See actual reports for counts and limits.
- [x] Preview meta/HTTP/robots noindex, CSP hashes, frame/MIME/referrer/permissions/HSTS headers, safe aliases, rejected mutations and custom 404.
- [x] No application credential/customer data added. Production/main/master build guards retained.
- [x] Existing GitHub Vercel status observed for the previous revision; integration exists. Authentication settings were not modified.

## Hosted Preview evidence and limits

Owner-provided prior URL: `https://tevorli-mh3zk947z-dentfiy.vercel.app/`. The owner reports Vercel Authentication. Do not present this immutable URL as the new deployment unless metadata proves it.

- [ ] Newest deployment's **direct application URL** confirmed against the latest branch commit. GitHub's Vercel target links to the dashboard, not necessarily a direct app URL. Current status evidence is captured separately in `artifacts/hosting-final.json` when available.
- [ ] Preview environment/project and Production branch settings read through authorized Vercel access. CLI is logged out; VERCEL_TOKEN requirement has no saved binding. Never paste its value in chat/source.
- [x] Prior owner-provided immutable host: verified TLS and anonymous request redirected with HTTP 302 to Vercel SSO without returning app content. No setting or bypass was used.
- [ ] Repeat protection/TLS checks on the newest direct URL and verify successful authorized application access. An older immutable deployment is not evidence for the new application build.
- [ ] Hosted HTTPS/certificate, application headers/CSP, statuses, assets, 404/aliases, RTL/LTR, quote links and browser-console/a11y/performance checks completed inside authorized access. Local checks and a successful deployment build alone do not prove these.

Network domain additions for `vercel.com` and the exact owner-provided app host are saved alongside existing custom domains in the cloud draft; both hosts now respond at runtime. Review/save/publish the development environment settings to retain the reusable configuration. Future immutable Preview hosts may need their observed hostname added. Don't enable anonymous temporary deployment or bypass/remove protection just to run tests.

GitHub API now works, but the Vercel API returns forbidden without authentication; do not describe that as a continuing GitHub API network failure. Dependabot reports alerts disabled for this repository; npm audit ran independently. No paid security feature was enabled.

## Owner review before domain connection

- [ ] Review Arabic/English content, supplied logo rendition, page ordering, mobile layout and contact/quote behavior.
- [ ] Confirm policy/responsible-operator wording and hosting logs/retention. Do not claim legal registration that has not been confirmed; no invented legal identity is required.
- [ ] Approve a specific production release explicitly. Domain connection must not implicitly publish an unreviewed build.
- [ ] Supply the owned domain and DNS access; do not purchase one. Choose canonical www/non-www. Use records actually supplied by the current Vercel dashboard, not guessed static IPs.
- [ ] With separate Production authorization, review the deliberate Production build guard and indexing policy, configure the verified origin, DNS, certificate/HTTPS and redirects, and verify canonical/hreflang/social image/sitemap/robots. Keep all Preview builds unindexed and protected.
- [ ] Run authenticated hosted regressions before/after approved launch and retain no unresolved confirmed High/Critical findings. Real Safari/iOS and assistive-technology checks remain explicitly bounded by actual test availability.

No Production deployment, domain purchase, paid feature, tracking service or backend mail form has been performed during this task.


## Security baseline release gate

- [ ] Review and land the security baseline branch through a PR; do not merge main as part of setup.
- [ ] Enforce the actual GitHub **Security gate** check and sensitive-file review; verify hosted execution, not only local actionlint.
- [ ] Enable/verify eligible free Dependabot alerts/security updates and decide CodeQL eligibility without purchasing a service.
- [ ] Close confirmed High/Critical and disposition Medium ZAP CSP style allowance before public launch.
- [ ] Complete [security/RELEASE_CHECKLIST.md](security/RELEASE_CHECKLIST.md) and [manual settings](security/MANUAL_SETTINGS.md). No new Production/domain authorization is implied.
