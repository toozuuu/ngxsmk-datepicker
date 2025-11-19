import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';

describe('NgxsmkDatepickerComponent', () => {
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next month when the next button is clicked', () => {
    component.inline = true;
    fixture.detectChanges();
    
    const initialMonth = component.currentMonth;
    const nextButton = fixture.debugElement.queryAll(By.css('.ngxsmk-nav-button'))[1];
    
    expect(nextButton).withContext('Next button not found').toBeTruthy();
    
    nextButton.nativeElement.click();
    fixture.detectChanges();

    const newMonth = component.currentMonth;
    const expectedMonth = (initialMonth + 1) % 12;
    
    expect(newMonth).toBe(expectedMonth);
  });

  it('should select a single date and emit the valueChange event', () => {
    spyOn(component.valueChange, 'emit');
    component.mode = 'single';
    component.inline = true;
    fixture.detectChanges();
    
    const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
    const day15 = dayCells.find(cell => {
      const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
      return dayNumber && dayNumber.nativeElement.textContent.trim() === '15';
    });
    
    expect(day15).withContext('Could not find the cell for day 15').toBeTruthy();
    
    if (day15 && !day15.nativeElement.classList.contains('disabled')) {
      day15.nativeElement.click();
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    }
  });

  it('should apply the ".disabled" class to dates before minDate', () => {
    component.inline = true;
    fixture.detectChanges();
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const minDate = getStartOfDay(new Date(currentYear, currentMonth, 15));
    
    const previousMinDate = component.minDate;
    component.minDate = minDate;
    const changes: { [key: string]: any } = {
      minDate: {
        previousValue: previousMinDate,
        currentValue: minDate,
        firstChange: previousMinDate === null
      }
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
    const disabledDays = dayCells.filter(cell => {
      const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
      if (!dayNumber) return false;
      const dayNum = parseInt(dayNumber.nativeElement.textContent.trim(), 10);
      const isCurrentMonth = !cell.nativeElement.classList.contains('empty');
      return isCurrentMonth && dayNum < 15 && cell.nativeElement.classList.contains('disabled');
    });

    expect(disabledDays.length).withContext('Should find at least one disabled date before minDate').toBeGreaterThan(0);
  });

  it('should NOT emit a valueChange event when a disabled date is clicked', () => {
    spyOn(component.valueChange, 'emit');
    component.inline = true;
    fixture.detectChanges();
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const minDate = getStartOfDay(new Date(currentYear, currentMonth, 15));
    
    const previousMinDate = component.minDate;
    component.minDate = minDate;
    const changes: { [key: string]: any } = {
      minDate: {
        previousValue: previousMinDate,
        currentValue: minDate,
        firstChange: previousMinDate === null
      }
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
    const disabledDays = dayCells.filter(cell => {
      const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
      if (!dayNumber) return false;
      const dayNum = parseInt(dayNumber.nativeElement.textContent.trim(), 10);
      const isCurrentMonth = !cell.nativeElement.classList.contains('empty');
      return isCurrentMonth && dayNum < 15 && cell.nativeElement.classList.contains('disabled');
    });

    expect(disabledDays.length).withContext('Should find at least one disabled date before minDate').toBeGreaterThan(0);
    
    if (disabledDays.length > 0) {
      disabledDays[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.valueChange.emit).not.toHaveBeenCalled();
    }
  });
});