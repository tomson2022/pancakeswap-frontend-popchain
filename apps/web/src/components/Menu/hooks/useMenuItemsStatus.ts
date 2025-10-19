import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useChainCurrentBlock } from 'state/block/hooks'
// import { PotteryDepositStatus } from 'state/types' // 禁用 Pottery 功能
import { getStatus } from 'views/Ifos/hooks/helpers'
// import { usePotteryStatus } from './usePotteryStatus' // 禁用 Pottery 功能
import { useCompetitionStatus } from './useCompetitionStatus'
// import { useVotingStatus } from './useVotingStatus' // 禁用投票功能

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)
  const activeIfo = useActiveIfoWithBlocks()
  const competitionStatus = useCompetitionStatus()
  // const potteryStatus = usePotteryStatus() // 禁用 Pottery 功能
  // const votingStatus = useVotingStatus() // 禁用投票功能

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      // ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
      //   '/pottery': 'pot_open',
      // }), // 禁用 Pottery 状态
      // ...(votingStatus && {
      //   '/voting': 'vote_now',
      // }), // 禁用投票状态
    }
  }, [competitionStatus, ifoStatus]) // 移除 potteryStatus
}
