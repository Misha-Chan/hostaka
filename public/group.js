const LANG = {
  ar: {
    title:'المجموعة', back:'الرسائل', members:'الأعضاء', add:'إضافة',
    admin:'مدير', member:'عضو', you:'أنت',
    onlineNow: 'متصل الآن', lastSeen: 'آخر ظهور',
    editMsg: 'تعديل', deleteMsg: 'حذف', reportMsg: 'إبلاغ', msgEdited: 'معدّلة',
    deleteMsgConfirm: 'حذف هذه الرسالة؟', reportSent: 'تم إرسال البلاغ، شكراً لك', error: 'حدث خطأ',
    settingsTitle:'إعدادات المجموعة', groupName:'اسم المجموعة *', groupDesc:'وصف المجموعة (اختياري)',
    save:'حفظ', cancel:'إلغاء', leaveGroup:'مغادرة المجموعة', deleteGroup:'حذف المجموعة',
    addMembersTitle:'إضافة أعضاء', sendPlaceholder:'اكتب رسالة...', attach:'إرفاق صورة JPG',
    imageAttached:'صورة مرفقة', loginRequired:'يجب تسجيل الدخول', home:'الرئيسية',
    loading:'جارٍ التحميل...', noMessages:'ابدأ المحادثة', today:'اليوم', yesterday:'أمس',
    notMember:'لست عضواً في هذه المجموعة', groupNotFound:'المجموعة غير موجودة',
    settingsSaved:'تم الحفظ', leftGroup:'تمت مغادرة المجموعة', groupDeleted:'تم حذف المجموعة',
    confirmLeave:'هل أنت متأكد من مغادرة المجموعة؟', confirmDelete:'هل أنت متأكد من حذف المجموعة؟ لا يمكن التراجع',
    error:'فشل', membersAdded:'تمت الإضافة', noOthers:'لا يوجد مستخدمون آخرون',
    promote:'ترقية لمدير', demote:'تنزيل لعضو', remove:'إزالة من المجموعة',
    setNickname:'تعيين كنية', setNicknamePromptTitle:'اكتب الكنية التي ستظهر لهذا العضو داخل المجموعة',
    blockUser:'حظر العضو', confirmBlockMember:'سيتم حظر هذا العضو من مراسلتك. متابعة؟',
    viewMedia:'عرض وسائط المحادثة', noMedia:'لا توجد وسائط', reportGroupChat:'الإبلاغ عن الدردشة الجماعية',
    reportGroupTitle:'الإبلاغ عن المجموعة', reportGroupSent:'تم إرسال البلاغ، شكراً لك',
    readReceiptsToggle:'إظهار مؤشر قراءة الرسائل', seenBy:'شاهدها',
    reasonAbuse:'إساءة أو تنمر', reasonSpam:'رسائل مزعجة', reasonNudity:'محتوى غير لائق', reasonOther:'سبب آخر',
    jpgOnly:'JPG/JPEG فقط', reportGroupMsgSubject:'إبلاغ عن رسالة مجموعة'
  },
  en: {
    title:'Group', back:'Messages', members:'Members', add:'Add',
    admin:'Admin', member:'Member', you:'You',
    onlineNow: 'Online now', lastSeen: 'Last seen',
    editMsg: 'Edit', deleteMsg: 'Delete', reportMsg: 'Report', msgEdited: 'edited',
    deleteMsgConfirm: 'Delete this message?', reportSent: 'Report sent, thank you', error: 'Something went wrong',
    settingsTitle:'Group Settings', groupName:'Group name *', groupDesc:'Description (optional)',
    save:'Save', cancel:'Cancel', leaveGroup:'Leave Group', deleteGroup:'Delete Group',
    addMembersTitle:'Add Members', sendPlaceholder:'Type a message...', attach:'Attach JPG image',
    imageAttached:'Image attached', loginRequired:'Please login', home:'Home',
    loading:'Loading...', noMessages:'Start the conversation', today:'Today', yesterday:'Yesterday',
    notMember:'You are not a member of this group', groupNotFound:'Group not found',
    settingsSaved:'Saved', leftGroup:'Left the group', groupDeleted:'Group deleted',
    confirmLeave:'Are you sure you want to leave?', confirmDelete:'Are you sure? This cannot be undone',
    error:'Failed', membersAdded:'Added', noOthers:'No other users',
    promote:'Promote to admin', demote:'Demote to member', remove:'Remove from group',
    setNickname:'Set nickname', setNicknamePromptTitle:'Enter the nickname shown for this member in the group',
    blockUser:'Block member', confirmBlockMember:'This member will be blocked from messaging you. Continue?',
    viewMedia:'View shared media', noMedia:'No media yet', reportGroupChat:'Report group chat',
    reportGroupTitle:'Report group', reportGroupSent:'Report sent, thank you',
    readReceiptsToggle:'Show read receipts', seenBy:'Seen by',
    reasonAbuse:'Abuse or harassment', reasonSpam:'Spam messages', reasonNudity:'Inappropriate content', reasonOther:'Other reason',
    jpgOnly:'JPG/JPEG only', reportGroupMsgSubject:'Report on a group message'
  },
  fr: {
    title:'Groupe', back:'Messages', members:'Membres', add:'Ajouter',
    admin:'Admin', member:'Membre', you:'Vous',
    settingsTitle:'Paramètres du groupe', groupName:'Nom du groupe *', groupDesc:'Description (facultatif)',
    save:'Enregistrer', cancel:'Annuler', leaveGroup:'Quitter le groupe', deleteGroup:'Supprimer le groupe',
    addMembersTitle:'Ajouter des membres', sendPlaceholder:'Écrivez...', attach:'Joindre JPG',
    imageAttached:'Image jointe', loginRequired:'Connectez-vous', home:'Accueil',
    loading:'Chargement...', noMessages:'Démarrez la conversation', today:"Aujourd'hui", yesterday:'Hier',
    notMember:"Vous n'êtes pas membre", groupNotFound:'Groupe introuvable',
    settingsSaved:'Enregistré', leftGroup:'Groupe quitté', groupDeleted:'Groupe supprimé',
    confirmLeave:'Voulez-vous vraiment quitter ?', confirmDelete:'Voulez-vous vraiment supprimer ?',
    error:'Échec', membersAdded:'Ajouté', noOthers:'Aucun autre utilisateur',
    promote:'Promouvoir admin', demote:'Rétrograder', remove:'Retirer du groupe'
  },
  ru: {
    title:'Группа', back:'Сообщения', members:'Участники', add:'Добавить',
    admin:'Админ', member:'Участник', you:'Вы',
    settingsTitle:'Настройки группы', groupName:'Название *', groupDesc:'Описание (необязательно)',
    save:'Сохранить', cancel:'Отмена', leaveGroup:'Покинуть группу', deleteGroup:'Удалить группу',
    addMembersTitle:'Добавить участников', sendPlaceholder:'Напишите...', attach:'Прикрепить JPG',
    imageAttached:'Изображение', loginRequired:'Войдите', home:'Главная',
    loading:'Загрузка...', noMessages:'Начните чат', today:'Сегодня', yesterday:'Вчера',
    notMember:'Вы не участник группы', groupNotFound:'Группа не найдена',
    settingsSaved:'Сохранено', leftGroup:'Вы покинули группу', groupDeleted:'Группа удалена',
    confirmLeave:'Вы уверены?', confirmDelete:'Вы уверены? Это необратимо',
    error:'Ошибка', membersAdded:'Добавлено', noOthers:'Нет других пользователей',
    promote:'Сделать админом', demote:'Понизить', remove:'Удалить из группы'
  },
  zh: {
    title:'群组', back:'消息', members:'成员', add:'添加',
    admin:'管理员', member:'成员', you:'你',
    settingsTitle:'群组设置', groupName:'群组名称 *', groupDesc:'描述（可选）',
    save:'保存', cancel:'取消', leaveGroup:'退出群组', deleteGroup:'删除群组',
    addMembersTitle:'添加成员', sendPlaceholder:'输入消息...', attach:'附加图片',
    imageAttached:'图片已附加', loginRequired:'请登录', home:'首页',
    loading:'加载中...', noMessages:'开始对话', today:'今天', yesterday:'昨天',
    notMember:'你不是该群组的成员', groupNotFound:'未找到群组',
    settingsSaved:'已保存', leftGroup:'已退出群组', groupDeleted:'群组已删除',
    confirmLeave:'确定要退出吗？', confirmDelete:'确定要删除吗？无法撤销',
    error:'失败', membersAdded:'已添加', noOthers:'没有其他用户',
    promote:'升为管理员', demote:'降为成员', remove:'移出群组'
  },
  ja: {
    title:'グループ', back:'メッセージ', members:'メンバー', add:'追加',
    admin:'管理者', member:'メンバー', you:'あなた',
    settingsTitle:'グループ設定', groupName:'グループ名 *', groupDesc:'説明（任意）',
    save:'保存', cancel:'キャンセル', leaveGroup:'グループを退出', deleteGroup:'グループを削除',
    addMembersTitle:'メンバーを追加', sendPlaceholder:'メッセージを入力...', attach:'画像を添付',
    imageAttached:'画像を添付しました', loginRequired:'ログインしてください', home:'ホーム',
    loading:'読み込み中...', noMessages:'チャットを開始', today:'今日', yesterday:'昨日',
    notMember:'このグループのメンバーではありません', groupNotFound:'グループが見つかりません',
    settingsSaved:'保存しました', leftGroup:'グループを退出しました', groupDeleted:'グループを削除しました',
    confirmLeave:'本当に退出しますか？', confirmDelete:'本当に削除しますか？元に戻せません',
    error:'失敗', membersAdded:'追加しました', noOthers:'他のユーザーはいません',
    promote:'管理者に昇格', demote:'メンバーに降格', remove:'グループから削除'
  }
};

