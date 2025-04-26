// // products.js - Search functionality implementation

// document.addEventListener('DOMContentLoaded', function() {
//     // Get DOM elements
//     const priceFromInput = document.querySelector('.price-range input[type="number"]:first-child');
//     const priceToInput = document.querySelector('.price-range input[type="number"]:last-child');
//     const brandCheckboxes = document.querySelectorAll('.sidebar h3:contains("BRAND") + div + label input[type="checkbox"]');
//     const storageCheckboxes = document.querySelectorAll('.sidebar h3:contains("BUILT-IN MEMORY") + div + label input[type="checkbox"]');
//     const searchInputs = document.querySelectorAll('.sidebar-search-bar input[type="text"]');
//     const productContainer = document.querySelector('.products-container');
    
//     // Initialize with all products
//     let filteredProducts = [...products];
    
//     // Search by price range
//     function searchByPriceRange() {
//         const fromPrice = parseFloat(priceFromInput.value) || 0;
//         const toPrice = parseFloat(priceToInput.value) || Infinity;
        
//         filteredProducts = products.filter(product => {
//             const productPrice = product.price;
//             return productPrice >= fromPrice && productPrice <= toPrice;
//         });
        
//         renderProducts();
//     }
    
//     // Search by brand
//     function searchByBrand() {
//         const selectedBrands = Array.from(brandCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => {
//                 // Extract brand name from label text (removing the count number)
//                 const labelText = checkbox.nextSibling.textContent.trim();
//                 return labelText.split(' ')[0];
//             });
        
//         if (selectedBrands.length === 0) {
//             // If no brands are selected, show all products
//             filteredProducts = [...products];
//         } else {
//             filteredProducts = products.filter(product => 
//                 selectedBrands.includes(product.brand)
//             );
//         }
        
//         renderProducts();
//     }
    
//     // Search by storage
//     function searchByStorage() {
//         const selectedStorages = Array.from(storageCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => {
//                 // Extract storage value from label text (removing the count number)
//                 const labelText = checkbox.nextSibling.textContent.trim();
//                 return labelText.split(' ')[0];
//             });
        
//         if (selectedStorages.length === 0) {
//             // If no storage options are selected, show all products
//             filteredProducts = [...products];
//         } else {
//             filteredProducts = products.filter(product => {
//                 // Check if product has storage property and if it matches any selected storage
//                 return product.properties.storage && 
//                        selectedStorages.some(storage => 
//                            product.properties.storage.includes(storage)
//                        );
//             });
//         }
        
//         renderProducts();
//     }
    
//     // Search by keyword in sidebar
//     function searchByKeyword() {
//         const searchTerm = this.value.toLowerCase();
        
//         if (searchTerm === '') {
//             // If search is empty, reset to current filtered products
//             renderProducts();
//             return;
//         }
        
//         const currentProducts = filteredProducts.length > 0 ? filteredProducts : products;
        
//         filteredProducts = currentProducts.filter(product => {
//             return (
//                 product.title.toLowerCase().includes(searchTerm) ||
//                 product.brand.toLowerCase().includes(searchTerm) ||
//                 (product.properties.storage && product.properties.storage.toLowerCase().includes(searchTerm))
//             );
//         });
        
//         renderProducts();
//     }
    
//     // Render products based on current filters
//     function renderProducts() {
//         // Clear current products
//         productContainer.innerHTML = '';
        
//         // Show filtered products or all products if no filters are applied
//         const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;
        
//         if (productsToShow.length === 0) {
//             productContainer.innerHTML = '<p class="no-results">No products match your search criteria.</p>';
//             return;
//         }
        
//         // Create product boxes
//         productsToShow.forEach(product => {
//             const productBox = document.createElement('div');
//             productBox.className = 'box';
            
//             // Add discount badge if applicable
//             if (product.discount) {
//                 const discountBadge = document.createElement('span');
//                 discountBadge.className = 'discount';
//                 discountBadge.textContent = `${product.discount}% Off`;
//                 productBox.appendChild(discountBadge);
//             }
            
//             // Add product image (using first image in array)
//             const img = document.createElement('img');
//             img.src = product.images[0];
//             img.alt = product.title;
//             productBox.appendChild(img);
            
//             // Add product title
//             const titleSpan = document.createElement('span');
//             titleSpan.textContent = product.title;
//             productBox.appendChild(titleSpan);
            
//             // Add storage info if available
//             const storageH2 = document.createElement('h2');
//             storageH2.textContent = product.properties.storage ? `(${product.properties.storage})` : '';
//             productBox.appendChild(storageH2);
            
//             // Add price
//             const priceDiv = document.createElement('div');
//             priceDiv.className = 'price';
            
