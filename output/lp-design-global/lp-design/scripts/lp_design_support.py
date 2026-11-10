"""Shared, dependency-free package validation and global path definitions."""

import hashlib
import json
from pathlib import Path


PROVIDERS = (
    ("Agent Skills / Codex / Replit", ".agents/skills"),
    ("Codex", ".codex/skills"),
    ("Claude Code", ".claude/skills"),
    ("Grok", ".grok/skills"),
    ("Gemini CLI", ".gemini/skills"),
    ("Google Antigravity", ".gemini/config/skills"),
    ("Cursor", ".cursor/skills"),
    ("OpenCode", ".config/opencode/skills"),
    ("GitHub Copilot CLI", ".copilot/skills"),
    ("Hermes Agent", ".hermes/skills"),
)


def validate_package(base):
    """Check the distributed upstream bytes against Git blob IDs before use."""
    base = Path(base)
    required = (
        "SKILL.md", "THIRD_PARTY.md", "references/wiring.md",
        "references/impeccable.md", "scripts/lp-design.py",
        "scripts/lp_design_support.py", "scripts/install-global.py",
    )
    errors = ["Missing " + name for name in required if not (base / name).is_file()]
    vendor = base / "vendor/impeccable"
    try:
        manifest = json.loads((vendor / "upstream-manifest.json").read_text())
    except (OSError, ValueError) as exc:
        return errors + ["Cannot read upstream manifest: " + str(exc)]
    for entry in manifest["files"]:
        path = vendor / entry["path"]
        if path.is_symlink() or vendor.resolve() not in path.resolve().parents:
            errors.append("Invalid upstream path: " + entry["path"])
            continue
        try:
            data = path.read_bytes()
        except OSError:
            errors.append("Missing upstream file: " + entry["path"])
            continue
        digest = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        if len(data) != entry["size"] or digest != entry["git_blob_sha1"]:
            errors.append("Upstream integrity mismatch: " + entry["path"])
    return errors


def global_links(home, canonical):
    home, canonical = Path(home), Path(canonical)
    links = []
    for provider, folder in PROVIDERS:
        root = home / folder
        if root / "lp-design" != canonical:
            links.append((provider, root / "lp-design", canonical))
        links.append((provider + " / engine", root / "impeccable",
                      canonical / "vendor/impeccable"))
    links.append(("Portable CLI", home / ".local/bin/lp-design",
                  canonical / "scripts/lp-design.py"))
    return links


def link_matches(destination, target):
    return destination.is_symlink() and destination.resolve() == target.resolve()


def same_package(first, second):
    """Compare complete package contents, ignoring only interpreter/cache debris."""
    def snapshot(root):
        values = {}
        for path in Path(root).rglob("*"):
            relative = path.relative_to(root)
            if "__pycache__" in relative.parts or path.name == ".DS_Store" or path.suffix == ".pyc":
                continue
            if path.is_symlink():
                values[str(relative)] = ("link", str(path.readlink()))
            elif path.is_file():
                values[str(relative)] = ("file", hashlib.sha256(path.read_bytes()).hexdigest())
        return values
    return second.is_dir() and snapshot(first) == snapshot(second)
