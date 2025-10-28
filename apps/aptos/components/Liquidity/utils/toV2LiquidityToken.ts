import { Pair, Coin } from '@pancakeswap/aptos-swap-sdk'

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export default function toV2LiquidityToken([tokenA, tokenB]: [Coin, Coin]): Coin {
  // Use Pair.getLiquidityToken to get consistent naming with Pair constructor
  // This generates names like "Pancake-${token0.symbol}-${token1.symbol}-LP"
  return Pair.getLiquidityToken(tokenA, tokenB)
}
