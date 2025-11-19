# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2025-11-19 (Stable)

### Changed
- **Version Update**: Updated to version 1.10.0
- **Stable Release**: Version 1.10.0 is the current stable version

### Added
- **Major Version Release**: Version 1.10.0 introduces new features and improvements

### Migration Notes
- This is a minor version update with backward compatibility
- No breaking changes from v1.9.11
- See [MIGRATION.md](MIGRATION.md) for detailed migration guide

## [1.9.11] - 2025-11-17 (Stable)

### Fixed
- **Moment.js Integration with Custom Formats**: Fixed critical issue where Moment.js objects with custom date formats would not populate correctly
  - Added `isMomentObject()` helper method to safely detect Moment.js instances
  - Enhanced `_normalizeValue()` method to handle Moment.js objects directly by extracting native Date using `.toDate()`
  - Improved `parseCustomDateString()` method to use bracket notation for TypeScript compatibility with dynamic object properties
  - Added comprehensive support for format tokens: YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A
  - Resolves issue where `moment(this.date).utcOffset(timezone).format('MM/DD/YYYY hh:mm a')` with `displayFormat="MM/DD/YYYY hh:mm a"` would not populate correctly
  - Maintains full backward compatibility with Date objects, strings, and all other supported formats

### Improved
- **Custom Format Parser**: Enhanced format token parsing with better TypeScript compatibility
- **Moment.js Detection**: More robust detection of Moment.js objects across different versions
- **Demo Application**: Added working Moment.js integration example with interactive controls

## [1.9.10] - 2025-11-15 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.10
- **Stable Release**: Version 1.9.10 is the current stable version

### Fixed
- **Async Database Value Loading**: Enhanced datepicker to properly handle database values that load asynchronously after component initialization
  - Added fallback sync mechanism in `ngAfterViewInit` to catch async database loads
  - Added delayed sync checks in `ngOnInit`, `ngOnChanges`, and `ngAfterViewInit` to handle field value changes that occur after component initialization
  - Added sync on calendar open, focus events, and touch events to ensure values are populated
  - Extended interval sync duration to 30 seconds (from 10 seconds) with 100ms check intervals
  - Ensures datepicker properly displays database values even when they load after the component is rendered
- **TypeScript Compilation Error**: Fixed `EffectRef` type error when using Angular 17+ `effect()` API
  - Changed `_fieldEffectDestroy: (() => void) | null` to `_fieldEffectRef: EffectRef | null`
  - Updated effect cleanup to use `effectRef.destroy()` instead of function call
  - Added proper `EffectRef` import from `@angular/core`
- **Test Configuration**: Fixed test configuration for Angular 17+ compatibility
  - Updated karma configuration to work with `@angular/build:karma` builder
  - Simplified karma.conf.js to remove deprecated plugins
  - Updated test script to target correct project

### Improved
- **Async Value Handling**: Improved handling of field values that change asynchronously
- **Effect Management**: Proper effect lifecycle management with `EffectRef` for correct cleanup
- **Code Cleanup**: Removed unnecessary comments for cleaner codebase
- **Test Reliability**: Enhanced test configuration for better reliability across Angular versions

## [1.9.9] - 2025-11-15 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.9
- **Stable Release**: Version 1.9.9 is the current stable version

### Fixed
- **Database Value Population**: Fixed critical issue where datepicker would not populate with values from database when using `[field]` input binding
  - Added `_normalizeValue()` helper method to properly handle all value types (Date objects, strings, range objects, arrays)
  - Updated field effect and related methods to use `_normalizeValue()` instead of `_normalizeDate()` which only handled single dates
  - Fixed issue where string dates from database (common scenario) were not being parsed and displayed correctly
  - Now properly handles Date objects, string dates, range objects `{start: Date, end: Date}`, and arrays of dates

### Improved
- **Value Normalization**: Improved value normalization to handle all DatepickerValue types consistently
- **Database Integration**: Enhanced compatibility with database values in various formats (strings, Date objects, etc.)

## [1.9.8] - 2025-11-14 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.8
- **Stable Release**: Version 1.9.8 is the current stable version

