# TEVORLI — reusable security baseline audit

Observed run date: 2026-10-21 UTC. Working branch: `security/tevorli-baseline`, based on `preview/tevorli` commit bd31fdf. This is configuration/tooling and local isolated application review, not a Production deployment or certification. No main merge, database change, domain purchase, paid feature, protection change, public penetration test or outgoing email/social message was performed.

## Architecture and scope

Next.js 16.4.2 App Router, React 19.3.1, TypeScript 6.0.3, Node 24.19.0/npm 11.9.0, Zod, self-hosted Inter/Cairo and static export. There are 13 routes in each of Arabic/English, an Arabic root and a global 404. Vercel Build Output API v3 emits fixed routing/headers/aliases; the local Node server is an isolated test runtime, not the intended hosted production server. Preview builds reject Production/main/master and keep meta/HTTP/robots noindex. Noindex is not access control.

No application authentication/session, database, API route, Server Action, form submission, analytics, payment or customer data exists. Quote choices are fixed-recipient user-initiated Gmail/mailto/copy/Instagram navigation. Vercel Authentication is a separate existing hosting control, not app RBAC. No auth/database/API scan is falsely claimed against a nonexistent feature.

Existing controls inspected: Zod origin/locale validation, fixed route/service allowlists and prototype-safe aliases, encoded/bounded quote subjects, no raw HTML input, per-build script hashes, CSP/header generation, safe local paths/methods and error handling, no static app cookies, approved-asset fingerprints, browser CSP/input/keyboard/RTL tests, existing dependency lock and supplemental secret signatures. Initial checkout had no `.github/` workflows/Dependabot or permanent Semgrep/Gitleaks setup.

## Findings and classification

| ID | Severity | Evidence | Status / remediation |
| --- | --- | --- | --- |
| TV-SEC-001 | Medium | Initial checkout lacked `.github/workflows` and no enforced recurring security gate was verified | Workflow, final gate and weekly scans implemented; hosted run and branch/ruleset enforcement remain owner/admin tasks |
| TV-SEC-002 | Low | `scripts/secret-scan.mjs` used a short signature list and excluded Git history | Supplemented by real Gitleaks upstream detection, full non-shallow Git history, working-tree and exported-build scopes; old checker is supplemental, not a Gitleaks substitute |
| TV-SEC-003 | Low | Existing HTTP checks required presence of several headers but did not fully reject weak script sources/cookie regressions | Added strict static policy assertions and negative tests for unsafe-inline/eval/wildcards/external script sources, missing headers, weak HSTS and unexpected cookies |
| TV-SEC-004 | Medium | Actual isolated ZAP 2.17.0 alert **10055: CSP style-src unsafe-inline**; existing export policy retains it | Open retained framework-compatibility risk; no untrusted HTML/style input. Owner: TEVORLI maintainer. Review before launch or 2026-11-20. Release acceptance pending; not hidden or falsely labeled fixed |
| TV-SEC-005 | Medium verification gap | GitHub API/GraphQL CONNECT 403 prevents reading visibility/licensing, alert/rule settings and remote Actions/PR results | Exact manual settings documented. Checked-in YAML is not proof of enabled alerts, protected branches or a passing hosted workflow |
| TV-SEC-006 | Medium verification gap | Newest protected hosted app/settings and hosting-auth cookie behavior not independently verified in this task | Owner-authorized hosted verification required; local HTTP ZAP and app-cookie N/A are not Vercel authentication/TLS evidence |

Pre-commit tooling self-review also fixed two local robustness issues: unsupported CLI arguments could select an error-report filename (now rejected before any filename construction), and the standalone CodeQL SARIF adapter did not create its output directory (now created and tested with High/clean/missing-report fixtures). These were unreleased local-tooling issues, not remotely exposed website flaws.

No confirmed Critical/High application vulnerability remains known within the executed scope. This is not a claim of zero unknown vulnerabilities. Untriaged scanner High/Critical results conservatively fail required jobs. Real High/Critical risks cannot be waived as accepted risks through `triage.json`.

### False positives and failed attempts

