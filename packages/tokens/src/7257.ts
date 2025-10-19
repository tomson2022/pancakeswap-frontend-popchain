import { ChainId, ERC20Token } from '@pancakeswap/sdk'

export const popchainMainnetTokens = {
  wpop: new ERC20Token(
    ChainId.POPCHAIN,
    '0x11c44AED3d69152486D92B3161696FcF38F84dB8',
    18,
    'WPOP',
    'Wrapped POP',
    'https://popchain.ai'
  ),
  usdt: new ERC20Token(
    ChainId.POPCHAIN,
    '0xC6003142FD16Ad0b0A33B840173867CcDc2F4EC3',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to'
  ),
  luma: new ERC20Token(
    ChainId.POPCHAIN,
    '0x5A108a944712A06E940cfe9590427190552d3957',
    18,
    'LUMA',
    'Luma Protocol',
    'https://luma.fi'
  ),
}
