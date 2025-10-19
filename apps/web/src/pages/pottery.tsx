// import Pottery from '../views/Pottery'
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'

const PotteryDisabled = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <PageMeta />
      <Container>
        <Card>
          <CardBody>
            <Heading mb="24px">{t('Pottery Feature Disabled')}</Heading>
            <Text>{t('The pottery feature has been disabled for this deployment.')}</Text>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default PotteryDisabled
// export default Pottery
