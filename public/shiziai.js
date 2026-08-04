const LANG = {
  ar: {
    back:'Hostaka', status:'متصلة الآن', placeholder:'اكتب رسالتك...', remainingLabel:'متصلة الآن · باقي {n} رسالة اليوم',
    welcomeTitle:'أهلاً، أنا شيزي', welcomeText:'مساعدتك الذكية في منصة Hostaka. اسأليني أي شيء وبقدر أساعدك فيه!',
    s1:'ما هي منصة Hostaka؟', s2:'اقترح علي فكرة منشور', s3:'ساعدني في كتابة وصف بروفايل', s4:'أخبرني نكتة لطيفة',
    loginRequired:'يجب تسجيل الدخول', loginText:'سجّلي الدخول لبدء الدردشة مع شيزي', home:'الرئيسية',
    clearedMsg:'بدأنا محادثة جديدة', errorMsg:'حدث خطأ، حاولي مرة أخرى', notConfigured:'لم يتم إعداد Shizi AI بعد', imageTooLarge:'الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB'
  },
  en: {
    back:'Hostaka', status:'Online now', placeholder:'Type a message to Shizi...', remainingLabel:'Online now · {n} messages left today',
    welcomeTitle:"Hi, I'm Shizi", welcomeText:'Your smart assistant on Hostaka. Ask me anything!',
    s1:'What is Hostaka?', s2:'Suggest a post idea', s3:'Help me write a bio', s4:'Tell me a fun fact',
    loginRequired:'Login required', loginText:'Please login to chat with Shizi', home:'Home',
    clearedMsg:'Started a new chat', errorMsg:'Something went wrong, try again', notConfigured:'Shizi AI is not configured yet', imageTooLarge:'Image is too large, please choose one smaller than 8MB'
  },
  fr: {
    back:'Hostaka', status:'En ligne', placeholder:'Écrivez à Shizi...', remainingLabel:'En ligne · {n} messages restants aujourd\'hui',
    welcomeTitle:'Salut, je suis Shizi', welcomeText:'Votre assistante intelligente sur Hostaka. Demandez-moi tout !',
    s1:"Qu'est-ce que Hostaka ?", s2:'Suggère une idée de post', s3:'Aide-moi à écrire ma bio', s4:'Raconte-moi une anecdote',
    loginRequired:'Connexion requise', loginText:'Connectez-vous pour discuter avec Shizi', home:'Accueil',
    clearedMsg:'Nouvelle discussion', errorMsg:'Une erreur est survenue', notConfigured:"Shizi AI n'est pas encore configurée", imageTooLarge:'Image trop volumineuse, choisissez une image de moins de 8 Mo'
  },
  ru: {
    back:'Hostaka', status:'В сети', placeholder:'Напишите Shizi...', remainingLabel:'В сети · осталось {n} сообщений сегодня',
    welcomeTitle:'Привет, я Shizi', welcomeText:'Ваш умный помощник на Hostaka. Спросите меня о чём угодно!',
    s1:'Что такое Hostaka?', s2:'Предложи идею для поста', s3:'Помоги написать био', s4:'Расскажи интересный факт',
    loginRequired:'Требуется вход', loginText:'Войдите, чтобы общаться с Shizi', home:'Главная',
    clearedMsg:'Новый чат', errorMsg:'Произошла ошибка', notConfigured:'Shizi AI ещё не настроена', imageTooLarge:'Изображение слишком большое, выберите менее 8МБ'
  },
  zh: {
    back:'Hostaka', status:'在线', placeholder:'给 Shizi 发消息...', remainingLabel:'在线 · 今日剩余 {n} 条消息',
    welcomeTitle:'嗨，我是 Shizi', welcomeText:'Hostaka 平台的智能助手。问我任何问题！',
    s1:'Hostaka 是什么？', s2:'给我一个发帖灵感', s3:'帮我写个人简介', s4:'讲个有趣的事实',
    loginRequired:'需要登录', loginText:'请登录以与 Shizi 聊天', home:'首页',
    clearedMsg:'开始新对话', errorMsg:'出错了，请重试', notConfigured:'Shizi AI 尚未配置', imageTooLarge:'图片太大，请选择小于8MB的图片'
  },
  ja: {
    back:'Hostaka', status:'オンライン', placeholder:'Shiziにメッセージを送る...', remainingLabel:'オンライン · 本日の残り {n} 件',
    welcomeTitle:'こんにちは、Shiziです', welcomeText:'Hostakaのスマートアシスタントです。何でも聞いてください！',
    s1:'Hostakaとは？', s2:'投稿アイデアを提案して', s3:'プロフィール文を手伝って', s4:'面白い豆知識を教えて',
    loginRequired:'ログインが必要です', loginText:'Shiziとチャットするにはログインしてください', home:'ホーム',
    clearedMsg:'新しいチャットを開始しました', errorMsg:'エラーが発生しました', notConfigured:'Shizi AIはまだ設定されていません', imageTooLarge:'画像が大きすぎます。8MB未満の画像を選んでください'
  }
};

