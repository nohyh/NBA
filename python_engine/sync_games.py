"""
同步 NBA 比赛数据到本地数据库
使用 NBA 官方 CDN 赛程 API 获取完整赛季数据
"""
import sqlite3
import os
import requests
import re
from datetime import datetime, timedelta

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def parse_game_time_to_utc(base_date_str, game_time_str):
    """
    把美东时间的 gameTime 转成 UTC ISO 格式
    base_date_str: "2025-12-30" (美东日期)
    game_time_str: "8:00 pm ET" 或 "7:30 PM ET" 等
    返回: "2025-12-31T01:00:00.000Z" (UTC 时间)
    """
    if not game_time_str or 'ET' not in game_time_str.upper():
        # 如果没有时间或格式不对，默认美东晚 7 点 (常见开赛时间)
        game_time_str = "7:00 pm ET"
    
    # 解析时间字符串，如 "8:00 pm ET"
    match = re.match(r'(\d{1,2}):(\d{2})\s*(am|pm)', game_time_str, re.IGNORECASE)
    if not match:
        # 默认晚 7 点
        hour, minute = 19, 0
    else:
        hour = int(match.group(1))
        minute = int(match.group(2))
        am_pm = match.group(3).lower()
        
        if am_pm == 'pm' and hour != 12:
            hour += 12
        elif am_pm == 'am' and hour == 12:
            hour = 0
    
    # 构建美东本地时间
    et_datetime = datetime.strptime(f"{base_date_str} {hour:02d}:{minute:02d}:00", "%Y-%m-%d %H:%M:%S")
    
    # 美东时间转 UTC (简化处理：冬令时 +5 小时，夏令时 +4 小时)
    # NBA 常规赛主要在冬令时期间，使用 +5 小时
    utc_datetime = et_datetime + timedelta(hours=5)
    
    return utc_datetime.strftime('%Y-%m-%dT%H:%M:%S.000Z')


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
        
        # 解析美东日期
        try:
            dt = datetime.strptime(date_str, '%m/%d/%Y %H:%M:%S')
            base_date = dt.strftime('%Y-%m-%d')
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
            
            # 把美东时间转成 UTC 时间存入 gameDate
            db_date = parse_game_time_to_utc(base_date, game_status_text)
            
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
