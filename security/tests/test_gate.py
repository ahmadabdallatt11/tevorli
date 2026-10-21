import datetime
import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from gate import evaluate


def sast(score=8.1, severity="ERROR"):
    return {"paths": {"scanned": ["app/example.ts"]}, "errors": [], "results": [{"check_id": "test-rule", "path": "app/example.ts", "start": {"line": 4}, "extra": {"severity": severity, "metadata": {"security-severity": score}, "lines": "sensitive fixture must never appear"}}]}


class GateTests(unittest.TestCase):
    def test_high_blocks(self):
        self.assertEqual(evaluate("semgrep", sast())["blocking"], 1)

    def test_critical_blocks(self):
        self.assertEqual(evaluate("semgrep", sast(9.8))["status"], "failed")

    def test_medium_reports_without_high_gate(self):
        result = evaluate("semgrep", sast(5.0, "WARNING"))
        self.assertEqual(result["status"], "passed")
        self.assertEqual(len(result["findings"]), 1)

    def test_parse_error_is_not_clean(self):
        with self.assertRaises(ValueError):
            evaluate("semgrep", {"results": [], "errors": [{"type": "parse error"}]})

    def test_incomplete_report_is_not_clean(self):
        with self.assertRaises(ValueError):
            evaluate("audit", {})

    def test_registry_error_is_not_clean(self):
        with self.assertRaises(ValueError):
            evaluate("audit", {"error": {"summary": "registry unavailable"}})

    def test_dependency_high_including_dev_blocks(self):
        result = evaluate("audit", {"metadata": {}, "vulnerabilities": {"fixture": {"severity": "high", "via": [], "isDirect": False}}})
        self.assertEqual(result["blocking"], 1)

    def test_secret_is_blocked_and_never_copied_to_report(self):
        result = evaluate("gitleaks", [{"RuleID": "generic-api-key", "File": "fixture", "StartLine": 1, "Secret": "sensitive fixture", "Match": "sensitive fixture"}])
        self.assertEqual(result["blocking"], 1)
        self.assertNotIn("sensitive fixture", json.dumps(result))

    def test_code_snippets_are_not_exported(self):
        self.assertNotIn("sensitive fixture", json.dumps(evaluate("semgrep", sast())))

    def test_expired_disposition_fails(self):
        review = {"tool": "semgrep", "fingerprint": "fixture", "owner": "security-owner", "evidence": "No untrusted input", "review": "protected review", "expires": "2020-01-01"}
        with self.assertRaises(ValueError):
            evaluate("semgrep", sast(), {"false_positives": [review]})

    def test_exact_evidenced_false_positive_only(self):
        finding = evaluate("semgrep", sast())["findings"][0]
        review = {"tool": "semgrep", "fingerprint": finding["fingerprint"], "owner": "security-owner", "evidence": "Inspected isolated fixture; not reachable from app", "review": "protected review URL", "expires": (datetime.date.today() + datetime.timedelta(days=7)).isoformat()}
        self.assertEqual(evaluate("semgrep", sast(), {"false_positives": [review]})["status"], "passed")
        changed = sast()
        changed["results"][0]["start"]["line"] = 5
        self.assertEqual(evaluate("semgrep", changed, {"false_positives": [review]})["status"], "failed")

    def test_zap_high_blocks(self):
        result = evaluate("zap", {"site": [{"@host": "tevorli-test", "alerts": [{"riskcode": "3", "pluginid": "fixture", "name": "Synthetic high"}]}]})
        self.assertEqual(result["blocking"], 1)

    def test_zap_no_target_is_not_clean(self):
        with self.assertRaises(ValueError):
            evaluate("zap", {"site": []})

    def test_zap_external_target_is_rejected(self):
        with self.assertRaises(ValueError):
            evaluate("zap", {"site": [{"@host": "example.com", "alerts": []}]})

    def test_codeql_high_blocks(self):
        self.assertEqual(evaluate("codeql", sast())["blocking"], 1)

    def test_zero_scanned_files_is_not_clean(self):
        with self.assertRaises(ValueError):
            evaluate("semgrep", {"paths": {"scanned": []}, "results": [], "errors": []})

    def test_invalid_runner_argument_cannot_choose_report_path(self):
        import subprocess
        result = subprocess.run([sys.executable, "security/run.py", "../../tevorli-path-escape-fixture"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertFalse(Path("tevorli-path-escape-fixture.json").exists())

    def test_codeql_sarif_adapter_blocks_high_and_creates_safe_report(self):
        import subprocess
        import tempfile
        script = Path("security/codeql-gate.py").resolve()
        with tempfile.TemporaryDirectory(prefix="tevorli-codeql-test-") as tmp:
            root = Path(tmp)
            (root / "security").mkdir()
            (root / "security/triage.json").write_text('{"false_positives": []}')
            raw = root / "artifacts/codeql-raw"
            raw.mkdir(parents=True)
            data = {"runs": [{"tool": {"driver": {"rules": [{"id": "fixture-rule", "properties": {"security-severity": "8.1"}}]}}, "results": [{"ruleId": "fixture-rule", "message": {"text": "sensitive fixture"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "fixture.ts"}, "region": {"startLine": 1}}}]}]}]}
            report = raw / "fixture.sarif"
            report.write_text(json.dumps(data))
            blocked = subprocess.run([sys.executable, str(script)], cwd=root, capture_output=True, text=True)
            self.assertEqual(blocked.returncode, 1)
            summary = (root / "artifacts/security/codeql.json").read_text()
            self.assertNotIn("sensitive fixture", summary)
            self.assertEqual(json.loads(summary)["blocking"], 1)
            data["runs"][0]["results"] = []
            report.write_text(json.dumps(data))
            self.assertEqual(subprocess.run([sys.executable, str(script)], cwd=root, capture_output=True).returncode, 0)
            report.unlink()
            self.assertNotEqual(subprocess.run([sys.executable, str(script)], cwd=root, capture_output=True).returncode, 0)
