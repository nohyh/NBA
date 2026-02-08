"""
同步 NBA 比赛数据到本地数据库
使用 NBA 官方 CDN 赛程 API 获取完整赛季数据
"""
import requests
from datetime import datetime
from db_utils import get_db_path, connect_db

# 连接数据库
db_path = get_db_path()
conn = connect_db()
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_team_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}  # {nbaId: localId}

def sync_all_games():
    """从 NBA CDN API 同步整个赛季的比赛数据"""
    
    # 获取球队映射
    team_map = get_team_id_map()
    if len(team_map) == 0:
        print("❌ 错误：数据库中没有球队数据，请先运行 init_db.py")
        return
    
    print(f"已加载 {len(team_map)} 支球队的 ID 映射")
    
    # 从 NBA CDN 获取赛程数据
    print("\n正在从 NBA 官方 CDN 获取赛程数据...")
    url = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json'
    
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"❌ 获取数据失败: {e}")
        return
    
    schedule = data['leagueSchedule']
    print(f"赛季: {schedule['seasonYear']}")
    print(f"比赛日数量: {len(schedule['gameDates'])}")
    
    total_games = 0
    synced_games = 0
    skipped_games = 0
    
    # 遍历每天的比赛
    for game_date in schedule['gameDates']:
        date_str = game_date['gameDate']  # 格式: "12/18/2025 00:00:00"
        
        # 转换日期格式为 YYYY-MM-DD
        try:
            dt = datetime.strptime(date_str, '%m/%d/%Y %H:%M:%S')
            db_date = dt.strftime('%Y-%m-%d')
        except:
            continue
        
        games = game_date['games']
        total_games += len(games)
        
        for game in games:
            game_id = game['gameId']
            
            # 获取球队信息
            home_team_nba_id = game['homeTeam']['teamId']
            away_team_nba_id = game['awayTeam']['teamId']
            
            # 转换为本地数据库的球队 ID
            home_team_id = team_map.get(home_team_nba_id)
            away_team_id = team_map.get(away_team_nba_id)
            
            if not home_team_id or not away_team_id:
                skipped_games += 1
                continue
            
            # 获取比赛状态和时间
            game_status = game.get('gameStatus', 1)  # 1=未开始, 2=进行中, 3=结束
            game_status_text = game.get('gameStatusText', '')
            
            if game_status == 3:
                status = 'Final'
                game_time = None
            elif game_status == 2:
                status = 'In Progress'
                game_time = game_status_text
            else:
                status = 'Scheduled'
                game_time = game_status_text
            
            # 获取比分
            home_score = game['homeTeam'].get('score', 0) or None
            away_score = game['awayTeam'].get('score', 0) or None
            
            # 如果比分为0且比赛未结束，设为 None
            if home_score == 0 and status != 'Final':
                home_score = None
            if away_score == 0 and status != 'Final':
                away_score = None
            
            # 插入或更新比赛记录
            try:
                cursor.execute('''
                    INSERT INTO Game (gameId, gameDate, gameTime, status, homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    ON CONFLICT(gameId) DO UPDATE SET
                        gameDate=excluded.gameDate,
                        gameTime=excluded.gameTime,
                        status=excluded.status,
                        homeTeamScore=COALESCE(excluded.homeTeamScore, homeTeamScore),
                        awayTeamScore=COALESCE(excluded.awayTeamScore, awayTeamScore),
                        updatedAt=datetime('now')
                ''', (game_id, db_date, game_time, status, home_team_id, away_team_id, home_score, away_score))
                synced_games += 1
            except Exception as e:
                print(f"  ⚠️ 同步比赛 {game_id} 失败: {e}")
                skipped_games += 1
    
    conn.commit()
    
    print(f"\n🎉 同步完成！")
    print(f"  总比赛数: {total_games}")
    print(f"  成功同步: {synced_games}")
    print(f"  跳过: {skipped_games}")

if __name__ == '__main__':
    sync_all_games()
    conn.close()
