import requests
from nba_api.stats.endpoints import scoreboardv2

# ========== 1. NBA CDN Schedule API ==========
print("=== NBA CDN Schedule API (新) ===")
url = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json'
data = requests.get(url).json()

# 找一场 12/18 的比赛看结构
for gd in data['leagueSchedule']['gameDates']:
    if gd['gameDate'].startswith('12/18/2025'):
        game = gd['games'][0]
        print(f"Game ID: {game.get('gameId')}")
        print(f"Date/Time: {game.get('gameDateTimeUTC')}")
        print(f"Status: {game.get('gameStatus')} - {game.get('gameStatusText')}")
        print(f"Home Team: {game['homeTeam']['teamTricode']} (ID: {game['homeTeam'].get('teamId')})")
        print(f"Away Team: {game['awayTeam']['teamTricode']} (ID: {game['awayTeam'].get('teamId')})")
        print(f"Home Score: {game['homeTeam'].get('score')}")
        print(f"Away Score: {game['awayTeam'].get('score')}")
        print(f"Arena: {game.get('arenaName')}")
        print(f"Broadcast: {game.get('broadcasters')}")
        break

print("\n" + "="*50 + "\n")

# ========== 2. scoreboardv2 API ==========
print("=== scoreboardv2 API (旧) ===")
sb = scoreboardv2.ScoreboardV2(game_date='2025-12-18')
game_header = sb.get_dict()['resultSets'][0]
headers = game_header['headers']
game = game_header['rowSet'][0]

print("Headers:", headers[:15])
idx = {h: i for i, h in enumerate(headers)}
print(f"Game ID: {game[idx['GAME_ID']]}")
print(f"Status: {game[idx['GAME_STATUS_ID']]} - {game[idx['GAME_STATUS_TEXT']]}")
print(f"Home Team ID: {game[idx['HOME_TEAM_ID']]}")
print(f"Away Team ID: {game[idx['VISITOR_TEAM_ID']]}")
print(f"Live Period: {game[idx.get('LIVE_PERIOD', 0)]}")
