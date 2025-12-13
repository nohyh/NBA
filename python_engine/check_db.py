import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../backend/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 60)
print("NBA Database Report")
print("=" * 60)

# Stats
team_count = cursor.execute("SELECT COUNT(*) FROM Team").fetchone()[0]
player_count = cursor.execute("SELECT COUNT(*) FROM Player").fetchone()[0]
stats_count = cursor.execute("SELECT COUNT(*) FROM PlayerSeasonStat").fetchone()[0]

print(f"\nData Summary:")
print(f"  Teams: {team_count}")
print(f"  Players: {player_count}")
print(f"  Season Stats: {stats_count}")

# Top 10 Scorers
print("\n" + "=" * 60)
print("2024-25 Season Top 10 Scorers")
print("=" * 60)
top_scorers = cursor.execute('''
    SELECT p.fullName, s.pts, s.reb, s.ast, s.gamesPlayed
    FROM PlayerSeasonStat s
    JOIN Player p ON s.playerId = p.id
    WHERE s.season = '2024-25'
    ORDER BY s.pts DESC
    LIMIT 10
''').fetchall()

for i, player in enumerate(top_scorers, 1):
    name, pts, reb, ast, gp = player
    print(f"{i:2}. {name:<25} PTS:{pts:.1f}  REB:{reb:.1f}  AST:{ast:.1f}  GP:{gp}")

print("\n" + "=" * 60)
print("Data ready for frontend development!")
print("=" * 60)

conn.close()
