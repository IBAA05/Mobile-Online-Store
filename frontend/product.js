// products.js - Dynamic product rendering and filtering

document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const productContainer = document.querySelector('.products-container');
    const brandCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');
    const mainSearchInput = document.querySelector('.search-bar input[type="text"]');

    // Check if database exists and has the required methods
    if (!window.db || typeof db.getAllProducts !== 'function') {
        console.error('Database not properly initialized or missing required methods');
        productContainer.innerHTML = '<p class="no-results">Error loading products. Please try again later.</p>';
        return;
    }

    // Get all products from the database
    const products = db.getAllProducts();
    let filteredProducts = [...products];

    // Function to render products dynamically
    function renderProducts(productsToRender) {
        productContainer.innerHTML = '';

        if (!productsToRender || productsToRender.length === 0) {
            productContainer.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productBox = document.createElement('div');
            productBox.className = 'box';

            // Add discount badge if applicable
            if (product.discount) {
                const discountBadge = document.createElement('span');
                discountBadge.className = 'discount';
                discountBadge.textContent = product.discount > 0 ? `${product.discount}% Off` : 'New';
                productBox.appendChild(discountBadge);
            }

            // Add product image
            const img = document.createElement('img');
            img.src = product.images && product.images[0] ? product.images[0] : 'images/placeholder.png';
            img.alt = product.title || 'Product image';
            productBox.appendChild(img);

            // Add product title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = product.title || 'Unknown Product';
            productBox.appendChild(titleSpan);

            // Add storage info if available
            if (product.properties && product.properties.storage) {
                const storageH2 = document.createElement('h2');
                storageH2.textContent = `(${product.properties.storage})`;
                productBox.appendChild(storageH2);
            }

            // Add price
            const priceDiv = document.createElement('h3');
            priceDiv.className = 'price';

            if (product.price) {
                if (product.discount) {
                    const discountedPrice = product.price * (1 - product.discount / 100);
                    priceDiv.innerHTML = `
                        <span style="text-decoration: line-through; color: #868a92; font-size: 0.9rem;">
                            ${product.price.toFixed(2)} DZD
                        </span>
                        ${discountedPrice.toFixed(2)} DZD
                    `;
                } else {
                    priceDiv.textContent = `${product.price.toFixed(2)} DZD`;
                }
            } else {
                priceDiv.textContent = 'Price not available';
            }
            productBox.appendChild(priceDiv);

            // Add heart icon
            const heartIcon = document.createElement('i');
            heartIcon.className = 'bx bx-heart';
            productBox.appendChild(heartIcon);

            // Add shop now button
            const shopBtn = document.createElement('a');
            shopBtn.href = `details.html?id=${product.id || ''}`;
            shopBtn.className = 'btn';
            shopBtn.textContent = 'Shop Now';
            productBox.appendChild(shopBtn);

            productContainer.appendChild(productBox);
        });
    }

    // Filter products by brand
    function filterByBrand() {
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.parentElement.textContent.trim().split(' ')[0]);

        if (selectedBrands.length === 0) {
            filteredProducts = [...products]; // Show all products if no brands are selected
        } else {
            filteredProducts = products.filter(product => selectedBrands.includes(product.brand));
        }

        renderProducts(filteredProducts);
    }

    // Filter products by search term
    function filterBySearch() {
        const searchTerm = mainSearchInput.value.toLowerCase();
        filteredProducts = products.filter(product => {
            return (
                product.title.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm)
            );
        });
        renderProducts(filteredProducts);
    }

    // Event listeners
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterByBrand);
    });

    mainSearchInput.addEventListener('input', filterBySearch);

    // Initial render
    renderProducts(products);
});
