import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from './ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next month when the next button is clicked', () => {
    const initialMonth = component.currentDate.getMonth();
    const nextButton = fixture.debugElement.queryAll(By.css('.nav-buttons ion-button'))[1].nativeElement;
    nextButton.click();
    fixture.detectChanges();

    const newMonth = component.currentDate.getMonth();
    const expectedMonth = (initialMonth + 1) % 12;
    
    expect(newMonth).toBe(expectedMonth);
  });

  it('should select a single date and emit the dateChange event', () => {
    spyOn(component.dateChange, 'emit');
    component.mode = 'single';
    
    const day15 = fixture.debugElement.queryAll(By.css('.day-cell'))
      .find(cell => cell.nativeElement.textContent.trim() === '15');
    
    expect(day15).withContext('Could not find the cell for day 15').toBeTruthy();
    
    day15!.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedDate?.getDate()).toBe(15);
    expect(component.dateChange.emit).toHaveBeenCalled();
    const emittedDate = (component.dateChange.emit as jasmine.Spy).calls.mostRecent().args[0] as Date;
    expect(emittedDate.getDate()).toBe(15);
  });

  it('should apply the ".disabled" class to dates before minDate', () => {
    const today = new Date();
    component.minDate = new Date(today.getFullYear(), today.getMonth(), 15);
    fixture.detectChanges();

    const day10 = fixture.debugElement.queryAll(By.css('.day-cell'))
      .find(cell => cell.nativeElement.textContent.trim() === '10');

    expect(day10).withContext('Could not find the cell for day 10').toBeTruthy();
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

    expect(component.dateChange.emit).not.toHaveBeenCalled();
  });
});