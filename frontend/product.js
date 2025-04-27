



// document.addEventListener('DOMContentLoaded', function() {
//     // Get DOM elements
//     const productContainer = document.querySelector('.products-container');
//     const brandCheckboxes = document.querySelectorAll('.sidebar h3:nth-of-type(2) + div + label input[type="checkbox"]');
//     const mainSearchInput = document.querySelector('.search-bar input[type="text"]');

//     // Check if database exists
//     if (!window.db || typeof db.getAllProducts !== 'function') {
//         console.error('Database not properly initialized');
//         productContainer.innerHTML = '<p class="no-results">Error loading products. Please try again later.</p>';
//         return;
//     }

//     // Get all products from database
//     let filteredProducts = db.getAllProducts();

//     // Function to render products
//     function renderProducts(productsToRender) {
//         productContainer.innerHTML = '';

//         if (!productsToRender || productsToRender.length === 0) {
//             productContainer.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
//             return;
//         }

//         productsToRender.forEach(product => {
//             const productBox = document.createElement('div');
//             productBox.className = 'box';

//             // Add discount badge if applicable
//             if (product.discount) {
//                 const discountBadge = document.createElement('span');
//                 discountBadge.className = 'discount';
//                 discountBadge.textContent = product.discount > 0 ? `${product.discount}% Off` : 'New';
//                 productBox.appendChild(discountBadge);
//             }

//             // Add product image
//             const img = document.createElement('img');
//             img.src = product.images && product.images[0] ? product.images[0] : 'images/placeholder.png';
//             img.alt = product.title || 'Product image';
//             productBox.appendChild(img);

//             // Add product title
//             const titleSpan = document.createElement('span');
//             titleSpan.textContent = product.title || 'Unknown Product';
//             productBox.appendChild(titleSpan);

//             // Add storage info if available
//             if (product.properties && product.properties.storage) {
//                 const storageH2 = document.createElement('h2');
//                 storageH2.textContent = `(${product.properties.storage})`;
//                 productBox.appendChild(storageH2);
//             }

//             // Add price
//             const priceDiv = document.createElement('h3');
//             priceDiv.className = 'price';

//             if (product.price) {
//                 if (product.discount) {
//                     const discountedPrice = product.price * (1 - product.discount / 100);
//                     priceDiv.innerHTML = `
//                         <span style="text-decoration: line-through; color: #868a92; font-size: 0.9rem;">
//                             ${product.price.toFixed(2)} DZD
//                         </span>
//                         ${discountedPrice.toFixed(2)} DZD
//                     `;
//                 } else {
//                     priceDiv.textContent = `${product.price.toFixed(2)} DZD`;
//                 }
//             } else {
//                 priceDiv.textContent = 'Price not available';
//             }
//             productBox.appendChild(priceDiv);

//             // Add heart icon
//             const heartIcon = document.createElement('i');
//             heartIcon.className = 'bx bx-heart';
//             productBox.appendChild(heartIcon);

//             // Add shop now button
//             const shopBtn = document.createElement('a');
//             shopBtn.href = `details.html?id=${product.id || ''}`;
//             shopBtn.className = 'btn';
//             shopBtn.textContent = 'Shop Now';
//             productBox.appendChild(shopBtn);

//             productContainer.appendChild(productBox);
//         });
//     }

//     // Filter functions
//     function filterByBrand(productsToFilter) {
//         const selectedBrands = Array.from(brandCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => {
//                 // Extract brand name from label text (removing the count number)
//                 const labelText = checkbox.nextSibling.textContent.trim();
//                 return labelText.split(' ')[0];
//             });

//         if (selectedBrands.length === 0) return productsToFilter;

//         return productsToFilter.filter(product =>
//             selectedBrands.includes(product.brand)
//         );
//     }

//     function filterBySearch(productsToFilter, searchTerm) {
//         if (!searchTerm) return productsToFilter;

//         return productsToFilter.filter(product => {
//             return (
//                 product.title.toLowerCase().includes(searchTerm) ||
//                 product.brand.toLowerCase().includes(searchTerm)
//             );
//         });
//     }

//     // Apply all filters
//     function applyFilters() {
//         let results = db.getAllProducts();
//         const searchTerm = mainSearchInput.value.toLowerCase();

//         results = filterByBrand(results);
//         results = filterBySearch(results, searchTerm);

//         filteredProducts = results;
//         renderProducts(filteredProducts);
//     }

//     // Initialize brand checkboxes
//     function initializeBrandFilters() {
//         const uniqueBrands = db.getUniqueBrands();
//         const brandContainer = document.querySelector('.sidebar h3:nth-of-type(2)').nextElementSibling.nextElementSibling;

//         // Clear existing checkboxes
//         while (brandContainer.nextElementSibling && brandContainer.nextElementSibling.tagName === 'LABEL') {
//             brandContainer.nextElementSibling.remove();
//         }

//         // Add checkboxes for each brand
//         uniqueBrands.forEach(brand => {
//             const count = db.getProductsByBrand(brand).length;
//             const label = document.createElement('label');
//             label.innerHTML = `<input type="checkbox"> ${brand} (${count})`;
//             brandContainer.parentNode.insertBefore(label, brandContainer.nextElementSibling);
//         });

//         // Update event listeners for new checkboxes
//         document.querySelectorAll('.sidebar h3:nth-of-type(2) + div + label input[type="checkbox"]')
//             .forEach(checkbox => {
//                 checkbox.addEventListener('change', applyFilters);
//             });
//     }

//     // Event listeners
//     mainSearchInput.addEventListener('input', applyFilters);

//     // Initial setup
//     initializeBrandFilters();
//     renderProducts(filteredProducts);
// });

document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const productContainer = document.querySelector('.products-container');
    const brandCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');

    // Check if database exists and has the required methods
    if (!window.db || typeof db.getAllProducts !== 'function') {
        console.error('Database not properly initialized or missing required methods');
        productContainer.innerHTML = '<p class="no-results">Error loading products. Please try again later.</p>';
        return;
    }

    // Get all products from the database
    let products = db.getAllProducts();
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
                discountBadge.textContent = `${product.discount}% Off`;
                productBox.appendChild(discountBadge);
            }

            // Add product image
            const img = document.createElement('img');
            img.src = product.images[0] || 'images/placeholder.png';
            img.alt = product.title || 'Product image';
            productBox.appendChild(img);

            // Add product title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = product.title || 'Unknown Product';
            productBox.appendChild(titleSpan);

            // Add storage options
            if (product.properties && product.properties.storageOptions) {
                const storageH2 = document.createElement('h2');
                storageH2.textContent = `Storage: ${product.properties.storageOptions.join(', ')}`;
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
                            $${product.price.toFixed(2)}
                        </span>
                        $${discountedPrice.toFixed(2)}
                    `;
                } else {
                    priceDiv.textContent = `$${product.price.toFixed(2)}`;
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

    // Event listeners for brand checkboxes
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterByBrand);
    });

    // Initial render
    renderProducts(products);
});
