const blockButton = document.getElementById("form-container"); // Corrected ID
const tableBody = document.querySelector(".table-body"); // Corrected selector

let users = [];
let editingOrderIndex = null; // Track the user being edited

// Fetch users from JSON
async function fetchOrders() {
  try {
    const response = await fetch("data/users.json");
    const data = await response.json();
    console.log(data);
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error); // Corrected error message
    return [];
  }
}

function renderUsers() {
  tableBody.innerHTML = ""; // Clear existing rows
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
            <button class="btn btn-primary">${
              user.blocked ? "Unblock" : "Block"
            }</button>
            <button class="btn btn-danger">Delete</button>
        </td>
        `;
    if (user.blocked) {
      row.classList.add("blocked"); // Add a class to visually indicate blocked users
    }
    row.querySelector(".btn-primary").addEventListener("click", () => {
      user.blocked = !user.blocked; // Toggle the blocked status
      renderUsers(); // Re-render the table
    });
    row.querySelector(".btn-danger").addEventListener("click", () => {
      users.splice(index, 1); // Remove the user from the array
      renderUsers();
    });
    tableBody.appendChild(row);
  });
}

/* When blocking a user we change the style */
const style = document.createElement("style");
style.textContent = `
  .blocked {
    background-color: #f8d7da;
    color: #721c24; 
  }
`;
document.head.appendChild(style);

// Initialize everything
async function initializePage() {
  users = await fetchOrders();
  users = users.map((user) => ({ ...user, blocked: false })); // Add a 'blocked' property to each user
  renderUsers();
}
initializePage();
