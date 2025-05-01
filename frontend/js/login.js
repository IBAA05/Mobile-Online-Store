const loginForm = document.querySelector(".login-form");

if (loginForm) {
  console.log("Login form found");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    console.log("Email:", email);
    console.log("Password:", password);
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    // Simulate login logic (replace with actual API call if needed)
    if (email === "def@gmail.com" && password === "def123") {
      // Redirect to admin dashboard or perform other actions
      window.location.href = "dashboard.html"; // Corrected path with leading slash
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
}
