import os
import sqlite3
from pathlib import Path


def get_db_path() -> str:
    """Return the sqlite db path used by all sync scripts."""
    env_path = os.environ.get("NBA_DB_PATH")
    if env_path:
        return str(Path(env_path).expanduser().resolve())

    default_path = Path(__file__).resolve().parent.parent / "backend" / "prisma" / "dev.db"
    return str(default_path)


def connect_db(timeout=30):
    """Open sqlite connection with WAL + busy timeout for concurrent access."""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path, timeout=timeout)
    try:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
        conn.execute(f"PRAGMA busy_timeout={int(timeout * 1000)}")
    except Exception:
        # Best-effort pragmas; continue even if unsupported.
        pass
    return conn
