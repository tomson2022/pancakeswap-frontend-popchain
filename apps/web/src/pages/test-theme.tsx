import { Box, Text, Card, CardBody, Button } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useTheme, { COOKIE_THEME_KEY } from 'hooks/useTheme'
import { GetStaticProps } from 'next'
import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Cookie from 'js-cookie'

const TestThemePage = () => {
  const { isDark, setTheme } = useTheme()
  const { theme, resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)
  const [cookieValue, setCookieValue] = useState('')

  useEffect(() => {
    setMounted(true)
    setCookieValue(Cookie.get(COOKIE_THEME_KEY) || '未设置')
  }, [])

  if (!mounted) {
    return (
      <Page>
        <Box maxWidth="800px" margin="0 auto" padding="24px">
          <Text>加载中...</Text>
        </Box>
      </Page>
    )
  }

  return (
    <Page>
      <Box maxWidth="800px" margin="0 auto" padding="24px">
        <Text as="h1" fontSize="32px" bold mb="24px" textAlign="center">
          主题测试页面
        </Text>
        
        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              当前主题状态
            </Text>
            <Text mb="8px">
              • 当前主题: {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Text>
            <Text mb="8px">
              • Next-themes resolved theme: {resolvedTheme}
            </Text>
            <Text mb="8px">
              • Next-themes theme: {theme}
            </Text>
            <Text mb="8px">
              • 系统主题: {systemTheme}
            </Text>
            <Text mb="16px">
              • Cookie值: {cookieValue}
            </Text>
            
            <Box display="flex" style={{ gap: '12px' }}>
              <Button 
                variant={isDark ? "secondary" : "primary"} 
                onClick={() => setTheme('dark')}
              >
                切换到 Dark
              </Button>
              <Button 
                variant={!isDark ? "secondary" : "primary"} 
                onClick={() => setTheme('light')}
              >
                切换到 Light
              </Button>
            </Box>
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              默认主题配置
            </Text>
            <Text mb="8px">
              • NextThemeProvider defaultTheme: &quot;dark&quot;
            </Text>
            <Text mb="8px">
              • Cookie默认值: &quot;dark&quot;（首次访问时）
            </Text>
            <Text mb="8px">
              • 配置位置: apps/web/src/Providers.tsx
            </Text>
            <Text>
              • Cookie管理: apps/web/src/hooks/useThemeCookie.ts
            </Text>
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              测试说明
            </Text>
            <Text mb="8px">
              1. 清除浏览器cookie和localStorage
            </Text>
            <Text mb="8px">
              2. 刷新页面或在无痕模式下访问
            </Text>
            <Text mb="8px">
              3. 应该默认显示为Dark模式
            </Text>
            <Text>
              4. 主题切换功能应该正常工作
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              样式预览
            </Text>
            <Box 
              p="16px" 
              borderRadius="8px" 
              bg={isDark ? "backgroundAlt" : "backgroundAlt2"}
              mb="16px"
            >
              <Text color="text">
                这是在{isDark ? '深色' : '浅色'}主题下的文本样式
              </Text>
            </Box>
            <Box 
              p="16px" 
              borderRadius="8px" 
              bg={isDark ? "card" : "card"}
              border="1px solid"
              borderColor="cardBorder"
            >
              <Text color="textSubtle">
                这是卡片背景样式，边框颜色会根据主题变化
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default TestThemePage
