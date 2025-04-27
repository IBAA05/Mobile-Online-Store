
      document.addEventListener('DOMContentLoaded', function() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
        const loginButton = document.getElementById('loginButton');
        
        if (loginButton) {
          if (isLoggedIn) {
            loginButton.style.display = 'none';
            
            // Optional: Add logout button when logged in
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'logout-btn';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = function() {
              localStorage.removeItem('adminLoggedIn');
              localStorage.removeItem('adminId');
              localStorage.removeItem('adminName');
              localStorage.removeItem('adminRole');
              sessionStorage.removeItem('adminLoggedIn');
              sessionStorage.removeItem('adminId');
              sessionStorage.removeItem('adminName');
              sessionStorage.removeItem('adminRole');
              window.location.reload();
            };
            document.getElementById('authButtons').insertBefore(logoutBtn, loginButton.nextSibling);
          } else {
            loginButton.style.display = 'block';
          }
        }
      });