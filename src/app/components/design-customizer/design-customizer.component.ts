import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { MenuExportService } from '../../services/menu-export.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-design-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './design-customizer.component.html',
  styleUrl: './design-customizer.component.scss'
})
export class DesignCustomizerComponent implements OnInit {
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);
  public exportService = inject(MenuExportService);
  public appState = inject(AppStateService);
  private cdr = inject(ChangeDetectorRef);

  restaurantName = signal('');
  restaurantDescription = signal('');
  restaurantLogo = signal<string | null>(null);
  
  fonts = ['Inter', 'Poppins', 'Roboto', 'Montserrat'];
  selectedFont = signal('Inter');
  selectedTheme = signal('neon');

  // Status für UI-Feedback
  isExporting = signal<boolean>(false);
  exportSuccess = signal<boolean>(false);

  themesArray = [
    { key: 'neon', value: { name: 'Neon Cyberpunk', primary: '#00ff88', secondary: '#ff0080', accent: '#ffff00' } },
    { key: 'sunset', value: { name: 'Sonnenuntergang', primary: '#ff6b35', secondary: '#f7931e', accent: '#ffb627' } },
    { key: 'ocean', value: { name: 'Tiefer Ozean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#10b981' } },
    { key: 'forest', value: { name: 'Dunkler Wald', primary: '#22c55e', secondary: '#16a34a', accent: '#84cc16' } }
  ];

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const restaurant = this.menuService.restaurant();
    
    this.restaurantName.set(restaurant.name || 'Mein Restaurant');
    this.restaurantDescription.set(restaurant.description || 'Moderne Küche & Bar');
    this.selectedFont.set(restaurant.font || 'Inter');
    this.selectedTheme.set(restaurant.theme || 'neon');
    
    if (restaurant.logo) {
      this.restaurantLogo.set(restaurant.logo);
    }

    this.themeService.setTheme(this.selectedTheme());
    this.cdr.detectChanges();
  }

  getCurrentTheme() {
    return this.themeService.getCurrentTheme();
  }

  selectTheme(themeName: string) {
    this.selectedTheme.set(themeName);
    this.themeService.setTheme(themeName);
    this.menuService.updateRestaurant({ theme: themeName });
    this.appState.resetMenuStatus(); // Menü muss neu exportiert werden
    this.cdr.detectChanges();
  }

  updateRestaurantName(name: string) {
    this.restaurantName.set(name);
    this.menuService.updateRestaurant({ name });
    this.appState.resetMenuStatus();
  }

  updateRestaurantDescription(description: string) {
    this.restaurantDescription.set(description);
    this.menuService.updateRestaurant({ description });
    this.appState.resetMenuStatus();
  }

  updateFont(font: string) {
    this.selectedFont.set(font);
    this.menuService.updateRestaurant({ font });
    this.appState.resetMenuStatus();
  }

  removeLogo() {
    this.restaurantLogo.set(null);
    this.menuService.updateRestaurant({ logo: undefined });
    this.appState.resetMenuStatus();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.restaurantLogo.set(result);
        this.menuService.updateRestaurant({ logo: result });
        this.appState.resetMenuStatus();
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async applyChanges() {
    this.isExporting.set(true);
    this.exportSuccess.set(false);
    
    try {
      // Aktuelles Menü und Theme holen
      const restaurant = this.menuService.restaurant();
      const categories = this.menuService.menuCategories();
      const theme = this.getCurrentTheme();

      // HTML generieren
      const htmlContent = this.exportService.generateMenuHTML(restaurant, categories, theme);
      
      // Blob URL erstellen
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Global verfügbar machen
      this.appState.setMenuUrl(url);
      
      // UI-Feedback
      this.exportSuccess.set(true);
      
      // Success-Feedback nach 2 Sekunden ausblenden
      setTimeout(() => {
        this.exportSuccess.set(false);
      }, 2000);

    } catch (error) {
      // Fehlerbehandlung
    } finally {
      this.isExporting.set(false);
      this.cdr.detectChanges();
    }
  }

  trackByThemeKey(index: number, theme: any): string {
    return theme.key;
  }

  trackByFont(index: number, font: string): string {
    return font;
  }
}