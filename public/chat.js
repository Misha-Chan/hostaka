// ============================================================
//  الترجمة (i18n)
// ============================================================
const LANG = {
  ar: {
    back: 'Hostaka', title: 'الرسائل', sidebarTitle: 'الرسائل',
    newGroup: 'جروب جديد', loading: 'جارٍ التحميل...',
    emptyState: 'اختر محادثة من القائمة',
    groups: 'المجموعات', conversations: 'المحادثات', allMembers: 'جميع الأعضاء',
    noMembers: 'لا يوجد أعضاء آخرون', startChat: 'ابدأ محادثة',
    you: 'أنت', admin: 'مدير', member: 'عضو',
    onlineNow: 'متصل الآن', lastSeen: 'آخر ظهور',
    editMsg: 'تعديل', deleteMsg: 'حذف', reportMsg: 'إبلاغ', msgEdited: 'معدّلة',
    editMsgPlaceholder: 'عدّل رسالتك...', save: 'حفظ', cancelEdit: 'إلغاء التعديل',
    deleteMsgConfirm: 'حذف هذه الرسالة؟', reportMsgTitle: 'الإبلاغ عن رسالة',
    reportSent: 'تم إرسال البلاغ، شكراً لك',
    groupName: 'اسم المجموعة *', create: 'إنشاء', cancel: 'إلغاء',
    createGroupTitle: 'إنشاء مجموعة جديدة',
    sendPlaceholder: 'اكتب رسالة...', attach: 'إرفاق صورة JPG', imageAttached: 'صورة مرفقة',
    loginRequired: 'يجب تسجيل الدخول', home: 'الرئيسية',
    groupCreated: 'تم إنشاء المجموعة', error: 'فشل',
    noMessages: 'ابدأ المحادثة', today: 'اليوم', yesterday: 'أمس',
    setNicknamePlaceholder: 'كنية تظهر لك فقط بدلاً من الاسم', viewProfile: 'عرض الملف الشخصي',
    viewMedia: 'عرض وسائط المحادثة', readReceiptsToggle: 'إظهار مؤشر قراءة الرسائل',
    reportUser: 'الإبلاغ عن المستخدم', blockUser: 'حظر المستخدم', unblockUser: 'إلغاء حظر المستخدم', deleteConversation: 'حذف المحادثة',
    noMedia: 'لا توجد وسائط', confirmDeleteConversation: 'سيتم حذف كل الرسائل في هذه المحادثة نهائياً. متابعة؟',
    conversationDeleted: 'تم حذف المحادثة', selectChat: 'اختر محادثة من القائمة', seenAt: 'شوهدت',
    imageTooLarge: 'الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB',
    reportSubjectPrefix: 'إبلاغ عن مستخدم @{u}', reportSentShort: 'تم إرسال البلاغ', sendFail: 'فشل الإرسال',
    loadMsgsError: 'خطأ في تحميل الرسائل', cantConnectServer: 'تعذر الاتصال بالخادم',
    reactSendFail: 'فشل إرسال التفاعل', msgSendFail: 'فشل إرسال الرسالة', longPressToSave: 'اضغط مطولاً على الصورة لحفظها',
    jpgOnly: 'JPG/JPEG فقط', reasonAbuse: 'إساءة أو تنمر', reasonSpam: 'رسائل مزعجة', reasonFake: 'حساب مزيف أو منتحل', reasonOther: 'سبب آخر',
    unblocked: 'تم إلغاء الحظر', blocked: 'تم حظر المستخدم', cantDecrypt: 'تعذر فك تشفير هذه الرسالة'
  },
  en: {
    back: 'Hostaka', title: 'Messages', sidebarTitle: 'Messages',
    newGroup: 'New Group', loading: 'Loading...',
    emptyState: 'Select a conversation from the list',
    groups: 'Groups', conversations: 'Conversations', allMembers: 'All Members',
    noMembers: 'No other members', startChat: 'Start chat',
    you: 'You', admin: 'Admin', member: 'Member',
    onlineNow: 'Online now', lastSeen: 'Last seen',
    editMsg: 'Edit', deleteMsg: 'Delete', reportMsg: 'Report', msgEdited: 'edited',
    editMsgPlaceholder: 'Edit your message...', save: 'Save', cancelEdit: 'Cancel edit',
    deleteMsgConfirm: 'Delete this message?', reportMsgTitle: 'Report message',
    reportSent: 'Report sent, thank you',
    groupName: 'Group name *', create: 'Create', cancel: 'Cancel',
    createGroupTitle: 'Create New Group',
    sendPlaceholder: 'Type a message...', attach: 'Attach JPG image', imageAttached: 'Image attached',
    loginRequired: 'Please login', home: 'Home',
    groupCreated: 'Group created', error: 'Failed',
    noMessages: 'Start the conversation', today: 'Today', yesterday: 'Yesterday',
    setNicknamePlaceholder: 'A nickname only you see instead of the name', viewProfile: 'View profile',
    viewMedia: 'View shared media', readReceiptsToggle: 'Show read receipts',
    reportUser: 'Report user', blockUser: 'Block user', unblockUser: 'Unblock user', deleteConversation: 'Delete conversation',
    noMedia: 'No media yet', confirmDeleteConversation: 'All messages in this conversation will be permanently deleted. Continue?',
    conversationDeleted: 'Conversation deleted', selectChat: 'Select a conversation from the list', seenAt: 'Seen',
    imageTooLarge: 'Image is too large, please choose one smaller than 8MB',
    reportSubjectPrefix: 'Report on user @{u}', reportSentShort: 'Report sent', sendFail: 'Failed to send',
    loadMsgsError: 'Error loading messages', cantConnectServer: 'Could not connect to the server',
    reactSendFail: 'Failed to send reaction', msgSendFail: 'Failed to send message', longPressToSave: 'Press and hold the image to save it',
    jpgOnly: 'JPG/JPEG only', reasonAbuse: 'Abuse or harassment', reasonSpam: 'Spam messages', reasonFake: 'Fake or impersonation account', reasonOther: 'Other reason',
    unblocked: 'Unblocked', blocked: 'User blocked', cantDecrypt: 'Unable to decrypt this message'
  },
  fr: {
    back: 'Hostaka', title: 'Messages', sidebarTitle: 'Messages',
    newGroup: 'Nouveau groupe', loading: 'Chargement...',
    emptyState: 'Choisissez une conversation',
    groups: 'Groupes', conversations: 'Conversations', allMembers: 'Tous les membres',
    noMembers: 'Aucun autre membre', startChat: 'Commencer',
    you: 'Vous', admin: 'Admin', member: 'Membre',
    groupName: 'Nom du groupe *', create: 'Créer', cancel: 'Annuler',
    createGroupTitle: 'Nouveau groupe',
    sendPlaceholder: 'Écrivez...', attach: 'Joindre JPG', imageAttached: 'Image jointe',
    loginRequired: 'Connectez-vous', home: 'Accueil',
    groupCreated: 'Groupe créé', error: 'Échec',
    noMessages: 'Démarrez la conversation', today: "Aujourd'hui", yesterday: 'Hier'
  },
  ru: {
    back: 'Hostaka', title: 'Сообщения', sidebarTitle: 'Сообщения',
    newGroup: 'Новая группа', loading: 'Загрузка...',
    emptyState: 'Выберите чат',
    groups: 'Группы', conversations: 'Чаты', allMembers: 'Все участники',
    noMembers: 'Нет других', startChat: 'Начать чат',
    you: 'Вы', admin: 'Админ', member: 'Участник',
    groupName: 'Название *', create: 'Создать', cancel: 'Отмена',
    createGroupTitle: 'Создать группу',
    sendPlaceholder: 'Напишите...', attach: 'Прикрепить JPG', imageAttached: 'Изображение',
    loginRequired: 'Войдите', home: 'Главная',
    groupCreated: 'Группа создана', error: 'Ошибка',
    noMessages: 'Начните чат', today: 'Сегодня', yesterday: 'Вчера'
  },
  zh: {
    back: 'Hostaka', title: '消息', sidebarTitle: '消息',
    newGroup: '新建群组', loading: '加载中...',
    emptyState: '选择对话',
    groups: '群组', conversations: '对话', allMembers: '所有成员',
    noMembers: '没有其他成员', startChat: '开始聊天',
    you: '你', admin: '管理员', member: '成员',
    groupName: '群组名称 *', create: '创建', cancel: '取消',
    createGroupTitle: '新建群组',
    sendPlaceholder: '输入消息...', attach: '附加图片', imageAttached: '图片已附加',
    loginRequired: '请登录', home: '首页',
    groupCreated: '群组已创建', error: '失败',
    noMessages: '开始对话', today: '今天', yesterday: '昨天'
  },
  ja: {
    back: 'Hostaka', title: 'メッセージ', sidebarTitle: 'メッセージ',
    newGroup: '新規グループ', loading: '読み込み中...',
    emptyState: 'チャットを選択',
    groups: 'グループ', conversations: 'チャット', allMembers: '全メンバー',
    noMembers: '他のメンバーはいません', startChat: 'チャットを開始',
    you: 'あなた', admin: '管理者', member: 'メンバー',
    groupName: 'グループ名 *', create: '作成', cancel: 'キャンセル',
    createGroupTitle: '新規グループ作成',
    sendPlaceholder: 'メッセージを入力...', attach: '画像を添付', imageAttached: '画像を添付しました',
    loginRequired: 'ログインしてください', home: 'ホーム',
    groupCreated: 'グループを作成しました', error: '失敗',
    noMessages: 'チャットを開始', today: '今日', yesterday: '昨日'
  }
};

