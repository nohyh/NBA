"""
同步球员单场比赛数据到本地数据库
使用 NBA Live API 获取今日比赛的球员数据
用于今日最佳球员(MVP)计算
"""
import os
from datetime import datetime
from nba_api.live.nba.endpoints import scoreboard, boxscore
from db_utils import get_db_path, connect_db

# 连接数据库
db_path = get_db_path()
conn = connect_db()
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_player_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Player")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def get_today_games():
    """获取今天的比赛列表"""
    try:
        sb = scoreboard.ScoreBoard()
        data = sb.get_dict()['scoreboard']
        games = data['games']
        
        finished_games = []
        all_finished = len(games) > 0
        
        for game in games:
            game_id = game['gameId']
            game_status = game['gameStatus']
            home = game['homeTeam']['teamTricode']
            away = game['awayTeam']['teamTricode']
            matchup = f"{away} @ {home}"
            
            if game_status == 3:
                finished_games.append({
                    'gameId': game_id,
                    'matchup': matchup,
                    'homeScore': game['homeTeam']['score'],
                    'awayScore': game['awayTeam']['score']
                })
            else:
                all_finished = False
        
        return finished_games, all_finished, data['gameDate']
    except Exception as e:
        print(f"❌ 获取今日比赛失败: {e}")
        return [], False, None

def sync_game_box_score(game_info, game_date, player_map):
    """同步单场比赛的球员数据"""
    game_id = game_info['gameId']
    matchup = game_info['matchup']
    home_win = game_info['homeScore'] > game_info['awayScore']
    
    try:
        box = boxscore.BoxScore(game_id=game_id)
        game_data = box.game.get_dict()
        
        synced = 0
        
        # 同步四节比分 (使用 Live API 的 periods 数据)
        try:
            home_team = game_data.get('homeTeam', {})
            away_team = game_data.get('awayTeam', {})
            home_periods = home_team.get('periods', [])
            away_periods = away_team.get('periods', [])
            
            if len(home_periods) >= 4 and len(away_periods) >= 4:
                cursor.execute('''
                    UPDATE Game SET
                        homeQ1 = ?, homeQ2 = ?, homeQ3 = ?, homeQ4 = ?,
                        awayQ1 = ?, awayQ2 = ?, awayQ3 = ?, awayQ4 = ?
                    WHERE gameId = ?
                ''', (
                    home_periods[0].get('score', 0),
                    home_periods[1].get('score', 0),
                    home_periods[2].get('score', 0),
                    home_periods[3].get('score', 0),
                    away_periods[0].get('score', 0),
                    away_periods[1].get('score', 0),
                    away_periods[2].get('score', 0),
                    away_periods[3].get('score', 0),
                    game_id
                ))
                print(f"  📊 已更新四节比分")
        except Exception as qe:
            print(f"  ⚠️ 四节比分更新失败: {qe}")
        
        # 处理主队和客队球员
        for team_key in ['homeTeam', 'awayTeam']:
            team_data = game_data[team_key]
            team_abbr = team_data['teamTricode']
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
                
                pts = stats.get('points', 0)
                reb = stats.get('reboundsTotal', 0)
                ast = stats.get('assists', 0)
                stl = stats.get('steals', 0)
                blk = stats.get('blocks', 0)
                tov = stats.get('turnovers', 0)
                
                # 判断胜负
                wl = 'W' if (is_home and home_win) or (not is_home and not home_win) else 'L'
                
                # 解析日期
                dt = datetime.strptime(game_date, '%Y-%m-%d')
                
                # 插入记录
                cursor.execute('DELETE FROM PlayerGameLog WHERE playerId = ? AND gameId = ?', (player_id, game_id))
                cursor.execute('''
                    INSERT INTO PlayerGameLog (playerId, gameId, gameDate, matchup, wl, min, pts, reb, ast, stl, blk, tov)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (player_id, game_id, dt.isoformat(), matchup, wl, minutes, pts, reb, ast, stl, blk, tov))
                synced += 1
        
        return synced
    except Exception as e:
        print(f"  ⚠️ 同步比赛 {game_id} 失败: {e}")
        import traceback
        traceback.print_exc()
        return 0

def sync_today_game_logs():
    """同步今日所有已结束比赛的球员数据"""
    player_map = get_player_id_map()
    if len(player_map) == 0:
        print("❌ 错误：数据库中没有球员数据")
        return False, None
    
    print(f"已加载 {len(player_map)} 名球员的 ID 映射")
    
    games, all_finished, game_date = get_today_games()
    
    if not game_date:
        print("无法获取今日比赛信息")
        return False, None
    
    print(f"\n今日日期: {game_date}")
    print(f"已结束比赛: {len(games)} 场")
    print(f"全部结束: {'是' if all_finished else '否'}")
    
    if not games:
        print("今天没有已结束的比赛")
        return all_finished, game_date
    
    total_synced = 0
    for game in games:
        print(f"\n正在同步: {game['matchup']}...")
        synced = sync_game_box_score(game, game_date, player_map)
        conn.commit()
        total_synced += synced
        print(f"  同步了 {synced} 名球员")
    
    conn.commit()
    print(f"\n🎉 同步完成！共同步 {total_synced} 条球员单场数据")
    
    return all_finished, game_date

if __name__ == '__main__':
    import json
    all_finished, game_date = sync_today_game_logs()
    
    # 保存 NBA 日期到 JSON 文件供 Node.js 读取
    if game_date:
        date_file = os.path.join(os.path.dirname(__file__), '../backend/data/nba_date.json')
        with open(date_file, 'w') as f:
            json.dump({'date': game_date, 'allFinished': all_finished}, f)
        print(f"✅ NBA 日期已保存到: {date_file}")
    
    conn.close()

