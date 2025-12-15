"""
更新比赛比分 - 使用 NBA Live API
"""
import sqlite3
import os
from nba_api.live.nba.endpoints import scoreboard

db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("正在从 NBA Live API 获取最新比分...")

sb = scoreboard.ScoreBoard()
games = sb.get_dict()['scoreboard']['games']

print(f"获取到 {len(games)} 场比赛")

for g in games:
    game_id = g['gameId']
    home_score = g['homeTeam']['score']
    away_score = g['awayTeam']['score']
    status = g['gameStatusText']
    
    cursor.execute('''
        UPDATE Game 
        SET homeTeamScore = ?, awayTeamScore = ?, status = ?
        WHERE gameId = ?
    ''', (home_score, away_score, status, game_id))
    
    print(f"  {game_id}: {home_score}-{away_score} ({status})")

conn.commit()
conn.close()
print("✅ 比分更新完成！")
