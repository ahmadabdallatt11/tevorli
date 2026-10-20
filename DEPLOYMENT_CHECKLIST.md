# TEVORLI deployment checklist

Target: protected **Vercel Preview** on branch `preview/tevorli`. No custom domain, Production deployment, purchase or paid feature is authorized.

## Local preparation

- [x] Approved email/Instagram integrated; no invented phone/WhatsApp/address.
- [x] Five grouped standalone services and Request a Quote; no internal shop-system integration.
- [x] Approved palette, Inter/Cairo; no replacement logo.
- [x] Development branch `preview/tevorli` created and successfully pushed to `origin`; remote ref verified. No main branch was written. The initially empty remote has no main ref yet; explicitly configure the intended Production branch before Vercel import. main/master remain guarded from Preview builds.
- [x] Vercel Build Output API v3, per-build CSP, error routes and method guard prepared.
- [x] Preview noindex meta, X-Robots-Tag and robots.txt, independent of optional origin.
- [x] No application secrets/customer data/backend contact submissions.
- [ ] Original Brand Kit/logo/T assets usable in workspace. The uploaded archive exceeds the 32 MiB transfer limit; provide a smaller archive or direct SVG/transparent PNG assets.
- [ ] Remote source branch linked to Vercel (see final reports for push/access outcome).

## Access required

- [ ] Permit cloud egress to `api.vercel.com` and `api.github.com`. Both currently return proxy HTTP 403.
- [ ] Authenticate Vercel in this environment securely and select the intended account/team/project. CLI currently reports logged out; no VERCEL_TOKEN binding/project link exists. Do not paste credentials in chat.
- [ ] Ensure GitHub access permits the intended Vercel Git integration for `ahmadabdallatt11/tevorli`. A Git read alone does not establish API, write or integration permissions.
- [ ] If external link validation is wanted, allow `www.instagram.com`; current direct request is blocked by the environment policy.
- [ ] For Firefox/WebKit installation allow `cdn.playwright.dev` and `playwright.download.prss.microsoft.com`, plus any destination actually reported by a subsequent supported download. Do not disable TLS verification.

Required observed domains have been added to the cloud environment **draft**, preserving package-manager presets. Review/save in environment settings and publish the development environment to activate the reusable configuration. Draft saving is not runtime permission propagation, Vercel deployment or website publication.

## Protected Preview flow — not yet executed

1. Use an existing eligible project/plan without enabling charges. Inspect Git linkage, project ID and account/team first; verify the remote development commit.
2. Set the intended Production branch to `main` and use the development branch only for Preview. The initial remote was empty, so do not let an initial import silently assign the development branch as Production. The checked-in build guard intentionally refuses Production builds.
3. Enable the available no-extra-cost **Vercel Authentication/Deployment Protection** for all relevant preview URLs. If the available protection requires payment, stop and request the user's explicit decision. Do not deploy an anonymously accessible temporary preview as a workaround.
4. Inspect Preview-scoped variables by name/presence only. This static app needs no application secret. Store deployment credentials securely; keep all values out of repository and browser bundles. Leave the custom domain unset.
5. Deploy the reviewed development commit explicitly to Preview (never `--prod`). Do not enable analytics, injected scripts, databases, paid integrations or a mail backend.
6. Verify the resulting URL is HTTPS and matches the intended project/commit. Verify that an unauthenticated browser cannot access the site (login challenge/401/403 as appropriate) and an authorized session can. Do not report noindex as access protection.
7. Run hosted status/headers/TLS, RTL/LTR, all internal routes/aliases, contact links, responsive, axe, browser-console/CSP and Lighthouse checks using authorized access. Preserve protection during testing; don't disable it just to make a scanner connect.
8. Record the actual URL, project/commit, protection settings, results and unverified checks in both reports. No URL or hosted protection result is available yet.

## Production — separate future authorization

- [ ] Approved original logo assets and final content sign-off.
- [ ] Legal operator identity and qualified privacy/terms review, including external email/Instagram processing and hosting logs/retention.
- [ ] Purchased/verified domain supplied by owner; do not buy one.
- [ ] Hosted testing complete and no unresolved confirmed Critical/High findings.
- [ ] Explicit Production authorization before changing the build guard/indexing policy or deploying.
