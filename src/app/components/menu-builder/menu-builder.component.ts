import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
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

  // Touch-Gesten Properties
  private touchStartY: number = 0;
  private touchStartTime: number = 0;

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

  // 🆕 Mobile Detection
  isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Prüft sowohl Bildschirmgröße als auch Touch-Unterstützung
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768; // unter 768px gilt als Mobile
    
    return isTouchDevice && isSmallScreen;
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

  // 🆕 Mobile Sortier-Methoden für Kategorien
  moveCategoryUp(currentIndex: number) {
    if (currentIndex <= 0) return;
    
    const categories = [...this.menuCategories()];
    const targetIndex = currentIndex - 1;
    
    // Tausche Positionen
    const temp = categories[currentIndex];
    categories[currentIndex] = categories[targetIndex];
    categories[targetIndex] = temp;
    
    this.menuService.reorderCategories(categories);
    
    // Feedback für User
    this.showSortFeedback('Kategorie nach oben verschoben');
    
    // Scroll und Highlight
    setTimeout(() => {
      this.scrollToElement(`[data-category-id="${categories[targetIndex]?.id}"]`);
      this.highlightElement(`[data-category-id="${categories[targetIndex]?.id}"]`);
    }, 50);
  }

  moveCategoryDown(currentIndex: number) {
    const categories = this.menuCategories();
    if (currentIndex >= categories.length - 1) return;
    
    const categoriesArray = [...categories];
    const targetIndex = currentIndex + 1;
    
    // Tausche Positionen
    const temp = categoriesArray[currentIndex];
    categoriesArray[currentIndex] = categoriesArray[targetIndex];
    categoriesArray[targetIndex] = temp;
    
    this.menuService.reorderCategories(categoriesArray);
    
    // Feedback für User
    this.showSortFeedback('Kategorie nach unten verschoben');
    
    // Scroll und Highlight
    setTimeout(() => {
      this.scrollToElement(`[data-category-id="${categoriesArray[targetIndex]?.id}"]`);
      this.highlightElement(`[data-category-id="${categoriesArray[targetIndex]?.id}"]`);
    }, 50);
  }

  // 🆕 Mobile Sortier-Methoden für Items
  moveItemUp(categoryId: number, currentIndex: number) {
    if (currentIndex <= 0) return;
    
    const categories = [...this.menuCategories()];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) return;
    
    const items = [...categories[categoryIndex].items];
    const targetIndex = currentIndex - 1;
    
    // Tausche Positionen
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;
    
    // Update die Kategorie
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    this.menuService.reorderCategories(categories);
    
    // Feedback für User
    this.showSortFeedback('Gericht nach oben verschoben');
  }

  moveItemDown(categoryId: number, currentIndex: number) {
    const categories = [...this.menuCategories()];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) return;
    
    const items = [...categories[categoryIndex].items];
    if (currentIndex >= items.length - 1) return;
    
    const targetIndex = currentIndex + 1;
    
    // Tausche Positionen
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;
    
    // Update die Kategorie
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    this.menuService.reorderCategories(categories);
    
    // Feedback für User
    this.showSortFeedback('Gericht nach unten verschoben');
  }

  // 🆕 Feedback für Sortier-Aktionen
  private showSortFeedback(message: string) {
    // Einfaches Toast-ähnliches Feedback
    console.log(message);
    
    // Optional: Kurzes visuelles Feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = message;
    feedbackElement.className = 'mobile-feedback-toast';
    
    document.body.appendChild(feedbackElement);
    
    // Animation
    setTimeout(() => feedbackElement.classList.add('show'), 100);
    
    // Nach 2 Sekunden entfernen
    setTimeout(() => {
      feedbackElement.classList.add('hide');
      
      setTimeout(() => {
        if (feedbackElement.parentNode) {
          document.body.removeChild(feedbackElement);
        }
      }, 300);
    }, 2000);
  }

  // Scroll zu Element nach Sortierung
  private scrollToElement(elementSelector: string, delay: number = 100) {
    setTimeout(() => {
      const element = document.querySelector(elementSelector);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, delay);
  }

  // Highlight-Effekt für verschobene Elemente
  private highlightElement(elementSelector: string) {
    setTimeout(() => {
      const element = document.querySelector(elementSelector) as HTMLElement;
      if (element) {
        element.classList.add('moved');
        
        setTimeout(() => {
          element.classList.remove('moved');
        }, 1000);
      }
    }, 100);
  }

  // 🆕 Drag & Drop Methods mit Container-Kontrolle (nur Desktop)
  onDragStarted(event: CdkDragStart) {
    // Nur auf Desktop aktivieren
    if (this.isMobileDevice()) return;
    
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
    // Nur auf Desktop aktivieren
    if (this.isMobileDevice()) return;
    
    // Cleanup und Container zurücksetzen
    const container = document.querySelector('.menu-content');
    if (container) {
      container.classList.remove('drag-active');
    }
    document.body.classList.remove('drag-in-progress');
  }

  dropCategory(event: CdkDragDrop<MenuCategory[]>) {
    // Nur auf Desktop aktivieren
    if (this.isMobileDevice()) return;
    
    this.menuService.dropCategory(event);
  }

  dropItem(event: CdkDragDrop<MenuItem[]>, categoryId: number) {
    // Nur auf Desktop aktivieren
    if (this.isMobileDevice()) return;
    
    this.menuService.dropItemBetweenCategories(event, categoryId);
  }

  getItemDropListId(categoryId: number): string {
    return this.menuService.getItemDropListId(categoryId);
  }

  getAllItemDropListIds(): string[] {
    return this.menuService.getAllItemDropListIds();
  }

  // 🆕 Keyboard Shortcuts für Desktop
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Nur auf Desktop und wenn kein Input fokussiert ist
    if (this.isMobileDevice() || this.isInputFocused()) return;
    
    // Ctrl/Cmd + Pfeil-Tasten für Kategorien
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      const categories = this.menuCategories();
      
      if (event.key === 'ArrowUp' && categories.length > 1) {
        event.preventDefault();
        this.moveCategoryUp(0); // Erste Kategorie nach oben
      } else if (event.key === 'ArrowDown' && categories.length > 1) {
        event.preventDefault();
        this.moveCategoryDown(categories.length - 1); // Letzte Kategorie nach unten
      }
    }
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement || 
           activeElement instanceof HTMLTextAreaElement ||
           activeElement?.getAttribute('contenteditable') === 'true';
  }

  // 🆕 Batch Operations für Mobile (optional)
  
  // Alle Kategorien sortieren
  sortCategoriesAlphabetically() {
    const categories = [...this.menuCategories()];
    categories.sort((a, b) => a.category.localeCompare(b.category));
    this.menuService.reorderCategories(categories);
    this.showSortFeedback('Kategorien alphabetisch sortiert');
  }

  // Alle Items in einer Kategorie sortieren
  sortItemsInCategory(categoryId: number, sortBy: 'name' | 'price' = 'name') {
    const categories = [...this.menuCategories()];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) return;
    
    const items = [...categories[categoryIndex].items];
    
    if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      items.sort((a, b) => a.price - b.price);
    }
    
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    this.menuService.reorderCategories(categories);
    this.showSortFeedback(`Gerichte nach ${sortBy === 'name' ? 'Name' : 'Preis'} sortiert`);
  }

  // Featured Items nach oben verschieben
  moveFeaturedItemsToTop(categoryId: number) {
    const categories = [...this.menuCategories()];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) return;
    
    const items = [...categories[categoryIndex].items];
    const featuredItems = items.filter(item => item.featured);
    const regularItems = items.filter(item => !item.featured);
    
    categories[categoryIndex] = { 
      ...categories[categoryIndex], 
      items: [...featuredItems, ...regularItems] 
    };
    
    this.menuService.reorderCategories(categories);
    this.showSortFeedback('Featured-Gerichte nach oben verschoben');
  }

  // 🆕 Mobile-spezifische Touch-Gesten (optional)
  onTouchStart(event: TouchEvent, type: 'category' | 'item', categoryId?: number, itemIndex?: number) {
    if (!this.isMobileDevice()) return;
    
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  onTouchEnd(event: TouchEvent, type: 'category' | 'item', categoryIndex?: number, categoryId?: number, itemIndex?: number) {
    if (!this.isMobileDevice()) return;
    
    const touchEndY = event.changedTouches[0].clientY;
    const touchDuration = Date.now() - this.touchStartTime;
    const deltaY = this.touchStartY - touchEndY;
    
    // Swipe-Erkennung: mindestens 50px Bewegung in unter 300ms
    if (Math.abs(deltaY) > 50 && touchDuration < 300) {
      if (type === 'category' && categoryIndex !== undefined) {
        if (deltaY > 0) { // Swipe nach oben = nach oben verschieben
          this.moveCategoryUp(categoryIndex);
        } else { // Swipe nach unten = nach unten verschieben
          this.moveCategoryDown(categoryIndex);
        }
      } else if (type === 'item' && categoryId !== undefined && itemIndex !== undefined) {
        if (deltaY > 0) { // Swipe nach oben = nach oben verschieben
          this.moveItemUp(categoryId, itemIndex);
        } else { // Swipe nach unten = nach unten verschieben
          this.moveItemDown(categoryId, itemIndex);
        }
      }
    }
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