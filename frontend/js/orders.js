const orderTableBody = document.getElementById("order-table-body");
const addOrderButton = document.querySelector(".add-order-button");
const orderFormContainer = document.getElementById("order-form-container");
const orderForm = document.getElementById("order-form");

let orders = [];
let editingOrderIndex = null; // Track the order being edited

// Fetch orders from JSON
async function fetchOrders() {
  try {
    const response = await fetch("data/orders.json");
    const data = await response.json();
    console.log(data);
    return data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Render orders in table
function renderOrders() {
  orderTableBody.innerHTML = ""; // Clear existing rows
  orders.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>${order.status}</td>
      <td>${order.total}</td>
      <td>
        <button class="view-button">View</button>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      </td>
    `;
    row.querySelector(".edit-button").addEventListener("click", () => {
      editingOrderIndex = index; // Set the index of the order being edited
      document.getElementById("customer-name").value = order.customer;
      document.getElementById("order-status").value = order.status;
      document.getElementById("order-total").value = order.total;
      orderFormContainer.classList.remove("hidden"); // Show the form container
    });
    row.querySelector(".delete-button").addEventListener("click", () => {
      orders.splice(index, 1); // Remove the order from the array
      renderOrders(); // Re-render the table
    });
    orderTableBody.appendChild(row);
  });
}

// Initialize everything
async function initializePage() {
  orders = await fetchOrders();
  renderOrders();

  addOrderButton.addEventListener("click", () => {
    editingOrderIndex = null; // Reset editing index
    orderForm.reset(); // Clear the form fields
    orderFormContainer.classList.remove("hidden"); // Show the form container
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    const customer = document.getElementById("customer-name").value;
    const status = document.getElementById("order-status").value;
    const total = document.getElementById("order-total").value;

    if (customer && status && total) {
      if (editingOrderIndex !== null) {
        // Update existing order
        orders[editingOrderIndex].customer = customer;
        orders[editingOrderIndex].status = status;
        orders[editingOrderIndex].total = total;
      } else {
        // Add new order
        const id = `ORD${String(orders.length + 1).padStart(3, "0")}`;
        const date = new Date().toISOString().split("T")[0];
        orders.push({ id, customer, date, status, total });
      }
      renderOrders();
      orderFormContainer.classList.add("hidden"); // Hide the form container
      orderForm.reset();
    }
  });
}

initializePage();
