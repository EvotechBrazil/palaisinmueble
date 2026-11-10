#!/usr/bin/env python3
"""Portable reader and optional Impeccable engine entrypoint for any agent."""

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

# Python uses the symlink's directory as sys.path[0] on some launch paths.
BASE = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(BASE / "scripts"))
from lp_design_support import validate_package


COMMANDS = (
    "shape", "init", "document", "extract", "critique", "audit", "polish",
    "bolder", "quieter", "distill", "harden", "onboard", "animate", "colorize",
    "typeset", "layout", "delight", "overdrive", "clarify", "adapt", "optimize",
    "live", "generate", "craft",
)
UTILITIES = ("hooks", "doctor")


def run_engine(arguments):
    if not arguments:
        print("Use: lp-design engine <verb> [arguments]", file=sys.stderr)
        return 2
    errors = validate_package(BASE)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    launcher = BASE / "vendor/impeccable/scripts" / (
        "impeccable.cmd" if os.name == "nt" else "impeccable")
    env = os.environ.copy()
    env["IMPECCABLE_SKILL_DIR"] = str(BASE / "vendor/impeccable")
    if env.get("IMPECCABLE_LIVE_COPY_AGENT") != "off":
        env["IMPECCABLE_LIVE_COPY_AGENT"] = "chat"
    command = [str(launcher)] + arguments
    # Detection may launch a browser. Use the local global queue when present.
    queue = shutil.which("heavy")
    if arguments[0] == "detect" and queue:
        command.insert(0, queue)
    try:
        return subprocess.call(command, env=env)
    except OSError as exc:
        print("Impeccable engine unavailable: " + str(exc), file=sys.stderr)
        return 127


def main(arguments=None):
    arguments = sys.argv[1:] if arguments is None else arguments
    if arguments and arguments[0] == "engine":
        return run_engine(arguments[1:])
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action")
    sub.add_parser("path", help="Print the canonical skill directory")
    sub.add_parser("list", help="List the 24 design commands")
    sub.add_parser("verify", help="Verify all bundled upstream files offline")
    show = sub.add_parser("show", help="Print portable instructions for an agent")
    show.add_argument("command", nargs="?", choices=COMMANDS + UTILITIES + ("teach",))
    args = parser.parse_args(arguments)
    if args.action == "path":
        print(BASE)
    elif args.action == "list":
        print(json.dumps({"commands": COMMANDS, "utilities": UTILITIES,
                          "alias": {"teach": "init"}}, ensure_ascii=False, indent=2))
    elif args.action == "verify":
        errors = validate_package(BASE)
        print("\n".join(errors) if errors else "OK: 66 upstream files verified.")
        return 1 if errors else 0
    elif args.action == "show":
        print("Skill base directory: " + str(BASE))
        print((BASE / "SKILL.md").read_text())
        print((BASE / "references/impeccable.md").read_text())
        if args.command:
            command = "init" if args.command == "teach" else args.command
            playbook = BASE / "vendor/impeccable/reference" / (command + ".md")
            print("\nUpstream playbook: " + str(playbook))
            print(playbook.read_text())
    else:
        parser.print_help()
        print("\nEngine: lp-design engine <verb> [arguments]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
