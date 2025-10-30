# PopChain 测试网配置更新记录

**更新时间**: 2025年10月30日  
**Commit**: 561b6df  
**版本**: v1.1.0

## 📋 更新概述

本次更新完成了 PopChain 测试网（Chain ID: 16042）的完整配置升级，包括网络基础设施、智能合约地址、代币配置等核心组件的更新。

## 🔧 更新内容

### 1. 网络基础设施更新

| 配置项 | 旧值 | 新值 |
|--------|------|------|
| **RPC 节点** | `https://testnet-node.popchain.ai` | `https://testnet.popchain.ai` |
| **区块浏览器** | `https://scan.popchain.org` | `https://testnetpop.cloud.blockscout.com` |
| **浏览器名称** | `PopScan` | `PopScan Testnet` |

### 2. 智能合约地址更新

| 合约类型 | 旧地址 | 新地址 |
|---------|--------|--------|
| **Multicall2** | `0x264fe686c002520E5c7E8018026C3BcdBf435a26` | `0x502A413621c82AB03AB4Db38A95f5d5E7AeF43E9` |
| **Factory** | `0x4640fce18e1C7A7c105416b50d225F29a3b5797b` | `0x4377421f58B824C9D56CE773d8dde111590db87b` |
| **Router** | `0xd793684055626bdfD1129BF781a2244Bb80956C2` | `0xC138203E3a729342C866c54Bb70A0E852896eE44` |

### 3. 代币配置更新

| 代币 | 符号 | 旧地址 | 新地址 |
|------|------|--------|--------|
| **Wrapped POP** | WPOP | `0x897FE3AFf41Dc5174504361926576ed2e5173F8D` | `0xd04c65bF21ef6609663Cc2B1B9F5E4c1bd22C428` |
| **Tether USD** | USDT | `0x7faD4D267eD3820152afe42A99a2b95797504fA7` | `0x7faD4D267eD3820152afe42A99a2b95797504fA7` ✅ 未变 |

### 4. 保持不变的配置

以下配置保持与主网相同：

- **Init Code Hash**: `0xefee83905acdae3ba6183cb5c058311536b86ef082ec213a50270f068af21b61`
- **Subgraph 端点**: `https://subgraph.popchain.ai/subgraphs/name/popchain-v2-swap`
- **Chain ID**: `16042`
- **原生代币**: `POP` (18 decimals)

## 📁 修改的文件

### 核心配置文件 (10个)

1. **`packages/wagmi/chains/chains.ts`**
   - 更新链配置：RPC URL、区块浏览器、Multicall2 地址
   - 影响：网络连接和钱包交互

2. **`packages/swap-sdk/src/constants.ts`**
   - 更新 Factory 合约地址
   - 更新 WPOP 代币地址
   - 影响：交易对创建和路由计算

3. **`packages/tokens/src/16042.ts`**
   - 更新测试网代币列表中的 WPOP 地址
   - 影响：代币导入和显示

4. **`packages/multicall/index.ts`**
   - 更新 Multicall2 合约地址映射
   - 影响：批量合约调用功能

5. **`apps/web/src/config/constants/exchange.ts`**
   - 更新 Router 合约地址
   - 影响：交易路由和流动性操作

6. **`packages/smart-router/evm/constants/exchange.ts`**
   - 更新 Router 和 STABLE_SWAP_INFO_ADDRESS
   - 影响：智能路由算法

7. **`apps/web/src/config/constants/tokenLists/popchain-default.tokenlist.json`**
   - 更新测试网 WPOP 代币条目
   - 影响：默认代币列表显示

8. **`apps/web/src/config/constants/tokenLists/pancake-default.tokenlist.json`**
   - 更新测试网 WPOP 代币条目
   - 影响：PancakeSwap 兼容代币列表

9. **`apps/web/src/utils/getTokenLogoURL.ts`**
   - 更新代币 Logo 地址映射
   - 影响：代币图标显示

10. **`apps/web/src/components/PopPrice/PopPrice.tsx`**
    - 更新 PopPrice 组件中的 WPOP 地址
    - 影响：POP 价格显示功能

## 📊 统计数据

```
总文件数: 10
总修改行数: 32 (16 insertions, 16 deletions)
影响模块: 网络层、合约层、代币层、UI层
```

## 🔍 技术细节

### 地址校验和格式