let currentLang = localStorage.getItem('hostaka_lang') || 'en';
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';
const getToken = () => localStorage.getItem('hostaka_token') || '';
const GROUP_ID = new URLSearchParams(location.search).get('g');

let ME = null;
let group = null;
let members = [];
let allUsers = [];
let myRole = 'member';
let pollTimer = null;
let msgReactions = {};
let chatImgBase64 = '';

function t(key){ return LANG[currentLang]?.[key] || LANG['ar'][key] || key; }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ============================================================
//  الروابط: تحويلها لروابط قابلة للنقر + بطاقة معاينة Open Graph
// ============================================================
const URL_RE = /(https?:\/\/[^\s<]+)/g;
function linkifyEscaped(escapedText) {
  return String(escapedText || '').replace(URL_RE, (url) => {
    const clean = url.replace(/[.,!?)\]]+$/, '');
    const trail = url.slice(clean.length);
    return `<a href="${clean}" target="_blank" rel="noopener noreferrer" class="msg-link">${clean}</a>${trail}`;
  });
}
function extractFirstUrl(text) {
  const m = String(text || '').match(/https?:\/\/[^\s<]+/);
  if (!m) return null;
  return m[0].replace(/[.,!?)\]]+$/, '');
}
const linkPreviewCache = {};
async function fetchLinkPreview(url) {
  if (linkPreviewCache[url]) return linkPreviewCache[url];
  try {
    const r = await fetch('/api/link-preview?url=' + encodeURIComponent(url));
    const data = await r.json();
    linkPreviewCache[url] = data;
    return data;
  } catch (e) { return null; }
}
function linkPreviewCardHtml(data) {
  if (!data || (!data.title && !data.image)) return '';
  return `<a href="${esc(data.url)}" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    ${data.image ? `<img src="${esc(data.image)}" class="link-preview-img" loading="lazy" onerror="this.remove()">` : ''}
    <div class="link-preview-body">
      ${data.site ? `<div class="link-preview-site">${esc(data.site)}</div>` : ''}
      ${data.title ? `<div class="link-preview-title">${esc(data.title)}</div>` : ''}
      ${data.description ? `<div class="link-preview-desc">${esc(data.description)}</div>` : ''}
    </div>
  </a>`;
}
async function loadLinkPreviews(scope) {
  const slots = (scope || document).querySelectorAll('.link-preview-slot[data-lp-url]');
  slots.forEach(async (slot) => {
    const url = slot.getAttribute('data-lp-url');
    if (!url) return;
    const data = await fetchLinkPreview(url);
    if (!slot.isConnected) return;
    if (data && (data.title || data.image)) slot.innerHTML = linkPreviewCardHtml(data);
    else slot.remove();
  });
}
// The server stores timestamps in UTC without a timezone; we interpret them as UTC so the browser converts them automatically to the user's local time
function toUTCDate(s){
  if(!s) return new Date(NaN);
  if(s instanceof Date) return s;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ','T')+'Z');
  return new Date(s);
}
function fmtTime(s){ if(!s) return ''; return toUTCDate(s).toLocaleTimeString(currentLang==='ar'?'ar':'en',{hour:'2-digit',minute:'2-digit'}); }
function fmtDay(s){
  if(!s) return '';
  const d = toUTCDate(s), now = new Date();
  const diff = Math.floor((now-d)/86400000);
  if (diff === 0) return t('today');
  if (diff === 1) return t('yesterday');
  return d.toLocaleDateString(currentLang==='ar'?'ar-SA':'en-US',{month:'short',day:'numeric'});
}

