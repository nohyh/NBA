import sqlite3
from nba_api.stats.endpoints import leaguedashplayerstats
from db_utils import get_db_path

SEASON = "2025-26"

# 1. 连接数据库 (Prisma 7.x 在 backend 根目录创建 dev.db)
db_path = get_db_path()
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"Connected to: {db_path}")
print(f"Fetching {SEASON} season player stats (PerGame)...")

try:
    # 获取所有球员赛季数据 - 使用 PerGame 模式获取场均数据
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season=SEASON,
        per_mode_detailed='PerGame'  # 关键！获取场均数据而非总数据
    )
    result_set = stats.get_dict()['resultSets'][0]
    
    headers = result_set['headers']
    data_set = result_set['rowSet']
    
    # 打印关键字段索引以便调试
    print(f"Headers sample: {headers[:10]}...")
    print(f"Total records: {len(data_set)}")
    
    # 根据 headers 动态获取索引
    idx = {header: i for i, header in enumerate(headers)}
    
    # 打印关键字段位置
    key_fields = ['PLAYER_ID', 'GP', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG_PCT', 'FG3_PCT', 'FT_PCT']
    print("Key field indices:", {k: idx.get(k) for k in key_fields})
    
    # 先清空旧数据
    cursor.execute("DELETE FROM PlayerSeasonStat WHERE season = ?", (SEASON,))
    print(f"Cleared old {SEASON} season data.")
    
    success_count = 0
    skip_count = 0
    
    for row in data_set:
        nba_id = row[idx['PLAYER_ID']]
        gp = row[idx['GP']]
        pts = row[idx['PTS']] or 0.0
        reb = row[idx['REB']] or 0.0
        ast = row[idx['AST']] or 0.0
        stl = row[idx['STL']] or 0.0
        blk = row[idx['BLK']] or 0.0
        fg_pct = row[idx['FG_PCT']] or 0.0
        fg3_pct = row[idx['FG3_PCT']] or 0.0
        ft_pct = row[idx['FT_PCT']] or 0.0
        
        # 找到对应的 Player 表内部 ID
        cursor.execute("SELECT id FROM Player WHERE nbaId = ?", (nba_id,))
        result = cursor.fetchone()
        
        if result:
            player_id = result[0]
            
            cursor.execute('''
                INSERT INTO PlayerSeasonStat 
                (playerId, season, gamesPlayed, pts, reb, ast, stl, blk, fgPct, tppPct, ftPct, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (player_id, SEASON, gp, pts, reb, ast, stl, blk, fg_pct, fg3_pct, ft_pct))
            
            success_count += 1
        else:
            skip_count += 1
    
    conn.commit()
    
    print(f"SUCCESS! Updated {success_count} player stats, skipped {skip_count}")
    
    # 验证 - 显示 Top 5 得分手
    print("\nTop 5 Scorers (PPG):")
    top = cursor.execute('''
        SELECT p.fullName, s.pts, s.reb, s.ast, s.gamesPlayed
        FROM PlayerSeasonStat s
        JOIN Player p ON s.playerId = p.id
        WHERE s.season = ?
        ORDER BY s.pts DESC
        LIMIT 5
    ''', (SEASON,)).fetchall()
    
    for i, (name, pts, reb, ast, gp) in enumerate(top, 1):
        print(f"  {i}. {name}: {pts:.1f} PPG, {reb:.1f} RPG, {ast:.1f} APG ({gp} games)")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

conn.close()
print("\nDone!")
