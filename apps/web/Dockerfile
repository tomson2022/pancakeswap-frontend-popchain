# PopChainSwap Docker部署配置

# 基础镜像
FROM node:16-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制package文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 安装依赖
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --production; \
  elif [ -f package-lock.json ]; then npm ci --production; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile --production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 运行时镜像
FROM base AS runner
WORKDIR /app

# 设置生产环境
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建nextjs用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=deps /app/node_modules ./node_modules
COPY .next ./.next
COPY public ./public
COPY package.json ./
COPY next.config.mjs ./

# 设置文件权限
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

# 暴露端口
EXPOSE 3000
ENV PORT 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 启动命令
CMD ["npm", "start"]
