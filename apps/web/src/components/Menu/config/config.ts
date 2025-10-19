import {
  MenuItemsType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  ChartIcon,
  DropdownMenuItems,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

// 以下导入已注释，因为对应功能被禁用
// import { DropdownMenuItemType, TrophyIcon, TrophyFillIcon, NftIcon, NftFillIcon, MoreIcon, InfoIcon } from '@pancakeswap/uikit'
// import { nftsBaseUrl } from 'views/Nft/market/constants'
// import { perpLangMap } from 'utils/getPerpetualLanguageCode'
// import { perpTheme } from 'utils/getPerpetualTheme'
// import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains' // 已禁用

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Swap'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showOnMobile: true,
      showItemsOnMobile: false,
    },
    {
      label: t('Liquidity'),
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      href: '/liquidity',
      showOnMobile: true,
      showItemsOnMobile: false,
    },
    // {
    //   label: t('Earn'),
    //   href: '/farms',
    //   icon: EarnIcon,
    //   fillIcon: EarnFillIcon,
    //   image: '/images/decorations/pe2.png',
    //   items: [
    //     {
    //       label: t('Farms'),
    //       href: '/farms',
    //     },
    //     {
    //       label: t('Pools'),
    //       href: '/pools',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //     },
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: t('Win'),
    //   href: '/prediction',
    //   icon: TrophyIcon,
    //   fillIcon: TrophyFillIcon,
    //   supportChainIds: SUPPORT_ONLY_BSC,
    //   items: [
    //     {
    //       label: t('Trading Competition'),
    //       href: '/competition',
    //       image: '/images/decorations/tc.png',
    //       hideSubNav: true,
    //     },
    //     {
    //       label: t('Prediction (BETA)'),
    //       href: '/prediction',
    //       image: '/images/decorations/prediction.png',
    //     },
    //     {
    //       label: t('Lottery'),
    //       href: '/lottery',
    //       image: '/images/decorations/lottery.png',
    //     },
    //     // {
    //     //   label: t('Pottery (BETA)'),
    //     //   href: '/pottery',
    //     //   image: '/images/decorations/lottery.png',
    //     // },
    //   ],
    // },
    // {
    //   label: t('NFT'),
    //   href: `${nftsBaseUrl}`,
    //   icon: NftIcon,
    //   fillIcon: NftFillIcon,
    //   supportChainIds: SUPPORT_ONLY_BSC,
    //   image: '/images/decorations/nft.png',
    //   items: [
    //     {
    //       label: t('Overview'),
    //       href: `${nftsBaseUrl}`,
    //     },
    //     {
    //       label: t('Collections'),
    //       href: `${nftsBaseUrl}/collections`,
    //     },
    //     {
    //       label: t('Activity'),
    //       href: `${nftsBaseUrl}/activity`,
    //     },
    //   ],
    // },
    {
      label: t('Info'),
      href: '/info',
      icon: ChartIcon,
      fillIcon: ChartIcon,
      showOnMobile: true,
      showItemsOnMobile: false,
    },
    // {
    //   label: '',
    //   href: '/info',
    //   icon: MoreIcon,
    //   hideSubNav: true,
    //   items: [
    //     {
    //       label: t('IFO'),
    //       href: '/ifo',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //       image: '/images/ifos/ifo-bunny.png',
    //     },
    //     // {
    //     //   label: t('Voting'),
    //     //   href: '/voting',
    //     //   supportChainIds: SUPPORT_ONLY_BSC,
    //     //   image: '/images/voting/voting-bunny.png',
    //     // },
    //     {
    //       type: DropdownMenuItemType.DIVIDER,
    //     },
    //     {
    //       label: t('Leaderboard'),
    //       href: '/teams',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //       image: '/images/decorations/leaderboard.png',
    //     },
    //     {
    //       type: DropdownMenuItemType.DIVIDER,
    //     },
    //     {
    //       label: t('Blog'),
    //       href: 'https://medium.com/pancakeswap',
    //       type: DropdownMenuItemType.EXTERNAL_LINK,
    //     },
    //     {
    //       label: t('Docs'),
    //       href: 'https://docs.pancakeswap.finance',
    //       type: DropdownMenuItemType.EXTERNAL_LINK,
    //     },
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
