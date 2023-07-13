// Cart Open Close
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
}
// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active");
}

// add to cart 
// Cart working js

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Making Function
function ready() {
    // Remove Item From Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i<removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // Quantity Change
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i<quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
}

//Remove Cart Item
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}
// QuantityChange
function quantityChanged(event) {
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}
// UPDATE TOTAL [IN CART]
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
        total += price * quantity;

        //if price contain tetrebi
        
        total = Math.round(total * 100) / 100;
        document.getElementsByClassName('total-price')[0].innerText = '₾' + total;
    }
}