- Gitleaks initially reported two generic-api-key matches in the new template checksum manifest. They were verified SHA-256 file digests, not credentials. Manifest serialization now uses explicit `path`/`sha256` records. Re-scan passed without a credential allowlist or detector suppression; no real credential required rotation.
- The full ZAP image pull exceeded available Docker layer storage. The official pinned **bare** image fits and contains ZAP 2.17.0 plus Automation Framework. It lacks the Python `zap-baseline.py` launcher: that attempt exited 127 and was **not** counted as a scan. Replaced the launcher with the official Automation Framework spider/passive-wait/report/exit-status plan; the real completed passive scan is the evidence below. No active/AJAX attack job was added.
- Initial actionlint caught shell empty-variable/readiness diagnostics; fixed the workflow. An image-user read permission issue was fixed with the host UID/GID, without broad filesystem permissions.
- An initial rules smoke test timed out under concurrent image/resource pressure; explicit two-worker Semgrep budgets, offline containers and owned-container timeout cleanup were added. Negative controls must still execute and match the expected rules.
- The final parallel-tool attempt also exhausted the tablet matrix deadline while ZAP saturated CPU. Serialized verification matched CI job ordering: strict ZAP completed, all 19 security controls passed, then the identical matrix passed with its original 90-second timeout and assertions.
- The initial monolithic browser test grouped 13 routes under one timeout during resource contention: 2 batch timeouts, 16 passes, 3 interrupted and 42 unrun. It is not a successful run. Every route is now a separate case with the same status/SEO/link/layout/axe assertions, and the resource-limited local rerun uses one worker. CI uses two on its separate runner. No security assertion, scan or browser route was removed.

## Implemented tools and boundaries

- **Semgrep CE 1.181.0:** eight versioned local JavaScript/TypeScript/Python core rules, offline/no metrics; real unsafe fixtures cover eval/raw HTML/DOM sinks/TLS bypass/public secret variables/shell boundaries/privileged PR triggers/Python evaluation. This is a bounded core set, not all proprietary/registry rules or ASVS coverage. Add reviewed product-specific rules for new architectures.
- **Gitleaks 8.30.1:** upstream default rules, 100% redaction, non-shallow Git history and compiled export; local worktree snapshots include uncommitted canonical/template files. No global secret allowlist. Temp raw reports are removed; only safe location/rule/severity/fingerprint data is retained. Actual secret detection would require authorized rotation, not merely deletion.
- **npm audit:** full pinned lock including dev dependencies, with registry/incomplete-report errors failing closed. This does not scan the Node executable, OS image CVEs or unpublished malicious packages.
- **Dependabot:** npm, GitHub Actions and Docker image updates configured weekly to the observed default branch preview/tevorli. Dependency graph/vulnerability alerts/security updates still need admin verification/activation; YAML alone cannot enable them.
- **CodeQL:** read-only visibility-gated JavaScript/TypeScript/Python security-extended workflow with no application autobuild and a severity gate. `upload: never` prevents granting untrusted PR code a security-events write token; only a sanitized artifact is published. Native Code Scanning alert publication is not enabled. Local CLI execution, repo visibility and licensing are unverified. Do not enable paid private-repo Code Security without approval.
- **OWASP ZAP 2.17.0:** completed passive scan with a traditional bounded spider, using a fresh internal Docker network with **no external egress**, synthetic static app and no public target/auth bypass. No active scan, AJAX crawling, logged-in scanner or full penetration test is claimed.
- **Application controls:** strict success/error header and CSP assertions, no app-cookie assertion, malformed/prototype/XSS/query/path/method tests, browser inline-script blocking and quote-recipient/redirect controls. Reusable cookie and six-category auth harness tests use mock/seeded synthetic identities only. Static profile fails on unreviewed API introduction; real app RBAC/JWT/tenant tests are N/A until such features exist.
- **Monitoring:** uptime/5xx/certificate/security-job notification and incident/log-retention recommendations are documented only; no external monitor, paid feature or message was enabled.

## Actual verification results

Tool reports are sanitized in `artifacts/security/` and generated by the current tool runs, not fabricated stubs. Docker images and Actions are immutable; provenance is in `security/tool-provenance.json` and `security/images/`.

