const API_URL = 'http://localhost:5000/api';

// Get DOM elements
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const productId = document.getElementById('productId');
const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productImage = document.getElementById('productImage');

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);

// Handle form submission
productForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('title', productTitle.value);
        formData.append('price', productPrice.value);
        if (productImage.files[0]) {
            formData.append('image', productImage.files[0]);
        }

        let response;
        if (productId.value) {
            // Update existing product
            response = await fetch(`${API_URL}/products/${productId.value}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Add new product
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                body: formData
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save product');
        }

        alert('Product saved successfully!');
        productForm.reset();
        productId.value = '';
        await loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

// Load products into table
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="http://localhost:5000${product.imageUrl}" class="product-image" alt="${product.title}"></td>
                <td>${product.title}</td>
                <td>₾${product.price.toFixed(2)}</td>
                <td class="action-buttons">
                    <button onclick="editProduct('${product._id}')" class="edit-btn">Edit</button>
                    <button onclick="deleteProduct('${product._id}')" class="delete-btn">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        productTableBody.innerHTML = `
            <tr><td colspan="4" class="error">Error loading products: ${error.message}</td></tr>
        `;
    }
}

// Edit product
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const product = await response.json();
        
        productId.value = product._id;
        productTitle.value = product.title;
        productPrice.value = product.price;
    } catch (error) {
        console.error('Error:', error);
        alert('Error editing product: ' + error.message);
    }
}

// Delete product
async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            
            alert('Product deleted successfully!');
            await loadProducts();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting product: ' + error.message);
        }
    }
}

// Check if user is logged in (you might want to implement proper session management)
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = '/';
}

// Fetch and display products
async function loadAdminProducts() {
    const productsList = document.querySelector('.products-list');
    productsList.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        if (products.length === 0) {
            productsList.innerHTML = '<div class="no-products">No products available</div>';
            return;
        }

        productsList.innerHTML = '';
        
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="http://localhost:5000${product.imageUrl}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>₾${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            `;
            productsList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error:', error);
        productsList.innerHTML = '<div class="error">Error loading products</div>';
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadAdminProducts);

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.close(); // Close the current tab
    // If window.close() doesn't work (due to browser settings), redirect to home
    window.location.href = '/';
});

// Add logout functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = '/';
    }

    // Add logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            window.close(); // Close the current tab
            // If window.close() doesn't work (due to browser settings), redirect to home
            window.location.href = '/';
        });
    }
});