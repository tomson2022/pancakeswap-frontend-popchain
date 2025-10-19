import merge from 'lodash/merge'
import teamsList from 'config/constants/teams'
import { getProfileContract } from 'utils/contractHelpers'
import { Team } from 'config/constants/types'
import { multicallv2 } from 'utils/multicall'
import { TeamsById } from 'state/types'
import profileABI from 'config/abi/pancakeProfile.json'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import fromPairs from 'lodash/fromPairs'
import { ChainId } from '@pancakeswap/sdk'

const profileContract = getProfileContract()

export const getTeam = async (teamId: number): Promise<Team> => {
  try {
    const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = await profileContract.getTeamProfile(teamId)
    const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

    return merge({}, staticTeamInfo, {
      isJoinable,
      name: teamName,
      users: numberUsers.toNumber(),
      points: numberPoints.toNumber(),
    })
  } catch (error) {
    return null
  }
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const getTeams = async (chainId?: ChainId): Promise<TeamsById> => {
  try {
    // Teams 功能目前只在 BSC 网络上支持
    const supportedChains = [ChainId.BSC, ChainId.BSC_TESTNET]
    const currentChainId = chainId || ChainId.BSC
    
    if (!supportedChains.includes(currentChainId)) {
      // 在不支持的链上返回静态团队列表
      return fromPairs(teamsList.map((team) => [team.id, team]))
    }

    const teamsById = fromPairs(teamsList.map((team) => [team.id, team]))
    const nbTeams = await profileContract.numberTeams()

    const calls = []
    for (let i = 1; i <= nbTeams.toNumber(); i++) {
      calls.push({
        address: getPancakeProfileAddress(),
        name: 'getTeamProfile',
        params: [i],
      })
    }
    const teamData = await multicallv2({ abi: profileABI, calls, chainId: currentChainId })

    const onChainTeamData = fromPairs(
      teamData.map((team, index) => {
        const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

        return [
          index + 1,
          {
            name: teamName,
            users: numberUsers.toNumber(),
            points: numberPoints.toNumber(),
            isJoinable,
          },
        ]
      }),
    )

    return merge({}, teamsById, onChainTeamData)
  } catch (error) {
    return null
  }
}
