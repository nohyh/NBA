import sqlite3

conn = sqlite3.connect('../backend/prisma/dev.db')
cursor = conn.cursor()

# 更新 2024-25 为 2025-26
cursor.execute("UPDATE TeamSeasonStat SET season = '2025-26' WHERE season = '2024-25'")
conn.commit()

print("Updated 2024-25 to 2025-26")
print("Current seasons:", cursor.execute('SELECT DISTINCT season FROM TeamSeasonStat').fetchall())

conn.close()
