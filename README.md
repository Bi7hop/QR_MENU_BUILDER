# 🍽️ MenuForge

<div align="center">

![MenuForge Logo](https://img.shields.io/badge/🍽️-MenuForge-00ff88?style=for-the-badge&labelColor=1a1a1a)

**The Modern QR Code Menu Generator for the Next Generation**

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-00ff88?style=flat-square)](LICENSE)

[🚀 Live Demo](https://menuforge.app) | [📖 Documentation](#documentation) | [🐛 Issues](https://github.com/yourusername/menuforge/issues) | [💫 Features](#features)

</div>

---

## ✨ What is MenuForge?

MenuForge is an innovative **web application** for creating digital restaurant menus with QR code integration. Restaurant owners can create stunning, mobile-optimized menus in minutes that customers can easily access by scanning a QR code with their smartphone.

### 🎯 Why MenuForge?

- ✅ **100% GDPR Compliant** - All data stays locally on your device
- 🚀 **No Installation Required** - Runs directly in your browser
- 📱 **Mobile-First Design** - Optimized for all devices
- 🎨 **Drag & Drop Editor** - Intuitive user experience
- ⚡ **Instant Export** - QR code generated in seconds
- 🌐 **Offline Capable** - Works without internet connection

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎨 **Design Studio**
- 5 pre-built themes (Neon, Sunset, Ocean, Forest, Platinum)
- Customizable fonts (Inter, Poppins, Roboto, Montserrat)
- Logo upload with automatic optimization
- Real-time preview of all changes

### 📋 **Menu Builder**
- Drag & Drop sorting (Desktop)
- Touch-optimized mobile interface
- Categories with custom icons
- Featured dish highlighting
- Unlimited categories and dishes

</td>
<td width="50%">

### 📱 **QR Code Generator**
- High-resolution QR codes (PNG/SVG)
- Logo integration in QR codes
- Print-optimized output
- Instant download
- Multiple export formats

### 🌐 **Export & Sharing**
- Responsive HTML export
- Mobile-optimized menu view
- Direct link sharing
- Print-friendly layouts
- Social media integration

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

### Prerequisites
- Node.js 18+ 
- npm 10+
- Modern Browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/menuforge.git
cd menuforge

# Install dependencies
npm install

# Start development server
npm run start
```

The application will be available at `http://localhost:4200`.

### 🔧 Available Scripts

```bash
npm run start          # Development server (Port 4200)
npm run build          # Production build
npm run build:prod     # Optimized production build
npm run test           # Run unit tests
npm run lint           # Code linting
npm run serve:prod     # Serve production build locally
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── design-customizer/   # Theme & Design Editor
│   │   ├── menu-builder/        # Drag & Drop Menu Editor
│   │   ├── menu-preview/        # Live Preview
│   │   ├── qr-generator/        # QR Code Generator
│   │   └── legal/              # Legal Pages (Privacy, Imprint)
│   ├── services/            # Business Logic
│   │   ├── menu.service.ts      # Menu Management
│   │   ├── theme.service.ts     # Theme Management
│   │   ├── qr-code.service.ts   # QR Code Generation
│   │   ├── export.service.ts    # HTML Export
│   │   └── legal.service.ts     # GDPR Compliance
│   ├── models/              # TypeScript Interfaces
│   └── app.component.ts     # Main Component
├── assets/                  # Static Assets
└── styles.scss             # Global Styles
```

---

## 🎯 Usage

### 1. Configure Restaurant
```typescript
// Example: Set restaurant data
const restaurant = {
  name: "Bella Vista",
  description: "Italian Cuisine & Wine Bar",
  theme: "sunset",
  font: "Poppins"
};
```

### 2. Create Menu
```typescript
// Example: Add category
const category = {
  id: 1,
  category: "🍝 Pasta",
  items: [
    {
      name: "Spaghetti Carbonara",
      description: "Classic with egg, bacon and parmesan",
      price: 12.90,
      featured: true
    }
  ]
};
```

### 3. Generate QR Code
```typescript
// Example: Create QR code
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
<summary><strong>📅 Version 2.0 (Q2 2025)</strong></summary>

- [ ] 🌍 Multi-Language Support (EN, FR, IT, ES)
- [ ] 🎭 Additional Theme Options (Dark Mode, Custom Colors)
- [ ] 📤 PDF Export for Menus
- [ ] 🖼️ Enhanced Image Integration
- [ ] 📋 Menu Templates & Presets

</details>

<details>
<summary><strong>🚀 Version 2.5 (Q4 2025)</strong></summary>

- [ ] 📱 Progressive Web App (PWA)
- [ ] 💾 Import/Export Menu Data (JSON/CSV)
- [ ] 🔗 Advanced QR Code Options
- [ ] 📊 Simple Analytics (Scans, Views)
- [ ] 🎨 Drag & Drop Theme Editor

</details>

---

## 🤝 Contributing

We welcome contributions from everyone! Here's how you can help:

### 🐛 Bug Reports
Found a bug? [Create an issue](https://github.com/yourusername/menuforge/issues/new?template=bug_report.md)

### 💡 Feature Requests
Have an idea? [Share it with us](https://github.com/yourusername/menuforge/issues/new?template=feature_request.md)

### 🛠️ Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOURUSERNAME/menuforge.git

# Create a branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "feat: add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Create Pull Request
```

### 📋 Code Style

- Use **TypeScript** for all new files
- Follow the **Angular Style Guide**
- Write **tests** for new features
- Use **Conventional Commits**

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Support & Community

<div align="center">

### Need Help?

[![Email](https://img.shields.io/badge/Email-marcel.menke1981@gmail.com-00ff88?style=for-the-badge&logo=gmail&logoColor=white)](mailto:marcel.menke1981@gmail.com)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-00ff88?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/menuforge/issues)

### Follow Us

[![Website](https://img.shields.io/badge/Website-MenuForge.app-00ff88?style=for-the-badge&logo=globe&logoColor=white)](https://menuforge.app)

</div>

---

<div align="center">

**Built with ❤️ for the Restaurant Industry**

*MenuForge - Digital Menus. Simple. Fast. Modern.*

⭐ **Star us on GitHub** | 🍴 **Fork the Project** | 📢 **Share MenuForge**

</div>
