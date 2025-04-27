// auth.js
function checkAuth() {
    return localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
  }
  
  function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminId');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('adminRole');
    window.location.href = 'index.html';
  }
  
  function updateAuthUI() {
    const isLoggedIn = checkAuth();
    const loginButton = document.getElementById('loginButton');
    const authButtons = document.getElementById('authButtons');
    
    if (loginButton) {
      loginButton.style.display = isLoggedIn ? 'none' : 'block';
    }
    
    // Add/remove logout button
    const existingLogout = document.querySelector('.logout-btn');
    if (isLoggedIn && !existingLogout) {
      const logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = logout;
      authButtons.appendChild(logoutBtn);
    } else if (!isLoggedIn && existingLogout) {
      existingLogout.remove();
    }
  }
  
  document.addEventListener('DOMContentLoaded', updateAuthUI);