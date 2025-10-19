# PopPrice 价格集成指南

本文档说明如何正确配置和获取POP代币的价格显示，以及与原CAKE价格系统的对比分析。

## 🔍 问题分析

### 原CAKE价格系统
**工作原理：**
- 通过`useCakeBusdPrice`从BUSD/CAKE交易对获取价格
- 使用`usePriceByPairs(BUSD[cake.chainId], cake)`查询链上交易对
- 实时从DEX合约获取储备金比例计算价格
- 支持主网和测试网的自动切换

### 当前POP价格问题
**问题根源：**
1. `usePopPrice.ts`中使用了硬编码的模拟价格（0.1）
2. 没有实现真实的交易对价格查询
3. PopPrice组件使用了错误的代币地址链接

## 🔧 修复方案

### 已修复的问题

#### 1. 更新价格获取逻辑
**文件：** `apps/web/src/hooks/usePopPrice.ts`

```typescript
export const usePopBusdPrice = ({ forceMainnet = false } = {}): number => {
  const { chainId } = useActiveChainId()
  
  // 根据网络选择对应的代币
  const wpop: ERC20Token | undefined = useMemo(() => {
    if (chainId === ChainId.POPCHAIN) {
      return popchainMainnetTokens.wpop  // 主网WPOP
    } else if (chainId === ChainId.POPCHAIN_TESTNET) {
      return popchainTokens.wpop         // 测试网WPOP
    }
    return undefined
  }, [chainId])

  const usdt: ERC20Token | undefined = useMemo(() => {
    if (chainId === ChainId.POPCHAIN || chainId === ChainId.POPCHAIN_TESTNET) {
      return USDT[chainId]               // 对应网络的USDT
    }
    return undefined
  }, [chainId])

  // 通过 WPOP/USDT 交易对获取价格
  const wpopUsdtPrice = usePriceByPairs(usdt, wpop)

  return useMemo(() => {
    if (wpopUsdtPrice) {
      return parseFloat(wpopUsdtPrice.toSignificant(6))
    }
    return 0
  }, [wpopUsdtPrice])
}
```

#### 2. 修复PopPrice组件地址
**文件：** `apps/web/src/components/PopPrice/PopPrice.tsx`

```typescript
// 根据当前网络选择正确的 WPOP 地址
const wpopAddress = useMemo(() => {
  if (chainId === ChainId.POPCHAIN) {
    return '0x11c44AED3d69152486D92B3161696FcF38F84dB8' // 主网 WPOP 地址
  } else if (chainId === ChainId.POPCHAIN_TESTNET) {
    return '0x897FE3AFf41Dc5174504361926576ed2e5173F8D' // 测试网 WPOP 地址
  }
  return ''
}, [chainId])

// 使用动态地址
href={`/swap?outputCurrency=${wpopAddress}`}
```

## 📋 获取正确POP价格的要求

### 1. 必需的交易对

**主网 (ChainId.POPCHAIN = 7257):**
```typescript
交易对: WPOP/USDT
WPOP地址: 0x11c44AED3d69152486D92B3161696FcF38F84dB8
USDT地址: 0xC6003142FD16Ad0b0A33B840173867CcDc2F4EC3
```

**测试网 (ChainId.POPCHAIN_TESTNET = 16042):**
```typescript
交易对: WPOP/USDT  
WPOP地址: 0x897FE3AFf41Dc5174504361926576ed2e5173F8D
USDT地址: 0x7faD4D267eD3820152afe42A99a2b95797504fA7
```

### 2. 需要的数据源

#### DEX合约数据
- **交易对合约地址** - WPOP/USDT LP合约
- **储备金数据** - `getReserves()`方法返回的reserve0和reserve1
- **代币排序** - 确定哪个是token0，哪个是token1

#### 价格计算公式
```typescript
// 如果WPOP是token0, USDT是token1
popPrice = reserve1 / reserve0

// 如果USDT是token0, WPOP是token1  
popPrice = reserve0 / reserve1
```

### 3. 实现步骤

#### Step 1: 确保交易对存在
```bash
# 检查WPOP/USDT交易对是否已创建
# 主网: 查询Factory合约getPair(wpop, usdt)
# 测试网: 查询Factory合约getPair(wpop, usdt)
```

