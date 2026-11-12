"""Start the complete app stack through Docker Compose."""

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    if sys.version_info < (3, 9):
        print("Python 3.9 or newer is required to run this launcher.", file=sys.stderr)
        return 2

    docker = shutil.which("docker")
    if docker is None:
        print(
            "Docker was not found. Install Docker Desktop (Windows/macOS) or "
            "Docker Engine with the Compose plugin (Linux), then run this file again.",
            file=sys.stderr,
        )
        return 2

    compose_check = subprocess.run(
        [docker, "compose", "version"],
        capture_output=True,
        text=True,
        check=False,
    )
    if compose_check.returncode:
        print(
            "Docker Compose is unavailable. Update Docker Desktop or install the "
            "Docker Compose plugin, then run this file again.",
            file=sys.stderr,
        )
        if compose_check.stderr:
            print(compose_check.stderr.strip(), file=sys.stderr)
        return compose_check.returncode

    print("Starting the app and local Python backend. Open http://localhost:8080")
    print("Press Ctrl+C to stop the services.\n")

    try:
        return subprocess.run(
            [docker, "compose", "up", "--build"],
            cwd=Path(__file__).resolve().parent,
            check=False,
        ).returncode
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
