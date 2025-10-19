import { ChainId } from '@pancakeswap/sdk'
import { atom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { useDeferredValue } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useNetwork } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'

const queryChainIdAtom = atom(-1) // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  const c = params.get('chainId')
  if (isChainSupported(+c)) {
    set(+c)
  } else {
    set(0)
  }
}

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId()
  // useRouter is kind of slow, we only get this query chainId once
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { chain } = useNetwork()
  // 智能默认值：根据 URL 参数决定默认链，默认使用 PopChain 主网
  const getSmartDefaultChain = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlChainId = urlParams.get('chainId')
    if (urlChainId === '16042') {
      return ChainId.POPCHAIN_TESTNET
    }
    // 默认使用 PopChain 主网，包括没有 chainId 参数的情况
    return ChainId.POPCHAIN
  }
  
  const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? getSmartDefaultChain() : undefined)

  const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId)

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
    isNotMatched,
  }
}
