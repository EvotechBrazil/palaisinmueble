#!/usr/bin/env python3
"""Install one global lp-design source with backups and links for supported agents."""

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sys
import uuid

BASE = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(BASE / "scripts"))
from lp_design_support import global_links, link_matches, same_package, validate_package


def exists(path):
    return path.exists() or path.is_symlink()


def remove_installed(path):
    if path.is_dir() and not path.is_symlink():
        shutil.rmtree(path)
    else:
        path.unlink(missing_ok=True)


def check(home):
    canonical = home / ".grok/skills/lp-design"
    errors = validate_package(canonical)
    errors.extend("Missing or different link: " + str(destination)
                  for _, destination, target in global_links(home, canonical)
                  if not link_matches(destination, target))
    print("\n".join(errors) if errors else "OK: global source, provider links and CLI verified.")
    return 1 if errors else 0


def install(source, home, apply=False):
    source, home = Path(source).resolve(), Path(home).expanduser().absolute()
    errors = validate_package(source)
    if errors:
        raise ValueError("\n".join(errors))
    canonical = home / ".grok/skills/lp-design"
    if canonical in source.parents:
        raise ValueError("The package source cannot be inside the installation being replaced.")
    replace_source = source != canonical.resolve() and not same_package(source, canonical)
    links = global_links(home, canonical)
    actions = []
    if replace_source:
        actions.append(("tree", canonical, None))
    for _, destination, target in links:
        if not link_matches(destination, target):
            actions.append(("link", destination, target))
    print("Source: " + str(source))
    print("Global: " + str(canonical))
    if not actions:
        print("Already installed; no changes needed.")
        return None
    for kind, destination, target in actions:
        detail = " <- " + str(target) if kind == "link" else " (package)"
        print(("BACKUP + " if exists(destination) else "CREATE ") + str(destination) + detail)
    if not apply:
        print("Dry run. Add --apply to install. No files were changed.")
        return None
    if os.name == "nt":
        raise ValueError("Automated global installation supports macOS/Linux. Use the portable files on Windows.")

    state = home / ".local/state/lp-design"
    state.mkdir(parents=True, exist_ok=True)
    lock = state / "install.lock"
    try:
        lock.mkdir()
    except FileExistsError:
        raise ValueError("Another installation may be running: " + str(lock))
    transaction = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid.uuid4().hex[:8]
    backup = state / "backups" / transaction
    stage = canonical.parent / (".lp-design-stage-" + transaction)
    journal = []
    try:
        backup.mkdir(parents=True)
        if replace_source:
            canonical.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(source, stage, ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".DS_Store"))
            stage_errors = validate_package(stage)
            if stage_errors:
                raise ValueError("\n".join(stage_errors))
            (stage / "scripts/lp-design.py").chmod(0o755)
            (stage / "vendor/impeccable/scripts/impeccable").chmod(0o755)
        for kind, destination, target in actions:
            destination.parent.mkdir(parents=True, exist_ok=True)
            record = {"destination": str(destination), "backup": None, "installed": False}
            journal.append(record)
            if exists(destination):
                saved = backup / (str(len(journal)).zfill(3))
                os.replace(destination, saved)
                record["backup"] = str(saved)
            if kind == "tree":
                os.replace(stage, destination)
            else:
                destination.symlink_to(target, target_is_directory=target.name != "lp-design.py")
            record["installed"] = True
        (backup / "journal.json").write_text(json.dumps(journal, indent=2) + "\n")
    except BaseException as original:
        rollback_errors = []
        for record in reversed(journal):
            try:
                destination = Path(record["destination"])
                if record["installed"]:
                    remove_installed(destination)
                if record["backup"]:
                    os.replace(record["backup"], destination)
            except OSError as exc:
                rollback_errors.append(str(exc))
        if rollback_errors:
            (backup / "rollback-errors.json").write_text(json.dumps(
                {"journal": journal, "errors": rollback_errors}, indent=2) + "\n")
            raise RuntimeError("Installation failed; some paths need recovery from " + str(backup)) from original
        raise
    finally:
        if stage.exists():
            shutil.rmtree(stage)
        lock.rmdir()
    print("Installed. Backup: " + str(backup))
    print("Reload the agents to refresh their skill catalogs.")
    print("Portable CLI: " + str(home / ".local/bin/lp-design"))
    print("No shell profile, trust setting or hook was changed.")
    return backup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--home", type=Path, default=Path.home(), help="Target user home; useful for testing")
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--apply", action="store_true", help="Apply the printed installation plan")
    modes.add_argument("--check", action="store_true", help="Verify an existing global installation")
    args = parser.parse_args()
    try:
        if args.check:
            return check(args.home.expanduser().absolute())
        install(BASE, args.home, args.apply)
        return 0
    except (OSError, ValueError, RuntimeError) as exc:
        print("Installation did not complete: " + str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
