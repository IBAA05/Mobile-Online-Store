document.addEventListener("DOMContentLoaded", async function () {
  // Get DOM elements
  const productContainer = document.querySelector(".products-container");
  const brandCheckboxes = document.querySelectorAll(
    '.sidebar input[type="checkbox"]'
  );
  const mainSearchInput = document.querySelector(
    '.search-bar input[type="text"]'
  );

  let products = [];
  let filteredProducts = [];

  // Function to fetch products from API
  async function fetchProducts() {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/products.php", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Only redirect for auth errors if not already on products page
          if (!window.location.pathname.includes("products.html")) {
            window.location.href = "login.html";
          }
          return [];
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      productContainer.innerHTML =
        '<p class="no-results">Error loading products. Please try again later.</p>';
      return [];
    }
  }

  try {
    products = await fetchProducts();
    filteredProducts = [...products];
    renderProducts(products);
  } catch (error) {
    console.error("Error initializing products:", error);
    productContainer.innerHTML =
      '<p class="no-results">Error loading products. Please try again later.</p>';
  }

  // Function to render products dynamically
  function renderProducts(productsToRender) {
    productContainer.innerHTML = "";

    if (!productsToRender || productsToRender.length === 0) {
      productContainer.innerHTML =
        '<p class="no-results">No products found matching your criteria.</p>';
      return;
    }

    productsToRender.forEach((product) => {
      const productBox = document.createElement("div");
      productBox.className = "box";

      // Add discount badge if applicable
      if (product.discount) {
        const discountBadge = document.createElement("span");
        discountBadge.className = "discount";
        discountBadge.textContent =
          product.discount > 0 ? `${product.discount}% Off` : "New";
        productBox.appendChild(discountBadge);
      }

      // Add product image
      const img = document.createElement("img");
      img.src =
        product.images && product.images[0]
          ? product.images[0]
          : "images/placeholder.png";
      img.alt = product.title || "Product image";
      productBox.appendChild(img);

      // Add product title
      const titleSpan = document.createElement("span");
      titleSpan.textContent = product.title || "Unknown Product";
      productBox.appendChild(titleSpan);

      // Add storage info if available
      if (product.properties && product.properties.storage) {
        const storageH2 = document.createElement("h2");
        storageH2.textContent = `(${product.properties.storage})`;
        productBox.appendChild(storageH2);
      }

      // Add price
      const priceDiv = document.createElement("h3");
      priceDiv.className = "price";

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
        priceDiv.textContent = "Price not available";
      }
      productBox.appendChild(priceDiv);

      // Add heart icon
      const heartIcon = document.createElement("i");
      heartIcon.className = "bx bx-heart";
      productBox.appendChild(heartIcon);

      // Add shop now button
      const shopBtn = document.createElement("a");
      shopBtn.href = `details.html?id=${product.id || ""}`;
      shopBtn.className = "btn";
      shopBtn.textContent = "Shop Now";
      productBox.appendChild(shopBtn);

      productContainer.appendChild(productBox);
    });
  }

  // Filter products by brand
  function filterByBrand() {
    const selectedBrands = Array.from(brandCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map(
        (checkbox) => checkbox.parentElement.textContent.trim().split(" ")[0]
      );

    if (selectedBrands.length === 0) {
      filteredProducts = [...products]; // Show all products if no brands are selected
    } else {
      filteredProducts = products.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    renderProducts(filteredProducts);
  }

  function filterBySearch() {
    const searchTerm = mainSearchInput.value.toLowerCase();
    filteredProducts = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
      );
    });
    renderProducts(filteredProducts);
  }

  // Event listeners
  brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterByBrand);
  });

  mainSearchInput.addEventListener("input", filterBySearch);

  // Initial render
  renderProducts(products);
});
