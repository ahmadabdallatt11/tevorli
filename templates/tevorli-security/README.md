# Reusable TEVORLI security starter

This directory is a self-contained copy of the canonical tested baseline, including AGENTS.md, workflows, Docker image pins, Semgrep/Gitleaks/CodeQL/ZAP configuration, runner/gate tests, SECURITY.md and developer/release/reporting documentation. MANIFEST.json verifies parity. Do not copy the current product or its public contacts blindly into a client product.

1. Copy `.github`, `.gitleaks.toml`, AGENTS.md, SECURITY.md and `security/` into the client repository.
2. Replace owner/contact/branch/repository/product identifiers and choose risk/architecture in security/project.json. Review CODEOWNERS and GitHub plan/visibility manually.
3. Map Node/toolchain/build/start commands to the product. Current workflow expects `.node-version`, a frozen npm lock, build:vercel/test:deployment/test:e2e/test:security and the scripts/serve.mjs static server. Other frameworks require reviewed equivalent commands and a local isolated DAST server. Missing commands should fail, not silently skip.
4. Keep image/action pins and test the scanner negative controls, gate redaction and error paths. Root policy/source changes must be made in the canonical files, then synchronized before release. In a client copy, make its baseline canonical and generate its own template only if needed.
5. After adaptation run `python3 security/template.py sync` and `python3 security/template.py check` so the workflow parity check has a verified client-specific snapshot. This creates a single nonrecursive mirror; it does not copy application code.
6. Adapt the static-profile test before adding APIs; implement actual synthetic-account server tests. Do not leave false N/A auth/database/API claims in a stateful app.

| Product | Starting risk scope | Required adaptation |
| --- | --- | --- |
| Brochure / standalone QR menu | Risk-based ASVS L1, static by default | Headers/CSP, content integrity, safe links, public-data-only, dependency/secrets gates |
| QR menu with admin/backend | L2 for admin/data boundaries | Admin authentication, CRUD ownership, upload limits, CSRF/session/input controls |
| Loyalty system | L2 plus fraud modelling | Customer consent/data minimization, role/ownership checks, redemption/replay/rate-limit tests, audit trail |
| Multi-tenant SaaS | L2 plus selected L3 controls | Tenant isolation/IDOR, RBAC, session lifecycle, webhook signatures, abuse controls, migrations/backups/restore and incident handling |

No blanket production-readiness, licensing, monitoring, auth implementation or ASVS compliance is provided by copying this starter. Follow security/ONBOARDING.md and MANUAL_SETTINGS.md; require real current-head CI and deployment verification.
