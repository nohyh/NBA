"""
同步四节比分数据到 Game 表
使用 BoxScoreSummaryV2 获取 line_score 数据
"""
import sqlite3
import time
from nba_api.stats.endpoints import BoxScoreSummaryV2
from db_utils import get_db_path

# 连接数据库
db_path = get_db_path()
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
        LIMIT 100
    """)
    return cursor.fetchall()

def get_team_nba_id(team_id):
    """获取球队的 nbaId"""
    cursor.execute("SELECT nbaId FROM Team WHERE id = ?", (team_id,))
    result = cursor.fetchone()
    return result[0] if result else None

def sync_quarter_scores(game_info):
    """同步单场比赛的四节比分"""
    db_id, game_id, home_team_id, away_team_id = game_info
    
    try:
        box = BoxScoreSummaryV2(game_id=game_id)
        line_score = box.line_score.get_data_frame()
        
        if line_score.empty:
            print(f"  ⚠️ 比赛 {game_id} 没有比分数据")
            return False
        
        home_nba_id = get_team_nba_id(home_team_id)
        away_nba_id = get_team_nba_id(away_team_id)
        
        home_row = line_score[line_score['TEAM_ID'] == home_nba_id]
        away_row = line_score[line_score['TEAM_ID'] == away_nba_id]
        
        if home_row.empty or away_row.empty:
            print(f"  ⚠️ 比赛 {game_id} 找不到球队数据")
            return False
        
        home_row = home_row.iloc[0]
        away_row = away_row.iloc[0]
        
        # 提取四节比分
        def safe_int(val):
            try:
                return int(val) if val and val == val else None
            except:
                return None
        
        cursor.execute("""
            UPDATE Game SET
                homeQ1 = ?, homeQ2 = ?, homeQ3 = ?, homeQ4 = ?,
                awayQ1 = ?, awayQ2 = ?, awayQ3 = ?, awayQ4 = ?
            WHERE id = ?
        """, (
            safe_int(home_row.get('PTS_QTR1')),
            safe_int(home_row.get('PTS_QTR2')),
            safe_int(home_row.get('PTS_QTR3')),
            safe_int(home_row.get('PTS_QTR4')),
            safe_int(away_row.get('PTS_QTR1')),
            safe_int(away_row.get('PTS_QTR2')),
            safe_int(away_row.get('PTS_QTR3')),
            safe_int(away_row.get('PTS_QTR4')),
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
    for i, game in enumerate(games):
        print(f"[{i+1}/{len(games)}] 同步比赛 {game[1]}...")
        if sync_quarter_scores(game):
            synced += 1
            print(f"  ✅ 成功")
        conn.commit()
        time.sleep(0.6)
    
    print(f"\n🎉 同步完成！成功同步 {synced}/{len(games)} 场比赛")

if __name__ == '__main__':
    sync_all_quarter_scores()
    conn.close()