### Fixed
- **Date Selection Reset Issue**: Fixed critical bug where selected dates would reset to today's date when using `[field]` input binding
  - Fixed `applyCurrentTime` to create a new Date object instead of mutating the original, preventing reference issues
  - Added `_isUpdatingFromInternal` flag to prevent field effect from resetting the value when updating internally
  - This ensures selected dates are properly stored in the form field instead of being reset to today

### Improved
- **Date Mutation Prevention**: Improved date handling to prevent unintended mutations of date objects
- **Field Update Stability**: Enhanced field binding stability to prevent value resets during internal updates

## [1.9.7] - 2025-11-14 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.7
- **Stable Release**: Version 1.9.7 is the current stable version

### Fixed
- **Calendar Population**: Fixed critical issue where datepicker calendar would not populate with dates when opened, especially when multiple datepickers were present in the same form
- **Calendar Generation**: Ensured `generateCalendar()` is called when opening the datepicker via click, touch, or programmatic methods

### Improved
- **Calendar Initialization**: Improved calendar initialization to ensure dates are always generated before the calendar becomes visible

## [1.9.6] - 2025-11-14 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.6
- **Stable Release**: Version 1.9.6 is the current stable version

### Fixed
- **Multiple Datepicker Management**: Fixed issue where multiple datepickers in the same form would open in the same centered location
- **Outside Click Detection**: Improved click detection to properly close datepicker when clicking outside the popover and input field
- **Auto-close Other Datepickers**: When opening a datepicker, all other open datepickers in the same form are now automatically closed
- **Mobile Datepicker Opening**: Fixed issue where datepicker modal would not open on mobile screens
- **Datepicker Closing on Mobile**: Fixed issue where datepicker would open and immediately disappear on mobile devices
- **Select Box Cursor**: Added pointer cursor to all select boxes (month, year, hour, minute, AM/PM) in the datepicker

### Improved
- **Document Click Handler**: Enhanced document click handler to check if clicks are inside the popover container, not just the input group
- **Touch Event Handling**: Improved touch event handling to prevent premature closing on mobile devices
- **Instance Management**: Added static instance registry to track all datepicker instances for better coordination

## [1.9.5] - 2025-11-14 (Stable)

### Changed
- **Version Update**: Updated to version 1.9.5
- **Stable Release**: Version 1.9.5 is the current stable version

### Fixed
- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20 where field input is optional
  - Resolves [#33](https://github.com/NGXSMK/ngxsmk-datepicker/issues/33)

## [1.9.4] - 2025-11-14 (Stable)

### Changed
- **Major Version Release**: Updated to version 1.9.4
- **Stable Release**: Version 1.9.4 is the current stable version

### Added
- **Custom Date Format**: New `[displayFormat]` input property to display dates in custom formats
  - Supports format strings like "MM/DD/YYYY hh:mm A"
  - Works with date adapters (date-fns, dayjs, luxon) or built-in simple formatter
  - Supports common format tokens: YYYY, MM, DD, hh, mm, A, etc.
  - Resolves [#31](https://github.com/NGXSMK/ngxsmk-datepicker/issues/31)

### Fixed
- **Time Selection Dropdowns**: Fixed visibility issues with time selection dropdowns
  - Dropdowns now properly display and are not clipped by parent containers
  - Improved z-index handling for time selection dropdowns
  - Removed unnecessary scrollbars from datepicker wrapper
  - Fixed overflow and positioning issues in time selection context
  - Resolves [#32](https://github.com/NGXSMK/ngxsmk-datepicker/issues/32)
- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20 where field input is optional
  - Resolves [#33](https://github.com/NGXSMK/ngxsmk-datepicker/issues/33)

## [1.9.3] - 2025-11-13 (Stable)

### Changed
- **Major Version Release**: Updated to version 1.9.3
- **Stable Release**: Version 1.9.3 is the current stable version

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

## [1.9.2] - 2025-11-12

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

## [1.9.1] - 2025-11-11

### Fixed
- Minor bug fixes and improvements

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

