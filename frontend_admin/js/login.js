import CONFIG from "./config.js";

const API_URL = `${CONFIG.API_URL}/auth.php`;
const loginForm = document.querySelector(".login-form");
const loginButton = document.querySelector(".login-button");
const errorMessage = document.querySelector(".error-message");

// Check if already logged in
async function checkAuth() {
  try {
    const response = await fetch(`${API_URL}?action=check`, {
      credentials: "include",
    });
    const data = await response.json();

    if (data.authenticated && data.user.role === "admin") {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

if (loginForm) {
  checkAuth();

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
      showError("Please fill in both email and password.");
      return;
    }

    try {
      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      const response = await fetch(`${API_URL}?action=login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role !== "admin") {
        throw new Error("Insufficient permissions");
      }

      window.location.href = "dashboard.html";
    } catch (error) {
      showError(error.message);
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  } else {
    alert(message);
  }
}
