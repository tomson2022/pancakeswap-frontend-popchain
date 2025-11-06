# Common Tokens 配置更新

## 更新日期
2025-11-06

## 更新内容
在 PopChain 主网的 Common Tokens（常用代币）中添加 USDC，同时保持 WPOP/USDT 作为默认交易对。

## 修改的文件
`/apps/web/src/config/constants/exchange.ts`

## 配置详情

### 1. SUGGESTED_BASES (Common Tokens 显示)
在 Swap 页面底部显示的快捷选择代币列表：
```typescript
[ChainId.POPCHAIN]: [
  popchainMainnetTokens.wpop,   // POP
  popchainMainnetTokens.usdt,   // USDT  
  popchainMainnetTokens.usdc,   // USDC ⬅️ 新增
  popchainMainnetTokens.luma    // LUMA
]
```

### 2. BASES_TO_CHECK_TRADES_AGAINST (交易路径)
智能路由用于计算最优交易路径的基础代币：
```typescript
[ChainId.POPCHAIN]: [
  popchainMainnetTokens.wpop,
  popchainMainnetTokens.usdt,
  popchainMainnetTokens.usdc,   // ⬅️ 新增
  popchainMainnetTokens.luma
]
```

### 3. BASES_TO_TRACK_LIQUIDITY_FOR (流动性追踪)
用于追踪和显示流动性的代币对：
```typescript
[ChainId.POPCHAIN]: [
  popchainMainnetTokens.wpop,
  popchainMainnetTokens.usdt,
  popchainMainnetTokens.usdc,   // ⬅️ 新增
  popchainMainnetTokens.luma
]
```

### 4. PINNED_PAIRS (固定交易对)
推荐的交易对列表（第一个为默认交易对）：
```typescript
[ChainId.POPCHAIN]: [
  [popchainMainnetTokens.wpop, popchainMainnetTokens.usdt], // ⬅️ 默认交易对
  [popchainMainnetTokens.wpop, popchainMainnetTokens.usdc], // ⬅️ 新增
  [popchainMainnetTokens.usdt, popchainMainnetTokens.usdc], // ⬅️ 新增
  [popchainMainnetTokens.wpop, popchainMainnetTokens.luma],
  [popchainMainnetTokens.usdt, popchainMainnetTokens.luma],
]
```

## 用户体验改进

### 访问 Swap 页面时
1. **默认交易对**：WPOP ⇄ USDT（保持不变）
2. **Common tokens 显示**：POP | USDT | **USDC** | LUMA

### 功能增强
- ✅ 一键快速选择 USDC（无需搜索）
- ✅ USDC 参与智能路由计算（更优的交易路径）
- ✅ 支持 WPOP/USDC 和 USDT/USDC 交易对
- ✅ 更好的稳定币交易体验（USDT ⇄ USDC）

## 技术细节

### USDC 代币信息
- **地址**: `0x23E535391Ab0fbb0C897f2264ad8EE26BBa65624`
- **精度**: 6 decimals
- **符号**: USDC
- **名称**: USD Coin

### 配置顺序说明
Common Tokens 的显示顺序为：
1. **WPOP** - 原生代币包装版本
2. **USDT** - 主要稳定币
3. **USDC** - 次要稳定币（新增）
4. **LUMA** - 项目代币

### 默认交易对保持
`PINNED_PAIRS` 中的第一个交易对 `[WPOP, USDT]` 保持在首位，确保用户访问 Swap 页面时看到的仍是 WPOP/USDT 交易对。

## 影响范围

### Swap 功能
- Common tokens 快捷选择
- 交易路径优化
- 价格计算

### Liquidity 功能
- 添加流动性时的常用代币建议
- 流动性池显示和追踪

### Info 功能
- 交易对数据追踪
- 价格图表显示

## 后续建议

1. **创建流动性池**：
   - WPOP/USDC
   - USDT/USDC

2. **监控指标**：
   - USDC 使用率
   - USDC 相关交易对的流动性
   - 通过 USDC 路由的交易量

3. **用户教育**：
   - 说明 USDC 和 USDT 的区别
   - 推广 USDC 交易对

---

**变更类型**: 功能增强  
**风险等级**: 低  
**回滚方案**: 从配置数组中移除 `popchainMainnetTokens.usdc`

