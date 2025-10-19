/**
 * Logo configuration
 * 
 * This file controls which logo to display in the application.
 * You can switch between the default PancakeSwap SVG logos and custom image logos.
 */

// 检查环境变量，如果未设置则默认使用自定义logo
export const USE_CUSTOM_LOGO = process.env.NEXT_PUBLIC_USE_CUSTOM_LOGO === 'true' || 
  process.env.NEXT_PUBLIC_USE_CUSTOM_LOGO === undefined;

// Logo配置
export const LOGO_CONFIG = {
  useCustomLogo: USE_CUSTOM_LOGO,
  customLogoPaths: {
    mobile: '/logo.png',
    desktop: {
      dark: '/logoWIthText.png',        // Dark主题使用原logo
      light: '/logoWIthTextBlack.png',  // Light主题使用黑色logo
    },
  },
  // 如果需要，可以在这里添加更多配置选项
  fallbackToDefault: true, // 如果自定义logo加载失败，是否回退到默认logo
} as const;

export default LOGO_CONFIG;
