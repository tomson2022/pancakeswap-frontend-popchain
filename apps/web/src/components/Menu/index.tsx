import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter, Flex } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
// import PhishingWarningBanner from 'components/PhishingWarningBanner' // 钓鱼警告已注释
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import useTheme from 'hooks/useTheme'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { usePopBusdPrice } from 'hooks/usePopPrice'
// import { usePhishingBannerManager } from 'state/user/hooks' // 钓鱼警告已注释
import PopPrice from 'components/PopPrice'
import LOGO_CONFIG from 'config/logo'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
// import { footerLinks } from './config/footerConfig' // Footer已注释
import { SettingsMode } from './GlobalSettings/types'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = useCakeBusdPrice({ forceMainnet: true })
  const popPriceUsd = usePopBusdPrice({ forceMainnet: true })
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  // const [showPhishingWarningBanner] = usePhishingBannerManager() // 钓鱼警告已注释

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  // Footer links已注释 - 不再显示页面底部footer
  const getFooterLinks = useMemo(() => {
    return [] // footerLinks(t) - 返回空数组避免footer显示
  }, [])

  return (
    <>
      <UikitMenu
        linkComponent={(linkProps) => {
          return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
        }}
        rightSide={
          <>
            <Flex alignItems="center" mr="12px">
              <PopPrice popPriceUsd={popPriceUsd} showSkeleton={false} />
            </Flex>
            <GlobalSettings mode={SettingsMode.GLOBAL} />
            <NetworkSwitcher />
            <UserMenu />
          </>
        }
        banner={false} // 钓鱼警告banner已注释: showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy CAKE')}
        useCustomLogo={LOGO_CONFIG.useCustomLogo}
        {...props}
      />
    </>
  )
}

export default Menu
