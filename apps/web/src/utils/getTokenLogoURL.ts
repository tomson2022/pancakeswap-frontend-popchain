import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
}

// POPCHAIN 本地图片映射 - 按合约地址
const popchainLocalTokens: { [address: string]: string } = {
  // POPCHAIN 主网 (7257)
  '0x11c44AED3d69152486D92B3161696FcF38F84dB8': 'wpop', // WPOP
  '0xC6003142FD16Ad0b0A33B840173867CcDc2F4EC3': 'usdt', // USDT
  '0x5A108a944712A06E940cfe9590427190552d3957': 'luma', // LUMA
  // POPCHAIN 测试网 (16042)
  '0xd04c65bF21ef6609663Cc2B1B9F5E4c1bd22C428': 'wpop', // WPOP
  '0x7faD4D267eD3820152afe42A99a2b95797504fA7': 'usdt', // USDT
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (!token) return null
    
    // 对于 POPCHAIN 和 POPCHAIN_TESTNET，使用本地图片
    if (token.chainId === ChainId.POPCHAIN || token.chainId === ChainId.POPCHAIN_TESTNET) {
      const checksumAddress = getAddress(token.address)
      const symbolName = popchainLocalTokens[checksumAddress]
      if (symbolName) {
        return `/images/tokens/${symbolName}.png`
      }
      // 如果没有映射，尝试使用合约地址
      return `/images/tokens/${checksumAddress}.png`
    }
    
    // 对于其他链，使用 TrustWallet CDN
    if (mapping[token.chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[token.chainId]}/assets/${getAddress(
        token.address,
      )}/logo.png`
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

export default getTokenLogoURL
