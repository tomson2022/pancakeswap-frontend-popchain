import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Skeleton } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'

export interface Props {
  color?: string
  popPriceUsd?: number
  showSkeleton?: boolean
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`

const PopLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: bold;
  font-size: 12px;
  color: white;
`

const PopPrice: React.FC<React.PropsWithChildren<Props>> = ({
  popPriceUsd,
  color = 'textSubtle',
  showSkeleton = true,
}) => {
  const { chainId } = useActiveChainId()
  
  // 根据当前网络选择正确的 WPOP 地址
  const wpopAddress = useMemo(() => {
    if (chainId === ChainId.POPCHAIN) {
      return '0x11c44AED3d69152486D92B3161696FcF38F84dB8' // 主网 WPOP 地址
    }
    if (chainId === ChainId.POPCHAIN_TESTNET) {
      return '0x897FE3AFf41Dc5174504361926576ed2e5173F8D' // 测试网 WPOP 地址
    }
    return ''
  }, [chainId])
  
  // 只在 PopChain 上显示 POP 价格
  if (chainId !== ChainId.POPCHAIN && chainId !== ChainId.POPCHAIN_TESTNET) {
    return null
  }

  return popPriceUsd && popPriceUsd > 0 ? (
    <PriceLink
      href={`/swap?outputCurrency=${wpopAddress}`}
      target="_blank"
    >
      <PopLogo>P</PopLogo>
      <Text color={color} bold>{`$${popPriceUsd.toFixed(4)}`}</Text>
    </PriceLink>
  ) : showSkeleton ? (
    <Skeleton width={80} height={24} />
  ) : null
}

export default React.memo(PopPrice)