#### Step 2: 验证代币配置
```typescript
// 确认代币地址配置正确
import { popchainMainnetTokens, popchainTokens, USDT } from '@pancakeswap/tokens'

console.log('主网WPOP:', popchainMainnetTokens.wpop.address)
console.log('主网USDT:', USDT[ChainId.POPCHAIN].address)
console.log('测试网WPOP:', popchainTokens.wpop.address)  
console.log('测试网USDT:', USDT[ChainId.POPCHAIN_TESTNET].address)
```

#### Step 3: 测试价格获取
```typescript
// 使用浏览器控制台测试
const wpopUsdtPrice = usePriceByPairs(usdt, wpop)
console.log('WPOP价格:', wpopUsdtPrice?.toSignificant(6))
```

## 🚨 可能的问题和解决方案

### 问题1: 交易对不存在
**症状：** 价格显示为0或undefined
**解决方案：**
1. 确认WPOP/USDT交易对已在DEX上创建
2. 检查Factory合约是否正确部署
3. 验证代币地址是否正确

### 问题2: 流动性不足
**症状：** 价格波动很大或不准确
**解决方案：**
1. 增加WPOP/USDT交易对的流动性
2. 考虑使用多个交易对的加权平均价格
3. 设置最小流动性阈值

### 问题3: 网络配置错误
**症状：** 在错误的网络上显示价格
**解决方案：**
1. 确认ChainId配置正确
2. 检查代币地址是否匹配对应网络
3. 验证RPC节点连接正常

## 🔧 调试步骤

### 1. 检查网络连接
```typescript
// 确认当前连接的网络
const { chainId } = useActiveChainId()
console.log('当前网络:', chainId)
console.log('是否为PopChain主网:', chainId === ChainId.POPCHAIN)
console.log('是否为PopChain测试网:', chainId === ChainId.POPCHAIN_TESTNET)
```

### 2. 验证代币配置
```typescript
// 检查代币是否正确配置
console.log('WPOP代币:', wpop)
console.log('USDT代币:', usdt)
console.log('代币地址匹配:', wpop?.address, usdt?.address)
```

### 3. 测试交易对查询
```typescript
// 检查交易对是否存在
const wpopUsdtPrice = usePriceByPairs(usdt, wpop)
console.log('交易对价格:', wpopUsdtPrice)
console.log('价格字符串:', wpopUsdtPrice?.toSignificant(6))
```

### 4. 检查合约调用
```typescript
// 查看网络请求
// 打开浏览器开发者工具 -> Network选项卡
// 查找对交易对合约的getReserves调用
// 验证返回的储备金数据
```

## 📊 与CAKE价格系统的对比

| 项目 | CAKE价格 | POP价格 |
|------|----------|---------|
| **基础代币** | CAKE | WPOP |
| **稳定币** | BUSD | USDT |
| **交易对** | BUSD/CAKE | USDT/WPOP |
| **网络** | BSC主网/测试网 | PopChain主网/测试网 |
| **价格获取** | usePriceByPairs | usePriceByPairs |
| **显示组件** | CakePrice | PopPrice |

## 🎯 最佳实践建议

### 1. 流动性管理
- 确保WPOP/USDT交易对有足够的流动性
- 定期监控价格准确性
- 考虑设置价格异常告警

### 2. 多交易对支持
```typescript
// 可以扩展支持多个交易对
const alternativePairs = [
  [USDT[chainId], WPOP],      // 主要交易对
  [USDC[chainId], WPOP],      // 备用交易对1
  [WETH[chainId], WPOP],      // 备用交易对2
]
```

### 3. 缓存和性能
- 使用SWR的缓存机制
- 设置合适的刷新间隔
- 避免过度频繁的价格查询

### 4. 错误处理
- 处理网络连接失败
- 处理交易对不存在的情况
- 提供合理的默认值或错误提示

---

## 总结

要获取正确的POP价格，您需要确保：

1. ✅ **WPOP/USDT交易对已创建** - 在PopChain DEX上
2. ✅ **有足够的流动性** - 确保价格计算准确
3. ✅ **代币地址正确** - 主网和测试网地址已配置
4. ✅ **合约功能正常** - getReserves()方法可以调用
5. ✅ **网络连接稳定** - RPC节点响应正常

修复后的系统会自动从WPOP/USDT交易对获取实时价格，就像CAKE价格系统一样工作。
