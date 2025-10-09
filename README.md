# **ngxsmk-datepicker**

A powerful, modern, and highly customizable date range picker component for Angular 17+ applications.

* Repository (GitHub): https://github.com/toozuuu/ngxsmk-datepicker
* Live Demo (StackBlitz): https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datepicker

Built with Angular Signals for optimal performance and a clean, declarative API. The component is standalone and has zero dependencies, making it lightweight and easy to integrate into any project.

## Screenshots

<p align="left">
  <img src="https://unpkg.com/ngxsmk-datepicker@latest/docs/1.png" alt="Angular Advanced Date Range Picker" width="420" />
  &nbsp;&nbsp;
  <img src="https://unpkg.com/ngxsmk-datepicker@latest/docs/2.png" alt="Angular Localization" width="420" />
  &nbsp;&nbsp;
  <img src="https://unpkg.com/ngxsmk-datepicker@latest/docs/3.png" alt="Angular Single Date Selection" width="420" />
</p>


## **✨ Features**

* **Single Date or Date Range Selection**: Configure the picker for single or range modes.
* **Predefined Date Ranges**: Provide a list of common ranges (e.g., "Last 7 Days," "This Month") for one-click selection.
* **Advanced Localization (i18n)**: Automatically displays month/weekday names and week start days based on the browser's locale or a provided locale string.
* **Light & Dark Themes**: Includes a beautiful dark mode, controllable via an input.
* **Highly Customizable**: Themeable with CSS custom properties to match your application's design.
* **Date Disabling**: Easily disable dates via minDate, maxDate, or a custom function (e.g., to disable weekends).
* **Modern UI**: Features custom dropdowns for month/year selection and smooth animations.
* **Flexible Inputs**: Accepts native Date objects, strings, moment, or dayjs objects as inputs.
* **Built for Angular 17+**: Uses modern features like standalone components and signals.

## **🚀 Installation**

Install the package using npm:

    npm install ngxsmk-datepicker  

## **Usage**

ngxsmk-datepicker is a standalone component, so you can import it directly into your component or module.

#### **1\. Import the Component**

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
      [isInvalidDate]="isWeekend"    
      [locale]="'en-US'"    
      [theme]="'light'"    
      (valueChange)="onDateChange($event)"    
    ></ngxsmk-datepicker\>  

## **⚙️ API Reference**

### **Inputs**

| Property      | Type                      | Default            | Description                                                                                         |  
|:--------------|:--------------------------|:-------------------|:----------------------------------------------------------------------------------------------------|  
| mode          | 'single'                  | 'range'            | 'single'                                                                                            |  
| locale        | string                    | navigator.language | Sets the locale for language and regional formatting (e.g., 'en-US', 'de-DE').                      |  
| theme         | 'light'                   | 'dark'             | 'light'                                                                                             |  
| showRanges    | boolean                   | true               | If true, displays the predefined ranges panel when in 'range' mode.                                 |  
| minDate       | DateInput                 | null               | null                                                                                                | The earliest selectable date. Accepts Date, string, moment, or dayjs objects. |  
| maxDate       | DateInput                 | null               | null                                                                                                | The latest selectable date. Accepts Date, string, moment, or dayjs objects. |  
| isInvalidDate | (date: Date) \=\> boolean | () \=\> false      | A function to programmatically disable specific dates. Returns true if the date should be disabled. |  
| ranges        | DateRange                 | null               | null                                                                                                | An object of predefined date ranges. The key is the label, and the value is a \[start, end\] tuple. |  

### **Outputs**

| Event       | Payload | Description                |  
|:------------|:--------|:---------------------------|  
| valueChange | Date    | { start: Date; end: Date } |  

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
