import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { MenuCategory, MenuItem, Restaurant } from '../../models/menu.models';

@Component({
  selector: 'app-menu-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss'
})
export class MenuPreviewComponent implements OnInit {
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);

  ngOnInit() {
    // Komponente initialisiert
  }

  restaurant(): Restaurant {
    return this.menuService.restaurant();
  }

  menuCategories() {
    return this.menuService.menuCategories();
  }

  currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  getTotalItems(): number {
    return this.menuCategories().reduce((total, category) => total + category.items.length, 0);
  }

  trackByCategory(index: number, category: MenuCategory): number {
    return category.id;
  }

  trackByItem(index: number, item: MenuItem): number {
    return item.id;
  }
}