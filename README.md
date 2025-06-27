# 🍽️ MenuForge

<div align="center">

![MenuForge Logo](https://img.shields.io/badge/🍽️-MenuForge-00ff88?style=for-the-badge&labelColor=1a1a1a)

**Der moderne QR-Code Menü-Generator der nächsten Generation**

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-00ff88?style=flat-square)](LICENSE)

[🚀 Demo](https://menuforge.app) | [📖 Dokumentation](#dokumentation) | [🐛 Issues](https://github.com/yourusername/menuforge/issues) | [💫 Features](#features)

</div>

---

## ✨ Was ist MenuForge?

MenuForge ist eine innovative **Web-Anwendung** zur Erstellung digitaler Restaurantmenüs mit QR-Code-Integration. Gastronomen können damit in wenigen Minuten ansprechende, mobile-optimierte Menüs erstellen, die Gäste einfach mit ihrem Smartphone scannen können.

### 🎯 Warum MenuForge?

- ✅ **100% DSGVO-konform** - Alle Daten bleiben lokal auf dem Gerät
- 🚀 **Keine Installation** - Läuft direkt im Browser
- 📱 **Mobile-First Design** - Optimiert für alle Geräte
- 🎨 **Drag & Drop Editor** - Intuitive Bedienung
- ⚡ **Sofortiger Export** - QR-Code in Sekunden generiert
- 🌐 **Offline-fähig** - Funktioniert auch ohne Internet

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎨 **Design Studio**
- 5 vorgefertigte Themes (Neon, Sunset, Ocean, Forest, Platinum)
- Anpassbare Schriftarten (Inter, Poppins, Roboto, Montserrat)
- Logo-Upload mit automatischer Optimierung
- Live-Vorschau aller Änderungen

### 📋 **Menu Builder**
- Drag & Drop Sortierung (Desktop)
- Touch-optimierte Mobile-Bedienung
- Kategorien mit benutzerdefinierten Icons
- Featured-Gerichte Highlighting
- Unbegrenzte Kategorien und Gerichte

</td>
<td width="50%">

### 📱 **QR-Code Generator**
- Hochauflösende QR-Codes (PNG/SVG)
- Logo-Integration in QR-Codes
- Druckoptimierte Ausgabe
- Sofortiger Download
- Verschiedene Ausgabeformate

### 🌐 **Export & Sharing**
- Responsive HTML-Export
- Mobile-optimierte Menü-Ansicht
- Direkter Link-Export
- Print-freundliche Layouts
- Social Media Integration

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Angular](https://img.shields.io/badge/Angular-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

### Libraries & Tools
![QRCode.js](https://img.shields.io/badge/QRCode.js-1.5-000000?style=for-the-badge&logo=qr-code&logoColor=white)
![Angular CDK](https://img.shields.io/badge/Angular_CDK-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-8.5-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-0.523-F56565?style=for-the-badge&logo=lucide&logoColor=white)

### Development
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-10+-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Angular CLI](https://img.shields.io/badge/Angular_CLI-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)

</div>

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+ 
- npm 10+
- Modern Browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Repository klonen
git clone https://github.com/yourusername/menuforge.git
cd menuforge

# Dependencies installieren
npm install

# Development Server starten
npm run start
```

Die Anwendung ist dann unter `http://localhost:4200` verfügbar.

### 🔧 Verfügbare Scripts

```bash
npm run start          # Development Server (Port 4200)
npm run build          # Production Build
npm run build:prod     # Optimized Production Build
npm run test           # Unit Tests ausführen
npm run lint           # Code Linting
npm run serve:prod     # Production Build lokal testen
```

---

## 🏗️ Projektstruktur

```
src/
├── app/
│   ├── components/           # UI Komponenten
│   │   ├── design-customizer/   # Theme & Design Editor
│   │   ├── menu-builder/        # Drag & Drop Menu Editor
│   │   ├── menu-preview/        # Live Vorschau
│   │   ├── qr-generator/        # QR-Code Generator
│   │   └── legal/              # Impressum & Datenschutz
│   ├── services/            # Business Logic
│   │   ├── menu.service.ts      # Menu Management
│   │   ├── theme.service.ts     # Theme Management
│   │   ├── qr-code.service.ts   # QR-Code Generation
│   │   ├── export.service.ts    # HTML Export
│   │   └── legal.service.ts     # DSGVO Compliance
│   ├── models/              # TypeScript Interfaces
│   └── app.component.ts     # Haupt-Komponente
├── assets/                  # Statische Assets
└── styles.scss             # Globale Styles
```

---

## 🎯 Verwendung

### 1. Restaurant konfigurieren
```typescript
// Beispiel: Restaurant-Daten setzen
const restaurant = {
  name: "Bella Vista",
  description: "Italienische Küche & Weinbar",
  theme: "sunset",
  font: "Poppins"
};
```

### 2. Menü erstellen
```typescript
// Beispiel: Kategorie hinzufügen
const category = {
  id: 1,
  category: "🍝 Pasta",
  items: [
    {
      name: "Spaghetti Carbonara",
      description: "Klassisch mit Ei, Speck und Parmesan",
      price: 12.90,
      featured: true
    }
  ]
};
```

### 3. QR-Code generieren
```typescript
// Beispiel: QR-Code erstellen
const qrOptions = {
  width: 300,
  margin: 2,
  color: { dark: '#000000', light: '#FFFFFF' }
};

const qrCode = await qrService.generateQRCode(menuUrl, qrOptions);
```

---

## 🔮 Roadmap

<details>
<summary><strong>📅 Version 2.0 (Q3 2025)</strong></summary>

- [ ] 🌍 Multi-Language Support (EN, FR, IT, ES)
- [ ] 🎭 Weitere Theme-Optionen (Dark Mode, Custom Colors)
- [ ] 📤 PDF-Export für Menüs
- [ ] 🖼️ Erweiterte Bild-Integration
- [ ] 📋 Menü-Templates & Vorlagen

</details>

<details>
<summary><strong>🚀 Version 2.5 (Q4 2025)</strong></summary>

- [ ] 📱 Progressive Web App (PWA)
- [ ] 💾 Import/Export von Menü-Daten (JSON/CSV)
- [ ] 🔗 Erweiterte QR-Code Optionen
- [ ] 📊 Einfache Analytics (Scans, Views)
- [ ] 🎨 Drag & Drop Theme Editor

</details>

---

## 🤝 Contributing

Wir freuen uns über jeden Beitrag! Hier ist wie du helfen kannst:

### 🐛 Bug Reports
Gefunden einen Bug? [Erstelle ein Issue](https://github.com/yourusername/menuforge/issues/new?template=bug_report.md)

### 💡 Feature Requests
Hast du eine Idee? [Teile sie mit uns](https://github.com/yourusername/menuforge/issues/new?template=feature_request.md)

### 🛠️ Development Setup

```bash
# Fork das Repository
# Clone dein Fork
git clone https://github.com/DEINUSERNAME/menuforge.git

# Branch erstellen
git checkout -b feature/amazing-feature

# Änderungen committen
git commit -m "feat: add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Pull Request erstellen
```

### 📋 Code Style

- Verwende **TypeScript** für alle neuen Dateien
- Folge der **Angular Style Guide**
- Schreibe **Tests** für neue Features
- Verwende **Conventional Commits**

---

## 📜 License

Dieses Projekt steht unter der **MIT License** - siehe [LICENSE](LICENSE) für Details.

---

## 🙋‍♂️ Support & Community

<div align="center">

### Brauchen Sie Hilfe?

[![Email](https://img.shields.io/badge/Email-marcel.menke1981@gmail.com-00ff88?style=for-the-badge&logo=gmail&logoColor=white)](mailto:marcel.menke1981@gmail.com)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-00ff88?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/menuforge/issues)

### Folgen Sie uns

[![Website](https://img.shields.io/badge/Website-MenuForge.app-00ff88?style=for-the-badge&logo=globe&logoColor=white)](https://menuforge.app)

</div>

---

<div align="center">

**Erstellt mit ❤️ für die Gastronomie-Branche**

*MenuForge - Digitale Menüs. Einfach. Schnell. Modern.*

⭐ **Star uns auf GitHub** | 🍴 **Fork das Projekt** | 📢 **Teile MenuForge**

</div>
