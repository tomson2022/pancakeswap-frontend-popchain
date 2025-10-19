// PopChain 专用版本 - 不使用 PancakeSwap 官方代币列表
// const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
// const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'
// const CMC = 'https://tokens.pancakeswap.finance/cmc.json'

// PopChain 代币列表（如果有的话，目前使用空列表）
// const POPCHAIN_TOKEN_LIST = '' // 暂时为空，避免获取不兼容的代币列表

// List of official tokens list
export const OFFICIAL_LISTS: string[] = [] // PopChain 版本暂时不使用外部代币列表

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  // POPCHAIN_TOKEN_LIST, // 当 PopChain 有官方代币列表时启用
  ...UNSUPPORTED_LIST_URLS,
  ...WARNING_LIST_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [] // PopChain 版本暂时不使用外部列表
