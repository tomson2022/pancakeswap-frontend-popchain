import { Box, Text, Card, CardBody } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { GetStaticProps } from 'next'

const TestLogoPage = () => {
  return (
    <Page>
      <Box maxWidth="800px" margin="0 auto" padding="24px">
        <Text as="h1" fontSize="32px" bold mb="24px" textAlign="center">
          Logo测试页面
        </Text>
        
        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              当前Logo配置
            </Text>
            <Text mb="8px">
              • 环境变量 NEXT_PUBLIC_USE_CUSTOM_LOGO: {process.env.NEXT_PUBLIC_USE_CUSTOM_LOGO || '未设置'}
            </Text>
            <Text mb="8px">
              • 使用自定义Logo: {process.env.NEXT_PUBLIC_USE_CUSTOM_LOGO === 'true' ? '是' : '否'}
            </Text>
            <Text>
              • 配置文件默认值: 使用自定义Logo（当环境变量未设置时）
            </Text>
          </CardBody>
        </Card>

        <Card mb="24px">
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              Logo文件检查
            </Text>
            <Box display="flex" style={{ flexDirection: 'column', gap: '16px' }}>
              <Box>
                <Text mb="8px">移动端Logo (logo.png):</Text>
                <img 
                  src="/logo.png" 
                  alt="Mobile Logo" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextSibling.textContent = '❌ 文件不存在或加载失败';
                  }}
                />
                <Text ml="8px" color="success">✅ 加载成功</Text>
              </Box>
              
              <Box>
                <Text mb="8px">桌面端Logo (logoWIthText.png):</Text>
                <img 
                  src="/logoWIthText.png" 
                  alt="Desktop Logo" 
                  style={{ 
                    height: '32px', 
                    width: 'auto',
                    maxWidth: '160px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextSibling.textContent = '❌ 文件不存在或加载失败';
                  }}
                />
                <Text ml="8px" color="success">✅ 加载成功</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="18px" bold mb="16px">
              使用说明
            </Text>
            <Text mb="8px">
              1. 查看页面顶部导航栏的Logo是否已更换
            </Text>
            <Text mb="8px">
              2. 在不同屏幕尺寸下测试Logo显示效果
            </Text>
            <Text mb="8px">
              3. 如需切换回默认Logo，请设置环境变量 NEXT_PUBLIC_USE_CUSTOM_LOGO=false
            </Text>
            <Text>
              4. 详细配置说明请查看 apps/web/README-LOGO.md 文件
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

export default TestLogoPage
