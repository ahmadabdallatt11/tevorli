# Security policy

The current protected Preview and its latest reviewed dependency lock are maintained; there is no public Production release yet. Older Preview deployments are not maintained application releases. Client projects must publish their own supported-version window.

Report suspected vulnerabilities privately to **tevorli.digital.solutions@gmail.com** with the affected URL/version, concise impact, non-destructive reproduction and remediation ideas. Do not include passwords, tokens or customer data, publish exploit details in an issue, or test systems/accounts you do not own. If a credential is exposed, stop using it and arrange revocation/rotation through its owner; deleting the string is insufficient. No response-time/SLA promise or bug-bounty payment is established.

Testing authorization is limited to the local isolated environment and explicitly authorized systems. Do not perform aggressive public scans, brute force, denial of service, social engineering or data extraction. Preserve Vercel Preview Authentication.

Confirmed Critical/High vulnerabilities block release. Scanner severity is an initial signal; untriaged High/Critical results fail closed pending protected review. Exact documented false positives may be reclassified with evidence/owner/expiry; actual High/Critical risks cannot be accepted through the exception file. Medium/Low issues require an owner, disposition and target date. See [security policy](security/POLICY.md), [release checklist](security/RELEASE_CHECKLIST.md) and [report format](security/REPORT_TEMPLATE.md).
