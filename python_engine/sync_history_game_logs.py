"""
同步本赛季所有已结束比赛的球员单场数据
从 Game 表读取已结束比赛，然后从 NBA Live API 获取 box score
注意：Live API 只能获取近期比赛，太早的比赛可能没有数据
"""
import sqlite3
import os
import time
from datetime import datetime
from nba_api.live.nba.endpoints import boxscore

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
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
    """同步单场比赛的球员数据 - 使用 Live API"""
    db_id, game_id, game_date, home_team_id, away_team_id, home_score, away_score = game_info
    
    try:
        # 调用 NBA Live API
        box = boxscore.BoxScore(game_id=game_id)
        game_data = box.game.get_dict()
        
        synced = 0
        home_win = home_score > away_score if home_score and away_score else None
        
        # 构建对阵信息
        cursor.execute("SELECT abbreviation FROM Team WHERE id = ?", (home_team_id,))
        home_abbr = cursor.fetchone()[0]
        cursor.execute("SELECT abbreviation FROM Team WHERE id = ?", (away_team_id,))
        away_abbr = cursor.fetchone()[0]
        matchup = f"{away_abbr} @ {home_abbr}"
        
        # 处理主队和客队球员
        for team_key in ['homeTeam', 'awayTeam']:
            team_data = game_data[team_key]
            is_home = team_key == 'homeTeam'
            
            players = team_data.get('players', [])
            
            for player in players:
                nba_id = player['personId']
                player_id = player_map.get(nba_id)
                
                if not player_id:
                    continue
                
                stats = player.get('statistics', {})
                
                # 提取数据
                minutes_str = stats.get('minutes', 'PT0M')  # 格式: "PT32M45S"
                try:
                    minutes = int(minutes_str.replace('PT', '').split('M')[0]) if minutes_str else 0
                except:
                    minutes = 0
                
                pts = stats.get('points', 0) or 0
                reb = stats.get('reboundsTotal', 0) or 0
                ast = stats.get('assists', 0) or 0
                stl = stats.get('steals', 0) or 0
                blk = stats.get('blocks', 0) or 0
                tov = stats.get('turnovers', 0) or 0
                
                # 判断胜负
                if home_win is not None:
                    wl = 'W' if (is_home and home_win) or (not is_home and not home_win) else 'L'
                else:
                    wl = '-'
                
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
