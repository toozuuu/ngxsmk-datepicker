# Signal Forms Integration

This guide covers using ngxsmk-datepicker with Angular 21+ Signal Forms API.

## Overview

Angular 21 introduced Signal Forms, a new reactive forms API built on signals. The datepicker provides first-class support through the `[field]` input, enabling seamless two-way binding with signal form fields.

## Basic Signal Forms Setup

### Creating a Signal Form

```typescript
import { Component, signal, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-signal-form',
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
export class SignalFormComponent {
  // Create a signal for your form data
  localObject = signal({
    dateInQuestion: new Date(),
    name: 'John Doe'
  });
  
  // Create a signal form
  myForm = form(this.localObject, objectSchema({
    dateInQuestion: objectSchema<Date>(),
    name: objectSchema<string>()
  }));
}
```

## Server-Side Data Integration

### With httpResource

When data comes from a server, use `httpResource` with signal forms:

```typescript
import { Component, inject, signal, linkedSignal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { form, objectSchema } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-server-form',
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
export class ServerFormComponent {
  private http = inject(HttpClient);
  
  // Fetch data from server
  resource = httpResource({
    request: () => this.http.get<{ dateInQuestion: Date }>('/api/data'),
    loader: signal(false)
  });
  
  // Link the response to a signal
  localObject = linkedSignal(() => this.resource.response.value() || {
    dateInQuestion: new Date()
  });
  
  // Create form from linked signal
  myForm = form(this.localObject, objectSchema({
    dateInQuestion: objectSchema<Date>()
  }));
}
```

## Two-Way Binding

The `[field]` input provides automatic two-way binding:

```typescript
@Component({
  // ...
})
export class TwoWayComponent {
  localObject = signal({ date: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date>()
  }));
  
  // The datepicker automatically:
  // 1. Reads from myForm.date.value()
  // 2. Updates myForm.date when user selects a date
  // 3. Handles disabled state from myForm.date.disabled()
}
```

## Manual Updates

You can also manually update form values:

```typescript
@Component({
  // ...
})
export class ManualUpdateComponent {
  localObject = signal({ date: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date>()
  }));
  
  updateDate(newDate: Date) {
    // Option 1: Update the underlying signal
    this.localObject.update(obj => ({
      ...obj,
      date: newDate
    }));
    
    // Option 2: Use form field's setValue (if available)
    if (typeof this.myForm.date.setValue === 'function') {
      this.myForm.date.setValue(newDate);
    }
  }
}
```

## Alternative: Manual Binding with valueChange (Stabilized Pattern)

If you experience stability issues with the `[field]` binding, you can use manual binding with `[value]` and `(valueChange)`. This pattern directly mutates the form value, which can help prevent change detection loops:

```typescript
import { Component, signal, computed, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-stable-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      class="w-full border:none"
      [value]="myDate()"
      (valueChange)="onMyDateChange($any($event))"
      mode="single"
      placeholder="Select a date">
    </ngxsmk-datepicker>
  `
})
export class StableFormComponent {
  localObject = signal({ myDate: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date>()
  }));
  
  // Get a signal reference to the date field value
  myDate = computed(() => this.myForm.value().myDate);
  
  onMyDateChange(newDate: Date): void {
    // Directly mutate the form value object
    this.myForm.value().myDate = newDate;
  }
}
```

**Why this pattern works:**
- Direct mutation of the form value avoids creating new object references
- Prevents potential change detection loops
- More explicit control over when updates occur
- Useful when `[field]` binding causes stability issues

**Note:** The `$any($event)` cast may be needed if there's a type mismatch between `DatepickerValue` and your expected `Date` type.

**Important for server-side data:** If initial values from the server aren't populating, update the underlying `localObject` signal instead of directly mutating the form value:

```typescript
onMyDateChange(newDate: DatepickerValue | null): void {
  this.localObject.update(obj => ({
    ...obj,
    myDate: newDate instanceof Date ? newDate : new Date(newDate.toLocaleString())
  }));
}

