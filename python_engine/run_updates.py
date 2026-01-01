import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

from db_utils import get_db_path

BASE_DIR = Path(__file__).resolve().parent

TASKS = {
    "live": [
        ("sync_games.py", []),  # Use CDN API (more reliable) to update game status/scores
        ("update_scores.py", []),  # Fallback to stats API for live scores
        ("sync_game_logs.py", []),
        ("sync_quarter_scores.py", []),
    ],
    "daily": [
        ("sync_team_stats.py", []),
        ("sync_player_stats.py", []),
        ("sync_news.py", []),
    ],
    "weekly": [
        ("sync_player_profiles.py", []),
        ("sync_team_history.py", []),
        ("update_team_colors.py", []),
        ("sync_history_game_logs.py", []),
    ],
}


def run_script(script_name, args=None, env=None):
    args = args or []
    script_path = BASE_DIR / script_name
    if not script_path.exists():
        print(f"[warn] Script not found: {script_path}")
        return False
    cmd = [sys.executable, str(script_path)] + args
    print(f"\n==> Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, env=env)
    if result.returncode != 0:
        print(f"[error] {script_name} failed with code {result.returncode}")
        return False
    return True


def run_preset(preset, env):
    for script_name, args in TASKS.get(preset, []):
        run_script(script_name, args=args, env=env)


def run_once(preset, env):
    if preset == "all":
        for group in ("live", "daily", "weekly"):
            run_preset(group, env)
    else:
        run_preset(preset, env)


def run_loop(preset, env, live_interval, daily_interval, weekly_interval, tick):
    if preset == "all":
        groups = [
            ("live", live_interval),
            ("daily", daily_interval),
            ("weekly", weekly_interval),
        ]
    else:
        interval_map = {
            "live": live_interval,
            "daily": daily_interval,
            "weekly": weekly_interval,
        }
        groups = [(preset, interval_map[preset])]

    last_run = {name: 0 for name, _ in groups}

    print("\nScheduler started.")
    while True:
        now = time.time()
        for name, interval in groups:
            if now - last_run[name] >= interval:
                print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] Running {name} tasks...")
                run_preset(name, env)
                last_run[name] = time.time()
        time.sleep(tick)


def main():
    parser = argparse.ArgumentParser(description="Run NBA data sync tasks.")
    parser.add_argument("--mode", choices=["once", "loop"], default="once")
    parser.add_argument("--preset", choices=["live", "daily", "weekly", "all"], default="daily")
    parser.add_argument("--live-interval", type=int, default=600)
    parser.add_argument("--daily-interval", type=int, default=86400)
    parser.add_argument("--weekly-interval", type=int, default=604800)
    parser.add_argument("--tick", type=int, default=10)
    args = parser.parse_args()

    db_path = get_db_path()
    env = os.environ.copy()
    env.setdefault("NBA_DB_PATH", db_path)
    print(f"Using DB: {db_path}")

    if args.mode == "once":
        run_once(args.preset, env)
    else:
        run_loop(args.preset, env, args.live_interval, args.daily_interval, args.weekly_interval, args.tick)


if __name__ == "__main__":
    main()
