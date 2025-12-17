import requests
from datetime import datetime

# 直接调用 NBA 官方赛程 API
url = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json'
resp = requests.get(url)
data = resp.json()

schedule = data['leagueSchedule']
print(f"Season: {schedule['seasonYear']}")

# 找 12/18/2025 的比赛
for gd in schedule['gameDates']:
    if gd['gameDate'].startswith('12/18/2025'):
        print(f"\n=== {gd['gameDate']} ===")
        print(f"Games: {len(gd['games'])}")
        for g in gd['games']:
            away = g['awayTeam']['teamTricode']
            home = g['homeTeam']['teamTricode']
            print(f"{away} @ {home}")
        break
