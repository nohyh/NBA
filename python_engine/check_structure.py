import requests
import json

url = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json'
data = requests.get(url).json()
for gd in data['leagueSchedule']['gameDates']:
    if gd['gameDate'].startswith('12/18/2025'):
        game = gd['games'][0]
        print("=== CDN Schedule API 单场比赛数据结构 ===")
        print(json.dumps(game, indent=2, ensure_ascii=False))
        break