updateFromServer(serverDate: Date | string): void {
  const dateValue = serverDate instanceof Date ? serverDate : new Date(serverDate);
  this.localObject.update(obj => ({
    ...obj,
    myDate: dateValue
  }));
}
```

## Validation

Signal Forms support validation. The datepicker respects the field's disabled state:

```typescript
import { Component, signal, form, objectSchema, validators } from '@angular/core';

@Component({
  // ...
})
export class ValidatedFormComponent {
  localObject = signal({ date: null as Date | null });
  
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date | null>({
      validators: [
        validators.required()
      ]
    })
  }));
  
  // The datepicker will automatically reflect the disabled state
  // when the field is invalid or disabled
}
```

## Date Range Forms

For date range selection:

```typescript
@Component({
  // ...
})
export class RangeFormComponent {
  localObject = signal({
    startDate: new Date(),
    endDate: new Date()
  });
  
  myForm = form(this.localObject, objectSchema({
    startDate: objectSchema<Date>(),
    endDate: objectSchema<Date>()
  }));
}
```

```html
<ngxsmk-datepicker
  [field]="myForm.startDate"
  mode="single"
  placeholder="Start date">
</ngxsmk-datepicker>

<ngxsmk-datepicker
  [field]="myForm.endDate"
  mode="single"
  placeholder="End date">
</ngxsmk-datepicker>
```

Or use a single range picker:

```typescript
localObject = signal({
  dateRange: { start: new Date(), end: new Date() } as { start: Date; end: Date } | null
});

myForm = form(this.localObject, objectSchema({
  dateRange: objectSchema<{ start: Date; end: Date } | null>()
}));
```

```html
<ngxsmk-datepicker
  [field]="myForm.dateRange"
  mode="range">
</ngxsmk-datepicker>
```

## Migration from Reactive Forms

### Before (Reactive Forms)

```typescript
import { FormGroup, FormControl } from '@angular/forms';

export class OldFormComponent {
  form = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}
```

```html
<ngxsmk-datepicker
  formControlName="date"
  mode="single">
</ngxsmk-datepicker>
```

### After (Signal Forms)

```typescript
import { signal, form, objectSchema } from '@angular/core';

export class NewFormComponent {
  localObject = signal({ date: null as Date | null });
  
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date | null>()
  }));
}
```

```html
<ngxsmk-datepicker
  [field]="myForm.date"
  mode="single">
</ngxsmk-datepicker>
```

## Benefits of Signal Forms

1. **Automatic Synchronization**: The `[field]` input automatically syncs with form state
2. **Reactive Updates**: Changes to the form field automatically update the datepicker
3. **Server Integration**: Works seamlessly with `httpResource` and `linkedSignal`
4. **Type Safety**: Full TypeScript support with proper types
5. **Performance**: Signals provide better performance than traditional reactive forms

## Troubleshooting

### Field not updating

If the field value isn't updating, ensure:
1. The field is properly initialized: `localObject = signal({ date: ... })`
2. The form is created correctly: `form(this.localObject, objectSchema({ ... }))`
3. The field reference is correct: `[field]="myForm.date"` (not `myForm().date`)

### Initial value not showing

If the initial value from the server isn't showing:

**With `[field]` binding:**
1. Ensure `localObject` is initialized with the server data
2. Use `linkedSignal` for reactive server data
3. Check that the date value is a valid Date object
4. If using readonly form, consider the manual binding pattern

**With manual `[value]` binding:**
1. Use a `computed()` signal that reads from `myForm.value().fieldName`
2. Update the underlying `localObject` signal when server data arrives (don't mutate form value directly)
3. Ensure the computed signal is properly reactive to form changes
4. Convert string dates to Date objects if your server returns strings

### Readonly form signal issues

If you're using `protected readonly form = form(...)` and controls aren't updating:

1. **Option 1**: Remove `readonly` if possible
2. **Option 2**: Use manual binding with `[value]` and `(valueChange)`, updating `localObject` instead of form directly
3. **Option 3**: Update the underlying `localObject` signal when server data arrives

### Disabled state not working

The datepicker automatically reads `field.disabled()`. If it's not working:
1. Ensure the field has a `disabled` property or function
2. Check that the form validation is set up correctly
3. When using manual binding, you may need to manually bind `[disabledState]`

