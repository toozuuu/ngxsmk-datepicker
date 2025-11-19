# Migration Guide

This document provides migration instructions for upgrading between major versions of ngxsmk-datepicker.

## Table of Contents

- [v1.9.12 → v1.9.13](#v1912---v1913)
- [v1.9.11 → v1.9.12](#v1911---v1912)
- [v1.9.10 → v1.9.11](#v1910---v1911)
- [v1.9.9 → v1.9.10](#v199---v1910)
- [v1.9.8 → v1.9.9](#v198---v199)
- [v1.9.7 → v1.9.8](#v197---v198)
- [v1.9.6 → v1.9.7](#v196---v197)
- [v1.9.5 → v1.9.6](#v195---v196)
- [v1.9.4 → v1.9.5](#v194---v195)
- [v1.9.3 → v1.9.4](#v193---v194)
- [v1.9.2 → v1.9.3](#v192---v193)
- [v1.9.1 → v1.9.2](#v191---v192)
- [v1.9.0 → v1.9.1](#v190---v191)
- [v1.8.0 → v1.9.0](#v180---v190)
- [v1.9.0 → v2.0.0](#v190---v200) (Future)
- [v1.7.0 → v1.8.0](#v170---v180)

## v1.9.12 → v1.9.13

### Fixed

- **valueChange Event Bug**: Fixed issue where `(valueChange)` event was emitting `null` instead of the date value for range mode when using template-driven forms with `[(ngModel)]`
- **Range Mode Date Selection**: Fixed issue where dates became disabled/unclickable after navigating to previous or next months in range mode
- **Moment.js Object Handling**: Fixed issue where Moment.js objects in range values and arrays were not being properly normalized and converted to Date objects

### Changed

- **Version Update**: Updated to version 1.9.13
- **Stable Release**: Version 1.9.13 is the current stable version

### Migration Steps

No migration steps required. This is a patch version with bug fixes only. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.13
```

All fixes are backward compatible and require no code changes.

## v1.9.11 → v1.9.12

### Changed

- **Version Update**: Updated to version 1.9.12
- **Stable Release**: Version 1.9.12 is the current stable version

### Migration Steps

No code changes required. This is a minor version update with backward compatibility:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.12
   ```

2. Rebuild your application:
   ```bash
   npm run build
   ```

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

**Note**: This version maintains full backward compatibility with v1.9.11. All existing code will continue to work without modifications.

## v1.9.10 → v1.9.11

### Fixed

- **Moment.js Integration**: Fixed critical issue where Moment.js objects with custom date formats would not populate correctly
  - Added support for Moment.js objects via `.toDate()` method
  - Enhanced format token parsing (YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A)
  - Improved TypeScript compatibility with dynamic object properties

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.11
   ```

2. If you're using Moment.js with custom formats, the datepicker will now properly handle Moment.js objects.

## v1.9.9 → v1.9.10

### Fixed

- **Async Database Value Loading**: Enhanced datepicker to properly handle database values that load asynchronously
  - Added fallback sync mechanisms for async database loads
  - Extended sync duration to 30 seconds with 100ms check intervals
- **TypeScript Compilation Error**: Fixed `EffectRef` type error when using Angular 17+ `effect()` API
- **Test Configuration**: Fixed test configuration for Angular 17+ compatibility

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.10
   ```

2. If you're experiencing issues with database values not populating, this version should resolve them.

## v1.9.8 → v1.9.9

### Fixed

- **Database Value Population**: Fixed critical issue where datepicker would not populate with values from database when using `[field]` input binding
  - Now properly handles Date objects, string dates, range objects, and arrays of dates

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.9
   ```

## v1.9.7 → v1.9.8

### Fixed

- **Date Selection Reset Issue**: Fixed critical bug where selected dates would reset to today's date when using `[field]` input binding
  - Fixed date mutation issues
  - Added internal update flag to prevent value resets

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.8
   ```

## v1.9.6 → v1.9.7

### Fixed

- **Calendar Population**: Fixed critical issue where datepicker calendar would not populate with dates when opened
  - Fixed issue when multiple datepickers were present in the same form

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.7
   ```

## v1.9.5 → v1.9.6

### Fixed

- **Multiple Datepicker Management**: Fixed issue where multiple datepickers in the same form would open in the same centered location
- **Outside Click Detection**: Improved click detection to properly close datepicker
- **Auto-close Other Datepickers**: When opening a datepicker, all other open datepickers are now automatically closed
- **Mobile Datepicker**: Fixed issues with mobile datepicker opening and closing
- **Select Box Cursor**: Added pointer cursor to all select boxes

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.6
   ```

## v1.9.4 → v1.9.5

### Fixed

- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.5
   ```

2. If you were experiencing TypeScript errors with Signal Forms in Angular 21+, they should now be resolved.

## v1.9.3 → v1.9.4

### Added

- **Custom Date Format**: New `[displayFormat]` input property to display dates in custom formats
  - Supports format strings like "MM/DD/YYYY hh:mm A"
  - Works with date adapters (date-fns, dayjs, luxon) or built-in simple formatter
  - Supports common format tokens: YYYY, MM, DD, hh, mm, A, etc.

### Fixed

- **Time Selection Dropdowns**: Fixed visibility issues with time selection dropdowns
  - Dropdowns now properly display and are not clipped by parent containers
  - Improved z-index handling for time selection dropdowns

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.4
   ```

2. **Optional**: Use the new `[displayFormat]` input for custom date formatting:
   ```html
   <ngxsmk-datepicker
     [displayFormat]="'MM/DD/YYYY hh:mm A'"
     mode="single">
   </ngxsmk-datepicker>
   ```

## v1.9.2 → v1.9.3

### Added

- **Time-Only Picker**: New `[timeOnly]` input property to display only time selection without calendar
  - Hides calendar grid and shows only time controls (hour, minute, AM/PM)
  - Automatically enables `showTime` when `timeOnly` is true
  - Perfect for time selection scenarios where date is not needed

### Fixed

- **Test Suite**: Fixed 25+ failing tests across multiple test files
  - All 353 tests now pass successfully

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.3
   ```

2. **Optional**: Use the new `[timeOnly]` input for time-only selection:
   ```html
   <ngxsmk-datepicker
     [timeOnly]="true"
     placeholder="Select Time">
   </ngxsmk-datepicker>
   ```

## v1.9.1 → v1.9.2

### Changed

- **Bundle Optimization**: Optimized bundle size with improved TypeScript compiler settings
  - Main bundle: ~127KB (source maps excluded from published package)
  - Enhanced tree-shaking with optimized imports and compiler options
  - Source maps automatically removed from production builds

### Fixed

- Test suite configuration improvements
- Bundle analysis now correctly excludes source maps
- Build warnings from conflicting export conditions resolved

### Migration Steps

No code changes required. This is a transparent update with optimizations:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.2
   ```

2. Rebuild your application to benefit from bundle optimizations:
   ```bash
   npm run build
   ```

## v1.9.0 → v1.9.1

### New Features

*No new features in v1.9.1.*

### Changes

#### Bundle Optimization

The library bundle has been further optimized for production:

- **Bundle Size**: Main bundle is now ~127KB (source maps excluded from published package)
- **TypeScript Compiler**: Enhanced settings for better tree-shaking
  - Added `importsNotUsedAsValues: "remove"` for smaller output
  - Disabled `preserveConstEnums` for better inlining
- **Source Maps**: Automatically removed from production builds (saves ~127KB)
- **Package Configuration**: Fixed exports to eliminate build warnings

**For Developers:**
- Use `npm run build:optimized` for production builds
- Use `npm run build:analyze` to check bundle size
- Source maps are automatically excluded from the published package

#### Build Process Improvements

- Source maps are now automatically removed from production builds
- Improved build scripts with better error handling
- Enhanced bundle analysis that correctly excludes source maps

#### Package Configuration

- Fixed `package.json` exports to eliminate build warnings
- Optimized `files` array to exclude unnecessary files
- Updated exports field for better module resolution

#### Test Configuration

- Added Zone.js polyfills to library test configuration
- Updated test commands to explicitly target library project
- Improved test reliability across Angular versions

### Breaking Changes

None in v1.9.1.

### Deprecations

None in v1.9.1.

### Migration Steps

No code changes required. This is a transparent update with optimizations and bug fixes:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.1
   ```

2. Rebuild your application:
   ```bash
   npm run build
   ```

3. Verify bundle size improvements (optional):
   - Check your application's bundle size
   - You should see improved tree-shaking benefits

4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

**Note**: If you're a library developer using ngxsmk-datepicker as a dependency, you may notice:
- Smaller bundle sizes in your application
- Fewer build warnings related to package exports
- Improved test reliability if you're running tests with Zone.js

## v1.8.0 → v1.9.0

### New Features

#### Extension Points & Hooks

Added comprehensive hook system for customization.

**New Input:**
```typescript
hooks: DatepickerHooks | null = null;
```

**Usage:**
```typescript
const myHooks: DatepickerHooks = {
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    return isHoliday ? ['custom-holiday'] : [];
  },
  validateDate: (date, currentValue, mode) => {
    return date.getDay() !== 0; // Disable Sundays
  }
};
```

```html
<ngxsmk-datepicker [hooks]="myHooks"></ngxsmk-datepicker>
```

#### Enhanced Keyboard Shortcuts

New keyboard shortcuts:
- `Y`: Select yesterday
- `N`: Select tomorrow
- `W`: Select next week

#### Animation Optimizations

All animations now use GPU acceleration for better performance. No code changes required.

#### Bundle Optimization

The library bundle has been optimized for production:
- **Bundle Size**: Main bundle is now ~127KB (source maps excluded from published package)
- **Tree-Shaking**: Enhanced with optimized TypeScript compiler settings
- **Source Maps**: Automatically removed from production builds (saves ~127KB)
- **No Breaking Changes**: All optimizations are transparent to end users

**For Developers:**
- Use `npm run build:optimized` for production builds
- Use `npm run build:analyze` to check bundle size
- Source maps are automatically excluded from the published package

### Breaking Changes

None in v1.9.0.

### Deprecations

None in v1.9.0.

## v1.7.0 → v1.8.0

### New Features

#### Signal Forms Support

Added `[field]` input for Angular 21+ Signal Forms integration.

**Before:**
```typescript
// Using Reactive Forms
dateControl = new FormControl<DatepickerValue>(null);
```

```html
<ngxsmk-datepicker formControlName="date"></ngxsmk-datepicker>
```

**After (Optional - Reactive Forms still work):**
```typescript
// Using Signal Forms
localObject = signal({ date: null as DatepickerValue });
myForm = form(this.localObject, objectSchema({
  date: objectSchema<DatepickerValue>()
}));
```

```html
<ngxsmk-datepicker [field]="myForm.date"></ngxsmk-datepicker>
```

#### SSR Optimizations

The datepicker is now fully SSR-compatible. No code changes required, but ensure you're using the latest version for SSR applications.

#### Improved Value Input

The `[value]` input now initializes immediately when set programmatically.

**Before:**
```typescript
// Value might not initialize immediately
component.value = new Date();
```

**After:**
```typescript
// Value initializes immediately
component.value = new Date();
```

### Breaking Changes

None in v1.8.0.

### Deprecations

None in v1.8.0.

## v1.9.0 → v2.0.0

### Planned Breaking Changes

*This section will be updated when v2.0.0 is released.*

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^2.0.0
   ```

2. Review breaking changes below
3. Update your code according to migration steps
4. Run tests
5. Update any custom styles if CSS classes changed

## General Migration Tips

### 1. Read the Changelog

Always check `CHANGELOG.md` for detailed changes in each version.

### 2. Test Thoroughly

After upgrading:
- Test all datepicker instances in your app
- Verify form integration still works
- Check SSR compatibility if applicable
- Test keyboard navigation
- Verify accessibility features

### 3. Update Dependencies

Ensure your Angular version is compatible:
- Check the compatibility table in README.md
- Update Angular if needed

### 4. Check TypeScript Errors

New versions may have stricter types:
```bash
npm run build
# Fix any TypeScript errors
```

### 5. Review CSS Changes

If you've customized styles:
- Check if CSS class names changed
- Review CSS custom properties
- Update selectors if needed

## Getting Help

If you encounter issues during migration:

1. Check existing GitHub issues
2. Review the documentation
3. Open a new issue with:
   - Your current version
   - Target version
   - Error messages
   - Code examples

## Version Compatibility

| ngxsmk-datepicker | Angular | Node.js |
|-------------------|---------|---------|
| 1.9.13+ | 17-21 | 18+ |
| 1.9.11 | 17-21 | 18+ |
| 1.9.10 | 17-21 | 18+ |
| 1.9.9 | 17-21 | 18+ |
| 1.9.8 | 17-21 | 18+ |
| 1.9.7 | 17-21 | 18+ |
| 1.9.6 | 17-21 | 18+ |
| 1.9.5 | 17-21 | 18+ |
| 1.9.4 | 17-21 | 18+ |
| 1.9.3 | 17-21 | 18+ |
| 1.9.2 | 17-21 | 18+ |
| 1.9.1 | 17-21 | 18+ |
| 1.9.0 | 17-21 | 18+ |
| 1.8.0 | 17-21 | 18+ |
| 1.7.0 | 17-20 | 18+ |

## Deprecation Timeline

When APIs are deprecated:

1. **Deprecation Notice**: API marked with `@deprecated` JSDoc
2. **Warning Period**: Deprecated API remains functional for at least one major version
3. **Removal**: Deprecated API removed in next major version

Example:
- v1.8.0: API deprecated
- v1.9.0: Still works with deprecation warning
- v1.9.1: Still works with deprecation warning
- v2.0.0: Removed

