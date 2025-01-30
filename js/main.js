// Cart Open/Close
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('#cart-icon');
    const cart = document.querySelector('.cart');
    const closeCart = document.querySelector('#close-cart');

      // Clear any default items in cart on page load
      const cartContent = document.querySelector('.cart-content');
      while (cartContent.firstChild) {
          cartContent.removeChild(cartContent.firstChild);
      }
      updateTotal();
      updateCartIcon();

    // Open Cart
    cartIcon.onclick = () => {
        cart.classList.add('active');
    };

    // Close Cart
    closeCart.onclick = () => {
        cart.classList.remove('active');
    };

    // Cart Working
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }
});

// Making Function
function ready() {
    // Remove Items From Cart
    const removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let i = 0; i < removeCartButtons.length; i++) {
        const button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    // Quantity Changes
    const quantityInputs = document.getElementsByClassName('cart-quantity');
    for (let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    // Add To Cart
    const addCart = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addCart.length; i++) {
        const button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }

    // Buy Button Work
    document.getElementsByClassName('btn-buy')[0]
        .addEventListener('click', buyButtonClicked);
}

// Buy Button
function buyButtonClicked() {
    alert('Your Order is placed');
    const cartContent = document.getElementsByClassName('cart-content')[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
    updateCartIcon();
}

// Remove Items From Cart
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    updateCartIcon();
}

// Quantity Changes
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    updateCartIcon();
}

// Add To Cart
function addCartClicked(event) {
    const button = event.target;
    const shopProducts = button.parentElement;
    const title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    const price = shopProducts.getElementsByClassName('price')[0].innerText;
    const productImg = shopProducts.getElementsByClassName('product')[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    updateCartIcon();
    
    // Automatically open cart when product is added
    const cart = document.querySelector('.cart');
    cart.classList.add('active');
}

function addProductToCart(title, price, productImg) {
    const cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    const cartItems = document.getElementsByClassName('cart-content')[0];
    const cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    
    // Check if item already exists in cart
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert('You have already added this item to cart');
            return;
        }
    }

    const cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bx-trash-alt cart-remove'></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged);
    
    updateCartIcon();
}

// Update Total
function updateTotal() {
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;
    
    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const priceElement = cartBox.getElementsByClassName('cart-price')[0];
        const quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        const price = parseFloat(priceElement.innerText.replace('₾', ''));
        const quantity = quantityElement.value;
        total = total + price * quantity;
    }
    
    // If price contains some cents
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = '₾' + total;
}

// Update Cart Icon
function updateCartIcon() {
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartBoxes = cartContent.getElementsByClassName('cart-box');
    let quantity = 0;
    
    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}