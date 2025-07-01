import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem, OrderStatus, OrderSummary } from '../models/order.models';
import { MenuCategory } from '../models/menu.models';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Orders State
  private orders = signal<Order[]>([]);
  
  // Public readonly signals
  public readonly allOrders = this.orders.asReadonly();
  
  // Computed values for different views
  public readonly activeOrders = computed(() => {
    return this.orders().filter(order => order.status !== OrderStatus.DELIVERED);
  });
  
  public readonly newOrders = computed(() => {
    return this.orders().filter(order => order.status === OrderStatus.NEW);
  });
  
  public readonly preparingOrders = computed(() => {
    return this.orders().filter(order => order.status === OrderStatus.PREPARING);
  });
  
  public readonly readyOrders = computed(() => {
    return this.orders().filter(order => order.status === OrderStatus.READY);
  });
  
  // Kitchen orders (only food items)
  public readonly kitchenOrders = computed(() => {
    return this.activeOrders().filter(order => 
      order.items.some(item => item.type === 'food')
    );
  });
  
  // Bar orders (only drink items)
  public readonly barOrders = computed(() => {
    return this.activeOrders().filter(order => 
      order.items.some(item => item.type === 'drinks')
    );
  });

  constructor(private cartService: CartService) {
    this.loadOrdersFromStorage();
  }

  // Order Creation
  createOrder(menuCategories: MenuCategory[]): string | null {
    const cart = this.cartService.cartItems();
    const customer = this.cartService.customer();
    
    // Validation
    if (!this.cartService.isReadyForOrder()) {
      return null;
    }

    // Generate Order ID
    const orderId = this.generateOrderId();
    
    // Convert cart items to order items
    const orderItems: OrderItem[] = this.cartService
      .getCartItemsWithDetails(menuCategories)
      .map(({ item, cartItem, categoryType }) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: cartItem.quantity,
        specialRequest: cartItem.specialRequest,
        type: categoryType,
        categoryName: this.getCategoryName(item.id, menuCategories)
      }));

    // Calculate total
    const total = this.cartService.calculateTotal(menuCategories);

    // Create order
    const order: Order = {
      id: orderId,
      table: customer.table,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItems,
      status: OrderStatus.NEW,
      timestamp: new Date(),
      total,
      notes: ''
    };

    // Add to orders
    this.orders.update(orders => [...orders, order]);
    this.saveOrdersToStorage();
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    return orderId;
  }

  // Order Management
  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.update(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
    this.saveOrdersToStorage();
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders().find(order => order.id === orderId);
  }

  deleteOrder(orderId: string): void {
    this.orders.update(orders => orders.filter(order => order.id !== orderId));
    this.saveOrdersToStorage();
  }

  // Status Updates
  startPreparing(orderId: string): void {
    this.updateOrderStatus(orderId, OrderStatus.PREPARING);
  }

  markAsReady(orderId: string): void {
    this.updateOrderStatus(orderId, OrderStatus.READY);
  }

  markAsDelivered(orderId: string): void {
    this.updateOrderStatus(orderId, OrderStatus.DELIVERED);
  }

  // Helper Methods
  private generateOrderId(): string {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5).replace(':', '');
    const randomString = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `ORD-${timeString}-${randomString}`;
  }

  private getCategoryName(itemId: number, menuCategories: MenuCategory[]): string {
    for (const category of menuCategories) {
      const item = category.items.find(item => item.id === itemId);
      if (item) {
        return category.category;
      }
    }
    return 'Unbekannt';
  }

  // Order Summary for Kitchen/Bar
  getOrderSummary(orderId: string): OrderSummary | null {
    const order = this.getOrder(orderId);
    if (!order) return null;

    const foodItems = order.items.filter(item => item.type === 'food');
    const drinkItems = order.items.filter(item => item.type === 'drinks');

    return {
      foodItems,
      drinkItems,
      total: order.total,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // Kitchen specific methods
  getKitchenOrderById(orderId: string): Order | undefined {
    const order = this.getOrder(orderId);
    if (!order) return undefined;
    
    // Return order only if it has food items
    const hasFoodItems = order.items.some(item => item.type === 'food');
    return hasFoodItems ? order : undefined;
  }

  // Bar specific methods
  getBarOrderById(orderId: string): Order | undefined {
    const order = this.getOrder(orderId);
    if (!order) return undefined;
    
    // Return order only if it has drink items
    const hasDrinkItems = order.items.some(item => item.type === 'drinks');
    return hasDrinkItems ? order : undefined;
  }

  // Statistics
  getTodayOrderCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.orders().filter(order => 
      order.timestamp >= today
    ).length;
  }

  getTodayRevenue(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.orders()
      .filter(order => order.timestamp >= today && order.status === OrderStatus.DELIVERED)
      .reduce((sum, order) => sum + order.total, 0);
  }

  // Storage Management
  private saveOrdersToStorage(): void {
    // Convert dates to strings for storage
    const ordersForStorage = this.orders().map(order => ({
      ...order,
      timestamp: order.timestamp.toISOString()
    }));
    
    localStorage.setItem('menuforge_orders', JSON.stringify(ordersForStorage));
  }

  private loadOrdersFromStorage(): void {
    try {
      const savedOrders = localStorage.getItem('menuforge_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          timestamp: new Date(order.timestamp)
        }));
        this.orders.set(orders);
      }
    } catch (error) {
      // Bei Parsing-Fehlern mit leerer Liste starten
      this.orders.set([]);
    }
  }

  // Development Helper (can be removed in production)
  clearAllOrders(): void {
    this.orders.set([]);
    this.saveOrdersToStorage();
  }

  // Add test orders for development
  addTestOrders(): void {
    const testOrders: Order[] = [
      {
        id: 'ORD-1425-ABC',
        table: 'Tisch 5',
        customerName: 'Max Mustermann',
        customerPhone: '+49 123 456789',
        items: [
          {
            id: 5,
            name: 'Schnitzel Wiener Art',
            description: 'Paniertes Kalbsschnitzel mit Pommes und Salat',
            price: 16.90,
            quantity: 2,
            specialRequest: 'Ohne Zwiebeln',
            type: 'food',
            categoryName: '🍖 HAUPTSPEISEN'
          },
          {
            id: 19,
            name: 'Bier vom Fass',
            description: '0,5l Pils',
            price: 4.20,
            quantity: 2,
            specialRequest: '',
            type: 'drinks',
            categoryName: '🥤 GETRÄNKE'
          }
        ],
        status: OrderStatus.NEW,
        timestamp: new Date(),
        total: 42.20,
        notes: ''
      }
    ];
    
    this.orders.update(orders => [...orders, ...testOrders]);
    this.saveOrdersToStorage();
  }
}