| Check | Result |
| --- | --- |
| Frozen install | PASS: npm ci --ignore-scripts --no-audit --no-fund; no dependency/lockfile changes |
| Local static production artifact build | PASS: npm run build:vercel; no deploy command |
| Deployment manifest/assets | PASS: 26 localized routes, root/404, method guard, strict headers and 9 original asset hashes |
| TypeScript / ESLint / existing units | PASS / PASS / 11 passed |
| Node security contracts | 14 passed; includes insecure-cookie/header and auth-harness bypass negative controls, not real product sessions |
| Python gate/rule controls | 19 passed in the final sequential run, including actual eight-rule negative controls, redaction, zero-file/error handling, CLI path guard and synthetic CodeQL adapter cases |
| Semgrep core | PASS; eight rules, 0 findings; valid nonempty scan, parser/tool errors fail |
| Gitleaks | PASS history/worktree/export, 0 findings after checksum-format correction |
| npm audit | PASS; 0 known vulnerabilities reported, including dev dependencies |
| actionlint | PASS with shellcheck diagnostics enabled |
| ZAP | Completed; 1 Medium alert type, 0 High/Critical; no alerts suppressed |
| Browser regression | Full 135-case run: 134 passed, 1 aggregate-matrix timeout, 0 skipped; exact failed case then passed unchanged in isolation (59.8s). No single all-green 135-case run is claimed |
| Template parity | PASS; canonical files and standalone manifest synchronized |
| GitHub-hosted Actions | NOT VERIFIED: API access blocked; actionlint/local tools are not a hosted run |
| CodeQL | NOT EXECUTED; opt-in configuration only, eligibility/access unresolved |
| Dependabot alerts / branch rules | NOT VERIFIED or silently enabled |
| Hosted Vercel/real Safari/Firefox | NOT EXECUTED in this baseline task; no cross-browser/hosting guarantee |

Pinned upstream CodeQL action metadata was inspected through native Git after raw-file access returned 404. Its annotated tag was dereferenced to the actual commit, upload is explicitly `never`, and interpreted languages use separate matrix jobs because build-mode is supported for one language per job. These are configuration checks, not a claim of actual CodeQL analysis.

## GitHub Actions and release gates

`.github/workflows/security.yml` runs PRs, relevant development/release pushes, Monday 04:23 UTC schedule and manual dispatch. Feature-branch pushes rely on PR events to avoid duplicate scans. No path filters bypass checks; concurrency cancels obsolete runs. Source and application jobs are independent; final **Security gate** requires both and the optional CodeQL job when enabled. Build artifacts are reused inside the application job. npm lifecycle scripts are disabled at install and audit is not duplicated by install. No continue-on-error policy hides failures.

All jobs have contents:read or no token permissions; no deployment/cloud secret, write-capable PR trigger, persisted checkout credential, automatic merge or Production job exists. Only sanitized scanner summaries are generic artifacts, retained 14 days. CODEOWNERS must be enforced by actual rules; code alone cannot assert reviewer identity. Default-branch schedule/Dependabot activation requires landing the reviewed files there.

## Remaining actions and release decision

Read **security/MANUAL_SETTINGS.md** for exact GitHub/Vercel paths and **security/RELEASE_CHECKLIST.md** for promotion gates. Owner/admin must review and land the PR, run real hosted CI on its exact SHA, enable eligible/free alerts, enforce branch/ruleset/CODEOWNERS settings, determine CodeQL eligibility and explicitly handle its unavailable/disabled status, accept/remediate the retained Medium CSP risk, and verify the actual protected deployment. Do not change Production/DB/security settings or buy services to complete this task.

The reusable template is at `templates/tevorli-security/`, with AGENTS.md, workflows/config, SECURITY.md, policy, onboarding/checklists/report format and a parity manifest. It must be adapted to each product's actual framework, auth/API/tenant/data risk; copying it does not implement SaaS security.

**Baseline implemented for review; enforcement/hosted CI and public release are not yet verified or approved.** Unknown issues remain possible; no 100%-secure, ASVS-certified or full penetration-test claim is made.
