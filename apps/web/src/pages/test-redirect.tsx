import { Box, Text, Card, CardBody, Button } from '@pancakeswap/uikit'
import Link from 'next/link'
import Page from 'components/Layout/Page'
import { GetStaticProps } from 'next'

const TestRedirectPage = () => {
  return (
    <Page>
      <Box maxWidth="800px" margin="0 auto" padding="24px">
        <Text as="h1" fontSize="32px" bold mb="24px" textAlign="center">
          重定向测试页面
        </Text>
        
        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              重定向配置测试
            </Text>
            <Text mb="16px">
              当前页面用于测试主页重定向功能是否正常工作。
            </Text>
            
            <Box mb="16px">
              <Link href="/" passHref>
                <Button as="a" variant="primary" mr="12px" mb="8px">
                  访问主页 (/) - 应该重定向到 /swap
                </Button>
              </Link>
              
              <Link href="/?chainId=7257" passHref>
                <Button as="a" variant="primary" mr="12px" mb="8px">
                  访问主页带参数 (?chainId=7257)
                </Button>
              </Link>
              
              <Link href="/swap" passHref>
                <Button as="a" variant="secondary" mb="8px">
                  直接访问 /swap
                </Button>
              </Link>
            </Box>
            
            <Text fontSize="14px" color="textSubtle">
              点击按钮测试重定向功能。带参数的链接应该保留查询参数重定向到swap页面。
            </Text>
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              当前重定向配置
            </Text>
            <Text mb="8px">
              • 源路径: /
            </Text>
            <Text mb="8px">
              • 目标路径: /swap
            </Text>
            <Text mb="8px">
              • 重定向类型: 服务器端重定向 + 客户端重定向
            </Text>
            <Text mb="8px">
              • 查询参数: 自动保留并传递
            </Text>
            <Text>
              • 配置位置: apps/web/next.config.mjs + apps/web/src/pages/index.tsx
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              相关变更
            </Text>
            <Text mb="8px">
              ✅ 服务器端重定向规则 (next.config.mjs)
            </Text>
            <Text mb="8px">
              ✅ 客户端重定向逻辑 (index.tsx) - 处理查询参数
            </Text>
            <Text mb="8px">
              ✅ Logo点击仍然指向 / (会被重定向到 /swap)
            </Text>
            <Text mb="8px">
              ✅ 查询参数自动保留 (如 ?chainId=7257)
            </Text>
            <Text>
              ✅ 保持了原有的用户体验和SEO友好性
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

export default TestRedirectPage
