const LANG = {
  ar: {
    noReelsYet: 'لا توجد فيديوهات ريلز بعد', loadMoreReels: 'المزيد من الريلز', loading: 'جارٍ التحميل...',
    noCommentsYet: 'لا توجد تعليقات بعد، كن أول من يعلّق', commentsCountLabel: '{n} تعليق', commentsWord: 'التعليقات',
    replyWord: 'رد', replyToPlaceholder: 'الرد على @{u}', addCommentPlaceholder: 'أضف تعليقاً...', reelLinkCopied: 'تم نسخ رابط الريلز'
  },
  en: {
    noReelsYet: 'No reels yet', loadMoreReels: 'More reels', loading: 'Loading...',
    noCommentsYet: 'No comments yet, be the first to comment', commentsCountLabel: '{n} comments', commentsWord: 'Comments',
    replyWord: 'Reply', replyToPlaceholder: 'Reply to @{u}', addCommentPlaceholder: 'Add a comment...', reelLinkCopied: 'Reel link copied'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
const TOKEN = localStorage.getItem('hostaka_token') || '';
let ME = null;
try { const stored = localStorage.getItem('hostaka_user'); if (stored) ME = JSON.parse(stored); } catch(e) {}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function apiFetch(url, method='GET', body=null){
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  return r.json();
}

const HEART_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const HEART_FILLED = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const COMMENT_ICON = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const SHARE_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
const BOOKMARK_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const BOOKMARK_FILLED = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const MUTE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const UNMUTE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

let reels = [];
let reelsOrder = [];
let reelsVisibleCount = 10;
const REELS_PAGE_SIZE = 10;
let soundOn = false;
let activeCommentReelId = null;

// Same 60% weighting logic favoring followed authors used on the home page
function weightedRandomSortReels(list) {
  const followed = [], others = [];
  list.forEach(p => (p.is_followed_author ? followed : others).push(p));
  function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  shuffle(followed); shuffle(others);
  const result = [];
  let fi = 0, oi = 0;
  while (fi < followed.length || oi < others.length) {
    const pickFollowed = Math.random() < 0.6;
    if (pickFollowed && fi < followed.length) result.push(followed[fi++]);
    else if (!pickFollowed && oi < others.length) result.push(others[oi++]);
    else if (fi < followed.length) result.push(followed[fi++]);
    else result.push(others[oi++]);
  }
  return result;
}

function reactCount(reel){ return (reel.reactions||[]).reduce((s,r)=>s+(r.count||0),0); }

function reelSlideHtml(r){
  const name = r.publisher_name || r.publisher || '?';
  const avatarHtml = r.user_avatar ? `<img src="${esc(r.user_avatar)}" alt="">` : `<img src="/default-avatar.jpg" alt="">`;
  const liked = r.userReaction === 'like';
  return `
  <div class="reel-slide" id="reel-${r.id}" data-id="${r.id}">
    <video src="${esc(r.video)}" loop playsinline muted preload="metadata"></video>
    <div class="reel-tap-layer" onclick="onSlideTap(${r.id})"></div>
    <div class="reel-mute-hint" id="muteHint-${r.id}"></div>
    <div class="reel-gradient-bottom"></div>
    <div class="reel-info">
      <div class="reel-pub">
        <div class="reel-avatar">${avatarHtml}</div>
        <div class="reel-pub-name">${esc(r.publisher_name || r.publisher || '')}</div>
      </div>
      ${r.content ? `<div class="reel-caption">${esc(stripHtml(r.content))}</div>` : ''}
    </div>
    <div class="reel-actions">
      <button class="reel-act-btn ${liked?'liked':''}" id="likeBtn-${r.id}" onclick="toggleReelLike(${r.id})">
        <div class="reel-act-circle">${liked?HEART_FILLED:HEART_ICON}</div>
        <span class="reel-act-count" id="likeCount-${r.id}">${reactCount(r)||''}</span>
      </button>
      <button class="reel-act-btn" onclick="openComments(${r.id})">
        <div class="reel-act-circle">${COMMENT_ICON}</div>
        <span class="reel-act-count" id="cmtCount-${r.id}">${(r.comments||[]).length||''}</span>
      </button>
      <button class="reel-act-btn" onclick="shareReel(${r.id})">
        <div class="reel-act-circle">${SHARE_ICON}</div>
      </button>
      <button class="reel-act-btn save-btn ${r.is_saved?'saved':''}" id="saveBtn-${r.id}" onclick="toggleSaveReel(${r.id})">
        <div class="reel-act-circle">${r.is_saved?BOOKMARK_FILLED:BOOKMARK_ICON}</div>
      </button>
    </div>
  </div>`;
}

function stripHtml(html){
  const d = document.createElement('div'); d.innerHTML = html;
  return (d.textContent || d.innerText || '').trim();
}

async function loadReels(){
  try {
    reels = await apiFetch('/api/reels');
    if (!Array.isArray(reels)) reels = [];
  } catch(e) { reels = []; }
  reelsOrder = weightedRandomSortReels(reels);
  reelsVisibleCount = REELS_PAGE_SIZE;
  document.getElementById('loader').style.display = 'none';
  renderReelsFeed();

  const wantedId = new URLSearchParams(location.search).get('id');
  if (wantedId) {
    const el = document.getElementById('reel-' + wantedId);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior:'instant', block:'start' }));
  }
}

