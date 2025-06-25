import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Lucide Icons
import { LucideAngularModule } from 'lucide-angular';

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
    LucideAngularModule,
    MenuBuilderComponent,
    DesignCustomizerComponent,
    MenuPreviewComponent,
    QrGeneratorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeView = signal<string>('builder');
  isPreviewMode = signal<boolean>(false);

  views = [
    { id: 'builder', label: 'Builder', icon: 'edit-3' },
    { id: 'preview', label: 'Preview', icon: 'eye' },
    { id: 'qr', label: 'QR-Code', icon: 'qr-code' }
  ];

  constructor(
    public menuService: MenuService,
    public themeService: ThemeService,
    public qrService: QrCodeService
  ) {}

  currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  getViewButtonClass(viewId: string): string {
    const baseClass = 'px-6 py-3 rounded-xl font-bold transition-all duration-300 capitalize flex items-center space-x-2 ';
    return baseClass + (this.activeView() === viewId 
      ? 'text-black shadow-2xl transform scale-105'
      : this.currentTheme().text + ' hover:bg-white/10');
  }

  togglePreviewMode() {
    this.isPreviewMode.update(current => !current);
  }
}