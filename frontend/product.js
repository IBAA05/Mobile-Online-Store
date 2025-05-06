document.addEventListener("DOMContentLoaded", async function () {
  // Get DOM elements
  const productContainer = document.querySelector(".products-container");
  const brandCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"][name="brand"]');
  const categoryCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"][name="category"]');
  const mainSearchInput = document.querySelector('.search-bar input[type="text"]');

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
  // Initial fetch and render
  try {
    products = await fetchProducts();
    filteredProducts = [...products];
    renderProducts(products);
  } catch (error) {
    console.error("Error initializing products:", error);
    productContainer.innerHTML = '<p class="no-results">Error loading products. Please try again later.</p>';
  }

  // Function to render products
  function renderProducts(productsToRender) {
    // ... (keep existing renderProducts implementation the same)
  }

  // Filter products by brand
  function filterByBrand() {
    const selectedBrands = Array.from(brandCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (selectedBrands.length === 0) {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    renderProducts(filteredProducts);
  }

  // Filter products by category
  function filterByCategory() {
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (selectedCategories.length === 0) {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    renderProducts(filteredProducts);
  }

  // Combined filter function
  function applyFilters() {
    const selectedBrands = Array.from(brandCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    filteredProducts = products.filter((product) => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return brandMatch && categoryMatch;
    });

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
    checkbox.addEventListener("change", applyFilters);
  });

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  mainSearchInput.addEventListener("input", filterBySearch);
});