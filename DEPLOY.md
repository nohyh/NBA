# NBA 项目部署指南

> 前端: Vercel (保持不变)  
> 后端: 阿里云 Ubuntu 服务器

---

## 一、服务器环境准备

以 root 或 sudo 用户登录阿里云服务器后执行：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2 (进程守护)
sudo npm install -g pm2

# 安装 Python 3 和 pip
sudo apt install -y python3 python3-pip python3-venv

# 安装 Nginx (反向代理 + HTTPS)
sudo apt install -y nginx

# 安装 Git
sudo apt install -y git
```

---

## 二、部署后端代码

```bash
# 创建项目目录
sudo mkdir -p /var/www
cd /var/www

# 克隆代码（替换为你的仓库地址）
git clone https://github.com/你的用户名/NBA.git nba
cd nba

# 安装后端依赖
cd backend
npm install

# 生成 Prisma Client
npx prisma generate

# 创建 .env 文件（如果需要配置）
# cp .env.example .env
# nano .env
```

---

## 三、使用 PM2 启动后端

```bash
cd /var/www/nba/backend

# 启动服务
pm2 start src/server.js --name "nba-backend"

# 保存 PM2 配置（开机自启）
pm2 save
pm2 startup

# 查看运行状态
pm2 status
pm2 logs nba-backend
```

---

## 四、配置 Nginx 反向代理

```bash
sudo nano /etc/nginx/sites-available/nba-api
```

粘贴以下内容（将 `your-domain.com` 替换为你的域名）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/nba-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 五、配置 HTTPS（Let's Encrypt 免费证书）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（替换域名）
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

---

## 六、部署 Python 数据同步脚本

```bash
cd /var/www/nba/python_engine

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install nba_api requests

# 测试同步脚本
python sync_all.py
```

### 设置定时任务

```bash
crontab -e
```

添加以下行（每小时执行一次快速同步）：

```cron
0 * * * * cd /var/www/nba/python_engine && /var/www/nba/python_engine/venv/bin/python sync_all.py --quick >> /var/log/nba-sync.log 2>&1
```

---

## 七、更新 Vercel 前端环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的 NBA 前端项目
3. 点击 **Settings** → **Environment Variables**
4. 添加变量:
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://your-domain.com/api`
5. **重新部署前端** (Redeploy)

---

## 八、阿里云安全组配置

确保在阿里云控制台的安全组中开放以下端口：

| 端口 | 协议 | 用途 |
|------|------|------|
| 22 | TCP | SSH |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |

---

## 常用命令

```bash
# 查看后端状态
pm2 status

# 查看后端日志
pm2 logs nba-backend

# 重启后端
pm2 restart nba-backend

# 更新代码后
cd /var/www/nba
git pull
cd backend && npm install
pm2 restart nba-backend
```

---

## 故障排查

### 1. API 无法访问
```bash
# 检查后端是否运行
pm2 status

# 检查端口是否监听
netstat -tlnp | grep 3001

# 检查 Nginx 状态
sudo systemctl status nginx
```

### 2. CORS 错误
后端 `app.js` 已配置 `cors()`，如需指定域名：
```javascript
app.use(cors({
    origin: 'https://你的vercel域名.vercel.app'
}));
```

### 3. 数据同步失败
```bash
# 手动运行查看错误
cd /var/www/nba/python_engine
source venv/bin/activate
python sync_all.py
```
