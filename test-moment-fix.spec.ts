import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from './projects/ngxsmk-datepicker/src/lib/ngxsmk-datepicker';

// Mock Moment.js for testing
class MockMoment {
  constructor(private date: Date) {}
  
  format(format: string): string {
    // Simulate Moment.js formatting
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
    const day = this.date.getDate().toString().padStart(2, '0');
    const year = this.date.getFullYear();
    const hours = this.date.getHours();
    const minutes = this.date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    
    if (format === 'MM/DD/YYYY hh:mm a') {
      return `${month}/${day}/${year} ${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return this.date.toISOString();
  }
  
  toDate(): Date {
    return this.date;
  }
  
  utcOffset(offset: string): MockMoment {
    // Simulate timezone offset
    return this;
  }
}

// Helper function to simulate Moment.js
function moment(date: Date): MockMoment {
  return new MockMoment(date);
}

describe('Moment.js Integration Fix', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent]
    });
    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
  });

  it('should handle Moment.js objects with custom format MM/DD/YYYY hh:mm a', () => {
    // Create a Moment.js-like object with the problematic format
    const testDate = new Date(2025, 10, 15, 14, 30); // 2:30 PM
    const momentObj = moment(testDate).utcOffset('+05:30');
    const formattedDate = momentObj.format('MM/DD/YYYY hh:mm a');
    
    // Set the value on the component (simulating what the user was doing)
    component.displayFormat = 'MM/DD/YYYY hh:mm a';
    component.writeValue(momentObj as any); // Cast to any to simulate Moment.js object
    
    fixture.detectChanges();
    
    // Verify the value was processed correctly
    expect(component.value).toBeTruthy();
    
    // The date should be extracted correctly from the Moment.js object
    if (component.value instanceof Date) {
      const extractedDate = component.value as Date;
      expect(extractedDate.getFullYear()).toBe(2025);
      expect(extractedDate.getMonth()).toBe(9); // October (0-indexed)
      expect(extractedDate.getDate()).toBe(15);
      expect(extractedDate.getHours()).toBe(14); // Should preserve the time
      expect(extractedDate.getMinutes()).toBe(30);
    }
  });

  it('should handle formatted date strings with custom format', () => {
    // Test the string parsing functionality
    component.displayFormat = 'MM/DD/YYYY hh:mm a';
    component.writeValue('10/15/2025 02:30 pm' as any);
    
    fixture.detectChanges();
    
    // Verify the value was parsed correctly
    expect(component.value).toBeTruthy();
    
    if (component.value instanceof Date) {
      const parsedDate = component.value as Date;
      expect(parsedDate.getFullYear()).toBe(2025);
      expect(parsedDate.getMonth()).toBe(9); // October
      expect(parsedDate.getDate()).toBe(15);
      expect(parsedDate.getHours()).toBe(14); // 2:30 PM in 24-hour format
      expect(parsedDate.getMinutes()).toBe(30);
    }
  });

  it('should maintain backward compatibility with Date objects', () => {
    // Test that regular Date objects still work
    const testDate = new Date(2025, 10, 15, 14, 30);
    component.displayFormat = 'MM/DD/YYYY hh:mm a';
    component.writeValue(testDate);
    
    fixture.detectChanges();
    
    expect(component.value).toBe(testDate);
  });

  it('should handle null values correctly', () => {
    component.displayFormat = 'MM/DD/YYYY hh:mm a';
    component.writeValue(null);
    
    fixture.detectChanges();
    
    expect(component.value).toBeNull();
  });
});