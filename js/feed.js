const postsGrid = document.getElementById('postsGrid');
const uploadBtn = document.getElementById('uploadBtn');
const imageUpload = document.getElementById('imageUpload');
const captionInput = document.getElementById('captionInput');
const memoryDate = document.getElementById('memoryDate');

function renderPosts(username){
  const userPosts = posts.filter(p=>p.user===username).sort((a,b)=>b.id-a.id);
  postsGrid.innerHTML='';
  if(userPosts.length===0){
    postsGrid.innerHTML='<p>No memories yet</p>';
    return;
  }

  userPosts.forEach(post=>{
    const card = document.createElement('div'); card.className='post-card';

    const img = document.createElement('img');
    img.src = post.image; img.alt=post.caption;
    img.onclick = ()=>openFullView(post.image, post.caption);

    const caption = document.createElement('div');
    caption.textContent = post.caption;

    const dateDiv = document.createElement('div');
    dateDiv.textContent = formatDate(post.date);

    const actions = document.createElement('div');

    // Like
    const likeBtn = document.createElement('button');
    likeBtn.textContent=`❤️ ${post.likes.length||0}`;
    likeBtn.onclick=async ()=>{
      await fetch(`${API_BASE}/posts/like`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({postId:post.id, user: currentUser.name})
      });
      await fetchPosts(); renderPosts(username);
    };
    actions.appendChild(likeBtn);

    // Delete
    if(post.user===currentUser.name){
      const delBtn = document.createElement('button');
      delBtn.textContent='Delete';
      delBtn.onclick=async ()=>{
        if(confirm('Delete this memory?')){
          posts = posts.filter(p=>p.id!==post.id);
          await fetch(`${API_BASE}/posts/add`,{
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({deleteId: post.id})
          });
          await fetchPosts(); renderPosts(username);
        }
      };
      actions.appendChild(delBtn);
    }

    // Comments
    const commentBox = document.createElement('div');
    const commentInput = document.createElement('input');
    commentInput.placeholder='Add comment...';
    const commentBtn = document.createElement('button');
    commentBtn.textContent='Post';
    commentBtn.onclick=async ()=>{
      if(!commentInput.value.trim()) return;
      await fetch(`${API_BASE}/posts/comment`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({postId:post.id, user:currentUser.name, text:commentInput.value})
      });
      commentInput.value=''; await fetchPosts(); renderPosts(username);
    };
    commentBox.appendChild(commentInput); commentBox.appendChild(commentBtn);

    const commentsDiv = document.createElement('div');
    (post.comments||[]).forEach(c=>{
      const cDiv=document.createElement('div');
      cDiv.innerHTML=`<strong>${c.user}</strong>: ${c.text}`;
      commentsDiv.appendChild(cDiv);
    });

    card.appendChild(img); card.appendChild(caption); card.appendChild(dateDiv);
    card.appendChild(actions); card.appendChild(commentBox); card.appendChild(commentsDiv);
    postsGrid.appendChild(card);
  });
}

// Upload post
uploadBtn.onclick=async ()=>{
  const file = imageUpload.files[0]; if(!file){alert('Select image'); return;}
  const reader = new FileReader();
  reader.onload=async ()=>{
    await fetch(`${API_BASE}/posts/add`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        user: currentUser.name,
        caption: captionInput.value.trim(),
        image: reader.result,
        date: memoryDate.value || new Date().toISOString().split('T')[0]
      })
    });
    captionInput.value=''; imageUpload.value='';
    await fetchPosts(); renderPosts(currentUser.name);
  };
  reader.readAsDataURL(file);
};
