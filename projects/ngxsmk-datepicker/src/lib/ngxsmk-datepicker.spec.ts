import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from './ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For a standalone component, you just import it.
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next month when the next button is clicked', () => {
    const initialMonth = component.currentDate.getMonth();
    
    // Find the "next month" button
    const nextButton = fixture.debugElement.queryAll(By.css('.nav-buttons ion-button'))[1].nativeElement;
    nextButton.click();
    fixture.detectChanges();

    const newMonth = component.currentDate.getMonth();
    // Handle the case where the month wraps from December (11) to January (0)
    const expectedMonth = (initialMonth + 1) % 12;
    
    expect(newMonth).toBe(expectedMonth);
  });

  it('should select a single date and emit the dateChange event', () => {
    // Spy on the event emitter to check if it's called
    spyOn(component.dateChange, 'emit');
    component.mode = 'single';
    
    // Find the day cell for the 15th of the month
    const day15 = fixture.debugElement.queryAll(By.css('.day-cell'))
      .find(cell => cell.nativeElement.textContent.trim() === '15');
    
    expect(day15).withContext('Could not find the cell for day 15').toBeTruthy();
    
    day15!.nativeElement.click();
    fixture.detectChanges();

    // Check that the component's selectedDate property is correct
    expect(component.selectedDate?.getDate()).toBe(15);
    
    // Check that the event was emitted with the correct date
    expect(component.dateChange.emit).toHaveBeenCalled();
    const emittedDate = (component.dateChange.emit as jasmine.Spy).calls.mostRecent().args[0] as Date;
    expect(emittedDate.getDate()).toBe(15);
  });

  it('should apply the ".disabled" class to dates before minDate', () => {
    // Set a minDate to the 15th of the current month
    const today = new Date();
    component.minDate = new Date(today.getFullYear(), today.getMonth(), 15);
    fixture.detectChanges();

    // Find a date that should now be disabled (e.g., the 10th)
    const day10 = fixture.debugElement.queryAll(By.css('.day-cell'))
      .find(cell => cell.nativeElement.textContent.trim() === '10');

    expect(day10).withContext('Could not find the cell for day 10').toBeTruthy();
    // Check if it has the 'disabled' CSS class
    expect(day10!.nativeElement.classList).toContain('disabled');
  });

  it('should NOT emit a dateChange event when a disabled date is clicked', () => {
    spyOn(component.dateChange, 'emit');
    
    const today = new Date();
    component.minDate = new Date(today.getFullYear(), today.getMonth(), 15);
    fixture.detectChanges();

    const day10 = fixture.debugElement.queryAll(By.css('.day-cell'))
      .find(cell => cell.nativeElement.textContent.trim() === '10');

    day10!.nativeElement.click();
    fixture.detectChanges();

    // The key check: ensure the event was NOT called
    expect(component.dateChange.emit).not.toHaveBeenCalled();
  });
});