const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", async () => {
  loadCart();
  const orders = await fetchOrders();
  displayOrders(orders);
});

document.addEventListener("DOMContentLoaded", function () {
  const storageButtons = document.querySelectorAll(".storage-btn");
  const addToCartBtn = document.getElementById("addToCartBtn");
  let selectedStorage = null;
  let selectedPrice = null;

  // Storage button selection
  storageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      storageButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      selectedStorage = this.dataset.storage;
      selectedPrice = parseFloat(this.dataset.price);
    });
  });

  // Add to cart functionality
  addToCartBtn.addEventListener("click", function () {
    if (!selectedStorage) {
      alert("Please select a storage option first");
      return;
    }

    const product = {
      id: new Date().getTime(),
      name: document.querySelector(".product-info h1").textContent,
      price: selectedPrice,
      storage: selectedStorage,
      image: document.querySelector(".product-images img").src,
      quantity: 1,
    };

    addToCart(product);
  });
});

async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

async function fetchOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders.php`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

function displayOrders(orders) {
  const ordersList = document.getElementById("orders-list");
  if (!ordersList) return;

  ordersList.innerHTML = orders
    .map(
      (order) => `
    <div class="order-item">
      <h3>Order #${order.id}</h3>
      <p>Status: ${order.status}</p>
      <p>Total: $${order.total.toFixed(2)}</p>
      <p>Date: ${order.date}</p>
    </div>
  `
    )
    .join("");
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(
    (item) => item.name === product.name && item.storage === product.storage
  );

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCartNotification();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  let cartCount = document.querySelector(".cart-count");
  if (!cartCount) {
    cartCount = document.createElement("span");
    cartCount.className = "cart-count";
    document.querySelector(".cart-btn").appendChild(cartCount);
  }
  cartCount.textContent = totalItems > 0 ? totalItems : "";
}

function showCartNotification() {
  alert("Product added to cart successfully!");
}

// Initialize cart count on page load
updateCartCount();

function loadCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    updateOrderSummary(0);
    return;
  }

  cartContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}" data-storage="${
        item.storage
      }">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <p class="product-name">${item.name}</p>
                <p>${item.storage}</p>
                <p>ID: ${item.id}</p>
            </div>
            <div class="quantity-controls">
                <input type="number" value="${
                  item.quantity
                }" min="1" onchange="updateQuantity(${item.id}, '${
        item.storage
      }', this.value)">
            </div>
            <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="remove-item">
                <button onclick="removeItem(${item.id}, '${
        item.storage
      }')">x</button>
            </div>
        </div>
        <hr>
    `
    )
    .join("");

  updateOrderSummary(cart);
}

function updateQuantity(productId, storage, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex(
    (item) => item.id === productId && item.storage === storage
  );

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = parseInt(newQuantity);
    if (cart[itemIndex].quantity < 1) {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

function removeItem(productId, storage) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(
    (item) => !(item.id === productId && item.storage === storage)
  );
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function updateOrderSummary(cart) {
  const subtotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 0 ? 29 : 0; // $29 shipping if cart not empty
  const total = subtotal + tax + shipping;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

document.querySelector(".checkout-btn").addEventListener("click", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderData = {
    customer: {
      name: "Guest Customer", // You might want to get this from a form
      email: "guest@example.com", // You might want to get this from a form
    },
    items: cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  try {
    const order = await createOrder(orderData);
    localStorage.removeItem("cart"); // Clear cart after successful order
    alert("Order placed successfully!");
    loadCart(); // Refresh cart display
    const orders = await fetchOrders(); // Fetch and display orders
    displayOrders(orders);
  } catch (error) {
    alert("Failed to place order. Please try again.");
  }
});
