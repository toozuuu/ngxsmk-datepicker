# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.1] - 2025-11-12

### Changed
- **Bundle Optimization**: Optimized bundle size with improved TypeScript compiler settings
  - Main bundle: ~127KB (source maps excluded from published package)
  - Enhanced tree-shaking with optimized imports and compiler options
  - Added `importsNotUsedAsValues: "remove"` for smaller output
  - Disabled `preserveConstEnums` for better inlining
- **Build Process**: 
  - Source maps automatically removed from production builds (saves ~127KB)
  - Improved build scripts with better error handling
  - Enhanced bundle analysis that excludes source maps
- **Package Configuration**:
  - Fixed package.json exports to eliminate build warnings
  - Optimized `files` array to exclude unnecessary files
  - Updated exports field for better module resolution
- **Test Configuration**: 
  - Added Zone.js polyfills to library test configuration
  - Updated test commands to explicitly target library project
  - Improved test reliability across Angular versions

### Fixed
- Test suite configuration - added missing Zone.js polyfills for library tests
- Bundle analysis now correctly excludes source maps from size calculations
- Build warnings from conflicting export conditions resolved
- Source map removal script made more resilient for build environments

## [1.9.0] - 2025-11-10

### Added
- Extension Points & Hooks system for customization
- Enhanced keyboard shortcuts (Y, N, W keys)
- Modern UI/UX with improved animations and responsiveness
- API documentation with TypeDoc
- Semantic release automation
- Animation performance optimizations with GPU acceleration
- Global search functionality in documentation
- Mobile playground for responsive testing

### Changed
- Optimized animations using `transform3d` for hardware acceleration
- Reduced animation durations from 0.2s to 0.15s
- Improved transition performance with specific property targeting
- Updated documentation structure
- Enhanced mobile responsiveness

### Fixed
- Animation performance issues
- Mobile responsive layout
- Sidebar scrollbar styling
- TypeScript warnings

## [1.8.0] - 2025-01-XX

### Added
- Signal Forms support with `[field]` input for Angular 21+
- SSR compatibility with platform checks
- Zoneless support (works without Zone.js)
- Immediate value initialization when `[value]` is set programmatically
- Comprehensive documentation for Signals, Signal Forms, and SSR
- GitHub Pages deployment automation

### Changed
- Updated peer dependencies to support Angular 17-21 (`>=17.0.0 <23.0.0`)
- Added `@angular/forms` as peer dependency
- Made `zone.js` optional peer dependency
- Enhanced `exports` field in package.json with proper types
- Optimized imports for better tree-shaking

### Fixed
- Issue #13: Programmatic value setting now works correctly
- SSR compatibility: All browser APIs properly guarded
- Value input setter now initializes immediately

## [1.7.0] - Previous Release

*Previous changelog entries...*

---

## Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