let currentLang = localStorage.getItem('hostaka_lang') || 'en';
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';
let ME = null;
let messages = [];
let sending = false;

function t(key){ return LANG[currentLang]?.[key] || LANG['ar'][key] || key; }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function toUTCDate(s){ if(!s) return new Date(NaN); if(s instanceof Date) return s; if(typeof s==='string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ','T')+'Z'); return new Date(s); }
function fmtTime(s){ if(!s) return ''; return toUTCDate(s).toLocaleTimeString(currentLang==='ar'?'ar':'en',{hour:'2-digit',minute:'2-digit'}); }
const getToken = () => localStorage.getItem('hostaka_token') || '';

function applyLang(){
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  document.getElementById('backText').textContent = t('back');
  document.getElementById('statusText').textContent = t('status');
  const input = document.getElementById('msgInput');
  if (input) input.placeholder = t('placeholder');
  if (!messages.length) renderWelcome();
}

const THEME_ICON_DARK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const THEME_ICON_LIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
function setTheme(theme){
  const html = document.documentElement;
  if(theme === 'dark'){
    html.setAttribute('data-theme', 'dark');
    setThemeIcon(THEME_ICON_DARK);
  } else {
    html.removeAttribute('data-theme');
    setThemeIcon(THEME_ICON_LIGHT);
  }
  currentTheme = theme;
  localStorage.setItem('hostaka_theme', currentTheme);
}
function toggleTheme() {
  userSetThemeManual = true;
  localStorage.setItem('hostaka_theme_manual', '1');
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}
// ============================================================
//  WALLPAPER (خلفية المنصة الشخصية + ثيم متكيّف)
// ============================================================
let wallpaperData = null;
let userSetThemeManual = localStorage.getItem('hostaka_theme_manual') === '1';

