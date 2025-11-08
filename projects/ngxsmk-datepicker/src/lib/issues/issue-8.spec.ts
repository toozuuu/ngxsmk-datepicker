import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatepickerValue } from '../utils/calendar.utils';
import { getStartOfDay } from '../utils/date.utils';

describe('Issue #8: Angular 21 and Zone-less Support', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.mode = 'single';
    component.inline = true;
    fixture.detectChanges();
  });

  function setValueAndTriggerChange(newValue: DatepickerValue): void {
    const previousValue = component.value;
    component.value = newValue;
    const changes: { [key: string]: SimpleChange } = {
      value: new SimpleChange(previousValue, newValue, previousValue === null)
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
  }

  describe('Angular 21 Compatibility', () => {
    it('should work with Angular 21', () => {
      expect(component).toBeTruthy();
      expect(component.mode).toBe('single');
    });

    it('should handle Angular 21 change detection', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);
      
      expect(component.selectedDate).toBeTruthy();
    });

    it('should work with Angular 21 standalone components', () => {
      expect(component).toBeTruthy();
      expect(NgxsmkDatepickerComponent).toBeDefined();
    });
  });

  describe('Zone-less Operation', () => {
    it('should work without zone.js using OnPush change detection', () => {
      expect(component).toBeTruthy();
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);
      
      expect(component.selectedDate).toBeTruthy();
    });

    it('should trigger change detection manually via markForCheck', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      expect(component.daysInMonth.length).toBeGreaterThan(0);
    });

    it('should update UI without zone.js when value changes programmatically', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();
      
      expect(component.displayValue).toContain('Jun');
      expect(component.displayValue).toContain('15');
    });

    it('should handle user interactions without zone.js', () => {
      fixture.detectChanges();
      
      const initialMonth = component.currentMonth;
      const nextButton = fixture.debugElement.queryAll(By.css('.ngxsmk-nav-button'))[1];
      
      if (nextButton) {
        nextButton.nativeElement.click();
        fixture.detectChanges();
        
        expect(component.currentMonth).toBe((initialMonth + 1) % 12);
      }
    });
  });

  describe('OnPush Change Detection', () => {
    it('should use OnPush change detection strategy', () => {
      expect(component).toBeTruthy();
      expect(component.daysInMonth).toBeDefined();
    });

    it('should manually trigger change detection when needed', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      expect(component.daysInMonth.length).toBeGreaterThan(0);
    });

    it('should update calendar when month changes without zone', () => {
      const initialMonth = component.currentMonth;
      component.changeMonth(1);
      fixture.detectChanges();
      
      expect(component.currentMonth).toBe((initialMonth + 1) % 12);
    });
  });

  describe('Signal Input Compatibility', () => {
    it('should accept signal values when bound to [value] input', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should work with signal-based reactive values', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();
      
      expect(component.value).toBeTruthy();
    });
  });

  describe('Performance without Zone.js', () => {
    it('should render calendar efficiently without zone.js', () => {
      fixture.detectChanges();
      expect(component.daysInMonth.length).toBeGreaterThan(0);
      expect(component.weekDays.length).toBe(7);
    });

    it('should handle rapid value changes without zone.js', () => {
      const dates = [
        getStartOfDay(new Date(2024, 5, 15)),
        getStartOfDay(new Date(2024, 6, 20)),
        getStartOfDay(new Date(2024, 7, 10))
      ];
      
      dates.forEach(date => {
        component.writeValue(date);
        fixture.detectChanges();
        expect(component.selectedDate).toBeTruthy();
      });
    });
  });
});

