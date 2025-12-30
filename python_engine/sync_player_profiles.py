"""
同步球员个人资料（身高、体重、球衣号、位置、国籍等）
从 NBA API 获取数据并更新到本地数据库

用法:
  python sync_player_profiles.py           # 同步所有球员
  python sync_player_profiles.py --test 5  # 只测试前 5 个
"""
import sqlite3
import sys
import time
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
from db_utils import get_db_path

# 连接数据库
db_path = get_db_path()
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_players_missing_profile():
    """获取缺少个人资料的球员列表"""
    cursor.execute("""
        SELECT id, nbaId, fullName 
        FROM Player 
        WHERE height IS NULL OR jersey IS NULL OR position IS NULL
    """)
    return cursor.fetchall()

def sync_player_profile(player_id, nba_id, name):
    """同步单个球员的个人资料"""
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=nba_id)
        data = info.get_dict()
        
        if not data['resultSets'][0]['rowSet']:
            return False
        
        headers = data['resultSets'][0]['headers']
        player_data = data['resultSets'][0]['rowSet'][0]
        idx = {h: i for i, h in enumerate(headers)}
        
        # 提取数据
        height = player_data[idx.get('HEIGHT', -1)] if 'HEIGHT' in idx else None
        weight = player_data[idx.get('WEIGHT', -1)] if 'WEIGHT' in idx else None
        country = player_data[idx.get('COUNTRY', -1)] if 'COUNTRY' in idx else None
        jersey = player_data[idx.get('JERSEY', -1)] if 'JERSEY' in idx else None
        position = player_data[idx.get('POSITION', -1)] if 'POSITION' in idx else None
        
        # 更新数据库
        cursor.execute("""
            UPDATE Player 
            SET height = ?, weight = ?, country = ?, jersey = ?, position = ?
            WHERE id = ?
        """, (height, weight, country, jersey, position, player_id))
        
        return True
        
    except Exception as e:
        print(f"    ⚠️ 获取 {name} ({nba_id}) 失败: {e}")
        return False

def sync_all_profiles(limit=None):
    """同步所有球员的个人资料"""
    players_to_sync = get_players_missing_profile()
    
    if limit:
        players_to_sync = players_to_sync[:limit]
    
    total = len(players_to_sync)
    print(f"\n🏀 需要同步 {total} 名球员的个人资料...")
    
    synced = 0
    failed = 0
    
    for i, (player_id, nba_id, name) in enumerate(players_to_sync):
        print(f"  [{i+1}/{total}] 正在获取 {name}...", end="", flush=True)
        
        if sync_player_profile(player_id, nba_id, name):
            synced += 1
            print(" ✅")
        else:
            failed += 1
            print(" ❌")
        
        # 每 10 个提交一次，避免丢失数据
        if (i + 1) % 10 == 0:
            conn.commit()
        
        # 避免 API 限流
        time.sleep(0.6)
    
    conn.commit()
    print(f"\n🎉 完成！成功: {synced}, 失败: {failed}")

if __name__ == '__main__':
    limit = None
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test" and len(sys.argv) > 2:
            limit = int(sys.argv[2])
            print(f"测试模式：只同步 {limit} 名球员")
    
    sync_all_profiles(limit)
    conn.close()
