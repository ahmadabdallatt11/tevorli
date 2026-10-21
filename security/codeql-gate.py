"""Gate CodeQL SARIF locally without publishing source snippets as artifacts."""
import json
from pathlib import Path
from gate import write_report

paths = list(Path("artifacts/codeql-raw").glob("*.sarif"))
if not paths:
    raise SystemExit("No CodeQL report: analysis is not verified")
findings = []
for path in paths:
    data = json.loads(path.read_text())
    if not data.get("runs"):
        raise SystemExit("Invalid/empty SARIF run")
    for run in data["runs"]:
        if any(not i.get("executionSuccessful", True) for i in run.get("invocations", [])):
            raise SystemExit("CodeQL analysis execution failed")
        rules = {r["id"]: r for r in run["tool"]["driver"]["rules"]}
        for result in run.get("results", []):
            rule = rules[result["ruleId"]]
            score = float(rule.get("properties", {}).get("security-severity", 0))
            location = result["locations"][0]["physicalLocation"]
            findings.append({"check_id": result["ruleId"], "path": location["artifactLocation"]["uri"], "start": {"line": location.get("region", {}).get("startLine", 0)}, "extra": {"severity": "ERROR" if result.get("level") == "error" else "WARNING", "metadata": {"security-severity": score}}})
# Same conservative severity/triage semantics, with a distinct tool identity.
raise SystemExit(write_report("codeql", {"results": findings, "errors": []}, Path("artifacts/security/codeql.json")))
