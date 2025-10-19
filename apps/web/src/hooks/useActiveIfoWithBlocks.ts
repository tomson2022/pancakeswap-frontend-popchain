import useSWRImmutable from 'swr/immutable'
import ifoV3Abi from '../config/abi/ifoV3.json'
import { multicallv2 } from '../utils/multicall'
import { ifosConfig } from '../config/constants'
import { Ifo } from '../config/constants/types'
import { useActiveChainId } from './useActiveChainId'

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

export const useActiveIfoWithBlocks = (): Ifo & { startBlock: number; endBlock: number } => {
  const { chainId } = useActiveChainId()
  
  // IFO 目前只在 BSC 网络上支持
  const isIfoSupportedChain = chainId === 56 // BSC mainnet
  
  const { data: currentIfoBlocks = { startBlock: 0, endBlock: 0 } } = useSWRImmutable(
    activeIfo && isIfoSupportedChain ? ['ifo', 'currentIfo', chainId] : null,
    async () => {
      const abi = ifoV3Abi
      const [startBlock, endBlock] = await multicallv2({
        abi,
        calls: [
          {
            address: activeIfo.address,
            name: 'startBlock',
          },
          {
            address: activeIfo.address,
            name: 'endBlock',
          },
        ],
        chainId,
        options: { requireSuccess: false },
      })

      return { startBlock: startBlock ? startBlock[0].toNumber() : 0, endBlock: endBlock ? endBlock[0].toNumber() : 0 }
    },
  )

  return activeIfo ? { ...activeIfo, ...currentIfoBlocks } : null
}