let currentLang = localStorage.getItem('hostaka_lang') || 'en';
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';

// ============================================================
//  دوال الترجمة والثيم
// ============================================================
function t(key) {
  return LANG[currentLang]?.[key] || LANG['ar'][key] || key;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  document.getElementById('backText').textContent = t('back');
  document.getElementById('topbarTitle').textContent = t('title');
  document.getElementById('sidebarTitle').textContent = t('sidebarTitle');
  document.getElementById('newGroupText').textContent = t('newGroup');
  document.getElementById('loadingUsers').textContent = t('loading');
  document.getElementById('emptyStateText').textContent = t('emptyState');
  document.getElementById('modalGroupTitle').textContent = t('createGroupTitle');
  document.getElementById('modalCancelBtn').textContent = t('cancel');
  document.getElementById('modalCreateBtn').textContent = t('create');
  const cgName = document.getElementById('cgName');
  if (cgName) cgName.placeholder = t('groupName');
  const msgInput = document.getElementById('msgInput');
  if (msgInput) msgInput.placeholder = t('sendPlaceholder');
  // تحديث القائمة الجانبية
  renderSidebar();
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

function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('show');
}
document.addEventListener('click', (e) => {
  if (!document.getElementById('langToggle').contains(e.target)) {
    document.getElementById('langMenu').classList.remove('show');
  }
});

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('hostaka_lang', lang);
  if (window.setHostakaLang) window.setHostakaLang(lang);
  document.getElementById('langMenu').classList.remove('show');
  applyLang();
  renderSidebar();
  if (currentPeer) {
    const peer = allUsers.find(u => u.username === currentPeer);
    if (peer) updateTopbarPeer(peer);
    loadMsgs(currentPeer, false);
  }
}

// ============================================================
//  منطق المحادثة (نسخة قديمة تعمل)
// ============================================================
const getToken = () => localStorage.getItem('hostaka_token') || '';
let ME = null;
let currentPeer = null;
let allUsers = [];
let conversations = [];
let groups = [];
let pollTimer = null;
let msgReactions = {};
let chatImgBase64 = '';

function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
// الخادم يخزّن التوقيت بصيغة UTC بدون معلومات منطقة زمنية (مثل "2026-07-18 10:08:23")
// هذه الدالة تفسّرها بشكل صحيح كـ UTC ثم تترك المتصفح يحوّلها تلقائياً لتوقيت جهاز المستخدم
function toUTCDate(s) {
  if (!s) return new Date(NaN);
  if (s instanceof Date) return s;
  if (typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) {
    return new Date(s.replace(' ', 'T') + 'Z');
  }
  return new Date(s);
}
function fmtTime(s) { if(!s) return ''; return toUTCDate(s).toLocaleTimeString(currentLang === 'ar' ? 'ar' : 'en', {hour:'2-digit',minute:'2-digit'}); }
function fmtDay(s) {
  if(!s) return '';
  const d = toUTCDate(s), now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if(diff === 0) return t('today');
  if(diff === 1) return t('yesterday');
  return d.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {month:'short', day:'numeric'});
}

