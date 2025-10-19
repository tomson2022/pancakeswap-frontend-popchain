# 代币LOGO配置说明

## 问题描述
在"Select a Token"（选择币种）弹窗中：
- ✅ **POP图标**正常显示（原生代币，从 `/images/chains/7257.png` 加载）
- ❌ **LUMA、USDT、WPOP** 图标无法正常显示（ERC20代币，外部URL无法访问）

## 解决方案
已实施方案1+2：在本地添加代币图片 + 修改tokenlist使用本地路径

## 已完成的更改

### 1. 扩展 `getTokenLogoURL.ts` 支持 POPCHAIN
**文件**: `apps/web/src/utils/getTokenLogoURL.ts`

添加了 POPCHAIN 本地图片映射：
- 主网 (7257): WPOP, USDT, LUMA
- 测试网 (16042): WPOP, USDT

现在该函数会为 POPCHAIN 代币返回本地路径：`/images/tokens/{symbol}.png`

### 2. 更新 Token List 配置
已更新以下文件的 `logoURI` 字段，从外部URL改为本地路径：

#### a) `popchain-default.tokenlist.json`
- WPOP: `/images/tokens/wpop.png`
- USDT: `/images/tokens/usdt.png`
- LUMA: `/images/tokens/luma.png`

#### b) `pancake-default.tokenlist.json`
- 同样更新了 POPCHAIN 相关代币的 logoURI

### 3. 创建占位符图片
已在 `/apps/web/public/images/tokens/` 目录下创建：
- `wpop.png` (占位符)
- `usdt.png` (占位符)
- `luma.png` (占位符)

**⚠️ 注意**: 当前使用 POP 链图标作为占位符，需要替换为真实的代币LOGO。

## 下一步：替换真实图片

### 获取代币LOGO
您需要准备以下代币的真实LOGO图片（推荐尺寸：128x128 或 256x256 PNG）：

1. **WPOP** - Wrapped POP 代币
2. **USDT** - Tether USD 代币  
3. **LUMA** - Luma Protocol 代币

### 替换图片
将真实图片替换到以下位置：
```bash
apps/web/public/images/tokens/wpop.png
apps/web/public/images/tokens/usdt.png
apps/web/public/images/tokens/luma.png
```

### 图片要求
- **格式**: PNG（推荐）或 SVG
- **尺寸**: 建议 128x128 或 256x256 像素
- **背景**: 透明背景（推荐）
- **命名**: 使用小写字母（已配置好）

## 添加新代币LOGO

如果将来需要添加新的 POPCHAIN 代币，请按以下步骤操作：

### 1. 添加图片
将代币图片放到 `apps/web/public/images/tokens/{symbol}.png`

### 2. 更新映射配置
编辑 `apps/web/src/utils/getTokenLogoURL.ts`，在 `popchainLocalTokens` 中添加：
```typescript
'0x代币合约地址': 'symbol', // 代币名称
```

### 3. 更新 Token List
在相应的 tokenlist.json 文件中添加代币配置，设置 `logoURI` 为：
```json
"logoURI": "/images/tokens/{symbol}.png"
```

## 代币LOGO显示机制

### 加载优先级
1. **原生代币** (POP): `/images/chains/{chainId}.png`
2. **ERC20代币**:
   - Token List 中的 `logoURI`（优先）
   - `getTokenLogoURL()` 返回的路径（后备）
   - 失败则显示默认图标（❓）

### 关键组件
- **CurrencyLogo**: `apps/web/src/components/Logo/CurrencyLogo.tsx`
- **Logo**: `apps/web/src/components/Logo/Logo.tsx`
- **getTokenLogoURL**: `apps/web/src/utils/getTokenLogoURL.ts`

## 测试
完成图片替换后，请测试：
1. 打开"Select a Token"（选择币种）弹窗
2. 检查 WPOP、USDT、LUMA 的图标是否正确显示
3. 在不同页面（Swap、Liquidity等）测试代币显示

## 相关文件
- `apps/web/src/utils/getTokenLogoURL.ts` ✅ 已修改
- `apps/web/src/config/constants/tokenLists/popchain-default.tokenlist.json` ✅ 已修改
- `apps/web/src/config/constants/tokenLists/pancake-default.tokenlist.json` ✅ 已修改
- `apps/web/public/images/tokens/wpop.png` ✅ 已创建（占位符）
- `apps/web/public/images/tokens/usdt.png` ✅ 已创建（占位符）
- `apps/web/public/images/tokens/luma.png` ✅ 已创建（占位符）

---
更新时间: 2025-10-18

