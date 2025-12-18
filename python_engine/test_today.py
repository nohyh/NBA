"""
测试同步脚本
"""
from nba_api.live.nba.endpoints import scoreboard

# 获取今天的比赛
sb = scoreboard.ScoreBoard()
data = sb.get_dict()['scoreboard']

print(f"日期: {data['gameDate']}")
print(f"比赛数: {len(data['games'])}")

for game in data['games']:
    status_text = {1: '未开始', 2: '进行中', 3: '已结束'}[game['gameStatus']]
    print(f"{game['awayTeam']['teamTricode']} @ {game['homeTeam']['teamTricode']} - {status_text}")