const SVG = {
  send:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  attach:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  like:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  user:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  editIc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  deleteIc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  flagIc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
};
const REACTIONS = [
  { emoji:'like', icon:SVG.like }, { emoji:'heart', icon:SVG.heart }, { emoji:'haha', icon:SVG.haha },
  { emoji:'sad', icon:SVG.sad }, { emoji:'angry', icon:SVG.angry },
];

function applyLang(){
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  document.getElementById('backText').textContent = t('back');
  document.getElementById('membersTitle').textContent = t('members');
  document.getElementById('addMemberText').textContent = t('add');
  document.getElementById('loadingText').textContent = t('loading');
  document.getElementById('settingsTitle').textContent = t('settingsTitle');
  document.getElementById('gsName').placeholder = t('groupName');
  document.getElementById('gsDesc').placeholder = t('groupDesc');
  document.getElementById('gsCancelBtn').textContent = t('cancel');
  document.getElementById('gsSaveText').textContent = t('save');
  document.getElementById('leaveGroupBtn').textContent = t('leaveGroup');
  document.getElementById('deleteGroupBtn').textContent = t('deleteGroup');
  document.getElementById('addMemberTitle').textContent = t('addMembersTitle');
  document.getElementById('amCancelBtn').textContent = t('cancel');
  document.getElementById('amConfirmText').textContent = t('add');
  const msgInput = document.getElementById('msgInput');
  if (msgInput) msgInput.placeholder = t('sendPlaceholder');
  renderMembers();
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
  if (!e.target.closest('.bubble')) document.querySelectorAll('.react-picker.show').forEach(p=>p.classList.remove('show'));
  if (!e.target.closest('.m-actions')) document.querySelectorAll('.m-menu.show').forEach(p=>p.classList.remove('show'));
});
function setLang(lang){
  currentLang = lang;
  localStorage.setItem('hostaka_lang', lang);
  if (window.setHostakaLang) window.setHostakaLang(lang);
  document.getElementById('langMenu').classList.remove('show');
  applyLang();
  if (group) loadMsgs(false);
}

async function apiFetch(url, method='GET', body=null){
  const token = getToken();
  const opts = { method, headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (!r.ok){
    const text = await r.text().catch(()=> '');
    let msg = text, parsed = null;
    try { parsed = JSON.parse(text); msg = parsed.error || text; } catch(e){}
    if (r.status===403 && parsed?.suspended) { handleSuspended(parsed.reason); return parsed; }
    const err = new Error(msg || ('HTTP '+r.status));
    err.status = r.status;
    throw err;
  }
  return r.json();
}

async function handleSuspended(reason){
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_role');
  await hostakaAlert(t('suspendedMsg',{reason: reason ? ':\n' + reason : ''}));
  window.location = '/';
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
  document.getElementById('chatMain').innerHTML = `<div class="not-logged">${SVG.user}<h2>${t('loginRequired')}</h2><a href="/" class="btn-go">${t('home')}</a></div>`;
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('sidebarToggle').style.display = 'none';
}
function showError(msg){
  document.getElementById('chatMain').innerHTML = `<div class="not-logged"><h2>${msg}</h2><a href="/chat" class="btn-go">${t('back')}</a></div>`;
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('sidebarToggle').style.display = 'none';
}

function toggleSidebar(force){
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = force !== undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  ov.classList.toggle('show', open);
}
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
});

// ============================================================
//  التهيئة
// ============================================================
async function init(){
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setThemeIcon(THEME_ICON_DARK);
  }

  loadWallpaperState();
  applyWallpaper();
  applyLang();

  if (!GROUP_ID){ showError(t('groupNotFound')); return; }

  const token = getToken();
  if (!token){ showNotLogged(); return; }
  try {
    const r = await fetch('/api/auth/me', { headers:{ 'Authorization':'Bearer '+token } });
    if (!r.ok){ showNotLogged(); return; }
    const u = await r.json();
    if (!u || u.error){ showNotLogged(); return; }
    ME = u;
  } catch(e){ showNotLogged(); return; }

  try {
    const [g, users] = await Promise.all([
      apiFetch('/api/groups/' + GROUP_ID),
      apiFetch('/api/users').catch(()=>[])
    ]);
    group = g;
    members = Array.isArray(g.members) ? g.members : [];
    allUsers = Array.isArray(users) ? users : [];
    const me = members.find(m => m.user_id == ME.id);
    myRole = me?.role || 'member';
  } catch(e){
    if (e.status === 403){ showError(t('notMember')); }
    else { showError(t('groupNotFound')); }
    return;
  }

  renderTopbar();
  renderMembers();
  loadMemberStatuses();
  try {
    const s = await apiFetch('/api/settings/read-receipts');
    groupReadReceiptsEnabled = s?.enabled !== false;
  } catch(e) { groupReadReceiptsEnabled = true; }
  if (memberStatusInterval) clearInterval(memberStatusInterval);
  memberStatusInterval = setInterval(loadMemberStatuses, 25000);
  document.getElementById('addMemberBtn').style.display = (myRole !== 'member') ? 'flex' : 'none';
  document.getElementById('deleteGroupBtn').style.display = (myRole === 'admin') ? 'inline-flex' : 'none';

  buildChatUI();
  groupChatKey = 'group:' + GROUP_ID;
  await loadMsgs(true);
  pollTimer = setInterval(() => loadMsgs(false), 4000);
  if (groupTypingPollTimer) clearInterval(groupTypingPollTimer);
  groupTypingPollTimer = setInterval(pollGroupTyping, 2500);
}

function renderTopbar(){
  const av = group.avatar ? `<img src="${esc(group.avatar)}" alt="">` : (group.name||'?').charAt(0).toUpperCase();
  document.getElementById('groupAvWrap').innerHTML = av;
  document.getElementById('groupNameEl').textContent = group.name || '';
  document.getElementById('groupMetaEl').textContent = (members.length) + ' ' + t('members').toLowerCase();
}

