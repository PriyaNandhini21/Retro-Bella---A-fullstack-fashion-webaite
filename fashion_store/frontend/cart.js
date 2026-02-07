// frontend/cart.js (FULL CODE)
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    // Removed: const emptyCartBtn = document.getElementById('empty-cart-btn');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    let finalCartData = [];
    let finalTotal = 0;

    // Helper function to update quantity via API (Kept for Feature 2)
    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: parseInt(newQuantity) })
            });

            if (!res.ok) throw new Error('Failed to update quantity');
            
            // Re-fetch the entire cart to ensure UI is accurate
            fetchCartItems();
        } catch (err) {
            console.error('Error updating quantity:', err);
            alert('Error updating quantity.');
        }
    };

    const fetchCartItems = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch cart items.');

            const items = await res.json();
            let total = 0;
            cartItemsContainer.innerHTML = '';
            
            finalCartData = items;
            
            if (items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="list-group-item">Your cart is empty.</p>';
                cartTotalContainer.innerHTML = 'Total: <strong>₹0.00</strong>';
                checkoutBtn.disabled = true;
                // Removed: emptyCartBtn.disabled = true;
                return;
            }

            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'list-group-item d-flex justify-content-between align-items-center';
                itemElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div>
                            <h5 class="mb-1">${item.Product.name}</h5>
                            <p class="mb-1"><small>Unit Price: ₹${item.Product.price.toFixed(2)}</small></p>
                            <button class="btn btn-danger btn-sm remove-from-cart-btn" data-cart-item-id="${item.id}">Remove</button>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" 
                                class="form-control quantity-input me-3" 
                                value="${item.quantity}" 
                                min="1" 
                                style="width: 70px;"
                                data-cart-item-id="${item.id}">
                        <span class="badge bg-primary rounded-pill fs-6">₹${(item.Product.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.Product.price * item.quantity;
            });

            finalTotal = total;
            cartTotalContainer.innerHTML = `Total: <strong>₹${total.toFixed(2)}</strong>`;
            checkoutBtn.disabled = false;
            // Removed: emptyCartBtn.disabled = false;
            
            localStorage.setItem('cartSummary', JSON.stringify({ items: finalCartData, total: finalTotal }));

        } catch (err) {
            console.error(err);
            cartItemsContainer.innerHTML = '<p class="text-danger">Could not load your cart.</p>';
            checkoutBtn.disabled = true;
            // Removed: emptyCartBtn.disabled = true;
        }
    };

    // --- QUANTITY INPUT HANDLER ---
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const cartItemId = e.target.dataset.cartItemId;
            const newQuantity = e.target.value;
            
            updateQuantity(cartItemId, newQuantity);
        }
    });

    // --- REMOVE SINGLE ITEM LOGIC (Existing) ---
    cartItemsContainer.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('remove-from-cart-btn')) {
            const cartItemId = e.target.dataset.cartItemId;

            try {
                await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchCartItems();

            } catch (err) {
                console.error(err);
                alert('Error removing item from cart.');
            }
        }
    });
    
    // --- REMOVED: EMPTY CART BUTTON LOGIC ---
    // The code block for emptyCartBtn.addEventListener is removed here.

    // --- REDIRECTION LOGIC (Existing) ---
    checkoutBtn.addEventListener('click', () => {
        if (finalCartData.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty.');
        }
    });

    fetchCartItems();
    
    // Logout Logic (Your existing code)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});