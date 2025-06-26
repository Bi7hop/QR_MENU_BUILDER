import { Injectable, signal } from '@angular/core';
import { MenuCategory, MenuItem, Restaurant } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Signal-basierte State Management
  restaurant = signal<Restaurant>({
    name: 'Restaurant Beispiel',
    description: 'Moderne Küche & Genuss',
    logo: undefined,
    theme: 'neon',
    customColors: {
      primary: '#00ff88',
      secondary: '#ff0080'
    },
    font: 'Inter'
  });

  menuCategories = signal<MenuCategory[]>([
    {
      id: 1,
      category: '🥗 VORSPEISEN',
      items: [
        {
          id: 1,
          name: 'Trüffel Arancini',
          description: 'Knusprige Risotto-Bällchen mit schwarzem Trüffel und Parmesan',
          price: 16.00,
          image: undefined,
          featured: true
        },
        {
          id: 2,
          name: 'Thunfisch Tataki',
          description: 'Kurz angebratener Thunfisch mit Wasabi-Mayo und eingelegtem Ingwer',
          price: 22.00,
          image: undefined,
          featured: false
        }
      ]
    },
    {
      id: 2,
      category: '🍖 HAUPTSPEISEN',
      items: [
        {
          id: 3,
          name: 'Wagyu Rinderbrust',
          description: '24h langsam gegart mit Chimichurri und geröstetem Gemüse',
          price: 38.00,
          image: undefined,
          featured: true
        },
        {
          id: 4,
          name: 'Hummer Thermidor',
          description: 'Klassische französische Zubereitung mit Cognac und Gruyère',
          price: 45.00,
          image: undefined,
          featured: false
        }
      ]
    }
  ]);

  // Restaurant Methods
  updateRestaurant(updates: Partial<Restaurant>) {
    this.restaurant.update(current => ({ ...current, ...updates }));
  }

  // Category Methods
  addCategory() {
    const newCategory: MenuCategory = {
      id: Date.now(),
      category: '📋 Neue Kategorie',
      items: []
    };
    this.menuCategories.update(categories => [...categories, newCategory]);
  }

  updateCategory(categoryId: number, updates: Partial<MenuCategory>) {
    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  }

  removeCategory(categoryId: number) {
    this.menuCategories.update(categories =>
      categories.filter(cat => cat.id !== categoryId)
    );
  }

  reorderCategories(categories: MenuCategory[]) {
    this.menuCategories.set(categories);
  }

  // Item Methods
  addItem(categoryId: number) {
    const newItem: MenuItem = {
      id: Date.now(),
      name: 'Neues Gericht',
      description: 'Beschreibung hinzufügen...',
      price: 0,
      image: undefined,
      featured: false
    };

    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    );
  }

  updateItem(categoryId: number, itemId: number, updates: Partial<MenuItem>) {
    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : cat
      )
    );
  }

  removeItem(categoryId: number, itemId: number) {
    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      )
    );
  }

  reorderItems(categoryId: number, items: MenuItem[]) {
    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, items } : cat
      )
    );
  }
}