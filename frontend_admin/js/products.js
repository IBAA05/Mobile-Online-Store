const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");
const productsTableBody = document.getElementById("productsTableBody");
const addProductBtn = document.getElementById("addProductBtn");
const addProductModal = document.getElementById("addProductModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const addProductForm = document.getElementById("addProductForm");

import CONFIG from "./config.js";

async function fetchProducts() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/products`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function getUniqueCategories(products) {
  return [...new Set(products.map((product) => product.category))];
}

// Populate category filter options
function populateCategoryFilter(categories) {
  categoryFilter.innerHTML = `
    <option value="">All Categories</option>
    ${categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("")}
  `;
}

// Filter products based on current filter values.
function filterProducts(products) {
  const selectedCategory = categoryFilter.value;
  const selectedStockStatus = stockFilter.value;

  return products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const isInStock = product.quantity > 0;
    const matchesStock =
      !selectedStockStatus ||
      (selectedStockStatus === "in-stock" && isInStock) ||
      (selectedStockStatus === "out-of-stock" && !isInStock);

    return matchesCategory && matchesStock;
  });
}

// Render products in table
function renderProducts(products) {
  productsTableBody.innerHTML = "";
  const filteredProducts = filterProducts(products);

  filteredProducts.forEach((product) => {
    const isInStock = product.quantity > 0;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div>
          <img src="${
            product.images[0]
          }" alt="Product Image" width="40" height="40">
          <div>
            <strong>${product.name}</strong><br>
            <small>${product.brand}</small>
          </div>
        </div>
      </td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>
        <span class="product-status ${isInStock ? "active" : ""}">
          ${isInStock ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td>
        <button class="btn btn-primary">Details</button>
      </td>
    `;

    productsTableBody.appendChild(row);
  });
}

// Initialize everything
async function initializePage() {
  const products = await fetchProducts();
  const categories = getUniqueCategories(products);

  populateCategoryFilter(categories);
  renderProducts(products);

  // Add event listeners for filters
  categoryFilter.addEventListener("change", () => renderProducts(products));
  stockFilter.addEventListener("change", () => renderProducts(products));
}

/* Add Product features */

addProductBtn.addEventListener("click", () => {
  addProductModal.classList.add("modal-show");
});

function closeModal() {
  addProductModal.classList.remove("modal-show");
  addProductForm.reset();
}

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

addProductModal.addEventListener("click", (e) => {
  if (e.target === addProductModal) {
    closeModal();
  }
});

saveProductBtn.addEventListener("click", async () => {
  if (!addProductForm.checkValidity()) {
    addProductForm.reportValidity();
    return;
  }

  const newProduct = {
    name: document.getElementById("productName").value,
    brand: document.getElementById("productBrand").value,
    category: document.getElementById("productCategory").value,
    price: parseFloat(document.getElementById("productPrice").value),
    quantity: parseInt(document.getElementById("productQuantity").value),
    description: document.getElementById("productDescription").value,
    images: [document.getElementById("productImage").value],
  };

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await fetchProducts();
    renderProducts(products);
    closeModal();
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please try again.");
  }
});

initializePage();
