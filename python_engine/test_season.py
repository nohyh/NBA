from nba_api.stats.endpoints import LeagueDashTeamStats

# 测试 2023-24 赛季老鹰的战绩
stats = LeagueDashTeamStats(season='2023-24', per_mode_detailed='PerGame')
df = stats.get_data_frames()[0]

hawks = df[df['TEAM_NAME'] == 'Atlanta Hawks']
print("Hawks 2023-24:")
print(f"  Wins: {hawks['W'].values[0]}")
print(f"  Losses: {hawks['L'].values[0]}")
print(f"  Win%: {hawks['W_PCT'].values[0]}")
print(f"  Win% (calculated): {hawks['W'].values[0] / (hawks['W'].values[0] + hawks['L'].values[0]):.3f}")
