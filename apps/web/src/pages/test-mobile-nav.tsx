import { Box, Text, Card, CardBody, Button } from '@pancakeswap/uikit'
import Link from 'next/link'
import Page from 'components/Layout/Page'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { useEffect, useState } from 'react'

const TestMobileNavPage = () => {
  const router = useRouter()
  const menuItems = useMenuItems()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(router.pathname)
  }, [router.pathname])

  return (
    <Page>
      <Box maxWidth="800px" margin="0 auto" padding="24px">
        <Text as="h1" fontSize="32px" bold mb="24px" textAlign="center">
          移动端底部导航测试
        </Text>
        
        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              当前页面信息
            </Text>
            <Text mb="8px">
              • 当前路径: {currentPath}
            </Text>
            <Text mb="8px">
              • 用户代理: {typeof window !== 'undefined' ? (window.navigator.userAgent.includes('Mobile') ? '移动端' : '桌面端') : '未知'}
            </Text>
            <Text>
              • 窗口宽度: {typeof window !== 'undefined' ? `${window.innerWidth}px` : '未知'}
            </Text>
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              底部导航菜单项
            </Text>
            {menuItems.map((item, index) => (
              <Box key={item.href} mb="12px" p="12px" bg="backgroundAlt" borderRadius="8px">
                <Text mb="4px">
                  <strong>{index + 1}. {item.label}</strong>
                </Text>
                <Text fontSize="14px" color="textSubtle" mb="4px">
                  路径: {item.href}
                </Text>
                <Text fontSize="14px" color="textSubtle" mb="8px">
                  状态: {item.disabled ? '❌ 禁用' : '✅ 启用'}
                </Text>
                <Link href={item.href} passHref>
                  <Button as="a" variant="secondary" scale="xs">
                    测试跳转
                  </Button>
                </Link>
              </Box>
            ))}
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              快速导航测试
            </Text>
            <Box display="flex" style={{ flexDirection: 'column', gap: '8px' }}>
              <Link href="/swap" passHref>
                <Button as="a" variant="primary" width="100%">
                  跳转到 Swap 页面
                </Button>
              </Link>
              <Link href="/liquidity" passHref>
                <Button as="a" variant="primary" width="100%">
                  跳转到 Liquidity 页面
                </Button>
              </Link>
              <Link href="/info" passHref>
                <Button as="a" variant="primary" width="100%">
                  跳转到 Info 页面
                </Button>
              </Link>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              移动端测试说明
            </Text>
            <Text mb="8px">
              1. 在移动设备或浏览器开发者工具的移动模式下测试
            </Text>
            <Text mb="8px">
              2. 检查页面底部是否显示底部导航栏
            </Text>
            <Text mb="8px">
              3. 点击底部导航的图标，验证是否能正确跳转
            </Text>
            <Text mb="8px">
              4. 确认当前页面的导航图标是否高亮显示
            </Text>
            <Text>
              5. 验证页面内容是否被底部导航遮挡
            </Text>
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

export default TestMobileNavPage
