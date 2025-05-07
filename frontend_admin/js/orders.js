import { jsonToCsv, showNotification } from "./utils.js";
import CONFIG from "./config.js";

const orderTableBody = document.getElementById("order-table-body");
const addOrderButton = document.querySelector(".add-order-button");
const orderFormContainer = document.getElementById("order-form-container");
const orderForm = document.getElementById("order-form");
const searchInput = document.querySelector(".search-bar");
const exportButton = document.querySelector(".export-button");

const statusModal = document.getElementById("status-update-modal");
const statusForm = document.getElementById("status-update-form");
const closeStatusModal = document.getElementById("close-status-modal");

let orders = [];
let editingOrderIndex = null; // Track the order being edited

// Updated fetch orders from API
async function fetchOrders() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/orders.php`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched orders data:", data); // Debug log

    // Ensure data is in the correct format
    if (Array.isArray(data)) {
      return data;
    } else if (data.orders && Array.isArray(data.orders)) {
      return data.orders;
    } else {
      console.error("Unexpected data format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    showNotification("Failed to fetch orders", "error");
    return [];
  }
}

async function updateOrderStatus(orderId, status, notes) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/orders.php/${orderId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) throw new Error("Failed to update order status");
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

function searchOrders(query) {
  query = query.toLowerCase();
  return orders.filter(
    (order) =>
      `ord ${order.id}`.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
  );
}

// Modify the renderOrders function to accept a filtered array
function renderOrders(ordersToRender = orders) {
  orderTableBody.innerHTML = ""; // Clear existing rows
  ordersToRender.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Order ID">ORD ${order.id}</td>
      <td data-label="Customer">${order.customer.name}</td>
      <td data-label="Date">${order.date}</td>
      <td data-label="Status">${order.status}</td>
      <td data-label="Total">${order.total}</td>
      <td data-label="Actions">
        <div class="action-buttons">
          <button class="btn btn-view">View</button>
          <button class="btn btn-primary">Edit</button>
          <button class="btn btn-status">Update Status</button>
          <button class="btn btn-danger">Delete</button>
        </div>
      </td>
    `;
    row
      .querySelector(".btn-primary:nth-child(2)")
      .addEventListener("click", () => {
        editingOrderIndex = index; // Set the index of the order being edited
        document.getElementById("customer-name").value = order.customer;
        document.getElementById("order-status").value = order.status;
        document.getElementById("order-total").value = order.total;
        orderFormContainer.classList.remove("hidden"); // Show the form container
      });

    // Add status update button handler
    row.querySelector(".btn-status").addEventListener("click", () => {
      document.getElementById("update-order-id").value = order.id;
      document.getElementById("update-status").value =
        order.status || "Pending";
      document.getElementById("update-notes").value = "";
      statusModal.classList.remove("hidden");
    });

    row.querySelector(".btn-danger").addEventListener("click", async () => {
      try {
        const response = await fetch(`${CONFIG.API_URL}/orders/${order.id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete order");

        orders = await fetchOrders(); // Refresh orders from server
        renderOrders();
        showNotification("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        showNotification("Failed to delete order", "error");
      }
    });
    orderTableBody.appendChild(row);
  });
}

// Initialize everything
async function initializePage() {
  orders = await fetchOrders();
  console.log("Orders after fetch:", orders); // Debug log
  if (orders.length === 0) {
    showNotification("No orders found or error loading orders", "warning");
  }
  renderOrders();

  // Add search functionality
  searchInput.addEventListener("input", (e) => {
    const filteredOrders = searchOrders(e.target.value);
    renderOrders(filteredOrders);
  });

  addOrderButton.addEventListener("click", () => {
    editingOrderIndex = null; // Reset editing index
    orderForm.reset(); // Clear the form fields
    orderFormContainer.classList.remove("hidden"); // Show the form container
  });

  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const customerNameInput = document.getElementById("customer-name");
    const customerEmailInput = document.getElementById("customer-email");
    const productIdInput = document.getElementById("product-id");
    const quantityInput = document.getElementById("quantity");

    // Check if all required elements exist
    if (
      !customerNameInput ||
      !customerEmailInput ||
      !productIdInput ||
      !quantityInput
    ) {
      showNotification("Required form fields are missing", "error");
      return;
    }

    const customerName = customerNameInput.value;
    const customerEmail = customerEmailInput.value;
    const productId = productIdInput.value;
    const quantity = quantityInput.value;

    // Validate required fields
    if (!customerName || !customerEmail || !productId || !quantity) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      if (editingOrderIndex !== null) {
        // Update existing order
        const orderId = orders[editingOrderIndex].id;
        const response = await fetch(`${CONFIG.API_URL}/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customer, status, total }),
        });

        if (!response.ok) throw new Error("Failed to update order");
      } else {
        const orderData = {
          customer: {
            name: customerName,
            email: customerEmail,
          },
          items: [
            {
              product_id: parseInt(productId),
              quantity: parseInt(quantity),
            },
          ],
        };

        const response = await fetch(`${CONFIG.API_URL}/orders.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Failed to create order");
      }

      orders = await fetchOrders(); // Refresh orders from server
      renderOrders();
      orderFormContainer.classList.add("hidden");
      orderForm.reset();
      showNotification("Order saved successfully!");
    } catch (error) {
      console.error("Error saving order:", error);
      showNotification("Failed to save order", "error");
    }
  });

  // Status update form handler
  statusForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderId = document.getElementById("update-order-id").value;
    const status = document.getElementById("update-status").value;
    const notes = document.getElementById("update-notes").value;

    const success = await updateOrderStatus(orderId, status, notes);
    if (success) {
      showNotification("Order status updated successfully!");
      statusModal.classList.add("hidden");
      orders = await fetchOrders();
      renderOrders();
    } else {
      showNotification("Failed to update order status", "error");
    }
  });

  // Close modal handler
  closeStatusModal.addEventListener("click", () => {
    statusModal.classList.add("hidden");
  });

  // Close modal when clicking outside
  statusModal.addEventListener("click", (e) => {
    if (e.target === statusModal) {
      statusModal.classList.add("hidden");
    }
  });

  // Export functionality
  exportButton.addEventListener("click", () => {
    if (jsonToCsv(orders)) {
      showNotification("File exported successfully!");
    } else {
      showNotification("Failed to export file", "error");
    }
  });
}

initializePage();
