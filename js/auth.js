// auth.js
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('loginError');
  
  // Predefined users - you can expand this list
  const users = [
    { name: "Ritika", birthday: "6th July 2008" },
    { name: "Vidhi", birthday: "12th November 2008" },
    { name: "Saksham", birthday: "24th January 2009" },
    { name: "Harshit", birthday: "23rd January 2007" },
    { name: "Sai", birthday: "4th March 2008" },
    { name: "Juili", birthday: "25th May 2008" },
    { name: "Kunal", birthday: "19th October 2008" },
    { name: "Ayaan", birthday: "16th January 2008" },
    { name: "Amrut", birthday: "20th September 2005" },
    { name: "Shifa", birthday: "10th June 2008" }
  ];

  // Check if user is already logged in
  const currentUser = localStorage.getItem('loggedInUser');
  if (currentUser) {
    window.location.href = 'feed.html';
    return;
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('username').value.trim();
      const birthday = document.getElementById('password').value.trim();

      // Validation
      if (!name || !birthday) {
        showError('Please enter both username and birthday');
        return;
      }

      // Find user (case-insensitive name match, exact birthday match)
      const user = users.find(u => 
        u.name.toLowerCase() === name.toLowerCase() && 
        u.birthday === birthday
      );
      
      if (user) {
        // Successful login
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        showError(''); // Clear any previous errors
        
        // Optional: Show loading state
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
          loginBtn.textContent = 'Logging in...';
          loginBtn.disabled = true;
        }
        
        // Redirect after a brief delay for better UX
        setTimeout(() => {
          window.location.href = 'feed.html';
        }, 1000);
        
      } else {
        showError('Invalid username or birthday! Please try again.');
      }
    });
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = message ? 'block' : 'none';
    } else {
      // Fallback to alert if error element doesn't exist
      if (message) alert(message);
    }
  }

  // Optional: Add real-time validation
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  if (usernameInput && passwordInput) {
    [usernameInput, passwordInput].forEach(input => {
      input.addEventListener('input', function() {
        // Clear error when user starts typing
        if (errorMessage && errorMessage.style.display !== 'none') {
          showError('');
        }
      });
    });
  }
});
