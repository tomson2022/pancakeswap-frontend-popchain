import { ChainId, ERC20Token } from '@pancakeswap/sdk'

export const popchainTokens = {
  wpop: new ERC20Token(
    ChainId.POPCHAIN_TESTNET,
    '0x897FE3AFf41Dc5174504361926576ed2e5173F8D',
    18,
    'WPOP',
    'Wrapped POP',
    'https://popchain.org'
  ),
  usdt: new ERC20Token(
    ChainId.POPCHAIN_TESTNET,
    '0x7faD4D267eD3820152afe42A99a2b95797504fA7',
    6,
    'USDT',
    'Tether USD',
    'https://tether.to'
  ),
}
