from nba_api.live.nba.endpoints import scoreboard

sb = scoreboard.ScoreBoard()
data = sb.get_dict()['scoreboard']
print(f"Today: {data['gameDate']}")
print(f"Games: {len(data['games'])}")
for g in data['games']:
    away = g['awayTeam']['teamTricode']
    home = g['homeTeam']['teamTricode']
    print(f"{away} @ {home}")
