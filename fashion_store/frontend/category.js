document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const categoryTitle = document.getElementById('category-title');

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (!category) {
        productList.innerHTML = '<p>Category not specified.</p>';
        return;
    }

    categoryTitle.textContent = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const fetchProductsByCategory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
            if (!response.ok) throw new Error('Could not fetch products.');
            
            const products = await response.json();

            productList.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 mb-4';
                productCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.imageURL}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>₹${product.price.toFixed(2)}</strong></p>
                            <div class="mt-auto">
                                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                                    Add to Cart
                                </button>
                                <button class="btn btn-outline-secondary ms-2 add-to-wishlist-btn" data-product-id="${product.id}">
                                    ♡
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error:', error);
            productList.innerHTML = '<p class="text-danger">Failed to load products for this category.</p>';
        }
    };

    fetchProductsByCategory();

    // This updated listener correctly handles both buttons
    productList.addEventListener('click', async (e) => {
        const cartBtn = e.target.closest('.add-to-cart-btn');
        const wishlistBtn = e.target.closest('.add-to-wishlist-btn');
        
        if (!cartBtn && !wishlistBtn) return; // Exit if not a button click

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to continue.');
            window.location.href = 'index.html';
            return;
        }

        const productId = (cartBtn || wishlistBtn).dataset.productId;

        // Handle Add to Cart clicks
        if (cartBtn) {
            try {
                const res = await fetch('http://localhost:5000/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ productId })
                });
                if (!res.ok) throw new Error('Failed to add item to cart');
                alert('Item added to cart!');
            } catch (err) {
                console.error(err);
                alert('Error adding item to cart.');
            }
        }

        // Handle Add to Wishlist clicks
        if (wishlistBtn) {
            try {
                const res = await fetch('http://localhost:5000/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ productId })
                });
                if (res.status === 400) {
                     alert('Item is already in your wishlist.');
                     return;
                }
                if (!res.ok) throw new Error('Failed to add item to wishlist');
                alert('Item added to wishlist!');
            } catch (err) {
                console.error(err);
                alert('Error adding item to wishlist.');
            }
        }
    });
});