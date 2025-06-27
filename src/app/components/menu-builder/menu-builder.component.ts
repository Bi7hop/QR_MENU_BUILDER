import { Component, inject, OnInit, signal } from '@angular/core';
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
  
  // Icon Picker State
  showIconPicker = signal<number | null>(null);
  
  // Verfügbare Icons für Kategorien
  categoryIcons = [
    { emoji: '🥗', name: 'Salat' },
    { emoji: '🍖', name: 'Fleisch' },
    { emoji: '🍝', name: 'Pasta' },
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍔', name: 'Burger' },
    { emoji: '🌮', name: 'Tacos' },
    { emoji: '🍣', name: 'Sushi' },
    { emoji: '🍜', name: 'Suppe' },
    { emoji: '🥘', name: 'Eintopf' },
    { emoji: '🍰', name: 'Kuchen' },
    { emoji: '🧁', name: 'Cupcake' },
    { emoji: '🍦', name: 'Eis' },
    { emoji: '🥤', name: 'Getränke' },
    { emoji: '☕', name: 'Kaffee' },
    { emoji: '🍺', name: 'Bier' },
    { emoji: '🍷', name: 'Wein' },
    { emoji: '🥂', name: 'Sekt' },
    { emoji: '🍸', name: 'Cocktail' },
    { emoji: '🍞', name: 'Brot' },
    { emoji: '🥪', name: 'Sandwich' },
    { emoji: '🌯', name: 'Wrap' },
    { emoji: '🥙', name: 'Pita' },
    { emoji: '🍤', name: 'Garnelen' },
    { emoji: '🐟', name: 'Fisch' }
  ];

  ngOnInit() {
    // Komponente initialisiert
    // Click outside handler für Icon Picker
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.icon-picker-container')) {
        this.showIconPicker.set(null);
      }
    });
  }

  menuCategories() {
    return this.menuService.menuCategories();
  }

  addCategory() {
    this.menuService.addCategory();
    
    // Scrollt zur neuen Kategorie nach kurzer Verzögerung
    setTimeout(() => {
      this.scrollToNewCategory();
    }, 100);
  }

  private scrollToNewCategory() {
    // Findet die letzte Kategorie (die neue)
    const categories = document.querySelectorAll('[data-category-item]');
    const lastCategory = categories[categories.length - 1];
    
    if (lastCategory) {
      lastCategory.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      
      // Optional: Highlight-Effekt für die neue Kategorie
      lastCategory.classList.add('new-category-highlight');
      setTimeout(() => {
        lastCategory.classList.remove('new-category-highlight');
      }, 2000);
    }
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

  // 🆕 Icon Picker Methods
  toggleIconPicker(categoryId: number) {
    if (this.showIconPicker() === categoryId) {
      this.showIconPicker.set(null);
    } else {
      this.showIconPicker.set(categoryId);
    }
  }

  updateCategoryIcon(categoryId: number, icon: { emoji: string, name: string }) {
    const category = this.menuCategories().find(cat => cat.id === categoryId);
    if (category) {
      // Entfernt altes Icon und fügt neues hinzu
      let newName = category.category;
      
      // Entfernt existierendes Emoji (erstes Zeichen wenn es ein Emoji ist)
      if (this.isEmoji(newName.charAt(0))) {
        newName = newName.substring(1).trim();
      }
      
      // Fügt neues Icon hinzu
      const updatedName = `${icon.emoji} ${newName}`;
      this.updateCategory(categoryId, { category: updatedName });
    }
    
    // Schließt Icon Picker
    this.showIconPicker.set(null);
  }

  private isEmoji(char: string): boolean {
    // Einfache Emoji-Erkennung für die ersten Zeichen
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(char);
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