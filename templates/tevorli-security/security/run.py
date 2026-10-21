#!/usr/bin/env python3
"""Pinned tools, redacted artifacts and bounded isolated DAST. No cloud credentials."""
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import uuid
from gate import write_report

ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
REPORTS = ROOT / "artifacts/security"
REPORTS.mkdir(parents=True, exist_ok=True)


def image(name):
    value = (ROOT / f"security/images/{name}.Dockerfile").read_text().strip()
    match = re.fullmatch(r"FROM ([a-zA-Z0-9./:_-]+@sha256:[a-f0-9]{64})", value)
    if not match:
        raise ValueError(f"Unpinned image: {name}")
    return match[1]


def run(args, **kwargs):
    name = None
    if args[:2] == ["docker", "run"] and "--rm" in args and "--name" not in args:
        name = "tevorli-scan-" + uuid.uuid4().hex[:12]
        args = args[:2] + ["--name", name] + args[2:]
    try:
        return subprocess.run(args, capture_output=True, text=True, timeout=kwargs.pop("timeout", 600), **kwargs)
    except subprocess.TimeoutExpired:
        if name:
            subprocess.run(["docker", "rm", "-f", name], capture_output=True, timeout=30)
        raise


def require(result, allowed=(0,)):
    if result.returncode not in allowed:
        # Raw scanner logs can contain credential values or code snippets.
        raise RuntimeError(f"Tool execution failed (exit {result.returncode}); no clean result asserted")


