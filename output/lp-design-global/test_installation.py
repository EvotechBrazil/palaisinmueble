"""Exercise real installation behavior only in temporary, isolated user homes."""

import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

sys.dont_write_bytecode = True
PACKAGE = Path(__file__).resolve().parent / "lp-design"
sys.path.insert(0, str(PACKAGE / "scripts"))
spec = importlib.util.spec_from_file_location("global_installer", PACKAGE / "scripts/install-global.py")
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)
from lp_design_support import global_links, validate_package


class InstallationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="lp-design-test-")
        self.root = Path(self.temp.name)
        self.home = self.root / "user home with spaces"

    def tearDown(self):
        self.temp.cleanup()

    def install(self, source=PACKAGE, apply=True):
        with contextlib.redirect_stdout(io.StringIO()):
            return installer.install(source, self.home, apply)

    def test_dry_run_makes_no_home_changes(self):
        self.install(apply=False)
        self.assertFalse(self.home.exists())

    def test_all_global_links_share_one_source_and_cli_runs_through_symlink(self):
        self.install()
        canonical = self.home / ".grok/skills/lp-design"
        self.assertEqual(validate_package(canonical), [])
        for _, destination, target in global_links(self.home, canonical):
            self.assertTrue(destination.is_symlink(), str(destination))
            self.assertEqual(destination.resolve(), target.resolve())
        result = subprocess.run([str(self.home / ".local/bin/lp-design"), "list"],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(len(data["commands"]), 24)
        for command in data["commands"]:
            result = subprocess.run([str(self.home / ".local/bin/lp-design"), "show", command],
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(str(canonical), result.stdout)

    def test_reinstall_does_not_create_another_backup(self):
        first = self.install()
        second = self.install()
        self.assertIsNotNone(first)
        self.assertIsNone(second)
        self.assertEqual(len(list((self.home / ".local/state/lp-design/backups").iterdir())), 1)

    def test_conflicting_originals_are_saved_without_losing_content(self):
        canonical = self.home / ".grok/skills/lp-design"
        canonical.mkdir(parents=True)
        (canonical / "SKILL.md").write_text("Original global skill")
        conflict = self.home / ".claude/skills/lp-design"
        conflict.mkdir(parents=True)
        (conflict / "custom.txt").write_text("Preserve custom files")
        old_target = self.root / "previous engine"
        old_target.mkdir()
        old_link = self.home / ".agents/skills/impeccable"
        old_link.parent.mkdir(parents=True)
        old_link.symlink_to(old_target)
        backup = self.install()
        journal = json.loads((backup / "journal.json").read_text())
        snapshots = {e["destination"]: Path(e["backup"]) for e in journal if e["backup"]}
        self.assertEqual((snapshots[str(canonical)] / "SKILL.md").read_text(), "Original global skill")
        self.assertEqual((snapshots[str(conflict)] / "custom.txt").read_text(), "Preserve custom files")
        self.assertTrue(snapshots[str(old_link)].is_symlink())
        self.assertEqual(snapshots[str(old_link)].resolve(), old_target.resolve())

    def test_partial_install_failure_restores_originals(self):
        canonical = self.home / ".grok/skills/lp-design"
        canonical.mkdir(parents=True)
        (canonical / "SKILL.md").write_text("Original survives rollback")
        existing = self.home / ".agents/skills/lp-design"
        existing.parent.mkdir(parents=True)
        existing.symlink_to(canonical)
        original_symlink = Path.symlink_to

        def fail_claude(path, *args, **kwargs):
            if ".claude" in path.parts:
                raise OSError("Simulated denied write")
            return original_symlink(path, *args, **kwargs)

        with mock.patch.object(Path, "symlink_to", fail_claude):
            with self.assertRaisesRegex(OSError, "Simulated denied write"):
                self.install()
        self.assertEqual((canonical / "SKILL.md").read_text(), "Original survives rollback")
        self.assertTrue(existing.is_symlink())
        self.assertEqual(existing.resolve(), canonical.resolve())
        self.assertFalse((self.home / ".agents/skills/impeccable").is_symlink())
        self.assertFalse((self.home / ".local/state/lp-design/install.lock").exists())

    def test_corrupt_upstream_is_rejected_before_installation(self):
        corrupt = self.root / "corrupt source"
        shutil.copytree(PACKAGE, corrupt)
        (corrupt / "vendor/impeccable/reference/polish.md").write_text("corrupted")
        with self.assertRaisesRegex(ValueError, "integrity mismatch"):
            self.install(source=corrupt)
        self.assertFalse(self.home.exists())

    def test_global_check_detects_broken_link(self):
        self.install()
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(installer.check(self.home), 0)
        (self.home / ".cursor/skills/lp-design").unlink()
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(installer.check(self.home), 1)

    def test_engine_forwards_literal_arguments_environment_and_exit_status(self):
        fake_engine = self.root / "fake engine"
        fake_engine.write_text(
            "#!/usr/bin/env python3\nimport os,sys,json\n"
            "print(json.dumps({'args':sys.argv[1:], 'agent':os.getenv('IMPECCABLE_LIVE_COPY_AGENT'),"
            "'skill':os.getenv('IMPECCABLE_SKILL_DIR')}))\nraise SystemExit(2)\n")
        fake_engine.chmod(0o755)
        env = dict(os.environ, IMPECCABLE_BIN=str(fake_engine), IMPECCABLE_LIVE_COPY_AGENT="other-cli")
        argument = "$(touch should-not-exist); quoted ' value"
        result = subprocess.run([sys.executable, str(PACKAGE / "scripts/lp-design.py"),
                                 "engine", "engine-probe", argument], env=env,
                                cwd=self.root, capture_output=True, text=True)
        self.assertEqual(result.returncode, 2, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["args"], ["engine-probe", argument])
        self.assertEqual(data["agent"], "chat")
        self.assertEqual(data["skill"], str(PACKAGE / "vendor/impeccable"))
        self.assertFalse((self.root / "should-not-exist").exists())
        env["IMPECCABLE_LIVE_COPY_AGENT"] = "off"
        result = subprocess.run([sys.executable, str(PACKAGE / "scripts/lp-design.py"),
                                 "engine", "engine-probe"], env=env, capture_output=True, text=True)
        self.assertEqual(json.loads(result.stdout)["agent"], "off")


if __name__ == "__main__":
    unittest.main(verbosity=2)
