"""
同步球队队史数据（城市、成立年份、总冠军数）
使用 nba_api 的 FranchiseHistory 获取数据

用法:
  python sync_team_history.py
"""
import sqlite3
import os
from nba_api.stats.endpoints import FranchiseHistory
import time

# 数据库路径
db_path = os.path.join(os.path.dirname(__file__), "../backend/prisma/dev.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
print(f"已连接到数据库: {db_path}")

def get_nba_team_id_map():
    """获取本地数据库中的球队 nbaId -> id 映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def sync_team_history():
    """从 NBA API 获取队史数据并更新数据库"""
    print("\n🏆 开始同步队史数据...")
    
    # 获取本地球队映射
    team_map = get_nba_team_id_map()
    if not team_map:
        print("❌ 数据库中没有球队数据，请先运行 init_db.py")
        return
    
    print(f"  找到 {len(team_map)} 支球队")
    
    try:
        # 调用 NBA API 获取队史数据
        print("  正在请求 NBA API...")
        hist = FranchiseHistory()
        df = hist.get_data_frames()[0]
        
        print(f"  获取到 {len(df)} 条队史记录")
        
        synced_count = 0
        
        for _, row in df.iterrows():
            nba_team_id = row['TEAM_ID']
            
            # 查找本地球队 ID
            if nba_team_id not in team_map:
                continue
            
            team_id = team_map[nba_team_id]
            
            # 提取数据
            city = row.get('TEAM_CITY', '')
            year_founded = int(row.get('START_YEAR', 0) or 0)
            championships = int(row.get('LEAGUE_TITLES', 0) or 0)
            
            # 更新数据库
            cursor.execute("""
                UPDATE Team 
                SET city = ?, yearFounded = ?, championship = ?
                WHERE id = ?
            """, (city, year_founded, championships, team_id))
            
            print(f"  ✅ {city} - 成立: {year_founded}, 总冠军: {championships}")
            synced_count += 1
        
        conn.commit()
        print(f"\n🎉 同步完成！已更新 {synced_count} 支球队")
        
    except Exception as e:
        print(f"❌ 同步失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    sync_team_history()
    conn.close()
