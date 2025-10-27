const API_BASE = "http://localhost:3000/api";

let currentUser = null;
let users = [];
let posts = [];

// Fetch all users
async function fetchUsers(){
  const res = await fetch(`${API_BASE}/users`);
  users = await res.json();
}

// Fetch all posts
async function fetchPosts(){
  const res = await fetch(`${API_BASE}/posts`);
  posts = await res.json();
}

// Format date
function formatDate(dateString){
  const date = new Date(dateString);
  if(isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
}

// Init
async function init(){
  await fetchUsers();
  await fetchPosts();

  const storedUser = localStorage.getItem('memoryLaneUser');
  if(storedUser){
    currentUser = JSON.parse(storedUser);
    showApp();
  }
}

init();
