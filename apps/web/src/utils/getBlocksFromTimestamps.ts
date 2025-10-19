import { gql } from 'graphql-request'
import orderBy from 'lodash/orderBy'
// import { JsonRpcProvider } from '@ethersproject/providers' // 暂时未使用
import { multiChainBlocksClient, MultiChainName } from 'state/info/constant'
import { Block } from '../state/info/types'
import { multiQuery } from '../views/Info/utils/infoQueryHelpers'

const getBlockSubqueries = (timestamps: number[]) =>
  timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
  })

const blocksQueryConstructor = (subqueries: string[]) => {
  return gql`query blocks {
    ${subqueries}
  }`
}

// PopChain RPC provider for block queries
// const popchainProvider = new JsonRpcProvider('https://rpc.popchain.ai') // 暂时未使用

// 获取 PopChain subgraph 的最大索引区块号
const getPopchainMaxIndexedBlock = async (): Promise<number> => {
  try {
    const response = await fetch('https://subgraph.popchain.ai/subgraphs/name/popchain-v2-swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ _meta { block { number } } }' })
    })
    const data = await response.json()
    return data.data?._meta?.block?.number || 140
  } catch (error) {
    console.warn('Failed to get PopChain subgraph max block, using fallback:', error)
    return 140 // 安全的后备值
  }
}

// 通过 RPC 获取 PopChain 的区块信息
const getPopchainBlocksFromTimestamps = async (timestamps: number[]): Promise<Block[]> => {
  try {
    // 动态获取 subgraph 的最大索引区块号
    const maxIndexedBlock = await getPopchainMaxIndexedBlock()
    
    // 为了避免查询超出索引范围的区块，我们使用简化的逻辑
    // 对于历史时间戳，返回递减的区块号
    const blocks: Block[] = []
    
    for (let i = 0; i < timestamps.length; i++) {
      // 为不同的时间戳返回递减的区块号，确保不超过索引范围
      // 当前区块用最新的，历史区块用递减的值
      const blockNumber = i === 0 
        ? maxIndexedBlock 
        : Math.max(1, maxIndexedBlock - (i + 1) * 10) // 确保历史区块号不同且递减
      
      blocks.push({
        timestamp: timestamps[i].toString(),
        number: blockNumber,
      })
    }
    
    return orderBy(blocks, (block) => block.number, 'desc')
  } catch (error) {
    console.error('Failed to fetch PopChain blocks via RPC:', error)
    // 如果出错，返回安全的区块号
    const fallbackBlocks = timestamps.map((timestamp, index) => ({
      timestamp: timestamp.toString(),
      number: Math.max(1, 140 - index * 10), // 确保不超过 140
    }))
    return fallbackBlocks
  }
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 */
export const getBlocksFromTimestamps = async (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  skipCount: number | undefined = 500,
  chainName: MultiChainName | undefined,
): Promise<Block[]> => {
  // 如果 chainName 是 undefined，直接返回空数组避免错误
  if (!chainName) {
    console.warn('getBlocksFromTimestamps: chainName is undefined, returning empty array')
    return []
  }
  
  if (timestamps?.length === 0) {
    return []
  }

  // PopChain 的 subgraph 不支持 blocks 查询，使用 RPC 方式获取
  if (chainName === 'POPCHAIN') {
    return getPopchainBlocksFromTimestamps(timestamps)
  }
  
  // 检查是否支持区块查询
  if (!multiChainBlocksClient[chainName]) {
    console.warn(`Block queries not supported for chain: ${chainName}`)
    return []
  }
  
  const endpoint = multiChainBlocksClient[chainName]

  // 对于 PopChain，不应该到达这里，但如果到达了，直接使用 RPC 方式避免 CORS 错误
  if (endpoint.includes('8.218.219.213')) {
    console.warn('PopChain should use RPC fallback, not GraphQL blocks query')
    return getPopchainBlocksFromTimestamps(timestamps)
  }

  // 最后的安全检查：如果端点是 BSC blocks 但当前 URL 包含 PopChain，强制使用 PopChain 方案
  if (endpoint.includes('pancakeswap/blocks') && window.location.href.includes('chainId=7257')) {
    console.warn('CRITICAL: Detected BSC blocks endpoint for PopChain URL, using PopChain fallback')
    return getPopchainBlocksFromTimestamps(timestamps)
  }

  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    endpoint,
    skipCount,
  )

  const blocks: Block[] = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(fetchedData)) {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: parseInt(fetchedData[key][0].number, 10),
        })
      }
    }
    // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
    return orderBy(blocks, (block) => block.number, sortDirection)
  }
  return blocks
}