function renderReelsFeed(){
  const feed = document.getElementById('reelsFeed');
  if (!reelsOrder.length) {
    feed.innerHTML = `<div class="empty-state">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2.5"/><polygon points="10.5 9.5 15 12 10.5 14.5"/></svg>
      <div>${t('noReelsYet')}</div>
    </div>`;
    return;
  }
  const visible = reelsOrder.slice(0, reelsVisibleCount);
  let html = visible.map(reelSlideHtml).join('');
  if (reelsOrder.length > visible.length) {
    html += `<div class="reel-slide reel-load-more-slide">
      <button class="load-more-btn" onclick="loadMoreReels()">${t('loadMoreReels')}</button>
    </div>`;
  }
  feed.innerHTML = html;
  setupObserver();
}

function loadMoreReels(){
  reelsVisibleCount += REELS_PAGE_SIZE;
  renderReelsFeed();
}

let observer = null;
function setupObserver(){
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        video.muted = !soundOn;
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.6, 1] });
  document.querySelectorAll('.reel-slide').forEach(s => observer.observe(s));
}

function onSlideTap(id){
  soundOn = !soundOn;
  document.querySelectorAll('.reel-slide video').forEach(v => v.muted = !soundOn);
  const hint = document.getElementById('muteHint-' + id);
  if (hint) {
    hint.innerHTML = soundOn ? UNMUTE_ICON : MUTE_ICON;
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 600);
  }
}

function goLogin(){ location.href = '/login'; }

async function toggleReelLike(id){
  if (!ME) { goLogin(); return; }
  const d = await apiFetch('/api/records/' + id + '/react', 'POST', { emoji: 'like' });
  if (!d.success) return;
  const reel = reels.find(r => r.id === id);
  if (!reel) return;
  reel.reactions = d.reactions; reel.userReaction = d.userReaction;
  const liked = reel.userReaction === 'like';
  const btn = document.getElementById('likeBtn-' + id);
  btn.classList.toggle('liked', liked);
  btn.querySelector('.reel-act-circle').innerHTML = liked ? HEART_FILLED : HEART_ICON;
  document.getElementById('likeCount-' + id).textContent = reactCount(reel) || '';
}

function openComments(id){
  if (!ME) { goLogin(); return; }
  activeCommentReelId = id;
  document.getElementById('commentsSheetBd').classList.add('show');
  renderComments();
}
function closeComments(){
  document.getElementById('commentsSheetBd').classList.remove('show');
  activeCommentReelId = null;
}

let replyingToCommentId = null;

