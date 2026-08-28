const LANG = {
  ar: {
    reactLike:'أعجبني', reactLove:'أحببته', reactHaha:'أضحكني', reactSad:'أحزنني', reactAngry:'أغضبني',
    reelsTag:'ريلز', replyWord:'رد', replyToPlaceholder:'رد @{u}', commentPlaceholder:'اكتب تعليقاً...',
    commentWord:'تعليق', reactWord:'تفاعل', confirmDeleteComment:'حذف هذا التعليق؟', unsave:'إلغاء الحفظ', save:'حفظ', share:'مشاركة',
    linkCopied:'تم نسخ رابط المنشور', cantCopy:'تعذر النسخ', postSaved:'تم حفظ المنشور', postUnsaved:'تم إلغاء حفظ المنشور',
    draft:'مسودة', privateBadge:'خاص', del:'حذف', confirmDeletePost:'حذف هذا المنشور نهائياً؟',
    deleted:'تم الحذف', cantDelete:'تعذر الحذف', postUnavailable:'هذا المنشور غير متاح', noPostSpecified:'لم يتم تحديد منشور', postTitle:'منشور'
  },
  en: {
    reactLike:'Like', reactLove:'Love', reactHaha:'Haha', reactSad:'Sad', reactAngry:'Angry',
    reelsTag:'Reels', replyWord:'Reply', replyToPlaceholder:'Reply @{u}', commentPlaceholder:'Write a comment...',
    commentWord:'comment', reactWord:'React', confirmDeleteComment:'Delete this comment?', unsave:'Unsave', save:'Save', share:'Share',
    linkCopied:'Post link copied', cantCopy:'Could not copy', postSaved:'Post saved', postUnsaved:'Post unsaved',
    draft:'Draft', privateBadge:'Private', del:'Delete', confirmDeletePost:'Permanently delete this post?',
    deleted:'Deleted', cantDelete:'Could not delete', postUnavailable:'This post is not available', noPostSpecified:'No post specified', postTitle:'Post'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';
const THEME_ICON_DARK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const THEME_ICON_LIGHT = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
function setTheme(theme){
  const html = document.documentElement;
  if(theme==='dark') html.setAttribute('data-theme','dark'); else html.removeAttribute('data-theme');
  currentTheme = theme;
  localStorage.setItem('hostaka_theme', theme);
  // كان أيقونة الزر لا تتحدث أبداً على هذه الصفحة فتبقى دائماً على شكل الشمس
  // حتى لو كان الوضع الداكن فعلياً مُفعّلاً، ما يعطي انطباعاً بأن التبديل معطّل
  if (typeof setThemeIcon === 'function') setThemeIcon(theme === 'dark' ? THEME_ICON_DARK : THEME_ICON_LIGHT);
}
function toggleTheme(){ setTheme(currentTheme==='light'?'dark':'light'); }
setTheme(currentTheme);

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function getToken(){ return localStorage.getItem('hostaka_token') || ''; }

function showToast(msg, type='success'){
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),300); }, 3200);
}

async function apiFetch(url, method='GET', body=null){
  const token = getToken();
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+token} };
  if(body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const data = await r.json().catch(()=>({}));
  return data;
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  return d.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US',{year:'numeric',month:'long',day:'numeric'});
}

const SVG = {
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  send:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  delete:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  comment:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  reel:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  check:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
};
const REACTIONS = [
  { emoji:'like',  label:t('reactLike'),  icon:SVG.like },
  { emoji:'heart', label:t('reactLove'),  icon:SVG.heart },
  { emoji:'haha',  label:t('reactHaha'),  icon:SVG.haha },
  { emoji:'sad',   label:t('reactSad'),  icon:SVG.sad },
  { emoji:'angry', label:t('reactAngry'),  icon:SVG.angry },
];

