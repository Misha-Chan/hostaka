const LANG = {
  ar: {
    pageNotSpecified: 'لم يتم تحديد الصفحة', cantLoadPage: 'تعذر تحميل الصفحة',
    editPage: 'تعديل الصفحة', following: 'متابَع', follow: 'متابعة', loginToFollow: 'تسجيل الدخول للمتابعة',
    noPostsYet: 'لا توجد منشورات بعد', followerWord: 'متابع', postWord: 'منشور', edited: 'معدّلة',
    coverChosen: 'تم اختيار الغلاف، اضغط حفظ لتطبيقه', pageNameRequired: 'اسم الصفحة مطلوب',
    saveFail: 'فشل الحفظ', cantConnect: 'تعذر الاتصال'
  },
  en: {
    pageNotSpecified: 'No page specified', cantLoadPage: 'Could not load the page',
    editPage: 'Edit page', following: 'Following', follow: 'Follow', loginToFollow: 'Log in to follow',
    noPostsYet: 'No posts yet', followerWord: 'followers', postWord: 'posts', edited: 'edited',
    coverChosen: 'Cover selected — press Save to apply it', pageNameRequired: 'Page name is required',
    saveFail: 'Save failed', cantConnect: 'Could not connect'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
if (localStorage.getItem('hostaka_theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}
const TOKEN = localStorage.getItem('hostaka_token') || '';
let ME = null;
try { const s = localStorage.getItem('hostaka_user'); if (s) ME = JSON.parse(s); } catch(e) {}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
async function apiFetch(url, method='GET', body=null){
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  return r.json();
}
function toUTCDate(s){
  if (!s) return new Date(NaN);
  if (typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ', 'T') + 'Z');
  return new Date(s);
}
function fmtDate(s){
  const d = toUTCDate(s);
  return d.toLocaleDateString(currentLang === 'ar' ? 'ar' : 'en-US', { day:'numeric', month:'short', year:'numeric' });
}

const username = new URLSearchParams(location.search).get('u') || '';
let pageData = null;

async function loadPage(){
  if (!username) { showEmpty(t('pageNotSpecified')); return; }
  try {
    const d = await apiFetch('/api/pages/' + encodeURIComponent(username));
    if (d.error) { showEmpty(d.error); return; }
    pageData = d;
    document.title = 'Hostaka — ' + d.name;
    render();
  } catch(e) { showEmpty(t('cantLoadPage')); }
}

function showEmpty(msg){
  document.getElementById('content').innerHTML = `<div class="empty">${esc(msg)}</div>`;
}

function render(){
  const p = pageData;
  const avatarHtml = p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc((p.name||'?').charAt(0).toUpperCase());
  const followBtn = ME
    ? (p.isOwner
        ? `<button class="btn btn-ghost" onclick="openEditPage()">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
             ${t('editPage')}
           </button>`
        : `<button class="btn ${p.isFollowing ? 'btn-primary following' : 'btn-primary'}" id="followBtn" onclick="toggleFollow()">${p.isFollowing ? t('following') : t('follow')}</button>`)
    : `<button class="btn btn-primary" onclick="location.href='/login'">${t('loginToFollow')}</button>`;

  const postsHtml = (p.posts && p.posts.length)
    ? p.posts.map(postCardHtml).join('')
    : `<div class="empty">${t('noPostsYet')}</div>`;

  document.getElementById('content').innerHTML = `
    <div class="cover">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : ''}</div>
    <div class="page-head">
      <div class="page-avatar">${avatarHtml}</div>
      <div class="page-info">
        <div class="page-name">${esc(p.name)}${p.verified ? verifiedBadge() : ''}</div>
        <div class="page-handle">@${esc(p.username)}${p.category ? ' · ' + esc(p.category) : ''}</div>
        ${p.bio ? `<div class="page-bio">${esc(p.bio)}</div>` : ''}
        <div class="page-stats"><span><b id="followerCount">${p.followerCount || 0}</b> ${t('followerWord')}</span><span><b>${(p.posts||[]).length}</b> ${t('postWord')}</span></div>
        <div class="page-actions">${followBtn}</div>
      </div>
    </div>
    <div class="posts-wrap">${postsHtml}</div>
  `;
}

function verifiedBadge(){
  return `<svg width="16" height="16" viewBox="0 0 24 24" style="fill:var(--primary)"><path d="M12 2l2.4 2.2 3.2-.6.6 3.2L20.4 9l-1.8 2.8L20.4 15l-2.2 2.2-.6 3.2-3.2-.6L12 22l-2.4-2.2-3.2.6-.6-3.2L3.6 15l1.8-2.8L3.6 9l2.2-2.2.6-3.2 3.2.6z"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function postCardHtml(post){
  const avatarHtml = pageData.avatar ? `<img src="${esc(pageData.avatar)}" alt="">` : esc((pageData.name||'?').charAt(0).toUpperCase());
  let mediaHtml = '';
  if (post.video) mediaHtml = `<div class="post-media"><video controls src="${esc(post.video)}"></video></div>`;
  else if (post.image) mediaHtml = `<div class="post-media"><img src="${esc(post.image)}" loading="lazy"></div>`;
  return `<div class="post-card">
    <div class="post-head">
      <div class="post-av">${avatarHtml}</div>
      <div>
        <div class="post-name">${esc(pageData.name)}</div>
        <div class="post-date">${fmtDate(post.created_at)}${Number(post.edited)===1 ? ' · ' + t('edited') : ''}</div>
      </div>
    </div>
    ${post.content ? `<div class="post-content">${esc(post.content)}</div>` : ''}
    ${mediaHtml}
  </div>`;
}

async function toggleFollow(){
  if (!ME) { location.href = '/login'; return; }
  const btn = document.getElementById('followBtn');
  btn.disabled = true;
  try {
    const action = pageData.isFollowing ? 'unfollow' : 'follow';
    const d = await apiFetch('/api/pages/' + pageData.id + '/' + action, 'POST');
    if (d.success) {
      pageData.isFollowing = !pageData.isFollowing;
      pageData.followerCount = d.followerCount;
      render();
    }
  } catch(e) {}
  if (btn) btn.disabled = false;
}

let editAvatarBase64 = '';
let editCoverBase64 = '';
function openEditPage(){
  document.getElementById('epName').value = pageData.name || '';
  document.getElementById('epCategory').value = pageData.category || '';
  document.getElementById('epBio').value = pageData.bio || '';
  document.getElementById('editPageErr').style.display = 'none';
  editAvatarBase64 = '';
  editCoverBase64 = '';
  document.getElementById('editPageModal').classList.add('show');
}
function closeEditPage(){ document.getElementById('editPageModal').classList.remove('show'); }
function onEditAvatar(e){
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => { editAvatarBase64 = ev.target.result; };
  reader.readAsDataURL(f);
}
function onEditCover(e){
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => { editCoverBase64 = ev.target.result; showToast(t('coverChosen')); };
  reader.readAsDataURL(f);
}
async function savePageEdit(){
  const errEl = document.getElementById('editPageErr'); errEl.style.display = 'none';
  const name = document.getElementById('epName').value.trim();
  if (!name) { errEl.textContent = t('pageNameRequired'); errEl.style.display = 'block'; return; }
  const btn = document.getElementById('epSaveBtn'); btn.disabled = true;
  try {
    let avatarUrl = pageData.avatar;
    if (editAvatarBase64) {
      const up = await apiFetch('/api/upload', 'POST', { image: editAvatarBase64 });
      if (up.url) avatarUrl = up.url;
    }
    let coverUrl = pageData.cover;
    if (editCoverBase64) {
      const up = await apiFetch('/api/upload', 'POST', { image: editCoverBase64 });
      if (up.url) coverUrl = up.url;
    }
    const d = await apiFetch('/api/pages/' + pageData.id, 'PUT', {
      name, avatar: avatarUrl, cover: coverUrl, bio: document.getElementById('epBio').value.trim(),
      category: document.getElementById('epCategory').value.trim()
    });
    if (d.success) { closeEditPage(); await loadPage(); }
    else { errEl.textContent = d.error || t('saveFail'); errEl.style.display = 'block'; }
  } catch(e) { errEl.textContent = t('cantConnect'); errEl.style.display = 'block'; }
  btn.disabled = false;
}

loadPage();

/* expose top-level functions for inline onclick handlers */
try { window.esc = esc; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.loadPage = loadPage; } catch(e) {}
try { window.showEmpty = showEmpty; } catch(e) {}
try { window.render = render; } catch(e) {}
try { window.verifiedBadge = verifiedBadge; } catch(e) {}
try { window.postCardHtml = postCardHtml; } catch(e) {}
try { window.toggleFollow = toggleFollow; } catch(e) {}
try { window.openEditPage = openEditPage; } catch(e) {}
try { window.closeEditPage = closeEditPage; } catch(e) {}
try { window.onEditAvatar = onEditAvatar; } catch(e) {}
try { window.savePageEdit = savePageEdit; } catch(e) {}
