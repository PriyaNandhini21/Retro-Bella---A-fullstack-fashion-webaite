// frontend/checkout.js (FULL CODE)

document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('checkout-summary-items');
    const totalContainer = document.getElementById('checkout-total');
    const billingForm = document.getElementById('billing-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const paymentMessage = document.getElementById('payment-message');
    const token = localStorage.getItem('token');
    
    // --- 1. Load Cart Summary ---
    const storedSummary = localStorage.getItem('cartSummary');
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!storedSummary) {
        summaryContainer.innerHTML = '<p class="text-danger">Cart data missing. Please return to cart.</p>';
        placeOrderBtn.disabled = true;
        totalContainer.innerHTML = 'Total: <strong>₹0.00</strong>';
        return;
    }
    
    // Parse the data saved by cart.js
    const { items, total } = JSON.parse(storedSummary);

    const loadSummary = () => {
        summaryContainer.innerHTML = '';
        
        if (items.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
            placeOrderBtn.disabled = true;
            return;
        }

        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'd-flex justify-content-between mb-2';
            itemEl.innerHTML = `
                <span>${item.Product.name} (x${item.quantity})</span>
                <span>₹${(item.Product.price * item.quantity).toFixed(2)}</span>
            `;
            summaryContainer.appendChild(itemEl);
        });

        // Display the total amount
        totalContainer.innerHTML = `Total: <strong>₹${total.toFixed(2)}</strong>`;
        placeOrderBtn.disabled = false;
    };

    loadSummary();

    // --- 2. Payment Submission ---
    billingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!billingForm.checkValidity()) {
            billingForm.reportValidity();
            return;
        }
        
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';
        paymentMessage.classList.add('d-none');

        const userData = {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
        };

        try {
            // Step 1: Request Order ID from Backend
            const res = await fetch('http://localhost:5000/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ totalAmount: total }) 
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Failed to create order.');
            }
            
            const { orderId, amount, currency } = await res.json();
            
            // Step 2: Open Razorpay Popup
            const options = {
                key: 'rzp_test_REimDhMs4nMZMR', 
                amount: amount,
                currency: currency,
                name: 'Retro Bella',
                description: 'E-commerce Project Payment',
                order_id: orderId,
                handler: async function (response) {
                    alert('Payment Successful! Thank you for your purchase.');
                    
                    // CRITICAL: Call the new backend endpoint to clear the cart!
                    await fetch('http://localhost:5000/api/cart/all', {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    localStorage.removeItem('cartSummary'); 
                    window.location.href = 'home.html';
                },
                prefill: {
                    name: userData.name,
                    contact: userData.phone,
                    email: 'test@example.com' 
                },
                theme: {
                    color: '#c9e417ff'
                }
            };
            
            const rzp1 = new Razorpay(options);
            rzp1.open();
            
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order & Pay Now';

        } catch (err) {
            console.error(err);
            paymentMessage.textContent = `Payment failed: ${err.message}`;
            paymentMessage.classList.remove('d-none');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order & Pay Now';
        }
    });
});