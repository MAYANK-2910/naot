import unittest
from pathlib import Path
from unittest.mock import Mock, call, patch

from run import main


class LauncherTests(unittest.TestCase):
    @patch("run.shutil.which", return_value=None)
    def test_reports_missing_docker(self, _which: object) -> None:
        with patch("builtins.print") as print_message:
            result = main()

        self.assertEqual(result, 2)
        self.assertIn("Docker was not found.", print_message.call_args.args[0])

    @patch("run.shutil.which", return_value="docker")
    @patch("run.subprocess.run")
    def test_reports_missing_compose_plugin(self, run_process: Mock, _which: Mock) -> None:
        run_process.return_value.returncode = 1
        run_process.return_value.stderr = "compose plugin missing"

        with patch("builtins.print") as print_message:
            result = main()

        self.assertEqual(result, 1)
        self.assertEqual(run_process.call_args.args[0], ["docker", "compose", "version"])
        self.assertTrue(
            any("Docker Compose is unavailable." in item.args[0] for item in print_message.call_args_list)
        )

    @patch("run.shutil.which", return_value="docker")
    @patch("run.subprocess.run")
    def test_runs_compose_and_returns_its_exit_code(self, run_process: Mock, _which: Mock) -> None:
        run_process.return_value.returncode = 0

        with patch("builtins.print"):
            result = main()

        self.assertEqual(result, 0)
        self.assertEqual(
            run_process.call_args_list,
            [
                call(
                    ["docker", "compose", "version"],
                    capture_output=True,
                    text=True,
                    check=False,
                ),
                call(
                    ["docker", "compose", "up", "--build"],
                    cwd=Path(__file__).resolve().parents[2],
                    check=False,
                ),
            ],
        )


if __name__ == "__main__":
    unittest.main()
