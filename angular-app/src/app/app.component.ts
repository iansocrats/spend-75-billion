import {
  Component,
  AfterViewInit,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DeviceResponsiveService,
  PreviewDeviceMode,
} from './services/device-responsive.service';

declare global {
  interface Window {
    initSankoreEngine?: () => void;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ng-responsive-viewport-wrapper"
      [attr.data-breakpoint]="device.breakpoint()"
      [attr.data-preview-mode]="device.previewMode()"
    >
      <!-- Angular Multi-Device Responsive Status & Preview Bar -->
      <div class="ng-device-bar">
        <div class="ng-device-bar-inner">
          <div class="ng-badge-cluster">
            <span class="ng-framework-pill">⚡ Angular 19 Signals UI</span>
            <span class="ng-viewport-readout">
              {{ device.breakpoint() | uppercase }} •
              {{ device.viewportWidth() }}×{{ device.viewportHeight() }}px
            </span>
          </div>
          <div class="ng-preview-controls" role="group" aria-label="Device Viewport Simulator">
            <span class="ng-preview-label">Device Fit:</span>
            <button
              type="button"
              class="ng-device-btn"
              [class.active]="device.previewMode() === 'auto'"
              (click)="setMode('auto')"
            >
              🔄 Auto-Fit Screen
            </button>
            <button
              type="button"
              class="ng-device-btn"
              [class.active]="device.previewMode() === 'mobile'"
              (click)="setMode('mobile')"
            >
              📱 Phone (390px)
            </button>
            <button
              type="button"
              class="ng-device-btn"
              [class.active]="device.previewMode() === 'tablet'"
              (click)="setMode('tablet')"
            >
              📟 Tablet (768px)
            </button>
            <button
              type="button"
              class="ng-device-btn"
              [class.active]="device.previewMode() === 'desktop'"
              (click)="setMode('desktop')"
            >
              💻 Desktop (100%)
            </button>
          </div>
        </div>
      </div>

      <!-- Content Projection / Main Application Frame -->
      <ng-content></ng-content>
    </div>
  `,
})
export class AppComponent implements AfterViewInit {
  readonly device = inject(DeviceResponsiveService);
  readonly currentTheme = signal<'light' | 'dark'>('light');

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof window.initSankoreEngine === 'function') {
      window.initSankoreEngine();
    }
  }

  setMode(mode: PreviewDeviceMode): void {
    this.device.setPreviewMode(mode);
  }
}
