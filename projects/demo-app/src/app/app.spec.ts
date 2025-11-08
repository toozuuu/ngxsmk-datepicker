import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the form group', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.datepickerForm).toBeTruthy();
    expect(app.datepickerForm.get('singleDate')).toBeTruthy();
  });

  it('should have form controls defined', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.datepickerForm).toBeTruthy();
    expect(app.datepickerForm.get('singleDate')).toBeTruthy();
    expect(app.datepickerForm.get('singleDate2')).toBeTruthy();
    expect(app.datepickerForm.get('inlineRange')).toBeTruthy();
    expect(app.datepickerForm.get('rangeWithTime')).toBeTruthy();
    expect(app.datepickerForm.get('multipleDates')).toBeTruthy();
  });

  it('should have programmatic date properties', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.programmaticSingleDate).toBeDefined();
    expect(app.programmaticRange).toBeDefined();
    expect(app.programmaticMultipleDates).toBeDefined();
  });
});
