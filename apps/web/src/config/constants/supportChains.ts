import { ChainId } from '@pancakeswap/sdk'

// BSC 支持已移除，现在默认支持 PopChain 主网和测试网
export const SUPPORT_ONLY_POPCHAIN = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET] // PopChain 主网和测试网
export const SUPPORT_FARMS = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET]
export const SUPPORT_ZAP = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET]
