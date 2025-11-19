import { Injectable, ElementRef, OnDestroy } from '@angular/core';

@Injectable()
export class FocusTrapService implements OnDestroy {
  private activeTraps = new Set<ElementRef<HTMLElement>>();
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  trapFocus(elementRef: ElementRef<HTMLElement>): () => void {
    if (!elementRef?.nativeElement) {
      return () => {};
    }

    this.activeTraps.add(elementRef);
    const element = elementRef.nativeElement;
    const firstFocusable = this.getFirstFocusable(element);
    const lastFocusable = this.getLastFocusable(element);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          if (lastFocusable) {
            lastFocusable.focus();
          }
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    if (firstFocusable) {
      firstFocusable.focus();
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      this.activeTraps.delete(elementRef);
    };
  }

  private getFirstFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      element.querySelectorAll(this.focusableSelectors)
    ) as HTMLElement[];

    return focusableElements.find(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }) || null;
  }

  private getLastFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      element.querySelectorAll(this.focusableSelectors)
    ) as HTMLElement[];

    return focusableElements
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .pop() || null;
  }

  ngOnDestroy(): void {
    this.activeTraps.clear();
  }
}

