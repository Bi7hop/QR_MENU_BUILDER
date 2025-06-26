import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Aktueller Menü-Export Status
  currentMenuUrl = signal<string>('');
  lastExportTime = signal<Date | null>(null);
  isMenuReady = signal<boolean>(false);

  // Aktueller Menü-Export als HTML Blob URL
  setMenuUrl(url: string) {
    this.currentMenuUrl.set(url);
    this.lastExportTime.set(new Date());
    this.isMenuReady.set(true);
  }

  // Menü-Status zurücksetzen (wenn Änderungen gemacht wurden)
  resetMenuStatus() {
    this.isMenuReady.set(false);
  }

  // Prüfen ob Menü bereit ist
  getMenuStatus() {
    return {
      url: this.currentMenuUrl(),
      isReady: this.isMenuReady(),
      lastExport: this.lastExportTime()
    };
  }
}