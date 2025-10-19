# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Customization System** - Complete UI and behavior customization functionality
  - Logo Customization - Replace default logos with custom images
  - Home Page Redirect - Automatic redirect to swap page with query parameter preservation
  - Default Dark Theme - Project starts with dark theme by default
  - Footer Hiding - Clean interface by hiding page footer components
  - Help Button Hiding - Remove "Need help?" and help elements for cleaner UI
  - User Menu Simplification - Hide NFT and profile features for focused experience
  - Brand Name Update - Browser title changed to "PopChainSwap"
  - Language Support Optimization - Streamlined to 7 core languages
  - Environment variable control for flexible configuration
  - Test pages for validation (`/test-logo`, `/test-redirect`, `/test-theme`)
  - Comprehensive documentation in `doc/Customization-Guide.md`

### Changed
- Enhanced Menu components to support customization features
- Updated project documentation structure for better organization
- Improved developer experience with integrated testing tools

### Fixed
- Page scroll layout issue - content no longer gets covered by fixed menu
- Mobile bottom content coverage - added proper padding for mobile navigation
- Mobile black area issue - fixed background color and minimum height settings
- Mobile bottom navigation routing - explicitly configured showOnMobile properties
- Mobile logo display optimization - properly uses custom logo.png file
- SubMenu rendering logic for better responsive behavior
- Logo theme adaptation - different logos for dark/light themes

### Technical Details
For detailed technical information, implementation guides, and troubleshooting, see [Customization Guide](doc/Customization-Guide.md).

---

## How to Use This Changelog

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities
