"""
同步四节比分数据到 Game 表
使用 NBA Live API 获取比分数据
"""
import sqlite3
import os
import time
from nba_api.live.nba.endpoints import boxscore

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

def get_games_without_quarter_scores():
    """获取已结束但没有四节比分的比赛"""
    cursor.execute("""
        SELECT id, gameId, homeTeamId, awayTeamId
        FROM Game
        WHERE status = 'Final'
        AND gameId LIKE '002%'
        AND homeQ1 IS NULL
        ORDER BY gameDate DESC
    """)
    return cursor.fetchall()

def sync_quarter_scores(game_info):
    """同步单场比赛的四节比分 - 使用 Live API"""
    db_id, game_id, home_team_id, away_team_id = game_info
    
    try:
        box = boxscore.BoxScore(game_id=game_id)
        game_data = box.game.get_dict()
        
        home_team = game_data.get('homeTeam', {})
        away_team = game_data.get('awayTeam', {})
        
        # 获取四节比分
        home_periods = home_team.get('periods', [])
        away_periods = away_team.get('periods', [])
        
        if len(home_periods) < 4 or len(away_periods) < 4:
            print(f"  ⚠️ 比赛 {game_id} 比分数据不完整")
            return False
        
        def get_period_score(periods, idx):
            try:
                return int(periods[idx].get('score', 0))
            except:
                return None
        
        cursor.execute("""
            UPDATE Game SET
                homeQ1 = ?, homeQ2 = ?, homeQ3 = ?, homeQ4 = ?,
                awayQ1 = ?, awayQ2 = ?, awayQ3 = ?, awayQ4 = ?
            WHERE id = ?
        """, (
            get_period_score(home_periods, 0),
            get_period_score(home_periods, 1),
            get_period_score(home_periods, 2),
            get_period_score(home_periods, 3),
            get_period_score(away_periods, 0),
            get_period_score(away_periods, 1),
            get_period_score(away_periods, 2),
            get_period_score(away_periods, 3),
            db_id
        ))
        
        return True
    except Exception as e:
        print(f"  ❌ 同步比赛 {game_id} 失败: {e}")
        return False

def sync_all_quarter_scores():
    """同步所有比赛的四节比分"""
    games = get_games_without_quarter_scores()
    print(f"\n找到 {len(games)} 场需要同步四节比分的比赛\n")
    
    if not games:
        print("没有需要同步的比赛")
        return
    
    synced = 0
    failed = 0
    for i, game in enumerate(games):
        print(f"[{i+1}/{len(games)}] 同步比赛 {game[1]}...")
        if sync_quarter_scores(game):
            synced += 1
            print(f"  ✅ 成功")
        else:
            failed += 1
        conn.commit()
        time.sleep(0.3)
    
    print(f"\n🎉 同步完成！成功 {synced}/{len(games)}，失败 {failed}")

if __name__ == '__main__':
    sync_all_quarter_scores()
    conn.close()

