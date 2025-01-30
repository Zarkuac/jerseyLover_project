const API_URL = 'http://localhost:5000/api';

// Cart functionality
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add('active');
};

// Close Cart
closeCart.onclick = () => {
    cart.classList.remove('active');
};

// Load products when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    ready(); // Initialize cart functionality
});

async function loadProducts() {
    const shopContent = document.querySelector('.shop-content');
    shopContent.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        if (products.length === 0) {
            shopContent.innerHTML = '<div class="no-products">No products available</div>';
            return;
        }

        shopContent.innerHTML = ''; // Clear loading message
        
        products.forEach(product => {
            const productBox = document.createElement('div');
            productBox.className = 'product-box';
            
            // Log the image URL to check what we're receiving
            console.log('Product Image URL:', product.imageUrl);
            
            const fullImageUrl = `http://localhost:5000${product.imageUrl}`;
            
            productBox.innerHTML = `
                <img src="${fullImageUrl}" 
                     alt="${product.title}" 
                     class="product-img"
                     onerror="this.src='img/default-product.jpg'">
                <h2 class="product-title">${product.title}</h2>
                <span class="price">₾${product.price.toFixed(2)}</span>
                <i class='bx bx-shopping-bag add-cart'></i>
            `;
            shopContent.appendChild(productBox);
            
            // Add cart functionality with the full image URL
            const addCartButton = productBox.querySelector('.add-cart');
            addCartButton.addEventListener('click', () => {
                const cartProduct = {
                    ...product,
                    fullImageUrl: fullImageUrl // Add the full URL as a new property
                };
                addCartItem(cartProduct);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        shopContent.innerHTML = `
            <div class="error">
                Error loading products. Please try again later.
            </div>
        `;
    }
}

// Making Function
function ready() {
    // Remove Items From Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // Quantity Changes
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
}

// Add to cart
function addCartItem(product) {
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    
    // Log the product data to check what we're receiving
    console.log('Adding to cart:', product);
    
    // Check if item already exists in cart
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === product.title) {
            alert('You have already added this item to cart');
            return;
        }
    }

    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');

    var cartBoxContent = `
        <img src="${product.fullImageUrl}" 
             alt="${product.title}" 
             class="cart-img"
             onerror="this.src='img/default-product.jpg'">
        <div class="detail-box">
            <div class="cart-product-title">${product.title}</div>
            <div class="cart-price">₾${product.price.toFixed(2)}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    `;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);
    
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged);
    
    updateTotal();
    updateCartIcon();
    cart.classList.add('active');
}

// Remove items from cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    updateCartIcon();
}

// Quantity Changes
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    updateCartIcon();
}

// Update Total
function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('₾', ''));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = '₾' + total.toFixed(2);
}

// Update cart icon
function updateCartIcon() {
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartItems = cartContent.getElementsByClassName('cart-box');
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.setAttribute('data-quantity', cartItems.length);
}

// Buy Button
document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked);

function buyButtonClicked() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    if (cartContent.childNodes.length === 0) {
        alert('Your cart is empty! Add some products first.');
        return;
    }
    
    alert('Your Order is placed');
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
    updateCartIcon();
    cart.classList.remove('active');
}

// Add this after your existing code
document.getElementsByClassName('btn-delete-all')[0].addEventListener('click', deleteAllItems);

function deleteAllItems() {
    if (document.getElementsByClassName('cart-box').length === 0) {
        alert('Cart is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to delete all items?')) {
        const cartContent = document.getElementsByClassName('cart-content')[0];
        while (cartContent.firstChild) {
            cartContent.removeChild(cartContent.firstChild);
        }
        updateTotal();
        updateCartIcon();
    }
}

// Admin credentials (in a real application, these should be stored securely on the server)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Admin Modal Elements
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminModal = document.getElementById('adminModal');
const closeAdminModal = document.getElementById('close-admin-modal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

// Show admin login modal
adminLoginBtn.addEventListener('click', () => {
    adminModal.style.display = 'block';
});

// Close admin modal
closeAdminModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// Handle admin login
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Set login status and open admin page in new tab
        localStorage.setItem('adminLoggedIn', 'true');
        window.open('/admin.html', '_blank');
        adminModal.style.display = 'none';
    } else {
        alert('Invalid credentials!');
    }
});

// Simplify the admin panel section to just handle logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/';
});

// Handle Manage Products click
document.getElementById('manageProductsBtn').addEventListener('click', () => {
    window.location.href = '/admin-panel.html';
});