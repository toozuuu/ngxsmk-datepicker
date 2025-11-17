import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxsmkDatepickerModule } from 'ngxsmk-datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxsmkDatepickerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NGXSMK Datepicker Demo';
  
  // Test with Moment.js object (recommended approach)
  momentDate = signal(moment().utcOffset('+05:30'));
  
  // Test with formatted string
  stringDate = signal(moment().format('MM/DD/YYYY hh:mm a'));
  
  // Test with different format
  isoDate = signal(moment().format('YYYY-MM-DD HH:mm:ss'));
  
  // Test with 12-hour format
  hour12Date = signal(moment().format('MM/DD/YYYY hh:mm a'));
  
  // Form for datepicker values
  datepickerForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.datepickerForm = this.fb.group({
      singleDate: [null],
      momentDate: [null],
      stringDate: [null],
      isoDate: [null],
      hour12Date: [null],
      multipleDates: [null],
      rangeWithTime: [null],
      timeOnly: [null],
      customFormat: [null],
      rtlDate: [null],
      singleDate2: [null],
      inlineRange: [null]
    });
  }
  
  onMomentDateChange(newDate: Date) {
    console.log('Moment.js date changed:', newDate);
    // Convert back to Moment.js object if needed
    this.momentDate.set(moment(newDate));
    this.datepickerForm.patchValue({ momentDate: moment(newDate) });
  }
  
  onStringDateChange(newDate: Date) {
    console.log('String date changed:', newDate);
    // Convert to formatted string if needed
    this.stringDate.set(moment(newDate).format('MM/DD/YYYY hh:mm a'));
    this.datepickerForm.patchValue({ stringDate: moment(newDate) });
  }
  
  onIsoDateChange(newDate: Date) {
    console.log('ISO date changed:', newDate);
    // Convert to ISO format if needed
    this.isoDate.set(moment(newDate).format('YYYY-MM-DD HH:mm:ss'));
    this.datepickerForm.patchValue({ isoDate: moment(newDate) });
  }
  
  onHour12DateChange(newDate: Date) {
    console.log('12-hour date changed:', newDate);
    // Convert to 12-hour format if needed
    this.hour12Date.set(moment(newDate).format('MM/DD/YYYY hh:mm a'));
    this.datepickerForm.patchValue({ hour12Date: moment(newDate) });
  }
  
  onSubmit() {
    console.log('Form submitted:', this.datepickerForm.value);
  }
  
  // Methods for Moment.js Integration demo
  momentDateValue() {
    return this.momentDate();
  }
  
  onDateChange(newDate: Date) {
    console.log('Date changed:', newDate);
    this.momentDate.set(moment(newDate));
  }
  
  setMomentDate() {
    const now = moment();
    this.momentDate.set(now);
    this.datepickerForm.patchValue({ momentDate: now });
  }
  
  setFormattedMomentDate() {
    // This simulates the original issue - passing a formatted string
    const formattedDate = moment().format('MM/DD/YYYY hh:mm a');
    // The datepicker should now handle this correctly with our fix
    this.momentDate.set(moment(formattedDate, 'MM/DD/YYYY hh:mm a'));
    this.datepickerForm.patchValue({ momentDate: moment(formattedDate, 'MM/DD/YYYY hh:mm a') });
  }
  
  clearMomentDate() {
    this.momentDate.set(null);
    this.datepickerForm.patchValue({ momentDate: null });
  }
}