async function renderComments(){
  const list = document.getElementById('commentsList');
  list.innerHTML = `<div class="comment-empty">${t('loading')}</div>`;
  const comments = await apiFetch('/api/records/' + activeCommentReelId + '/comments');
  const reel = reels.find(r => r.id === activeCommentReelId);
  if (reel) { reel.comments = comments; const cEl = document.getElementById('cmtCount-' + activeCommentReelId); if (cEl) cEl.textContent = comments.length || ''; }
  document.getElementById('commentsCount').textContent = comments.length ? t('commentsCountLabel',{n:comments.length}) : t('commentsWord');
  if (!comments.length) { list.innerHTML = `<div class="comment-empty">${t('noCommentsYet')}</div>`; return; }
  const top = comments.filter(c => !c.parent_id);
  const repliesOf = (cid) => comments.filter(c => Number(c.parent_id) === Number(cid));
  function row(c){
    const replies = repliesOf(c.id);
    return `<div class="comment-row">
      <div class="comment-avatar">${c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : `<img src="/default-avatar.jpg" alt="">`}</div>
      <div style="flex:1;">
        <div class="comment-name">${esc(c.display_name || c.username)}
          ${ME ? `<button class="reply-btn" onclick="startReplyTo(${c.id}, '${esc(c.username||'')}')">${t('replyWord')}</button>` : ''}
        </div>
        <div class="comment-text">${esc(c.content)}</div>
        ${replies.length ? `<div class="replies-list">${replies.map(row).join('')}</div>` : ''}
      </div>
    </div>`;
  }
  list.innerHTML = top.map(row).join('');
}

function startReplyTo(commentId, username){
  replyingToCommentId = commentId;
  const input = document.getElementById('commentInput');
  input.value = '';
  input.placeholder = t('replyToPlaceholder',{u:username});
  input.focus();
}

async function sendReelComment(){
  if (!ME) { goLogin(); return; }
  const input = document.getElementById('commentInput');
  const content = input.value.trim();
  if (!content || !activeCommentReelId) return;
  input.value = '';
  input.placeholder = t('addCommentPlaceholder');
  const parentId = replyingToCommentId;
  replyingToCommentId = null;
  const d = await apiFetch('/api/records/' + activeCommentReelId + '/comments', 'POST', { content, parent_id: parentId||null });
  if (d.success) renderComments();
}

function shareReel(id){
  const url = location.origin + '/short?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(() => showShareToast()).catch(() => showShareToast());
}
function showShareToast(){
  let el = document.createElement('div');
  el.textContent = t('reelLinkCopied');
  el.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.95);color:#000;padding:10px 20px;border-radius:24px;font-size:0.85rem;font-weight:700;z-index:200;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

async function toggleSaveReel(id){
  if(!TOKEN){ goLogin(); return; }
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const reel = reels.find(r=>r.id===id);
  if(reel) reel.is_saved = d.saved;
  const btn = document.getElementById('saveBtn-'+id);
  if(btn){
    btn.classList.toggle('saved', d.saved);
    btn.querySelector('.reel-act-circle').innerHTML = d.saved ? BOOKMARK_FILLED : BOOKMARK_ICON;
  }
}

loadReels();

/* expose top-level functions for inline onclick handlers */
try { window.esc = esc; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.reactCount = reactCount; } catch(e) {}
try { window.reelSlideHtml = reelSlideHtml; } catch(e) {}
try { window.stripHtml = stripHtml; } catch(e) {}
try { window.loadReels = loadReels; } catch(e) {}
try { window.renderReelsFeed = renderReelsFeed; } catch(e) {}
try { window.loadMoreReels = loadMoreReels; } catch(e) {}
try { window.setupObserver = setupObserver; } catch(e) {}
try { window.onSlideTap = onSlideTap; } catch(e) {}
try { window.goLogin = goLogin; } catch(e) {}
try { window.toggleReelLike = toggleReelLike; } catch(e) {}
try { window.openComments = openComments; } catch(e) {}
try { window.closeComments = closeComments; } catch(e) {}
try { window.renderComments = renderComments; } catch(e) {}
try { window.startReplyTo = startReplyTo; } catch(e) {}
try { window.sendReelComment = sendReelComment; } catch(e) {}
try { window.shareReel = shareReel; } catch(e) {}
try { window.toggleSaveReel = toggleSaveReel; } catch(e) {}
try { window.showShareToast = showShareToast; } catch(e) {}
