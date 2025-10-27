// User data
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

// Check which page we're on
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('uploadForm')) {
        initFeedPage();
    }
});

// Login Page
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Check if already logged in
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'feed.html';
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const birthday = document.getElementById('birthday').value.trim();

        const user = users.find(u => 
            u.name.toLowerCase() === username.toLowerCase() && 
            u.birthday === birthday
        );

        if (user) {
            // Login successful
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'feed.html';
        } else {
            // Login failed
            errorMessage.textContent = 'Invalid username or birthday!';
            errorMessage.style.display = 'block';
        }
    });
}

// Feed Page
function initFeedPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Redirect to login if not authenticated
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Set user info
    document.getElementById('currentUserName').textContent = currentUser.name;

    // Load memories
    let memories = JSON.parse(localStorage.getItem('memories')) || [];
    renderMemories(memories);

    // Setup event listeners
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const imageInput = document.getElementById('imageInput');
        const captionInput = document.getElementById('captionInput');
        const memoryDate = document.getElementById('memoryDate');

        if (!imageInput.files[0]) {
            alert('Please select an image');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newMemory = {
                id: Date.now(),
                image: e.target.result,
                caption: captionInput.value,
                date: memoryDate.value,
                author: currentUser.name,
                timestamp: new Date().toISOString()
            };

            memories.unshift(newMemory);
            localStorage.setItem('memories', JSON.stringify(memories));
            renderMemories(memories);
            
            // Reset form
            document.getElementById('uploadForm').reset();
        };
        reader.readAsDataURL(imageInput.files[0]);
    });
}

function renderMemories(memories) {
    const feed = document.getElementById('memoryFeed');
    
    if (memories.length === 0) {
        feed.innerHTML = `
            <div class="empty-state">
                <h3>No memories yet</h3>
                <p>Be the first to share a memory!</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = memories.map(memory => `
        <div class="memory-card">
            <img src="${memory.image}" alt="Memory" class="memory-image">
            <div class="memory-content">
                <p class="memory-caption">${memory.caption}</p>
                <div class="memory-date">
                    📅 ${new Date(memory.date).toLocaleDateString()} • By ${memory.author}
                </div>
            </div>
        </div>
    `).join('');
}
