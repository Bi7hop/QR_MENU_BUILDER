import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalService } from '../../../services/legal.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <div class="text-center mb-8">
        <h1 [class]="'text-3xl font-bold mb-4 ' + getCurrentTheme().text">Impressum</h1>
        <p class="text-gray-400">Angaben gemäß § 5 TMG</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Unternehmensdaten -->
        <section 
          class="bg-white/5 rounded-xl p-6 border border-white/10"
          [style.borderColor]="getCurrentTheme().primary + '30'"
        >
          <h2 [class]="'text-xl font-semibold mb-4 flex items-center space-x-2 ' + getCurrentTheme().text">
            <span class="text-2xl">🏢</span>
            <span>Unternehmen</span>
          </h2>
          <div class="text-gray-300 space-y-3">
            <div>
              <p class="font-semibold text-white">{{ legalInfo().companyName }}</p>
              <p class="text-sm text-gray-400">Digital Menu Solutions</p>
            </div>
            <div>
              <p class="font-medium">Geschäftsführer:</p>
              <p>{{ legalInfo().ceoName }}</p>
            </div>
            <div>
              <p class="font-medium">Anschrift:</p>
              <p>{{ legalInfo().companyAddress }}</p>
            </div>
          </div>
        </section>

        <!-- Kontaktdaten -->
        <section 
          class="bg-white/5 rounded-xl p-6 border border-white/10"
          [style.borderColor]="getCurrentTheme().secondary + '30'"
        >
          <h2 [class]="'text-xl font-semibold mb-4 flex items-center space-x-2 ' + getCurrentTheme().text">
            <span class="text-2xl">📞</span>
            <span>Kontakt</span>
          </h2>
          <div class="text-gray-300 space-y-3">
            <div class="flex items-center space-x-3">
              <span class="text-blue-400">📧</span>
              <div>
                <p class="font-medium">E-Mail:</p>
                <a 
                  href="mailto:{{ legalInfo().companyEmail }}" 
                  class="text-blue-400 hover:underline transition-colors duration-300"
                >
                  {{ legalInfo().companyEmail }}
                </a>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-green-400">📱</span>
              <div>
                <p class="font-medium">Telefon:</p>
                <a 
                  href="tel:{{ legalInfo().companyPhone }}" 
                  class="text-green-400 hover:underline transition-colors duration-300"
                >
                  {{ legalInfo().companyPhone }}
                </a>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-purple-400">🌐</span>
              <div>
                <p class="font-medium">Website:</p>
                <a 
                  href="https://menuforge.app" 
                  class="text-purple-400 hover:underline transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.menuforge.app
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Rechtliche Hinweise -->
        <section 
          class="bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-2"
          [style.borderColor]="getCurrentTheme().accent + '30'"
        >
          <h2 [class]="'text-xl font-semibold mb-4 flex items-center space-x-2 ' + getCurrentTheme().text">
            <span class="text-2xl">⚖️</span>
            <span>Rechtliche Hinweise</span>
          </h2>
          <div class="text-gray-300 space-y-4">
            <div>
              <h3 class="font-semibold text-white mb-2">Haftungsausschluss</h3>
              <p class="text-sm leading-relaxed">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-white mb-2">Urheberrecht</h3>
              <p class="text-sm leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-white mb-2">Datenschutz</h3>
              <p class="text-sm leading-relaxed">
                Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. 
                Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf 
                freiwilliger Basis. Eine Weitergabe der Daten an Dritte erfolgt nicht.
              </p>
            </div>
          </div>
        </section>

        <!-- App-Info -->
        <section 
          class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10 md:col-span-2"
        >
          <h2 [class]="'text-xl font-semibold mb-4 flex items-center space-x-2 ' + getCurrentTheme().text">
            <span class="text-2xl">📱</span>
            <span>Über MenuForge</span>
          </h2>
          <div class="text-gray-300 space-y-3">
            <p class="leading-relaxed">
              MenuForge ist eine innovative Web-Anwendung zur Erstellung digitaler Restaurantmenüs. 
              Unsere Plattform ermöglicht es Gastronomen, ansprechende QR-Code-Menüs zu erstellen, 
              die Gäste einfach mit ihrem Smartphone scannen können.
            </p>
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                <span>✨</span>
                <span class="text-sm">Keine Installation erforderlich</span>
              </div>
              <div class="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                <span>🔒</span>
                <span class="text-sm">100% DSGVO-konform</span>
              </div>
              <div class="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                <span>💾</span>
                <span class="text-sm">Lokale Datenspeicherung</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Kontakt-Button -->
      <div class="text-center pt-8">
        <a 
          href="mailto:{{ legalInfo().companyEmail }}"
          class="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-black transition-all duration-300 hover:scale-105 shadow-xl"
          [style.backgroundColor]="getCurrentTheme().primary"
        >
          <span>📧</span>
          <span>Kontakt aufnehmen</span>
        </a>
      </div>
    </div>
  `
})
export class ImprintComponent {
  private legalService = inject(LegalService);
  private themeService = inject(ThemeService);

  getCurrentTheme() {
    return this.themeService.getCurrentTheme();
  }

  legalInfo() {
    return this.legalService.getLegalInfo();
  }
}