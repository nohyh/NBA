"""
Update game scores using NBA APIs.
"""
from __future__ import annotations

import sqlite3
import time
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import scoreboardv2

from db_utils import get_db_path


def update_from_live(cursor: sqlite3.Cursor) -> int:
    sb = scoreboard.ScoreBoard()
    games = sb.get_dict().get("scoreboard", {}).get("games", [])
    for game in games:
        game_id = game["gameId"]
        home_score = game["homeTeam"]["score"]
        away_score = game["awayTeam"]["score"]
        status = game["gameStatusText"]
        cursor.execute(
            """
            UPDATE Game
            SET homeTeamScore = ?, awayTeamScore = ?, status = ?
            WHERE gameId = ?
            """,
            (home_score, away_score, status, game_id),
        )
    return len(games)


def update_from_stats(cursor: sqlite3.Cursor, date_str: str, retries: int = 3) -> int:
    last_error = None
    for attempt in range(retries):
        try:
            sb = scoreboardv2.ScoreboardV2(game_date=date_str, timeout=60)
            header = sb.game_header.get_dict()
            headers = header["headers"]
            rows = header["data"]
            if not rows:
                return 0
            idx = {name: i for i, name in enumerate(headers)}
            for row in rows:
                game_id = row[idx["GAME_ID"]]
                status = row[idx["GAME_STATUS_TEXT"]]
                home_pts = row[idx["HOME_TEAM_PTS"]]
                away_pts = row[idx["VISITOR_TEAM_PTS"]]
                cursor.execute(
                    """
                    UPDATE Game
                    SET homeTeamScore = ?, awayTeamScore = ?, status = ?
                    WHERE gameId = ?
                    """,
                    (home_pts, away_pts, status, game_id),
                )
            return len(rows)
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if attempt < retries - 1:
                time.sleep(3)
                continue
            raise
    if last_error:
        raise last_error
    return 0


def main() -> None:
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Updating scores from live scoreboard...")
    live_count = update_from_live(cursor)
    print(f"Live games updated: {live_count}")

    # Backfill today and yesterday in ET to catch late-night games.
    et_today = datetime.now(ZoneInfo("America/New_York")).date()
    dates = [et_today, et_today - timedelta(days=1)]
    for d in dates:
        date_str = d.strftime("%m/%d/%Y")
        print(f"Updating scores from stats for {date_str}...")
        try:
            count = update_from_stats(cursor, date_str)
            print(f"Stats games updated: {count}")
        except Exception as exc:  # noqa: BLE001
            print(f"Stats update failed for {date_str}: {exc}")

    conn.commit()
    conn.close()
    print("Score update complete.")


if __name__ == "__main__":
    main()
