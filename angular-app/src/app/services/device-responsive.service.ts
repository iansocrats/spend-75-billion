import { Injectable, signal, computed, NgZone } from '@angular/core';

export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
export type PreviewDeviceMode = 'auto' | 'mobile' | 'tablet' | 'desktop';

@Injectable({
  providedIn: 'root',
})
export class DeviceResponsiveService {
  readonly viewportWidth = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  readonly viewportHeight = signal<number>(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  readonly previewMode = signal<PreviewDeviceMode>('auto');
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly activeActId = signal<string>('premise');

  readonly breakpoint = computed<DeviceBreakpoint>(() => {
    const mode = this.previewMode();
    if (mode === 'mobile') return 'mobile';
    if (mode === 'tablet') return 'tablet';
    if (mode === 'desktop') return 'desktop';

    const w = this.viewportWidth();
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    if (w < 1536) return 'desktop';
    return 'ultrawide';
  });

  readonly isMobile = computed(() => this.breakpoint() === 'mobile');
  readonly isTabletOrBelow = computed(
    () => this.breakpoint() === 'mobile' || this.breakpoint() === 'tablet'
  );

  constructor(private zone: NgZone) {
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'resize',
        () => {
          this.zone.run(() => {
            this.viewportWidth.set(window.innerWidth);
            this.viewportHeight.set(window.innerHeight);
            if (window.innerWidth >= 1024 && this.mobileMenuOpen()) {
              this.mobileMenuOpen.set(false);
            }
          });
        },
        { passive: true }
      );
    }
  }

  setPreviewMode(mode: PreviewDeviceMode): void {
    this.previewMode.set(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-device-preview', mode);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
