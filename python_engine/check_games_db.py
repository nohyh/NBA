import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check for games on 2025-12-25
date_str = '2025-12-25'
# The Game table stores datetime, but let's check how it is stored exactly.
# Based on schema it is DateTime, usually stored as seconds or ISO string in SQLite by Prisma.
# Let's check a few records to see format.
cursor.execute("SELECT gameDate FROM Game LIMIT 1")
print(f"Sample date format: {cursor.fetchone()[0]}")

# Try to find games for the specific date
# Assuming Prisma stores as YYYY-MM-DDTHH:MM:SS.000Z or ms timestamps
# Let's search broadly first
print(f"\nSearching for games on {date_str}...")
cursor.execute(f"SELECT gameId, gameDate, status, homeTeamId, awayTeamId FROM Game WHERE gameDate LIKE '{date_str}%'")
games = cursor.fetchall()

print(f"Found {len(games)} games.")
for g in games:
    print(g)

conn.close()
