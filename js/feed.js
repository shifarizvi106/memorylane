document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  // Set up user info
  document.getElementById('welcomeUser').textContent = currentUser.name;

  // Initialize
  const uploadForm = document.getElementById('uploadForm');
  const feed = document.getElementById('feed');
  const emptyState = document.getElementById('emptyState');
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const captionInput = document.getElementById('captionInput');
  const charCount = document.getElementById('charCount');
  const memoryDate = document.getElementById('memoryDate');
  const logoutBtn = document.getElementById('logoutBtn');

  // Set today's date as default
  memoryDate.valueAsDate = new Date();

  // Load existing memories
  let memories = JSON.parse(localStorage.getItem('memories')) || [];
  renderMemories();

  // Character counter
  captionInput.addEventListener('input', function() {
    charCount.textContent = this.value.length;
  });

  // Image preview
  imageUpload.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Handle form submission
  uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const imageFile = imageUpload.files[0];
    const caption = captionInput.value.trim();
    const date = memoryDate.value;

    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    if (!caption) {
      alert('Please add a caption for your memory.');
      return;
    }

    // Create memory
    const reader = new FileReader();
    reader.onload = function(e) {
      const memory = {
        id: Date.now(),
        image: e.target.result,
        caption: caption,
        date: formatDate(date),
        author: currentUser.name,
        timestamp: new Date().toLocaleString()
      };

      // Add to memories and save
      memories.unshift(memory);
      localStorage.setItem('memories', JSON.stringify(memories));
      
      // Update UI
      renderMemories();
      
      // Reset form
      uploadForm.reset();
      imagePreview.style.display = 'none';
      charCount.textContent = '0';
      memoryDate.valueAsDate = new Date();
    };
    reader.readAsDataURL(imageFile);
  });

  // Logout
  logoutBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    }
  });

  // Helper functions
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function renderMemories() {
    if (memories.length === 0) {
      emptyState.style.display = 'block';
      feed.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';
    feed.innerHTML = memories.map(memory => `
      <div class="memory-card">
        <img src="${memory.image}" alt="Memory image" class="memory-image">
        <div class="memory-content">
          <p class="memory-caption">${memory.caption}</p>
          <div class="memory-date">
            <span>📅</span> ${memory.date}
          </div>
          <div class="memory-author">By ${memory.author}</div>
        </div>
      </div>
    `).join('');
  }
});
