# TEVORLI security baseline — QA verification

Observed run date: 2026-10-21 UTC. Branch: security/tevorli-baseline. Results are local unless explicitly stated; a GitHub-hosted workflow was not verified. No Production or main merge was performed.

| Check | Actual result |
| --- | --- |
| Frozen install | npm ci --ignore-scripts passed; package/lock unchanged |
| Static build | build:vercel passed; artifact only, not deployment |
| Deployment | 26 localized routes, root/404/method guard, strict headers and 9 asset checks passed |
| TypeScript / ESLint | Passed |
| Existing unit tests | 11 passed |
| Node security contracts | 14 passed; static headers/cookies, future-cookie negative controls and mock auth harness |
| Python security tests | 19 passed; includes actual eight-rule Semgrep fixtures, High/Critical gates, redaction and synthetic SARIF adapter |
| Semgrep CE | 8 local JS/TS/Python rules; 0 findings; not a claim to scan all registry rules |
| Gitleaks | History (non-shallow, fetched branches), worktree and compiled export passed, 0 findings |
| npm audit | 0 reported vulnerabilities, including development dependencies |
| actionlint / shellcheck | Passed; no disabled shell diagnostics |
| Isolated ZAP 2.17.0 | Completed with fatal operational warnings enabled; 1 Medium CSP style alert, 0 High/Critical; no suppression |
| Template parity | Canonical files and standalone SHA-256 manifest passed |
| Hosted GitHub Actions | NOT VERIFIED: API CONNECT 403; configuration and local commands are not a hosted workflow run |
| Actual CodeQL analysis | NOT EXECUTED; runs for public repos or owner-confirmed licensed opt-in; SARIF adapter tests are synthetic only |
| Dependabot alerts / branch protection | NOT VERIFIED or silently enabled; YAML config does not turn on alerts |
| Hosted Vercel / Safari / Firefox | NOT EXECUTED in this security-baseline task |

## Browser regression — full attempt and exact retest

All 13 routes in both languages are individual tests with the original status/title/description/lang/dir/link/overflow/axe assertions. This improves actionability and avoids grouping 13 URLs under one timeout. Total configured cases are **135** across desktop, Pixel 7 and iPad Mini Chromium profiles; CI uses two workers, this constrained local verification used one.

The full run started 2026-10-21T11:15:42.557Z and lasted 1324.4s: **134 passed, 1 timed out, 0 skipped, 0 flaky**. The tablet test timed out late in its 28-scenario layout/control matrix while Java ZAP was consuming most CPU. It resolved a visible Gmail control; no layout/security assertion failed. Initial evidence is preserved in artifacts/previous-release/baseline-full135.json and the retained failure trace.

After CPU-heavy tooling finished, the **exact same tablet matrix** was run alone, with its **unchanged 90-second timeout and assertions**: **1 passed, 0 failed**, test time 59.8s; runner duration 65.9s. Evidence: artifacts/playwright.json. No automatic retry or blanket suppression was added. Every configured case is covered by the full attempt plus exact successful retest; this is not misreported as one clean 135-case run.

All **78 localized axe scans** completed in the full attempt without configured WCAG 2 A/AA or 2.1 AA violations. Layout/CTA hit-testing covers 320/390/760/820/1024/1280/1440 widths in both languages; all 84 profile/scenario combinations are covered after the unchanged tablet retest. Existing 320/360/768/1024/1440 checks also pass. Chromium emulation/axe do not prove real Safari/Firefox/hardware or full WCAG conformance.

## Failed attempts, fixes and limits

- Initial batched-route browser run: 16 passed, 2 batch timeouts, 3 interrupted, 42 unrun. Replaced each multi-route batch with separate route cases, preserving all assertions. Final full attempt/retest results above supersede it, without hiding the record.
- Concurrent scanner/browser pressure caused transient rule-fixture and matrix timeouts. Final strict ZAP, 19 Python controls and matrix retest ran sequentially, matching CI separation/order. Expensive local scanners should not run concurrently with browser suites.
- Full ZAP image pull exhausted Docker layer storage; official bare image lacked Python baseline launcher. Used its actual Automation Framework engine instead. Failed attempts were not counted as completed scans.
- actionlint found empty assignment/readiness shell diagnostics and an initial image UID permission mismatch; fixed them without disabling checks/broadening host permissions.
- Gitleaks found two checksum-manifest false positives; confirmed file digests, changed manifest to explicit path/sha256 fields and rescanned without an allowlist.
- CodeQL adapter High/clean/missing-report tests do not establish actual CodeQL eligibility/execution. Actual GitHub Actions, alerts, settings and authenticated newest Vercel content require owner/admin access.
- No real customer records, credentials, email sends, external monitor, active/AJAX/public penetration scan or Production resources were used. Lighthouse was not rerun: this task changes CI/tooling/tests and preserves application content/runtime behavior. Prior performance evidence is not represented as a new measurement.

See SECURITY_AUDIT_REPORT.md for severity/evidence/dispositions, security/MANUAL_SETTINGS.md for exact external settings, and security/RELEASE_CHECKLIST.md before release. The baseline is ready for review, not proof that hosted enforcement or public launch is ready. A confirmed High/Critical or tool execution failure must block required CI checks.
