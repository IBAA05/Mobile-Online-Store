document.addEventListener('DOMContentLoaded', function() {
  // Check login status and update UI immediately
  checkExistingSession();
  updateAuthUI();

  // Password toggle functionality
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Signup button redirect
  const signupButton = document.getElementById('signupButton');
  if (signupButton) {
    signupButton.addEventListener('click', () => {
      window.location.href = 'sign-up.html';
    });
  }

  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Hide error on input focus
  const inputs = document.querySelectorAll('#email, #password');
  inputs.forEach(input => {
    input.addEventListener('focus', hideError);
  });
});

function checkExistingSession() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
  const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

  if (isLoggedIn && adminId && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  }
}

function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  try {
    // Note: Ensure db object is available
    const admin = db.findAdminByEmail(email);

    if (!admin) {
      showError('Invalid email or password');
      return;
    }

    if (admin.status !== 'active') {
      showError('Your account is not active. Please contact the super admin.');
      return;
    }

    if (password !== admin.password) {
      showError('Invalid email or password');
      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('adminLoggedIn', 'true');
    storage.setItem('adminId', admin.id.toString());
    storage.setItem('adminName', admin.name);
    storage.setItem('adminRole', admin.role);

    db.updateAdmin(admin.id, { lastLogin: new Date() });

    updateAuthUI(); // Update UI before redirect
    window.location.href = 'index.html';

  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred during login. Please try again.');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');

  if (errorDiv && errorText) {
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
  } else {
    alert(message);
  }
}

function hideError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

function updateAuthUI() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
  const loginButton = document.getElementById('loginButton');
  console.log('isLoggedIn:', isLoggedIn);
  console.log('loginButton:', loginButton);
  if (loginButton) {
    if (isLoggedIn) {
      loginButton.classList.add('hidden-element');
    } else {
      loginButton.classList.remove('hidden-element');
    }
  }
}