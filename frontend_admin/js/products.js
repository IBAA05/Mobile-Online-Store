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
import { createProduct } from "./api/productApi.js";

async function fetchProducts() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/products.php`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched products:", data);
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
    const totalStock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
    const isInStock = totalStock > 0;
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
    const totalStock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const isInStock = totalStock > 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div>
          <img src="${
            product.images[0]
          }" alt="Product Image" width="40" height="40">
          <div>
            <strong>${product.title}</strong><br>
            <small>${product.brand}</small>
          </div>
        </div>
      </td>
      <td>${product.category}</td>
      <td>$${lowestPrice.toFixed(2)}</td>
      <td>${totalStock}</td>
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

document.getElementById("addVariantBtn").addEventListener("click", () => {
  const variantRow = document.createElement("div");
  variantRow.className = "variant-row";
  variantRow.innerHTML = `
    <input type="text" class="form-control" placeholder="Storage" name="storage[]" required>
    <input type="number" class="form-control" placeholder="Price" name="price[]" required>
    <input type="number" class="form-control" placeholder="Stock" name="stock[]" required>
    <button type="button" class="btn btn-danger remove-variant">Remove</button>
  `;
  document.getElementById("variantsContainer").appendChild(variantRow);
});

document.getElementById("variantsContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-variant")) {
    e.target.parentElement.remove();
  }
});

saveProductBtn.addEventListener("click", async () => {
  try {
    if (!addProductForm.checkValidity()) {
      addProductForm.reportValidity();
      return;
    }

    saveProductBtn.disabled = true;
    saveProductBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const storageInputs = Array.from(document.getElementsByName("storage[]"));
    const priceInputs = Array.from(document.getElementsByName("price[]"));
    const stockInputs = Array.from(document.getElementsByName("stock[]"));

    if (storageInputs.length === 0) {
      throw new Error("At least one variant is required");
    }

    const variants = storageInputs.map((input, index) => ({
      storage: storageInputs[index].value,
      price: parseFloat(priceInputs[index].value),
      stock: parseInt(stockInputs[index].value),
    }));

    const newProduct = {
      title: document.getElementById("productName").value,
      brand: document.getElementById("productBrand").value,
      category: document.getElementById("productCategory").value.toLowerCase(),
      discount: 0,
      description: document.getElementById("productDescription").value,
      images: [document.getElementById("productImage").value],
      variants,
    };

    const productData = await createProduct(newProduct);
    console.log("Product created:", productData);

    // Refresh products list and close modal
    const products = await fetchProducts();
    renderProducts(products);
    closeModal();

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success";
    successMessage.textContent = "Product added successfully!";
    document.querySelector(".main-content").prepend(successMessage);

    // Remove success message after 3 seconds
    setTimeout(() => successMessage.remove(), 3000);
  } catch (error) {
    console.error("Error adding product:", error);
    const errorMessage = error.message.includes("JSON.parse")
      ? "Server returned an invalid response. Please try again or contact support."
      : error.message;
    alert(errorMessage);
  } finally {
    saveProductBtn.disabled = false;
    saveProductBtn.textContent = "Save Product";
  }
});

initializePage();
