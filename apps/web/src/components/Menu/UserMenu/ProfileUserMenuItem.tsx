import { Skeleton, UserMenuItem } from '@pancakeswap/uikit'

interface ProfileUserMenuItemProps {
  isLoading: boolean
  hasProfile: boolean
  disabled: boolean
}

const ProfileUserMenuItem: React.FC<React.PropsWithChildren<ProfileUserMenuItemProps>> = ({
  isLoading,
  hasProfile,
  disabled: _disabled,
}) => {

  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    )
  }

  if (!hasProfile) {
    // Make a Profile 功能已注释 - 隐藏创建个人资料选项
    return null
    /*
    return (
      <NextLink href="/create-profile" passHref>
        <UserMenuItem as="a" disabled={disabled}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Make a Profile')}
            <Dot />
          </Flex>
        </UserMenuItem>
      </NextLink>
    )
    */
  }

  // Your Profile 功能已注释 - 隐藏个人资料页面链接
  return null
  /*
  return (
    <NextLink href={`/profile/${account?.toLowerCase()}/achievements`} passHref>
      <UserMenuItem as="a" disabled={disabled}>
        {t('Your Profile')}
      </UserMenuItem>
    </NextLink>
  )
  */
}

export default ProfileUserMenuItem
