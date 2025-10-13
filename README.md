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

* **Date & Time Selection**: Supports `single` date or `range` mode selection, including optional time inputs.
* **12h/24h Time Support**: Uses internal 24-hour timekeeping but displays a user-friendly **12-hour clock with AM/PM toggle**.
* **Dynamic Time Intervals**: Configure minute selection steps (e.g., 5, 15, 30 minutes) using the `minuteInterval` input.
* **Time Restriction**: Time controls are validated against `minDate` to prevent selecting times in the past for the current day.
* **Predefined Date Ranges**: Offers quick selection of common ranges (e.g., "Last 7 Days").
* **Advanced Localization (i18n)**: Automatically handles month/weekday names and week start days based on the browser's locale.
* **Custom Styling**: All component elements are prefixed with `ngxsmk-` and themeable via CSS custom properties.
* **Rounded Range Borders**: Visually highlights the selected date range with rounded start/end cells.
* **Flexible Inputs**: Accepts native `Date` objects for initialization.

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
        'This Month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() \+ 1, 0)],    
      };  
      
      // Example for disabling weekends    
      isWeekend = (date: Date): boolean => {    
        const day = date.getDay();    
        return day === 0 || day === 6; // Sunday or Saturday    
      };  
      
      onDateChange(value: Date | { start: Date; end: Date }) {    
        console.log('Date changed:', value);    
      }    
    }  

#### **2\. Add it to Your Template**

Use the \<ngxsmk-datepicker\> selector in your HTML template.

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
      (valueChange)="onDateChange($event)"    
    ></ngxsmk-datepicker>  

## **⚙️ API Reference**

### **Inputs**

| Property       | Type                                       | Default            | Description                                                                                                   |  
|:---------------|:-------------------------------------------|:-------------------|:--------------------------------------------------------------------------------------------------------------|  
| mode           | 'single'                                   | 'range'            | 'single'                                                                                                      |  
| locale         | string                                     | navigator.language | Sets the locale for language and regional formatting (e.g., 'en-US', 'de-DE').                                |  
| theme          | 'light'                                    | 'dark'             | 'light'                                                                                                       |  
| showRanges     | boolean                                    | true               | If true, displays the predefined ranges panel when in 'range' mode.                                           |  
| minDate        | DateInput                                  | null               | null                                                                                                          | The earliest selectable date. Accepts Date, string, moment, or dayjs objects. |  
| maxDate        | DateInput                                  | null               | null                                                                                                          | The latest selectable date. Accepts Date, string, moment, or dayjs objects. |  
| isInvalidDate  | (date: Date) \=\> boolean                  | () \=\> false      | A function to programmatically disable specific dates. Returns true if the date should be disabled.           |  
| ranges         | DateRange                                  | null               | null                                                                                                          | An object of predefined date ranges. The key is the label, and the value is a \[start, end\] tuple. |  
| minuteInterval | number                                     | 1                  | Interval for minute dropdown options (e.g., 5, 15, 30). Used for option generation and initial time rounding. |
| showTime       | boolean                                    | false              | Enables the hour/minute/AM/PM selection section.                                                              |
| value          | Date \| { start: Date; end: Date } \| null | null               | The initial selected date or date range.                                                                      |

### **Outputs**

| Event       | Payload                            | Description                                            |  
|:------------|:-----------------------------------|:-------------------------------------------------------|  
| valueChange | Date \| { start: Date; end: Date } | Emits the newly selected, time-adjusted date or range. |

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

The locale input controls all internationalization. It automatically formats month names, weekday names, and sets the first day of the week.

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
