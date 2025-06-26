import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { ThemeService } from '../../services/theme.service';
import { QrCodeService } from '../../services/qr-code.service';
import { MenuExportService } from '../../services/menu-export.service';
import { MenuCategory, MenuItem, Restaurant } from '../../models/menu.models';

@Component({
  selector: 'app-menu-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss'
})
export class MenuPreviewComponent implements OnInit {
  public menuService = inject(MenuService);
  public themeService = inject(ThemeService);
  public qrService = inject(QrCodeService);
  public exportService = inject(MenuExportService);

  exportUrl = signal<string>('');
  exportFileName = signal<string>('');

  ngOnInit() {
    // Komponente initialisiert
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
}