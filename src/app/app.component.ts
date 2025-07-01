import { Component, signal, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Services
import { MenuService } from './services/menu.service';
import { ThemeService } from './services/theme.service';
import { QrCodeService } from './services/qr-code.service';
import { MenuExportService } from './services/menu-export.service';
import { AppStateService } from './services/app-state.service';

// Main Components
import { MenuBuilderComponent } from './components/menu-builder/menu-builder.component';
import { DesignCustomizerComponent } from './components/design-customizer/design-customizer.component';
import { MenuPreviewComponent } from './components/menu-preview/menu-preview.component';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { CartService } from './services/cart.service';

import { ImprintComponent } from './components/legal/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/legal/privacy-policy/privacy-policy.component';
import { CookieBannerComponent } from './components/legal/cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // Main Components
    MenuBuilderComponent,
    DesignCustomizerComponent,
    MenuPreviewComponent,
    QrGeneratorComponent,
    // Legal Components,
    ImprintComponent,
    PrivacyPolicyComponent,
    CookieBannerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Services
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);
  public qrService = inject(QrCodeService);
  public exportService = inject(MenuExportService);
  public appState = inject(AppStateService);
  public cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  // State Signals
  activeView = signal<string>('builder');
  isPreviewMode = signal<boolean>(false);
  isInitialized = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  
  // Modal/Overlay States
  showImprint = signal<boolean>(false);
  showPrivacy = signal<boolean>(false);
  showCookieSettings = signal<boolean>(false);
  
  // App States
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  // Cookie & Privacy States
  cookieConsentGiven = signal<boolean>(false);
  analyticsEnabled = signal<boolean>(false);
  
  // Auto-save State
  hasUnsavedChanges = signal<boolean>(false);
  lastSaveTime = signal<Date | null>(null);

  // Navigation Views
  views = [
    { id: 'builder', label: 'Editor', icon: '✏️' },
    { id: 'preview', label: 'Vorschau', icon: '👁️' },
    { id: 'qr', label: 'QR-Code', icon: '📱' }
  ];

  ngOnInit() {
    this.initializeApp();
    this.loadUserPreferences();
    this.setupAutoSave();
    this.checkCookieConsent();
  }

  // App Initialization
  private initializeApp() {
    this.isLoading.set(true);
    
    try {
      const restaurant = this.menuService.restaurant();
      this.themeService.setTheme(restaurant.theme);
      
      setTimeout(() => {
        this.isInitialized.set(true);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }, 100);
      
    } catch (error) {
      this.handleError('Fehler beim Laden der Anwendung');
    }
  }

  // Cart Button Methods
shouldShowCartButton(): boolean {
  return !this.cartService.isEmpty();
}

getCartItemCount(): number {
  return this.cartService.itemCount();
}

getCartTotal(): number {
  return this.cartService.calculateTotal(this.menuService.menuCategories());
}

goToCartInPreview(): void {
  // Signal an MenuPreview senden, zur Cart-View zu wechseln
  window.dispatchEvent(new CustomEvent('goToCart'));
}

  // User Preferences
  private loadUserPreferences() {
    const saved = localStorage.getItem('menuforge_preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        this.analyticsEnabled.set(prefs.analyticsEnabled || false);
        this.cookieConsentGiven.set(prefs.cookieConsentGiven || false);
      } catch (error) {
        // Ignore parsing errors
      }
    }
  }

  private saveUserPreferences() {
    const prefs = {
      analyticsEnabled: this.analyticsEnabled(),
      cookieConsentGiven: this.cookieConsentGiven(),
      lastSave: new Date().toISOString()
    };
    localStorage.setItem('menuforge_preferences', JSON.stringify(prefs));
  }

  // Auto-Save Functionality
  private setupAutoSave() {
    // Auto-save every 30 seconds if there are changes
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, 30000);
  }

  private autoSave() {
    try {
      // Save current menu state
      const menuData = {
        restaurant: this.menuService.restaurant(),
        categories: this.menuService.menuCategories(),
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('menuforge_autosave', JSON.stringify(menuData));
      this.hasUnsavedChanges.set(false);
      this.lastSaveTime.set(new Date());
      
    } catch (error) {
      this.handleError('Auto-Save fehlgeschlagen');
    }
  }

  // Theme Methods
  currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  // Navigation Methods
  setActiveView(viewId: string) {
    this.activeView.set(viewId);
    this.closeMobileMenu();
    this.cdr.detectChanges();
  }

  togglePreviewMode() {
    this.isPreviewMode.update(current => !current);
  }

  // Mobile Menu Methods
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(current => !current);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  // Modal Methods
  openImprint() {
    this.showImprint.set(true);
    this.closeMobileMenu();
  }

  closeImprint() {
    this.showImprint.set(false);
  }

  openPrivacy() {
    this.showPrivacy.set(true);
    this.closeMobileMenu();
  }

  closePrivacy() {
    this.showPrivacy.set(false);
  }

  openCookieSettings() {
    this.showCookieSettings.set(true);
    this.closeMobileMenu();
  }

  closeCookieSettings() {
    this.showCookieSettings.set(false);
  }

  // Cookie Methods
  private checkCookieConsent() {
    const consent = localStorage.getItem('menuforge_cookie_consent');
    if (!consent) {
      // Show cookie banner if no consent given
      setTimeout(() => {
        // Cookie banner should show automatically
      }, 2000);
    } else {
      this.cookieConsentGiven.set(true);
      const prefs = JSON.parse(consent);
      this.analyticsEnabled.set(prefs.analytics || false);
    }
  }

  acceptAllCookies() {
    this.cookieConsentGiven.set(true);
    this.analyticsEnabled.set(true);
    this.saveCookieConsent();
  }

  acceptNecessaryCookies() {
    this.cookieConsentGiven.set(true);
    this.analyticsEnabled.set(false);
    this.saveCookieConsent();
  }

  private saveCookieConsent() {
    const consent = {
      given: true,
      analytics: this.analyticsEnabled(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('menuforge_cookie_consent', JSON.stringify(consent));
    this.saveUserPreferences();
  }

  // Error Handling
  private handleError(message: string) {
    this.hasError.set(true);
    this.errorMessage.set(message);
    this.isLoading.set(false);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  clearError() {
    this.hasError.set(false);
    this.errorMessage.set('');
  }

  // Utility Methods
  getFormattedLastSave(): string {
    const lastSave = this.lastSaveTime();
    if (!lastSave) return 'Nie';
    
    const now = new Date();
    const diff = now.getTime() - lastSave.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes} Min.`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours} Std.`;
    
    return lastSave.toLocaleDateString('de-DE');
  }

  // Lifecycle Methods
  ngOnDestroy() {
    // Save any pending changes before leaving
    if (this.hasUnsavedChanges()) {
      this.autoSave();
    }
  }

  // Keyboard Shortcuts
  onKeyPress(event: KeyboardEvent) {
    // Ctrl/Cmd + S for manual save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.autoSave();
    }
    
    // Escape to close modals
    if (event.key === 'Escape') {
      this.closeMobileMenu();
      this.closeImprint();
      this.closePrivacy();
      this.closeCookieSettings();
    }
  }
}