function renderMembers(){
  const list = document.getElementById('memberList');
  if (!list || !members.length){ if(list) list.innerHTML = ''; return; }
  list.innerHTML = members.map(m => {
    const av = m.avatar ? `<img src="${esc(m.avatar)}" alt="">` : (m.display_name||m.username||'?').charAt(0).toUpperCase();
    const isMe = m.user_id == ME?.id;
    const roleLabel = m.role === 'admin' ? t('admin') : t('member');
    const canManage = (myRole !== 'member') && !isMe && !(m.role === 'admin' && myRole !== 'admin');
    const st = memberStatus[m.username];
    const isOnline = !!(st && st.online);
    let menu = '';
    if (!isMe){
      const roleBtn = canManage && myRole === 'admin'
        ? (m.role === 'admin'
            ? `<button onclick="changeRole(${m.user_id},'member')">${t('demote')}</button>`
            : `<button onclick="changeRole(${m.user_id},'admin')">${t('promote')}</button>`)
        : '';
      const removeBtn = canManage ? `<button class="danger" onclick="removeMember(${m.user_id})">${t('remove')}</button>` : '';
      menu = `<div class="m-actions">
        <div class="m-more" onclick="toggleMemberMenu(event, ${m.user_id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
        </div>
        <div class="m-menu" id="mmenu-${m.user_id}">
          <button onclick="setMemberNicknamePrompt(${m.user_id}, '${esc((m.nickname||'').replace(/'/g,"\\'"))}')">${t('setNickname')}</button>
          ${roleBtn}
          ${removeBtn}
          <button class="danger" onclick="blockMemberConfirm('${esc(m.username)}')">${t('blockUser')}</button>
        </div>
      </div>`;
    }
    return `<div class="member-item">
      <div class="m-av" style="position:relative;" onclick="location.href='/profile?u='+encodeURIComponent('${esc(m.username)}')">${av}<span class="status-dot member-dot ${isOnline?'online':''}"></span></div>
      <div class="m-info" onclick="location.href='/profile?u='+encodeURIComponent('${esc(m.username)}')">
        <div class="m-name">${esc(m.nickname || m.display_name || m.username)}${isMe ? ' ('+t('you')+')' : ''}</div>
        <div class="m-role ${m.role==='admin'?'admin':''}">${isOnline ? '<span style="color:#2ecc71;">'+esc(t('onlineNow'))+'</span>' : roleLabel}</div>
      </div>
      ${menu}
    </div>`;
  }).join('');
}

let memberStatus = {};
let memberStatusInterval = null;
async function loadMemberStatuses(){
  const usernames = members.map(m => m.username).filter(Boolean).join(',');
  if (!usernames) return;
  try {
    memberStatus = await apiFetch('/api/users/status/batch?usernames=' + encodeURIComponent(usernames));
    renderMembers();
  } catch(e) { /* تجاهل */ }
}

