import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check Team 1 info
print("Checking Team ID 1:")
cursor.execute("SELECT id, name, fullName, logoUrl FROM Team WHERE id = 1")
team = cursor.fetchone()

if team:
    print(f"ID: {team[0]}")
    print(f"Name: {team[1]}")
    print(f"FullName: {team[2]}")
    print(f"LogoUrl: {team[3]}")
else:
    print("Team 1 not found")

conn.close()
