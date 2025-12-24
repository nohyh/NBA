"""检查球员的 gameLogs 数据"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 检查 PlayerGameLog 表是否有数据
cursor.execute("SELECT COUNT(*) FROM PlayerGameLog")
total = cursor.fetchone()[0]
print(f"PlayerGameLog 总记录数: {total}")

# 查看 Bam Adebayo (playerId=3) 的比赛记录
cursor.execute("""
    SELECT id, playerId, gameId, gameDate, matchup, wl, min, pts, reb, ast, stl, blk, tov 
    FROM PlayerGameLog 
    WHERE playerId = 3 
    ORDER BY gameDate DESC
    LIMIT 5
""")
logs = cursor.fetchall()

print(f"\nBam Adebayo 的比赛记录数: {len(logs)}")
for log in logs:
    print(log)

conn.close()
