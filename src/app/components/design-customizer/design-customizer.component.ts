import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-design-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './design-customizer.component.html',
  styleUrl: './design-customizer.component.scss'
})
export class DesignCustomizerComponent {
  public menuService = inject(MenuService);
  private themeService = inject(ThemeService);

  restaurantName = signal('VELOCITY');
  restaurantDescription = signal('Modern Fusion Kitchen');
  restaurantLogo = signal<string | null>(null);
  
  fonts = ['Inter', 'Poppins', 'Roboto', 'Montserrat'];
  selectedFont = 'Inter';
  selectedTheme = 'neon';

  // Themes als Array für einfache Iteration
  themesArray = [
    { key: 'neon', value: { name: 'Neon Cyberpunk', primary: '#00ff88', secondary: '#ff0080', accent: '#ffff00' } },
    { key: 'sunset', value: { name: 'Sunset Gradient', primary: '#ff6b35', secondary: '#f7931e', accent: '#ffb627' } },
    { key: 'ocean', value: { name: 'Deep Ocean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#10b981' } },
    { key: 'forest', value: { name: 'Forest Dark', primary: '#22c55e', secondary: '#16a34a', accent: '#84cc16' } }
  ];

  constructor() {
    const restaurant = this.menuService.restaurant();
    this.restaurantName.set(restaurant.name);
    this.restaurantDescription.set(restaurant.description);
    this.selectedFont = restaurant.font;
    this.selectedTheme = restaurant.theme;
  }

  selectTheme(themeName: string) {
    this.selectedTheme = themeName;
    this.themeService.setTheme(themeName);
    this.menuService.updateRestaurant({ theme: themeName });
  }

  updateRestaurantName(name: string) {
    this.restaurantName.set(name);
    this.menuService.updateRestaurant({ name });
  }

  updateRestaurantDescription(description: string) {
    this.restaurantDescription.set(description);
    this.menuService.updateRestaurant({ description });
  }

  updateFont(font: string) {
    this.selectedFont = font;
    this.menuService.updateRestaurant({ font });
  }

  removeLogo() {
    this.restaurantLogo.set(null);
    this.menuService.updateRestaurant({ logo: undefined });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.restaurantLogo.set(result);
        this.menuService.updateRestaurant({ logo: result });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}