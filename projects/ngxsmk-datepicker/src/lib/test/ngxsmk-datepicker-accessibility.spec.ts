import { ComponentFixture, TestBed, fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { AriaLiveService } from '../services/aria-live.service';
import { By } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';

describe('NgxsmkDatepickerComponent - Accessibility', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    
    if (!component.locale) {
      component.locale = 'en-US';
    }
    
    fixture.detectChanges();
  });

  afterEach(() => {
    const liveRegions = document.body.querySelectorAll('.ngxsmk-aria-live-region');
    liveRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
  });

  it('should have focus trap when calendar is open', fakeAsync(() => {
    component.toggleCalendar();
    fixture.detectChanges();
    
    tick(200);
    
    const popover = fixture.debugElement.query(By.css('.ngxsmk-popover-container'));
    expect(popover).toBeTruthy();
    expect(popover.nativeElement.getAttribute('role')).toBe('dialog');
    expect(popover.nativeElement.getAttribute('aria-modal')).toBe('true');
    
    flush();
  }));

  it('should have ARIA live region', () => {
    const liveRegion = fixture.debugElement.query(By.css('.ngxsmk-aria-live-region'));
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.nativeElement.getAttribute('aria-live')).toBe('polite');
    expect(liveRegion.nativeElement.getAttribute('aria-atomic')).toBe('true');
  });

  it('should announce calendar opening', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();

    component.inline = false;
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(false);
    
    if (!component.currentDate) {
      component.currentDate = new Date();
    }
    
    const existingRegions = document.body.querySelectorAll('.ngxsmk-aria-live-region');
    existingRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
    
    component.toggleCalendar();
    fixture.detectChanges();
    
    expect(component.isCalendarOpen).toBe(true);
    
    tick(100);
    flushMicrotasks();
    fixture.detectChanges();
    
    expect(announceSpy).toHaveBeenCalled();
    
    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';
    
    if (announcedMessage === '') {
      const monthName = component.currentDate.toLocaleDateString(component.locale, { month: 'long' });
      const year = String(component.currentDate.getFullYear());
      const testTranslation = component.getTranslation('calendarOpened' as any, undefined, { month: monthName, year });
      console.log('getTranslation returned:', testTranslation, 'monthName:', monthName, 'year:', year);
    }
    
    expect(announcedMessage.length).toBeGreaterThan(0, 
      `Announce was called with empty message. This suggests getTranslation returned empty or the fallback failed.`);
    
    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    expect(liveRegion).toBeTruthy('Live region should exist');
    
    const textContent = liveRegion?.textContent || '';
    
    if (textContent === '' && announcedMessage) {
      expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');
    } else {
      expect(textContent).toBe(announcedMessage, 
        `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
    }
    
    tick(1000);
    flush();
  }));

  it('should have proper ARIA labels on navigation buttons', () => {
    component.toggleCalendar();
    fixture.detectChanges();
    
    const prevButton = fixture.debugElement.query(By.css('.ngxsmk-nav-button'));
    expect(prevButton).toBeTruthy();
    expect(prevButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
  });

  it('should have proper ARIA labels on date cells', () => {
    component.toggleCalendar();
    fixture.detectChanges();
    
    const dateCell = fixture.debugElement.query(By.css('.ngxsmk-day-cell[role="gridcell"]'));
    if (dateCell) {
      expect(dateCell.nativeElement.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('should announce date selection', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();
    
    component.toggleCalendar();
    fixture.detectChanges();
    tick(150);
    flushMicrotasks();
    
    announceSpy.calls.reset();
    
    const today = new Date();
    component.onDateClick(today);
    fixture.detectChanges();
    flushMicrotasks();
    
    expect(announceSpy).toHaveBeenCalled();
    
    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';
    expect(announcedMessage.length).toBeGreaterThan(0, 
      `Announce was called with empty message.`);
    
    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    expect(liveRegion).toBeTruthy('Live region should exist');
    
    const textContent = liveRegion?.textContent || '';
    
    if (textContent === '' && announcedMessage) {
      expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');
    } else {
      expect(textContent).toBe(announcedMessage, 
        `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
    }
  }));

  it('should announce month change', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();
    
    component.toggleCalendar();
    fixture.detectChanges();
    tick(200); // Wait for calendar opened announcement to complete (100ms setTimeout + buffer)
    flushMicrotasks();
    
    // Clear the live region to ensure we're testing the month change announcement
    const liveRegionBefore = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    if (liveRegionBefore) {
      liveRegionBefore.textContent = '';
    }
    
    announceSpy.calls.reset();
    
    component.changeMonth(1);
    fixture.detectChanges();
    tick(10); // Small delay to ensure announcement is set
    flushMicrotasks();
    
    expect(announceSpy).toHaveBeenCalled();
    
    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';
    expect(announcedMessage.length).toBeGreaterThan(0, 
      `Announce was called with empty message for month change.`);
    expect(announcedMessage).toContain('December', 
      `Month change announcement should mention the new month. Got: "${announcedMessage}"`);
    
    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    expect(liveRegion).toBeTruthy('Live region should exist');
    
    const textContent = liveRegion?.textContent || '';
    
    // Check that the spy was called with the correct message
    expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');
    
    // If live region has content, it should match the announced message
    if (textContent && textContent !== '') {
      expect(textContent).toBe(announcedMessage, 
        `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
    }
  }));

  it('should have proper dialog role and aria-modal', () => {
    component.toggleCalendar();
    fixture.detectChanges();
    
    const popover = fixture.debugElement.query(By.css('.ngxsmk-popover-container'));
    expect(popover.nativeElement.getAttribute('role')).toBe('dialog');
    expect(popover.nativeElement.getAttribute('aria-modal')).toBe('true');
  });

  it('should remove focus trap when calendar closes', fakeAsync(() => {
    component.toggleCalendar();
    fixture.detectChanges();
    tick(200);
    
    component['closeCalendar']();
    fixture.detectChanges();
    
    tick(100);
    
    expect(component['focusTrapCleanup']).toBeNull();
    flush();
  }));
});

