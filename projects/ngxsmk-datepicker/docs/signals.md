# Signals Integration Guide

ngxsmk-datepicker is fully compatible with Angular Signals, providing seamless integration with both traditional reactive forms and modern signal-based patterns.

## Basic Signal Binding

### Using Writable Signals

The simplest way to use signals is with a writable signal and two-way binding:

```typescript
import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [value]="selectedDate()"
      (valueChange)="selectedDate.set($event)">
    </ngxsmk-datepicker>
    
    <p>Selected: {{ selectedDate() | json }}</p>
  `
})
export class ExampleComponent {
  selectedDate = signal<DatepickerValue>(null);
}
```

### Using Computed Signals

You can derive values from signals:

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  // ...
})
export class ExampleComponent {
  selectedDate = signal<DatepickerValue>(null);
  
  // Computed value based on selected date
  formattedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return 'No date selected';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return 'Invalid date';
  });
}
```

## Signal Forms (Angular 21+)

### Using the `[field]` Input

For Angular 21+ Signal Forms, use the `[field]` input for direct integration:

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
        [field]="myForm.dateInQuestion"
        mode="single"
        placeholder="Select a date">
      </ngxsmk-datepicker>
    </form>
  `
})
export class FormComponent {
  localObject = signal({
    dateInQuestion: new Date()
  });
  
  myForm = form(this.localObject, objectSchema({
    dateInQuestion: objectSchema<Date>()
  }));
}
```

### Manual Signal Updates

If you need more control, you can manually update signals:

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  // ...
})
export class ExampleComponent {
  selectedDate = signal<DatepickerValue>(null);
  
  constructor() {
    // React to date changes
    effect(() => {
      const date = this.selectedDate();
      if (date) {
        console.log('Date changed:', date);
        // Perform side effects like API calls
      }
    });
  }
  
  onDateChange(newDate: DatepickerValue) {
    this.selectedDate.set(newDate);
    // Additional logic here
  }
}
```

## httpResource Integration

The datepicker works seamlessly with `httpResource` for server-side data:

```typescript
import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { signal, linkedSignal } from '@angular/core';

@Component({
  // ...
})
export class DataComponent {
  private http = inject(HttpClient);
  
  // Create a resource that fetches data
  resource = httpResource({
    request: () => this.http.get<{ dateInQuestion: Date }>('/api/data'),
    loader: signal(false)
  });
  
  // Link the response to a signal
  localObject = linkedSignal(() => this.resource.response.value());
  
  // Compute the date from the response
  myDate = computed(() => {
    const obj = this.localObject();
    return obj?.dateInQuestion ? new Date(obj.dateInQuestion) : null;
  });
  
  // Update the datepicker when data arrives
  updateDate(newDate: DatepickerValue) {
    // Update your resource or local signal
    this.localObject.update(obj => ({
      ...obj,
      dateInQuestion: newDate
    }));
  }
}
```

```html
<ngxsmk-datepicker
  [value]="myDate()"
  (valueChange)="updateDate($event)"
  mode="single">
</ngxsmk-datepicker>
```

## Range Selection with Signals

For date ranges, use signals with range objects:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  // ...
})
export class RangeComponent {
  dateRange = signal<{ start: Date; end: Date } | null>(null);
  
  onRangeChange(range: { start: Date; end: Date } | null) {
    this.dateRange.set(range);
  }
}
```

```html
<ngxsmk-datepicker
  mode="range"
  [value]="dateRange()"
  (valueChange)="dateRange.set($event)">
</ngxsmk-datepicker>
```

## Multiple Date Selection

For multiple date selection:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  // ...
})
export class MultipleComponent {
  selectedDates = signal<Date[]>([]);
}
```

```html
<ngxsmk-datepicker
  mode="multiple"
  [value]="selectedDates()"
  (valueChange)="selectedDates.set($event)">
</ngxsmk-datepicker>
```

## Best Practices

1. **Use `signal()` for local state**: For component-local date selection, use writable signals.

2. **Use `[field]` for forms**: When using Angular Signal Forms, prefer the `[field]` input for automatic synchronization.

3. **Use `computed()` for derived values**: Derive formatted dates, validation states, or other computed properties.

4. **Handle null values**: Always check for null/undefined when working with datepicker values.

5. **Type safety**: Use the `DatepickerValue` type for better TypeScript support:
   ```typescript
   import { DatepickerValue } from 'ngxsmk-datepicker';
   ```

## Migration from Reactive Forms

If you're migrating from Reactive Forms to Signals:

**Before (Reactive Forms):**
```typescript
dateControl = new FormControl<DatepickerValue>(null);
```

**After (Signals):**
```typescript
dateSignal = signal<DatepickerValue>(null);
```

The datepicker supports both patterns simultaneously, so you can migrate gradually.