def scan(tool):
    with tempfile.TemporaryDirectory(prefix="tevorli-security-") as tmp:
        raw = Path(tmp) / "report.json"
        common = ["docker", "run", "--rm", "--network=none", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user", f"{os.getuid()}:{os.getgid()}", "-v", f"{ROOT}:/src:ro", "-v", f"{tmp}:/reports", "-w", "/src"]
        if tool == "semgrep":
            args = ["semgrep", "scan", "--config", "/src/security/semgrep/rules.yml", "--metrics=off", "--disable-version-check", "--jobs", "2", "--timeout", "10", "--no-git-ignore", "--exclude", "node_modules", "--exclude", ".next", "--exclude", ".vercel", "--exclude", "out", "--exclude", "artifacts", "--exclude", "test-results", "--exclude", "templates", "--json", "--output", "/reports/report.json", "/src"]
            result = run(common + ["-e", "SEMGREP_SETTINGS_FILE=/tmp/tevorli-semgrep-settings.yml", "-e", "SEMGREP_LOG_FILE=/tmp/tevorli-semgrep.log", image("semgrep")] + args)
            require(result)
        elif tool in ("gitleaks", "gitleaks-worktree", "gitleaks-export"):
            if tool == "gitleaks":
                if subprocess.check_output(["git", "rev-parse", "--is-shallow-repository"], text=True).strip() != "false":
                    raise RuntimeError("Shallow history: fetch full history before the required secret scan")
                if int(subprocess.check_output(["git", "rev-list", "--all", "--count"])) < 1:
                    raise RuntimeError("No Git history to scan")
                mode = ["git", "--log-opts=--all", "/src"]
            elif tool == "gitleaks-export":
                if not (ROOT / "out/index.html").exists():
                    raise RuntimeError("Build required before export secret scan")
                mode = ["dir", "/src/out"]
            else:
                snapshot = Path(tmp) / "source"
                snapshot.mkdir()
                tracked = subprocess.check_output(["git", "ls-files", "-c", "-o", "--exclude-standard", "-z"]).decode().split("\0")
                for name in dict.fromkeys(tracked):
                    if not name:
                        continue
                    source = ROOT / name
                    if source.is_symlink() or not source.is_file():
                        raise ValueError("Unsafe/unreadable worktree entry")
                    target = snapshot / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(source, target)
                mode = ["dir", "/reports/source"]
            result = run(common + [image("gitleaks")] + mode + ["--config=/src/.gitleaks.toml", "--redact=100", "--no-banner", "--report-format=json", "--report-path=/reports/report.json"])
            require(result, (0, 1))
        elif tool == "audit":
            result = run(["npm", "audit", "--package-lock-only", "--json"], timeout=180)
            require(result, (0, 1))
            raw.write_text(result.stdout)
        else:
            raise ValueError("Unknown scan")
        if not raw.is_file():
            raise RuntimeError("Missing tool report")
        return write_report(tool, json.loads(raw.read_text()), REPORTS / f"{tool}.json")


def zap():
    # Images are pulled before isolation. The internal network has no Internet
    # route; neither the app nor the passive spider can reach public websites.
    network = "tevorli-security-" + uuid.uuid4().hex[:12]
    app = network + "-app"
    for name in ("node", "zap"):
        if run(["docker", "image", "inspect", image(name)]).returncode != 0:
            require(run(["docker", "pull", image(name)], timeout=600))
    require(run(["docker", "network", "create", "--internal", network]))
    try:
        require(run(["docker", "run", "-d", "--name", app, "--network", network, "--network-alias", "tevorli-test", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user", f"{os.getuid()}:{os.getgid()}", "--tmpfs", "/tmp", "-v", f"{ROOT}:/src:ro", "-w", "/src", image("node"), "node", "scripts/serve.mjs"]))
        for _ in range(30):
            probe = run(["docker", "exec", app, "node", "-e", "fetch('http://127.0.0.1:3000/en/').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"], timeout=10)
            if probe.returncode == 0:
                break
            time.sleep(1)
        else:
            raise RuntimeError("Isolated test server not ready")
        with tempfile.TemporaryDirectory(prefix="tevorli-zap-") as tmp:
            result = run(["docker", "run", "--rm", "--network", network, "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user", f"{os.getuid()}:{os.getgid()}", "-v", f"{ROOT}:/src:ro", "-v", f"{tmp}:/zap/wrk", "-w", "/zap/wrk", image("zap"), "zap.sh", "-cmd", "-silent", "-dir", "/tmp/tevorli-zap-home", "-autorun", "/src/security/zap/automation.yml"], timeout=420)
            require(result, (0, 1, 2))
            raw = Path(tmp) / "report.json"
            if not raw.is_file():
                raise RuntimeError("ZAP did not produce a report")
            return write_report("zap", json.loads(raw.read_text()), REPORTS / "zap.json")
    finally:
        run(["docker", "rm", "-f", app])
        run(["docker", "network", "rm", network])


def main():
    tool = sys.argv[1]
    if tool == "zap":
        return zap()
    if tool == "actionlint":
        result = run(["docker", "run", "--rm", "--network=none", "--user", f"{os.getuid()}:{os.getgid()}", "--cap-drop=ALL", "--security-opt=no-new-privileges", "-v", f"{ROOT}:/src:ro", "-w", "/src", image("actionlint"), "-color"] + [str(p.relative_to(ROOT)) for p in sorted((ROOT / ".github/workflows").glob("*.yml"))])
        # Workflow diagnostics contain paths, not app credentials.
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        (REPORTS / "actionlint.json").write_text(json.dumps({"tool": "actionlint", "status": "passed" if result.returncode == 0 else "failed", "exit_code": result.returncode}, indent=2) + "\n")
        return result.returncode
    return scan(tool)


if __name__ == "__main__":
    allowed = {"semgrep", "gitleaks", "gitleaks-worktree", "gitleaks-export", "audit", "zap", "actionlint"}
    if len(sys.argv) != 2 or sys.argv[1] not in allowed:
        print("Choose one supported security tool; invalid arguments are rejected", file=sys.stderr)
        raise SystemExit(2)
    try:
        raise SystemExit(main())
    except (ValueError, RuntimeError, subprocess.SubprocessError, OSError, KeyError) as error:
        name = sys.argv[1] if len(sys.argv) > 1 else "unknown"
        (REPORTS / f"{name}.json").write_text(json.dumps({"tool": name, "status": "execution_error", "error": str(error)}, indent=2) + "\n")
        print(f"{name}: execution error; see sanitized report", file=sys.stderr)
        raise SystemExit(2)
