import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import Flex from "../../../components/Box/Flex";
import { MenuContext } from "../context";

interface Props {
  href: string;
  useCustomLogo?: boolean;
  isDark?: boolean;
}

const StyledLink = styled("a")`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    height: 32px;
    ${({ theme }) => theme.mediaQueries.lg} {
      display: none;
    }
  }
  .desktop-icon {
    height: 32px;
    width: auto;
    max-width: 160px;
    display: none;
    ${({ theme }) => theme.mediaQueries.lg} {
      display: block;
    }
  }
`;

const LogoImage = styled.img`
  object-fit: contain;
`;

const CustomLogo: React.FC<React.PropsWithChildren<Props>> = ({ href, useCustomLogo = false, isDark = true }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  
  // 如果不使用自定义logo，返回null让父组件使用默认logo
  if (!useCustomLogo) {
    return null;
  }

  // 根据主题选择桌面端logo
  const desktopLogoSrc = useMemo(() => {
    return isDark ? '/logoWIthText.png' : '/logoWIthTextBlack.png';
  }, [isDark]);

  const innerLogo = (
    <>
      <LogoImage 
        src="/logo.png" 
        alt="Custom Logo" 
        className="mobile-icon"
        onError={(e) => {
          // 如果图片加载失败，隐藏该元素
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <LogoImage 
        src={desktopLogoSrc}
        alt={`Custom Logo with Text (${isDark ? 'Dark' : 'Light'} Theme)`}
        className="desktop-icon"
        onError={(e) => {
          // 如果图片加载失败，尝试回退到默认logo
          const target = e.target as HTMLImageElement;
          if (!target.src.endsWith('/logoWIthText.png')) {
            target.src = '/logoWIthText.png'; // 回退到dark主题logo
          } else {
            target.style.display = 'none';
          }
        }}
      />
    </>
  );

  return (
    <Flex>
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="Home page">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="Home page">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  );
};

export default React.memo(CustomLogo);
