# Vercel Preview preparation

Read `DEPLOYMENT_CHECKLIST.md` for actionable access and protection prerequisites. The user authorizes only a protected Preview from a development branch, no custom domain and no paid service or Production deployment.

`npm run build:preview` builds Next's static export and `.vercel/output/{config.json,static/}` using Build Output API version 3. `vercel.json` selects no framework preset, frozen npm install, and this guarded build command. Vercel's official public source definitions for Build Output API were reviewed in the prior setup; the generated local manifest is verified again for this revision. Hosted execution is NOT VERIFIED until an authenticated, authorized deployment can run.

The build command rejects Production and main/master. Set the Vercel Production branch explicitly to main before linking an otherwise empty remote; never allow an initial import to publish the development branch as Production. Do not use `--prod` or anonymous temporary deployments.

Every export produces SHA-256 CSP hashes for its actual inline scripts, script-src self/hashes without unsafe-inline/unsafe-eval, style-src inline compatibility allowance, frame restrictions, MIME protection, HSTS, referrer/permissions policies and COOP. Header helper files are removed from the Vercel static payload. X-Robots-Tag and page metadata force noindex/nofollow; robots.txt disallows all crawling even when a public origin is configured. This is independent of actual Vercel access control.

Aliases preserve the previously generated service URLs using fixed same-origin 308 redirects. GET/HEAD serve static content; unsupported mutating methods are rejected. Unknown URLs return custom HTTP 404. The static application has no API, Server Actions, backend mail, account system, analytics, third-party scripts, customer records or secrets.

For local validation stop any prior server you started, build, and restart `npm start`; do not mix an older CSP with a newer export. Only a completed matching `.vercel/output` may be deployed. Don't inject analytics or rewrite/minify inline scripts after hashing. Vercel Compression/cache/TLS/protection/header behavior must be tested remotely rather than inferred from the local server.

Vercel authentication and project linkage are absent. Direct Vercel and GitHub API connections are currently denied by the cloud network proxy; required observed domain additions are saved as a draft, not applied runtime state. Securely authenticate/link the authorized account and repository after network settings propagate. Do not store tokens in README, `.env.example`, source or browser code. This application needs no runtime secret; the owner-approved email and Instagram are deliberately public contact data.

When authenticated, inspect existing project and free protection capabilities first. Enable protection before Preview deployment and test both logged-out rejection and authorized access, without disabling protection for tests. Stop if any step requires a plan upgrade or payment. Do not claim a protected Preview until the actual URL and observed access behavior are documented.

The Brand Kit ZIP has been supplied but exceeds the tool transfer limit of 32 MiB; it could not be downloaded/inspected. Direct SVG/PNG originals or a smaller archive are needed. Current text/blank favicon are placeholders. Legal registration and domain are unconfirmed; policy drafts describe these facts. Review those separately before public launch.
