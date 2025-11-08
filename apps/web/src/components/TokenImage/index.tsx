import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from '@pancakeswap/uikit'
import { Token, ChainId } from '@pancakeswap/sdk'
import { getAddress } from '@ethersproject/address'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  if (!token) return ''
  const address = token.isNative ? token.wrapped.address : token.address
  // 使用 checksum 格式确保大小写匹配（Linux 服务器大小写敏感）
  const checksumAddress = getAddress(address)
  if (token.chainId !== ChainId.BSC) {
    return `/images/${token.chainId}/tokens/${checksumAddress}.png`
  }
  return `/images/tokens/${checksumAddress}.png`
}

export const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  ...props
}) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<React.PropsWithChildren<TokenImageProps>> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