function loadWallpaperState(){
  try{
    const raw = localStorage.getItem('hostaka_wallpaper');
    if(raw) wallpaperData = JSON.parse(raw);
  }catch(e){ wallpaperData = null; }
}
function saveWallpaperState(){
  if(wallpaperData) localStorage.setItem('hostaka_wallpaper', JSON.stringify(wallpaperData));
  else localStorage.removeItem('hostaka_wallpaper');
}
function openWallpaperModal(){
  document.getElementById('wallpaperModal').classList.add('show');
  const box = document.getElementById('wallpaperPreviewBox');
  const empty = document.getElementById('wallpaperPreviewEmpty');
  if(wallpaperData && wallpaperData.img){
    box.style.backgroundImage = `url(${wallpaperData.img})`;
    empty.style.display = 'none';
    document.getElementById('wallpaperBlurRange').value = wallpaperData.blur ?? 6;
    document.getElementById('wallpaperDimRange').value = wallpaperData.dim ?? 35;
    document.getElementById('wallpaperAutoTheme').checked = wallpaperData.auto !== false;
  } else {
    box.style.backgroundImage = 'none';
    empty.style.display = 'inline';
  }
}
async function onWallpaperFile(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  if(file.size > 8*1024*1024){ await hostakaAlert(t('imageTooLarge')); return; }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxW = 1600;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      wallpaperData = {
        img: dataUrl,
        blur: parseInt(document.getElementById('wallpaperBlurRange').value) || 6,
        dim: parseInt(document.getElementById('wallpaperDimRange').value) || 35,
        auto: document.getElementById('wallpaperAutoTheme').checked
      };
      saveWallpaperState();
      applyWallpaper();
      document.getElementById('wallpaperPreviewBox').style.backgroundImage = `url(${dataUrl})`;
      document.getElementById('wallpaperPreviewEmpty').style.display = 'none';
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function updateWallpaperTuning(){
  if(!wallpaperData) return;
  wallpaperData.blur = parseInt(document.getElementById('wallpaperBlurRange').value) || 0;
  wallpaperData.dim = parseInt(document.getElementById('wallpaperDimRange').value) || 0;
  wallpaperData.auto = document.getElementById('wallpaperAutoTheme').checked;
  saveWallpaperState();
  applyWallpaper();
}
function removeWallpaper(){
  wallpaperData = null;
  saveWallpaperState();
  applyWallpaper();
  const box = document.getElementById('wallpaperPreviewBox');
  if(box) box.style.backgroundImage = 'none';
  const empty = document.getElementById('wallpaperPreviewEmpty');
  if(empty) empty.style.display = 'inline';
}
function analyzeWallpaperColors(dataUrl, cb){
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    const size = 60;
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    let r=0,g=0,b=0,count=0;
    let r2=0,g2=0,b2=0,count2=0;
    let r3=0,g3=0,b3=0,count3=0;
    try{
      const data = ctx.getImageData(0,0,size,size).data;
      const pixels = [];
      for(let i=0;i<data.length;i+=4){
        const pr=data[i], pg=data[i+1], pb=data[i+2];
        const max = Math.max(pr,pg,pb), min = Math.min(pr,pg,pb);
        const saturation = max === 0 ? 0 : (max-min)/max;
        if(saturation > 0.15 && max > 40 && max < 240){
          pixels.push({r:pr, g:pg, b:pb, sat: saturation, brightness: (pr+pg+pb)/3});
        }
      }
      pixels.sort((a,b) => b.sat - a.sat);
      const primaryPixels = pixels.slice(0, Math.max(1, Math.floor(pixels.length * 0.15)));
      for(const p of primaryPixels){ r+=p.r; g+=p.g; b+=p.b; count++; }
      const midStart = Math.floor(pixels.length * 0.25);
      const secondaryPixels = pixels.slice(midStart, midStart + Math.max(1, Math.floor(pixels.length * 0.15)));
      for(const p of secondaryPixels){ r2+=p.r; g2+=p.g; b2+=p.b; count2++; }
      const brightPixels = pixels.filter(p => p.brightness > 120).slice(0, Math.max(1, Math.floor(pixels.length * 0.1)));
      for(const p of brightPixels){ r3+=p.r; g3+=p.g; b3+=p.b; count3++; }
      if(count === 0){
        for(let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
      }
      r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
      r2=count2?Math.round(r2/count2):r; g2=count2?Math.round(g2/count2):g; b2=count2?Math.round(b2/count2):b;
      r3=count3?Math.round(r3/count3):r; g3=count3?Math.round(g3/count3):g; b3=count3?Math.round(b3/count3):b;
    }catch(e){ cb(null); return; }
    const brightness = (r*299 + g*587 + b*114) / 1000;
    cb({ r, g, b, r2, g2, b2, r3, g3, b3, brightness });
  };
  img.onerror = () => cb(null);
  img.src = dataUrl;
}
function applyWallpaper(){
  const html = document.documentElement;
  const bg = document.getElementById('wallpaperBg');
  if(!wallpaperData || !wallpaperData.img){
    html.classList.remove('has-wallpaper');
    html.style.removeProperty('--wallpaper-img');
    html.style.removeProperty('--wallpaper-overlay');
    html.style.removeProperty('--primary');
    html.style.removeProperty('--primary-h');
    html.style.removeProperty('--primary-light');
    html.style.removeProperty('--primary-mid');
    html.style.removeProperty('--primary-border');
    html.style.removeProperty('--accent');
    html.style.removeProperty('--avatar-gradient');
    html.style.removeProperty('--mine-bg');
    html.style.removeProperty('--mine-border');
    if(bg) bg.style.filter = '';
    return;
  }
  html.classList.add('has-wallpaper');
  html.style.setProperty('--wallpaper-img', `url(${wallpaperData.img})`);
  if(bg) bg.style.filter = `blur(${wallpaperData.blur ?? 6}px)`;
  const dim = (wallpaperData.dim ?? 35) / 100;
  html.style.setProperty('--wallpaper-overlay', `rgba(0,0,0,${dim})`);
  if(wallpaperData.auto !== false){
    analyzeWallpaperColors(wallpaperData.img, (info) => {
      if(!info) return;
      if(!userSetThemeManual){
        const shouldBeDark = info.brightness < 130;
        if(shouldBeDark && currentTheme !== 'dark'){ setTheme('dark'); }
        else if(!shouldBeDark && currentTheme !== 'light'){ setTheme('light'); }
      }
      html.style.setProperty('--wallpaper-overlay', `rgba(${info.r},${info.g},${info.b},${dim*0.55})`);

      const isDark = currentTheme === 'dark';
      const baseR = info.r, baseG = info.g, baseB = info.b;
      const secR = info.r2 || baseR, secG = info.g2 || baseG, secB = info.b2 || baseB;
      const accR = info.r3 || baseR, accG = info.g3 || baseG, accB = info.b3 || baseB;
      const lighten = (r,g,b,amt) => `rgb(${Math.min(255, Math.round(r + (255-r)*amt))}, ${Math.min(255, Math.round(g + (255-g)*amt))}, ${Math.min(255, Math.round(b + (255-b)*amt))})`;
      const darken = (r,g,b,amt) => `rgb(${Math.round(r*amt)}, ${Math.round(g*amt)}, ${Math.round(b*amt)})`;
      const primary = `rgb(${baseR},${baseG},${baseB})`;
      const primaryH = isDark ? lighten(baseR,baseG,baseB,0.3) : darken(baseR,baseG,baseB,0.75);
      const primaryLight = isDark ? `rgba(${baseR},${baseG},${baseB},0.15)` : `rgba(${baseR},${baseG},${baseB},0.08)`;
      const primaryMid = isDark ? `rgba(${baseR},${baseG},${baseB},0.25)` : `rgba(${baseR},${baseG},${baseB},0.15)`;
      const primaryBorder = isDark ? `rgba(${baseR},${baseG},${baseB},0.35)` : `rgba(${baseR},${baseG},${baseB},0.25)`;
      const accent = `rgb(${accR},${accG},${accB})`;
      const avatarGrad = `linear-gradient(145deg, rgb(${baseR},${baseG},${baseB}), rgb(${secR},${secG},${secB}))`;
      html.style.setProperty('--primary', primary);
      html.style.setProperty('--primary-h', primaryH);
      html.style.setProperty('--primary-light', primaryLight);
      html.style.setProperty('--primary-mid', primaryMid);
      html.style.setProperty('--primary-border', primaryBorder);
      html.style.setProperty('--accent', accent);
      html.style.setProperty('--avatar-gradient', avatarGrad);
      html.style.setProperty('--mine-bg', isDark ? `rgba(${baseR},${baseG},${baseB},0.12)` : `rgba(${baseR},${baseG},${baseB},0.08)`);
      html.style.setProperty('--mine-border', isDark ? `rgba(${baseR},${baseG},${baseB},0.18)` : `rgba(${baseR},${baseG},${baseB},0.12)`);
    });
  }
}

function toggleLangMenu(){ document.getElementById('langMenu').classList.toggle('show'); }
document.addEventListener('click', e => {
  if (!document.getElementById('langToggle').contains(e.target)) document.getElementById('langMenu').classList.remove('show');
});
function setLang(lang){
  currentLang = lang;
  localStorage.setItem('hostaka_lang', lang);
  if (window.setHostakaLang) window.setHostakaLang(lang);
  document.getElementById('langMenu').classList.remove('show');
  applyLang();
}

async function apiFetch(url, method='GET', body=null){
  const token = getToken();
  const opts = { method, headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (!r.ok){
    const text = await r.text().catch(()=> '');
    let msg = text;
    try { msg = JSON.parse(text).error || text; } catch(e){}
    const err = new Error(msg || ('HTTP '+r.status));
    err.status = r.status;
    throw err;
  }
  return r.json();
}

function showToast(msg, type='success'){
  let el = document.querySelector('.toast');
  if (el) el.remove();
  el = document.createElement('div');
  el.className = 'toast toast-'+type;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),300); }, 3000);
}