// ====== API (بدون التحقق من r.ok، كما في القديم) ======
async function apiFetch(url, method = 'GET', body = null) {
  const token = getToken();
  const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (!r.ok) {
    const data = await r.json().catch(() => null);
    if (r.status === 403 && data?.suspended) { handleSuspended(data.reason); return data; }
    throw new Error((data && data.error) || ('HTTP ' + r.status));
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

// ====== SVG ======
const SVG = {
  msg:      `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  user:     `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  group:    `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  send:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  attach:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  close:    `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrow:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  editIc:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  deleteIc: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  flagIc:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
};

// ====== الرياكتشنز ======
const REACTIONS = [
  { emoji:'like',  label:t('reactLike'),  icon:SVG.like },
  { emoji:'heart', label:t('reactLove'),  icon:SVG.heart },
  { emoji:'haha',  label:t('reactHaha'),  icon:SVG.haha },
  { emoji:'sad',   label:t('reactSad'),  icon:SVG.sad },
  { emoji:'angry', label:t('reactAngry'),  icon:SVG.angry },
];

// ============================================================
//  التهيئة
// ============================================================
async function init() {
  // تطبيق الثيم المخزن
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setThemeIcon(THEME_ICON_DARK);
  }

  loadWallpaperState();
  applyWallpaper();
  applyLang();

  const token = getToken();
  if (!token) { showNotLogged(); return; }
  try {
    const r = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!r.ok) { showNotLogged(); return; }
    const u = await r.json();
    if (!u || u.error) { showNotLogged(); return; }
    ME = u;
  } catch (e) { showNotLogged(); return; }

  if (window.HostakaCrypto) window.HostakaCrypto.ensureKeysRegistered();

  await loadSidebar();

  const withUser = new URLSearchParams(location.search).get('with');
  if (withUser) {
    // Small delay to ensure sidebar is rendered
    setTimeout(() => openChat(withUser), 100);
  }
}

function showNotLogged() {
  document.getElementById('chatMain').innerHTML = `<div class="not-logged">${SVG.user}<h2>${t('loginRequired')}</h2><p>${t('loginRequired')}</p><a href="/" class="btn-go">${SVG.arrow}${t('home')}</a></div>`;
  document.getElementById('sidebar').style.display = 'none';
  document.querySelector('.sidebar-toggle').style.display = 'none';
}

function showToast(msg, type = 'success') {
  let toastEl = document.querySelector('.toast');
  if (toastEl) toastEl.remove();
  toastEl = document.createElement('div');
  toastEl.className = 'toast toast-' + type;
  toastEl.textContent = msg;
  document.body.appendChild(toastEl);
  requestAnimationFrame(() => toastEl.classList.add('show'));
  setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => toastEl.remove(), 300); }, 3000);
}

// ============================================================
//  الشريط الجانبي
// ============================================================
async function decryptConversationPreviews(conversations) {
  if (!Array.isArray(conversations) || !conversations.length || !window.HostakaCrypto) return;
  for (const c of conversations) {
    if (Number(c.encrypted) !== 1 || !c.content) continue;
    const peerUsername = c.from_id == ME?.id ? c.to_name : c.from_name;
    try {
      const sharedKey = await window.HostakaCrypto.getSharedKeyFor(peerUsername);
      if (!sharedKey) { c.content = '🔒'; continue; }
      c.content = await window.HostakaCrypto.decryptText(sharedKey, c.content, c.iv);
    } catch (e) {
      c.content = '🔒';
    }
  }
}

async function loadSidebar() {
  try {
    [allUsers, conversations, groups] = await Promise.all([
      apiFetch('/api/users'),
      apiFetch('/api/messages/conversations'),
      apiFetch('/api/groups'),
    ]);
  } catch (e) {
    allUsers = []; conversations = []; groups = [];
  }
  await decryptConversationPreviews(conversations);
  renderSidebar();
}

function renderSidebar() {
  const list = document.getElementById('userList');
  if (!list) return;

  const others = Array.isArray(allUsers) ? allUsers.filter(u => u.username !== ME?.username) : [];
  const convMap = {};
  if (Array.isArray(conversations)) {
    conversations.forEach(c => {
      const peer = c.from_id == ME?.id ? c.to_name : c.from_name;
      convMap[peer] = c;
    });
  }

  let html = '';

  if (Array.isArray(groups) && groups.length) {
    html += `<div class="section-label">${t('groups')}</div>`;
    html += groups.map(g => {
      const av = g.avatar ? `<img src="${esc(g.avatar)}" alt="">` : (g.name || '?').charAt(0).toUpperCase();
      return `<div class="user-item" onclick="window.location='/group?g=${g.id}'">
        <div class="u-av" style="background:linear-gradient(145deg,#566573,#2c3e50);">${av}</div>
        <div class="u-info">
          <div class="u-name">${SVG.group}${esc(g.name)}</div>
          <div class="u-last">${g.my_role === 'admin' ? t('admin') : t('member')}</div>
        </div>
      </div>`;
    }).join('');
  }

  const withConv = others.filter(u => convMap[u.username]);
  if (withConv.length) {
    html += `<div class="section-label">${t('conversations')}</div>`;
    html += withConv.map(u => userItemHtml(u, convMap[u.username])).join('');
  }

  html += `<div class="section-label">${t('allMembers')}</div>`;
  html += others.length ? others.map(u => userItemHtml(u, convMap[u.username] || null)).join('') :
    `<div style="padding:12px 16px;font-size:0.82rem;color:var(--muted);">${t('noMembers')}</div>`;

  list.innerHTML = html;
}

function userItemHtml(u, conv) {
  const av = u.avatar ? `<img src="${esc(u.avatar)}" alt="">` : (u.display_name || u.username || '?').charAt(0).toUpperCase();
  const lastMsg = conv ? (conv.from_id == ME?.id ? t('you') + ': ' : '') + esc((conv.content || '').slice(0, 30)) : t('startChat');
  const active = currentPeer === u.username ? 'active' : '';
  const role = u.role === 'admin' ? `<span class="u-badge">${SVG.like}${t('admin')}</span>` : '';
  return `<div class="user-item ${active}" onclick="openChat('${esc(u.username)}')">
    <div class="u-av">${av}</div>
    <div class="u-info">
      <div class="u-name">${role}${esc(u.display_name || u.username)}</div>
      <div class="u-last">${lastMsg}</div>
    </div>
  </div>`;
}

