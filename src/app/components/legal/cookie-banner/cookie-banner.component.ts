import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalService } from '../../../services/legal.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="shouldShow()"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up"
    >
      <div class="max-w-6xl mx-auto">
        <div 
          class="backdrop-blur-2xl bg-black/90 border border-white/20 rounded-2xl p-6 shadow-2xl"
          [style.borderColor]="getCurrentTheme().primary + '40'"
        >
          <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <!-- Icon und Text -->
            <div class="flex-1 flex items-start space-x-4">
              <div 
                class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                [style.backgroundColor]="getCurrentTheme().primary + '20'"
              >
                <span class="text-2xl">🍪</span>
              </div>
              <div class="flex-1 space-y-2">
                <h3 [class]="'font-bold text-lg ' + getCurrentTheme().text">
                  Cookies und lokale Speicherung
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  MenuForge nutzt ausschließlich <strong>technisch notwendige</strong> lokale Speicherung in Ihrem Browser, 
                  um Ihre Menü-Daten und Einstellungen zu speichern. Diese Daten verlassen nie Ihr Gerät und werden 
                  <strong>nicht an uns übertragen</strong>. Keine Tracking-Cookies, keine Analyse-Tools.
                </p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                    <span class="mr-1">✓</span> 100% DSGVO-konform
                  </span>
                  <span class="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                    <span class="mr-1">🔒</span> Keine Datenübertragung
                  </span>
                  <span class="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                    <span class="mr-1">💾</span> Lokal gespeichert
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <button
                (click)="showDetails()"
                class="px-4 py-2 text-sm border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              >
                <span>📄</span>
                <span>Details anzeigen</span>
              </button>
              <button
                (click)="acceptAll()"
                class="px-6 py-2 text-sm font-bold text-black rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg"
                [style.backgroundColor]="getCurrentTheme().primary"
              >
                <span>✓</span>
                <span>Akzeptieren</span>
              </button>
            </div>
          </div>

          <!-- Details Bereich (ausklappbar) -->
          <div 
            *ngIf="showDetailedInfo()"
            class="mt-6 pt-6 border-t border-white/20 space-y-4 animate-fade-in"
          >
            <h4 class="font-semibold text-white">Was speichern wir lokal?</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-green-400">💾</span>
                  <span class="font-medium text-white">Menü-Daten</span>
                </div>
                <p class="text-gray-400">Restaurant-Name, Kategorien, Gerichte und Preise</p>
              </div>
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-blue-400">🎨</span>
                  <span class="font-medium text-white">Design-Einstellungen</span>
                </div>
                <p class="text-gray-400">Gewählte Themes, Schriftarten und Logos</p>
              </div>
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-purple-400">⚙️</span>
                  <span class="font-medium text-white">App-Status</span>
                </div>
                <p class="text-gray-400">Aktueller Zustand und Benutzereinstellungen</p>
              </div>
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-yellow-400">🍪</span>
                  <span class="font-medium text-white">Cookie-Präferenzen</span>
                </div>
                <p class="text-gray-400">Ihre Zustimmung zu dieser Erklärung</p>
              </div>
            </div>
            <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-green-400">🔒</span>
                <span class="font-semibold text-green-400">Datenschutz-Garantie</span>
              </div>
              <p class="text-sm text-gray-300">
                Alle Ihre Daten bleiben zu 100% auf Ihrem Gerät. MenuForge überträgt keine persönlichen 
                Daten an unsere Server oder Dritte. Sie haben jederzeit die volle Kontrolle über Ihre Daten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-up {
      animation: slide-up 0.5s ease-out;
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class CookieBannerComponent {
  private legalService = inject(LegalService);
  private themeService = inject(ThemeService);
  
  showDetailedInfo = signal(false);

  shouldShow(): boolean {
    return this.legalService.shouldShowCookieBanner();
  }

  getCurrentTheme() {
    return this.themeService.getCurrentTheme();
  }

  acceptAll() {
    this.legalService.acceptCookies();
  }

  showDetails() {
    this.showDetailedInfo.update(current => !current);
  }
}