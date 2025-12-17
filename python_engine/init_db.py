import sqlite3
import os
from nba_api.stats.endpoints import leaguestandings
from nba_api.stats.static import players

# 1. 连接数据库 (注意路径是相对于当前脚本的)
# Prisma 7.x 在 backend 根目录创建 dev.db
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

# ---------------------------------------------------------
# 第一步：获取球队数据 (使用 LeagueStandings 获取带有战绩的球队列表)
# ---------------------------------------------------------
print("正在从 NBA API 获取球队战绩数据...")
try:
    # 获取2024-25赛季的数据
    standings = leaguestandings.LeagueStandings(season='2025-26')
    teams_data = standings.get_dict()['resultSets'][0]['rowSet']

    # 这里的索引是根据 API 返回结果确定的，通常:
    # 2: TeamID, 3: City, 4: Name, 5: Conference, 6: Division, 12: Wins, 13: Losses, 14: WinPCT
    for team in teams_data:
        nba_id = team[2]
        city = team[3]
        name = team[4]
        full_name = f"{city} {name}"
        conference = team[5]
        division = team[6]
        wins = team[12]
        losses = team[13]
        win_rate = team[14]
        
        # 构造 Logo URL (NBA 官方 CDN)
        logo_url = f"https://cdn.nba.com/logos/nba/{nba_id}/global/L/logo.svg"
        
        # 插入或更新 Team 表
        # 注意：字段名必须与 Prisma 生成的 SQLite 表结构一致
        # Prisma 通常会把表名首字母大写 (Team)，字段名保持原样 (nbaId, fullName 等)
        cursor.execute('''
            INSERT INTO Team (nbaId, name, fullName, abbreviation, conference, division, logoUrl, wins, losses, winRate, rank)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT(nbaId) DO UPDATE SET
                wins=excluded.wins,
                losses=excluded.losses,
                winRate=excluded.winRate
        ''', (nba_id, name, full_name, name[0:3].upper(), conference, division, logo_url, wins, losses, win_rate))
        
    conn.commit()
    print(f"✅ 成功更新了 {len(teams_data)} 支球队的数据！")

except Exception as e:
    print(f"❌ 获取球队数据失败: {e}")

# ---------------------------------------------------------
# 第二步：获取现役球员数据
# ---------------------------------------------------------
print("正在获取现役球员列表...")
try:
    active_players = players.get_active_players()

    count = 0
    for p in active_players:
        nba_id = p['id']
        full_name = p['full_name']
        first_name = p['first_name']
        last_name = p['last_name']
        
        # 构造高清大头照 URL
        headshot_url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{nba_id}.png"
        
        # 插入 Player 表 (暂时只存基础信息，身高体重后面再单独更新，避免 API 速率限制)
        cursor.execute('''
            INSERT INTO Player (nbaId, firstName, lastName, fullName, headshotUrl)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(nbaId) DO NOTHING
        ''', (nba_id, first_name, last_name, full_name, headshot_url))
        count += 1
        
    conn.commit()
    print(f"✅ 成功存入 {count} 名现役球员的基础信息！")

except Exception as e:
    print(f"❌ 获取球员数据失败: {e}")

conn.close()
print("🎉 初始化完成！数据库已填充。")
