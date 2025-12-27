"""检查前20场比赛"""
import sqlite3
conn = sqlite3.connect('backend/prisma/dev.db')
cursor = conn.cursor()

cursor.execute("""
    SELECT g.gameId, g.gameDate
    FROM Game g
    WHERE g.status = 'Final' AND g.gameId LIKE '002%'
    AND NOT EXISTS (SELECT 1 FROM PlayerGameLog pgl WHERE pgl.gameId = g.gameId)
    ORDER BY g.gameDate ASC
    LIMIT 20
""")
for row in cursor.fetchall():
    print(row)
