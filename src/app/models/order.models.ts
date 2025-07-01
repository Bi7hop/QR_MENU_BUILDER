export interface CartItem {
  itemId: number;
  quantity: number;
  specialRequest?: string;
}

export interface Cart {
  [itemId: number]: CartItem;
}

export interface CustomerInfo {
  table: string;
  name?: string;
  phone?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  specialRequest?: string;
  type: 'food' | 'drinks'; 
  categoryName: string;
}

export interface Order {
  id: string;
  table: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  total: number;
  notes?: string;
}

export enum OrderStatus {
  NEW = 'new',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered'
}

export interface OrderSummary {
  foodItems: OrderItem[];
  drinkItems: OrderItem[];
  total: number;
  itemCount: number;
}