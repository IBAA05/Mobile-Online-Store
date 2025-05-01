const categoryFilter = document.getElementById("categoryFilter");
const productsTableBody = document.getElementById("productsTableBody");
const addProductBtn = document.getElementById("addProductBtn");
const addProductModal = document.getElementById("addProductModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const addProductForm = document.getElementById("addProductForm");

// Fetch products from JSON
async function fetchProducts() {
  try {
    const response = await fetch("data/products.json");
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Get unique product categories
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

// Render products in table
function renderProducts(products) {
  productsTableBody.innerHTML = "";

  products.forEach((product) => {
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
        <span class="product-status">
          ${product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td>
        <button>Details</button>
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

  categoryFilter.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    const filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;
    renderProducts(filteredProducts);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    id: Date.now(),
    name: document.getElementById("productName").value,
    brand: document.getElementById("productBrand").value,
    category: document.getElementById("productCategory").value,
    price: parseFloat(document.getElementById("productPrice").value),
    quantity: parseInt(document.getElementById("productQuantity").value),
    description: document.getElementById("productDescription").value,
    images: [document.getElementById("productImage").value],
  };
  /* add more products*/
  const products = await fetchProducts();
  products.push(newProduct);
  renderProducts(products);
  closeModal();
});

initializePage();
