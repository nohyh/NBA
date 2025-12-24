"""
检查数据库中的球队缩写
"""
import sqlite3
import os

def check_teams():
    db_path = os.path.join(os.path.dirname(__file__), "..", "backend", "prisma", "dev.db")
    db_path = os.path.abspath(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, abbreviation, fullName, primaryColor FROM Team ORDER BY abbreviation")
    teams = cursor.fetchall()
    
    print("数据库中的球队:")
    for team_id, abbr, full_name, color in teams:
        status = "✅" if color else "❌"
        print(f"{status} {abbr}: {full_name} - {color or 'No color'}")
    
    conn.close()

if __name__ == "__main__":
    check_teams()
