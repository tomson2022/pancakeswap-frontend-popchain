# 代币LOGO显示问题 - 快速修复摘要 ✅

## 问题
LUMA、USDT、WPOP 代币图标在"Select a Token"弹窗中无法显示

## 根本原因
- Token list 中使用的外部 URL (`https://popchain.ai/images/...`) 无法访问
- `getTokenLogoURL.ts` 不支持 POPCHAIN (chainId 7257/16042)

## 解决方案 ✅

### 1. 代码更改
- ✅ **扩展 getTokenLogoURL.ts** - 添加 POPCHAIN 本地图片映射
- ✅ **更新 popchain-default.tokenlist.json** - logoURI 改为本地路径
- ✅ **更新 pancake-default.tokenlist.json** - logoURI 改为本地路径

### 2. 资源文件
- ✅ **创建占位符图片**:
  - `apps/web/public/images/tokens/wpop.png`
  - `apps/web/public/images/tokens/usdt.png`
  - `apps/web/public/images/tokens/luma.png`

## ⚠️ 需要您手动完成

**替换真实代币LOGO**

当前使用POP链图标作为占位符，请将以下文件替换为真实的代币LOGO：

```bash
apps/web/public/images/tokens/wpop.png
apps/web/public/images/tokens/usdt.png
apps/web/public/images/tokens/luma.png
```

**图片要求**:
- 格式: PNG (推荐) 或 SVG
- 尺寸: 128x128 或 256x256 像素
- 背景: 透明 (推荐)

## 测试步骤

1. 启动开发服务器: `yarn dev` 或 `npm run dev`
2. 打开应用，点击代币选择器
3. 验证 WPOP、USDT、LUMA 图标是否显示

## 参考文档

详细说明请查看: [TOKEN_LOGO_SETUP.md](./TOKEN_LOGO_SETUP.md)

---
修复完成时间: 2025-10-18

