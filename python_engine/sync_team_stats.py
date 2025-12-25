"""
同步球队赛季统计数据
使用 nba_api 获取球队场均数据和效率数据

用法:
  python sync_team_stats.py              # 同步当前赛季
  python sync_team_stats.py 2023-24      # 同步指定赛季
  python sync_team_stats.py --all        # 同步最近5个赛季
"""
import sqlite3
import os
import sys
from nba_api.stats.endpoints import LeagueDashTeamStats
from nba_api.stats.static import teams
import time

# 数据库路径
db_path = os.path.join(os.path.dirname(__file__), "../backend/prisma/dev.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
print(f"已连接到数据库: {db_path}")

# 当前赛季
CURRENT_SEASON = "2025-26"

# 可同步的历史赛季列表
AVAILABLE_SEASONS = [
    "2025-26",
    "2024-25",
    "2023-24",
    "2022-23",
    "2021-22",
]

def get_nba_team_id_map():
    """获取本地数据库中的球队 nbaId -> id 映射"""
    cursor.execute("SELECT id, nbaId FROM Team")
    rows = cursor.fetchall()
    return {row[1]: row[0] for row in rows}

def sync_team_stats(season=CURRENT_SEASON):
    """从 NBA API 获取球队统计数据并存入数据库"""
    print(f"\n📊 开始同步 {season} 赛季球队统计数据...")
    
    # 获取本地球队映射
    team_map = get_nba_team_id_map()
    if not team_map:
        print("❌ 数据库中没有球队数据，请先运行 init_db.py")
        return
    
    print(f"  找到 {len(team_map)} 支球队")
    
    try:
        # 调用 NBA API 获取球队统计数据
        print("  正在请求 NBA API...")
        
        # 基础统计数据
        base_stats = LeagueDashTeamStats(
            season=season,
            per_mode_detailed='PerGame',  # 场均数据
            measure_type_detailed_defense='Base'
        )
        base_df = base_stats.get_data_frames()[0]
        
        time.sleep(1)  # 避免请求过快
        
        # 进阶统计数据 (效率)
        adv_stats = LeagueDashTeamStats(
            season=season,
            per_mode_detailed='PerGame',
            measure_type_detailed_defense='Advanced'
        )
        adv_df = adv_stats.get_data_frames()[0]
        
        print(f"  获取到 {len(base_df)} 支球队的数据")
        
        synced_count = 0
        
        for _, row in base_df.iterrows():
            nba_team_id = row['TEAM_ID']
            
            # 查找本地球队 ID
            if nba_team_id not in team_map:
                print(f"  ⚠️ 未找到球队 {row['TEAM_NAME']} (nbaId={nba_team_id})")
                continue
            
            team_id = team_map[nba_team_id]
            
            # 获取进阶数据
            adv_row = adv_df[adv_df['TEAM_ID'] == nba_team_id]
            if adv_row.empty:
                off_rating = def_rating = net_rating = pace = 0
            else:
                adv_row = adv_row.iloc[0]
                off_rating = float(adv_row.get('OFF_RATING', 0) or 0)
                def_rating = float(adv_row.get('DEF_RATING', 0) or 0)
                net_rating = float(adv_row.get('NET_RATING', 0) or 0)
                pace = float(adv_row.get('PACE', 0) or 0)
            
            # 准备数据
            stats_data = {
                'teamId': team_id,
                'season': season,
                'wins': int(row.get('W', 0) or 0),
                'losses': int(row.get('L', 0) or 0),
                'winRate': float(row.get('W_PCT', 0) or 0),
                'pts': float(row.get('PTS', 0) or 0),
                'oppPts': float(row.get('OPP_PTS', 0) or 0) if 'OPP_PTS' in row else 0,
                'reb': float(row.get('REB', 0) or 0),
                'ast': float(row.get('AST', 0) or 0),
                'stl': float(row.get('STL', 0) or 0),
                'blk': float(row.get('BLK', 0) or 0),
                'tov': float(row.get('TOV', 0) or 0),
                'fgPct': float(row.get('FG_PCT', 0) or 0),
                'fg3Pct': float(row.get('FG3_PCT', 0) or 0),
                'ftPct': float(row.get('FT_PCT', 0) or 0),
                'offRating': off_rating,
                'defRating': def_rating,
                'netRating': net_rating,
                'pace': pace
            }
            
            # 使用 UPSERT (INSERT OR REPLACE)
            cursor.execute("""
                INSERT INTO TeamSeasonStat 
                (teamId, season, wins, losses, winRate, pts, oppPts, reb, ast, stl, blk, tov, fgPct, fg3Pct, ftPct, offRating, defRating, netRating, pace)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(teamId, season) DO UPDATE SET
                wins = excluded.wins,
                losses = excluded.losses,
                winRate = excluded.winRate,
                pts = excluded.pts,
                oppPts = excluded.oppPts,
                reb = excluded.reb,
                ast = excluded.ast,
                stl = excluded.stl,
                blk = excluded.blk,
                tov = excluded.tov,
                fgPct = excluded.fgPct,
                fg3Pct = excluded.fg3Pct,
                ftPct = excluded.ftPct,
                offRating = excluded.offRating,
                defRating = excluded.defRating,
                netRating = excluded.netRating,
                pace = excluded.pace
            """, (
                stats_data['teamId'], stats_data['season'],
                stats_data['wins'], stats_data['losses'], stats_data['winRate'],
                stats_data['pts'], stats_data['oppPts'],
                stats_data['reb'], stats_data['ast'],
                stats_data['stl'], stats_data['blk'],
                stats_data['tov'], stats_data['fgPct'],
                stats_data['fg3Pct'], stats_data['ftPct'],
                stats_data['offRating'], stats_data['defRating'],
                stats_data['netRating'], stats_data['pace']
            ))
            
            synced_count += 1
        
        conn.commit()
        print(f"  ✅ {season} 赛季统计数据同步完成！已更新 {synced_count} 支球队")
        
        # 更新 Team.rank 字段（分区排名）
        print(f"  📊 计算分区排名...")
        for conference in ['East', 'West']:
            # 获取该分区所有球队的胜率，按胜率降序
            cursor.execute("""
                SELECT t.id, ts.winRate
                FROM Team t
                JOIN TeamSeasonStat ts ON t.id = ts.teamId
                WHERE t.conference = ? AND ts.season = ?
                ORDER BY ts.winRate DESC
            """, (conference, season))
            
            teams_in_conf = cursor.fetchall()
            
            # 更新排名
            for rank, (team_id, win_rate) in enumerate(teams_in_conf, start=1):
                cursor.execute("UPDATE Team SET rank = ? WHERE id = ?", (rank, team_id))
            
            print(f"    {conference}: 已更新 {len(teams_in_conf)} 支球队排名")
        
        conn.commit()
        print(f"  ✅ {season} 赛季排名更新完成！")
        return synced_count
        
    except Exception as e:
        print(f"❌ 同步失败: {e}")
        import traceback
        traceback.print_exc()
        return 0

def sync_multiple_seasons(seasons=AVAILABLE_SEASONS):
    """同步多个赛季的数据"""
    print(f"\n🏀 开始同步 {len(seasons)} 个赛季...")
    total = 0
    for season in seasons:
        count = sync_team_stats(season)
        total += count
        time.sleep(2)  # 避免 API 限流
    print(f"\n🎉 全部完成！共同步 {total} 条记录")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == "--all":
            sync_multiple_seasons()
        else:
            # 同步指定赛季
            sync_team_stats(arg)
    else:
        # 默认只同步当前赛季
        sync_team_stats()
    conn.close()