所有合约地址均使用 EIP-55 校验和格式：
- Multicall2: `0x502A413621c82AB03AB4Db38A95f5d5E7AeF43E9`
- Factory: `0x4377421f58B824C9D56CE773d8dde111590db87b`
- Router: `0xC138203E3a729342C866c54Bb70A0E852896eE44`
- WPOP: `0xd04c65bF21ef6609663Cc2B1B9F5E4c1bd22C428`

### 兼容性说明

1. **向后兼容**: 主网配置（Chain ID: 7257）保持不变
2. **跨链兼容**: 支持主网和测试网之间的切换
3. **代码兼容**: 所有更改均在配置层面，无需修改业务逻辑

### 验证结果

✅ **语法检查**: 所有文件通过 TypeScript/ESLint 检查  
✅ **地址一致性**: 所有文件中的地址保持统一  
✅ **配置完整性**: 所有必需的配置项均已更新  
✅ **测试网标识**: `testnet: true` 标记正确设置

## 🚀 部署建议

### 开发环境测试

```bash
# 1. 清理依赖缓存
rm -rf node_modules/.cache

# 2. 重新安装依赖（如需要）
npm install
# or
yarn install

# 3. 重新构建
npm run build
# or
yarn build

# 4. 启动开发服务器
npm run dev
# or
yarn dev

# 5. 测试测试网访问
# 访问 http://localhost:3000/?chainId=16042
```

### 生产环境部署

```bash
# 1. 构建生产版本
npm run build:production
# or
yarn build:production

# 2. 部署到服务器
# 使用你的部署脚本或 CI/CD 流程
```

### 功能测试清单

- [ ] 测试网钱包连接
- [ ] 测试网 RPC 节点连接
- [ ] WPOP 代币显示和交易
- [ ] 区块浏览器链接跳转
- [ ] Multicall 批量查询功能
- [ ] Router 交易功能
- [ ] 流动性添加/移除
- [ ] POP 价格显示

## 🔗 相关链接

- **测试网 RPC**: https://testnet.popchain.ai
- **测试网浏览器**: https://testnetpop.cloud.blockscout.com
- **主网浏览器**: https://scan.popchain.ai
- **Subgraph**: https://subgraph.popchain.ai/subgraphs/name/popchain-v2-swap

## 📝 注意事项

1. **数据迁移**: 如果有用户已添加旧地址的 WPOP，需要提醒更新
2. **合约验证**: 确认所有新合约地址在区块浏览器上已验证
3. **功能测试**: 部署前在测试网进行完整的功能测试
4. **用户通知**: 建议在前端显示更新公告
5. **文档更新**: 更新相关的技术文档和用户指南

## 🔄 回滚方案

如需回滚到旧配置，可以使用：

```bash
git revert 561b6df
```

旧配置地址记录在本文档的"更新内容"部分的"旧值"列中。

## 👥 更新负责人

- **配置更新**: AI Assistant
- **资料提供**: Project Team
- **审核批准**: 待定

## 📅 更新时间线

- **2025-10-30 22:04**: 完成配置更新并提交到 Git
- **2025-10-30 22:05**: 创建更新文档
- **待定**: 部署到测试环境
- **待定**: 部署到生产环境

---

## 🔄 后续更新

### 更新 2: 添加测试网到网络选择器 (2025-10-30 22:15)

**问题**: 网络选择器中没有显示 PopChain 测试网选项

**修改内容**:
- **文件**: `apps/web/src/components/NetworkSwitcher.tsx`
- **改动**: 修改链过滤逻辑，允许 PopChain 测试网在网络选择器中显示
- **代码变更**:
  ```typescript
  // 修改前
  .filter((chain) => !chain.testnet || chain.id === chainId)
  
  // 修改后
  .filter((chain) => !chain.testnet || chain.id === chainId || chain.id === ChainId.POPCHAIN_TESTNET)
  ```

**效果**: 用户现在可以在网络选择器中看到并切换到 PopChain 测试网

---

## ✅ 完成状态

- [x] 配置文件更新
- [x] Git 提交记录
- [x] 文档编写
- [x] 网络选择器更新
- [ ] 测试环境验证
- [ ] 生产环境部署
- [ ] 用户通知

---

**文档版本**: v1.1  
**最后更新**: 2025-10-30 22:15  
**维护者**: Development Team

