// auth.js
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('username').value.trim();
  const birthday = document.getElementById('password').value.trim();

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

  const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.birthday === birthday);
  
  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'feed.html';
  } else {
    alert('Invalid username or birthday!');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('loggedInUser');
  if (currentUser) {
    window.location.href = 'feed.html';
  }
});
