document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        // Redirect if no product ID is provided
        window.location.href = 'products.html';
        return;
    }

    // Get product from database
    const product = db.getAllProducts().find(p => p.id === productId);

    if (!product) {
        // Redirect if product not found
        window.location.href = 'products.html';
        return;
    }

    // Update product display
    updateProductDisplay(product);

    // Setup event listeners
    setupEventListeners(product);

    // Load related products
    loadRelatedProducts(product);
});

function updateProductDisplay(product) {
    // Update main product image
    const mainImage = document.querySelector('.product-images img');
    mainImage.src = product.images[0];
    mainImage.alt = product.title;

    // Update product title
    document.querySelector('.product-info h1').textContent = product.title;

    // Update price with discount if applicable
    const priceElement = document.querySelector('.price');
    if (product.discount) {
        const discountedPrice = product.price * (1 - product.discount / 100);
        priceElement.innerHTML = `
            <span style="text-decoration: line-through; color: #868a92; font-size: 0.9rem;">
                ${product.price.toFixed(2)} DZD
            </span>
            ${discountedPrice.toFixed(2)} DZD
        `;
    } else {
        priceElement.textContent = `${product.price.toFixed(2)} DZD`;
    }

    // Update storage options
    const storageSelect = document.querySelector('.storage-select');
    storageSelect.innerHTML = ''; // Clear existing options

    // Add storage options based on product variants
    if (product.variants) {
        product.variants.forEach(variant => {
            const option = document.createElement('option');
            option.value = variant.storage;
            option.textContent = variant.storage;
            storageSelect.appendChild(option);
        });
    } else if (product.properties && product.properties.storage) {
        // For products without variants but with storage property
        const option = document.createElement('option');
        option.value = product.properties.storage;
        option.textContent = product.properties.storage;
        storageSelect.appendChild(option);
    }

    // Update product details sections if they exist in the product object
    if (product.details) {
        const detailsContainer = document.querySelector('.product-details');
        detailsContainer.innerHTML = ''; // Clear existing details

        Object.entries(product.details).forEach(([section, items]) => {
            const detailsElement = document.createElement('details');
            const summaryElement = document.createElement('summary');
            summaryElement.textContent = section;

            const ulElement = document.createElement('ul');
            items.forEach(item => {
                const liElement = document.createElement('li');
                liElement.textContent = item;
                ulElement.appendChild(liElement);
            });

            detailsElement.appendChild(summaryElement);
            detailsElement.appendChild(ulElement);
            detailsContainer.appendChild(detailsElement);
        });
    }
}

function setupEventListeners(product) {
    // Add to cart functionality
    document.querySelector('.cart').addEventListener('click', function() {
        const selectedStorage = document.querySelector('.storage-select').value;

        // Get or initialize cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product already in cart
        const existingItemIndex = cart.findIndex(item =>
            item.id === product.id && item.storage === selectedStorage
        );

        if (existingItemIndex >= 0) {
            // Increment quantity if already in cart
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                id: product.id,
                title: product.title,
                price: product.discount ?
                    product.price * (1 - product.discount / 100) : product.price,
                image: product.images[0],
                storage: selectedStorage,
                quantity: 1
            });
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show confirmation
        alert('Product added to cart!');
    });

    // Add to wishlist functionality
    document.querySelector('.wishlist').addEventListener('click', function() {
        // Similar to cart but for wishlist
        alert('Added to wishlist!');
    });
}

