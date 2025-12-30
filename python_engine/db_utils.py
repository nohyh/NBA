import os
from pathlib import Path


def get_db_path() -> str:
    """Return the sqlite db path used by all sync scripts."""
    env_path = os.environ.get("NBA_DB_PATH")
    if env_path:
        return str(Path(env_path).expanduser().resolve())

    default_path = Path(__file__).resolve().parent.parent / "backend" / "prisma" / "dev.db"
    return str(default_path)
