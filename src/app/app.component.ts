import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Lucide Icons
import { LucideAngularModule, QrCode, Edit3, Eye, Settings, Coffee, Paintbrush } from 'lucide-angular';

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
  template: `
    <div [class]="'min-h-screen bg-gradient-to-br transition-all duration-1000 ' + currentTheme().bg">
      <!-- Futuristic Header -->
      <header class="backdrop-blur-2xl bg-black/20 border-b border-white/10 shadow-2xl sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="relative">
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all duration-300 hover:scale-110"
                  [style.backgroundColor]="currentTheme().primary"
                  [style.borderColor]="currentTheme().secondary"
                  [style.boxShadow]="'0 0 30px ' + currentTheme().primary + '40'"
                >
                  <lucide-icon name="qr-code" class="w-7 h-7 text-black"></lucide-icon>
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 [class]="'text-3xl font-black tracking-tight ' + currentTheme().text">
                  MENU<span [style.color]="currentTheme().primary">FORGE</span>
                </h1>
                <p class="text-sm text-gray-300">Next-Gen Digital Menu Creator</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                *ngFor="let view of views"
                (click)="activeView.set(view.id)"
                [class]="getViewButtonClass(view.id)"
                [style.backgroundColor]="activeView() === view.id ? currentTheme().primary : 'transparent'"
                [style.boxShadow]="activeView() === view.id ? '0 0 30px ' + currentTheme().primary + '40' : 'none'"
              >
                <lucide-icon [name]="view.icon" class="w-5 h-5"></lucide-icon>
                <span>{{ view.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Builder View -->
        <div *ngIf="activeView() === 'builder'" class="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div class="xl:col-span-1">
            <app-design-customizer></app-design-customizer>
          </div>
          <div class="xl:col-span-3">
            <app-menu-builder></app-menu-builder>
          </div>
        </div>

        <!-- Preview View -->
        <div *ngIf="activeView() === 'preview'" class="flex justify-center">
          <app-menu-preview></app-menu-preview>
        </div>

        <!-- QR Generator View -->
        <div *ngIf="activeView() === 'qr'">
          <app-qr-generator></app-qr-generator>
        </div>
      </div>

      <!-- Floating Action Button -->
      <div *ngIf="activeView() === 'builder'" class="fixed bottom-8 right-8 z-50">
        <button
          (click)="togglePreviewMode()"
          class="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          [style.backgroundColor]="currentTheme().primary"
          [style.boxShadow]="'0 0 40px ' + currentTheme().primary + '60'"
        >
          <lucide-icon [name]="isPreviewMode() ? 'edit-3' : 'eye'" class="w-8 h-8 text-black"></lucide-icon>
        </button>
      </div>
    </div>
  `,
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