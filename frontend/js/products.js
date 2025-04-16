const categoryFilter = document.getElementById("categoryFilter");
const productsTableBody = document.getElementById("productsTableBody");

// Fetch products from JSON file
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

// Get unique categories for filter dropdown
function getUniqueCategories(products) {
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories);
}

// Update category filter options
function updateCategoryFilter(categories) {
  categoryFilter.innerHTML = `
          <option value="">All Categories</option>
          ${categories
            .map(
              (category) => `
            <option value="${category}">${category}</option>
          `
            )
            .join("")}
        `;
}

function renderProducts(filteredProducts) {
  productsTableBody.innerHTML = "";
  filteredProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full" src="${
                    product.images[0]
                  }" alt="${product.name}">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">${
                    product.name
                  }</div>
                  <div class="text-sm text-gray-500">${product.brand}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 ">
              <div class="text-sm text-gray-900">${product.category}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">$${product.price.toFixed(
                2
              )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${product.quantity}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                product.quantity > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }">
                ${product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-red-900">Details</button>
            </td>
          `;
    productsTableBody.appendChild(row);
  });
}

// Initialize the page
async function initialize() {
  const products = await fetchProducts();
  const categories = getUniqueCategories(products);
  updateCategoryFilter(categories);
  renderProducts(products);

  // Filter functionality
  categoryFilter.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    const filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;
    renderProducts(filteredProducts);
  });
}

// Initialize when the page loads
initialize();
