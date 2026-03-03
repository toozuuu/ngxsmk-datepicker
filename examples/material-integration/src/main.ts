import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { NgxsmkDatepickerMatFormFieldControlDirective } from './app/ngxsmk-mat-form-field.directive';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsmkDatepickerComponent,
    NgxsmkDatepickerMatFormFieldControlDirective,
    JsonPipe,
  ],
  template: `
    <div class="container">
      <h1>ngxsmk-datepicker &mdash; <small>Angular Material Integration</small></h1>
      <p>
        Reproduces and verifies the fix for
        <a href="https://github.com/NGXSMK/ngxsmk-datepicker/issues/187" target="_blank">Issue #187</a>.
      </p>
      <p>
        Add the <code>ngxsmkMatFormFieldControl</code> directive to the datepicker so that
        <code>mat-form-field</code> finds it via <code>@ContentChild(MatFormFieldControl)</code>.
      </p>

      <form [formGroup]="myForm">
        <!-- Test 1: Outline appearance -->
        <mat-form-field appearance="outline">
          <mat-label>Select Date (outline)</mat-label>
          <ngxsmk-datepicker ngxsmkMatFormFieldControl mode="single" formControlName="date" placeholder="Choose a date">
          </ngxsmk-datepicker>
          <mat-hint>Click to open calendar</mat-hint>
        </mat-form-field>

        <!-- Test 2: Fill appearance -->
        <mat-form-field appearance="fill" style="margin-top: 24px;">
          <mat-label>Date Range (fill)</mat-label>
          <ngxsmk-datepicker
            ngxsmkMatFormFieldControl
            mode="range"
            formControlName="dateRange"
            placeholder="Choose a date range"
          >
          </ngxsmk-datepicker>
          <mat-hint>Supports range selection</mat-hint>
        </mat-form-field>

        <!-- Test 3: With required validator -->
        <mat-form-field appearance="outline" style="margin-top: 24px;">
          <mat-label>Required Date</mat-label>
          <ngxsmk-datepicker
            ngxsmkMatFormFieldControl
            mode="single"
            formControlName="requiredDate"
            placeholder="Select a date"
          >
          </ngxsmk-datepicker>
          @if (myForm.get('requiredDate')?.invalid && myForm.get('requiredDate')?.touched) {
            <mat-error>Date is required</mat-error>
          }
        </mat-form-field>

        <div class="form-values">
          <strong>Form Values:</strong>
          <pre>{{ myForm.value | json }}</pre>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 24px;
        font-family: Roboto, sans-serif;
      }
      h1 {
        margin-bottom: 8px;
      }
      p {
        color: #555;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      mat-form-field {
        width: 100%;
        display: block;
      }
      .form-values {
        margin-top: 24px;
        background: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
      }
      pre {
        margin: 8px 0 0;
        font-size: 13px;
      }
    `,
  ],
})
export class App {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null),
    dateRange: new FormControl<[Date, Date] | null>(null),
    requiredDate: new FormControl<Date | null>(null, Validators.required),
  });
}

bootstrapApplication(App).catch((err: unknown) => console.error(err));
