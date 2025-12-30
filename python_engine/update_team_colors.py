"""
更新 NBA 球队主色调 (使用球队名称匹配而非缩写)
"""
import sqlite3
import os
from db_utils import get_db_path

# 30 支 NBA 球队的主色调 (按球队名称关键词匹配)
TEAM_COLORS = {
    "Hawks": "#E03A3E",       # 老鹰 - 亮红
    "Celtics": "#007A33",     # 凯尔特人 - 凯尔特绿
    "Nets": "#000000",        # 篮网 - 纯黑
    "Hornets": "#00788C",     # 黄蜂 - 青绿
    "Bulls": "#CE1141",       # 公牛 - 公牛红
    "Cavaliers": "#860038",   # 骑士 - 酒红
    "Mavericks": "#00538C",   # 独行侠 - 独行侠蓝
    "Nuggets": "#0E2240",     # 掘金 - 掘金深蓝
    "Pistons": "#1D42BA",     # 活塞 - 活塞蓝
    "Warriors": "#1D428A",    # 勇士 - 勇士蓝
    "Rockets": "#BA0C2F",     # 火箭 - 火箭深红
    "Pacers": "#002D62",      # 步行者 - 步行者藏蓝
    "Clippers": "#C8102E",    # 快船 - 快船红
    "Lakers": "#552583",      # 湖人 - 湖人紫
    "Grizzlies": "#5D76A9",   # 灰熊 - 灰熊蓝灰
    "Heat": "#98002E",        # 热火 - 热火暗红
    "Bucks": "#00471B",       # 雄鹿 - 雄鹿深绿
    "Timberwolves": "#78BE20",# 森林狼 - 森林狼绿
    "Pelicans": "#B4975A",    # 鹈鹕 - 鹈鹕金
    "Knicks": "#F58426",      # 尼克斯 - 尼克斯橙
    "Thunder": "#007AC1",     # 雷霆 - 雷霆天蓝
    "Magic": "#0077C0",       # 魔术 - 魔术蓝
    "76ers": "#ED174C",       # 76人 - 76人红
    "Suns": "#E56020",        # 太阳 - 太阳橙
    "Trail Blazers": "#1A1A1A", # 开拓者 - 开拓者黑
    "Kings": "#5A2D81",       # 国王 - 国王紫
    "Spurs": "#C4CED4",       # 马刺 - 马刺银
    "Raptors": "#753BBD",     # 猛龙 - 猛龙紫
    "Jazz": "#F9A01B",        # 爵士 - 爵士黄
    "Wizards": "#E31837",     # 奇才 - 奇才红
}

def update_team_colors():
    db_path = get_db_path()
    
    print(f"数据库路径: {db_path}")
    
    if not os.path.exists(db_path):
        print(f"错误: 数据库文件不存在: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, fullName FROM Team")
    teams = cursor.fetchall()
    
    print(f"找到 {len(teams)} 支球队\n")
    
    updated_count = 0
    for team_id, name, full_name in teams:
        # 使用球队名称查找颜色
        color = TEAM_COLORS.get(name)
        
        if color:
            cursor.execute(
                "UPDATE Team SET primaryColor = ? WHERE id = ?",
                (color, team_id)
            )
            print(f"✅ {name} ({full_name}): {color}")
            updated_count += 1
        else:
            print(f"⚠️  未找到 {name} ({full_name}) 的颜色配置")
    
    conn.commit()
    conn.close()
    
    print(f"\n完成! 更新了 {updated_count} 支球队的主色调")

if __name__ == "__main__":
    update_team_colors()
