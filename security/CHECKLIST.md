# Developer security checklist

- [ ] Threat model and project risk/profile match the actual code and data.
- [ ] No credentials, customer data, raw tokens or sensitive logs in source, fixtures or reports.
- [ ] Dependency lock reviewed; scanner/action/image pins verified and update PRs tested.
- [ ] Server validation, contextual output encoding and safe database queries where applicable.
- [ ] Authorization is checked server-side for every role, tenant, owner and operation; negative and positive cases use synthetic accounts.
- [ ] API limits, schema/content-type/body-size validation, safe errors and abuse controls proportionate to risk.
- [ ] Session lifetime/logout/rotation/CSRF and Secure/HttpOnly/SameSite cookies tested where applicable; CORS is not authorization.
- [ ] CSP/headers checked on success/error responses; no unnecessary external resources or cookies.
- [ ] SAST, history/export secrets, dependency audit, relevant app tests and isolated DAST executed; errors/skips distinguished.
- [ ] High/Critical findings resolved or exact false positives independently reviewed; other risks assigned/dated.
- [ ] No loss of existing functionality, RTL/LTR, keyboard/mobile or reduced-motion behavior.
- [ ] Logs, monitoring, incident owner, backup/restore/data deletion considered for stateful projects.
- [ ] Template/policy changes synchronized and protected by review.
