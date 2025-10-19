#!/bin/bash

# PopChainSwap 部署脚本
# 使用方法: ./scripts/deploy.sh [production|staging]

set -e  # 遇到错误时退出

# 配置
DEPLOY_ENV=${1:-production}
PROJECT_ROOT="/Users/huzhichu/Documents/project/luma/pancakeswap-frontend-fork-master"
WEB_DIR="$PROJECT_ROOT/apps/web"
DEPLOY_DIR="/var/www/popchainswap"

echo "🚀 开始部署 PopChainSwap ($DEPLOY_ENV)"

# 1. 检查构建文件
echo "📋 检查构建文件..."
if [ ! -d "$WEB_DIR/.next" ]; then
    echo "❌ 构建文件不存在，请先运行: yarn build"
    exit 1
fi

echo "✅ 构建文件检查通过"

# 2. 创建部署目录
echo "📁 准备部署目录..."
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# 3. 备份现有部署 (如果存在)
if [ -d "$DEPLOY_DIR/.next" ]; then
    echo "💾 备份现有部署..."
    sudo mv $DEPLOY_DIR $DEPLOY_DIR.backup.$(date +%Y%m%d_%H%M%S)
    sudo mkdir -p $DEPLOY_DIR
    sudo chown $USER:$USER $DEPLOY_DIR
fi

# 4. 复制构建文件
echo "📦 复制构建文件..."
cp -r $WEB_DIR/.next $DEPLOY_DIR/
cp -r $WEB_DIR/public $DEPLOY_DIR/
cp $WEB_DIR/package.json $DEPLOY_DIR/
cp $WEB_DIR/next.config.mjs $DEPLOY_DIR/

# 5. 复制环境配置
if [ -f "$WEB_DIR/.env.$DEPLOY_ENV" ]; then
    echo "⚙️  复制环境配置..."
    cp $WEB_DIR/.env.$DEPLOY_ENV $DEPLOY_DIR/.env.production
fi

# 6. 安装生产依赖
echo "📚 安装生产依赖..."
cd $DEPLOY_DIR
npm install --production --silent

# 7. 设置文件权限
echo "🔐 设置文件权限..."
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# 8. 重启服务
echo "🔄 重启服务..."
if command -v pm2 &> /dev/null; then
    # 使用PM2管理
    pm2 stop popchainswap 2>/dev/null || true
    pm2 delete popchainswap 2>/dev/null || true
    pm2 start $DEPLOY_DIR/ecosystem.config.js
    pm2 save
else
    # 使用systemd管理
    sudo systemctl restart popchainswap 2>/dev/null || true
fi

# 9. 验证部署
echo "🧪 验证部署..."
sleep 5

# 检查服务状态
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ 部署成功！服务正常运行"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 部署可能有问题，请检查日志"
    if command -v pm2 &> /dev/null; then
        echo "📋 PM2日志: pm2 logs popchainswap"
    fi
    exit 1
fi

# 10. 清理旧备份 (保留最近3个)
echo "🧹 清理旧备份..."
cd /var/www
ls -t popchainswap.backup.* 2>/dev/null | tail -n +4 | xargs -r sudo rm -rf

echo "🎉 部署完成！"
echo ""
echo "📊 部署信息:"
echo "   - 环境: $DEPLOY_ENV"
echo "   - 目录: $DEPLOY_DIR"
echo "   - 大小: $(du -sh $DEPLOY_DIR/.next | cut -f1)"
echo "   - 时间: $(date)"
echo ""
echo "🔧 管理命令:"
if command -v pm2 &> /dev/null; then
    echo "   - 查看日志: pm2 logs popchainswap"
    echo "   - 重启服务: pm2 restart popchainswap"
    echo "   - 停止服务: pm2 stop popchainswap"
else
    echo "   - 查看日志: sudo journalctl -u popchainswap -f"
    echo "   - 重启服务: sudo systemctl restart popchainswap"
    echo "   - 停止服务: sudo systemctl stop popchainswap"
fi
