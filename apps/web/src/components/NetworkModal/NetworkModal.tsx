import { ModalV2 } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CHAIN_IDS } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'
import { atom, useAtom } from 'jotai'
import { SUPPORT_ONLY_POPCHAIN } from 'config/constants/supportChains'
import { UnsupportedNetworkModal } from './UnsupportedNetworkModal'
import { WrongNetworkModal } from './WrongNetworkModal'
import { PageNetworkSupportModal } from './PageNetworkSupportModal'

export const hideWrongNetworkModalAtom = atom(false)

export const NetworkModal = ({ pageSupportedChains = SUPPORT_ONLY_POPCHAIN }: { pageSupportedChains?: number[] }) => {
  const { chainId, chain, isWrongNetwork } = useActiveWeb3React()
  const { chains } = useNetwork()
  const [dismissWrongNetwork, setDismissWrongNetwork] = useAtom(hideWrongNetworkModalAtom)

  const isPopChainOnlyPage = useMemo(() => {
    // 检查页面是否只支持 PopChain（主网和/或测试网）
    const popChainIds = [ChainId.POPCHAIN, ChainId.POPCHAIN_TESTNET]
    return pageSupportedChains?.every(id => popChainIds.includes(id))
  }, [pageSupportedChains])

  const isPageNotSupported = useMemo(
    () => Boolean(chainId) && Boolean(pageSupportedChains.length) && !pageSupportedChains.includes(chainId),
    [chainId, pageSupportedChains],
  )

  // 只有当钱包连接的链不在页面支持列表中时才显示 WrongNetworkModal
  // 如果钱包连接的是 PopChain 主网或测试网（都在支持列表中），就不显示错误
  // 注意：这个 useMemo 必须在所有条件性 return 之前调用，以遵循 React Hooks 规则
  const shouldShowWrongNetworkModal = useMemo(() => {
    if (!isWrongNetwork || dismissWrongNetwork || !chain) return false
    // 如果钱包连接的链在支持列表中，不显示错误
    if (pageSupportedChains.includes(chain.id)) return false
    return true
  }, [isWrongNetwork, dismissWrongNetwork, chain, pageSupportedChains])

  const currentChain = useMemo(() => chains.find((c) => c.id === chainId), [chains, chainId])

  if (isPageNotSupported && isPopChainOnlyPage) {
    return (
      <ModalV2 isOpen closeOnOverlayClick={false}>
        <PageNetworkSupportModal />
      </ModalV2>
    )
  }

  if ((chain?.unsupported ?? false) || isPageNotSupported) {
    return (
      <ModalV2 isOpen closeOnOverlayClick={false}>
        <UnsupportedNetworkModal pageSupportedChains={pageSupportedChains?.length ? pageSupportedChains : CHAIN_IDS} />
      </ModalV2>
    )
  }

  if (shouldShowWrongNetworkModal && currentChain) {
    return (
      <ModalV2 isOpen closeOnOverlayClick onDismiss={() => setDismissWrongNetwork(true)}>
        <WrongNetworkModal currentChain={currentChain} onDismiss={() => setDismissWrongNetwork(true)} />
      </ModalV2>
    )
  }

  return null
}
