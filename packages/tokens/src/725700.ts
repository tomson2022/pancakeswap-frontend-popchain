import { ChainId, ERC20Token } from '@pancakeswap/sdk'

export const popchainTokens = {
  wpop: new ERC20Token(
    ChainId.POPCHAIN_TESTNET,
    '0xd04c65bF21ef6609663Cc2B1B9F5E4c1bd22C428',
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
