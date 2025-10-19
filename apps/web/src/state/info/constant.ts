import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, INFO_CLIENT, INFO_CLIENT_ETH, INFO_CLIENT_POPCHAIN, GRAPH_API_POPCHAIN } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient, infoClientPOPCHAIN } from 'utils/graphql'

import { ChainId } from '@pancakeswap/sdk'
import { ETH_TOKEN_BLACKLIST, PCS_ETH_START, PCS_V2_START, PCS_POPCHAIN_START, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'BSC' | 'ETH' | 'POPCHAIN'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
  POPCHAIN: 'POP',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  POPCHAIN: GRAPH_API_POPCHAIN,
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  ETH: PCS_ETH_START,
  POPCHAIN: PCS_POPCHAIN_START,
}

export const multiChainId = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
  POPCHAIN: ChainId.POPCHAIN,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '/eth',
  [ChainId.POPCHAIN]: '/popchain',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
  POPCHAIN: infoClientPOPCHAIN,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
  POPCHAIN: INFO_CLIENT_POPCHAIN,
}

export const multiChainScan = {
  BSC: 'BscScan',
  ETH: 'EtherScan',
  POPCHAIN: 'PopScan',
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
  POPCHAIN: [], // PopChain 暂时没有黑名单代币
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
