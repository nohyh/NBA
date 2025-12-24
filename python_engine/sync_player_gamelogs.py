"""
同步球员历史比赛记录
从 NBA API 获取球员的赛季比赛记录

用法:
  python sync_player_gamelogs.py              # 同步当前赛季所有球员
  python sync_player_gamelogs.py --test 5     # 只测试前 5 个球员
  python sync_player_gamelogs.py --player 3   # 只同步指定球员 ID
"""
import sqlite3
import os
import sys
import time
from datetime import datetime
from nba_api.stats.endpoints import playergamelog

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

CURRENT_SEASON = "2024-25"

def get_all_players():
    """获取所有球员"""
    cursor.execute("SELECT id, nbaId, fullName FROM Player ORDER BY id")
    return cursor.fetchall()

def sync_player_gamelog(player_id, nba_id, name, season=CURRENT_SEASON):
    """同步单个球员的比赛记录"""
    try:
        gamelog = playergamelog.PlayerGameLog(
            player_id=nba_id,
            season=season,
            season_type_all_star='Regular Season'
        )
        
        data = gamelog.get_dict()
        if not data['resultSets'][0]['rowSet']:
            return 0
        
        headers = data['resultSets'][0]['headers']
        games = data['resultSets'][0]['rowSet']
        idx = {h: i for i, h in enumerate(headers)}
        
        synced = 0
        for game in games[:10]:  # 只取最近 10 场
            game_id = str(game[idx['Game_ID']])
            game_date_str = game[idx['GAME_DATE']]  # 格式: "DEC 23, 2024"
            matchup = game[idx['MATCHUP']]
            wl = game[idx['WL']]
            
            # 解析日期
            try:
                dt = datetime.strptime(game_date_str, '%b %d, %Y')
            except:
                dt = datetime.now()
            
            mins = game[idx['MIN']] or 0
            pts = game[idx['PTS']] or 0
            reb = game[idx['REB']] or 0
            ast = game[idx['AST']] or 0
            stl = game[idx['STL']] or 0
            blk = game[idx['BLK']] or 0
            tov = game[idx['TOV']] or 0
            
            # 插入或更新记录
            cursor.execute('DELETE FROM PlayerGameLog WHERE playerId = ? AND gameId = ?', (player_id, game_id))
            cursor.execute('''
                INSERT INTO PlayerGameLog (playerId, gameId, gameDate, matchup, wl, min, pts, reb, ast, stl, blk, tov)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (player_id, game_id, dt.isoformat(), matchup, wl, int(mins), pts, reb, ast, stl, blk, tov))
            synced += 1
        
        return synced
        
    except Exception as e:
        print(f"    ⚠️ 获取 {name} 失败: {e}")
        return 0

def sync_all_gamelogs(limit=None, target_player_id=None):
    """同步所有球员的比赛记录"""
    players = get_all_players()
    
    if target_player_id:
        players = [(p[0], p[1], p[2]) for p in players if p[0] == target_player_id]
    elif limit:
        players = players[:limit]
    
    total = len(players)
    print(f"\n🏀 需要同步 {total} 名球员的比赛记录...")
    
    total_synced = 0
    failed = 0
    
    for i, (player_id, nba_id, name) in enumerate(players):
        print(f"  [{i+1}/{total}] {name}...", end="", flush=True)
        
        synced = sync_player_gamelog(player_id, nba_id, name)
        if synced > 0:
            total_synced += synced
            print(f" ✅ {synced} 场")
        else:
            failed += 1
            print(" ❌ 无数据")
        
        # 每 10 个提交一次
        if (i + 1) % 10 == 0:
            conn.commit()
        
        # 避免 API 限流
        time.sleep(0.6)
    
    conn.commit()
    print(f"\n🎉 完成！共同步 {total_synced} 条比赛记录")

if __name__ == '__main__':
    limit = None
    target_player_id = None
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test" and len(sys.argv) > 2:
            limit = int(sys.argv[2])
        elif sys.argv[1] == "--player" and len(sys.argv) > 2:
            target_player_id = int(sys.argv[2])
    
    sync_all_gamelogs(limit=limit, target_player_id=target_player_id)
    conn.close()
