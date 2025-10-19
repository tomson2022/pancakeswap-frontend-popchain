import { ChainId } from '@pancakeswap/sdk'

// BSC 支持已移除，现在默认支持 PopChain
export const SUPPORT_ONLY_POPCHAIN = [ChainId.POPCHAIN] // PopChain 主网作为主要支持链
export const SUPPORT_FARMS = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET]
export const SUPPORT_ZAP = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET]
