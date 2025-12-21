"""
更新所有球员的 teamId
从 NBA API 获取球员当前所属球队并更新数据库
"""
import sqlite3
import os
import time
from nba_api.stats.endpoints import commonplayerinfo

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_team_id_map():
    """获取 nbaTeamId -> 本地数据库 teamId 的映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def get_players_without_team():
    """获取没有 teamId 的球员"""
    cursor.execute("SELECT id, nbaId, fullName FROM Player WHERE teamId IS NULL")
    return cursor.fetchall()

def update_player_team():
    """更新球员的 teamId"""
    team_map = get_team_id_map()
    players = get_players_without_team()
    
    print(f"找到 {len(players)} 名没有 teamId 的球员")
    print(f"Team 映射: {len(team_map)} 支球队")
    
    updated = 0
    skipped = 0
    
    for idx, (player_id, nba_id, full_name) in enumerate(players):
        try:
            # 获取球员详情
            info = commonplayerinfo.CommonPlayerInfo(player_id=nba_id)
            data = info.get_dict()['resultSets'][0]['rowSet']
            
            if data and len(data) > 0:
                nba_team_id = data[0][18]  # TEAM_ID 列
                
                if nba_team_id and nba_team_id in team_map:
                    local_team_id = team_map[nba_team_id]
                    cursor.execute(
                        "UPDATE Player SET teamId = ? WHERE id = ?",
                        (local_team_id, player_id)
                    )
                    updated += 1
                    if updated % 50 == 0:
                        conn.commit()
                        print(f"  已更新 {updated} 名球员...")
                else:
                    skipped += 1
            else:
                skipped += 1
                
            # 避免 API 限流
            time.sleep(0.6)
            
        except Exception as e:
            print(f"  ⚠️ 更新 {full_name} (nbaId={nba_id}) 失败: {e}")
            skipped += 1
            time.sleep(1)
    
    conn.commit()
    print(f"\n🎉 完成！更新 {updated} 名，跳过 {skipped} 名")

if __name__ == '__main__':
    update_player_team()
    conn.close()
