import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { MenuService } from '../../services/menu.service';
import { MenuCategory, MenuItem } from '../../models/menu.models';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
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

  // 🆕 Drag & Drop Methods mit Container-Kontrolle
  onDragStarted(event: CdkDragStart) {
    // Versteckt das ursprüngliche Element und aktiviert Container-Begrenzung
    const container = document.querySelector('.menu-content');
    if (container) {
      container.classList.add('drag-active');
    }
    
    // Resettet Preview-Position sofort
    setTimeout(() => {
      const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
      if (preview) {
        preview.style.transform = '';
        preview.style.left = '';
        preview.style.top = '';
      }
    }, 0);
  }

  onDragEnded() {
    // Cleanup und Container zurücksetzen
    const container = document.querySelector('.menu-content');
    if (container) {
      container.classList.remove('drag-active');
    }
    document.body.classList.remove('drag-in-progress');
  }

  // Optional: Position-Constraint Funktion (falls gewünscht)
  constrainPosition = (point: any, dragRef: any, dimensions: any, pickupPosition: any) => {
    // Begrenzt Drag auf sichtbaren Bereich
    const container = document.querySelector('.menu-content');
    if (!container) return point;
    
    const containerRect = container.getBoundingClientRect();
    
    return {
      x: Math.max(containerRect.left, Math.min(point.x, containerRect.right - dimensions.width)),
      y: Math.max(containerRect.top, Math.min(point.y, containerRect.bottom - dimensions.height))
    };
  };

  dropCategory(event: CdkDragDrop<MenuCategory[]>) {
    this.menuService.dropCategory(event);
  }

  dropItem(event: CdkDragDrop<MenuItem[]>, categoryId: number) {
    this.menuService.dropItemBetweenCategories(event, categoryId);
  }

  getItemDropListId(categoryId: number): string {
    return this.menuService.getItemDropListId(categoryId);
  }

  getAllItemDropListIds(): string[] {
    return this.menuService.getAllItemDropListIds();
  }

  // Statistics Methods
  getTotalItems(): number {
    return this.menuCategories().reduce((total, category) => total + category.items.length, 0);
  }

  getTotalCategories(): number {
    return this.menuCategories().length;
  }

  trackByCategory(index: number, category: MenuCategory): number {
    return category.id;
  }

  trackByItem(index: number, item: MenuItem): number {
    return item.id;
  }
}