function showNotLogged(){
  document.getElementById('chatMain').innerHTML = `
    <div class="not-logged">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <h2>${t('loginRequired')}</h2>
      <p>${t('loginText')}</p>
      <a href="/" class="btn-go">${t('home')}</a>
    </div>`;
  document.getElementById('inputArea').style.display = 'none';
}

function renderWelcome(){
  document.getElementById('chatMain').innerHTML = `
    <div class="welcome">
      <div class="shizi-big"><img src="shizi-icon.png" alt="Shizi AI"></div>
      <h2>${t('welcomeTitle')}</h2>
      <p>${t('welcomeText')}</p>
      <div class="suggestions">
        <div class="suggestion-chip" onclick="quickSend('${esc(t('s1'))}')">${t('s1')}</div>
        <div class="suggestion-chip" onclick="quickSend('${esc(t('s2'))}')">${t('s2')}</div>
        <div class="suggestion-chip" onclick="quickSend('${esc(t('s3'))}')">${t('s3')}</div>
        <div class="suggestion-chip" onclick="quickSend('${esc(t('s4'))}')">${t('s4')}</div>
      </div>
    </div>`;
}

function quickSend(text){
  document.getElementById('msgInput').value = text;
  sendMsg();
}

function renderMsgs(){
  const area = document.getElementById('chatMain');
  if (!messages.length){ renderWelcome(); return; }
  let html = '<div class="msgs-area" id="msgsArea">';
  messages.forEach(m => {
    const isMine = m.role === 'user';
    html += `<div class="msg-row ${isMine ? 'mine' : 'theirs'}">
      <div class="msg-av ${isMine ? 'user' : 'shizi'}">${isMine ? (ME?.username||'?').charAt(0).toUpperCase() : '<img src="shizi-icon.png" alt="Shizi AI">'}</div>
      <div class="bubble-wrap">
        <div class="bubble">${esc(m.content)}</div>
        ${m.created_at ? `<div class="msg-time">${fmtTime(m.created_at)}</div>` : ''}
      </div>
    </div>`;
  });
  if (sending){
    html += `<div class="typing-row">
      <div class="msg-av shizi"><img src="shizi-icon.png" alt="Shizi AI"></div>
      <div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
    </div>`;
  }
  html += '</div>';
  area.innerHTML = html;
  const msgsArea = document.getElementById('msgsArea');
  if (msgsArea) msgsArea.scrollTop = msgsArea.scrollHeight;
}

