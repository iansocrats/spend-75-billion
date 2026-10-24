import {
  Component,
  AfterViewInit,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceResponsiveService } from './services/device-responsive.service';

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
    >
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
}