//             // Calculate discounted price if applicable
//             if (product.discount) {
//                 const discountedPrice = product.price * (1 - product.discount / 100);
//                 priceDiv.innerHTML = `
//                     <span style="text-decoration: line-through; color: #868a92; font-size: 0.9rem;">
//                         $${product.price.toFixed(2)}
//                     </span> 
//                     $${discountedPrice.toFixed(2)}
//                 `;
//             } else {
//                 priceDiv.textContent = `$${product.price.toFixed(2)}`;
//             }
            
//             productBox.appendChild(priceDiv);
            
//             // Add heart icon
//             const heartIcon = document.createElement('i');
//             heartIcon.className = 'bx bx-heart';
//             productBox.appendChild(heartIcon);
            
//             // Add shop now button
//             const shopBtn = document.createElement('a');
//             shopBtn.href = `details.html?id=${product.id}`;
//             shopBtn.className = 'btn';
//             shopBtn.textContent = 'Shop Now';
//             productBox.appendChild(shopBtn);
            
//             productContainer.appendChild(productBox);
//         });
//     }
    
//     // Event listeners
//     priceFromInput.addEventListener('change', searchByPriceRange);
//     priceToInput.addEventListener('change', searchByPriceRange);
    
//     brandCheckboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', searchByBrand);
//     });
    
//     storageCheckboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', searchByStorage);
//     });
    
//     searchInputs.forEach(input => {
//         input.addEventListener('input', searchByKeyword);
//     });
    
//     // Initial render
//     renderProducts();
// });

// // Helper function to select elements containing specific text
// // This is needed because :contains is a jQuery selector and not available in vanilla JS
// document.querySelectorAll = function(selector) {
//     if (selector.includes(':contains')) {
//         const [tag, text] = selector.split(':contains("');
//         const searchText = text.split('")')[0];
//         const elements = document.querySelectorAll(tag);
        
//         return Array.from(elements).filter(el => 
//             el.textContent.includes(searchText)
//         );
//     }
//     return document.querySelectorAll.apply(document, arguments);
// };

// products.js - Dynamic product rendering and filtering












// document.addEventListener('DOMContentLoaded', function() {
//     // Get DOM elements
//     const priceFromInput = document.querySelector('.price-range input[type="number"]:first-of-type');
//     const priceToInput = document.querySelector('.price-range input[type="number"]:last-of-type');
//     const brandCheckboxes = document.querySelectorAll('.sidebar h3:nth-of-type(2) + div + label input[type="checkbox"]');
//     const storageCheckboxes = document.querySelectorAll('.sidebar h3:nth-of-type(3) + div + label input[type="checkbox"]');
//     const searchInputs = document.querySelectorAll('.sidebar-search-bar input[type="text"]');
//     const mainSearchInput = document.querySelector('.search-bar input[type="text"]');
//     const productContainer = document.querySelector('.products-container');
    
//     // Get all products from database
//     const products = db.getAllProducts();
//     let filteredProducts = [...products];
    
//     // Function to render products
//     function renderProducts(productsToRender) {
//         productContainer.innerHTML = '';
        
//         if (productsToRender.length === 0) {
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
//             img.src = product.images[0] || 'images/placeholder.png';
//             img.alt = product.title;
//             productBox.appendChild(img);
            
//             // Add product title
//             const titleSpan = document.createElement('span');
//             titleSpan.textContent = product.title;
//             productBox.appendChild(titleSpan);
            
//             // Add storage info if available
//             if (product.properties.storage) {
//                 const storageH2 = document.createElement('h2');
//                 storageH2.textContent = `(${product.properties.storage})`;
//                 productBox.appendChild(storageH2);
//             }
            
//             // Add price
//             const priceDiv = document.createElement('h3');
//             priceDiv.className = 'price';
            
//             if (product.discount) {
//                 const discountedPrice = product.price * (1 - product.discount / 100);
//                 priceDiv.innerHTML = `
//                     <span style="text-decoration: line-through; color: #868a92; font-size: 0.9rem;">
//                         $${product.price.toFixed(2)}
//                     </span> 
//                     $${discountedPrice.toFixed(2)}
//                 `;
//             } else {
//                 priceDiv.textContent = `$${product.price.toFixed(2)}`;
//             }
//             productBox.appendChild(priceDiv);
            
//             // Add heart icon
//             const heartIcon = document.createElement('i');
//             heartIcon.className = 'bx bx-heart';
//             productBox.appendChild(heartIcon);
            
//             // Add shop now button
//             const shopBtn = document.createElement('a');
//             shopBtn.href = `details.html?id=${product.id}`;
//             shopBtn.className = 'btn';
//             shopBtn.textContent = 'Shop Now';
//             productBox.appendChild(shopBtn);
            
