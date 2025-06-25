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
      const qrOptions = {
        width: options.width || 400,
        margin: options.margin || 2,
        color: {
          dark: options.color?.dark || '#000000',
          light: options.color?.light || '#FFFFFF'
        },
        errorCorrectionLevel: 'M' as const
      };

      // Basis QR-Code generieren
      const qrDataUrl = await QRCode.toDataURL(text, qrOptions);

      // Falls Logo vorhanden, kombinieren
      if (options.logoUrl) {
        const combinedQR = await this.addLogoToQR(qrDataUrl, options.logoUrl, options.width || 400);
        this.qrCodeDataUrl.set(combinedQR);
        return combinedQR;
      }

      this.qrCodeDataUrl.set(qrDataUrl);
      return qrDataUrl;
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw error;
    }
  }

  private async addLogoToQR(qrDataUrl: string, logoUrl: string, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      const qrImage = new Image();
      qrImage.onload = () => {
        // QR Code zeichnen
        ctx.drawImage(qrImage, 0, 0, size, size);

        // Logo laden und zeichnen
        const logoImage = new Image();
        logoImage.onload = () => {
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Weißer Hintergrund für Logo
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

          // Logo zeichnen
          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

          resolve(canvas.toDataURL());
        };
        logoImage.onerror = () => resolve(qrDataUrl); // Fallback ohne Logo
        logoImage.src = logoUrl;
      };
      qrImage.onerror = () => reject(new Error('QR Code image loading failed'));
      qrImage.src = qrDataUrl;
    });
  }

  downloadQRCode(filename: string = 'qr-code.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.qrCodeDataUrl();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}