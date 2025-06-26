import { Injectable, signal } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  qrCodeDataUrl = signal<string>('');

  async generateQRCode(
    text: string, 
    options: {
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
      logoUrl?: string;
    } = {}
  ): Promise<string> {
    try {
      const errorCorrectionLevel = text.length > 1000 ? 'L' : 'M';
      
      const qrOptions = {
        width: options.width || 400,
        margin: options.margin || 2,
        color: {
          dark: options.color?.dark || '#000000',
          light: options.color?.light || '#FFFFFF'
        },
        errorCorrectionLevel: errorCorrectionLevel as any
      };

      const qrDataUrl = await QRCode.toDataURL(text, qrOptions);

      if (options.logoUrl) {
        try {
          const combinedQR = await this.addLogoToQR(qrDataUrl, options.logoUrl, options.width || 400);
          this.qrCodeDataUrl.set(combinedQR);
          return combinedQR;
        } catch (logoError) {
          this.qrCodeDataUrl.set(qrDataUrl);
          return qrDataUrl;
        }
      }

      this.qrCodeDataUrl.set(qrDataUrl);
      return qrDataUrl;
      
    } catch (error) {
      if (text.startsWith('data:')) {
        try {
          const fallbackUrl = 'https://menuforge.app/view?data=compressed';
          const fallbackQR = await QRCode.toDataURL(fallbackUrl, {
            width: options.width || 400,
            margin: options.margin || 2,
            color: {
              dark: options.color?.dark || '#000000',
              light: options.color?.light || '#FFFFFF'
            },
            errorCorrectionLevel: 'M' as any
          });
          this.qrCodeDataUrl.set(fallbackQR);
          return fallbackQR;
        } catch (fallbackError) {
          // Stillschweigend fehlschlagen
        }
      }
      
      throw new Error(`QR-Code Generierung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  }

  private async addLogoToQR(qrDataUrl: string, logoUrl: string, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas nicht verfügbar'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, size, size);

        const logoImage = new Image();
        logoImage.onload = () => {
          const logoSize = size * 0.15;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          const padding = logoSize * 0.1;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(
            logoX - padding, 
            logoY - padding, 
            logoSize + (padding * 2), 
            logoSize + (padding * 2)
          );

          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
          resolve(canvas.toDataURL());
        };
        
        logoImage.onerror = () => {
          resolve(qrDataUrl);
        };
        
        logoImage.src = logoUrl;
      };
      
      qrImage.onerror = () => {
        reject(new Error('QR-Code Bild konnte nicht geladen werden'));
      };
      
      qrImage.src = qrDataUrl;
    });
  }

  downloadQRCode(filename: string = 'qr-code.png') {
    if (!this.qrCodeDataUrl()) return;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.qrCodeDataUrl();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}