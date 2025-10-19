import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { popchainTokens, popchainMainnetTokens, USDT } from '@pancakeswap/tokens'
import { usePriceByPairs } from './useBUSDPrice'

/**
 * Returns POP price in USD by querying WPOP/USDT trading pair
 */
export const usePopBusdPrice = ({ forceMainnet: _forceMainnet = false } = {}): number => {
  const { chainId } = useActiveChainId()
  
  // 根据网络选择对应的代币
  const wpop: ERC20Token | undefined = useMemo(() => {
    if (chainId === ChainId.POPCHAIN) {
      return popchainMainnetTokens.wpop
    }
    if (chainId === ChainId.POPCHAIN_TESTNET) {
      return popchainTokens.wpop
    }
    return undefined
  }, [chainId])

  const usdt: ERC20Token | undefined = useMemo(() => {
    if (chainId === ChainId.POPCHAIN || chainId === ChainId.POPCHAIN_TESTNET) {
      return USDT[chainId]
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

export default usePopBusdPrice
