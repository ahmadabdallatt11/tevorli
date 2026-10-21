# Security release checklist

## Required evidence

- [ ] Current exact commit and intended artifact identified; matching tests/build pass.
- [ ] GitHub-hosted Security gate passed on the PR/current head, not just a local simulation; branch/ruleset enforcement verified.
- [ ] Semgrep core + product-specific rules, Gitleaks history/export and npm audit completed without execution errors.
- [ ] No open/untriaged High/Critical finding; exact false-positive evidence/owner/expiry protected by review.
- [ ] Isolated ZAP completed; every Medium/Low disposition recorded, no public scans or protection bypass.
- [ ] Real auth/authorization/input/API/cookie tests completed for stateful products, or documented static N/A with profile regression guard.
- [ ] Applicable CodeQL executed if eligible/enabled; unavailable licensing or missing permissions explicitly recorded.
- [ ] Actual hosted HTTPS/headers/protection and authorized application flows verified on the current deployment.
- [ ] Dependency/alert state, repository rules and Vercel environment/Production branch reviewed by an authorized owner.
- [ ] Regression/a11y/RTL/LTR/mobile/browser gaps documented; no customer data/secrets in reports.
- [ ] Policies, monitoring/incident ownership and stateful backup/restore plan accepted as applicable.

## Promotion boundary

- [ ] Owner explicitly approves this specific Production/domain release. Preview review is not Production approval.
- [ ] Domain/DNS/certificate/origin/canonical/indexing changes planned and reviewed; Preview stays protected and noindex.
- [ ] Rollback artifact and post-release smoke/security checks defined.

This task authorizes code/CI/template work only. No Production deployment, merge to main, domain purchase, paid service or production-setting/database change is performed by this checklist.
