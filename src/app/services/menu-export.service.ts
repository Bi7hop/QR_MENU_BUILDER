import { Injectable } from '@angular/core';
import { Restaurant, MenuCategory, Theme } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class MenuExportService {

  generateMenuHTML(restaurant: Restaurant, categories: MenuCategory[], theme: Theme): string {
    const logoSection = restaurant.logo ? 
      `<div class="mb-4">
        <img src="${restaurant.logo}" alt="Logo" class="w-24 h-24 mx-auto object-contain rounded-xl">
      </div>` : '';

    const categoriesHTML = categories.map(category => `
      <div class="space-y-4 mb-8">
        <div class="border-b border-white/20 pb-2">
          <h2 class="text-2xl font-bold text-white" style="font-family: '${restaurant.font}', sans-serif;">
            ${category.category}
          </h2>
        </div>
        <div class="space-y-4">
          ${category.items.map(item => `
            <div class="item p-4 rounded-xl transition-all duration-300 ${item.featured ? 'bg-green-400/10 border border-green-400/30' : 'bg-white/5 hover:bg-white/10'}" 
                 data-item-id="${item.id}" 
                 data-item-price="${item.price}" 
                 data-item-name="${item.name}" 
                 data-item-type="${category.type}">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-lg font-semibold text-white" style="font-family: '${restaurant.font}', sans-serif;">
                      ${item.name}
                    </h3>
                    ${item.featured ? '<span class="px-2 py-1 bg-green-400 text-black text-xs rounded-full font-bold">FEATURED</span>' : ''}
                  </div>
                  <p class="text-white/70 text-sm leading-relaxed mb-3" style="font-family: '${restaurant.font}', sans-serif;">
                    ${item.description}
                  </p>
                  
                  <!-- Order Controls -->
                  <div class="order-controls space-y-3">
                    <!-- Add to Cart / Quantity Controls -->
                    <div class="add-to-cart-container">
                      <button class="add-to-cart-btn flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors" 
                              onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${category.type}')">
                        <span>✓</span>
                        <span>Auswählen</span>
                      </button>
                    </div>
                    
                    <div class="quantity-controls" style="display: none;">
                      <!-- Quantity Controls -->
                      <div class="flex items-center space-x-3 mb-2">
                        <button onclick="decreaseQuantity(${item.id})" 
                                class="w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center">
                          <span class="text-white">−</span>
                        </button>
                        <span class="quantity-display w-8 text-center font-semibold text-white">1</span>
                        <button onclick="increaseQuantity(${item.id})" 
                                class="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center">
                          <span class="text-white font-bold">+</span>
                        </button>
                        <button onclick="removeFromCart(${item.id})" 
                                class="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors">
                          ×
                        </button>
                      </div>
                      
                      <!-- Special Request -->
                      <input type="text" 
                             class="special-request w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:border-green-400 transition-colors" 
                             placeholder="Extrawünsche (optional)..." 
                             onchange="updateSpecialRequest(${item.id}, this.value)">
                    </div>
                  </div>
                </div>
                <div class="ml-4 text-right">
                  <div class="text-xl font-bold text-green-400" style="font-family: '${restaurant.font}', sans-serif;">
                    €${item.price.toFixed(2)}
                  </div>
                </div>
              </div>
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
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=${restaurant.font.replace(' ', '+')}:wght@300;400;500;600;700;800&display=swap');
        
        body {
            font-family: '${restaurant.font}', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom right, ${this.getBgGradient(theme.bg)});
            min-height: 100vh;
            transition: all 1s;
            padding-bottom: 120px; /* Space for floating cart */
        }
        
        .item.in-cart {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Floating Cart Button */
        .floating-cart {
            position: fixed;
            bottom: 16px;
            left: 16px;
            right: 16px;
            z-index: 50;
            max-width: 28rem;
            margin: 0 auto;
            display: none;
        }
        
        .floating-cart button {
            width: 100%;
            backdrop-filter: blur(40px);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 1rem;
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .floating-cart button:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.02);
        }
        
        .cart-icon {
            width: 3rem;
            height: 3rem;
            background: #10b981;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        
        .cart-badge {
            position: absolute;
            top: -0.5rem;
            right: -0.5rem;
            width: 1.5rem;
            height: 1.5rem;
            background: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Cart Modal */
        .cart-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            z-index: 100;
            padding: 1rem;
            overflow-y: auto;
        }
        
        .cart-modal-content {
            background: rgba(31, 41, 55, 0.95);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            max-width: 32rem;
            margin: 3rem auto;
            border-radius: 1.5rem;
            padding: 2rem;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .cart-close {
            position: absolute;
            top: 1rem;
            right: 1.25rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: white;
            transition: color 0.3s;
        }
        
        .cart-close:hover {
            color: #10b981;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(55, 65, 81, 1);
            color: white;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-total-section {
            border-top: 2px solid rgba(55, 65, 81, 1);
            padding-top: 1.25rem;
            margin-top: 1.25rem;
            color: white;
        }
        
        .customer-form {
            margin: 1.25rem 0;
            padding: 1.25rem;
            background: rgba(45, 55, 72, 1);
            border-radius: 0.75rem;
        }
        
        .customer-form h3 {
            color: white;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.25rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid rgba(75, 85, 99, 1);
            border-radius: 0.75rem;
            font-size: 1rem;
            background: rgba(55, 65, 81, 1);
            color: white;
            transition: all 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #10b981;
            background: rgba(75, 85, 99, 1);
        }
        
        .form-group input::placeholder {
            color: rgba(156, 163, 175, 1);
        }
        
        .submit-order-btn {
            width: 100%;
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .submit-order-btn:hover {
            background: #059669;
        }
        
        .submit-order-btn:disabled {
            background: #6b7280;
            cursor: not-allowed;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .cart-modal-content {
                margin: 1rem auto;
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="max-w-4xl mx-auto bg-white/5 rounded-2xl border border-white/10 overflow-hidden" style="margin: 1.5rem auto;">
        <!-- Restaurant Header -->
        <div class="text-center p-8 border-b border-white/10">
            ${logoSection}
            <h1 class="text-4xl font-bold text-white mb-2" style="font-family: '${restaurant.font}', sans-serif;">
                ${restaurant.name}
            </h1>
            <p class="text-lg text-white/70" style="font-family: '${restaurant.font}', sans-serif;">
                ${restaurant.description}
            </p>
        </div>

        <!-- Menu Content -->
        <div class="p-8 pb-24" style="font-family: '${restaurant.font}', sans-serif;">
            ${categoriesHTML}
        </div>

        <!-- Footer -->
        <div class="text-center p-6 border-t border-white/10 bg-black/20">
            <div class="flex items-center justify-center space-x-4 text-white/60 text-sm" style="font-family: '${restaurant.font}', sans-serif;">
                <span>Erstellt mit</span>
                <span class="font-bold text-green-400">MenuForge</span>
                <span>•</span>
                <span>${new Date().toLocaleDateString('de-DE')}</span>
            </div>
        </div>
    </div>

    <!-- Floating Cart Button -->
    <div class="floating-cart" id="floatingCart">
        <button onclick="openCart()">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="cart-icon">
                        <span class="text-black font-bold text-lg">🛒</span>
                        <div class="cart-badge" id="cartBadge">0</div>
                    </div>
                    <div>
                        <div class="font-bold text-white text-lg" id="cartTotal">€0.00</div>
                        <div class="text-sm text-gray-300" id="cartItems">0 Artikel</div>
                    </div>
                </div>
                <div class="text-white font-bold flex items-center space-x-2">
                    <span>Zur Bestellung</span>
                    <span>→</span>
                </div>
            </div>
        </button>
    </div>

    <!-- Cart Modal -->
    <div class="cart-modal" id="cartModal">
        <div class="cart-modal-content">
            <button class="cart-close" onclick="closeCart()">×</button>
            <h2 class="text-2xl font-bold text-white mb-6">Ihre Bestellung</h2>
            
            <div id="cartItemsList"></div>
            
            <div class="cart-total-section">
                <div class="flex justify-between items-center text-xl font-bold">
                    <span class="text-white">Gesamt:</span>
                    <span class="text-2xl text-green-400" id="modalCartTotal">€0.00</span>
                </div>
            </div>
            
            <div class="customer-form">
                <h3>Tischinformation</h3>
                <div class="form-group">
                    <label for="tableNumber">Tischnummer *</label>
                    <input type="text" id="tableNumber" placeholder="z.B. Tisch 5" required>
                </div>
                <div class="form-group">
                    <label for="customerName">Name (optional)</label>
                    <input type="text" id="customerName" placeholder="Ihr Name">
                </div>
            </div>
            
            <button class="submit-order-btn" onclick="submitOrder()" id="submitBtn" disabled>
                Bestellung aufgeben
            </button>
        </div>
    </div>

    <script>
        // Cart Management
        let cart = {};
        
        function addToCart(itemId, itemName, price, type) {
            cart[itemId] = {
                id: itemId,
                name: itemName,
                price: price,
                type: type,
                quantity: 1,
                specialRequest: ''
            };
            
            updateItemDisplay(itemId);
            updateCartDisplay();
            saveCartToStorage();
        }
        
        function removeFromCart(itemId) {
            delete cart[itemId];
            updateItemDisplay(itemId);
            updateCartDisplay();
            saveCartToStorage();
        }
        
        function increaseQuantity(itemId) {
            if (cart[itemId]) {
                cart[itemId].quantity++;
                updateItemDisplay(itemId);
                updateCartDisplay();
                saveCartToStorage();
            }
        }
        
        function decreaseQuantity(itemId) {
            if (cart[itemId]) {
                cart[itemId].quantity--;
                if (cart[itemId].quantity <= 0) {
                    removeFromCart(itemId);
                } else {
                    updateItemDisplay(itemId);
                    updateCartDisplay();
                    saveCartToStorage();
                }
            }
        }
        
        function updateSpecialRequest(itemId, request) {
            if (cart[itemId]) {
                cart[itemId].specialRequest = request;
                saveCartToStorage();
            }
        }
        
        function updateItemDisplay(itemId) {
            const item = document.querySelector('[data-item-id="' + itemId + '"]');
            const addContainer = item.querySelector('.add-to-cart-container');
            const quantityContainer = item.querySelector('.quantity-controls');
            const quantityDisplay = item.querySelector('.quantity-display');
            const specialRequest = item.querySelector('.special-request');
            
            if (cart[itemId]) {
                addContainer.style.display = 'none';
                quantityContainer.style.display = 'flex';
                quantityContainer.style.flexDirection = 'column';
                quantityContainer.style.gap = '0.75rem';
                quantityDisplay.textContent = cart[itemId].quantity;
                specialRequest.value = cart[itemId].specialRequest || '';
                item.classList.add('in-cart');
            } else {
                addContainer.style.display = 'block';
                quantityContainer.style.display = 'none';
                item.classList.remove('in-cart');
            }
        }
        
        function updateCartDisplay() {
            const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
            const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            document.getElementById('cartBadge').textContent = itemCount;
            document.getElementById('cartTotal').textContent = '€' + total.toFixed(2);
            document.getElementById('cartItems').textContent = itemCount + ' Artikel';
            
            const floatingCart = document.getElementById('floatingCart');
            if (itemCount > 0) {
                floatingCart.style.display = 'block';
            } else {
                floatingCart.style.display = 'none';
            }
            
            updateModalCart();
        }
        
        function updateModalCart() {
            const cartList = document.getElementById('cartItemsList');
            const modalTotal = document.getElementById('modalCartTotal');
            
            cartList.innerHTML = '';
            let total = 0;
            
            Object.values(cart).forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = \`
                    <div>
                        <strong>\${item.name}</strong><br>
                        <small class="text-gray-400">€\${item.price.toFixed(2)} × \${item.quantity}</small>
                        \${item.specialRequest ? '<br><small style="color: #fbbf24;">🗒️ ' + item.specialRequest + '</small>' : ''}
                    </div>
                    <div style="font-weight: bold; color: #10b981;">
                        €\${itemTotal.toFixed(2)}
                    </div>
                \`;
                cartList.appendChild(cartItem);
            });
            
            modalTotal.textContent = '€' + total.toFixed(2);
            
            // Enable/disable submit button
            const tableNumber = document.getElementById('tableNumber').value.trim();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = !(total > 0 && tableNumber);
        }
        
        function openCart() {
            document.getElementById('cartModal').style.display = 'block';
            updateModalCart();
        }
        
        function closeCart() {
            document.getElementById('cartModal').style.display = 'none';
        }
        
        function submitOrder() {
            const tableNumber = document.getElementById('tableNumber').value.trim();
            const customerName = document.getElementById('customerName').value.trim();
            
            if (!tableNumber) {
                alert('Bitte geben Sie eine Tischnummer ein.');
                return;
            }
            
            if (Object.keys(cart).length === 0) {
                alert('Ihr Warenkorb ist leer.');
                return;
            }
            
            // Generate Order ID
            const orderId = 'ORD-' + Date.now().toString().slice(-6);
            
            // Create order object
            const order = {
                id: orderId,
                table: tableNumber,
                customerName: customerName,
                items: Object.values(cart),
                total: Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0),
                timestamp: new Date().toISOString(),
                status: 'new'
            };
            
            // Save to localStorage
            const orders = JSON.parse(localStorage.getItem('menuforge_orders') || '[]');
            orders.push(order);
            localStorage.setItem('menuforge_orders', JSON.stringify(orders));
            
            // Clear cart
            cart = {};
            localStorage.removeItem('menuforge_cart');
            
            // Reset UI
            document.querySelectorAll('.item').forEach(item => {
                const itemId = item.getAttribute('data-item-id');
                updateItemDisplay(parseInt(itemId));
            });
            updateCartDisplay();
            closeCart();
            
            alert('Bestellung erfolgreich aufgegeben!\\nBestellnummer: ' + orderId);
        }
        
        function saveCartToStorage() {
            localStorage.setItem('menuforge_cart', JSON.stringify(cart));
        }
        
        function loadCartFromStorage() {
            const savedCart = localStorage.getItem('menuforge_cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                Object.keys(cart).forEach(itemId => {
                    updateItemDisplay(parseInt(itemId));
                });
                updateCartDisplay();
            }
        }
        
        // Form validation
        document.getElementById('tableNumber').addEventListener('input', function() {
            updateModalCart();
        });
        
        // Close modal when clicking outside
        document.getElementById('cartModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeCart();
            }
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadCartFromStorage();
            updateCartDisplay();
        });
    </script>
</body>
</html>`;
  }

  private getBgGradient(bgClass: string): string {
    // Convert Tailwind gradient classes to actual CSS gradients
    switch (bgClass) {
      case 'from-gray-900 via-purple-900 to-violet-900':
        return '#111827, #581c87, #4c1d95';
      case 'from-orange-400 via-red-500 to-pink-500':
        return '#fb923c, #ef4444, #ec4899';
      case 'from-slate-900 via-blue-900 to-cyan-900':
        return '#0f172a, #1e3a8a, #164e63';
      case 'from-green-900 via-emerald-900 to-teal-900':
        return '#14532d, #064e3b, #134e4a';
      case 'from-slate-800 via-gray-900 to-zinc-900':
        return '#1e293b, #111827, #18181b';
      default:
        return '#111827, #581c87, #4c1d95';
    }
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