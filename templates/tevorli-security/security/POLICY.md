# Finding and release-gate policy

| Severity | Practical impact | Gate and response |
| --- | --- | --- |
| Critical | System/tenant compromise, exposed production credentials, destructive unauthorized access | Block release; contain/revoke through authorized owner; immediate triage |
| High | Exploitable XSS/injection/auth bypass/IDOR, exploitable high dependency issue, secret detector result pending triage | Block release; remediate and retest before promotion |
| Medium | Defense-in-depth/control gaps or constrained exploitability | Record owner, evidence, remediation and target date, normally within 30 days |
| Low | Hardening/documentation improvements with limited impact | Track with owner and target date, normally within 90 days |

Scanner severity is an initial signal. Untriaged High/Critical findings conservatively block; do not assert they are confirmed exploitable merely from a scanner. Missing/error reports, parse failures and unavailable registries/tools fail required jobs rather than masquerade as passes. Gitleaks findings default High pending private review. npm high/critical includes development dependencies. Semgrep security scores >=7 or ERROR block; CodeQL security scores use the same thresholds. ZAP riskcode 3 blocks (the scanner's highest category); Medium/Low/Info stay visible without being silently ignored.

A narrowly evidenced false positive can be recorded in `triage.json` with tool, exact report fingerprint bound to source/hash or Git revision, owner, evidence, protected review and expiry (at most 90 days). Do not add broad paths/rules/regex allowlists or suppressions. A real High/Critical risk cannot be accepted as a false positive. CODEOWNERS plus enforced branch/ruleset review is essential: the file cannot verify a reviewer's identity by itself. Review location/source changes and invalidate dispositions as appropriate; re-triage on expiry. Medium/Low accepted risks belong in the audit with owner, reason, compensating control, target/expiry and approval. No machine exceptions are present initially.

Retained Medium compatibility risk (maintainer release acceptance pending): CSP style-src retains unsafe-inline for framework compatibility. It can amplify a CSS injection if one is introduced; no untrusted HTML/style input exists in this static architecture. Scripts remain self + exact SHA-256 hashes, without unsafe-inline/eval. Owner: TEVORLI maintainer; review before public launch or 2026-11-20, whichever comes first. Do not relax CSP to silence ZAP or break the site to remove a framework allowance without regression testing.

Review all source and policy/tool updates. Action/image pins prevent silent version drift but also require Dependabot/manual review, runtime compatibility and testing. The local core rule set is intentionally bounded, not a comprehensive ASVS audit. Every new product needs threat modelling and appropriate domain-specific rules.
