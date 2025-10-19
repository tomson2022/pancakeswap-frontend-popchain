// 投票功能已禁用 - Voting feature disabled
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'

const ProposalDisabled = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <PageMeta />
      <Container>
        <Card>
          <CardBody>
            <Heading mb="24px">{t('Proposal Feature Disabled')}</Heading>
            <Text>{t('The proposal feature has been disabled for this deployment.')}</Text>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default ProposalDisabled

/* 原始代码已注释 - Original code commented out
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getProposal } from 'state/voting/helpers'
import { ProposalState } from 'state/types'
import Overview from 'views/Voting/Proposal/Overview'

const ProposalPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Overview />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const fetchedProposal = await getProposal(id)
    if (!fetchedProposal) {
      return {
        notFound: true,
        revalidate: 1,
      }
    }
    return {
      props: {
        fallback: {
          [unstable_serialize(['proposal', id])]: fetchedProposal,
        },
      },
      revalidate:
        fetchedProposal.state === ProposalState.CLOSED
          ? 60 * 60 * 12 // 12 hour
          : 3,
    }
  } catch (error) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }
}

export default ProposalPage
*/