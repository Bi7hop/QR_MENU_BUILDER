import { Injectable, signal } from '@angular/core';

export interface LegalSettings {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  ceoName: string;
  showCookieBanner: boolean;
  cookiesAccepted: boolean;
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
    cookiesAccepted: false
  });

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        this.legalSettings.set({ ...this.legalSettings(), ...settings });
      } catch (error) {
        // Fallback zu Default-Settings
      }
    }
  }

  private saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.legalSettings()));
  }

  updateLegalSettings(updates: Partial<LegalSettings>) {
    this.legalSettings.update(current => ({ ...current, ...updates }));
    this.saveSettings();
  }

  acceptCookies() {
    this.updateLegalSettings({ 
      cookiesAccepted: true, 
      showCookieBanner: false 
    });
  }

  showCookieBanner() {
    this.updateLegalSettings({ showCookieBanner: true });
  }

  shouldShowCookieBanner(): boolean {
    const settings = this.legalSettings();
    return settings.showCookieBanner && !settings.cookiesAccepted;
  }

  getLegalInfo() {
    return this.legalSettings();
  }
}