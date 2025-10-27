document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');

  // Predefined users
  const users = [
    { name: "Ritika", birthday: "6-07-2008" },
    { name: "Vidhi", birthday: "12-11-2008" },
    { name: "Saksham", birthday: "24-01-2009" },
    { name: "Harshit", birthday: "23-01-2007" },
    { name: "Sai", birthday: "4-03-2008" },
    { name: "Juili", birthday: "25-05-2008" },
    { name: "Kunal", birthday: "19-10-2008" },
    { name: "Ayaan", birthday: "16-10-2008" },
    { name: "Amrut", birthday: "20-09-2005" },
    { name: "Shifa", birthday: "10-06-2008" }
  ];

  // Redirect if already logged in
  if (localStorage.getItem('currentUser')) {
    window.location.href = 'feed.html';
  }

  // Handle login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const birthday = document.getElementById('password').value.trim();

    if (!username || !birthday) {
      showError('Please enter both username and birthday');
      return;
    }

    const user = users.find(u => 
      u.name.toLowerCase() === username.toLowerCase() && 
      u.birthday === birthday
    );
    
    if (user) {
      // Show loading state
      loginBtn.textContent = 'Logging in...';
      loginBtn.disabled = true;
      
      // Store user and redirect
      localStorage.setItem('currentUser', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = 'feed.html';
      }, 1000);
    } else {
      showError('Invalid username or birthday!');
    }
  });

  function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
  }

  // Clear error on input
  document.getElementById('username').addEventListener('input', clearError);
  document.getElementById('password').addEventListener('input', clearError);
  
  function clearError() {
    loginError.style.display = 'none';
  }
});
