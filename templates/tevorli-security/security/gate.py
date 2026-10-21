"""Normalize scanner output without source snippets/secret values; fail closed."""
import datetime
import hashlib
import json
from pathlib import Path

LEVELS = {"critical": 4, "high": 3, "medium": 2, "moderate": 2, "low": 1, "info": 0, "informational": 0}


def normalize(tool, data):
    findings = []
    if tool in ("semgrep", "codeql"):
        if not isinstance(data.get("results"), list) or data.get("errors"):
            raise ValueError("Semgrep incomplete/error report")
        if tool == "semgrep" and not data.get("paths", {}).get("scanned"):
            raise ValueError("Semgrep scanned no files")
        for result in data["results"]:
            extra = result.get("extra", {})
            score = float(extra.get("metadata", {}).get("security-severity", 0))
            severity = "critical" if score >= 9 else "high" if score >= 7 or extra.get("severity") == "ERROR" else "medium" if extra.get("severity") == "WARNING" else "low"
            findings.append({"id": result["check_id"], "path": result["path"], "line": result["start"]["line"], "severity": severity, "source_hash": hashlib.sha256(extra.get("lines", "").encode()).hexdigest()})
    elif tool.startswith("gitleaks"):
        if not isinstance(data, list):
            raise ValueError("Invalid Gitleaks report")
        for result in data:
            findings.append({"id": result["RuleID"], "path": result["File"], "line": result["StartLine"], "severity": "high", "revision": result.get("Commit", "worktree")})
    elif tool == "audit":
        if data.get("error") or not isinstance(data.get("vulnerabilities"), dict) or "metadata" not in data:
            raise ValueError("npm audit unavailable/incomplete")
        for name, result in data["vulnerabilities"].items():
            findings.append({"id": name, "path": "package-lock.json", "line": 0, "severity": result["severity"], "range": result.get("range"), "fix": result.get("fixAvailable"), "advisories": [v.get("url") for v in result.get("via", []) if isinstance(v, dict)]})
    elif tool == "zap":
        if not isinstance(data.get("site"), list) or not data["site"]:
            raise ValueError("ZAP did not scan the target")
        for site in data["site"]:
            if site.get("@host") != "tevorli-test":
                raise ValueError("Unexpected DAST host")
            for alert in site.get("alerts", []):
                risk = int(alert["riskcode"])
                findings.append({"id": str(alert["pluginid"]), "path": "isolated-test", "line": 0, "severity": {0: "info", 1: "low", 2: "medium", 3: "high"}[risk], "name": alert["name"], "solution": alert.get("solution", "")})
    else:
        raise ValueError("Unknown scanner")
    for finding in findings:
        if finding["severity"] not in LEVELS:
            raise ValueError("Unknown severity")
        source = Path(finding["path"].removeprefix("/src/"))
        resolved = source.resolve()
        root = Path(__file__).resolve().parent.parent
        if resolved.is_relative_to(root) and resolved.is_file():
            finding["source_hash"] = hashlib.sha256(resolved.read_bytes()).hexdigest()
        identity = json.dumps([tool, finding["id"], finding["path"], finding["line"], finding.get("source_hash"), finding.get("revision")])
        finding["fingerprint"] = hashlib.sha256(identity.encode()).hexdigest()
    return findings


def evaluate(tool, data, triage=None):
    findings = normalize(tool, data)
    exceptions = (triage or {}).get("false_positives", [])
    today = datetime.date.today()
    for exception in exceptions:
        required = ("tool", "fingerprint", "owner", "evidence", "review", "expires")
        if any(not exception.get(key) for key in required):
            raise ValueError("Incomplete false-positive review")
        expiry = datetime.date.fromisoformat(exception["expires"])
        if expiry < today or expiry > today + datetime.timedelta(days=90):
            raise ValueError("Expired or excessive false-positive review period")
    for finding in findings:
        finding["disposition"] = "open"
        if any(e["tool"] == tool and e["fingerprint"] == finding["fingerprint"] for e in exceptions):
            finding["disposition"] = "reviewed_false_positive"
    blocked = [f for f in findings if LEVELS[f["severity"]] >= 3 and f["disposition"] == "open"]
    return {"tool": tool, "status": "failed" if blocked else "passed", "blocking": len(blocked), "findings": findings, "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}


def write_report(tool, data, output):
    triage = json.loads(Path("security/triage.json").read_text())
    report = evaluate(tool, data, triage)
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    Path(output).write_text(json.dumps(report, indent=2) + "\n")
    print(f"{tool}: {report['status']}; {len(report['findings'])} findings, {report['blocking']} blocking")
    return 1 if report["blocking"] else 0
