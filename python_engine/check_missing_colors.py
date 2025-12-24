"""
检查哪些球队没有颜色
"""
import sqlite3
import os

def check_missing_colors():
    db_path = os.path.join(os.path.dirname(__file__), "..", "backend", "prisma", "dev.db")
    db_path = os.path.abspath(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, abbreviation, fullName, primaryColor FROM Team WHERE primaryColor IS NULL ORDER BY abbreviation")
    teams = cursor.fetchall()
    
    print(f"缺少颜色的球队 ({len(teams)} 支):")
    for team_id, abbr, full_name, color in teams:
        print(f"  {abbr}: {full_name}")
    
    conn.close()

if __name__ == "__main__":
    check_missing_colors()