function verifiedBadge(){ return `<span class="badge-verified">${SVG.check}</span>`; }
function stripEmojis(text) {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}
function linkifyContent(html){
  try {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = (window.EmojiFluent ? EmojiFluent.render(html) : html);
    const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while((node = walker.nextNode())) textNodes.push(node);
    const re = /(^|[\s(])(?:([@#])([A-Za-z0-9_\u0600-\u06FF]{2,32})|(https?:\/\/[^\s<]+))/gu;
    textNodes.forEach(tn=>{
      const text = tn.nodeValue;
      if(!text || !/[@#]|https?:\/\//.test(text)) return;
      let last = 0, m, changed = false;
      const frag = document.createDocumentFragment();
      re.lastIndex = 0;
      while((m = re.exec(text))){
        changed = true;
        const [full, pre, sym, word, rawUrl] = m;
        const start = m.index;
        if(start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        if(pre) frag.appendChild(document.createTextNode(pre));
        if(rawUrl){
          const cleanUrl = rawUrl.replace(/[.,!?)\]]+$/, '');
          const trail = rawUrl.slice(cleanUrl.length);
          const a = document.createElement('a');
          a.textContent = cleanUrl; a.className = 'post-link'; a.href = cleanUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
          frag.appendChild(a);
          if(trail) frag.appendChild(document.createTextNode(trail));
          last = start + full.length;
          continue;
        }
        const a = document.createElement('a');
        a.textContent = sym + word;
        if(sym === '@'){ a.className = 'mention-tag'; a.href = '/profile?u=' + encodeURIComponent(word); }
        else { a.className = 'hashtag-tag'; a.href = '/?tag=' + encodeURIComponent(word); }
        frag.appendChild(a);
        last = start + full.length;
      }
      if(!changed) return;
      if(last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    });
    return wrapper.innerHTML;
  } catch(e){ return html; }
}
function goPublisher(username){ window.location = '/profile?u=' + encodeURIComponent(username); }
function sharePost(id){
  const url = location.origin + '/post?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(()=>showToast(t('linkCopied'))).catch(()=>showToast(t('cantCopy'),'error'));
}

let ME = null;
let postList = [];

function postStatusBadge(p){
  if (p.privacy === 'draft') return `<span class="post-status-badge st-draft">${t('draft')}</span>`;
  if (p.privacy === 'private') return `<span class="post-status-badge st-private">${t('privateBadge')}</span>`;
  return '';
}

function findPostItem(id){ return postList.find(p => p.id === id); }
function rerenderPostItem(id){
  const post = findPostItem(id);
  const card = document.getElementById('post-'+id);
  if (post && card) {
    const wrap = document.createElement('div');
    wrap.innerHTML = renderPostCard(post);
    card.replaceWith(wrap.firstChild);
  }
}

function renderPostCard(p){
  const canDel = ME && (ME.role==='admin' || p.user_id==ME?.id);
  let mediaHtml = '';
  if (p.video && Number(p.is_reel) === 1) {
    mediaHtml = `<div class="reel-card" onclick="location.href='/short?id=${p.id}'">
      <video class="reel-thumb-video" muted playsinline preload="metadata"><source src="${esc(p.video)}#t=0.1" type="video/mp4"></video>
      <div class="reel-play-badge">${SVG.reel}</div>
      <div class="reel-tag">${t('reelsTag')}</div>
    </div>`;
  } else if (p.video) {
    mediaHtml = `<div class="video-card" onclick="location.href='/video?id=${p.id}'">
      <video class="video-thumb-video" muted playsinline preload="metadata"><source src="${esc(p.video)}#t=0.1" type="video/mp4"></video>
      <div class="video-play-badge"><svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg></div>
      <div class="video-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="2" y="5" width="15" height="14" rx="3"/><polygon points="17 9 22 6 22 18 17 15" fill="currentColor" stroke="none"/></svg>${window.t ? window.t("common.video","Video") : "Video"}</div>
    </div>`;
  } else if (p.image) {
    mediaHtml = `<img class="card-img" src="${esc(p.image)}" loading="lazy" onerror="this.style.display='none'">`;
  }

  const totalReactions = (p.reactions||[]).reduce((s,r)=>s+(r.count||0),0);
  const userR = p.userReaction;
  const activeReact = userR ? REACTIONS.find(r=>r.emoji===userR) : null;
  const reactionHtml = `<div class="react-wrap">
    <button class="react-main-btn ${userR?'reacted':''}" onclick="toggleReactMenu(${p.id})">
      ${activeReact ? activeReact.icon : SVG.like}
      <span>${totalReactions||t('reactWord')}</span>
    </button>
    <div class="react-menu" id="rmenu-${p.id}">
      ${REACTIONS.map(r=>`<button class="react-emoji-btn ${p.userReaction===r.emoji?'active':''}" onclick="toggleReact(${p.id},'${r.emoji}')" title="${r.label}">${r.icon}</button>`).join('')}
    </div>
  </div>`;

  const allComments = p.comments || [];
  const topComments = allComments.filter(c => !c.parent_id);
  function repliesOf(cid){ return allComments.filter(c => Number(c.parent_id) === Number(cid)); }
  function oneCommentHtml(c, postId){
    const ca = c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : `<img src="/default-avatar.jpg" alt="">`;
    const canDelC = ME && (ME.role==='admin' || c.user_id==ME?.id);
    const cleanContent = linkifyContent(esc(c.content));
    const replies = repliesOf(c.id);
    const repliesHtml = replies.length ? `<div class="replies-list">${replies.map(r=>oneCommentHtml(r, postId)).join('')}</div>` : '';
    return `<div class="comment" id="cmt-${c.id}">
      <div class="c-avatar">${ca}</div>
      <div class="c-bubble">
        <div class="c-name">${esc(c.display_name||c.username)}
          ${ME ? `<button class="reply-btn" onclick="toggleReplyInput(${postId},${c.id})">${t('replyWord')}</button>` : ''}
          ${canDelC?`<button class="c-del" onclick="delComment(${c.id},${postId})">${SVG.delete}</button>`:''}
        </div>
        <div class="c-text">${cleanContent}</div>
      </div>
    </div>
    <div class="reply-input-row" id="replyRow-${c.id}" style="display:none;">
      <input class="comment-input" type="text" placeholder="${t('replyToPlaceholder',{u:esc(c.username||'')})}" id="ri-${c.id}" onkeydown="if(event.key==='Enter')sendComment(${postId},${c.id})">
      <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ri-${c.id}" title="Emoji"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');
  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="${t('commentPlaceholder')}" id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
    <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ci-${p.id}" title="Emoji"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
    <button class="btn-send-comment" onclick="sendComment(${p.id})">${SVG.send}</button>
  </div>` : '';

  return `<div class="post-card" id="post-${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="pub-row">
        <div class="pub-info">
          <div class="pub-name" style="cursor:pointer;" onclick="goPublisher('${esc(p.publisher_username||p.publisher)}')">
            ${esc(p.publisher_name || p.publisher)}
            ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            ${postStatusBadge(p)}
          </div>
        </div>
        <div class="pub-actions">
          <button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSaveItem(${p.id})" title="${p.is_saved?t('unsave'):t('save')}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>
          <button class="btn-icon" onclick="sharePost(${p.id})" title="${t('share')}">${SVG.share}</button>
          ${canDel ? `<button class="btn-icon" onclick="deletePostItem(${p.id})" title="${t('del')}">${SVG.delete}</button>` : ''}
        </div>
      </div>
      <div class="pub-date">${fmtDate(p.created_at)}</div>
      <div class="post-text post-html">${linkifyContent(p.content||'')}</div>
      <div class="reactions-row">
        ${reactionHtml}
        <button class="react-btn" onclick="toggleComments(${p.id})" id="cmtToggle-${p.id}">
          ${SVG.comment}<span>${allComments.length} ${t('commentWord')}</span>
        </button>
      </div>
      <div class="comments-section" id="cmtSec-${p.id}" style="display:none;">
        <div class="comments-list" id="cmtList-${p.id}">${commentsHtml}</div>
        ${commentInputHtml}
      </div>
    </div>
  </div>`;
}

function toggleReactMenu(id){
  const menu = document.getElementById('rmenu-'+id);
  if (!menu) return;
  document.querySelectorAll('.react-menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); });
  menu.classList.toggle('show');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.react-wrap')) document.querySelectorAll('.react-menu.show').forEach(m => m.classList.remove('show'));
});

async function toggleReact(id, emoji){
  if(!ME) return;
  document.querySelectorAll('.react-menu.show').forEach(m => m.classList.remove('show'));
  const d = await apiFetch('/api/records/'+id+'/react', 'POST', { emoji });
  if(!d.success) return;
  const post = findPostItem(id);
  if(post){ post.reactions = d.reactions; post.userReaction = d.userReaction; }
  rerenderPostItem(id);
}

function toggleComments(id){
  const sec=document.getElementById('cmtSec-'+id);
  const toggle=document.getElementById('cmtToggle-'+id);
  if(sec){
    const showing = sec.style.display==='none';
    sec.style.display = showing ? 'block' : 'none';
    if(toggle) toggle.classList.toggle('expanded', showing);
  }
}
function toggleReplyInput(postId, commentId){
  const row = document.getElementById('replyRow-'+commentId);
  if(!row) return;
  const showing = row.style.display === 'none';
  row.style.display = showing ? 'flex' : 'none';
  if(showing) document.getElementById('ri-'+commentId)?.focus();
}
async function sendComment(postId, parentId){
  if(!ME) return;
  const input = parentId ? document.getElementById('ri-'+parentId) : document.getElementById('ci-'+postId);
  if(!input||!input.value.trim()) return;
  const content=input.value.trim(); input.value='';
  const d=await apiFetch('/api/records/'+postId+'/comments','POST',{content, parent_id: parentId||null});
  if(!d.success) return;
  const comments=await apiFetch('/api/records/'+postId+'/comments');
  const post=findPostItem(postId);
  if(post){ post.comments=comments; }
  rerenderPostItem(postId);
  document.getElementById('cmtSec-'+postId).style.display='block';
  document.getElementById('cmtToggle-'+postId)?.classList.add('expanded');
}
async function delComment(commentId, postId){
  if(!await hostakaConfirm(t('confirmDeleteComment'))) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

async function toggleSaveItem(id){
  if(!ME) return;
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const post = findPostItem(id);
  if(post) post.is_saved = d.saved;
  rerenderPostItem(id);
  showToast(d.saved ? t('postSaved') : t('postUnsaved'));
}

async function deletePostItem(id){
  if(!await hostakaConfirm(t('confirmDeletePost'))) return;
  const d = await apiFetch('/api/records/'+id, 'DELETE');
  if(d.success){ showToast(t('deleted')); setTimeout(()=>{ location.href='/'; }, 800); }
  else showToast(d.error||t('cantDelete'), 'error');
}

function renderEmpty(msg){
  document.getElementById('wrap').innerHTML = `
    <div class="post-empty" style="margin-top:60px;">${SVG.share}<div>${msg || t('postUnavailable')}</div></div>
  `;
}

async function loadSinglePost(){
  const id = new URLSearchParams(location.search).get('id');
  if(!id){ renderEmpty(t('noPostSpecified')); return; }
  try{ ME = await apiFetch('/api/me'); }catch(e){ ME = null; }
  try{
    const post = await apiFetch('/api/records/'+id+'/single');
    if(post.error){ renderEmpty(post.error); return; }
    postList = [post];
    document.getElementById('wrap').innerHTML = `
      <div class="page-title">${t('postTitle')}</div>
      <div id="postSingle">${renderPostCard(post)}</div>
    `;
  }catch(e){ renderEmpty(); }
}

loadSinglePost();

try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.sharePost = sharePost; } catch(e) {}
try { window.toggleReactMenu = toggleReactMenu; } catch(e) {}
try { window.toggleReact = toggleReact; } catch(e) {}
try { window.toggleComments = toggleComments; } catch(e) {}
try { window.toggleReplyInput = toggleReplyInput; } catch(e) {}
try { window.sendComment = sendComment; } catch(e) {}
try { window.delComment = delComment; } catch(e) {}
try { window.toggleSaveItem = toggleSaveItem; } catch(e) {}
try { window.deletePostItem = deletePostItem; } catch(e) {}
