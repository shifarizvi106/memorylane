const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');
const loginScreen = document.getElementById('loginScreen');
const appDiv = document.getElementById('app');
const welcomeUser = document.getElementById('welcomeUser');

loginBtn.onclick = async ()=>{
  const name = document.getElementById('username').value.trim();
  const birthday = document.getElementById('password').value.trim();
  if(!name || !birthday){ loginError.textContent='Enter username & birthday'; return; }

  const res = await fetch(`${API_BASE}/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name, birthday})
  });

  const data = await res.json();
  if(data.success){
    currentUser = data.user;
    localStorage.setItem('memoryLaneUser', JSON.stringify(currentUser));
    showApp();
  } else {
    loginError.textContent = 'Invalid credentials';
  }
}

logoutBtn.onclick = ()=>{
  if(confirm('Logout?')){
    currentUser = null;
    localStorage.removeItem('memoryLaneUser');
    loginScreen.style.display='flex';
    appDiv.style.display='none';
  }
}

function showApp(){
  loginScreen.style.display='none';
  appDiv.style.display='flex';
  welcomeUser.textContent = currentUser.name;
  renderSidebar();
  viewProfile(currentUser.name);
}
