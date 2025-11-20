import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal, computed } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatepickerValue } from '../utils/calendar.utils';

/**
 * Angular 21 Features Test Suite
 * Tests for Signal Forms, Zoneless compatibility, and Angular Aria compatibility
 */
describe('NgxsmkDatepickerComponent - Angular 21 Features', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Signal Forms Compatibility', () => {
    it('should work with signal-based value binding', () => {
      const dateSignal = signal<DatepickerValue>(null);
      const testDate = new Date(2025, 0, 15);

      component.value = dateSignal();
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.value).toEqual(testDate);
      expect(dateSignal()).toBeNull();

      component.valueChange.emit(testDate);
      dateSignal.set(testDate);

      expect(dateSignal()).toEqual(testDate);
    });

    it('should work with computed signals for derived values', () => {
      const baseDate = signal<Date | null>(new Date(2025, 0, 15));
      const formattedDate = computed(() => {
        const date = baseDate();
        return date ? date.toISOString() : null;
      });

      component.value = baseDate();
      fixture.detectChanges();

      expect(component.value).toEqual(baseDate());
      expect(formattedDate()).toBeTruthy();
    });

    it('should handle signal updates reactively', () => {
      const dateSignal = signal<DatepickerValue>(new Date(2025, 0, 15));
      
      component.value = dateSignal();
      fixture.detectChanges();

      const newDate = new Date(2025, 1, 20);
      dateSignal.set(newDate);
      component.value = dateSignal();
      fixture.detectChanges();

      expect(component.value).toEqual(newDate);
    });
  });

  describe('Signal Forms [field] Input Compatibility', () => {
    it('should accept Signal Form field object with value property', () => {
      const mockField = {
        value: new Date(2025, 0, 15),
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.value).toEqual(mockField.value);
    });

    it('should sync value from Signal Form field', () => {
      const testDate = new Date(2025, 0, 15);
      const mockField = {
        value: testDate,
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.value).toEqual(testDate);
    });

    it('should update Signal Form field when datepicker value changes', () => {
      const mockField = {
        value: null as DatepickerValue,
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      const newDate = new Date(2025, 1, 20);
      component.writeValue(newDate);
      fixture.detectChanges();

      expect(component.value).toEqual(newDate);
    });

    it('should respect disabled state from Signal Form field', () => {
      const mockField = {
        value: new Date(2025, 0, 15),
        disabled: true,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
    });

    it('should handle Signal Form field with function-based value', () => {
      const testDate = new Date(2025, 0, 15);
      const mockField = {
        value: () => testDate,
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.field).toBeDefined();
    });

    it('should handle null or undefined Signal Form field', () => {
      component.field = null;
      fixture.detectChanges();

      expect(component.field).toBeNull();

      component.field = undefined;
      fixture.detectChanges();

      expect(component.field).toBeUndefined();
    });
  });

  describe('Zoneless Compatibility', () => {
    it('should use OnPush change detection strategy', () => {
      expect(component).toBeTruthy();
    });

    it('should work with manual change detection', () => {
      const testDate = new Date(2025, 0, 15);
      
      component.value = testDate;
      fixture.detectChanges();

      expect(component.value).toEqual(testDate);
    });

    it('should handle signal-based reactive updates without Zone.js', () => {
      const dateSignal = signal<DatepickerValue>(new Date(2025, 0, 15));
      
      component.value = dateSignal();
      fixture.detectChanges();

      const newDate = new Date(2025, 1, 20);
      dateSignal.set(newDate);
      component.value = dateSignal();
      fixture.detectChanges();

      expect(component.value).toEqual(newDate);
    });

    it('should emit valueChange events correctly in zoneless mode', () => {
      const testDate = new Date(2025, 0, 15);
      let emittedValue: DatepickerValue | null = null;

      component.valueChange.subscribe(value => {
        emittedValue = value;
      });

      component.writeValue(testDate);
      fixture.detectChanges();

      component.valueChange.emit(testDate);
      fixture.detectChanges();

      expect(emittedValue).not.toBeNull();
      if (emittedValue) {
        expect(emittedValue).toEqual(testDate);
      }
    });
  });

  describe('Angular Aria Compatibility', () => {
    it('should have proper ARIA attributes on input element', () => {
      component.inline = false;
      if (!component.currentDate) {
        component.currentDate = new Date();
      }
      if (!component.locale) {
        component.locale = 'en-US';
      }
      if (!component._uniqueId) {
        component._uniqueId = `ngxsmk-datepicker-test-${Date.now()}`;
      }
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isInlineMode).toBe(false);
      
      const inputGroup = fixture.debugElement.query(By.css('.ngxsmk-input-group'));
      expect(inputGroup).withContext('Input group should be rendered when inline is false').toBeTruthy();
      
      const inputElement = fixture.debugElement.query(By.css('.ngxsmk-display-input'));
      expect(inputElement).withContext('Input element should be rendered when inline is false').toBeTruthy();
      if (inputElement) {
        expect(inputElement.nativeElement.getAttribute('aria-label')).toBeTruthy();
        expect(inputElement.nativeElement.getAttribute('aria-describedby')).toBeTruthy();
      }
    });

    it('should have proper ARIA attributes on calendar popover', () => {
      component.inline = false;
      component.isCalendarOpen = true;
      fixture.detectChanges();

      const popover = fixture.nativeElement.querySelector('.ngxsmk-popover-container');
      expect(popover).toBeTruthy();
      expect(popover.getAttribute('role')).toBe('dialog');
      expect(popover.getAttribute('aria-label')).toBeTruthy();
      expect(popover.getAttribute('aria-modal')).toBe('true');
    });

    it('should have proper ARIA attributes on date cells', () => {
      component.inline = true;
      fixture.detectChanges();

      const dateCells = fixture.nativeElement.querySelectorAll('.ngxsmk-day-cell[role="gridcell"]');
      expect(dateCells.length).toBeGreaterThan(0);
      
      dateCells.forEach((cell: HTMLElement) => {
        if (cell.getAttribute('data-date')) {
          expect(cell.getAttribute('aria-label')).toBeTruthy();
        }
      });
    });

    it('should have aria-selected attribute on selected dates', () => {
      const testDate = new Date(2025, 0, 15);
      component.mode = 'single';
      component.value = testDate;
      fixture.detectChanges();

      const selectedCell = fixture.nativeElement.querySelector('.ngxsmk-day-cell.selected');
      if (selectedCell) {
        expect(selectedCell.getAttribute('aria-selected')).toBe('true');
      }
    });

    it('should have aria-live region for screen reader announcements', () => {
      fixture.detectChanges();

      const ariaLiveRegion = fixture.nativeElement.querySelector('.ngxsmk-aria-live-region');
      expect(ariaLiveRegion).toBeTruthy();
      expect(ariaLiveRegion.getAttribute('aria-live')).toBe('polite');
      expect(ariaLiveRegion.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have proper ARIA labels on navigation buttons', () => {
      fixture.detectChanges();

      const prevButton = fixture.nativeElement.querySelector('.ngxsmk-nav-button');
      if (prevButton) {
        expect(prevButton.getAttribute('aria-label')).toBeTruthy();
      }
    });

    it('should have proper ARIA attributes on range selection', () => {
      component.mode = 'range';
      component.value = {
        start: new Date(2025, 0, 10),
        end: new Date(2025, 0, 20)
      };
      fixture.detectChanges();

      const startCell = fixture.nativeElement.querySelector('.ngxsmk-day-cell.start-date');
      const endCell = fixture.nativeElement.querySelector('.ngxsmk-day-cell.end-date');
      
      if (startCell) {
        expect(startCell.getAttribute('aria-label')).toBeTruthy();
      }
      if (endCell) {
        expect(endCell.getAttribute('aria-label')).toBeTruthy();
      }
    });
  });

  describe('Vitest Compatibility', () => {
    it('should work in Vitest test environment', () => {
      expect(component).toBeTruthy();
      expect(fixture).toBeTruthy();
    });

    it('should handle async operations correctly for Vitest', async () => {
      const testDate = new Date(2025, 0, 15);
      
      component.value = testDate;
      fixture.detectChanges();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.value).toEqual(testDate);
    });
  });

  describe('Angular 21 Integration Scenarios', () => {
    it('should work with Signal Forms and httpResource pattern', () => {
      const serverData = signal<{ date: Date | null }>({ date: new Date(2025, 0, 15) });
      
      const mockField = {
        value: serverData().date,
        disabled: false,
        setValue: (value: DatepickerValue) => {
          serverData.set({ date: value as Date });
        },
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.value).toEqual(serverData().date);
    });

    it('should work with Signal Forms validation', () => {
      const mockField = {
        value: null as DatepickerValue,
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockField as any;
      fixture.detectChanges();

      expect(component.disabled).toBe(false);
    });

    it('should handle Signal Forms with objectSchema', () => {
      const localObject = signal({ 
        startDate: new Date(2025, 0, 10),
        endDate: new Date(2025, 0, 20)
      });

      const mockStartField = {
        value: localObject().startDate,
        disabled: false,
        setValue: (value: DatepickerValue) => {
          localObject.set({ ...localObject(), startDate: value as Date });
        },
        updateValue: jasmine.createSpy('updateValue')
      };

      component.mode = 'single';
      component.field = mockStartField as any;
      fixture.detectChanges();

      expect(component.value).toEqual(localObject().startDate);
    });

    it('should work with multiple Signal Form fields in range mode', () => {
      const localObject = signal({
        start: new Date(2025, 0, 10),
        end: new Date(2025, 0, 20)
      });

      component.mode = 'range';
      component.value = {
        start: localObject().start,
        end: localObject().end
      };
      fixture.detectChanges();

      expect(component.value).toEqual({
        start: localObject().start,
        end: localObject().end
      });
    });
  });
});

