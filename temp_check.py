import sqlite3
conn = sqlite3.connect('backend/prisma/dev.db')
cursor = conn.cursor()

# 清除错误数据
cursor.execute("DELETE FROM _UserFavoritePlayers")

# 正确添加：A=Player ID, B=User ID
# 用户3(nohyh)关注球员1、2、3
cursor.execute("INSERT INTO _UserFavoritePlayers (A, B) VALUES (1, 3)")
cursor.execute("INSERT INTO _UserFavoritePlayers (A, B) VALUES (2, 3)")
cursor.execute("INSERT INTO _UserFavoritePlayers (A, B) VALUES (3, 3)")

conn.commit()
print("Done! User 3 now follows Players 1, 2, 3")

# 验证
cursor.execute("SELECT * FROM _UserFavoritePlayers")
print("Data:", cursor.fetchall())