let currentPeerObj = null;
let currentDmNickname = '';
function updateTopbarPeer(peer) {
  currentPeerObj = peer;
  const av = peer.avatar ? `<img src="${esc(peer.avatar)}" alt="">` : (peer.display_name || peer.username || '?').charAt(0).toUpperCase();
  const role = peer.role === 'admin' ? t('admin') : t('member');
  const shownName = currentDmNickname || peer.display_name || peer.username;
  document.getElementById('topbarTitle').innerHTML = `
    <div class="topbar-peer" onclick="openChatSettings()">
      <div class="topbar-peer-av">${av}</div>
      <div>
        <div class="topbar-peer-name" id="topbarPeerNameEl">${esc(shownName)}</div>
        <div class="topbar-peer-role"><span id="peerStatusDot" class="status-dot"></span><span id="peerStatusText">${role}</span></div>
      </div>
    </div>`;
  currentPeerUsername = peer.username;
  document.getElementById('peerOptsWrap').style.display = 'block';
  checkPeerBlockStatus();
  refreshPeerStatus();
  loadDmNickname();
  loadPeerProfileForReceipts();
  if (peerStatusInterval) clearInterval(peerStatusInterval);
  peerStatusInterval = setInterval(refreshPeerStatus, 25000);
}

let peerReadReceiptsEnabled = true;
let myReadReceiptsEnabled = true;
async function loadPeerProfileForReceipts(){
  if (!currentPeerUsername) return;
  try {
    const p = await apiFetch('/api/profile/' + encodeURIComponent(currentPeerUsername));
    peerReadReceiptsEnabled = p?.read_receipts !== 0;
  } catch(e) { peerReadReceiptsEnabled = true; }
  try {
    const s = await apiFetch('/api/settings/read-receipts');
    myReadReceiptsEnabled = s?.enabled !== false;
  } catch(e) { myReadReceiptsEnabled = true; }
}

async function loadDmNickname(){
  if (!currentPeerUsername) return;
  try {
    const d = await apiFetch('/api/messages/' + encodeURIComponent(currentPeerUsername) + '/nickname');
    currentDmNickname = d?.nickname || '';
    const nameEl = document.getElementById('topbarPeerNameEl');
    if (nameEl && currentPeerObj) nameEl.textContent = currentDmNickname || currentPeerObj.display_name || currentPeerObj.username;
  } catch(e) { currentDmNickname = ''; }
}

let peerStatusInterval = null;
async function refreshPeerStatus(){
  if (!currentPeerUsername) return;
  try {
    const d = await apiFetch('/api/users/' + encodeURIComponent(currentPeerUsername) + '/status');
    const dot = document.getElementById('peerStatusDot');
    const txt = document.getElementById('peerStatusText');
    if (!dot || !txt) return;
    if (d.online) {
      dot.classList.add('online');
      txt.textContent = t('onlineNow');
    } else {
      dot.classList.remove('online');
      txt.textContent = t('lastSeen') + ' ' + fmtRelativeShort(d.last_seen);
    }
  } catch(e) { /* تجاهل */ }
}

function fmtRelativeShort(s){
  const d = toUTCDate(s);
  const diffMin = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  if (diffMin < 60) return diffMin + (currentLang === 'ar' ? ' د' : 'm');
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return diffH + (currentLang === 'ar' ? ' س' : 'h');
  const diffD = Math.round(diffH / 24);
  return diffD + (currentLang === 'ar' ? ' يوم' : 'd');
}

// ----- خيارات المحادثة: الإبلاغ والحظر -----
let currentPeerUsername = null;
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
function openModal(id){ document.getElementById(id).classList.add('show'); }
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
  });
});
function togglePeerOpts(){ document.getElementById('peerOptsMenu')?.classList.toggle('show'); }
document.addEventListener('click', e=>{
  if(!e.target.closest('.peer-opts-wrap') && !e.target.closest('#peerOptsWrap')) document.getElementById('peerOptsMenu')?.classList.remove('show');
});

async function checkPeerBlockStatus(){
  if(!currentPeerUsername) return;
  try{
    const d = await apiFetch('/api/block/status/' + encodeURIComponent(currentPeerUsername));
    const label = d.blocked ? t('unblockUser') : t('blockUser');
    const txt = document.getElementById('peerBlockText');
    if(txt) txt.textContent = label;
    const csTxt = document.getElementById('csBlockText');
    if(csTxt) csTxt.textContent = label;
  }catch(e){}
}

async function togglePeerBlock(){
  document.getElementById('peerOptsMenu')?.classList.remove('show');
  if(!currentPeerUsername) return;
  const txt = document.getElementById('peerBlockText') || document.getElementById('csBlockText');
  const isBlocked = txt && txt.textContent === t('unblockUser');
  try{
    const d = isBlocked
      ? await apiFetch('/api/block/' + encodeURIComponent(currentPeerUsername), 'DELETE')
      : await apiFetch('/api/block/' + encodeURIComponent(currentPeerUsername), 'POST');
    if(d.success){
      showToast(isBlocked ? t('unblocked') : t('blocked'));
      checkPeerBlockStatus();
    } else { showToast(d.error || t('operationFailed'), 'error'); }
  }catch(e){ showToast(t('connectionError'), 'error'); }
}

