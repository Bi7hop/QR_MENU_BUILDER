import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { QrCodeService } from '../../services/qr-code.service';
import { MenuExportService } from '../../services/menu-export.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { MenuCategory, MenuItem, Restaurant } from '../../models/menu.models';

@Component({
  selector: 'app-menu-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss'
})
export class MenuPreviewComponent implements OnInit {
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);
  public qrService = inject(QrCodeService);
  public exportService = inject(MenuExportService);
  public cartService = inject(CartService);
  public orderService = inject(OrderService);

  exportUrl = signal<string>('');
  exportFileName = signal<string>('');
  previewFontFamily = signal<string>('Inter');
  
  // Order related signals
  showOrderMode = signal<boolean>(true); // Enable ordering by default
  currentView = signal<'menu' | 'cart'>('menu');

  constructor() {
    // Effect um Schriftart-Änderungen zu verfolgen - MIT allowSignalWrites
    effect(() => {
      const restaurant = this.restaurant();
      this.loadPreviewFont(restaurant.font);
      this.previewFontFamily.set(restaurant.font);
    }, { allowSignalWrites: true }); 
  }

  ngOnInit() {
    // Initial font load
    const restaurant = this.restaurant();
    this.loadPreviewFont(restaurant.font);
    this.previewFontFamily.set(restaurant.font);

    // Event Listener für Cart Navigation
    window.addEventListener('goToCart', () => {
      this.currentView.set('cart');
    });
  }

  private loadPreviewFont(fontName: string) {
    // Prüfen ob Font bereits geladen ist
    if (document.fonts.check(`16px "${fontName}"`)) {
      return;
    }

    // Google Fonts URL generieren
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700;800&display=swap`;
    
    // Prüfen ob Link bereits existiert
    const existingLink = document.querySelector(`link[href*="${fontName.replace(' ', '+')}"]`);
    if (existingLink) {
      return;
    }

    // Font dynamisch laden
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);

    // Warten bis Font geladen ist
    link.onload = () => {
      // Font-Familie explizit für die Vorschau setzen
      this.previewFontFamily.set(fontName);
    };
  }

  getPreviewFontFamily(): string {
    const fontName = this.previewFontFamily();
    // Fallback-Fonts hinzufügen für bessere Kompatibilität
    return `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
  }

  restaurant(): Restaurant {
    return this.menuService.restaurant();
  }

  menuCategories() {
    return this.menuService.menuCategories();
  }

  currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleDateString('de-DE');
  }

  // Navigation Methods
  goToMenu(): void {
    this.currentView.set('menu');
  }

  // Cart Methods
  addToCart(itemId: number): void {
    this.cartService.addToCart(itemId, 1, '');
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  increaseQuantity(itemId: number): void {
    const currentItem = this.cartService.getCartItem(itemId);
    if (currentItem) {
      this.cartService.updateQuantity(itemId, currentItem.quantity + 1);
    }
  }

  decreaseQuantity(itemId: number): void {
    const currentItem = this.cartService.getCartItem(itemId);
    if (currentItem) {
      this.cartService.updateQuantity(itemId, currentItem.quantity - 1);
    }
  }

  updateSpecialRequest(itemId: number, request: string): void {
    this.cartService.updateSpecialRequest(itemId, request);
  }

  // Customer Info Methods
  updateCustomerTable(table: string): void {
    this.cartService.updateCustomerInfo({ table });
  }

  updateCustomerName(name: string): void {
    this.cartService.updateCustomerInfo({ name });
  }

  // Order Methods
  submitOrder(): void {
    const orderId = this.orderService.createOrder(this.menuCategories());
    if (orderId) {
      alert(`Bestellung erfolgreich aufgegeben!\nBestellnummer: ${orderId}`);
      this.currentView.set('menu');
    } else {
      alert('Fehler beim Aufgeben der Bestellung. Bitte überprüfen Sie Ihre Eingaben.');
    }
  }

  // Helper Methods
  getCartTotal(): number {
    return this.cartService.calculateTotal(this.menuCategories());
  }

  getCartItemsWithDetails() {
    return this.cartService.getCartItemsWithDetails(this.menuCategories());
  }

  getItemClasses(item: MenuItem): string {
    const baseClasses = 'transition-all duration-300';
    const featuredClasses = item.featured ? 'bg-green-400/10 border border-green-400/30' : '';
    const cartClasses = this.cartService.isInCart(item.id) 
      ? 'bg-white/10 border border-white/30' 
      : 'bg-white/5 hover:bg-white/10';
    
    return `${baseClasses} ${featuredClasses} ${cartClasses}`.trim();
  }

  // Export Methods (existing)
  async exportAsHTML() {
    const restaurant = this.restaurant();
    const categories = this.menuCategories();
    const theme = this.currentTheme();

    const htmlContent = this.exportService.generateMenuHTML(restaurant, categories, theme);
    const fileName = `${restaurant.name.replace(/[^a-zA-Z0-9]/g, '_')}_Menu.html`;
    
    // HTML-Datei zum Download anbieten
    this.downloadHTML(htmlContent, fileName);
    
    // Temporäre URL erstellen (für Demo-Zwecke)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    this.exportUrl.set(url);
    this.exportFileName.set(fileName);
  }

  private downloadHTML(content: string, fileName: string) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async generateMenuQR() {
    if (!this.exportUrl()) {
      await this.exportAsHTML();
    }
    
    // Zur QR-Generator Seite wechseln und URL setzen
    // Hier könnten wir einen Service verwenden, um die URL zu übergeben
    // Oder ein Event emittieren
  }

  async shareMenu() {
    if (!this.exportUrl()) {
      await this.exportAsHTML();
    }

    const url = this.exportUrl();
    const text = `Schauen Sie sich unser Menü an: ${this.restaurant().name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${this.restaurant().name} - Menü`,
          text: text,
          url: url
        });
      } catch (error) {
        this.copyUrl();
      }
    } else {
      this.copyUrl();
    }
  }

  async copyUrl() {
    if (!this.exportUrl()) return;

    try {
      await navigator.clipboard.writeText(this.exportUrl());
      // Hier könnten wir eine Toast-Nachricht anzeigen
    } catch (error) {
      // Fallback für ältere Browser
      const textArea = document.createElement('textarea');
      textArea.value = this.exportUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
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

  // Cleanup Event Listener
  ngOnDestroy() {
    window.removeEventListener('goToCart', () => {
      this.currentView.set('cart');
    });
  }
}