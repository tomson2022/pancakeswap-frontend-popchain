// import Voting from '../../views/Voting'
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'

const VotingDisabled = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <PageMeta />
      <Container>
        <Card>
          <CardBody>
            <Heading mb="24px">{t('Voting Feature Disabled')}</Heading>
            <Text>{t('The voting feature has been disabled for this deployment.')}</Text>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default VotingDisabled
// export default Voting
