import { Injectable, signal } from '@angular/core';
import { MenuCategory, MenuItem, Restaurant } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Signal-basierte State Management
  restaurant = signal<Restaurant>({
    name: 'VELOCITY',
    description: 'Modern Fusion Kitchen & Cocktail Bar',
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
      category: '🥗 STARTERS',
      items: [
        {
          id: 1,
          name: 'Truffle Arancini',
          description: 'Crispy risotto balls with black truffle and parmesan',
          price: 16.00,
          image: undefined,
          featured: true
        },
        {
          id: 2,
          name: 'Tuna Tataki',
          description: 'Seared tuna with wasabi mayo and pickled ginger',
          price: 22.00,
          image: undefined,
          featured: false
        }
      ]
    },
    {
      id: 2,
      category: '🍖 MAINS',
      items: [
        {
          id: 3,
          name: 'Wagyu Beef Brisket',
          description: 'Slow-cooked for 24h with chimichurri and roasted vegetables',
          price: 38.00,
          image: undefined,
          featured: true
        },
        {
          id: 4,
          name: 'Lobster Thermidor',
          description: 'Classic French preparation with cognac and gruyère',
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
      category: '📋 New Category',
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
      name: 'New Dish',
      description: 'Add description...',
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