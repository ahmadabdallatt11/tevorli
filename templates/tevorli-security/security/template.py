#!/usr/bin/env python3
"""Generate/check a standalone template from the tested canonical baseline."""
import hashlib
import json
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "templates/tevorli-security"


def sources():
    files = [ROOT / "AGENTS.md", ROOT / "SECURITY.md", ROOT / ".gitleaks.toml"]
    files += [p for p in (ROOT / ".github").rglob("*") if p.is_file()]
    files += [p for p in (ROOT / "security").rglob("*") if p.is_file() and "__pycache__" not in p.parts and p.suffix != ".pyc"]
    return files


def main():
    if sys.argv[1] not in ("sync", "check"):
        raise SystemExit("Use sync or check")
    manifest = {}
    for source in sources():
        relative = source.relative_to(ROOT)
        manifest[str(relative)] = hashlib.sha256(source.read_bytes()).hexdigest()
        destination = TARGET / relative
        if sys.argv[1] == "sync":
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
        elif not destination.is_file() or source.read_bytes() != destination.read_bytes():
            raise SystemExit(f"Template drift: {relative}")
    record = TARGET / "MANIFEST.json"
    if sys.argv[1] == "sync":
        record.write_text(json.dumps([{"path": name, "sha256": digest} for name, digest in manifest.items()], indent=2) + "\n")
    elif {item["path"]: item["sha256"] for item in json.loads(record.read_text())} != manifest:
        raise SystemExit("Template manifest drift")
    if sys.argv[1] == "check":
        actual = {str(p.relative_to(TARGET)) for p in TARGET.rglob("*") if p.is_file() and "__pycache__" not in p.parts} - {"README.md", "MANIFEST.json"}
        expected = set(manifest) - {"README.md"}
        if actual != expected:
            raise SystemExit("Unexpected/stale template files; review before removing")
    print(f"Template {sys.argv[1]}: {len(manifest)} canonical files verified")


if __name__ == "__main__":
    main()