async function loadHistory(){
  try {
    const data = await apiFetch('/api/shizi/history');
    messages = Array.isArray(data) ? data : [];
    renderMsgs();
  } catch(e){
    console.error('loadHistory failed:', e);
    messages = [];
    renderMsgs();
  }
}

function updateRemainingBadge(remaining){
  const el = document.getElementById('statusText');
  if (!el) return;
  const n = Math.max(0, remaining);
  el.textContent = t('remainingLabel').replace('{n}', n);
}

function onKey(e){ if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMsg(); } }
function autoResize(el){ el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }

async function sendMsg(){
  if (sending) return;
  const input = document.getElementById('msgInput');
  const content = input?.value.trim() || '';
  if (!content) return;
  input.value = '';
  input.style.height = '';
  document.getElementById('sendBtn').disabled = true;

  messages.push({ role:'user', content, created_at: new Date().toISOString() });
  sending = true;
  renderMsgs();

  try {
    const d = await apiFetch('/api/shizi/chat', 'POST', { message: content });
    sending = false;
    if (d.reply){
      messages.push({ role:'assistant', content: d.reply, created_at: new Date().toISOString() });
    }
    if (typeof d.remaining === 'number') updateRemainingBadge(d.remaining);
    renderMsgs();
  } catch(e){
    sending = false;
    messages.pop(); // revert the locally-added message since it wasn't actually saved
    renderMsgs();
    console.error('sendMsg failed:', e);
    if (e.status === 429) {
      showToast(e.message, 'error');
    } else if (e.message && e.message.includes('GEMINI')) {
      showToast(t('notConfigured'), 'error');
    } else {
      showToast(t('errorMsg'), 'error');
    }
  }
  document.getElementById('sendBtn').disabled = false;
}

