# TEVORLI security baseline

This baseline is source-controlled configuration, not a certification. Read POLICY.md, MANUAL_SETTINGS.md and RELEASE_CHECKLIST.md. `AGENTS.md` applies to every significant change. The current site is a Next.js/React/TypeScript **static export**, hosted on a protected Vercel Preview. It has no application auth, database, API, submission form, session cookie or customer data. Vercel Authentication is a separate boundary and remains enabled.

## Repeatable checks

Node from `.node-version`, Docker Engine, Python 3 (standard library) and Git are required. Linux/GitHub Ubuntu are the tested runners; Windows developers should use WSL2 with Linux containers. No application/cloud credential is needed. Docker scanner images are pinned by digest in `security/images/*.Dockerfile`; the files are also Dependabot Docker inputs. Dependabot updates npm, Actions and images weekly; no automatic merge is configured.

```sh
npm ci --ignore-scripts --no-audit --no-fund
python3 security/run.py actionlint
python3 -m unittest discover -s security/tests -p 'test_*.py' -v
node --test security/tests/*.test.mjs
python3 security/run.py semgrep
python3 security/run.py gitleaks             # all locally available Git history
python3 security/run.py gitleaks-worktree    # local uncommitted source; CI Git scan already covers its commit
python3 security/run.py audit                # includes dev dependencies; registry errors fail closed
npm run typecheck
npm run lint
npm test
npm run build:vercel                         # local artifact build, never deploys
npm run test:deployment
python3 security/run.py gitleaks-export
python3 security/run.py zap                  # passive DAST, internal Docker network, synthetic data only
npm run test:e2e                             # matching local build; Chromium + existing axe tests
python3 security/template.py check
```

For `npm run test:security`, start `npm start` against the matching export first; stop only your own server before rebuilding. CI builds once and reuses that export for browser/HTTP/export-secret/DAST checks. No PR receives deployment or customer credentials. Playwright defaults to the workspace's system Chromium; CI sets `CHROMIUM_PATH=` to use its explicitly installed Playwright browser.

## Scope and reports

- Semgrep CE uses **reviewed local JavaScript/TypeScript/Python core rules**, not a claim to run all registry/proprietary rules. Real negative-control fixtures prove the rules detect eval/raw HTML/DOM sinks/TLS bypass/public secret variables/shell boundaries/privileged PR triggers and Python dynamic/shell/TLS bypass. Extend and test rules for each product's languages and threat model.
- Gitleaks uses upstream default detection, full checked-out history and exported static files as distinct scopes. Local worktree scanning covers uncommitted files. The old custom signature scanner is supplemental only. Detection is not revocation or history rewriting.
- npm audit covers the pinned lock, including dev dependencies. It cannot attest to private/unpublished vulnerabilities or malicious packages.
- ZAP is a **passive baseline** with a bounded traditional spider; no active attack, AJAX spider, login bypass or public target. The app and ZAP share a fresh `--internal` Docker network with no external route. All alerts remain enabled. Automation errors/warnings stop the plan; report generation must complete before a severity gate can pass. Medium alert severity itself remains visible and non-blocking under policy. HTTP in this isolated network does not prove hosted TLS or browser behavior. Cookie flags have reusable negative tests; the static app must set no cookies.
- Auth/role/tenant/session tests are **not applicable to this static app**. The profile test fails if an API route appears without adaptation. `auth-contract.mjs` is a tested loopback-only harness for future products, with six deny/allow categories and synthetic token references. Its mock-server tests are not evidence of a real product's authorization.
- CodeQL is a **visibility-gated workflow job**, not claimed executed locally. It runs automatically when GitHub identifies the repository as public; private/internal repositories require the explicit TEVORLI_CODEQL_ENABLED flag only after entitlement/permissions are confirmed. No autobuild or application install executes in its read-only job. See MANUAL_SETTINGS.md.

Sanitized JSON reports go to `artifacts/security/`. No raw source snippets, secret matches, credential values or auth cookies are uploaded as generic artifacts. Gitleaks uses 100% redaction; raw reports live in temporary directories and are removed. Reports identify rule/file/line/severity and exact triage fingerprints. Keep artifacts for 14 days; restrict access and use synthetic data. Tool/parse/registry failures are errors, not clean scans. CI failures remain failures even though artifact upload runs afterwards.

## Workflow design

One workflow runs on all PRs, pushes to main/master/develop/development/preview/**/release/**, weekly Monday 04:23 UTC and manual dispatch. Feature branches use the PR event rather than duplicate push scans. Newer runs cancel obsolete runs on the same PR/ref. The schedule activates only after the workflow lands on the default branch. Static source and application jobs run independently; an always-running final **Security gate** requires both and, when enabled, CodeQL to succeed. No path filter can silently omit a security check.

Actions are immutable SHA pins verified from upstream Git tags; scanner images use immutable digests. Permissions default to contents:read, checkout does not persist credentials, and no deployment credentials are provided. The non-building CodeQL job also has a read-only token; no PR job gets security-events write access. No pull_request_target, privileged workflow_run, automatic merge, production deployment or issue-comment script interpolation is used. Fork PRs get no cloud secrets. Review changes to the workflow, runners, policy, triage and template as security-sensitive code.
