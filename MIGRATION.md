# Migration Guide

This document provides migration instructions for upgrading between major versions of ngxsmk-datepicker.

## Table of Contents

- [v1.9.0 → v2.0.0](#v190---v200) (Future)
- [v1.8.0 → v1.9.0](#v180---v190)
- [v1.7.0 → v1.8.0](#v170---v180)

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
| 1.9.0+ | 17-21 | 18+ |
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
- v2.0.0: Removed

