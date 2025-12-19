"""
同步 NBA 新闻到本地数据库
使用 ESPN 免费公开 API
"""
import sqlite3
import os
import requests
from datetime import datetime

# 连接数据库
db_path = os.path.join(os.path.dirname(__file__), '../backend/prisma/dev.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"已连接到数据库: {db_path}")

# ESPN 免费 API - 无需 API Key！
ESPN_API_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=50"

def sync_news(limit=20):
    """从 ESPN 获取 NBA 新闻并存入数据库"""
    
    print(f"\n正在从 ESPN 获取 NBA 新闻...")
    
    try:
        resp = requests.get(ESPN_API_URL, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        articles = data.get('articles', [])
    except Exception as e:
        print(f"❌ 获取新闻失败: {e}")
        return
    
    print(f"获取到 {len(articles)} 条新闻")
    
    # 清空旧新闻（每次同步都刷新）
    cursor.execute("DELETE FROM News")
    print("已清空旧新闻数据")
    
    synced_count = 0
    
    for article in articles[:limit]:
        try:
            # 提取新闻数据
            title = article.get('headline', '')
            description = article.get('description', '')
            
            # 获取文章链接
            links = article.get('links', {})
            web_link = links.get('web', {})
            url = web_link.get('href', '') if isinstance(web_link, dict) else ''
            
            # 获取图片
            images = article.get('images', [])
            image_url = images[0].get('url', '') if images else ''
            
            # 来源固定为 ESPN
            source = 'ESPN'
            
            # 插入新闻记录
            cursor.execute('''
                INSERT INTO News (title, url, source, imageUrl, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
            ''', (title, url, source, image_url))
            
            synced_count += 1
            print(f"  ✅ {title[:50]}...")
            
        except Exception as e:
            print(f"  ⚠️ 同步新闻失败: {e}")
    
    conn.commit()
    
    print(f"\n🎉 同步完成！")
    print(f"  成功同步: {synced_count} 条新闻")

if __name__ == '__main__':
    sync_news()
    conn.close()
