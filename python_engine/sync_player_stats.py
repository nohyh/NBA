"""
同步球员赛季数据到本地数据库
获取所有球员数据指标（得分、篮板、助攻、效率值等）
"""
import sqlite3
import os
from nba_api.stats.endpoints import leagueleaders

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

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

def sync_player_stats():
    """同步球员赛季数据"""
    
    player_map = get_player_id_map()
    if len(player_map) == 0:
        print("❌ 错误：数据库中没有球员数据，请先运行 init_db.py")
        return
    
    print(f"已加载 {len(player_map)} 名球员的 ID 映射")
    print("\n正在从 NBA API 获取球员赛季数据...")
    
    try:
        leaders = leagueleaders.LeagueLeaders(
            season='2025-26',
            stat_category_abbreviation='PTS',
            per_mode48='PerGame'
        )
        
        data = leaders.get_dict()
        headers = data['resultSet']['headers']
        players = data['resultSet']['rowSet']
        
        print(f"获取到 {len(players)} 名球员的数据")
        
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
                cursor.execute('DELETE FROM PlayerSeasonStat WHERE playerId = ? AND season = ?', (player_id, '2025-26'))
                cursor.execute('''
                    INSERT INTO PlayerSeasonStat (
                        playerId, season, gamesPlayed, min, pts, reb, ast, stl, blk, tov, pf,
                        fgm, fga, fgPct, fg3m, fg3a, tppPct, ftm, fta, ftPct,
                        oreb, dreb, eff, astTov, stlTov, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                ''', (
                    player_id, '2025-26', games_played, min_played, pts, reb, ast, stl, blk, tov, pf,
                    fgm, fga, fg_pct, fg3m, fg3a, fg3_pct, ftm, fta, ft_pct,
                    oreb, dreb, eff, ast_tov, stl_tov
                ))
                synced += 1
            except Exception as e:
                print(f"  ⚠️ 同步球员 {nba_id} 失败: {e}")
                skipped += 1
        
        conn.commit()
        
        print(f"\n🎉 同步完成！")
        print(f"  成功同步: {synced} 名球员")
        print(f"  跳过: {skipped} 名球员")
        
    except Exception as e:
        print(f"❌ 获取数据失败: {e}")

if __name__ == '__main__':
    sync_player_stats()
    conn.close()