async function clearChat(){
  try {
    await apiFetch('/api/shizi/history', 'DELETE');
    messages = [];
    renderMsgs();
    showToast(t('clearedMsg'));
  } catch(e){
    console.error('clearChat failed:', e);
    showToast(t('errorMsg'), 'error');
  }
}

async function init(){
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setThemeIcon(THEME_ICON_DARK);
  }

  loadWallpaperState();
  applyWallpaper();
  applyLang();

  const token = getToken();
  if (!token){ showNotLogged(); return; }
  try {
    const r = await fetch('/api/auth/me', { headers:{ 'Authorization':'Bearer '+token } });
    if (!r.ok){ showNotLogged(); return; }
    const u = await r.json();
    if (!u || u.error){ showNotLogged(); return; }
    ME = u;
  } catch(e){ showNotLogged(); return; }

  document.getElementById('inputArea').style.display = 'flex';
  await loadHistory();
}

init();

/* expose top-level functions for inline onclick handlers */
try { window.t = t; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtTime = fmtTime; } catch(e) {}
try { window.getToken = getToken; } catch(e) {}
try { window.applyLang = applyLang; } catch(e) {}
try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.loadWallpaperState = loadWallpaperState; } catch(e) {}
try { window.saveWallpaperState = saveWallpaperState; } catch(e) {}
try { window.openWallpaperModal = openWallpaperModal; } catch(e) {}
try { window.onWallpaperFile = onWallpaperFile; } catch(e) {}
try { window.updateWallpaperTuning = updateWallpaperTuning; } catch(e) {}
try { window.removeWallpaper = removeWallpaper; } catch(e) {}
try { window.analyzeWallpaperColors = analyzeWallpaperColors; } catch(e) {}
try { window.applyWallpaper = applyWallpaper; } catch(e) {}
try { window.toggleLangMenu = toggleLangMenu; } catch(e) {}
try { window.setLang = setLang; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.showNotLogged = showNotLogged; } catch(e) {}
try { window.renderWelcome = renderWelcome; } catch(e) {}
try { window.quickSend = quickSend; } catch(e) {}
try { window.renderMsgs = renderMsgs; } catch(e) {}
try { window.loadHistory = loadHistory; } catch(e) {}
try { window.updateRemainingBadge = updateRemainingBadge; } catch(e) {}
try { window.onKey = onKey; } catch(e) {}
try { window.autoResize = autoResize; } catch(e) {}
try { window.sendMsg = sendMsg; } catch(e) {}
try { window.clearChat = clearChat; } catch(e) {}
try { window.init = init; } catch(e) {}
