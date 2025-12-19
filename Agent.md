 项目结构
NBA/
├── backend/           # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/   # API 控制器
│   │   ├── routes/        # 路由定义
│   │   ├── utils/         # 工具函数 (getETDate.js, prisma.js)
│   │   └── middleware/    # 中间件
│   ├── prisma/
│   │   └── schema.prisma  # 数据库模型
│   └── data/
│       └── nba_date.json  # NBA 日期文件（Python同步生成）
├── frontend/          # React + Vite + TailwindCSS
│   └── src/
│       ├── components/    # 组件
│       ├── pages/         # 页面
│       ├── hooks/         # React Query hooks
│       ├── services/      # API 调用
│       └── utils/         # 工具函数
└── python_engine/     # Python 数据同步脚本
    ├── init_db.py         # 初始化球队/球员数据
    ├── sync_games.py      # 同步赛程
    ├── sync_player_stats.py  # 同步球员赛季数据
    └── sync_game_logs.py  # 同步单场比赛数据+MVP
✅ 已完成功能
首页
 比赛轮播 - 
GameCarousel.jsx
 球队排名 TOP3 - 
MiniTeamRanking.jsx
（东西部）
 球员三榜第一 - 
MiniPlayerRanking.jsx
（得分王/篮板王/助攻王）
 今日 MVP - 
MvpCard.jsx
（公式：pts + ast×1.2 + reb + (stl+blk)×2 - tov×1.5）
后端 API
端点	功能
GET /api/games/:date	获取指定日期比赛
GET /api/teams/top?limit=N	获取东西部前N球队
GET /api/players/leaders?type=X&limit=N	获取排行榜
GET /api/players/mvpOfToday	获取今日MVP
数据同步
 球队和球员基础数据 (
init_db.py
)
 赛季赛程 (
sync_games.py
 - 使用 NBA CDN API)
 球员赛季统计 (
sync_player_stats.py
 - 25个字段)
 单场比赛数据 (
sync_game_logs.py
 - 生成 nba_date.json)
🔄 待开发功能
 球队排名详情页（完整排名+分页）
 球员数据页面（所有数据指标排行榜）
 新闻模块
 用户系统（收藏球队/球员）
 球员详情页（走势图表）
⚠️ 重要约定
1. Python 部分由我（AI）完成，Node.js 和前端由用户自己完成
2.你的作用在于辅助用户学习，并完成这个项目，以学习为重，完成为辅，所以遇到用户不懂的地方，不要基于直接给他代码或着是给出行动计划，而是带着他去学习，争取让他自己写代码。
3.对于用户写的代码，你要积极审查，看看是否符合最佳实践，是否有性能问题，以及UI调整。你需要及时提醒用户。来敦促他写出更好更规范的代码。
 数据库字段
PlayerSeasonStat（25个字段）
pts, reb, ast, stl, blk, tov, min, fgPct, tppPct, ftPct, fgm, fga, fg3m, fg3a, ftm, fta, oreb, dreb, eff, astTov, stlTov, gamesPlayed

PlayerGameLog（单场数据）
pts, reb, ast, stl, blk, tov, min, matchup, wl, gameDate, gameId

🚀 启动命令
# 后端
cd backend && nodemon src/server.js
# 前端
cd frontend && npm run dev
# 数据同步
cd python_engine
python init_db.py         # 初始化
python sync_games.py      # 同步赛程
python sync_player_stats.py  # 同步赛季数据
python sync_game_logs.py  # 同步单场数据+更新日期
📈 项目进度：约 35%