function toggleMemberMenu(e, uid){
  e.stopPropagation();
  const menu = document.getElementById('mmenu-'+uid);
  document.querySelectorAll('.m-menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); });
  menu.classList.toggle('show');
}

async function setMemberNicknamePrompt(uid, current){
  document.getElementById('mmenu-'+uid)?.classList.remove('show');
  const val = await hostakaPrompt(t('setNicknamePromptTitle'), current || '');
  if (val === null) return;
  try {
    await apiFetch(`/api/groups/${GROUP_ID}/members/${uid}/nickname`, 'PUT', { nickname: val.trim() });
    const g = await apiFetch('/api/groups/' + GROUP_ID);
    members = g.members || [];
    renderMembers();
    showToast(t('settingsSaved'));
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

async function blockMemberConfirm(username){
  document.querySelectorAll('.m-menu.show').forEach(m => m.classList.remove('show'));
  if (!await hostakaConfirm(t('confirmBlockMember'))) return;
  try {
    const d = await apiFetch('/api/block/' + encodeURIComponent(username), 'POST');
    if (d.success) showToast(t('settingsSaved'));
    else showToast(d.error || t('error'), 'error');
  } catch(e){ showToast(t('error'), 'error'); }
}

async function changeRole(uid, role){
  try {
    await apiFetch(`/api/groups/${GROUP_ID}/members/${uid}/role`, 'PUT', { role });
    const g = await apiFetch('/api/groups/' + GROUP_ID);
    members = g.members || [];
    renderMembers();
    showToast(t('settingsSaved'));
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

async function removeMember(uid){
  try {
    await apiFetch(`/api/groups/${GROUP_ID}/members/${uid}`, 'DELETE');
    members = members.filter(m => m.user_id != uid);
    renderMembers();
    renderTopbar();
    showToast(t('settingsSaved'));
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

// ============================================================
//  إعدادات المجموعة
// ============================================================
let pendingGroupAvatar = '';

function renderGsAvatarPreview(url){
  const box = document.getElementById('gsAvatarPreview');
  const camIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;bottom:2px;left:2px;background:rgba(0,0,0,0.55);border-radius:50%;padding:4px;color:#fff;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
  box.innerHTML = (url ? `<img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;">` : (group?.name||'?').charAt(0).toUpperCase()) + camIcon;
}

function onGroupAvatarFile(evt){
  const f = evt.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = async ev => {
    const base64 = ev.target.result;
    renderGsAvatarPreview(base64);
    try {
      const up = await apiFetch('/api/upload', 'POST', { image: base64 });
      if (up.url) { pendingGroupAvatar = up.url; }
      else { showToast(t('error'), 'error'); renderGsAvatarPreview(group?.avatar || ''); }
    } catch(e) { showToast(t('error'), 'error'); renderGsAvatarPreview(group?.avatar || ''); }
  };
  reader.readAsDataURL(f);
  evt.target.value = '';
}

async function openGroupMedia(){
  closeModal('groupSettingsModal');
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">${t('loading')}</div>`;
  openModal('mediaViewModal');
  try {
    const items = await apiFetch(`/api/groups/${GROUP_ID}/media`);
    if (!items || !items.length){
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:30px;">${t('noMedia')}</div>`;
      return;
    }
    grid.innerHTML = items.map(m => `<div class="media-grid-item" onclick="openImgViewer('${esc(m.image)}')"><img src="${esc(m.image)}" loading="lazy"></div>`).join('');
  } catch(e) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">${t('error')}</div>`; }
}

function openReportGroupModal(){
  closeModal('groupSettingsModal');
  document.getElementById('reportGroupReason').value = 'abuse';
  document.getElementById('reportGroupDetails').value = '';
  openModal('reportGroupModal');
}
async function submitReportGroup(){
  const reasonType = document.getElementById('reportGroupReason').value;
  const details = document.getElementById('reportGroupDetails').value.trim();
  const labels = { abuse:t('reasonAbuse'), spam:t('reasonSpam'), nudity:t('reasonNudity'), other:t('reasonOther') };
  const reason = (labels[reasonType]||reasonType) + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportGroupBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/reports', 'POST', { type:'group', target_id: GROUP_ID, subject: t('reportGroupTitle') + ' — ' + (group?.name||''), reason });
    if (d.success){ showToast(t('reportGroupSent')); closeModal('reportGroupModal'); }
    else { showToast(d.error || t('error'), 'error'); }
  } catch(e){ showToast(t('error'), 'error'); }
  btn.disabled = false;
}

function openGroupSettings(){
  document.getElementById('gsName').value = group.name || '';
  document.getElementById('gsDesc').value = group.description || '';
  document.getElementById('gsName').disabled = myRole === 'member';
  document.getElementById('gsDesc').disabled = myRole === 'member';
  document.getElementById('gsSaveBtn').style.display = myRole === 'member' ? 'none' : 'inline-flex';
  pendingGroupAvatar = '';
  renderGsAvatarPreview(group.avatar || '');
  document.getElementById('gsAvatarFile').disabled = myRole === 'member';
  const rr = document.getElementById('gsReadReceipts');
  if (rr) rr.checked = groupReadReceiptsEnabled;
  openModal('groupSettingsModal');
}

async function saveGroupSettings(){
  const name = document.getElementById('gsName').value.trim();
  if (!name){ showToast(t('error'), 'error'); return; }
  const description = document.getElementById('gsDesc').value.trim();
  const avatar = pendingGroupAvatar || group.avatar || '';
  const btn = document.getElementById('gsSaveBtn');
  btn.disabled = true;
  try {
    await apiFetch('/api/groups/' + GROUP_ID, 'PUT', {
      name, description, avatar, theme: group.theme || 'default', background: group.background || 'default'
    });
    group.name = name; group.description = description; group.avatar = avatar;
    renderTopbar();
    closeModal('groupSettingsModal');
    showToast(t('settingsSaved'));
  } catch(e){ showToast(e.message || t('error'), 'error'); }
  btn.disabled = false;
}

async function leaveGroup(){
  if (!await hostakaConfirm(t('confirmLeave'))) return;
  try {
    await apiFetch(`/api/groups/${GROUP_ID}/members/${ME.id}`, 'DELETE');
    showToast(t('leftGroup'));
    setTimeout(()=> location.href = '/chat', 700);
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

async function deleteGroupConfirm(){
  if (!await hostakaConfirm(t('confirmDelete'))) return;
  try {
    await apiFetch('/api/groups/' + GROUP_ID, 'DELETE');
    showToast(t('groupDeleted'));
    setTimeout(()=> location.href = '/chat', 700);
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

// ============================================================
//  إضافة أعضاء
// ============================================================
function openAddMember(){
  const memberIds = new Set(members.map(m => m.user_id));
  const others = allUsers.filter(u => !memberIds.has(u.id));
  const box = document.getElementById('addMemberOptions');
  if (!others.length){
    box.innerHTML = `<div style="text-align:center;color:var(--muted);padding:16px;font-size:0.85rem;">${t('noOthers')}</div>`;
  } else {
    box.innerHTML = others.map(u => `
      <label class="member-check">
        <input type="checkbox" value="${u.id}">
        <div class="m-av" style="width:28px;height:28px;font-size:0.78rem;">
          ${u.avatar ? `<img src="${esc(u.avatar)}" alt="">` : ((u.display_name||u.username||'?').charAt(0).toUpperCase())}
        </div>
        <span>${esc(u.display_name || u.username)}</span>
      </label>`).join('');
  }
  openModal('addMemberModal');
}

async function confirmAddMembers(){
  const ids = [...document.querySelectorAll('#addMemberOptions input:checked')].map(i => Number(i.value));
  if (!ids.length){ closeModal('addMemberModal'); return; }
  const btn = document.getElementById('amConfirmBtn');
  btn.disabled = true;
  try {
    for (const uid of ids){
      await apiFetch(`/api/groups/${GROUP_ID}/members`, 'POST', { user_id: uid, role: 'member' });
    }
    const g = await apiFetch('/api/groups/' + GROUP_ID);
    members = g.members || [];
    renderMembers();
    renderTopbar();
    closeModal('addMemberModal');
    showToast(t('membersAdded'));
  } catch(e){ showToast(e.message || t('error'), 'error'); }
  btn.disabled = false;
}

// ============================================================
//  واجهة الدردشة
// ============================================================
function buildChatUI(){
  document.getElementById('chatMain').innerHTML = `
    <div class="msgs-area" id="msgsArea">
      <div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;">${t('loading')}</div>
    </div>
    <div class="img-preview-bar" id="imgPreviewBar" style="display:none;">
      <img id="imgPreviewThumb" src="" alt="">
      <button class="img-rm-btn" onclick="removeChatImg()">${SVG.close}</button>
      <span style="font-size:0.76rem;color:var(--muted);">${t('imageAttached')}</span>
    </div>
    <div class="input-area">
      <button class="btn-attach" onclick="document.getElementById('chatImgFile').click()" title="${t('attach')}">${SVG.attach}</button>
      <input type="file" id="chatImgFile" accept=".jpg,.jpeg,image/jpeg" style="display:none;" onchange="onChatImg(event)">
      <textarea class="msg-input" id="msgInput" placeholder="${t('sendPlaceholder')}" rows="1" onkeydown="onKey(event)" oninput="autoResize(this);pingGroupTyping()"></textarea>
      <button class="send-btn" id="sendBtn" onclick="sendMsg()">${SVG.send}</button>
    </div>`;
}

let _lastMsgs = [];
async function loadMsgs(scroll){
  const area = document.getElementById('msgsArea');
  try {
    const msgs = await apiFetch(`/api/groups/${GROUP_ID}/messages`);
    if (!Array.isArray(msgs)){ return; }
    _lastMsgs = msgs;
    await loadMsgReactions(msgs);
    renderMsgs(msgs, scroll);
    if (msgs.length) {
      const lastId = msgs[msgs.length - 1].id;
      apiFetch(`/api/groups/${GROUP_ID}/read`, 'POST', { message_id: lastId }).catch(()=>{});
    }
  } catch(e){
    console.error('loadMsgs failed:', e);
    if (area) area.innerHTML = `<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-left:4px;"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> ${e.message || t('error')}</div>`;
  }
}

// ============================================================
//  مؤشر الكتابة "يكتب..." للمجموعة
// ============================================================
let groupChatKey = null;
let groupReadReceiptsEnabled = true;
async function toggleGroupReadReceipts(enabled){
  try {
    await apiFetch('/api/settings/read-receipts', 'PUT', { enabled });
    groupReadReceiptsEnabled = enabled;
    renderMsgs(_lastMsgs, false);
  } catch(e) { showToast(t('error'), 'error'); }
}
let groupTypingPingTimer = null;
let groupTypingPollTimer = null;
let lastGroupTypingPingAt = 0;
let groupTypingUsers = [];
function pingGroupTyping(){
  if (!groupChatKey) return;
  const now = Date.now();
  if (now - lastGroupTypingPingAt < 2000) return;
  lastGroupTypingPingAt = now;
  apiFetch('/api/typing', 'POST', { chat_key: groupChatKey }).catch(()=>{});
  if (groupTypingPingTimer) clearTimeout(groupTypingPingTimer);
  groupTypingPingTimer = setTimeout(stopGroupTyping, 4000);
}
function stopGroupTyping(){
  if (groupTypingPingTimer) { clearTimeout(groupTypingPingTimer); groupTypingPingTimer = null; }
  if (groupChatKey) apiFetch('/api/typing', 'POST', { chat_key: groupChatKey, stop: true }).catch(()=>{});
}
async function pollGroupTyping(){
  if (!groupChatKey) return;
  try {
    const d = await apiFetch('/api/typing/' + encodeURIComponent(groupChatKey));
    groupTypingUsers = Array.isArray(d?.typing) ? d.typing : [];
    renderGroupTypingRow();
  } catch(e) { /* تجاهل */ }
}
function renderGroupTypingRow(){
  const area = document.getElementById('msgsArea');
  if (!area) return;
  let row = document.getElementById('typingRow');
  if (groupTypingUsers.length) {
    const names = groupTypingUsers.map(u => {
      const mem = members.find(m => m.user_id == u.user_id);
      return esc(mem?.nickname || u.display_name || u.username);
    }).join('، ');
    if (!row) {
      const wasAtBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 40;
      const div = document.createElement('div');
      div.id = 'typingRow';
      div.className = 'typing-row';
      div.innerHTML = `<div class="msg-av">${SVG.user || '?'}</div><div class="typing-bubble"><span class="typing-name">${names}</span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
      area.appendChild(div);
      if (wasAtBottom) area.scrollTop = area.scrollHeight;
    } else {
      const nameEl = row.querySelector('.typing-name');
      if (nameEl) nameEl.textContent = names;
    }
  } else if (row) {
    row.remove();
  }
}

async function loadMsgReactions(msgs){
  if (!msgs || !msgs.length) return;
  try {
    const ids = msgs.map(m => m.id).join(',');
    const data = await apiFetch(`/api/groups/${GROUP_ID}/messages/reactions?ids=` + ids);
    if (data && typeof data === 'object') Object.assign(msgReactions, data);
  } catch(e) {
    // نتجاهل: سيتم عرض الريأكشنز الجديدة عند التفاعل مباشرة
  }
}

function renderMsgs(msgs, scroll = true){
  const area = document.getElementById('msgsArea');
  if (!area) return;
  if (!msgs || !msgs.length){
    area.innerHTML = `<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;">${t('noMessages')}</div>`;
    return;
  }
  let html = '', lastDay = '';
  const receiptsByMsgId = {};
  if (groupReadReceiptsEnabled) {
    members.forEach(mem => {
      if (mem.user_id == ME?.id) return;
      const lr = Number(mem.last_read_message_id || 0);
      if (!lr) return;
      let candidate = null;
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (Number(msgs[i].id) <= lr) { candidate = msgs[i]; break; }
      }
      if (candidate) (receiptsByMsgId[candidate.id] = receiptsByMsgId[candidate.id] || []).push(mem);
    });
  }
  msgs.forEach((m, i) => {
    const isMine = m.user_id == ME?.id;
    const canManageMsg = isMine || myRole !== 'member';
    const day = fmtDay(m.created_at);
    if (day !== lastDay){
      html += `<div class="date-divider"><span>${day}</span></div>`;
      lastDay = day;
    }
    const next = msgs[i+1];
    const isLast = !next || next.user_id != m.user_id;
    const av = m.from_avatar ? `<img src="${esc(m.from_avatar)}" alt="">` : (m.from_name||'?').charAt(0).toUpperCase();
    const rc = msgReactions[m.id] || { reactions: [], userReaction: null };
    const totalReacts = rc.reactions && rc.reactions.length ? rc.reactions.reduce((s,r)=> s+Number(r.count||0), 0) : 0;
    const reactionHtml = totalReacts > 0 ?
      `<div class="msg-reaction" onclick="togglePicker(${m.id})">${rc.reactions.map(r => (REACTIONS.find(x=>x.emoji===r.emoji)||{}).icon || '').join('')} <span style="font-size:0.7rem;color:var(--muted);">${totalReacts}</span></div>` : '';
    const firstUrl = extractFirstUrl(m.content);
    const replySrc = m.reply_to ? msgs.find(x => x.id === m.reply_to) : null;
    const replyQuoteHtml = replySrc ? `<div class="msg-reply-quote">${esc((replySrc.content || (replySrc.image ? '📷 صورة' : '')).slice(0,80))}</div>` : (m.reply_to ? `<div class="msg-reply-quote">${t('reply')}</div>` : '');
    const pickerHtml = `<div class="react-picker" id="picker-${m.id}">
            ${REACTIONS.map(r => `<button class="r-emoji ${rc.userReaction===r.emoji?'active':''}" onclick="reactMsg(event,${m.id},'${r.emoji}')">${r.icon}</button>`).join('')}
            <div class="picker-sep"></div>
            <button class="r-emoji" onclick="startReplyMsg(event, ${m.id})" title="${t('reply')}">${SVG.arrow}</button>
            ${isMine ? `<button class="r-emoji" onclick="startEditMsg(event, ${m.id})" title="${t('editMsg')}">${SVG.editIc}</button>` : ''}
            ${canManageMsg ? `<button class="r-emoji" onclick="deleteMsg(event, ${m.id})" title="${t('deleteMsg')}">${SVG.deleteIc}</button>` : ''}
            ${!isMine ? `<button class="r-emoji" onclick="openReportMsgModal(event, ${m.id})" title="${t('reportMsg')}">${SVG.flagIc}</button>` : ''}
          </div>`;
    html += `<div class="msg-row ${isMine ? 'mine' : 'theirs'}">
      ${!isMine ? `<div class="msg-av ${isLast?'':'invisible'}">${av}</div>` : ''}
      <div class="bubble-wrap">
        ${!isMine && isLast ? `<div class="sender-name">${esc(m.from_name)}</div>` : ''}
        ${m.image ? `<div class="bubble-media" onclick="openImgViewer(this.querySelector('img').src)">
          ${replyQuoteHtml}
          <img class="bubble-img" src="${esc(m.image)}" loading="lazy" onerror="this.parentElement.style.display='none'">
          <button class="media-more-btn" onclick="event.stopPropagation();togglePicker(${m.id})" title="${t('editMsg')}">${SVG.moreIc || '⋮'}</button>
          ${pickerHtml}
        </div>` : ''}
        ${m.content ? `<div class="bubble" id="bubble-${m.id}" onclick="togglePicker(${m.id})">
          ${replyQuoteHtml}
          ${linkifyEscaped(esc(m.content))}
          ${firstUrl ? `<div class="link-preview-slot" data-lp-url="${esc(firstUrl)}"></div>` : ''}
          ${!m.image ? pickerHtml : ''}
        </div>` : ''}
        ${reactionHtml}
        <div class="msg-time">${fmtTime(m.created_at)}${Number(m.edited)===1 ? ' · <span class="msg-edited-tag">'+esc(t('msgEdited'))+'</span>' : ''}</div>
        ${receiptsByMsgId[m.id] ? `<div class="seen-receipt" title="${t('seenBy')}: ${receiptsByMsgId[m.id].map(x=>esc(x.nickname||x.display_name||x.username)).join('، ')}">${receiptsByMsgId[m.id].slice(0,3).map(x => `<div class="seen-av">${x.avatar ? `<img src="${esc(x.avatar)}" alt="">` : (x.display_name||x.username||'?').charAt(0).toUpperCase()}</div>`).join('')}</div>` : ''}
      </div>
      ${isMine ? `<div class="msg-av ${isLast?'':'invisible'}">${av}</div>` : ''}
    </div>`;
  });
  area.innerHTML = html;
  if (scroll) area.scrollTop = area.scrollHeight;
  loadLinkPreviews(area);
  if (groupTypingUsers.length) renderGroupTypingRow();
}

let replyingToMsgId = null;
function startReplyMsg(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  const src = _lastMsgs.find(x => x.id === mid);
  replyingToMsgId = mid;
  showReplyBanner(src ? (src.content || (src.image ? '📷 صورة' : '')) : '');
  document.getElementById('msgInput')?.focus();
}
function showReplyBanner(snippet){
  let banner = document.getElementById('replyMsgBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'replyMsgBanner';
    banner.className = 'edit-msg-banner';
    document.getElementById('msgInput')?.closest('.input-area')?.prepend(banner);
  }
  banner.innerHTML = `<span>${t('reply')}: ${esc((snippet||'').slice(0,60))}</span><button onclick="cancelReplyMsg()">${SVG.close}</button>`;
  banner.style.display = 'flex';
}
function cancelReplyMsg(){
  replyingToMsgId = null;
  const banner = document.getElementById('replyMsgBanner');
  if (banner) banner.style.display = 'none';
}

function togglePicker(id){
  const p = document.getElementById('picker-'+id);
  if (!p) return;
  document.querySelectorAll('.react-picker.show').forEach(x => { if (x !== p) x.classList.remove('show'); });
  p.classList.toggle('show');
}

async function reactMsg(e, mid, emoji){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  try {
    const d = await apiFetch(`/api/groups/${GROUP_ID}/messages/${mid}/react`, 'POST', { emoji });
    if (d.success){
      msgReactions[mid] = { reactions: d.reactions||[], userReaction: d.userReaction||null };
      renderMsgs(_lastMsgs, false);
    }
  } catch(e){
    console.error('reactMsg failed:', e);
    showToast(t('error'), 'error');
  }
}

function onChatImg(e){
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.match('image/jpeg')){ showToast(t('jpgOnly'), 'error'); return; }
  const r = new FileReader();
  r.onload = ev => {
    chatImgBase64 = ev.target.result;
    document.getElementById('imgPreviewThumb').src = chatImgBase64;
    document.getElementById('imgPreviewBar').style.display = 'flex';
  };
  r.readAsDataURL(f);
  e.target.value = '';
}
function removeChatImg(){
  chatImgBase64 = '';
  document.getElementById('imgPreviewBar').style.display = 'none';
}

let editingMsgId = null;

function startEditMsg(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  const m = _lastMsgs.find(x => x.id === mid);
  if (!m) return;
  editingMsgId = mid;
  const input = document.getElementById('msgInput');
  input.value = m.content || '';
  input.focus();
  autoResize(input);
  showEditBanner();
}

function showEditBanner(){
  let banner = document.getElementById('editMsgBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'editMsgBanner';
    banner.className = 'edit-msg-banner';
    banner.innerHTML = `<span>${esc(t('editMsg'))}</span><button onclick="cancelEditMsg()">${SVG.close}</button>`;
    document.getElementById('msgInput')?.closest('.input-area')?.prepend(banner);
  }
  banner.style.display = 'flex';
}
function cancelEditMsg(){
  editingMsgId = null;
  const banner = document.getElementById('editMsgBanner');
  if (banner) banner.style.display = 'none';
  const input = document.getElementById('msgInput');
  if (input) { input.value = ''; input.style.height = ''; }
}

async function deleteMsg(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  if (!await hostakaConfirm(t('deleteMsgConfirm'))) return;
  try {
    const d = await apiFetch(`/api/groups/${GROUP_ID}/messages/${mid}`, 'DELETE');
    if (d.success) await loadMsgs(false);
    else showToast(d.error || t('error'), 'error');
  } catch(err) { showToast(t('error'), 'error'); }
}

let reportMsgTargetId = null;
function openReportMsgModal(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  reportMsgTargetId = mid;
  document.getElementById('reportMsgReason').value = 'spam';
  document.getElementById('reportMsgDetails').value = '';
  document.getElementById('reportMsgModal').classList.add('show');
}
async function submitReportMsg(){
  if (!reportMsgTargetId) return;
  const reasonType = document.getElementById('reportMsgReason').value;
  const details = document.getElementById('reportMsgDetails').value.trim();
  const labels = { spam:t('reasonSpam'), abuse:t('reasonAbuse'), nudity:t('reasonNudity'), other:t('reasonOther') };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const m = _lastMsgs.find(x => x.id === reportMsgTargetId);
  const btn = document.getElementById('reportMsgBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/reports', 'POST', {
      type: 'group_message', target_id: reportMsgTargetId, target_owner_username: m?.from_name || '',
      subject: t('reportGroupMsgSubject'), reason
    });
    if (d.success) { showToast(t('reportSent')); closeModal('reportMsgModal'); }
    else showToast(d.error || t('error'), 'error');
  } catch(err) { showToast(t('error'), 'error'); }
  btn.disabled = false;
}

async function sendMsg(){
  const input = document.getElementById('msgInput');
  const content = input?.value.trim() || '';
  if (!content && !chatImgBase64) return;
  stopGroupTyping();

  if (editingMsgId) {
    const mid = editingMsgId;
    input.value = ''; input.style.height = '';
    cancelEditMsg();
    document.getElementById('sendBtn').disabled = true;
    try {
      const d = await apiFetch(`/api/groups/${GROUP_ID}/messages/${mid}`, 'PUT', { content });
      if (d.success) await loadMsgs(false);
      else showToast(d.error || t('error'), 'error');
    } catch(e) { showToast(t('error'), 'error'); }
    document.getElementById('sendBtn').disabled = false;
    return;
  }

  input.value = '';
  input.style.height = '';
  document.getElementById('sendBtn').disabled = true;
  try {
    let imageUrl = '';
    if (chatImgBase64){
      const up = await apiFetch('/api/upload', 'POST', { image: chatImgBase64 });
      if (up.url) imageUrl = up.url;
      removeChatImg();
    }
    const replyTo = replyingToMsgId;
    cancelReplyMsg();
    await apiFetch(`/api/groups/${GROUP_ID}/messages`, 'POST', { content, image: imageUrl, reply_to: replyTo });
    await loadMsgs(true);
  } catch(e){
    console.error('sendMsg failed:', e);
    showToast(t('error'), 'error');
  }
  document.getElementById('sendBtn').disabled = false;
}

function onKey(e){ if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMsg(); } }
function autoResize(el){ el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }

// ============================================================
//  عارض الصور (فتح وحفظ)
// ============================================================
function openImgViewer(url){
  if(!url) return;
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  const ov = document.getElementById('imgViewerOverlay');
  const img = document.getElementById('imgViewerImg');
  img.src = url;
  ov.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeImgViewer(e){
  if(e) e.stopPropagation();
  document.getElementById('imgViewerOverlay').classList.remove('show');
  document.body.style.overflow = '';
}
async function saveViewerImage(e){
  e.stopPropagation();
  const img = document.getElementById('imgViewerImg');
  const url = img.src;
  if(!url) return;
  try{
    const res = await fetch(url, { mode:'cors' });
    if(!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'hostaka-' + Date.now() + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
  }catch(err){
    window.open(url, '_blank');
    showToast(t('longPressToSave'), 'info');
  }
}

init();

/* expose top-level functions for inline onclick handlers */
try { window.getToken = getToken; } catch(e) {}
try { window.t = t; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.linkifyEscaped = linkifyEscaped; } catch(e) {}
try { window.extractFirstUrl = extractFirstUrl; } catch(e) {}
try { window.fetchLinkPreview = fetchLinkPreview; } catch(e) {}
try { window.linkPreviewCardHtml = linkPreviewCardHtml; } catch(e) {}
try { window.loadLinkPreviews = loadLinkPreviews; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtTime = fmtTime; } catch(e) {}
try { window.fmtDay = fmtDay; } catch(e) {}
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
try { window.handleSuspended = handleSuspended; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.showNotLogged = showNotLogged; } catch(e) {}
try { window.showError = showError; } catch(e) {}
try { window.toggleSidebar = toggleSidebar; } catch(e) {}
try { window.openModal = openModal; } catch(e) {}
try { window.closeModal = closeModal; } catch(e) {}
try { window.init = init; } catch(e) {}
try { window.renderTopbar = renderTopbar; } catch(e) {}
try { window.renderMembers = renderMembers; } catch(e) {}
try { window.loadMemberStatuses = loadMemberStatuses; } catch(e) {}
try { window.toggleMemberMenu = toggleMemberMenu; } catch(e) {}
try { window.changeRole = changeRole; } catch(e) {}
try { window.removeMember = removeMember; } catch(e) {}
try { window.renderGsAvatarPreview = renderGsAvatarPreview; } catch(e) {}
try { window.onGroupAvatarFile = onGroupAvatarFile; } catch(e) {}
try { window.openGroupSettings = openGroupSettings; } catch(e) {}
try { window.saveGroupSettings = saveGroupSettings; } catch(e) {}
try { window.leaveGroup = leaveGroup; } catch(e) {}
try { window.deleteGroupConfirm = deleteGroupConfirm; } catch(e) {}
try { window.openAddMember = openAddMember; } catch(e) {}
try { window.confirmAddMembers = confirmAddMembers; } catch(e) {}
try { window.buildChatUI = buildChatUI; } catch(e) {}
try { window.loadMsgs = loadMsgs; } catch(e) {}
try { window.loadMsgReactions = loadMsgReactions; } catch(e) {}
try { window.renderMsgs = renderMsgs; } catch(e) {}
try { window.togglePicker = togglePicker; } catch(e) {}
try { window.reactMsg = reactMsg; } catch(e) {}
try { window.onChatImg = onChatImg; } catch(e) {}
try { window.removeChatImg = removeChatImg; } catch(e) {}
try { window.startEditMsg = startEditMsg; } catch(e) {}
try { window.showEditBanner = showEditBanner; } catch(e) {}
try { window.cancelEditMsg = cancelEditMsg; } catch(e) {}
try { window.deleteMsg = deleteMsg; } catch(e) {}
try { window.openReportMsgModal = openReportMsgModal; } catch(e) {}
try { window.submitReportMsg = submitReportMsg; } catch(e) {}
try { window.sendMsg = sendMsg; } catch(e) {}
try { window.onKey = onKey; } catch(e) {}
try { window.autoResize = autoResize; } catch(e) {}
try { window.openImgViewer = openImgViewer; } catch(e) {}
try { window.closeImgViewer = closeImgViewer; } catch(e) {}
try { window.saveViewerImage = saveViewerImage; } catch(e) {}
try { window.openGroupMedia = openGroupMedia; } catch(e) {}
try { window.openReportGroupModal = openReportGroupModal; } catch(e) {}
try { window.submitReportGroup = submitReportGroup; } catch(e) {}
try { window.setMemberNicknamePrompt = setMemberNicknamePrompt; } catch(e) {}
try { window.blockMemberConfirm = blockMemberConfirm; } catch(e) {}
try { window.toggleGroupReadReceipts = toggleGroupReadReceipts; } catch(e) {}
try { window.pingGroupTyping = pingGroupTyping; } catch(e) {}
