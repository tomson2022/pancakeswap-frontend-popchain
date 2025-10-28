# 移除流动性预授权核心代码

本文档展示移除流动性时使用 EIP-712 Permit 签名的核心代码实现。

## 核心文件位置
- `/apps/web/src/views/RemoveLiquidity/index.tsx`

---

## 1. 预授权处理函数 - 生成 EIP-712 Permit 签名

```typescript
// 第 159-239 行
async function onAttemptToApprove() {
  if (!pairContract || !pairContractRead || !pair || !library || !deadline) 
    throw new Error('missing dependencies')
  
  const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
  if (!liquidityAmount) {
    toastError(t('Error'), t('Missing liquidity amount'))
    throw new Error('missing liquidity amount')
  }

  // 检查合约是否支持 permit，通过调用 nonces 来判断
  // 如果 nonces 调用失败，合约不支持 permit，回退到 approve
  let nonce
  let tokenName
  try {
    nonce = await pairContractRead.nonces(account)
    // 从合约动态获取 token 名称，用于 EIP-712 domain
    tokenName = await pairContractRead.name()
  } catch (nonceError) {
    // 合约不支持 permit，使用标准 approve
    approveCallback()
    return
  }

  // 定义 EIP-712 域结构
  const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ]
  
  // 构建 EIP-712 域数据（使用从合约读取的实际 token 名称）
  const domain = {
    name: tokenName,
    version: '1',
    chainId,
    verifyingContract: pair.liquidityToken.address,
  }
  
  // 定义 Permit 消息结构
  const Permit = [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ]
  
  // 构建 Permit 消息
  const message = {
    owner: account,
    spender: ROUTER_ADDRESS[chainId],
    value: liquidityAmount.quotient.toString(),
    nonce: nonce.toHexString(),
    deadline: deadline.toNumber(),
  }
  
  // 构建完整的 EIP-712 签名数据
  const data = JSON.stringify({
    types: {
      EIP712Domain,
      Permit,
    },
    domain,
    primaryType: 'Permit',
    message,
  })

  // 请求用户签名
  library
    .send('eth_signTypedData_v4', [account, data])
    .then(splitSignature)
    .then((signature) => {
      // 保存签名数据，用于后续的 permit 调用
      setSignatureData({
        v: signature.v,
        r: signature.r,
        s: signature.s,
        deadline: deadline.toNumber(),
      })
    })
    .catch((err) => {
      // 对于所有非 4001 错误（用户拒绝请求），回退到手动 approve
      if (err?.code !== 4001) {
        approveCallback()
      }
    })
}
```

---

## 2. 移除流动性时的授权检查

```typescript
// 第 344-355 行
async function onRemove() {
  if (!chainId || !account || !deadline || !routerContract) 
    throw new Error('missing dependencies')
  
  // 首先检查授权状态 - 这是防止未授权交易的关键
  if (approval !== ApprovalState.APPROVED && signatureData === null) {
    if (approval === ApprovalState.UNKNOWN) {
      toastError(t('Error'), t('Please enable liquidity removal first'))
    } else {
      toastError(t('Error'), t('Please approve liquidity removal first'))
    }
    throw new Error('Attempting to remove liquidity without approval or signature')
  }
  
  // ... 其他验证逻辑
}
```

---

## 3. 使用 Permit 签名移除流动性

```typescript
// 第 424-467 行
// 我们有签名，使用 permit 版本的移除流动性
else if (signatureData !== null) {
  // removeLiquidityETHWithPermit - 移除流动性并接收 ETH
  if (oneCurrencyIsNative) {
    // PopChain 使用标准 Uniswap Router，不支持 SupportingFeeOnTransferTokens 函数
    if (isPopChain) {
      methodNames = ['removeLiquidityETHWithPermit']
    } else {
      methodNames = [
        'removeLiquidityETHWithPermit', 
        'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'
      ]
    }
    args = [
      currencyBIsNative ? tokenA.address : tokenB.address,
      liquidityAmount.quotient.toString(),
      amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
      amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
      account,
      signatureData.deadline,
      false,  // approveMax
      signatureData.v,  // v
      signatureData.r,  // r
      signatureData.s,  // s
    ]
  }
  // removeLiquidityWithPermit - 移除流动性接收两个代币
  else {
    methodNames = ['removeLiquidityWithPermit']
    args = [
      tokenA.address,
      tokenB.address,
      liquidityAmount.quotient.toString(),
      amountsMin[Field.CURRENCY_A].toString(),
      amountsMin[Field.CURRENCY_B].toString(),
      account,
      signatureData.deadline,
      false,  // approveMax
      signatureData.v,  // v
      signatureData.r,  // r
      signatureData.s,  // s
    ]
      }
    } else {
  toastError(t('Error'), t('Attempting to confirm without approval or a signature'))
  throw new Error('Attempting to confirm without approval or a signature')
}
```

