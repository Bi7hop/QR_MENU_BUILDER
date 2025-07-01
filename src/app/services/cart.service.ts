import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, CustomerInfo } from '../models/order.models';
import { MenuItem, MenuCategory } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Cart State
  private cart = signal<Cart>({});
  private customerInfo = signal<CustomerInfo>({ table: '', name: '', phone: '' });

  // Public readonly signals
  public readonly cartItems = this.cart.asReadonly();
  public readonly customer = this.customerInfo.asReadonly();

  // Computed values
  public readonly itemCount = computed(() => {
    return Object.values(this.cart()).reduce((total, item) => total + item.quantity, 0);
  });

  public readonly totalPrice = computed(() => {
    // Wird später implementiert wenn wir Zugriff auf MenuService haben
    return 0;
  });

  public readonly isEmpty = computed(() => {
    return Object.keys(this.cart()).length === 0;
  });

  constructor() {
    this.loadCartFromStorage();
  }

  // Cart Management
  addToCart(itemId: number, quantity: number = 1, specialRequest: string = ''): void {
    this.cart.update(currentCart => ({
      ...currentCart,
      [itemId]: {
        itemId,
        quantity,
        specialRequest
      }
    }));
    this.saveCartToStorage();
  }

  removeFromCart(itemId: number): void {
    this.cart.update(currentCart => {
      const newCart = { ...currentCart };
      delete newCart[itemId];
      return newCart;
    });
    this.saveCartToStorage();
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    this.cart.update(currentCart => ({
      ...currentCart,
      [itemId]: {
        ...currentCart[itemId],
        quantity
      }
    }));
    this.saveCartToStorage();
  }

  updateSpecialRequest(itemId: number, specialRequest: string): void {
    this.cart.update(currentCart => ({
      ...currentCart,
      [itemId]: {
        ...currentCart[itemId],
        specialRequest
      }
    }));
    this.saveCartToStorage();
  }

  isInCart(itemId: number): boolean {
    return itemId in this.cart();
  }

  getCartItem(itemId: number): CartItem | undefined {
    return this.cart()[itemId];
  }

  clearCart(): void {
    this.cart.set({});
    this.saveCartToStorage();
  }

  // Customer Info Management
  updateCustomerInfo(info: Partial<CustomerInfo>): void {
    this.customerInfo.update(current => ({
      ...current,
      ...info
    }));
    this.saveCustomerToStorage();
  }

  isReadyForOrder(): boolean {
    const customer = this.customerInfo();
    return !this.isEmpty() && customer.table.trim() !== '';
  }

  // Storage Management
  private saveCartToStorage(): void {
    localStorage.setItem('menuforge_cart', JSON.stringify(this.cart()));
  }

  private saveCustomerToStorage(): void {
    localStorage.setItem('menuforge_customer', JSON.stringify(this.customerInfo()));
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('menuforge_cart');
      const savedCustomer = localStorage.getItem('menuforge_customer');
      
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        this.cart.set(cart);
      }
      
      if (savedCustomer) {
        const customer = JSON.parse(savedCustomer);
        this.customerInfo.set(customer);
      }
    } catch (error) {
      // Bei Parsing-Fehlern einfach mit leerem Cart starten
      this.cart.set({});
      this.customerInfo.set({ table: '', name: '', phone: '' });
    }
  }

  // Helper Methods
  getCartItemIds(): number[] {
    return Object.keys(this.cart()).map(id => parseInt(id));
  }

  getCartItemsWithDetails(menuCategories: MenuCategory[]): Array<{
    item: MenuItem;
    cartItem: CartItem;
    categoryType: 'food' | 'drinks';
  }> {
    const allMenuItems = menuCategories.flatMap(category => 
      category.items.map(item => ({ ...item, categoryType: category.type }))
    );

    return Object.values(this.cart()).map(cartItem => {
      const menuItem = allMenuItems.find(item => item.id === cartItem.itemId);
      if (!menuItem) {
        throw new Error(`Menu item with ID ${cartItem.itemId} not found`);
      }
      
      return {
        item: menuItem,
        cartItem,
        categoryType: menuItem.categoryType
      };
    });
  }

  calculateTotal(menuCategories: MenuCategory[]): number {
    return this.getCartItemsWithDetails(menuCategories).reduce((total, { item, cartItem }) => {
      return total + (item.price * cartItem.quantity);
    }, 0);
  }
}