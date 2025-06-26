// src/app/services/legal.service.ts
import { Injectable, signal } from '@angular/core';

export interface LegalSettings {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  ceoName: string;
  showCookieBanner: boolean;
  cookiesAccepted: boolean;
  analyticsAccepted: boolean;
  marketingAccepted: boolean;
  privacyPolicyUrl?: string;
  imprintUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LegalService {
  private readonly STORAGE_KEY = 'menuforge_legal_settings';

  legalSettings = signal<LegalSettings>({
    companyName: 'Menuforge',
    companyAddress: 'Schemder Höhe 8, 49439 Steinfeld, Deutschland',
    companyEmail: 'marcel.menke1981@gmail.com',
    companyPhone: '+49 160 97952079',
    ceoName: 'Marcel Menke',
    showCookieBanner: false,
    cookiesAccepted: false,
    analyticsAccepted: false,
    marketingAccepted: false
  });

  constructor() {
    this.loadSettings();
    // Banner aktivieren, falls noch keine Entscheidung
    const s = this.legalSettings();
    if (!s.cookiesAccepted) {
      this.updateLegalSettings({ showCookieBanner: true });
    }
  }

  private loadSettings(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored) as Partial<LegalSettings>;
        this.legalSettings.update(curr => ({ ...curr, ...settings }));
      } catch {
        // bei Fehlern einfach Default behalten
      }
    }
  }

  private saveSettings(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.legalSettings()));
  }

  updateLegalSettings(updates: Partial<LegalSettings>): void {
    this.legalSettings.update(curr => ({ ...curr, ...updates }));
    this.saveSettings();
  }

  /** User wählt nur notwendige Cookies */
  acceptEssentialOnly(): void {
    this.updateLegalSettings({
      cookiesAccepted: true,
      showCookieBanner: false,
      analyticsAccepted: false,
      marketingAccepted: false
    });
  }

  /** User akzeptiert alle Cookies */
  acceptAll(): void {
    this.updateLegalSettings({
      cookiesAccepted: true,
      showCookieBanner: false,
      analyticsAccepted: true,
      marketingAccepted: true
    });
  }

  shouldShowCookieBanner(): boolean {
    const s = this.legalSettings();
    return s.showCookieBanner && !s.cookiesAccepted;
  }

  /** Gibt alle aktuellen Einstellungen zurück */
  getLegalInfo(): LegalSettings {
    return this.legalSettings();
  }
}
