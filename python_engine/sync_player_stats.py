"""
同步球员赛季数据到本地数据库
获取所有球员数据指标（得分、篮板、助攻、效率值等）

用法:
  python sync_player_stats.py              # 同步当前赛季常规赛
  python sync_player_stats.py --all        # 同步所有赛季（常规赛+季后赛）
  python sync_player_stats.py 2023-24      # 同步指定赛季常规赛
  python sync_player_stats.py 2023-24 Playoffs  # 同步指定赛季季后赛
"""
import sqlite3
import os
import sys
import time
from nba_api.stats.endpoints import leagueleaders

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

# 当前赛季
CURRENT_SEASON = "2025-26"

# 可同步的赛季列表
AVAILABLE_SEASONS = [
    "2025-26",
    "2024-25",
    "2023-24",
    "2022-23",
    "2021-22",
]

# 赛季类型
SEASON_TYPES = ["Regular Season", "Playoffs"]

def get_player_id_map():
    """获取 nbaId -> 本地数据库 id 的映射"""
    cursor.execute("SELECT id, nbaId FROM Player")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def safe_get(player, idx, key, default=0):
    """安全获取数据，处理 None 值"""
    try:
        val = player[idx[key]]
        return val if val is not None else default
    except:
        return default

def sync_player_stats(season=CURRENT_SEASON, season_type="Regular Season"):
    """同步球员赛季数据"""
    
    player_map = get_player_id_map()
    if len(player_map) == 0:
        print("❌ 错误：数据库中没有球员数据，请先运行 init_db.py")
        return 0
    
    print(f"\n📊 开始同步 {season} {season_type} 球员数据...")
    
    try:
        leaders = leagueleaders.LeagueLeaders(
            season=season,
            season_type_all_star=season_type,
            stat_category_abbreviation='PTS',
            per_mode48='PerGame'
        )
        
        data = leaders.get_dict()
        headers = data['resultSet']['headers']
        players = data['resultSet']['rowSet']
        
        if len(players) == 0:
            print(f"  ⚠️ 没有找到 {season} {season_type} 的数据")
            return 0
        
        print(f"  获取到 {len(players)} 名球员的数据")
        
        idx = {h: i for i, h in enumerate(headers)}
        
        synced = 0
        skipped = 0
        
        for player in players:
            nba_id = player[idx['PLAYER_ID']]
            player_id = player_map.get(nba_id)
            
            if not player_id:
                skipped += 1
                continue
            
            # 提取所有数据
            games_played = safe_get(player, idx, 'GP')
            min_played = safe_get(player, idx, 'MIN')
            pts = safe_get(player, idx, 'PTS')
            reb = safe_get(player, idx, 'REB')
            ast = safe_get(player, idx, 'AST')
            stl = safe_get(player, idx, 'STL')
            blk = safe_get(player, idx, 'BLK')
            tov = safe_get(player, idx, 'TOV')
            pf = safe_get(player, idx, 'PF')
            
            # 投篮数据
            fgm = safe_get(player, idx, 'FGM')
            fga = safe_get(player, idx, 'FGA')
            fg_pct = safe_get(player, idx, 'FG_PCT')
            fg3m = safe_get(player, idx, 'FG3M')
            fg3a = safe_get(player, idx, 'FG3A')
            fg3_pct = safe_get(player, idx, 'FG3_PCT')
            ftm = safe_get(player, idx, 'FTM')
            fta = safe_get(player, idx, 'FTA')
            ft_pct = safe_get(player, idx, 'FT_PCT')
            
            # 篮板细分
            oreb = safe_get(player, idx, 'OREB')
            dreb = safe_get(player, idx, 'DREB')
            
            # 高级数据
            eff = safe_get(player, idx, 'EFF')
            ast_tov = safe_get(player, idx, 'AST_TOV')
            stl_tov = safe_get(player, idx, 'STL_TOV')
            
            try:
                cursor.execute('DELETE FROM PlayerSeasonStat WHERE playerId = ? AND season = ? AND seasonType = ?', 
                             (player_id, season, season_type))
                cursor.execute('''
                    INSERT INTO PlayerSeasonStat (
                        playerId, season, seasonType, gamesPlayed, min, pts, reb, ast, stl, blk, tov, pf,
                        fgm, fga, fgPct, fg3m, fg3a, tppPct, ftm, fta, ftPct,
                        oreb, dreb, eff, astTov, stlTov, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                ''', (
                    player_id, season, season_type, games_played, min_played, pts, reb, ast, stl, blk, tov, pf,
                    fgm, fga, fg_pct, fg3m, fg3a, fg3_pct, ftm, fta, ft_pct,
                    oreb, dreb, eff, ast_tov, stl_tov
                ))
                synced += 1
            except Exception as e:
                print(f"  ⚠️ 同步球员 {nba_id} 失败: {e}")
                skipped += 1
        
        conn.commit()
        
        print(f"  ✅ {season} {season_type}: 同步 {synced} 名，跳过 {skipped} 名")
        return synced
        
    except Exception as e:
        print(f"  ❌ 获取数据失败: {e}")
        return 0

def sync_all_seasons():
    """同步所有赛季（常规赛+季后赛）"""
    print(f"\n🏀 开始同步 {len(AVAILABLE_SEASONS)} 个赛季...")
    total = 0
    
    for season in AVAILABLE_SEASONS:
        for season_type in SEASON_TYPES:
            # 跳过当前赛季的季后赛（还没开始）
            if season == CURRENT_SEASON and season_type == "Playoffs":
                print(f"  ⏭️ 跳过 {season} {season_type}（赛季进行中）")
                continue
            
            count = sync_player_stats(season, season_type)
            total += count
            time.sleep(1.5)  # 避免 API 限流
    
    print(f"\n🎉 全部完成！共同步 {total} 条记录")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == "--all":
            sync_all_seasons()
        else:
            # 同步指定赛季
            season = arg
            season_type = sys.argv[2] if len(sys.argv) > 2 else "Regular Season"
            sync_player_stats(season, season_type)
    else:
        # 默认只同步当前赛季常规赛
        sync_player_stats()
    
    conn.close()
