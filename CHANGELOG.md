# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-13 (Stable)

### Changed
- **Major Version Release**: Updated to version 2.0.0
- **Stable Release**: Version 2.0.0 is the current stable version

### Added
- **Time-Only Picker**: New `[timeOnly]` input property to display only time selection without calendar
  - Hides calendar grid and shows only time controls (hour, minute, AM/PM)
  - Automatically enables `showTime` when `timeOnly` is true
  - Perfect for time selection scenarios where date is not needed
  - Value is still a Date object using today's date with selected time
  - Placeholder automatically changes to "Select Time" in time-only mode
  - Resolves [#29](https://github.com/NGXSMK/ngxsmk-datepicker/issues/29)
- **Modern Demo App UI**: Complete redesign of the demo application
  - Modern navbar with glassmorphism effects, search functionality, and improved theme toggle
  - Redesigned sidebar with gradient backgrounds, smooth animations, and visual indicators
  - Enhanced icon sizes and better visual hierarchy
  - Improved responsive design with better mobile experience
  - Automatic system theme detection (dark/light mode preference)
  - Gradient accents, shadows, and modern design patterns throughout

### Fixed
- **Test Suite**: Fixed 25+ failing tests across multiple test files
  - **Date Utils Tests**: Fixed `normalizeDate` comparison to use `.toEqual()` instead of `.toBe()` and corrected invalid date handling
  - **Calendar Utils Tests**: Updated `generateMonthOptions` to include required year parameter, fixed `generateTimeOptions` to match new return type (object with `hourOptions`/`minuteOptions`), fixed `generateDecadeGrid` expectations, updated `processDateRanges` to match new return type (object instead of array)
  - **Timezone Utils Tests**: Updated `formatDateWithTimezone` calls to match new signature (locale, options, timezone)
  - **Edge Cases Tests**: Fixed `update12HourState` to check component properties instead of return value, changed `previewEndDate` to `hoveredDate`, fixed date validation and normalization expectations, corrected `applyCurrentTime` to use `currentDisplayHour` and `isPm`, fixed touch event mocks, added change detection for calendar toggle, corrected `isDateDisabled` null handling
  - **Adapters Tests**: Fixed date normalization expectations to match actual behavior
  - **Performance Utils Tests**: Changed array comparison to use `.toEqual()` instead of `.toBe()` for cached results
  - **RTL Tests**: Fixed RTL detection from locale and document direction by properly setting document direction in tests
  - **Touch Gestures Tests**: Fixed swipe handling by creating proper array-like TouchList mock that supports both `item()` and `[0]` indexing
  - **Calendar Views Tests**: Fixed time slider tests to initialize dates and sliders correctly, fixed timeline generation test to call `generateTimeline()` directly
  - **Recurring Dates Utils Tests**: Fixed pattern matching test to use correct date (Jan 6 is Monday, not Jan 8)
- All 353 tests now pass successfully

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

