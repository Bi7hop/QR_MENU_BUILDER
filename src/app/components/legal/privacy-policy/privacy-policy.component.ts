import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalService } from '../../../services/legal.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <div class="text-center mb-8">
        <h1 [class]="'text-3xl font-bold mb-4 ' + getCurrentTheme().text">Datenschutzerklärung</h1>
        <p class="text-gray-400">Letzte Aktualisierung: {{ getCurrentDate() }}</p>
      </div>

      <div 
        class="prose prose-invert max-w-none space-y-6"
        [class]="getCurrentTheme().text"
      >
        <!-- Einleitung -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">1. Einleitung</h2>
          <p class="text-gray-300 leading-relaxed">
            Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie darüber, 
            wie {{ legalInfo().companyName }} Ihre Daten sammelt, verwendet und schützt, wenn Sie unsere 
            MenuForge-Anwendung nutzen.
          </p>
        </section>

        <!-- Verantwortlicher -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">2. Verantwortlicher</h2>
          <div class="text-gray-300 space-y-2">
            <p><strong>{{ legalInfo().companyName }}</strong></p>
            <p>{{ legalInfo().companyAddress }}</p>
            <p>E-Mail: <a href="mailto:{{ legalInfo().companyEmail }}" class="text-blue-400 hover:underline">{{ legalInfo().companyEmail }}</a></p>
            <p>Telefon: {{ legalInfo().companyPhone }}</p>
            <p>Geschäftsführer: {{ legalInfo().ceoName }}</p>
          </div>
        </section>

        <!-- Datenerhebung -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">3. Datenerhebung und -verwendung</h2>
          <div class="text-gray-300 space-y-4">
            <h3 class="text-lg font-medium">3.1 Menü-Daten</h3>
            <p>
              Wenn Sie MenuForge nutzen, werden die von Ihnen erstellten Menü-Daten (Restaurant-Name, 
              Beschreibung, Speisen, Preise) lokal in Ihrem Browser gespeichert. Diese Daten werden 
              nicht an unsere Server übertragen.
            </p>
            
            <h3 class="text-lg font-medium">3.2 QR-Code Generierung</h3>
            <p>
              Für die QR-Code Generierung werden Ihre Menü-Daten temporär verarbeitet, um eine 
              Web-Version Ihres Menüs zu erstellen. Diese Verarbeitung erfolgt client-seitig in 
              Ihrem Browser.
            </p>
            
            <h3 class="text-lg font-medium">3.3 Local Storage</h3>
            <p>
              Die Anwendung nutzt den Local Storage Ihres Browsers, um Ihre Einstellungen und 
              Menü-Daten zu speichern. Diese Daten verbleiben auf Ihrem Gerät und werden nicht 
              an uns übertragen.
            </p>
          </div>
        </section>

        <!-- Cookies -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">4. Cookies und Local Storage</h2>
          <div class="text-gray-300 space-y-4">
            <p>
              MenuForge verwendet ausschließlich technisch notwendige Cookies und Local Storage 
              für das ordnungsgemäße Funktionieren der Anwendung:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Menü-Daten:</strong> Speicherung Ihrer erstellten Menüs</li>
              <li><strong>Design-Einstellungen:</strong> Gewählte Themes und Schriftarten</li>
              <li><strong>App-Status:</strong> Aktueller Zustand der Anwendung</li>
              <li><strong>Cookie-Präferenzen:</strong> Ihre Zustimmung zu dieser Erklärung</li>
            </ul>
          </div>
        </section>

        <!-- Ihre Rechte -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">5. Ihre Rechte</h2>
          <div class="text-gray-300 space-y-4">
            <p>Da alle Daten lokal in Ihrem Browser gespeichert werden, haben Sie jederzeit die volle Kontrolle:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Zugriff:</strong> Sie können jederzeit auf Ihre gespeicherten Daten zugreifen</li>
              <li><strong>Berichtigung:</strong> Sie können Ihre Daten jederzeit ändern</li>
              <li><strong>Löschung:</strong> Sie können alle Daten durch Löschen des Browser-Cache entfernen</li>
              <li><strong>Datenübertragbarkeit:</strong> Sie können Ihre Menüs als HTML- oder Bilddateien exportieren</li>
            </ul>
          </div>
        </section>

        <!-- Kontakt -->
        <section class="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 class="text-xl font-semibold mb-4">6. Kontakt</h2>
          <div class="text-gray-300">
            <p>
              Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren:
            </p>
            <div class="mt-4 p-4 bg-black/20 rounded-lg">
              <p><strong>{{ legalInfo().companyName }}</strong></p>
              <p>{{ legalInfo().companyAddress }}</p>
              <p>E-Mail: <a href="mailto:{{ legalInfo().companyEmail }}" class="text-blue-400 hover:underline">{{ legalInfo().companyEmail }}</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .prose h2 {
      color: inherit;
    }
    .prose h3 {
      color: inherit;
    }
    .prose p {
      color: inherit;
    }
  `]
})
export class PrivacyPolicyComponent {
  private legalService = inject(LegalService);
  private themeService = inject(ThemeService);

  getCurrentTheme() {
    return this.themeService.getCurrentTheme();
  }

  legalInfo() {
    return this.legalService.getLegalInfo();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('de-DE');
  }
}