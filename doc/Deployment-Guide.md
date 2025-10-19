# Next.js 部署指南

## 📦 构建文件部署说明

### 🎯 构建输出结构

```
apps/web/.next/                    # Next.js构建输出 (2.9GB)
├── static/                        # 静态资源 (可部署到CDN)
│   ├── chunks/                    # JavaScript代码分割文件
│   ├── css/                       # CSS样式文件
│   └── media/                     # 优化后的媒体文件
├── server/                        # 服务器端代码
│   ├── pages/                     # 服务器端渲染页面
│   └── chunks/                    # 服务器端代码分割
├── BUILD_ID                       # 构建标识
├── build-manifest.json            # 构建清单
├── prerender-manifest.json        # 预渲染清单
└── routes-manifest.json           # 路由清单
```

## 🚀 部署方案

### 方案一：Node.js服务器部署 (推荐)

#### 1. 准备部署文件
```bash
# 创建部署目录
mkdir deployment
cd deployment

# 复制必需文件
cp -r /path/to/apps/web/.next ./
cp -r /path/to/apps/web/public ./
cp /path/to/apps/web/package.json ./
cp /path/to/apps/web/next.config.mjs ./

# 复制环境配置 (如果有)
cp /path/to/apps/web/.env.production ./ # 可选
```

#### 2. 安装生产依赖
```bash
# 在部署目录中安装依赖
npm install --production

# 或者只安装运行时依赖
npm install next react react-dom
```

#### 3. 启动生产服务器
```bash
# 方式1：使用npm
npm start

# 方式2：直接使用next
npx next start

# 方式3：指定端口
npx next start -p 3000
```

#### 4. 使用PM2管理进程 (推荐)
```bash
# 安装PM2
npm install -g pm2

# 创建PM2配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'popchainswap',
    script: 'npx',
    args: 'next start -p 3000',
    cwd: '/path/to/deployment',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 方案二：Docker容器部署

#### 1. 创建Dockerfile
```dockerfile
# 创建 Dockerfile
FROM node:16-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建文件
COPY --from=deps /app/node_modules ./node_modules
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. 构建和运行Docker
```bash
# 构建镜像
docker build -t popchainswap .

# 运行容器
docker run -p 3000:3000 popchainswap
```

### 方案三：静态部署 (仅适用于静态页面)

#### 1. 导出静态文件
```bash
# 修改 next.config.mjs 添加
const config = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# 重新构建
yarn build

# 导出静态文件
npx next export
```

#### 2. 部署到静态托管
```bash
# 部署文件在 apps/web/out/ 目录
# 可以部署到：
# - Vercel
# - Netlify  
# - GitHub Pages
# - AWS S3
# - 任何静态文件服务器
```

### 方案四：云平台部署

#### Vercel部署 (推荐)
```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 在项目根目录创建vercel.json
cat > vercel.json << 'EOF'
{
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ]
}
EOF

# 3. 部署
vercel --prod
```

#### Netlify部署
```bash
# 1. 在项目根目录创建netlify.toml
cat > netlify.toml << 'EOF'
[build]
  base = "apps/web"
  command = "yarn build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 2. 连接GitHub仓库并自动部署
```

## 🔧 环境配置

### 环境变量设置

#### 生产环境变量
```bash
# 创建 .env.production
NODE_ENV=production
NEXT_PUBLIC_CHAIN_ID=7257
NEXT_PUBLIC_NODE_PRODUCTION=https://rpc.popchain.ai
NEXT_PUBLIC_USE_CUSTOM_LOGO=true

# 其他必需的环境变量...
```

#### 运行时环境变量
```bash
# 启动时设置
PORT=3000 \
NODE_ENV=production \
NEXT_PUBLIC_CHAIN_ID=7257 \
npm start
```

## 🌐 Nginx反向代理配置

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 静态资源缓存
    location /_next/static/ {
        alias /path/to/deployment/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 公共资源
    location /images/ {
        alias /path/to/deployment/public/images/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Logo文件
    location ~ \.(png|jpg|jpeg|gif|svg)$ {
        root /path/to/deployment/public;
        expires 30d;
        add_header Cache-Control "public";
    }

    # 应用代理
    location / {
        proxy_pass http://localhost:3000;
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

## 📊 性能优化

### CDN部署优化
```bash
# 将静态资源部署到CDN
apps/web/.next/static/     → CDN URL
apps/web/public/           → CDN URL

# 修改next.config.mjs
const config = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://your-cdn.com' 
    : '',
}
```

### 缓存策略
```javascript
// 推荐的缓存设置
static/chunks/          # 1年缓存 (文件名包含hash)
static/css/             # 1年缓存 (文件名包含hash)
static/media/           # 1年缓存 (文件名包含hash)
public/images/          # 30天缓存
public/logo*.png        # 7天缓存 (可能更新)
```

## 🔍 部署检查清单

### 部署前检查
- [ ] 构建成功：`yarn build` 无错误
- [ ] 环境变量：生产环境配置正确
- [ ] 静态资源：logo文件存在于public目录
- [ ] 域名配置：DNS指向正确
- [ ] SSL证书：HTTPS配置

### 部署后验证
- [ ] 页面访问：主要页面正常加载
- [ ] 功能测试：Swap/Liquidity功能正常
- [ ] Logo显示：主题切换logo正确
- [ ] 移动端：响应式布局正常
- [ ] 性能检查：页面加载速度

## 🚨 注意事项

### 重要提醒
1. **依赖安装**：确保生产环境安装了所有必需依赖
2. **端口配置**：确保防火墙开放相应端口
3. **进程管理**：使用PM2或systemd管理Node.js进程
4. **监控设置**：配置日志和性能监控
5. **备份策略**：定期备份应用和数据

### 常见问题
- **内存不足**：Next.js应用需要足够内存 (建议2GB+)
- **文件权限**：确保部署用户有正确的文件访问权限
- **网络连接**：确保服务器能访问外部API和区块链RPC
- **时区设置**：服务器时区可能影响数据显示

---

选择最适合您基础设施的部署方案，推荐使用**Node.js + PM2 + Nginx**的组合，这是最稳定和高性能的部署方式。