//             productContainer.appendChild(productBox);
//         });
//     }
    
//     // Filter functions
//     function filterByPrice() {
//         const fromPrice = parseFloat(priceFromInput.value) || 0;
//         const toPrice = parseFloat(priceToInput.value) || Infinity;
        
//         return products.filter(product => {
//             return product.price >= fromPrice && product.price <= toPrice;
//         });
//     }
    
//     function filterByBrand(productsToFilter) {
//         const selectedBrands = Array.from(brandCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => checkbox.nextSibling.textContent.trim().split(' ')[0]);
        
//         if (selectedBrands.length === 0) return productsToFilter;
        
//         return productsToFilter.filter(product => 
//             selectedBrands.includes(product.brand)
//         );
//     }
    
//     function filterByStorage(productsToFilter) {
//         const selectedStorages = Array.from(storageCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => checkbox.nextSibling.textContent.trim().split(' ')[0]);
        
//         if (selectedStorages.length === 0) return productsToFilter;
        
//         return productsToFilter.filter(product => {
//             return product.properties.storage && 
//                    selectedStorages.some(storage => 
//                        product.properties.storage.includes(storage)
//                    );
//         });
//     }
    
//     function filterBySearch(productsToFilter, searchTerm) {
//         if (!searchTerm) return productsToFilter;
        
//         return productsToFilter.filter(product => {
//             return (
//                 product.title.toLowerCase().includes(searchTerm) ||
//                 product.brand.toLowerCase().includes(searchTerm) ||
//                 (product.properties.storage && product.properties.storage.toLowerCase().includes(searchTerm))
//             );
//         });
//     }
    
//     // Apply all filters
//     function applyFilters() {
//         let results = [...products];
//         const searchTerm = mainSearchInput.value.toLowerCase();
        
//         results = filterByPrice(results);
//         results = filterByBrand(results);
//         results = filterByStorage(results);
//         results = filterBySearch(results, searchTerm);
        
//         filteredProducts = results;
//         renderProducts(filteredProducts);
//     }
    
//     // Event listeners
//     priceFromInput.addEventListener('input', applyFilters);
//     priceToInput.addEventListener('input', applyFilters);
    
//     brandCheckboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', applyFilters);
//     });
    
//     storageCheckboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', applyFilters);
//     });
    
//     mainSearchInput.addEventListener('input', applyFilters);
    
//     searchInputs.forEach(input => {
//         input.addEventListener('input', function() {
//             const searchTerm = this.value.toLowerCase();
//             const filtered = filterBySearch(filteredProducts, searchTerm);
//             renderProducts(filtered);
//         });
//     });
    
//     // Initialize brand checkboxes based on available brands
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
//             label.innerHTML = `<input type="checkbox"> ${brand} ${count}`;
//             brandContainer.parentNode.insertBefore(label, brandContainer.nextElementSibling);
//         });
//     }
    
//     // Initialize storage filters based on available storage options
//     function initializeStorageFilters() {
//         const storageOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
//         const storageContainer = document.querySelector('.sidebar h3:nth-of-type(3)').nextElementSibling.nextElementSibling;
        
//         // Clear existing checkboxes
//         while (storageContainer.nextElementSibling && storageContainer.nextElementSibling.tagName === 'LABEL') {
//             storageContainer.nextElementSibling.remove();
//         }
        
//         // Add checkboxes for each storage option
//         storageOptions.forEach(storage => {
//             const count = products.filter(p => 
//                 p.properties.storage && p.properties.storage.includes(storage)
//             ).length;
//             if (count > 0) {
//                 const label = document.createElement('label');
//                 label.innerHTML = `<input type="checkbox"> ${storage} ${count}`;
//                 storageContainer.parentNode.insertBefore(label, storageContainer.nextElementSibling);
//             }
//         });
//     }
    
//     // Initial setup
//     initializeBrandFilters();
//     initializeStorageFilters();
//     renderProducts(products);
// });










document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const priceFromInput = document.querySelector('.price-range input[type="number"]:first-of-type');
    const priceToInput = document.querySelector('.price-range input[type="number"]:last-of-type');
    const productContainer = document.querySelector('.products-container');
    const mainSearchInput = document.querySelector('.search-bar input[type="text"]');
    
    // Check if database exists and has the required methods
    if (!window.db || typeof db.getAllProducts !== 'function') {
        console.error('Database not properly initialized or missing required methods');
        productContainer.innerHTML = '<p class="no-results">Error loading products. Please try again later.</p>';
        return;
    }
    
    // Get all products from database
    const products = db.getAllProducts();
    let filteredProducts = [...products];
    
    // Function to render products
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
    
    // Initial render
    renderProducts(products);
});