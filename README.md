# **ngxsmk-datepicker**

ngxsmk-datepicker – A modern, powerful, and fully customizable date and date-range picker component designed for Angular 17+ and Ionic applications. Seamlessly integrates with both frameworks, offering a flexible, mobile-friendly UI and advanced features to enhance date selection experiences in your apps.

* NPM: [https://github.com/toozuuu/ngxsmk-datepicker](https://www.npmjs.com/package/ngxsmk-datepicker)

Built with Angular Signals for optimal performance and a clean, declarative API. The component is standalone and has zero dependencies, making it lightweight and easy to integrate into any project.

## Screenshots

<p align="left">
  <img src="https://github.com/toozuuu/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/1.png" alt="Angular Advanced Date Range Picker" width="420" />
  &nbsp;&nbsp;
  <img src="https://github.com/toozuuu/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/2.png" alt="Angular Localization" width="420" />
  &nbsp;&nbsp;
  <img src="https://github.com/toozuuu/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/3.png" alt="Angular Single Date Selection" width="420" />
</p>

## **✨ Features**

* **Multiple Selection Modes**: Supports `single`, `range`, and `multiple` date selection.
* **Inline and Popover Display**: Can be rendered inline or as a popover with automatic mode detection.
* **Light and Dark Themes**: Includes built-in support for light and dark modes.
* **Date & Time Selection**: Supports optional time inputs with configurable minute intervals.
* **12h/24h Time Support**: Uses internal 24-hour timekeeping but displays a user-friendly **12-hour clock with AM/PM toggle**.
* **Predefined Date Ranges**: Offers quick selection of common ranges (e.g., "Last 7 Days").
* **Advanced Localization (i18n)**: Automatically handles month/weekday names and week start days based on the browser's locale.
* **Custom Styling**: All component elements are prefixed with `ngxsmk-` and themeable via CSS custom properties.
* **Zero Dependencies**: The component is standalone and lightweight.

## **🚀 Installation**

Install the package using npm:

    npm install ngxsmk-datepicker  

## **Usage**

ngxsmk-datepicker is a standalone component, so you can import it directly into your component or module.

#### **1. Import the Component**

In your component file (e.g., app.component.ts), import NgxsmkDatepickerComponent.

    import { Component } from '@angular/core';    
    import { NgxsmkDatepickerComponent, DateRange } from 'ngxsmk-datepicker';  
      
    @Component({    
      selector: 'app-root',    
      standalone: true,    
      imports: [NgxsmkDatepickerComponent],    
      templateUrl: './app.component.html',    
    })    
    export class AppComponent {    
      // Example for predefined ranges    
      public myRanges: DateRange = {    
        'Today': [new Date(), new Date()],    
        'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],    
        'This Month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],    
      };  
      
      // Example for disabling weekends    
      isWeekend = (date: Date): boolean => {    
        const day = date.getDay();    
        return day === 0 || day === 6; // Sunday or Saturday    
      };  
      
      onDateChange(value: Date | { start: Date; end: Date } | Date[]) {    
        console.log('Date changed:', value);    
      }    
    }  

#### **2. Add it to Your Template**

Use the `<ngxsmk-datepicker>` selector in your HTML template.

<!-- app.component.html -->

    <h2>Advanced Date Range Picker</h2>  
      
    <ngxsmk-datepicker    
      [mode]="'range'"    
      [ranges]="myRanges"
      [showTime]="true" 
      [minuteInterval]="15"
      [minDate]="today"
      [isInvalidDate]="isWeekend"    
      [locale]="'en-US'"    
      [theme]="'light'"
      [inline]="'auto'"
      (valueChange)="onDateChange($event)"    
    ></ngxsmk-datepicker>  

## **⚙️ API Reference**

### **Inputs**

| Property       | Type                                               | Default               | Description                                                                                                   |  
|:---------------|:---------------------------------------------------|:----------------------|:--------------------------------------------------------------------------------------------------------------|  
| mode           | 'single' \| 'range' \| 'multiple'                  | 'single'              | The selection mode.                                                                                           |
| inline         | boolean \| 'always' \| 'auto'                      | false                 | Controls the display mode. `true` or `'always'` for inline, `'auto'` for responsive.                          |
| locale         | string                                             | navigator.language    | Sets the locale for language and regional formatting (e.g., 'en-US', 'de-DE').                                |  
| theme          | 'light' \| 'dark'                                  | 'light'               | The color theme.                                                                                              |
| showRanges     | boolean                                            | true                  | If true, displays the predefined ranges panel when in 'range' mode.                                           |  
| minDate        | DateInput                                          | null                  | The earliest selectable date.                                                                                 |
| maxDate        | DateInput                                          | null                  | The latest selectable date.                                                                                   |
| isInvalidDate  | (date: Date) => boolean                            | () => false           | A function to programmatically disable specific dates.                                                        |
| ranges         | DateRange                                          | null                  | An object of predefined date ranges.                                                                          |
| minuteInterval | number                                             | 1                     | Interval for minute dropdown options.                                                                         |
| showTime       | boolean                                            | false                 | Enables the hour/minute/AM/PM selection section.                                                              |
| value          | DatepickerValue                                    | null                  | The initial selected date, date range, or array of dates.                                                     |
| startAt        | DateInput                                          | null                  | The date to initially center the calendar view on.                                                            |

### **Outputs**

| Event       | Payload                                            | Description                                                      |  
|:------------|:---------------------------------------------------|:-----------------------------------------------------------------|  
| valueChange | DatepickerValue                                    | Emits the newly selected date, range, or array of dates.         |
| action      | { type: string; payload?: any }                    | Emits various events like `dateSelected`, `timeChanged`, etc.    |

## **🎨 Theming**

You can easily customize the colors of the datepicker by overriding the CSS custom properties in your own stylesheet.

    ngxsmk-datepicker {    
      --datepicker-primary-color: #d9267d;      /* Main color for selected dates */    
      --datepicker-primary-contrast: #ffffff;  /* Text color on selected dates */    
      --datepicker-range-background: #fce7f3;  /* Background for the date range bar */    
    }  

To enable the dark theme, simply bind the theme input:

<ngxsmk-datepicker [theme]="'dark'"></ngxsmk-datepicker>

## **🌍 Localization**

The `locale` input controls all internationalization. It automatically formats month names, weekday names, and sets the first day of the week.

<!-- Renders the calendar in German -->    
<ngxsmk-datepicker [locale]="'de-DE'"></ngxsmk-datepicker>

<!-- Renders the calendar in French -->    
<ngxsmk-datepicker [locale]="'fr-FR'"></ngxsmk-datepicker>

## **🤝 Contributions**

We welcome and appreciate contributions from the community! Whether it's reporting a bug, suggesting a new feature, or submitting code, your help is valuable.

Forking and Development

* Fork the ngxsmk-datepicker repository on GitHub.

* Clone your fork to your local machine.

* Install dependencies and run the demo app to begin development.

* Create a new feature branch for your specific changes.

* Commit your changes following standard practices.

* Submit a Pull Request (PR) to the main branch of the original repository.

## **📜 License**

MIT