const profileName = document.getElementById('profileName');
const bioInput = document.getElementById('bioInput');
const sidebar = document.getElementById('sidebar');

function renderSidebar(){
  sidebar.innerHTML = '<h2>Friends</h2>';
  users.forEach(u=>{
    const btn = document.createElement('button');
    btn.textContent = u.name;
    btn.className='friend-btn';
    btn.onclick=()=>viewProfile(u.name);
    sidebar.appendChild(btn);
  });
}

async function viewProfile(name){
  const user = users.find(u=>u.name===name);
  if(!user) return;

  profileName.textContent = name+"'s Profile";
  bioInput.value = user.bio||'';
  bioInput.disabled = (name!==currentUser.name);

  await fetchPosts();
  renderPosts(user.name);
}

// Save bio
bioInput.addEventListener('input', async ()=>{
  if(!currentUser) return;
  await fetch(`${API_BASE}/users/update`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name: currentUser.name, bio: bioInput.value})
  });
});
