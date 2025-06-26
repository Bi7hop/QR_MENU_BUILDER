import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { MenuCategory, MenuItem } from '../../models/menu.models';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-builder.component.html',
  styleUrl: './menu-builder.component.scss'
})
export class MenuBuilderComponent implements OnInit {
  public menuService = inject(MenuService);

  ngOnInit() {
    // Komponente initialisiert
  }

  menuCategories() {
    return this.menuService.menuCategories();
  }

  addCategory() {
    this.menuService.addCategory();
  }

  updateCategory(categoryId: number, updates: Partial<MenuCategory>) {
    this.menuService.updateCategory(categoryId, updates);
  }

  removeCategory(categoryId: number) {
    this.menuService.removeCategory(categoryId);
  }

  addItem(categoryId: number) {
    this.menuService.addItem(categoryId);
  }

  updateItem(categoryId: number, itemId: number, updates: Partial<MenuItem>) {
    this.menuService.updateItem(categoryId, itemId, updates);
  }

  removeItem(categoryId: number, itemId: number) {
    this.menuService.removeItem(categoryId, itemId);
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