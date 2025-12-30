"""
同步本赛季所有已结束比赛的球员单场数据
从 Game 表读取已结束比赛，然后从 NBA API 获取 box score
"""
import sqlite3
import time
from datetime import datetime
from nba_api.stats.endpoints import BoxScoreTraditionalV2
from db_utils import get_db_path

# 连接数据库
db_path = get_db_path()
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_player_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Player")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def get_team_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def get_finished_games():
    """获取所有已结束但没有 PlayerGameLog 数据的常规赛比赛"""
    cursor.execute("""
        SELECT g.id, g.gameId, g.gameDate, g.homeTeamId, g.awayTeamId, g.homeTeamScore, g.awayTeamScore
        FROM Game g
        WHERE g.status = 'Final'
        AND g.gameId LIKE '002%'
        AND NOT EXISTS (SELECT 1 FROM PlayerGameLog pgl WHERE pgl.gameId = g.gameId)
        ORDER BY g.gameDate DESC
    """)
    return cursor.fetchall()

def sync_box_score(game_info, player_map):
    """同步单场比赛的球员数据"""
    db_id, game_id, game_date, home_team_id, away_team_id, home_score, away_score = game_info
    
    try:
        # 调用 NBA API
        box = BoxScoreTraditionalV2(game_id=game_id)
        player_stats = box.player_stats.get_data_frame()
        
        if player_stats.empty:
            print(f"  ⚠️ 比赛 {game_id} 没有球员数据")
            return 0
        
        synced = 0
        home_win = home_score > away_score if home_score and away_score else None
        
        for _, row in player_stats.iterrows():
            nba_player_id = row['PLAYER_ID']
            player_id = player_map.get(nba_player_id)
            
            if not player_id:
                continue
            
            # 获取球员所属球队
            cursor.execute("SELECT teamId FROM Player WHERE id = ?", (player_id,))
            result = cursor.fetchone()
            if not result:
                continue
            
            player_team_id = result[0]
            
            # 判断胜负
            if home_win is not None:
                is_home = player_team_id == home_team_id
                wl = 'W' if (is_home and home_win) or (not is_home and not home_win) else 'L'
            else:
                wl = '-'
            
            # 构建对阵信息
            cursor.execute("SELECT abbreviation FROM Team WHERE id = ?", (home_team_id,))
            home_abbr = cursor.fetchone()[0]
            cursor.execute("SELECT abbreviation FROM Team WHERE id = ?", (away_team_id,))
            away_abbr = cursor.fetchone()[0]
            matchup = f"{away_abbr} @ {home_abbr}"
            
            # 提取数据
            import math
            def safe_int(val):
                if val is None or (isinstance(val, float) and math.isnan(val)):
                    return 0
                return int(val)
            
            minutes_str = str(row['MIN']) if row['MIN'] else '0'
            minutes = int(minutes_str.split(':')[0]) if ':' in minutes_str else 0
            pts = safe_int(row['PTS'])
            reb = safe_int(row['REB'])
            ast = safe_int(row['AST'])
            stl = safe_int(row['STL'])
            blk = safe_int(row['BLK'])
            tov = safe_int(row['TO'])
            
            # 解析日期
            dt = datetime.fromisoformat(game_date.replace('Z', '+00:00')) if 'T' in game_date else datetime.strptime(game_date[:10], '%Y-%m-%d')
            
            # 插入记录
            cursor.execute('DELETE FROM PlayerGameLog WHERE playerId = ? AND gameId = ?', (player_id, game_id))
            cursor.execute('''
                INSERT INTO PlayerGameLog (playerId, gameId, gameDate, matchup, wl, min, pts, reb, ast, stl, blk, tov)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (player_id, game_id, dt.isoformat(), matchup, wl, minutes, pts, reb, ast, stl, blk, tov))
            synced += 1
        
        return synced
    except Exception as e:
        print(f"  ❌ 同步比赛 {game_id} 失败: {e}")
        import traceback
        traceback.print_exc()
        return 0

def sync_all_history():
    """同步所有历史比赛"""
    player_map = get_player_id_map()
    if len(player_map) == 0:
        print("❌ 错误：数据库中没有球员数据")
        return
    
    print(f"已加载 {len(player_map)} 名球员的 ID 映射")
    
    games = get_finished_games()
    print(f"\n找到 {len(games)} 场需要同步的比赛\n")
    
    if not games:
        print("没有需要同步的比赛")
        return
    
    total_synced = 0
    for i, game in enumerate(games):
        game_id = game[1]
        game_date = game[2][:10]
        print(f"[{i+1}/{len(games)}] 同步 {game_date} 比赛 {game_id}...")
        
        synced = sync_box_score(game, player_map)
        total_synced += synced
        print(f"  ✅ 同步了 {synced} 名球员")
        
        conn.commit()
        time.sleep(0.6)  # 避免 API 限流
    
    print(f"\n🎉 同步完成！共同步 {total_synced} 条球员单场数据")

if __name__ == '__main__':
    sync_all_history()
    conn.close()
