const API_BASE = "http://localhost:3000/api";

let currentUser = null;
let users = [];
let posts = [];

// Fetch all users
async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    users = await res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to empty array if API fails
    users = [];
  }
}

// Fetch all posts
async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    posts = await res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Fallback to empty array if API fails
    posts = [];
  }
}

// Create a new post
async function createPost(postData) {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    
    if (!res.ok) throw new Error('Failed to create post');
    
    const newPost = await res.json();
    posts.unshift(newPost); // Add to beginning of posts array
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Upload image and get URL (simplified version)
async function uploadImage(imageFile) {
  // In a real app, you would upload to a server and get back a URL
  // For demo purposes, we'll use a data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(imageFile);
  });
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Show app content
function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('welcomeUser').textContent = currentUser.username;
  renderFeed();
  renderFriends();
}

// Render feed posts
function renderFeed() {
  const postsGrid = document.getElementById('postsGrid');
  const noPostsMessage = document.getElementById('noPostsMessage');
  
  if (posts.length === 0) {
    postsGrid.innerHTML = '';
    noPostsMessage.style.display = 'block';
    return;
  }
  
  noPostsMessage.style.display = 'none';
  
  postsGrid.innerHTML = posts.map(post => `
    <div class="post-card">
      <img src="${post.image}" alt="Memory image" class="post-image">
      <div class="post-content">
        <p class="post-caption">${post.caption}</p>
        <div class="post-meta">
          <span class="post-author">By ${post.author}</span>
          <span class="post-date">${formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Render friends list
function renderFriends() {
  const sidebar = document.getElementById('sidebar');
  const friendsList = users.filter(user => user.id !== currentUser.id);
  
  sidebar.innerHTML = `
    <h2>Friends</h2>
    ${friendsList.map(user => `
      <button class="friend-btn" data-userid="${user.id}">
        ${user.username}
      </button>
    `).join('')}
  `;
}

// Handle new post creation
async function handleCreatePost(imageFile, caption, date) {
  try {
    // Show loading state
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.textContent = 'Posting...';
    uploadBtn.disabled = true;
    
    // Upload image and create post
    const imageUrl = await uploadImage(imageFile);
    
    const postData = {
      image: imageUrl,
      caption: caption,
      date: date,
      author: currentUser.username,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    await createPost(postData);
    renderFeed();
    
    // Reset form
    document.getElementById('uploadForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('charCount').textContent = '0';
    
  } catch (error) {
    alert('Failed to create post. Please try again.');
    console.error('Post creation error:', error);
  } finally {
    // Reset button state
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.textContent = 'Post Memory';
    uploadBtn.disabled = false;
  }
}

// Initialize the application
async function init() {
  try {
    await fetchUsers();
    await fetchPosts();
    
    const storedUser = localStorage.getItem('memoryLaneUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      showApp();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    // Show error state or fallback UI
  }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Image preview functionality
  document.getElementById('imageUpload').addEventListener('change', function() {
    const preview = document.getElementById('imagePreview');
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  // Character counter
  document.getElementById('captionInput').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
  });
  
  // Form submission
  document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('imageUpload').files[0];
    const caption = document.getElementById('captionInput').value.trim();
    const date = document.getElementById('memoryDate').value;
    
    if (!imageFile) {
      alert('Please select an image');
      return;
    }
    
    if (!caption) {
      alert('Please add a caption');
      return;
    }
    
    await handleCreatePost(imageFile, caption, date);
  });
  
  // Logout functionality
  document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('memoryLaneUser');
      window.location.reload();
    }
  });
});

// Initialize the app
init();
