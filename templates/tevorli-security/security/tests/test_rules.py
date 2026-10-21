"""Generate malicious fixtures outside source; prove the actual Semgrep rules fire."""
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from run import ROOT, image, run


class RuleTests(unittest.TestCase):
    def test_actual_semgrep_negative_controls(self):
        with tempfile.TemporaryDirectory(prefix="tevorli-rule-tests-") as tmp:
            root = Path(tmp)
            (root / "unsafe.tsx").write_text('''
import { exec as shell } from 'node:child_process';
eval(untrusted);
new Function(untrusted);
const view = <div dangerouslySetInnerHTML={untrusted} />;
element.innerHTML = untrusted;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const options = { rejectUnauthorized: false };
const secret = process.env.NEXT_PUBLIC_PRIVATE_KEY;
shell(untrusted);
''')
            (root / "unsafe.py").write_text("import subprocess\nsubprocess.run(untrusted, shell=True)\n")
            workflows = root / ".github/workflows"
            workflows.mkdir(parents=True)
            (workflows / "unsafe.yml").write_text("on:\n  pull_request_target:\njobs: {}\n")
            result = run(["docker", "run", "--rm", "--network=none", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user", f"{os.getuid()}:{os.getgid()}", "-e", "SEMGREP_SETTINGS_FILE=/tmp/tevorli-semgrep-settings.yml", "-e", "SEMGREP_LOG_FILE=/tmp/tevorli-semgrep.log", "-v", f"{ROOT}:/src:ro", "-v", f"{tmp}:/fixtures:ro", "-w", "/fixtures", image("semgrep"), "semgrep", "scan", "--config", "/src/security/semgrep/rules.yml", "--metrics=off", "--disable-version-check", "--jobs", "2", "--timeout", "10", "--no-git-ignore", "--json", "."], timeout=120)
            self.assertEqual(result.returncode, 0, "Rule execution failed; raw logs intentionally not printed")
            data = json.loads(result.stdout)
            self.assertEqual(data.get("errors"), [])
            ids = {r["check_id"].split("tevorli.")[-1] for r in data["results"]}
            self.assertEqual(ids, {"no-eval", "no-raw-react-html", "no-dom-html-sink", "no-tls-bypass", "no-public-secret-variable", "no-shell-exec", "no-privileged-pr-trigger", "python-no-code-or-shell-evaluation"})