let reportMode = 'user'; // 'user' | 'message'
let reportMsgTargetId = null;
// ============================================================
//  صفحة إعدادات المحادثة (تظهر عند الضغط على الطرف الآخر)
// ============================================================
function openChatSettings(){
  if (!currentPeerUsername || !currentPeerObj) return;
  const box = document.getElementById('chatSettingsBody');
  if (!box) return;
  const p = currentPeerObj;
  const av = p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : (p.display_name || p.username || '?').charAt(0).toUpperCase();
  box.innerHTML = `
    <div class="cs-head" onclick="viewPeerProfile()">
      <div class="cs-av">${av}</div>
      <div class="cs-headname">${esc(currentDmNickname || p.display_name || p.username)}</div>
      <div class="cs-headuser">@${esc(p.username)}</div>
    </div>
    <div class="cs-nick-row">
      <input class="m-input" id="csNickInput" placeholder="${t('setNicknamePlaceholder')}" value="${esc(currentDmNickname)}">
      <button class="btn-confirm" onclick="saveDmNickname()">${t('save')}</button>
    </div>
    <div class="cs-actions">
      <button onclick="viewPeerProfile()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>${t('viewProfile')}</span></button>
      <button onclick="openConversationMedia()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>${t('viewMedia')}</span></button>
      <label class="cs-toggle-row">
        <span>${t('readReceiptsToggle')}</span>
        <input type="checkbox" id="csReadReceipts" ${myReadReceiptsEnabled ? 'checked' : ''} onchange="toggleMyReadReceipts(this.checked)">
      </label>
      <button onclick="openReportPeerModal()">${SVG.flagIc || ''}<span id="csReportText">${t('reportUser')}</span></button>
      <button class="danger" id="csBlockBtn" onclick="togglePeerBlock()"><span id="csBlockText">${t('blockUser')}</span></button>
      <button class="danger" onclick="deleteConversationConfirm()">${SVG.deleteIc || ''}<span>${t('deleteConversation')}</span></button>
    </div>`;
  openModal('chatSettingsModal');
}
function closeChatSettings(){ closeModal('chatSettingsModal'); }
function viewPeerProfile(){
  if (!currentPeerUsername) return;
  window.location = '/profile?u=' + encodeURIComponent(currentPeerUsername);
}
async function saveDmNickname(){
  const input = document.getElementById('csNickInput');
  if (!input || !currentPeerUsername) return;
  const val = input.value.trim();
  try {
    await apiFetch('/api/messages/' + encodeURIComponent(currentPeerUsername) + '/nickname', 'PUT', { nickname: val });
    currentDmNickname = val;
    const nameEl = document.getElementById('topbarPeerNameEl');
    if (nameEl && currentPeerObj) nameEl.textContent = val || currentPeerObj.display_name || currentPeerObj.username;
    showToast(t('settingsSaved'));
  } catch(e) { showToast(t('error'), 'error'); }
}
async function toggleMyReadReceipts(enabled){
  try {
    await apiFetch('/api/settings/read-receipts', 'PUT', { enabled });
    myReadReceiptsEnabled = enabled;
    if (currentPeer) loadMsgs(currentPeer, false);
  } catch(e) { showToast(t('error'), 'error'); }
}
async function openConversationMedia(){
  if (!currentPeerUsername) return;
  closeModal('chatSettingsModal');
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">${t('loading')}</div>`;
  openModal('mediaViewModal');
  try {
    const items = await apiFetch('/api/messages/' + encodeURIComponent(currentPeerUsername) + '/media');
    renderMediaGrid(items);
  } catch(e) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">${t('error')}</div>`; }
}
function renderMediaGrid(items){
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  if (!items || !items.length){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:30px;">${t('noMedia')}</div>`;
    return;
  }
  grid.innerHTML = items.map(m => `<div class="media-grid-item" onclick="openImgViewer('${esc(m.image)}')"><img src="${esc(m.image)}" loading="lazy"></div>`).join('');
}
async function deleteConversationConfirm(){
  if (!currentPeerUsername) return;
  if (!await hostakaConfirm(t('confirmDeleteConversation'))) return;
  try {
    await apiFetch('/api/messages/' + encodeURIComponent(currentPeerUsername), 'DELETE');
    closeModal('chatSettingsModal');
    showToast(t('conversationDeleted'));
    document.getElementById('chatMain').innerHTML = `<div class="empty-state" id="emptyState"><span>${t('selectChat')}</span></div>`;
    currentPeer = null;
    loadSidebar();
  } catch(e) { showToast(t('error'), 'error'); }
}

function openReportPeerModal(){
  document.getElementById('peerOptsMenu')?.classList.remove('show');
  reportMode = 'user';
  document.getElementById('reportPeerModalTitle').textContent = t('reportUser');
  document.getElementById('reportPeerReason').value = 'abuse';
  document.getElementById('reportPeerDetails').value = '';
  document.getElementById('reportPeerModal').classList.add('show');
}
function openReportMsgModal(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  reportMode = 'message';
  reportMsgTargetId = mid;
  document.getElementById('reportPeerModalTitle').textContent = t('reportMsgTitle');
  document.getElementById('reportPeerReason').value = 'abuse';
  document.getElementById('reportPeerDetails').value = '';
  document.getElementById('reportPeerModal').classList.add('show');
}
async function submitPeerReport(){
  if(!currentPeerUsername) return;
  const reasonType = document.getElementById('reportPeerReason').value;
  const details = document.getElementById('reportPeerDetails').value.trim();
  const labels = { abuse:t('reasonAbuse'), spam:t('reasonSpam'), fake:t('reasonFake'), other:t('reasonOther') };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportPeerBtn');
  btn.disabled = true;
  try{
    const payload = reportMode === 'message'
      ? { type:'message', target_id: reportMsgTargetId, target_owner_username: currentPeerUsername, subject: t('reportMsgTitle'), reason }
      : { type:'user', target_owner_username: currentPeerUsername, subject: t('reportSubjectPrefix',{u:currentPeerUsername}), reason };
    const d = await apiFetch('/api/reports', 'POST', payload);
    if(d.success){ showToast(reportMode === 'message' ? t('reportSent') : t('reportSentShort')); closeModal('reportPeerModal'); }
    else { showToast(d.error || t('sendFail'), 'error'); }
  }catch(e){ showToast(t('connectionError'), 'error'); }
  btn.disabled = false;
}

// ============================================================
//  فتح المحادثة
// ============================================================
async function openChat(username) {
  currentPeer = username;
  if (window.innerWidth <= 680) toggleSidebar(false);
  renderSidebar();

  const peer = allUsers.find(u => u.username === username) || { username };
  updateTopbarPeer(peer);

  // Clear any existing poll timer
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  if (typingPollTimer) { clearInterval(typingPollTimer); typingPollTimer = null; }
  stopTyping();
  dmChatKey = 'dm:' + [ME.username, username].sort().join('|');

  // إنشاء واجهة المحادثة (بها msgsArea)
  document.getElementById('chatMain').innerHTML = `
    <div class="msgs-area" id="msgsArea">
      <div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;">${t('loading')}</div>
    </div>
    <div class="img-preview-bar" id="imgPreviewBar" style="display:none;">
      <img id="imgPreviewThumb" src="" alt="">
      <button class="img-rm-btn" onclick="removeChatImg()">${SVG.close}</button>
      <span style="font-size:0.76rem;color:var(--muted);" id="imgAttachedText">${t('imageAttached')}</span>
    </div>
    <div class="input-area">
      <button class="btn-attach" onclick="document.getElementById('chatImgFile').click()" title="${t('attach')}">${SVG.attach}</button>
      <input type="file" id="chatImgFile" accept=".jpg,.jpeg,image/jpeg" style="display:none;" onchange="onChatImg(event)">
      <textarea class="msg-input" id="msgInput" placeholder="${t('sendPlaceholder')}" rows="1" onkeydown="onKey(event)" oninput="autoResize(this);pingTyping()"></textarea>
      <button class="send-btn" id="sendBtn" onclick="sendMsg()">${SVG.send}</button>
    </div>`;

  // تحميل الرسائل
  await loadMsgs(username);
  // Start polling for new messages
  pollTimer = setInterval(() => {
    if (currentPeer === username) {
      loadMsgs(username, false);
    }
  }, 4000);
  typingPollTimer = setInterval(pollTyping, 2500);
}

