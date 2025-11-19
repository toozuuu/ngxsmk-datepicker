import { Injectable, Renderer2, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AriaLiveService implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private liveRegion: HTMLElement | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.isBrowser) {
      return;
    }

    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;

      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  private createLiveRegion(): void {
    if (!this.isBrowser) {
      return;
    }

    this.liveRegion = this.renderer.createElement('div');
    this.renderer.setAttribute(this.liveRegion, 'aria-live', 'polite');
    this.renderer.setAttribute(this.liveRegion, 'aria-atomic', 'true');
    this.renderer.setStyle(this.liveRegion, 'position', 'absolute');
    this.renderer.setStyle(this.liveRegion, 'left', '-10000px');
    this.renderer.setStyle(this.liveRegion, 'width', '1px');
    this.renderer.setStyle(this.liveRegion, 'height', '1px');
    this.renderer.setStyle(this.liveRegion, 'overflow', 'hidden');
    this.renderer.setAttribute(this.liveRegion, 'class', 'ngxsmk-aria-live-region');
    this.renderer.appendChild(document.body, this.liveRegion);
  }

  ngOnDestroy(): void {
    if (this.liveRegion && this.isBrowser) {
      this.renderer.removeChild(document.body, this.liveRegion);
      this.liveRegion = null;
    }
  }

  destroy(): void {
    this.ngOnDestroy();
  }
}

