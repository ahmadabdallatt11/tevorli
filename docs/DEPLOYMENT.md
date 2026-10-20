# Protected Preview and eventual domain connection

Work only on `preview/tevorli`. The owner authorizes a protected Preview, never Production, protection removal, custom domain purchase, paid features or unapproved integrations. Follow DEPLOYMENT_CHECKLIST.md and actual report evidence.

## Current deployment mechanism

The repository already has GitHub–Vercel integration: a previous commit exposes a successful Vercel status with a dashboard link for the `dentfiy/tevorli` project. Use the existing development-branch integration; do not create an anonymous temporary deployment or a new account/project as a shortcut. No protection setting has been changed. The owner reports Vercel Authentication is enabled.

`vercel.json` uses `npm run build:preview`. It rejects VERCEL_ENV=production and main/master, then emits Next static HTML/CSS/JS plus Vercel Build Output API v3 `.vercel/output/{config.json,static/}`. `npm run test:deployment` verifies fixed routes, custom 404/method guards, generated headers and nine approved image hashes in source/output. The local artifact-only `build:vercel` command never deploys and supports a pinned detached checkout.

Guarded Preview builds do not prove the remote project has no administrator override. Actual Production-branch/project settings require authorized Vercel inspection. No explicit Production deploy command is allowed.

## Preview URL and access evidence

The supplied previous URL `https://tevorli-mh3zk947z-dentfiy.vercel.app/` is an immutable deployment. It must not be presented as the new deployment automatically. Observe the status for the actual pushed commit, retain the dashboard target, and obtain its direct current application URL from authorized Vercel metadata/UI. A successful GitHub status proves only what the integration reports.

GitHub API/native Git now work. Vercel API returns forbidden, CLI is logged out and the optional personal token requirement has no saved binding. Tokens belong only in secure settings, never source/chat/browser. The application needs no credential. Git-based deployment itself can work through the existing integration without adding an app secret.

The earlier proxy block is resolved for the known owner-provided app host and dashboard. A fresh unauthenticated request to that prior immutable deployment completed TLS verification and returned HTTP 302 to `vercel.com/sso-api`; no application content was returned. Authorized application content and newest-deployment direct URL remain unverified without access. Saved network settings are separate from runtime; future immutable hosts may need their observed name added. Never disable or bypass protection to satisfy tests.

## Static security and delivery

Each build hashes its actual inline scripts for CSP. Never mix an older server/CSP with a newer export or inject/minify inline scripts after hashing. Stop only a prior test server you started, build, restart `npm start`, then test. Deploy only one matching completed `.vercel/output` artifact.

Script CSP uses self/hashes with no unsafe-inline/eval; style inline allowance is retained for framework compatibility. Generated headers include frame/MIME/referrer/permissions protection, COOP, HSTS and forced X-Robots-Tag. Preview metadata and robots also force noindex regardless of optional origin. **Noindex is not access control.** There are no app sessions, backend form, database, Server Actions, analytics or third-party application scripts. Quote routes offer user-initiated Gmail compose links, configured mail-app links and email-copy fallback; Gmail is ordinary navigation, not an SDK or backend provider. No CSP relaxation or Gmail embed was added.

Fixed own-property alias maps retain old service URLs; unknown URLs return HTTP 404, unsupported methods fail. Approved SVG/PNG/ICO/WebP assets are local; selected source bytes remain unchanged and fingerprints are checked. Image/code snippets from the attached kit did not replace app/security configuration. Fonts remain self-hosted/licensed. Next global-not-found is experimental and covered by regression tests.

## After owner review — separate release

Do not buy a domain. Obtain the owned domain, DNS access and www/non-www choice. Confirm legal/policy/responsible-operator/logging wording without inventing registration. Finish authenticated hosted regressions and resolve all confirmed High/Critical findings.

Only after explicit Production authorization, review the Production build guard/indexing policy, set the verified HTTPS public origin, use DNS records actually shown by Vercel, verify certificate/HTTPS/redirects and canonical/hreflang/social image/sitemap/robots, and rerun relevant hosted checks. Preserve Preview protection/noindex separately. Never enable paid protection/integrations automatically.
