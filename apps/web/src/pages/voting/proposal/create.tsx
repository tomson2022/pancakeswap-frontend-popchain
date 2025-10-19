// import CreateProposal from '../../../views/Voting/CreateProposal'
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'

const CreateProposalDisabled = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <PageMeta />
      <Container>
        <Card>
          <CardBody>
            <Heading mb="24px">{t('Create Proposal Feature Disabled')}</Heading>
            <Text>{t('The proposal creation feature has been disabled for this deployment.')}</Text>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default CreateProposalDisabled
// export default CreateProposal