function loadRelatedProducts(product) {
    const relatedProductsContainer = document.querySelector('.related-products .products');
    if (!relatedProductsContainer) return;

    // Clear existing related products
    relatedProductsContainer.innerHTML = '';

    // Get related products (same brand, different products)
    const relatedProducts = db.getAllProducts()
        .filter(p => p.brand === product.brand && p.id !== product.id)
        .slice(0, 4); // Limit to 4 products

    if (relatedProducts.length === 0) {
        relatedProductsContainer.innerHTML = '<p>No related products found</p>';
        return;
    }

    // Add related products
    relatedProducts.forEach(relatedProduct => {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        productElement.innerHTML = `
            <img src="${relatedProduct.images[0]}" alt="${relatedProduct.title}">
            <h3>${relatedProduct.title}</h3>
            <p>${relatedProduct.price.toFixed(2)} DZD</p>
            <a href="details.html?id=${relatedProduct.id}" class="btn">View Details</a>
        `;

        relatedProductsContainer.appendChild(productElement);
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update cart count in header
    let cartCount = document.querySelector('.cart-count');
    if (!cartCount) {
        cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        document.querySelector('.cart-btn').appendChild(cartCount);
    }
    cartCount.textContent = totalItems > 0 ? totalItems : '';
}

// Function to get query parameters from the URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
products: [
    {
        id: 1,
        title: "iPhone 16 Pro Max",
        brand: "Apple",
        price: 50000.00,
        discount: 10,
        images: ["images/iphone16pro-removebg-preview.png"],
        variants: [
            { storage: "256GB", price: 32000.00, stock: 15 },
            { storage: "512GB", price: 37000.00, stock: 10 },
            { storage: "1TB", price: 50000.00, stock: 20 },
        ]
    },
    {
        id: 2,
        title: "Galaxy S24 Ultra",
        brand: "Samsung",
        discount: 8,
        images: ["images/iphone16pro-removebg-preview.png"],
        variants: [
            { storage: "256GB", price: 32000.00, stock: 15 },
            { storage: "512GB", price: 37000.00, stock: 10 },
            { storage: "1TB", price: 50000.00, stock: 20 },
        ]
    },
    {
        id: 3,
        title: "Pixel 9 Pro",
        brand: "Google",
        discount: 5,
        images: ["images/iphone16pro-removebg-preview.png"],
        variants: [
            { storage: "256GB", price: 32000.00, stock: 15 },
            { storage: "512GB", price: 37000.00, stock: 10 },
            { storage: "1TB", price: 50000.00, stock: 20 },
        ]
    },
    {
        id: 4,
        title: "OnePlus 12",
        brand: "OnePlus",
        discount: 12,
        images: ["images/iphone16pro-removebg-preview.png"],
        variants: [
            { storage: "256GB", price: 32000.00, stock: 15 },
            { storage: "512GB", price: 37000.00, stock: 10 },
            { storage: "1TB", price: 50000.00, stock: 20 },
        ]
    },
    {
        id: 5,
        title: "Xiaomi 14 Pro",
        brand: "Xiaomi",
        discount: 15,
        images: ["images/iphone16pro-removebg-preview.png"],
        variants: [
            { storage: "256GB", price: 32000.00, stock: 15 },
            { storage: "512GB", price: 37000.00, stock: 10 },
            { storage: "1TB", price: 50000.00, stock: 20 },
        ]
    }
],
// Function to display product details dynamically
function displayProductDetails() {
    const productId = parseInt(getQueryParam("id"), 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById("product-container").innerHTML = "<h1>Product not found</h1>";
        return;
    }

    const storageOptions = product.variants.map(v => `<option value="${v.storage}">${v.storage}</option>`).join("");

    const productHTML = `
        <section class="product-display">
            <div class="product-images">
                <img src="${product.images[0]}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h1>${product.title}</h1>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="options">
                    <div class="color-selection">
                        <span>Select color:</span>
                        <div class="color-swatches">
                            <div class="swatch black"></div>
                            <div class="swatch purple"></div>
                            <div class="swatch gold"></div>
                            <div class="swatch silver"></div>
                        </div>
                    </div>
                    <div class="storage-selection">
                        <span>Select storage:</span>
                        <select id="storage-options">
                            ${storageOptions}
                        </select>
                    </div>
                </div>
                <div class="buttons">
                    <button class="wishlist">Add to Wishlist</button>
                    <button class="cart" id="add-to-cart">Add to Cart</button>
                </div>
                <div class="delivery-options">
                    <span>Free Delivery</span>
                    <span>1-3 days</span>
                    <span>In stock</span>
                    <span>Guaranteed</span>
                </div>
            </div>
        </section>
        <section class="product-details">
            <details>
                <summary>Screen</summary>
                <ul>
                    <li>Screen diagonal: 6.7"</li>
                    <li>Screen resolution: 2796x1290</li>
                    <li>The screen refresh rate: 120 Hz</li>
                    <li>Pixel density: 460 ppi</li>
                    <li>Screen type: Dynamic Island OLED</li>
                    <li>Always-On Display</li>
                    <li>True Tone</li>
                </ul>
            </details>
            <details>
                <summary>CPU</summary>
                <ul>
                    <li>Number of cores: 6</li>
                    <li>A16 Bionic</li>
                </ul>
            </details>
            <details>
                <summary>Additionally</summary>
                <ul>
                    <li>Ceramic Shield</li>
                    <li>Water resistance (IP68)</li>
                </ul>
            </details>
        </section>
    `;

    document.getElementById("product-container").innerHTML = productHTML;

    // Add event listener for "Add to Cart"
    document.getElementById("add-to-cart").addEventListener("click", () => {
        const selectedStorage = document.getElementById("storage-options").value;
        const variant = product.variants.find(v => v.storage === selectedStorage);

        if (!variant || variant.stock <= 0) {
            alert("Selected storage is out of stock!");
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems.push({
            id: product.id,
            title: product.title,
            storage: selectedStorage,
            price: variant.price
        });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Update cart count
        const cartCountElement = document.getElementById("cart-count");
        cartCountElement.textContent = cartItems.length;

        alert("Item added to cart!");
    });
}

// Call the function to display product details
displayProductDetails();
