# NBA 项目 AI 助手指南

## 📋 项目概述
这是一个**全栈 NBA 数据平台**，用于展示球队/球员数据、赛程日历、用户系统等功能。
- **目的**：用户学习全栈开发的实践项目，计划月底前完成核心功能
- **用户背景**：大三学生，正在学习前端/全栈开发，基础还在巩固中

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Vite + TailwindCSS + shadcn/ui |
| 状态管理 | React Query（数据） + Context（用户认证） |
| 后端 | Node.js + Express + Prisma ORM |
| 数据库 | PostgreSQL |
| 数据同步 | Python 脚本（NBA API → 数据库） |

## 📁 项目结构
```
NBA/
├── backend/           # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/   # API 控制器
│   │   ├── routes/        # 路由定义
│   │   ├── utils/         # 工具函数 (jwt.js, prisma.js)
│   │   └── middleware/    # auth.js
│   └── prisma/
│       └── schema.prisma  # 数据库模型
├── frontend/          # React + Vite
│   └── src/
│       ├── components/    # UI 组件
│       ├── pages/         # 页面
│       ├── hooks/         # React Query hooks
│       ├── services/      # API 调用
│       ├── context/       # AuthContext.jsx
│       └── utils/         # 工具函数
└── python_engine/     # Python 数据同步脚本
```

## ✅ 已完成功能（约 80%）

### 前端页面
| 页面 | 核心组件 | 状态 |
|------|----------|------|
| 首页 | GameCarousel, MiniTeamRanking, MiniPlayerRanking, MvpCard | ✅ |
| 球队排行 | TeamRank.jsx（历史赛季 + 折叠） | ✅ |
| 球员排行 | PlayerRank.jsx（分页 + 多维筛选） | ✅ |
| 赛程日历 | Gamecalendar.jsx（周视图 + 日期选择） | ✅ |
| 登录弹窗 | Login.jsx（渐进式表单） | ✅ |

### 用户认证系统
- JWT token 机制（登录/注册/登出）
- AuthContext 全局状态管理
- 用户名检查 API（/users/checkUsername）
- 密码加密（bcrypt）
- 自动恢复登录状态（刷新页面保持登录）

### 后端 API
| 端点 | 功能 |
|------|------|
| `GET /api/games?date=` | 获取指定日期比赛 |
| `GET /api/teams/top?type=&season=` | 获取东西部球队排名 |
| `GET /api/players/topPlayer?dataType=&season=` | 获取球员数据排行 |
| `POST /api/users/signin` | 登录 |
| `POST /api/users/signup` | 注册 |
| `GET /api/users/me` | 获取当前用户（需 JWT） |
| `GET /api/users/checkUsername` | 检查用户名是否存在 |

## 🔄 待开发功能（约 20%）

| 功能 | 优先级 | 预估时间 |
|------|--------|----------|
| 球员详情页 | 🔴 高 | 3-4h |
| 球队详情页 | 🔴 高 | 2-3h |
| 用户 Profile 页（关注/收藏） | 🟡 中 | 3-4h |
| 搜索功能 | 🟡 中 | 3-4h |
| UI 美化 | 🟢 低 | 2-3h |

## ⚠️ AI 协作规范

### 1. 教学优先
- 用户说"帮我改"时，先**解释原因**再给代码
- 遇到用户不懂的地方，先引导理解，不要直接给完整解决方案
- 鼓励用户自己尝试，只在卡住时提供帮助

### 2. 代码审查
- 检查是否符合最佳实践
- 关注性能问题（不必要的重渲染、API 重复调用）
- UI/UX 建议

### 3. 分工约定
- **Python 脚本**：AI 可以直接编写
- **Node.js 和前端**：用户主导，AI 辅助

### 4. 沟通风格
- 用中文交流
- 简洁直接，不要长篇大论
- 给出具体代码位置（文件名 + 行号）

## 🚀 启动命令
```bash
# 后端
cd backend && nodemon src/server.js

# 前端
cd frontend && npm run dev

# Prisma Studio（数据库管理）
cd backend && npx prisma studio
```

## 📊 数据库模型要点

### User
- id, username, password(hashed)

### Team / TeamSeasonStat
- 球队基础信息 + 赛季战绩（wins, losses, winRate）

### Player / PlayerSeasonStat
- 球员基础信息 + 赛季数据（25个字段）
- 关联：player.teamId → Team

### Game
- gameId, gameDate, homeTeam, awayTeam, score, status

## 📈 项目进度：约 80%
**剩余时间**：7天（截止 12月31日）
**剩余工时**：约 14-20 小时
**状态**：✅ 时间充足
