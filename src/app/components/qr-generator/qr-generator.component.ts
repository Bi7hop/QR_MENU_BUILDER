import { Component, inject, signal, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeService } from '../../services/qr-code.service';
import { ThemeService } from '../../services/theme.service';
import { MenuService } from '../../services/menu.service';
import { AppStateService } from '../../services/app-state.service';
import { MenuExportService } from '../../services/menu-export.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss'
})
export class QrGeneratorComponent implements OnInit {
  private qrService = inject(QrCodeService);
  private themeService = inject(ThemeService);
  private menuService = inject(MenuService);
  private appState = inject(AppStateService);
  private exportService = inject(MenuExportService);
  private cdr = inject(ChangeDetectorRef);

  qrCodeDataUrl = signal<string>('');
  isGenerating = signal<boolean>(false);
  shareableUrl = signal<string>('');

  constructor() {
    effect(() => {
      const menuStatus = this.appState.getMenuStatus();
      
      if (menuStatus.isReady && menuStatus.url) {
        setTimeout(() => {
          this.generateMenuQR();
        }, 0);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    const menuStatus = this.appState.getMenuStatus();
    
    if (menuStatus.isReady) {
      this.generateMenuQR();
    } else {
      this.generateTestQR();
    }
  }

  getCurrentTheme() {
    return this.themeService.getCurrentTheme();
  }

  getMenuStatus() {
    return this.appState.getMenuStatus();
  }

  restaurant() {
    return this.menuService.restaurant();
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleDateString('de-DE');
  }

  getShareableUrl(): string {
    return this.shareableUrl() || 'Noch nicht verfügbar';
  }

  private async generateTestQR() {
    try {
      const restaurant = this.restaurant();
      const testUrl = `https://menuforge.app/demo/${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      
      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      };

      const qrDataUrl = await this.qrService.generateQRCode(testUrl, options);
      this.qrCodeDataUrl.set(qrDataUrl);
      this.shareableUrl.set(testUrl);
      this.cdr.detectChanges();
      
    } catch (error) {
      // Fehler stillschweigend behandeln
    }
  }

  private async generateMenuQR() {
    if (this.isGenerating()) return;
    this.isGenerating.set(true);
    
    try {
      const restaurant = this.menuService.restaurant();
      const restaurantSlug = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const shortUrl = `https://menuforge.app/view/${restaurantSlug}`;
      
      this.shareableUrl.set(shortUrl);
      
      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        logoUrl: restaurant.logo
      };

      const qrDataUrl = await this.qrService.generateQRCode(shortUrl, options);
      this.qrCodeDataUrl.set(qrDataUrl);
      
    } catch (error) {
      try {
        const fallbackUrl = 'https://menuforge.app';
        const fallbackQR = await this.qrService.generateQRCode(fallbackUrl, {
          width: 300,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' }
        });
        this.qrCodeDataUrl.set(fallbackQR);
        this.shareableUrl.set(fallbackUrl);
      } catch (fallbackError) {
        this.qrCodeDataUrl.set('');
      }
    } finally {
      this.isGenerating.set(false);
      this.cdr.detectChanges();
    }
  }

  async copyUrl() {
    const url = this.shareableUrl();
    if (!url || url === 'Noch nicht verfügbar') return;

    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  openPreview() {
    const menuStatus = this.appState.getMenuStatus();
    if (menuStatus.url) {
      window.open(menuStatus.url, '_blank');
    }
  }

  downloadQR(format: 'png' | 'svg') {
    if (!this.qrCodeDataUrl()) return;
    
    const restaurant = this.restaurant();
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${restaurant.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Menu_${timestamp}.${format}`;
    
    this.downloadPNG(fileName.replace('.svg', '.png'));
  }

  private downloadPNG(fileName: string) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = this.qrCodeDataUrl();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printQR() {
    if (!this.qrCodeDataUrl()) return;
    
    const restaurant = this.restaurant();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${restaurant.name} - QR-Code</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            img { max-width: 400px; height: auto; }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; margin: 5px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <h1>${restaurant.name}</h1>
          <p>${restaurant.description}</p>
          <br>
          <img src="${this.qrCodeDataUrl()}" alt="QR-Code">
          <br>
          <p><strong>Scannen Sie den QR-Code mit Ihrem Smartphone</strong></p>
          <p>um unser digitales Menü anzusehen</p>
          <div class="footer">
            <p>Erstellt mit MenuForge • ${this.getCurrentDateTime()}</p>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }
}