// ============================================================
//  مؤشر الكتابة "يكتب..."
// ============================================================
let dmChatKey = null;
let typingPingTimer = null;
let typingPollTimer = null;
let lastTypingPingAt = 0;
let peerIsTyping = false;
function pingTyping(){
  if (!dmChatKey) return;
  const now = Date.now();
  if (now - lastTypingPingAt < 2000) return;
  lastTypingPingAt = now;
  apiFetch('/api/typing', 'POST', { chat_key: dmChatKey }).catch(()=>{});
  if (typingPingTimer) clearTimeout(typingPingTimer);
  typingPingTimer = setTimeout(stopTyping, 4000);
}
function stopTyping(){
  if (typingPingTimer) { clearTimeout(typingPingTimer); typingPingTimer = null; }
  if (dmChatKey) apiFetch('/api/typing', 'POST', { chat_key: dmChatKey, stop: true }).catch(()=>{});
}
async function pollTyping(){
  if (!dmChatKey) return;
  try {
    const d = await apiFetch('/api/typing/' + encodeURIComponent(dmChatKey));
    const typing = Array.isArray(d?.typing) && d.typing.length > 0;
    if (typing !== peerIsTyping) {
      peerIsTyping = typing;
      renderTypingRow(typing);
    }
  } catch(e) { /* تجاهل */ }
}
function renderTypingRow(show){
  const area = document.getElementById('msgsArea');
  if (!area) return;
  let row = document.getElementById('typingRow');
  if (show) {
    if (!row) {
      const av = currentPeerObj?.avatar ? `<img src="${esc(currentPeerObj.avatar)}" alt="">` : (currentPeerObj?.display_name || currentPeerObj?.username || '?').charAt(0).toUpperCase();
      const wasAtBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 40;
      const div = document.createElement('div');
      div.id = 'typingRow';
      div.className = 'typing-row';
      div.innerHTML = `<div class="msg-av">${av}</div><div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
      area.appendChild(div);
      if (wasAtBottom) area.scrollTop = area.scrollHeight;
    }
  } else if (row) {
    row.remove();
  }
}

// ============================================================
//  تحميل وعرض الرسائل (نسخة قديمة تعمل)
// ============================================================
// ============================================================
//  التشفير من طرف لطرف (E2E) — دوال مساعدة لصفحة الدردشة الفردية
//  النطاق: رسائل الدردشة الفردية فقط (وليس رسائل المجموعات).
//  في حال عدم توفر مفتاح الطرف الآخر بعد (مثلاً أول مرة يفتح تطبيقه)،
//  يتم الإرسال كنص عادي كإجراء احتياطي متوافق مع الإصدارات القديمة.
// ============================================================
async function encryptForPeer(peerUsername, plainText) {
  if (!window.HostakaCrypto || !plainText) return { content: plainText, iv: '', encrypted: false };
  try {
    const sharedKey = await window.HostakaCrypto.getSharedKeyFor(peerUsername);
    if (!sharedKey) return { content: plainText, iv: '', encrypted: false };
    const { ciphertext, iv } = await window.HostakaCrypto.encryptText(sharedKey, plainText);
    return { content: ciphertext, iv, encrypted: true };
  } catch (e) {
    console.error('encryptForPeer failed, sending as plaintext:', e);
    return { content: plainText, iv: '', encrypted: false };
  }
}
async function decryptMsgsInPlace(msgs, peerUsername) {
  if (!Array.isArray(msgs) || !msgs.length) return;
  const anyEncrypted = msgs.some(m => Number(m.encrypted) === 1);
  if (!anyEncrypted || !window.HostakaCrypto) return;
  const sharedKey = await window.HostakaCrypto.getSharedKeyFor(peerUsername);
  for (const m of msgs) {
    if (Number(m.encrypted) !== 1 || !m.content) continue;
    if (!sharedKey) { m.content = '🔒 ' + t('cantDecrypt'); continue; }
    try {
      m.content = await window.HostakaCrypto.decryptText(sharedKey, m.content, m.iv);
    } catch (e) {
      m.content = '🔒 ' + t('cantDecrypt');
    }
  }
}

async function loadMsgs(username, scroll = true) {
  const area = document.getElementById('msgsArea');
  try {
    const msgs = await apiFetch('/api/messages/' + encodeURIComponent(username));
    if (!Array.isArray(msgs)) {
      console.error('Expected array, got:', msgs);
      if (area) area.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-left:4px;"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> ' + t('loadMsgsError') + '</div>';
      return;
    }
    await loadMsgReactions(msgs);
    await decryptMsgsInPlace(msgs, username);
    renderMsgs(msgs, scroll);
  } catch (e) {
    console.error('loadMsgs failed:', e);
    if (area) area.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-left:4px;"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> ' + (e.message || t('cantConnectServer')) + '</div>';
  }
}
async function loadMsgReactions(msgs) {
  if (!msgs || !msgs.length) return;
  try {
    const msgIds = msgs.map(m => m.id).join(',');
    const data = await apiFetch('/api/messages/reactions?ids=' + msgIds);
    if (data && typeof data === 'object') {
      Object.assign(msgReactions, data);
    }
  } catch (e) {
    console.log('Reactions endpoint not available, using local state only');
  }
}


function renderMsgs(msgs, scroll = true) {
  const area = document.getElementById('msgsArea');
  if (!area) return;
  lastLoadedMsgs = msgs || [];
  if (!msgs || !msgs.length) {
    area.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;">' + t('noMessages') + '</div>';
    return;
  }
  let html = '', lastDay = '';
  const showReceipts = myReadReceiptsEnabled && peerReadReceiptsEnabled;
  let lastReadMineId = null;
  if (showReceipts) {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].from_id == ME?.id && Number(msgs[i].read) === 1) { lastReadMineId = msgs[i].id; break; }
    }
  }
  msgs.forEach((m, i) => {
    const isMine = m.from_id == ME?.id;
    const day = fmtDay(m.created_at);
    if (day !== lastDay) {
      html += `<div class="date-divider"><span>${day}</span></div>`;
      lastDay = day;
    }
    const next = msgs[i + 1];
    const isLast = !next || next.from_id != m.from_id;
    const av = m.from_avatar ? `<img src="${esc(m.from_avatar)}" alt="">` : (m.from_name || '?').charAt(0).toUpperCase();
    const rc = msgReactions[m.id] || { reactions: [], userReaction: null };
    const totalReacts = rc.reactions && rc.reactions.length ? rc.reactions.reduce((s, r) => s + Number(r.count || 0), 0) : 0;
    const reactionHtml = totalReacts > 0 ?
      `<div class="msg-reaction" onclick="togglePicker(${m.id})">${rc.reactions.map(r => r.icon || r.emoji).join('')} <span style="font-size:0.7rem;color:var(--muted);">${totalReacts}</span></div>` : '';
    const firstUrl = extractFirstUrl(m.content);
    const replySrc = m.reply_to ? msgs.find(x => x.id === m.reply_to) : null;
    const replyQuoteHtml = replySrc ? `<div class="msg-reply-quote">${esc((replySrc.content || (replySrc.image ? '📷 صورة' : '')).slice(0,80))}</div>` : (m.reply_to ? `<div class="msg-reply-quote">${t('reply')}</div>` : '');
    const pickerHtml = `<div class="react-picker" id="picker-${m.id}">
            ${REACTIONS.map(r => `<button class="r-emoji ${rc.userReaction === r.emoji ? 'active' : ''}" onclick="reactMsg(event,${m.id},'${r.emoji}')" title="${r.label}">${r.icon}</button>`).join('')}
            <div class="picker-sep"></div>
            <button class="r-emoji" onclick="startReplyMsg(event, ${m.id})" title="${t('reply')}">${SVG.arrow}</button>
            ${isMine
              ? `<button class="r-emoji" onclick="startEditMsg(event, ${m.id})" title="${t('editMsg')}">${SVG.editIc}</button>
                 <button class="r-emoji" onclick="deleteMsg(event, ${m.id})" title="${t('deleteMsg')}">${SVG.deleteIc}</button>`
              : `<button class="r-emoji" onclick="openReportMsgModal(event, ${m.id})" title="${t('reportMsg')}">${SVG.flagIc}</button>`}
          </div>`;
    html += `<div class="msg-row ${isMine ? 'mine' : 'theirs'}">
      ${!isMine ? `<div class="msg-av ${isLast ? '' : 'invisible'}">${av}</div>` : ''}
      <div class="bubble-wrap">
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
        <div class="msg-time">${fmtTime(m.created_at)}${Number(m.edited) === 1 ? ' · <span class="msg-edited-tag">' + esc(t('msgEdited')) + '</span>' : ''}</div>
        ${(showReceipts && isMine && m.id === lastReadMineId) ? `<div class="seen-receipt" title="${t('seenAt')} ${fmtTime(m.read_at || m.created_at)}"><div class="seen-av">${currentPeerObj?.avatar ? `<img src="${esc(currentPeerObj.avatar)}" alt="">` : (currentPeerObj?.display_name||currentPeerObj?.username||'?').charAt(0).toUpperCase()}</div></div>` : ''}
      </div>
      ${isMine ? `<div class="msg-av ${isLast ? '' : 'invisible'}">${av}</div>` : ''}
    </div>`;
  });
  area.innerHTML = html;
  if (scroll) area.scrollTop = area.scrollHeight;
  loadLinkPreviews(area);
  if (peerIsTyping) renderTypingRow(true);
}

// ============================================================
//  التفاعلات
// ============================================================
function togglePicker(id) {
  const p = document.getElementById('picker-' + id);
  if (!p) return;
  document.querySelectorAll('.react-picker.show').forEach(x => { if (x !== p) x.classList.remove('show'); });
  p.classList.toggle('show');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.bubble')) document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
});

async function reactMsg(e, mid, emoji) {
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  try {
    const d = await apiFetch('/api/messages/react/' + mid, 'POST', { emoji });
    if (d.success) {
      msgReactions[mid] = { reactions: d.reactions || [], userReaction: d.userReaction || null };
      if (currentPeer) await loadMsgs(currentPeer, false);
    }
  } catch (err) {
    console.error('reactMsg failed:', err);
    showToast(t('reactSendFail'), 'error');
  }
}

// ============================================================
//  الصور والإرسال
// ============================================================
function onChatImg(e) {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.match('image/jpeg')) { showToast(t('jpgOnly'), 'error'); return; }
  const r = new FileReader();
  r.onload = ev => {
    chatImgBase64 = ev.target.result;
    document.getElementById('imgPreviewThumb').src = chatImgBase64;
    document.getElementById('imgPreviewBar').style.display = 'flex';
  };
  r.readAsDataURL(f);
  e.target.value = '';
}
function removeChatImg() {
  chatImgBase64 = '';
  document.getElementById('imgPreviewBar').style.display = 'none';
}

let editingMsgId = null;
let replyingToMsgId = null;
let lastLoadedMsgs = [];

function startReplyMsg(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  const src = lastLoadedMsgs.find(x => x.id === mid);
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

function startEditMsg(e, mid){
  e.stopPropagation();
  document.querySelectorAll('.react-picker.show').forEach(p => p.classList.remove('show'));
  const bubble = document.getElementById('bubble-' + mid);
  if (!bubble) return;
  // نجيب نص الرسالة الأصلي من الفقاعة (بدون الوسوم الداخلية الأخرى)
  const clone = bubble.cloneNode(true);
  clone.querySelectorAll('.react-picker, .bubble-img').forEach(el => el.remove());
  const text = clone.textContent.trim();
  editingMsgId = mid;
  const input = document.getElementById('msgInput');
  input.value = text;
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
    const d = await apiFetch('/api/messages/' + mid, 'DELETE');
    if (d.success) { await loadMsgs(currentPeer, false); loadSidebar(); }
    else showToast(d.error || t('error'), 'error');
  } catch(err) { showToast(t('error'), 'error'); }
}

async function sendMsg() {
  const input = document.getElementById('msgInput');
  const content = input?.value.trim() || '';
  if (!content && !chatImgBase64) return;
  stopTyping();

  if (editingMsgId) {
    const mid = editingMsgId;
    input.value = ''; input.style.height = '';
    cancelEditMsg();
    document.getElementById('sendBtn').disabled = true;
    try {
      const enc = await encryptForPeer(currentPeer, content);
      const d = await apiFetch('/api/messages/' + mid, 'PUT', { content: enc.content, iv: enc.iv, encrypted: enc.encrypted });
      if (d.success) await loadMsgs(currentPeer, false);
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
    if (chatImgBase64) {
      const up = await apiFetch('/api/upload', 'POST', { image: chatImgBase64 });
      if (up.url) imageUrl = up.url;
      removeChatImg();
    }
    const replyTo = replyingToMsgId;
    cancelReplyMsg();
    const enc = await encryptForPeer(currentPeer, content);
    await apiFetch('/api/messages/' + encodeURIComponent(currentPeer), 'POST', { content: enc.content, image: imageUrl, reply_to: replyTo, iv: enc.iv, encrypted: enc.encrypted });
    await loadMsgs(currentPeer);
    loadSidebar();
  } catch (e) {
    console.error('sendMsg failed:', e);
    showToast(e.message || t('msgSendFail'), 'error');
  }
  document.getElementById('sendBtn').disabled = false;
}

function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }

// ============================================================
//  الشريط الجانبي في الهاتف
// ============================================================
function toggleSidebar(force) {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = force !== undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  ov.classList.toggle('show', open);
}

// ============================================================
//  إنشاء مجموعة
// ============================================================
async function openCreateGroup() {
  document.getElementById('cgName').value = '';
  document.getElementById('createGroupModal').classList.add('show');
  const others = Array.isArray(allUsers) ? allUsers.filter(u => u.username !== ME?.username) : [];
  document.getElementById('cgMembers').innerHTML = others.map(u => `
    <label class="member-check">
      <input type="checkbox" value="${u.id}">
      <div class="u-av" style="width:28px;height:28px;font-size:0.78rem;flex-shrink:0;">
        ${u.avatar ? `<img src="${esc(u.avatar)}" alt="">` : ((u.display_name || u.username || '?').charAt(0).toUpperCase())}
      </div>
      <span>${esc(u.display_name || u.username)}</span>
    </label>`).join('');
}
function closeCreateGroup() { document.getElementById('createGroupModal').classList.remove('show'); }
document.getElementById('createGroupModal').addEventListener('click', e => { if (e.target === document.getElementById('createGroupModal')) closeCreateGroup(); });

async function createGroup() {
  const name = document.getElementById('cgName').value.trim();
  if (!name) { showToast(t('groupName') + ' ' + t('error'), 'error'); return; }
  const members = [...document.querySelectorAll('#cgMembers input:checked')].map(i => Number(i.value));
  const btn = document.getElementById('createGroupBtn');
  btn.disabled = true;
  btn.textContent = '...';
  const d = await apiFetch('/api/groups', 'POST', { name, members });
  if (d.id) {
    closeCreateGroup();
    showToast(t('groupCreated'));
    window.location = '/group?g=' + d.id;
  } else {
    showToast(d.error || t('error'), 'error');
    btn.disabled = false;
    btn.innerHTML = `<span id="modalCreateBtn">${t('create')}</span>`;
  }
}

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

// ====== بدء التشغيل ======
init();

/* expose top-level functions for inline onclick handlers */
try { window.t = t; } catch(e) {}
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
try { window.getToken = getToken; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.linkifyEscaped = linkifyEscaped; } catch(e) {}
try { window.extractFirstUrl = extractFirstUrl; } catch(e) {}
try { window.fetchLinkPreview = fetchLinkPreview; } catch(e) {}
try { window.linkPreviewCardHtml = linkPreviewCardHtml; } catch(e) {}
try { window.loadLinkPreviews = loadLinkPreviews; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtTime = fmtTime; } catch(e) {}
try { window.fmtDay = fmtDay; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.handleSuspended = handleSuspended; } catch(e) {}
try { window.init = init; } catch(e) {}
try { window.showNotLogged = showNotLogged; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.loadSidebar = loadSidebar; } catch(e) {}
try { window.renderSidebar = renderSidebar; } catch(e) {}
try { window.userItemHtml = userItemHtml; } catch(e) {}
try { window.updateTopbarPeer = updateTopbarPeer; } catch(e) {}
try { window.refreshPeerStatus = refreshPeerStatus; } catch(e) {}
try { window.fmtRelativeShort = fmtRelativeShort; } catch(e) {}
try { window.closeModal = closeModal; } catch(e) {}
try { window.togglePeerOpts = togglePeerOpts; } catch(e) {}
try { window.checkPeerBlockStatus = checkPeerBlockStatus; } catch(e) {}
try { window.togglePeerBlock = togglePeerBlock; } catch(e) {}
try { window.openReportPeerModal = openReportPeerModal; } catch(e) {}
try { window.openReportMsgModal = openReportMsgModal; } catch(e) {}
try { window.submitPeerReport = submitPeerReport; } catch(e) {}
try { window.openChat = openChat; } catch(e) {}
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
try { window.sendMsg = sendMsg; } catch(e) {}
try { window.onKey = onKey; } catch(e) {}
try { window.autoResize = autoResize; } catch(e) {}
try { window.toggleSidebar = toggleSidebar; } catch(e) {}
try { window.openCreateGroup = openCreateGroup; } catch(e) {}
try { window.closeCreateGroup = closeCreateGroup; } catch(e) {}
try { window.createGroup = createGroup; } catch(e) {}
try { window.openImgViewer = openImgViewer; } catch(e) {}
try { window.closeImgViewer = closeImgViewer; } catch(e) {}
try { window.saveViewerImage = saveViewerImage; } catch(e) {}
try { window.openChatSettings = openChatSettings; } catch(e) {}
try { window.closeChatSettings = closeChatSettings; } catch(e) {}
try { window.viewPeerProfile = viewPeerProfile; } catch(e) {}
try { window.saveDmNickname = saveDmNickname; } catch(e) {}
try { window.toggleMyReadReceipts = toggleMyReadReceipts; } catch(e) {}
try { window.openConversationMedia = openConversationMedia; } catch(e) {}
try { window.deleteConversationConfirm = deleteConversationConfirm; } catch(e) {}
try { window.pingTyping = pingTyping; } catch(e) {}
