import sqlite3

conn = sqlite3.connect('./backend/prisma/dev.db')
r = conn.execute('SELECT COUNT(*) FROM PlayerSeasonStat WHERE season="2025-26" AND seasonType="Regular Season"').fetchone()
print('Count:', r[0])

# 测试排序
r2 = conn.execute('SELECT playerId, pts FROM PlayerSeasonStat WHERE season="2025-26" AND seasonType="Regular Season" ORDER BY pts DESC LIMIT 5').fetchall()
print('Top 5 scorers:', r2)

conn.close()
