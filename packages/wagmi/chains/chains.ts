import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

export const avalandche: Chain = {
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://snowtrace.io/',
    },
  },
}

export const avalandcheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche_fuji',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://testnet.snowtrace.io/',
    },
  },
  testnet: true,
}

export const fantomOpera: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
}

export const fantomTestnet: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom-testnet',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.testnet.fantom.network',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
  },
  testnet: true,
}

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  rpcUrls: {
    public: 'https://bsc-dataseed1.binance.org',
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 15921452,
  },
}

export const bscTest: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-1-s3.binance.org:8545',
    default: 'https://data-seed-prebsc-1-s3.binance.org:8545',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 17422483,
  },
  testnet: true,
}

export const popchain: Chain = {
  id: 725700,
  name: 'PopChain Testnet',
  network: 'popchain-testnet',
  rpcUrls: {
    default: 'https://testnet.popchain.ai',
    public: 'https://testnet.popchain.ai',
  },
  nativeCurrency: {
    name: 'PopChain Token',
    symbol: 'POP',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'PopScan Testnet',
      url: 'https://testnetpop.cloud.blockscout.com',
    },
  },
  multicall: {
    address: '0x502A413621c82AB03AB4Db38A95f5d5E7AeF43E9',
    blockCreated: 1,
  },
  testnet: true,
}

export const popchainMainnet: Chain = {
  id: 7257,
  name: 'PopChain',
  network: 'popchain',
  rpcUrls: {
    default: 'https://rpc.popchain.ai',
    public: 'https://rpc.popchain.ai',
  },
  nativeCurrency: {
    name: 'PopChain Token',
    symbol: 'POP',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'PopScan',
      url: 'https://scan.popchain.ai',
    },
  },
  multicall: {
    address: '0xa1a1D2Ab028A84DBDdB614B5ec9c1A1905538ACe', // PopChain 主网 Multicall2
    blockCreated: 1,
  },
}

export { rinkeby, mainnet, goerli }
