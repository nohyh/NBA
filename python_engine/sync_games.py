"""
同步 NBA 比赛数据到本地数据库
获取指定日期范围的比赛（赛程和比分）
"""
import sqlite3
import os
from datetime import datetime, timedelta
from nba_api.stats.endpoints import scoreboardv2

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_team_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}  # {nbaId: localId}

def sync_games_for_date(game_date: datetime, team_map: dict):
    """
    同步指定日期的比赛数据
    
    Args:
        game_date: 要同步的日期
        team_map: NBA球队ID到本地数据库ID的映射
    """
    date_str = game_date.strftime('%Y-%m-%d')
    print(f"\n正在获取 {date_str} 的比赛...")
    
    try:
        # 调用 NBA API 获取当天比赛
        scoreboard = scoreboardv2.ScoreboardV2(game_date=date_str)
        data = scoreboard.get_dict()
        
        # 解析比赛头信息 (GameHeader)
        game_header = data['resultSets'][0]
        headers = game_header['headers']
        games = game_header['rowSet']
        
        if len(games) == 0:
            print(f"  {date_str} 没有比赛")
            return 0
        
        # 找到需要的列索引
        idx = {h: i for i, h in enumerate(headers)}
        
        count = 0
        for game in games:
            game_id = game[idx['GAME_ID']]
            game_status = game[idx['GAME_STATUS_TEXT']]  # 如 "Final", "7:30 pm ET"
            home_team_nba_id = game[idx['HOME_TEAM_ID']]
            away_team_nba_id = game[idx['VISITOR_TEAM_ID']]
            
            # 转换为本地数据库的球队 ID
            home_team_id = team_map.get(home_team_nba_id)
            away_team_id = team_map.get(away_team_nba_id)
            
            if not home_team_id or not away_team_id:
                print(f"  ⚠️ 跳过比赛 {game_id}: 找不到球队映射")
                continue
            
            # 确定比赛状态
            if 'Final' in game_status:
                status = 'Final'
                game_time = None
            elif 'pm' in game_status.lower() or 'am' in game_status.lower():
                status = 'Scheduled'
                game_time = game_status
            else:
                status = 'In Progress'
                game_time = None
            
            # 插入或更新比赛记录
            cursor.execute('''
                INSERT INTO Game (gameId, gameDate, gameTime, status, homeTeamId, awayTeamId, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                ON CONFLICT(gameId) DO UPDATE SET
                    status = excluded.status,
                    gameTime = excluded.gameTime,
                    updatedAt = datetime('now')
            ''', (game_id, date_str, game_time, status, home_team_id, away_team_id))
            count += 1
        
        # 解析比分数据 (LineScore)
        line_score = data['resultSets'][1]
        ls_headers = line_score['headers']
        ls_data = line_score['rowSet']
        ls_idx = {h: i for i, h in enumerate(ls_headers)}
        
        for row in ls_data:
            game_id = row[ls_idx['GAME_ID']]
            team_nba_id = row[ls_idx['TEAM_ID']]
            pts = row[ls_idx['PTS']]  # 可能为 None
            
            if pts is None:
                continue
            
            # 判断是主队还是客队，更新对应分数
            # 需要查一下这场比赛的主客队
            cursor.execute("SELECT homeTeamId, awayTeamId FROM Game WHERE gameId = ?", (game_id,))
            result = cursor.fetchone()
            if result:
                home_id, away_id = result
                local_team_id = team_map.get(team_nba_id)
                
                if local_team_id == home_id:
                    cursor.execute("UPDATE Game SET homeTeamScore = ? WHERE gameId = ?", (pts, game_id))
                elif local_team_id == away_id:
                    cursor.execute("UPDATE Game SET awayTeamScore = ? WHERE gameId = ?", (pts, game_id))
        
        conn.commit()
        print(f"  ✅ 成功同步 {count} 场比赛")
        return count
        
    except Exception as e:
        print(f"  ❌ 获取比赛数据失败: {e}")
        return 0

def main():
    """主函数：同步今天、昨天和明天的比赛"""
    team_map = get_team_id_map()
    
    if len(team_map) == 0:
        print("❌ 错误：数据库中没有球队数据，请先运行 init_db.py")
        return
    
    print(f"已加载 {len(team_map)} 支球队的 ID 映射")
    
    # 同步昨天、今天、明天的比赛
    today = datetime.now()
    dates_to_sync = [
        today - timedelta(days=1),  # 昨天
        today,                       # 今天
        today + timedelta(days=1),   # 明天
    ]
    
    total = 0
    for date in dates_to_sync:
        total += sync_games_for_date(date, team_map)
    
    print(f"\n🎉 同步完成！共处理 {total} 场比赛")

if __name__ == '__main__':
    main()
