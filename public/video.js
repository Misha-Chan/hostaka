const LANG = {
  ar: {
    untitled:'بدون عنوان', likeWord:'إعجاب', commentWord:'تعليق', shareWord:'مشاركة', savedWord:'محفوظ', saveWord:'حفظ',
    otherVideos:'فيديوهات أخرى', noOtherVideosYet:'لا يوجد فيديوهات أخرى بعد', addCommentPlaceholder:'أضف تعليقاً...',
    deleteWord:'حذف', noCommentsYetFirst:'لا توجد تعليقات بعد — كن أول من يعلّق', cantFindVideo:'تعذر العثور على الفيديو',
    videoSaved:'تم حفظ الفيديو', videoUnsaved:'تم إلغاء حفظ الفيديو', videoLinkCopied:'تم نسخ رابط الفيديو',
    cantCopy:'تعذر النسخ', confirmDeleteComment:'حذف هذا التعليق؟', noVideosYet:'لا توجد فيديوهات بعد'
  },
  en: {
    untitled:'Untitled', likeWord:'Like', commentWord:'comment', shareWord:'Share', savedWord:'Saved', saveWord:'Save',
    otherVideos:'Other videos', noOtherVideosYet:'No other videos yet', addCommentPlaceholder:'Add a comment...',
    deleteWord:'Delete', noCommentsYetFirst:'No comments yet — be the first to comment', cantFindVideo:'Could not find the video',
    videoSaved:'Video saved', videoUnsaved:'Video unsaved', videoLinkCopied:'Video link copied',
    cantCopy:'Could not copy', confirmDeleteComment:'Delete this comment?', noVideosYet:'No videos yet'
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
function setTheme(theme){
  const html = document.documentElement;
  if(theme==='dark') html.setAttribute('data-theme','dark'); else html.removeAttribute('data-theme');
  currentTheme = theme;
  localStorage.setItem('hostaka_theme', theme);
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

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  return d.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
}

const VSVG = {
  play:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  playSm:   `<svg width="34" height="34" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  comment:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  bookmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  send:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  empty:    `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="15" height="14" rx="3"/><polygon points="17 9 22 6 22 18 17 15" fill="currentColor" stroke="none"/></svg>`,
};

function goPublisher(username){ window.location = '/profile?u=' + encodeURIComponent(username); }
function verifiedBadge(){ return `<span class="badge-verified"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>`; }

let ME = null;
let allVideos = [];
let currentVideo = null;

function getIdFromUrl(){
  const params = new URLSearchParams(location.search);
  return params.get('id');
}

function vgCardHtml(v){
  return `<div class="vg-card" onclick="watchVideo(${v.id})">
    <div class="vg-thumb-wrap">
      <video class="vg-thumb" muted playsinline preload="metadata"><source src="${esc(v.video)}#t=0.1" type="video/mp4"></video>
      <div class="vg-play">${VSVG.playSm}</div>
    </div>
    <div class="vg-meta">
      <div class="vg-avatar" onclick="event.stopPropagation();goPublisher('${esc(v.publisher)}')">${v.user_avatar?`<img src="${esc(v.user_avatar)}" alt="">`:esc((v.publisher_name||v.publisher||'?').charAt(0).toUpperCase())}</div>
      <div class="vg-info">
        <div class="vg-title">${esc(stripHtmlV(v.content)) || t('untitled')}</div>
        <div class="vg-sub">${esc(v.publisher_name||v.publisher)}${v.publisher_verified?verifiedBadge():''}<span class="dot"></span>${fmtDate(v.created_at)}</div>
      </div>
    </div>
  </div>`;
}
function stripHtmlV(html){
  try { const d = document.createElement('div'); d.innerHTML = html||''; return d.textContent || d.innerText || ''; }
  catch(e){ return html||''; }
}

function vunCardHtml(v){
  return `<div class="vun-card" onclick="watchVideo(${v.id})">
    <div class="vun-thumb-wrap">
      <video class="vun-thumb" muted playsinline preload="metadata"><source src="${esc(v.video)}#t=0.1" type="video/mp4"></video>
    </div>
    <div class="vun-info">
      <div class="vun-title">${esc(stripHtmlV(v.content)) || t('untitled')}</div>
      <div class="vun-sub">${esc(v.publisher_name||v.publisher)} · ${fmtDate(v.created_at)}</div>
    </div>
  </div>`;
}

function reactCountV(v){ return (v.reactions||[]).reduce((s,r)=>s+(r.count||0),0); }

function renderWatch(v){
  currentVideo = v;
  const others = allVideos.filter(x => x.id !== v.id);
  const liked = v.userReaction === 'like';
  const comments = v.comments || [];
  history.replaceState(null, '', '/video?id=' + v.id);
  document.title = (v.publisher_name || v.publisher) + ' — Hostaka Video';

  document.getElementById('videoPageWrap').innerHTML = `
    <div class="video-watch-layout">
      <div>
        <div class="video-player-wrap">
          <video class="video-player" controls autoplay playsinline><source src="${esc(v.video)}" type="video/mp4"></video>
        </div>
        <div class="video-watch-title">${esc(stripHtmlV(v.content)) || t('untitled')}</div>
        <div class="video-watch-pubrow">
          <div class="video-watch-pub">
            <div class="video-watch-avatar" onclick="goPublisher('${esc(v.publisher)}')">${v.user_avatar?`<img src="${esc(v.user_avatar)}" alt="">`:esc((v.publisher_name||v.publisher||'?').charAt(0).toUpperCase())}</div>
            <div>
              <div class="video-watch-name" onclick="goPublisher('${esc(v.publisher)}')">${esc(v.publisher_name||v.publisher)}${v.publisher_verified?verifiedBadge():''}</div>
              <div class="video-watch-date">${fmtDate(v.created_at)}</div>
            </div>
          </div>
          <div class="video-watch-actions">
            <button class="vw-action-btn ${liked?'active':''}" id="vwLikeBtn" onclick="toggleVideoReact('like')">${VSVG.like}<span id="vwLikeCount">${reactCountV(v)||t('likeWord')}</span></button>
            <button class="vw-action-btn" onclick="document.getElementById('vwCommentInput')?.focus()">${VSVG.comment}<span>${comments.length||''} ${t('commentWord')}</span></button>
            <button class="vw-action-btn" onclick="shareVideo(${v.id})">${VSVG.share}<span>${t('shareWord')}</span></button>
            <button class="vw-action-btn ${v.is_saved?'active':''}" id="vwSaveBtn" onclick="toggleVideoSave(${v.id})">${v.is_saved?VSVG.bookmarkFilled:VSVG.bookmark}<span>${v.is_saved?t('savedWord'):t('saveWord')}</span></button>
          </div>
        </div>
        ${v.content ? `<div class="video-watch-desc">${linkifyV(esc(v.content))}</div>` : ''}

        <div class="video-comments">
          <div class="video-comments-head">${comments.length} ${t('commentWord')}</div>
          ${ME ? `<div class="video-comment-input-row">
            <input type="text" id="vwCommentInput" placeholder="${t('addCommentPlaceholder')}" maxlength="500" onkeydown="if(event.key==='Enter') sendVideoComment(${v.id});">
            <button onclick="sendVideoComment(${v.id})">${VSVG.send}</button>
          </div>` : ''}
          <div id="vwCommentsList">${renderVideoComments(comments, v.id)}</div>
        </div>
      </div>

      <div>
        <div class="vc-up-next-title">${t('otherVideos')}</div>
        <div class="vc-up-next-list">${others.length ? others.map(vunCardHtml).join('') : '<div style="color:var(--muted);font-size:0.85rem;">'+t('noOtherVideosYet')+'</div>'}</div>
      </div>
    </div>
  `;
}

function renderVideoComments(comments, videoId){
  const top = comments.filter(c => !c.parent_id);
  function repliesOf(cid){ return comments.filter(c => Number(c.parent_id) === Number(cid)); }
  function oneComment(c){
    const ca = c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : esc((c.display_name||c.username||'?').charAt(0).toUpperCase());
    const canDelC = ME && (ME.role==='admin' || c.user_id==ME?.id);
    const replies = repliesOf(c.id);
    return `<div class="comment" id="vcmt-${c.id}" style="display:flex;gap:10px;margin-bottom:14px;">
      <div class="c-avatar" style="width:32px;height:32px;border-radius:50%;overflow:hidden;background:var(--avatar-gradient);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${ca}</div>
      <div class="c-bubble" style="flex:1;min-width:0;">
        <div class="c-name" style="font-weight:800;font-size:0.85rem;">${esc(c.display_name||c.username)}
          ${canDelC?`<button onclick="delVideoComment(${c.id},${videoId})" style="background:none;border:none;color:var(--muted);cursor:pointer;margin-inline-start:8px;font-size:0.75rem;">${t('deleteWord')}</button>`:''}
        </div>
        <div class="c-text" style="font-size:0.86rem;line-height:1.6;">${linkifyV(esc(c.content))}</div>
        ${replies.length ? `<div style="margin-inline-start:24px;margin-top:8px;">${replies.map(oneComment).join('')}</div>` : ''}
      </div>
    </div>`;
  }
  return top.map(oneComment).join('') || `<div style="color:var(--muted);font-size:0.85rem;padding:12px 0;">${t('noCommentsYetFirst')}</div>`;
}
function linkifyV(html){
  return String(html||'').replace(/(https?:\/\/[^\s<]+)/g, url => `<a href="${url}" class="post-link" target="_blank" rel="noopener noreferrer">${url}</a>`);
}

async function watchVideo(id){
  const v = allVideos.find(x => x.id === id);
  if(!v){ showToast(t('cantFindVideo'), 'error'); return; }
  window.scrollTo(0,0);
  renderWatch(v);
}

async function toggleVideoReact(emoji){
  if(!ME || !currentVideo) return;
  const d = await apiFetch('/api/records/'+currentVideo.id+'/react', 'POST', { emoji });
  if(!d.success) return;
  currentVideo.reactions = d.reactions; currentVideo.userReaction = d.userReaction;
  const idx = allVideos.findIndex(x=>x.id===currentVideo.id);
  if(idx>-1) allVideos[idx] = currentVideo;
  const liked = currentVideo.userReaction === 'like';
  document.getElementById('vwLikeBtn').classList.toggle('active', liked);
  document.getElementById('vwLikeCount').textContent = reactCountV(currentVideo) || t('likeWord');
}

async function toggleVideoSave(id){
  if(!ME) return;
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  if(currentVideo && currentVideo.id === id) currentVideo.is_saved = d.saved;
  const idx = allVideos.findIndex(x=>x.id===id);
  if(idx>-1) allVideos[idx].is_saved = d.saved;
  const btn = document.getElementById('vwSaveBtn');
  if(btn){
    btn.classList.toggle('active', d.saved);
    btn.innerHTML = (d.saved?VSVG.bookmarkFilled:VSVG.bookmark) + `<span>${d.saved?t('savedWord'):t('saveWord')}</span>`;
  }
  showToast(d.saved ? t('videoSaved') : t('videoUnsaved'));
}

function shareVideo(id){
  const url = location.origin + '/video?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(()=>showToast(t('videoLinkCopied'))).catch(()=>showToast(t('cantCopy'),'error'));
}

async function sendVideoComment(videoId){
  if(!ME) return;
  const input = document.getElementById('vwCommentInput');
  if(!input || !input.value.trim()) return;
  const content = input.value.trim(); input.value = '';
  const d = await apiFetch('/api/records/'+videoId+'/comments','POST',{content});
  if(!d.success) return;
  const comments = await apiFetch('/api/records/'+videoId+'/comments');
  if(currentVideo && currentVideo.id === videoId){ currentVideo.comments = comments; }
  const idx = allVideos.findIndex(x=>x.id===videoId);
  if(idx>-1) allVideos[idx].comments = comments;
  document.getElementById('vwCommentsList').innerHTML = renderVideoComments(comments, videoId);
  document.querySelector('.video-comments-head').textContent = comments.length + ' ' + t('commentWord');
}
async function delVideoComment(commentId, videoId){
  if(!await hostakaConfirm(t('confirmDeleteComment'))) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  const comments = await apiFetch('/api/records/'+videoId+'/comments');
  if(currentVideo && currentVideo.id === videoId){ currentVideo.comments = comments; }
  document.getElementById('vwCommentsList').innerHTML = renderVideoComments(comments, videoId);
}

function renderGrid(){
  document.getElementById('videoPageWrap').innerHTML = `
    <div class="video-grid">${allVideos.map(vgCardHtml).join('')}</div>
  `;
}

function renderEmptyVideos(){
  document.getElementById('videoPageWrap').innerHTML = `
    <div class="video-empty">${VSVG.empty}<div>${t('noVideosYet')}</div></div>
  `;
}

async function initVideoPage(){
  try {
    try{ ME = await apiFetch('/api/me'); }catch(e){ ME = null; }
    try {
      allVideos = await apiFetch('/api/videos');
      if(!Array.isArray(allVideos)) allVideos = [];
    } catch(e){ allVideos = []; }

    if(!allVideos.length){ renderEmptyVideos(); return; }

    const wantedId = getIdFromUrl();
    if(wantedId){
      const v = allVideos.find(x => String(x.id) === String(wantedId));
      if(v){ renderWatch(v); return; }
    }
    renderGrid();
  } finally {
    const loaderEl = document.getElementById('loader');
    if(loaderEl) loaderEl.style.display = 'none';
  }
}

initVideoPage();

try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.watchVideo = watchVideo; } catch(e) {}
try { window.toggleVideoReact = toggleVideoReact; } catch(e) {}
try { window.toggleVideoSave = toggleVideoSave; } catch(e) {}
try { window.shareVideo = shareVideo; } catch(e) {}
try { window.sendVideoComment = sendVideoComment; } catch(e) {}
try { window.delVideoComment = delVideoComment; } catch(e) {}
