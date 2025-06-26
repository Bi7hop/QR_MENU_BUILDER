import { Injectable } from '@angular/core';
import { Restaurant, MenuCategory, Theme } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class MenuExportService {

  generateMenuHTML(restaurant: Restaurant, categories: MenuCategory[], theme: Theme): string {
    const logoSection = restaurant.logo ? 
      `<div class="logo">
        <img src="${restaurant.logo}" alt="${restaurant.name} Logo">
      </div>` : '';

    const categoriesHTML = categories.map(category => `
      <div class="category">
        <h2 class="category-title">${category.category}</h2>
        <div class="items">
          ${category.items.map(item => `
            <div class="item ${item.featured ? 'featured' : ''}">
              <div class="item-content">
                <div class="item-header">
                  <h3 class="item-name">${item.name}</h3>
                  ${item.featured ? '<span class="featured-badge">FEATURED</span>' : ''}
                </div>
                <p class="item-description">${item.description}</p>
              </div>
              <div class="item-price">€${item.price.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurant.name} - Menü</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${restaurant.font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${restaurant.font}', sans-serif;
            background: linear-gradient(135deg, ${theme.primary}08, ${theme.secondary}08);
            min-height: 100vh;
            color: #2d3748;
            line-height: 1.6;
            padding: 20px;
        }
        
        /* Dark theme für moderne Restaurants */
        @media (prefers-color-scheme: dark) {
            body {
                background: linear-gradient(135deg, #1a202c, #2d3748);
                color: #e2e8f0;
            }
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
        }
        
        @media (prefers-color-scheme: dark) {
            .container {
                background: rgba(45, 55, 72, 0.95);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
            }
        }
        
        .header {
            text-align: center;
            padding: 50px 30px;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></svg>');
        }
        
        .logo img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            margin: 0 auto 20px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.15);
            padding: 10px;
            backdrop-filter: blur(10px);
        }
        
        .restaurant-name {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .restaurant-description {
            font-size: 1.3rem;
            opacity: 0.95;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }
        
        .menu-content {
            padding: 40px 30px;
        }
        
        .category {
            margin-bottom: 40px;
            border-radius: 20px;
            overflow: hidden;
            background: linear-gradient(145deg, #f8fafc, #f1f5f9);
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        
        @media (prefers-color-scheme: dark) {
            .category {
                background: linear-gradient(145deg, #4a5568, #2d3748);
            }
        }
        
        .category-title {
            background: linear-gradient(135deg, ${theme.primary}f0, ${theme.secondary}f0);
            color: white;
            padding: 25px 30px;
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .category-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, ${theme.accent}, transparent);
        }
        
        .items {
            padding: 25px 30px;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 25px 20px;
            margin-bottom: 15px;
            border-radius: 16px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @media (prefers-color-scheme: dark) {
            .item {
                background: rgba(74, 85, 104, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
        
        .item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
            background: rgba(255, 255, 255, 0.9);
        }
        
        @media (prefers-color-scheme: dark) {
            .item:hover {
                background: rgba(74, 85, 104, 0.9);
            }
        }
        
        .item:last-child {
            margin-bottom: 0;
        }
        
        .item.featured {
            background: linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}15);
            border: 2px solid ${theme.primary}40;
            transform: scale(1.02);
        }
        
        .item.featured::before {
            content: '✨';
            position: absolute;
            top: -5px;
            right: -5px;
            font-size: 1.2rem;
        }
        
        .item-content {
            flex: 1;
            margin-right: 25px;
        }
        
        .item-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }
        
        .item-name {
            font-size: 1.4rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
            line-height: 1.3;
        }
        
        @media (prefers-color-scheme: dark) {
            .item-name {
                color: #e2e8f0;
            }
        }
        
        .featured-badge {
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .item-description {
            color: #718096;
            margin: 0;
            font-size: 1rem;
            line-height: 1.6;
            font-weight: 400;
        }
        
        @media (prefers-color-scheme: dark) {
            .item-description {
                color: #a0aec0;
            }
        }
        
        .item-price {
            font-size: 1.8rem;
            font-weight: 700;
            color: ${theme.primary};
            text-align: right;
            min-width: 100px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            color: #718096;
            font-size: 0.9rem;
            border-top: 1px solid #e2e8f0;
        }
        
        @media (prefers-color-scheme: dark) {
            .footer {
                background: linear-gradient(135deg, #2d3748, #4a5568);
                color: #a0aec0;
                border-top: 1px solid #4a5568;
            }
        }
        
        .powered-by {
            color: ${theme.primary};
            font-weight: 600;
            text-decoration: none;
        }
        
        /* Mobile Responsive - Verbessert */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .container {
                border-radius: 16px;
                margin: 0;
            }
            
            .header {
                padding: 25px 15px;
            }
            
            .restaurant-name {
                font-size: 2.2rem;
                line-height: 1.1;
            }
            
            .restaurant-description {
                font-size: 1rem;
            }
            
            .menu-content {
                padding: 20px 15px;
            }
            
            .category {
                margin-bottom: 25px;
            }
            
            .category-title {
                padding: 15px 20px;
                font-size: 1.3rem;
            }
            
            .items {
                padding: 15px 20px;
            }
            
            .item {
                flex-direction: column;
                align-items: flex-start;
                padding: 15px 12px;
                margin-bottom: 12px;
            }
            
            .item-content {
                margin-right: 0;
                margin-bottom: 12px;
                width: 100%;
            }
            
            .item-price {
                text-align: left;
                min-width: auto;
                font-size: 1.6rem;
                align-self: flex-start;
                width: 100%;
            }
            
            .item-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;
            }
            
            .item-name {
                font-size: 1.2rem;
            }
            
            .footer {
                padding: 20px 15px;
                font-size: 0.8rem;
            }
        }
        
        /* Sehr kleine Bildschirme */
        @media (max-width: 480px) {
            .header {
                padding: 20px 12px;
            }
            
            .restaurant-name {
                font-size: 1.8rem;
            }
            
            .restaurant-description {
                font-size: 0.9rem;
            }
            
            .category-title {
                font-size: 1.2rem;
                padding: 12px 15px;
            }
            
            .item {
                padding: 12px 10px;
            }
            
            .item-name {
                font-size: 1.1rem;
            }
            
            .item-description {
                font-size: 0.9rem;
            }
            
            .item-price {
                font-size: 1.4rem;
            }
            
            .logo img {
                width: 80px;
                height: 80px;
            }
        }
        
        /* Print Styles */
        @media print {
            body {
                background: white !important;
                color: black !important;
            }
            
            .container {
                box-shadow: none !important;
                background: white !important;
            }
            
            .header {
                background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}) !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .category-title {
                background: linear-gradient(135deg, ${theme.primary}f0, ${theme.secondary}f0) !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
        
        /* Animationen */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .category {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .item {
            animation: fadeInUp 0.4s ease-out;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${logoSection}
            <h1 class="restaurant-name">${restaurant.name}</h1>
            <p class="restaurant-description">${restaurant.description}</p>
        </div>
        
        <div class="menu-content">
            ${categoriesHTML}
        </div>
        
        <div class="footer">
            <p>Erstellt mit <a href="#" class="powered-by">MenuForge</a> • ${new Date().toLocaleDateString('de-DE')}</p>
        </div>
    </div>
</body>
</html>`;
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';
    
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ].join(', ');
  }
}