---

## 4. 状态管理

```typescript
// 第 153 行
const [signatureData, setSignatureData] = useState<{
  v: number; 
  r: string; 
  s: string; 
  deadline: number
} | null>(null)

// 第 242-248 行 - 清除签名数据
const onUserInput = useCallback(
  (field: Field, value: string) => {
    setSignatureData(null)  // 清除签名数据，避免使用过期的签名
    return _onUserInput(field, value)
  },
  [_onUserInput],
)
```

---

## 5. 确认模态框中的授权检查

```typescript
// ConfirmRemoveLiquidityModal.tsx 第 138 行
<Button
  width="100%"
  mt="20px"
  disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
  onClick={onRemove}
>
  {t('Confirm')}
</Button>
```

---

## 核心流程总结

1. **检查支持性**: 首先检查链是否支持 permit（如 PopChain 不支持）
2. **获取 nonce 和 token 名称**: 调用合约的 `nonces()` 和 `name()` 方法获取当前 nonce 和实际 token 名称
3. **构建 EIP-712 数据**: 使用从合约读取的实际 token 名称构建包含 domain、类型定义和消息的完整数据结构
4. **请求签名**: 使用 `eth_signTypedData_v4` 请求用户签名
5. **保存签名**: 将签名的 `v`, `r`, `s` 和 `deadline` 保存到状态中
6. **移除流动性**: 使用签名调用 `removeLiquidityWithPermit` 或 `removeLiquidityETHWithPermit`
7. **授权检查**: 在执行移除操作前，确保有有效的授权（approve 或 permit 签名）

---

## 关键点

- **EIP-712 标准**: 使用 EIP-712 结构化数据签名，提供更好的用户体验
- **动态获取 token 名称**: 从合约动态读取 token 名称（如 "LP Token"），而不是硬编码，确保 EIP-712 domain 名称与合约一致
- **降级处理**: 如果 permit 不支持或失败，自动回退到传统的 `approve` 方式
- **安全性**: 在执行移除流动性前，严格检查授权状态
- **PopChain 支持**: PopChain 现在也支持 permit 功能。如果 Router 合约不支持 permit 方法，代码会自动降级到 approve

## 重要修复

**问题**: 之前代码硬编码了 "Pancake LPs"，但实际合约中的名称可能是 "LP Token" 或其他名称，导致 EIP-712 签名验证失败。

**解决方案**: 在构建 EIP-712 domain 时，从合约动态读取实际的 token 名称：
```typescript
tokenName = await pairContractRead.name()
```

这确保了 domain name 与合约中的实际名称完全匹配，签名验证才能成功。

## 功能恢复

**之前**: 由于签名验证失败，PopChain 被硬编码为跳过 permit 功能，直接使用 approve。

**现在**: 修复了 EIP-712 domain name 问题后，PopChain 现在也可以使用 permit 功能了。代码会自动检测合约是否支持 permit（通过调用 `nonces()` 方法），如果支持就使用 permit，如果不支持或失败就自动降级到 approve。

**关键改进**:
- ✅ 移除了 PopChain 的特殊跳过逻辑
- ✅ 所有链（包括 PopChain）现在都会尝试 permit
- ✅ 如果 Router 不支持 permit，自动降级到 approve（通过 try-catch 和 gas estimation 失败处理）
- ✅ PopChain 在使用 permit 时，对于包含原生币的交易对，只使用 `removeLiquidityETHWithPermit`（不支持 SupportingFeeOnTransferTokens 版本）

