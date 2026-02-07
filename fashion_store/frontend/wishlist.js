// frontend/wishlist.js
document.addEventListener('DOMContentLoaded', () => {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const fetchWishlistItems = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch wishlist items.');

            const items = await res.json();
            wishlistItemsContainer.innerHTML = '';

            if (items.length === 0) {
                wishlistItemsContainer.innerHTML = '<p class="list-group-item">Your wishlist is empty.</p>';
                return;
            }

            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'list-group-item d-flex justify-content-between align-items-center';
                itemElement.innerHTML = `
                    <div>
                        <h5 class="mb-1">${item.Product.name}</h5>
                        <p class="mb-1"><strong>₹${item.Product.price.toFixed(2)}</strong></p>
                        <button class="btn btn-danger btn-sm remove-from-wishlist-btn" data-wishlist-item-id="${item.id}">Remove</button>
                    </div>
                    <img src="${item.Product.imageURL}" alt="${item.Product.name}" style="width: 100px; height: auto;">
                `;
                wishlistItemsContainer.appendChild(itemElement);
                itemElement.innerHTML = `
    <div>
        <h5 class="mb-1">${item.Product.name}</h5>
        <p class="mb-1"><strong>₹${item.Product.price.toFixed(2)}</strong></p>
        <button class="btn btn-danger btn-sm remove-from-wishlist-btn" data-wishlist-item-id="${item.id}">Remove</button>
    </div>
    <img src="${item.Product.imageURL}" alt="${item.Product.name}" style="width: 100px; height: auto;">
`;
            });

        } catch (err) {
            console.error(err);
            wishlistItemsContainer.innerHTML = '<p class="text-danger">Could not load your wishlist.</p>';
        }
    };

    fetchWishlistItems();

    // Event listener for the remove button
    wishlistItemsContainer.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('remove-from-wishlist-btn')) {
            const wishlistItemId = e.target.dataset.wishlistItemId;

            try {
                const res = await fetch(`http://localhost:5000/api/wishlist/${wishlistItemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Failed to remove item');

                // Re-fetch the wishlist to update the view
                fetchWishlistItems();

            } catch (err) {
                console.error(err);
                alert('Error removing item from wishlist.');
            }
        }
    });

    // Logout Logic
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
    wishlistItemsContainer.addEventListener('click', async (e) => {
    if (e.target && e.target.classList.contains('remove-from-wishlist-btn')) {
        const wishlistItemId = e.target.dataset.wishlistItemId;

        // This part sends the DELETE request to your server
        try {
            const res = await fetch(`http://localhost:5000/api/wishlist/${wishlistItemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to remove item');

            // This refreshes the wishlist on the page
            fetchWishlistItems();

        } catch (err) {
            console.error(err);
            alert('Error removing item from wishlist.');
        }
    }
});
});