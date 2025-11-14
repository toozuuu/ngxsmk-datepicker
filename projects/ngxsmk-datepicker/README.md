# ngxsmk-datepicker

[![npm version](https://img.shields.io/npm/v/ngxsmk-datepicker.svg)](https://www.npmjs.com/package/ngxsmk-datepicker)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red.svg)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, powerful, and fully customizable date and date-range picker component for Angular 17+ applications.

> **Stable Version**: `1.9.10` is the current stable release.

## 📷 Screenshots

<p align="left">
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/1.png" alt="Angular Single Date Selection" width="420" />
  &nbsp;&nbsp;
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/2.png" alt="Angular Date Range Selection" width="420" />
  &nbsp;&nbsp;
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/3.png" alt="Angular Date Mobile Screen Playground" width="420" />
</p>

## 🚀 Quick Start

### Installation

```bash
npm install ngxsmk-datepicker
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      placeholder="Select a date">
    </ngxsmk-datepicker>
  `
})
export class AppComponent {}
```

### Signal Forms (Angular 21+)

```typescript
import { Component, signal, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <form>
      <ngxsmk-datepicker
        [field]="myForm.date"
        mode="single">
      </ngxsmk-datepicker>
    </form>
  `
})
export class FormComponent {
  localObject = signal({ date: new Date() });
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date>()
  }));
}
```

## ✨ Key Features

- 📅 **Multiple Selection Modes**: Single, range, and multiple date selection
- 🎨 **Theming**: Built-in light and dark themes with CSS custom properties
- 🌍 **i18n Support**: Automatic localization based on browser locale
- 🌐 **Timezone Support**: Explicit timezone-aware formatting and parsing
- ⏰ **Time Selection**: Optional time inputs with 12h/24h support
- 🕐 **Time-Only Mode**: Display only time picker without calendar
- 🔄 **RTL Support**: Full right-to-left layout support for Arabic, Hebrew, and other RTL languages
- 🎯 **Signal Forms**: First-class support for Angular 21+ Signal Forms
- ⚙️ **Global Configuration**: App-wide defaults via provider (weekStart, minuteInterval, timezone, etc.)
- 🚀 **SSR Compatible**: Fully optimized for Angular Universal
- ⚡ **Zoneless**: Works with or without Zone.js
- 🎣 **Extension Points**: Comprehensive hooks system for customization
- ⌨️ **Keyboard Navigation**: Full keyboard accessibility with custom shortcuts
- 📦 **Zero Dependencies**: Standalone component, lightweight bundle (~127KB)

## 📋 Compatibility

| Angular Version | Status |
|----------------|--------|
| Angular 17-21   | ✅ Fully Supported |
| Angular 22+    | 🔄 Future Support |

**Zone.js**: Optional (zoneless apps supported)  
**SSR**: ✅ Fully compatible with Angular Universal

## 🔌 Framework Integration

### Angular Material Form Fields

```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

<mat-form-field appearance="outline">
  <mat-label>Select Date</mat-label>
  <ngxsmk-datepicker
    mode="single"
    formControlName="date">
  </ngxsmk-datepicker>
</mat-form-field>
```

### Ionic Components

```typescript
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

<ion-item>
  <ion-label position="stacked">Appointment Date</ion-label>
  <ngxsmk-datepicker
    mode="single"
    formControlName="appointmentDate">
  </ngxsmk-datepicker>
</ion-item>
```

### Plain HTML Inputs

```typescript
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

<form [formGroup]="myForm">
  <label for="birthdate">Birth Date</label>
  <ngxsmk-datepicker
    id="birthdate"
    mode="single"
    formControlName="birthdate">
  </ngxsmk-datepicker>
</form>
```

## 📚 Documentation

- **[Full Documentation](https://github.com/NGXSMK/ngxsmk-datepicker#readme)** - Complete guide with examples
- **[Live Demo](https://stackblitz.com/~/github.com/NGXSMK/ngxsmk-datepicker)** - Interactive examples
- **[GitHub Pages Demo](https://ngxsmk.github.io/ngxsmk-datepicker/)** - Modern, polished demo app with beautiful UI
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Extension Points Guide](./docs/extension-points.md)** - Customization hooks
- **[Signal Forms Guide](./docs/signal-forms.md)** - Angular 21+ integration
- **[SSR Guide](./docs/ssr.md)** - Server-side rendering setup
- **[SSR Example](./docs/SSR-EXAMPLE.md)** - Complete Angular Universal example
- **[Theme Tokens Reference](./docs/THEME-TOKENS.md)** - CSS custom properties reference

## 🎯 Common Use Cases

### Date Range Selection

```html
<ngxsmk-datepicker
  mode="range"
  [showTime]="true"
  [ranges]="dateRanges">
</ngxsmk-datepicker>
```

### Disabled Dates

```html
<ngxsmk-datepicker
  mode="single"
  [disabledDates]="['10/21/2025', '08/21/2025']">
</ngxsmk-datepicker>
```

### Time-Only Picker

```html
<ngxsmk-datepicker
  mode="single"
  [timeOnly]="true"
  [minuteInterval]="15"
  placeholder="Select time">
</ngxsmk-datepicker>
```

### Custom Styling

```html
<ngxsmk-datepicker
  mode="single"
  [theme]="'dark'"
  [classes]="{
    inputGroup: 'rounded-lg border',
    dayCell: 'hover:bg-indigo-50'
  }">
</ngxsmk-datepicker>
```

## 📦 Bundle Size

- **Main Bundle**: ~127KB (source maps excluded from published package)
- **Tree-shakable**: Only import what you need
- **Zero Dependencies**: Standalone component

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/NGXSMK/ngxsmk-datepicker/issues).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sachin Dilshan**
- 📧 Email: [sachindilshan040@gmail.com](mailto:sachindilshan040@gmail.com)
- 🐙 GitHub: [@toozuuu](https://github.com/toozuuu)
- 📦 NPM: [ngxsmk-datepicker](https://www.npmjs.com/package/ngxsmk-datepicker)

## ⭐ Support

If you find this library helpful, please consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements

---

**Version**: 1.9.10  
**Last Updated**: 2025-11-15

For the latest updates and changelog, visit the [GitHub repository](https://github.com/NGXSMK/ngxsmk-datepicker).

