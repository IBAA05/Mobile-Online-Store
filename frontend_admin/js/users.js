document.addEventListener("DOMContentLoaded", () => {
  const blockButton = document.getElementById("form-container");
  const tableBody = document.querySelector(".table-body");

  let users = [];

  // Fetch users from API
  async function fetchUsers() {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/users.php", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched users data:", data); // Debug log
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async function updateUserStatus(userId, newStatus) {
    console.log("Updating user status:", userId, newStatus);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users.php/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status", response.error);
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

  async function deleteUser(userId) {
    try {
      console.log("[Delete] Starting deletion for user ID:", userId);
      const response = await fetch(
        `http://127.0.0.1:8080/api/users.php/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Delete] Response status:", response.status);
      console.log(
        "[Delete] Response headers:",
        Object.fromEntries(response.headers)
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Delete] Error response:", errorText);
        throw new Error(`Failed to delete user: ${errorText}`);
      }

      console.log("[Delete] User successfully deleted");
      return true;
    } catch (error) {
      console.error("[Delete] Error:", error);
      alert(error.message);
      return false;
    }
  }

  async function updateUserRole(userId, newRole) {
    console.log("Updating user role:", userId, newRole);
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/users.php/${userId}/role`, // Updated URL structure
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        }
      );

      const rawResponse = await response.text(); // Read raw response text
      console.log("Raw server response:", rawResponse); // Debug log

      if (!response.ok) {
        console.error("Server response not OK:", rawResponse);
        throw new Error(`Failed to update user role: ${rawResponse}`);
      }

      try {
        const updatedUser = JSON.parse(rawResponse); // Parse JSON manually
        console.log("Updated user data:", updatedUser);
        return updatedUser;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert(error.message);
      return null;
    }
  }

  function renderUsers() {
    tableBody.innerHTML = "";
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button class="btn btn-info btn-role">${user.role}</button>
        </td>
        <td>
          <button class="btn btn-primary">${
            user.status === "blocked" ? "Unblock" : "Block"
          }</button>
          <button class="btn btn-danger">Delete</button>
        </td>
      `;
      if (user.status === "blocked") {
        row.classList.add("blocked");
      }

      // Debugging log to ensure the delete button is being processed
      console.log(`[Render] Adding delete listener for user ID: ${user.id}`);

      row.querySelector(".btn-primary").addEventListener("click", async () => {
        const newStatus = user.status === "blocked" ? "active" : "blocked";
        const updatedUser = await updateUserStatus(user.id, newStatus);

        if (updatedUser) {
          users[index] = updatedUser;
          renderUsers();
        } else {
          alert("Failed to update user status");
        }
      });

      const deleteButton = row.querySelector(".btn-danger");
      if (!deleteButton) {
        console.error(
          `[Render] Delete button not found for user ID: ${user.id}`
        );
      } else {
        console.log(`[Render] Delete button found for user ID: ${user.id}`);
      }

      deleteButton.addEventListener("click", async () => {
        console.log(`[Delete] Delete button clicked for user ID: ${user.id}`);
        if (confirm("Are you sure you want to delete this user?")) {
          const success = await deleteUser(user.id);
          if (success) {
            console.log(`[Delete] User ID ${user.id} deleted successfully`);
            users.splice(index, 1);
            renderUsers();
          } else {
            alert("Failed to delete user");
          }
        }
      });

      row.querySelector(".btn-role").addEventListener("click", async () => {
        const newRole = user.role === "admin" ? "client" : "admin";
        if (
          confirm(
            `Are you sure you want to change this user's role to ${newRole}?`
          )
        ) {
          const updatedUser = await updateUserRole(user.id, newRole);
          if (updatedUser) {
            users[index] = updatedUser;
            renderUsers();
          } else {
            alert("Failed to update user role");
          }
        }
      });

      tableBody.appendChild(row);
    });
  }

  // Add blocked user style
  const style = document.createElement("style");
  style.textContent = `
    .blocked {
      background-color: #f8d7da;
      color: #721c24;
    }
  `;
  document.head.appendChild(style);

  // Initialize
  async function initializePage() {
    users = await fetchUsers();
    console.log(users);
    renderUsers();
  }

  initializePage();
});
