"""
检查球员数据完整性
"""
import sqlite3
import os

def check_player_data():
    db_path = os.path.join(os.path.dirname(__file__), "..", "backend", "prisma", "dev.db")
    db_path = os.path.abspath(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 检查一个球员的完整数据
    cursor.execute("""
        SELECT id, nbaId, firstName, lastName, fullName, 
               height, weight, country, jersey, position, headshotUrl, teamId
        FROM Player 
        WHERE fullName LIKE '%Bam%' OR fullName LIKE '%Adebayo%'
        LIMIT 5
    """)
    players = cursor.fetchall()
    
    print("=== 球员基本信息 ===")
    for p in players:
        print(f"ID: {p[0]}, nbaId: {p[1]}")
        print(f"  名字: {p[2]} {p[3]} ({p[4]})")
        print(f"  身高: {p[5]}, 体重: {p[6]}, 国籍: {p[7]}")
        print(f"  球衣: {p[8]}, 位置: {p[9]}")
        print(f"  头像: {p[10]}")
        print(f"  球队ID: {p[11]}")
        print()
    
    # 统计有多少球员缺少关键字段
    cursor.execute("""
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN height IS NULL THEN 1 ELSE 0 END) as no_height,
            SUM(CASE WHEN weight IS NULL THEN 1 ELSE 0 END) as no_weight,
            SUM(CASE WHEN jersey IS NULL THEN 1 ELSE 0 END) as no_jersey,
            SUM(CASE WHEN position IS NULL THEN 1 ELSE 0 END) as no_position,
            SUM(CASE WHEN headshotUrl IS NULL THEN 1 ELSE 0 END) as no_headshot
        FROM Player
    """)
    stats = cursor.fetchone()
    
    print("=== 数据完整性统计 ===")
    print(f"总球员数: {stats[0]}")
    print(f"缺少身高: {stats[1]}")
    print(f"缺少体重: {stats[2]}")
    print(f"缺少球衣号: {stats[3]}")
    print(f"缺少位置: {stats[4]}")
    print(f"缺少头像: {stats[5]}")
    
    conn.close()

if __name__ == "__main__":
    check_player_data()
