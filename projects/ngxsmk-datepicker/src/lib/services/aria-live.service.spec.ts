import { TestBed } from '@angular/core/testing';
import { AriaLiveService } from './aria-live.service';
import { PLATFORM_ID, Renderer2 } from '@angular/core';

describe('AriaLiveService', () => {
  let service: AriaLiveService;
  let rendererMock: jasmine.SpyObj<Renderer2>;
  let createdElement: HTMLElement;

  beforeEach(() => {
    rendererMock = jasmine.createSpyObj('Renderer2', ['createElement', 'setAttribute', 'setStyle', 'appendChild', 'removeChild']);
    
    createdElement = document.createElement('div');
    rendererMock.createElement.and.returnValue(createdElement);

    TestBed.configureTestingModule({
      providers: [
        AriaLiveService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Renderer2, useValue: rendererMock }
      ]
    });
    
    service = TestBed.inject(AriaLiveService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should announce messages', () => {
    const message = 'Test announcement';
    service.announce(message);
    
    expect(rendererMock.createElement).toHaveBeenCalledWith('div');
    expect(rendererMock.appendChild).toHaveBeenCalled();
    expect(createdElement.textContent).toBe(message);
  });

  it('should support assertive priority', () => {
    service.announce('Urgent message', 'assertive');
    
    expect(createdElement.getAttribute('aria-live')).toBe('assertive');
  });

  it('should clear message after timeout', (done) => {
    service.announce('Temporary message');
    expect(createdElement.textContent).toBe('Temporary message');
    
    setTimeout(() => {
      expect(createdElement.textContent).toBe('');
      done();
    }, 1100);
  });

  it('should destroy live region', () => {
    service.announce('Test');
    service.ngOnDestroy();
    
    expect(rendererMock.removeChild).toHaveBeenCalled();
  });
});

