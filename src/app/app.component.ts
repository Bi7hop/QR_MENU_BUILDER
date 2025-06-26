import { Component, signal, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Services
import { MenuService } from './services/menu.service';
import { ThemeService } from './services/theme.service';
import { QrCodeService } from './services/qr-code.service';

// Components
import { MenuBuilderComponent } from './components/menu-builder/menu-builder.component';
import { DesignCustomizerComponent } from './components/design-customizer/design-customizer.component';
import { MenuPreviewComponent } from './components/menu-preview/menu-preview.component';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuBuilderComponent,
    DesignCustomizerComponent,
    MenuPreviewComponent,
    QrGeneratorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);
  public qrService = inject(QrCodeService);
  private cdr = inject(ChangeDetectorRef);

  activeView = signal<string>('builder');
  isPreviewMode = signal<boolean>(false);
  isInitialized = signal<boolean>(false);

  views = [
    { id: 'builder', label: 'Editor', icon: '✏️' },
    { id: 'preview', label: 'Vorschau', icon: '👁️' },
    { id: 'qr', label: 'QR-Code', icon: '📱' }
  ];

  ngOnInit() {
    const restaurant = this.menuService.restaurant();
    this.themeService.setTheme(restaurant.theme);
    
    setTimeout(() => {
      this.isInitialized.set(true);
      this.cdr.detectChanges();
    }, 100);
  }

  currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  setActiveView(viewId: string) {
    this.activeView.set(viewId);
    this.cdr.detectChanges();
  }

  togglePreviewMode() {
    this.isPreviewMode.update(current => !current);
  }
}