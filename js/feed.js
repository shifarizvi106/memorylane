// feed.js
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
});
