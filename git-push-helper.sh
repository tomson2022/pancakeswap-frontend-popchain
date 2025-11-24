#!/bin/bash
# Git 推送辅助脚本
# 自动检测并配置代理

echo "🔍 检查系统代理配置..."

# 检查 Wi-Fi 代理
WIFI_PROXY=$(networksetup -getwebproxy "Wi-Fi" 2>/dev/null | grep "Server:" | awk '{print $2}')
WIFI_PORT=$(networksetup -getwebproxy "Wi-Fi" 2>/dev/null | grep "Port:" | awk '{print $2}')

# 检查以太网代理
ETH_PROXY=$(networksetup -getwebproxy "Ethernet" 2>/dev/null | grep "Server:" | awk '{print $2}')
ETH_PORT=$(networksetup -getwebproxy "Ethernet" 2>/dev/null | grep "Port:" | awk '{print $2}')

if [ -n "$WIFI_PROXY" ] && [ "$WIFI_PROXY" != "127.0.0.1" ]; then
    PROXY="$WIFI_PROXY"
    PORT="$WIFI_PORT"
elif [ -n "$ETH_PROXY" ] && [ "$ETH_PROXY" != "127.0.0.1" ]; then
    PROXY="$ETH_PROXY"
    PORT="$ETH_PORT"
else
    PROXY="127.0.0.1"
    PORT="1087"
fi

echo "📡 检测到代理: $PROXY:$PORT"

# 检查 Git 是否已配置代理
CURRENT_PROXY=$(git config --global --get http.proxy)
if [ -z "$CURRENT_PROXY" ] || [ "$CURRENT_PROXY" != "http://$PROXY:$PORT" ]; then
    echo "⚙️  配置 Git 代理..."
    git config --global http.proxy "http://$PROXY:$PORT"
    git config --global https.proxy "http://$PROXY:$PORT"
    echo "✅ Git 代理已配置"
else
    echo "✅ Git 代理已配置"
fi

# 执行推送
echo ""
echo "🚀 开始推送..."
git push "$@"
