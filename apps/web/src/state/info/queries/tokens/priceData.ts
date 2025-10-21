import { getUnixTime } from 'date-fns'
import { gql } from 'graphql-request'
import orderBy from 'lodash/orderBy'

import { PriceChartEntry } from 'state/info/types'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import { MultiChainName, multiChainQueryEndPoint, multiChainQueryMainToken } from '../../constant'

const getPriceSubqueries = (chainName: MultiChainName, tokenAddress: string, blocks: any) =>
  blocks.map(
    (block: any) => {
      // PopChain 使用 Uniswap V2 schema，只有 derivedETH 字段，沒有 derivedPOP 和 popPrice
      if (chainName === 'POPCHAIN') {
        return `
          t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
            derivedETH
          }
          b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
            ethPrice
          }
        `
      }
      
      return `
        t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
          derived${multiChainQueryMainToken[chainName]}
        }
        b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
          ${multiChainQueryMainToken[chainName].toLowerCase()}Price
        }
      `
    }
  )

/**
 * Price data for token and bnb based on block number
 */
const priceQueryConstructor = (subqueries: string[]) => {
  return gql`
    query tokenPriceData {
      ${subqueries}
    }
  `
}

const fetchTokenPriceData = async (
  chainName: MultiChainName,
  address: string,
  interval: number,
  startTimestamp: number,
): Promise<{
  data?: PriceChartEntry[]
  error: boolean
}> => {
  // Construct timestamps to query against
  const endTimestamp = getUnixTime(new Date())
  const timestamps = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }
  try {
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks for timestamps', timestamps)
      return {
        error: false,
      }
    }

    const prices: any | undefined = await multiQuery(
      priceQueryConstructor,
      getPriceSubqueries(chainName, address, blocks),
      multiChainQueryEndPoint[chainName],
      200,
    )

    console.warn('fetchTokenPriceData', { chainName, prices })

    if (!prices) {
      console.error('Price data failed to load')
      return {
        error: false,
      }
    }

    // format token price results
    const tokenPrices: {
      timestamp: string
      derivedMainToken: number
      priceUSD: number
    }[] = []

    const mainToken = multiChainQueryMainToken[chainName]

    // Get Token prices in main token (BNB/ETH/POP)
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('t')[1]
      // if its main token price e.g. `b123` split('t')[1] will be undefined and skip main token price entry
      if (timestamp) {
        // PopChain 使用 derivedETH，其他鏈使用 derived${mainToken}
        const derivedField = chainName === 'POPCHAIN' ? 'derivedETH' : `derived${mainToken}`
        tokenPrices.push({
          timestamp,
          derivedMainToken: prices[priceKey]?.[derivedField]
            ? parseFloat(prices[priceKey][derivedField])
            : 0,
          priceUSD: 0,
        })
      }
    })

    console.warn('pricesPart1', tokenPrices)

    // Go through main token USD prices and calculate Token price based on it
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('b')[1]
      // if its Token price e.g. `t123` split('b')[1] will be undefined and skip Token price entry
      if (timestamp) {
        const tokenPriceIndex = tokenPrices.findIndex((tokenPrice) => tokenPrice.timestamp === timestamp)
        if (tokenPriceIndex >= 0) {
          const { derivedMainToken } = tokenPrices[tokenPriceIndex]
          // PopChain 使用 ethPrice，其他鏈使用 ${mainToken.toLowerCase()}Price
          const priceField = chainName === 'POPCHAIN' ? 'ethPrice' : `${mainToken.toLowerCase()}Price`
          tokenPrices[tokenPriceIndex].priceUSD =
            parseFloat(prices[priceKey]?.[priceField] ?? 0) * derivedMainToken
        }
      }
    })

    // graphql-request does not guarantee same ordering of batched requests subqueries, hence sorting by timestamp from oldest to newest
    const sortedTokenPrices = orderBy(tokenPrices, (tokenPrice) => parseInt(tokenPrice.timestamp, 10))

    const formattedHistory = []

    // for each timestamp, construct the open and close price
    for (let i = 0; i < sortedTokenPrices.length - 1; i++) {
      formattedHistory.push({
        time: parseFloat(sortedTokenPrices[i].timestamp),
        open: sortedTokenPrices[i].priceUSD,
        close: sortedTokenPrices[i + 1].priceUSD,
        high: sortedTokenPrices[i + 1].priceUSD,
        low: sortedTokenPrices[i].priceUSD,
      })
    }

    return { data: formattedHistory, error: false }
  } catch (error) {
    console.error(`Failed to fetch price data for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchTokenPriceData
