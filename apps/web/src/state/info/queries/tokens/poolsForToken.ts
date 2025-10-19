import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { MultiChainName, multiChainQueryMainToken, getMultiChainQueryEndPointWithStableSwap } from '../../constant'

/**
 * Data for showing Pools table on the Token page
 */
const POOLS_FOR_TOKEN = (chainName: MultiChainName) => {
  const transactionGT = chainName === 'ETH' ? 1 : 100
  
  // PopChain 使用 Uniswap V2 schema，不支持 trackedReservePOP，使用 reserveUSD
  const orderByField = chainName === 'POPCHAIN' ? 'reserveUSD' : `trackedReserve${multiChainQueryMainToken[chainName]}`
  
  // PopChain 不支持 totalTransactions 字段，移除该过滤条件
  const whereCondition = chainName === 'POPCHAIN' 
    ? (token: string, blacklist: string) => `{ ${token}: $address, ${blacklist}_not_in: $blacklist }`
    : (token: string, blacklist: string) => `{ totalTransactions_gt: ${transactionGT}, ${token}: $address, ${blacklist}_not_in: $blacklist }`
  
  return gql`
  query poolsForToken($address: String!, $blacklist: [String!]) {
    asToken0: pairs(
      first: 15
      orderBy: ${orderByField}
      orderDirection: desc
      where: ${whereCondition('token0', 'token1')}
    ) {
      id
    }
    asToken1: pairs(
      first: 15
      orderBy: ${orderByField}
      orderDirection: desc
      where: ${whereCondition('token1', 'token0')}
    ) {
      id
    }
  }
`
}

export interface PoolsForTokenResponse {
  asToken0: {
    id: string
  }[]
  asToken1: {
    id: string
  }[]
}

const fetchPoolsForToken = async (
  chainName: MultiChainName,
  address: string,
): Promise<{
  error: boolean
  addresses?: string[]
}> => {
  try {
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<PoolsForTokenResponse>(
      POOLS_FOR_TOKEN(chainName),
      {
        address,
        blacklist: TOKEN_BLACKLIST,
      },
    )
    return {
      error: false,
      addresses: data.asToken0
        .concat(data.asToken1)
        .map((p) => p.id)
        .map((d) => d.toLowerCase()),
    }
  } catch (error) {
    console.error(`Failed to fetch pools for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchPoolsForToken
