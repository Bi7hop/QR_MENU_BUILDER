import { Injectable, signal } from '@angular/core';
import { MenuCategory, MenuItem, Restaurant } from '../models/menu.models';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Signal-basierte State Management
  restaurant = signal<Restaurant>({
    name: 'Hier könnte dein Restaurantname stehen',
    description: 'Moderne Küche & Genuss',
    logo: undefined,
    theme: 'platinum',
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
    type: 'food',
    items: [
      {
        id: 1,
        name: 'Gemischter Salat',
        description: 'Frischer Blattsalat mit Tomaten, Gurken und Paprika',
        price: 8.50,
        image: undefined,
        featured: false
      },
      {
        id: 2,
        name: 'Bruschetta',
        description: 'Geröstetes Brot mit Tomaten, Basilikum und Knoblauch',
        price: 7.90,
        image: undefined,
        featured: true
      },
      {
        id: 3,
        name: 'Suppe des Tages',
        description: 'Täglich wechselnde hausgemachte Suppe',
        price: 6.50,
        image: undefined,
        featured: false
      },
      {
        id: 4,
        name: 'Caesar Salad',
        description: 'Römersalat mit Croutons, Parmesan und Caesar-Dressing',
        price: 11.90,
        image: undefined,
        featured: false
      }
    ]
  },
  {
    id: 2,
    category: '🍖 HAUPTSPEISEN',
    type: 'food',
    items: [
      {
        id: 5,
        name: 'Schnitzel Wiener Art',
        description: 'Paniertes Kalbsschnitzel mit Pommes und Salat',
        price: 16.90,
        image: undefined,
        featured: true
      },
      {
        id: 6,
        name: 'Spaghetti Bolognese',
        description: 'Klassische Pasta mit Hackfleischsauce',
        price: 12.50,
        image: undefined,
        featured: false
      },
      {
        id: 7,
        name: 'Gegrilltes Hähnchen',
        description: 'Hähnchenbrust vom Grill mit Gemüse und Reis',
        price: 14.90,
        image: undefined,
        featured: false
      },
      {
        id: 8,
        name: 'Pizza Margherita',
        description: 'Klassische Pizza mit Tomaten, Mozzarella und Basilikum',
        price: 11.50,
        image: undefined,
        featured: false
      },
      {
        id: 9,
        name: 'Rinderbraten',
        description: 'Saftiger Rinderbraten mit Rotkohl und Klößen',
        price: 18.90,
        image: undefined,
        featured: false
      },
      {
        id: 10,
        name: 'Lachs mit Dillsauce',
        description: 'Gebratener Lachs mit cremiger Dillsauce und Kartoffeln',
        price: 19.50,
        image: undefined,
        featured: true
      }
    ]
  },
  {
    id: 3,
    category: '🍰 NACHTISCH',
    type: 'food',
    items: [
      {
        id: 11,
        name: 'Tiramisu',
        description: 'Klassisches italienisches Dessert mit Mascarpone',
        price: 6.90,
        image: undefined,
        featured: true
      },
      {
        id: 12,
        name: 'Apfelstrudel',
        description: 'Hausgemachter Strudel mit Vanillesauce',
        price: 5.50,
        image: undefined,
        featured: false
      },
      {
        id: 13,
        name: 'Schokoladenkuchen',
        description: 'Warmer Schokoladenkuchen mit flüssigem Kern',
        price: 7.50,
        image: undefined,
        featured: false
      },
      {
        id: 14,
        name: 'Eis (3 Kugeln)',
        description: 'Vanille, Schokolade oder Erdbeere',
        price: 4.90,
        image: undefined,
        featured: false
      },
      {
        id: 15,
        name: 'Panna Cotta',
        description: 'Italienisches Dessert mit Beerensauce',
        price: 6.50,
        image: undefined,
        featured: false
      }
    ]
  },
  {
    id: 4,
    category: '🥤 GETRÄNKE',
    type: 'drinks',
    items: [
      {
        id: 16,
        name: 'Cola / Fanta',
        description: '0,33l Glas',
        price: 3.50,
        image: undefined,
        featured: false
      },
      {
        id: 17,
        name: 'Mineralwasser',
        description: '0,25l still oder sprudelnd',
        price: 2.50,
        image: undefined,
        featured: false
      },
      {
        id: 18,
        name: 'Apfelsaft',
        description: '0,33l naturtrüb',
        price: 3.20,
        image: undefined,
        featured: false
      },
      {
        id: 19,
        name: 'Bier vom Fass',
        description: '0,5l Pils',
        price: 4.20,
        image: undefined,
        featured: true
      },
      {
        id: 20,
        name: 'Hauswein',
        description: '0,2l Rot- oder Weißwein',
        price: 5.50,
        image: undefined,
        featured: false
      },
      {
        id: 21,
        name: 'Kaffee',
        description: 'Tasse Kaffee oder Espresso',
        price: 2.80,
        image: undefined,
        featured: false
      },
      {
        id: 22,
        name: 'Heißer Kakao',
        description: 'Mit Sahne und Marshmallows',
        price: 3.90,
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
    type: 'food', // Standard: food
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

  // 🆕 Drag & Drop für Kategorien
  dropCategory(event: CdkDragDrop<MenuCategory[]>) {
    const categories = [...this.menuCategories()];
    moveItemInArray(categories, event.previousIndex, event.currentIndex);
    this.menuCategories.set(categories);
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

  // 🆕 Drag & Drop für Items innerhalb einer Kategorie
  dropItem(event: CdkDragDrop<MenuItem[]>, categoryId: number) {
    const categories = this.menuCategories().map(cat => {
      if (cat.id === categoryId) {
        const items = [...cat.items];
        moveItemInArray(items, event.previousIndex, event.currentIndex);
        return { ...cat, items };
      }
      return cat;
    });
    
    this.menuCategories.set(categories);
  }

  // 🆕 Drag & Drop für Items zwischen Kategorien
  dropItemBetweenCategories(event: CdkDragDrop<MenuItem[]>, targetCategoryId: number) {
    if (event.previousContainer === event.container) {
      // Innerhalb derselben Kategorie - normale Sortierung
      this.dropItem(event, targetCategoryId);
    } else {
      // Zwischen verschiedenen Kategorien
      const categories = [...this.menuCategories()];
      
      // Finde Source und Target Kategorien
      const sourceCategory = categories.find(cat => 
        cat.items.some(item => item.id === parseInt(event.previousContainer.id.split('-')[1]))
      );
      const targetCategory = categories.find(cat => cat.id === targetCategoryId);
      
      if (sourceCategory && targetCategory) {
        // Transfer Item zwischen Arrays
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        
        this.menuCategories.set(categories);
      }
    }
  }

  reorderItems(categoryId: number, items: MenuItem[]) {
    this.menuCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, items } : cat
      )
    );
  }

  // 🆕 Hilfsmethoden für Drag & Drop IDs
  getCategoryDropListId(categoryId: number): string {
    return `category-${categoryId}`;
  }

  getItemDropListId(categoryId: number): string {
    return `items-${categoryId}`;
  }

  getAllItemDropListIds(): string[] {
    return this.menuCategories().map(cat => this.getItemDropListId(cat.id));
  }
}