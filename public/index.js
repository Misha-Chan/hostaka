function reportClientError(context, detail) {
  try {
    fetch('/api/client-error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify({ context, detail: typeof detail === 'string' ? detail : JSON.stringify(detail) }),
    }).catch(() => {});
  } catch (e) {}
}

if(sessionStorage.getItem('hostaka_splash_seen')) document.documentElement.classList.add('splash-seen');

// ============================================================
//  TRANSLATIONS (i18n)
// ============================================================
const LANG = {
  ar: {
    title: 'Hostaka', subtitle: 'منصة تواصل اجتماعي مفتوحة للجميع',
    search: 'ابحث في المنشورات...', newPost: 'منشور جديد', login: 'دخول / تسجيل',
    loginTab: 'دخول', registerTab: 'حساب جديد',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', username: 'اسم المستخدم',
    loginSubmit: 'دخول', registerSubmit: 'إنشاء الحساب',
    admin: 'لوحة الإدارة', profile: 'الملف الشخصي', chat: 'الرسائل', logout: 'تسجيل الخروج',
    loading: 'جارٍ تحميل المنشورات...', empty: 'لا توجد منشورات بعد',
    postModalTitle: 'منشور جديد', attachMedia: 'صورة / فيديو', cancel: 'إلغاء', publish: 'نشر', editPost: 'تعديل المنشور', saveChanges: 'حفظ التعديل', edit: 'تعديل', postEdited: 'تم التعديل',
    react: 'تفاعل', comment: 'تعليق', delete: 'حذف', share: 'مشاركة الرابط', message: 'مراسلة',
    reply: 'أضف تعليقاً...', verified: 'حساب موثق', member: 'Member', adminRole: 'Admin',
    copyLink: 'تم نسخ الرابط', verifyRequest: 'تم إرسال طلب التوثيق', verifyPending: 'طلبك قيد المراجعة',
    deleteConfirm: 'حذف هذا المنشور؟', deleteComment: 'حذف التعليق؟',
    sortLatest: 'الأحدث', sortPopular: 'الأكثر تفاعلاً', sortRandom: 'عشوائي',
    downloadAndroid: 'تحميل تطبيق الأندرويد', fileTooLarge: 'حجم الملف يتجاوز 25 ميغابايت',
    invalidFile: 'يُقبل JPG للصور و MP4 للفيديوهات',
    splashWelcomeTitle: 'أهلاً بك في Hostaka', splashWelcomeSub: 'سجّل دخولك أو أنشئ حسابًا جديدًا للانضمام إلى المجتمع',
    splashLoginBtn: 'تسجيل الدخول', splashRegisterBtn: 'إنشاء حساب جديد', splashSkip: 'تصفّح كزائر',
    splashSubLoggedIn: 'فيه منشورات جديدة بانتظارك', splashContinue: 'متابعة', splashTapHint: 'اضغط في أي مكان للمتابعة',
    reelDetected: 'فيديو عمودي — سيُنشر كريلز', reelTag: 'ريلز', reelsNav: 'الريلز',
    createStory: 'إنشاء قصة', storiesTitle: 'القصص', noStories: 'لا توجد قصص حالياً',
    storyCaptionPh: 'اكتب تعليقاً (اختياري)...', storyPublish: 'نشر القصة',
    storyDeleteConfirm: 'حذف هذه القصة؟', storyExpiresNote: 'تختفي القصة تلقائياً بعد 24 ساعة',
    storyUploadHint: 'اختر صورة أو فيديو للقصة', yourStory: 'قصتك',
    imageTooLarge: 'الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB',
    reactLike:'أعجبني', reactLove:'أحببته', reactHaha:'أضحكني', reactSad:'أحزنني', reactAngry:'أغضبني',
    genericFail:'فشل', cantConnect:'تعذر الاتصال', enter2FACode:'أدخل كود المصادقة', wrongCode:'كود غير صحيح',
    justNow:'الآن', daysAgo:'{n} يوم', defaultUser:'مستخدم',
    mentionedInPost:'{actor} أشار إليك في منشور', mentionedInComment:'{actor} أشار إليك في تعليق', commentedOnPost:'{actor} علّق على منشورك',
    supportReplied:'رد فريق الدعم على بلاغك: {content}', noNotifications:'لا توجد إشعارات', deleteWord:'حذف',
    cantLoadNotifications:'تعذر تحميل الإشعارات', reportPostTitle:'الإبلاغ عن المنشور', reportUserTitle:'الإبلاغ عن مستخدم',
    reasonSpam:'محتوى مزعج / سبام', reasonAbuse:'إساءة أو تنمر', reasonNudity:'محتوى غير لائق', reasonFake:'حساب مزيف أو منتحل', reasonOther:'سبب آخر',
    reportPostSubject:'إبلاغ عن منشور', reportUserSubject:'إبلاغ عن مستخدم', reportSentThanks:'تم إرسال البلاغ، شكراً لك', sendFail:'فشل الإرسال',
    unblockedAt:'تم إلغاء حظر @{u}', blockedAt:'تم حظر @{u}', operationFailed:'فشلت العملية', requestFail:'فشل الطلب',
    pageWord:'صفحة', optionsWord:'خيارات', blockAtUser:'حظر @{u}', copyLinkPrompt:'انسخ الرابط:', myAccount:'حسابي',
    uploadFail:'فشل رفع الملف', videoUploadFail:'فشل رفع الفيديو', editFail:'فشل التعديل', postFail:'فشل النشر', cantDeleteStory:'تعذر حذف القصة',
    unsave:'إلغاء الحفظ', save:'حفظ', reportPostMenu:'الإبلاغ عن المنشور', willPostAsVideo:'سيُنشر في Hostaka Video'
  },
  en: {
    title: 'Hostaka', subtitle: 'An open social platform for everyone',
    search: 'Search posts...', newPost: 'New Post', login: 'Login / Register',
    loginTab: 'Login', registerTab: 'Register',
    email: 'Email', password: 'Password', username: 'Username',
    loginSubmit: 'Login', registerSubmit: 'Create Account',
    admin: 'Dashboard', profile: 'Profile', chat: 'Messages', logout: 'Logout',
    loading: 'Loading posts...', empty: 'No posts yet',
    postModalTitle: 'New Post', attachMedia: 'Image / Video', cancel: 'Cancel', publish: 'Publish', editPost: 'Edit Post', saveChanges: 'Save Changes', edit: 'Edit', postEdited: 'Edited',
    react: 'React', comment: 'Comment', delete: 'Delete', share: 'Share link', message: 'Message',
    reply: 'Add a comment...', verified: 'Verified account', member: 'Member', adminRole: 'Admin',
    copyLink: 'Link copied', verifyRequest: 'Verification request sent', verifyPending: 'Your request is pending',
    deleteConfirm: 'Delete this post?', deleteComment: 'Delete this comment?',
    sortLatest: 'Latest', sortPopular: 'Most Popular', sortRandom: 'Random',
    downloadAndroid: 'Download Android App', fileTooLarge: 'File exceeds 25MB limit',
    invalidFile: 'Only JPG images and MP4 videos are allowed',
    splashWelcomeTitle: 'Welcome to Hostaka', splashWelcomeSub: 'Log in or create a new account to join the community',
    splashLoginBtn: 'Log In', splashRegisterBtn: 'Create Account', splashSkip: 'Browse as guest',
    splashSubLoggedIn: 'New posts are waiting for you', splashContinue: 'Continue', splashTapHint: 'Tap anywhere to continue',
    reelDetected: 'Vertical video — will be posted as a Reel', reelTag: 'Reel', reelsNav: 'Reels',
    createStory: 'Add Story', storiesTitle: 'Stories', noStories: 'No stories yet',
    storyCaptionPh: 'Write a caption (optional)...', storyPublish: 'Post Story',
    storyDeleteConfirm: 'Delete this story?', storyExpiresNote: 'Stories disappear after 24 hours',
    storyUploadHint: 'Choose a photo or video for your story', yourStory: 'Your Story',
    imageTooLarge: 'Image is too large, please choose one smaller than 8MB',
    reactLike:'Like', reactLove:'Love', reactHaha:'Haha', reactSad:'Sad', reactAngry:'Angry',
    genericFail:'Failed', cantConnect:'Could not connect', enter2FACode:'Enter the authentication code', wrongCode:'Incorrect code',
    justNow:'Just now', daysAgo:'{n}d', defaultUser:'User',
    mentionedInPost:'{actor} mentioned you in a post', mentionedInComment:'{actor} mentioned you in a comment', commentedOnPost:'{actor} commented on your post',
    supportReplied:'Support team replied to your report: {content}', noNotifications:'No notifications', deleteWord:'Delete',
    cantLoadNotifications:'Could not load notifications', reportPostTitle:'Report post', reportUserTitle:'Report user',
    reasonSpam:'Spam / unwanted content', reasonAbuse:'Abuse or harassment', reasonNudity:'Inappropriate content', reasonFake:'Fake or impersonation account', reasonOther:'Other reason',
    reportPostSubject:'Report on a post', reportUserSubject:'Report on a user', reportSentThanks:'Report sent, thank you', sendFail:'Failed to send',
    unblockedAt:'Unblocked @{u}', blockedAt:'Blocked @{u}', operationFailed:'Operation failed', requestFail:'Request failed',
    pageWord:'Page', optionsWord:'Options', blockAtUser:'Block @{u}', copyLinkPrompt:'Copy the link:', myAccount:'my account',
    uploadFail:'Failed to upload file', videoUploadFail:'Failed to upload video', editFail:'Edit failed', postFail:'Failed to post', cantDeleteStory:'Could not delete story',
    unsave:'Unsave', save:'Save', reportPostMenu:'Report post', willPostAsVideo:'Will be posted to Hostaka Video'
  },
  fr: {
    title: 'Hostaka', subtitle: 'Une plateforme sociale ouverte à tous',
    search: 'Rechercher...', newPost: 'Nouvelle publication', login: 'Connexion / Inscription',
    loginTab: 'Connexion', registerTab: 'S\'inscrire',
    email: 'Email', password: 'Mot de passe', username: 'Nom d\'utilisateur',
    loginSubmit: 'Se connecter', registerSubmit: 'Créer un compte',
    admin: 'Tableau de bord', profile: 'Profil', chat: 'Messages', logout: 'Déconnexion',
    loading: 'Chargement...', empty: 'Aucune publication',
    postModalTitle: 'Nouvelle publication', attachMedia: 'Image / Vidéo', cancel: 'Annuler', publish: 'Publier',
    react: 'Réagir', comment: 'Commenter', delete: 'Supprimer', share: 'Partager', message: 'Message',
    reply: 'Ajouter un commentaire...', verified: 'Compte vérifié', member: 'Membre', adminRole: 'Admin',
    copyLink: 'Lien copié', verifyRequest: 'Demande envoyée', verifyPending: 'En attente',
    deleteConfirm: 'Supprimer ?', deleteComment: 'Supprimer ce commentaire ?',
    sortLatest: 'Derniers', sortPopular: 'Plus populaires', sortRandom: 'Aléatoire',
    downloadAndroid: 'Télécharger l\'app Android', fileTooLarge: 'Fichier dépasse 25 Mo',
    invalidFile: 'Seules les images JPG et vidéos MP4 sont autorisées',
    splashWelcomeTitle: 'Bienvenue sur Hostaka', splashWelcomeSub: 'Connectez-vous ou créez un compte pour rejoindre la communauté',
    splashLoginBtn: 'Connexion', splashRegisterBtn: 'Créer un compte', splashSkip: 'Parcourir en invité',
    splashSubLoggedIn: 'De nouvelles publications vous attendent', splashContinue: 'Continuer', splashTapHint: 'Touchez n\'importe où pour continuer'
  },
  ru: {
    title: 'Hostaka', subtitle: 'Открытая социальная платформа для всех',
    search: 'Поиск...', newPost: 'Новый пост', login: 'Вход / Регистрация',
    loginTab: 'Вход', registerTab: 'Регистрация',
    email: 'Эл. почта', password: 'Пароль', username: 'Имя пользователя',
    loginSubmit: 'Войти', registerSubmit: 'Создать аккаунт',
    admin: 'Панель', profile: 'Профиль', chat: 'Сообщения', logout: 'Выйти',
    loading: 'Загрузка...', empty: 'Нет постов',
    postModalTitle: 'Новый пост', attachMedia: 'Изображение / Видео', cancel: 'Отмена', publish: 'Опубликовать',
    react: 'Реакция', comment: 'Комментарий', delete: 'Удалить', share: 'Поделиться', message: 'Сообщение',
    reply: 'Добавить комментарий...', verified: 'Верифицирован', member: 'Участник', adminRole: 'Админ',
    copyLink: 'Ссылка скопирована', verifyRequest: 'Запрос отправлен', verifyPending: 'На рассмотрении',
    deleteConfirm: 'Удалить пост?', deleteComment: 'Удалить комментарий?',
    sortLatest: 'Новые', sortPopular: 'Популярные', sortRandom: 'Случайные',
    downloadAndroid: 'Скачать Android-приложение', fileTooLarge: 'Файл превышает 25 МБ',
    invalidFile: 'Разрешены только JPG и MP4',
    splashWelcomeTitle: 'Добро пожаловать в Hostaka', splashWelcomeSub: 'Войдите или создайте новый аккаунт, чтобы присоединиться',
    splashLoginBtn: 'Войти', splashRegisterBtn: 'Создать аккаунт', splashSkip: 'Смотреть как гость',
    splashSubLoggedIn: 'Вас ждут новые посты', splashContinue: 'Продолжить', splashTapHint: 'Нажмите в любом месте, чтобы продолжить'
  },
  zh: {
    title: 'Hostaka', subtitle: '面向所有人的开放社交平台',
    search: '搜索帖子...', newPost: '新帖子', login: '登录 / 注册',
    loginTab: '登录', registerTab: '注册',
    email: '电子邮箱', password: '密码', username: '用户名',
    loginSubmit: '登录', registerSubmit: '创建账户',
    admin: '管理面板', profile: '个人资料', chat: '消息', logout: '退出',
    loading: '加载中...', empty: '暂无帖子',
    postModalTitle: '新帖子', attachMedia: '图片 / 视频', cancel: '取消', publish: '发布',
    react: '反应', comment: '评论', delete: '删除', share: '分享链接', message: '消息',
    reply: '添加评论...', verified: '已验证', member: '成员', adminRole: '管理员',
    copyLink: '链接已复制', verifyRequest: '验证请求已发送', verifyPending: '审核中',
    deleteConfirm: '删除此帖子？', deleteComment: '删除此评论？',
    sortLatest: '最新', sortPopular: '最受欢迎', sortRandom: '随机',
    downloadAndroid: '下载安卓应用', fileTooLarge: '文件超过25MB',
    invalidFile: '仅允许 JPG 图片和 MP4 视频',
    splashWelcomeTitle: '欢迎来到 Hostaka', splashWelcomeSub: '登录或创建新账户以加入社区',
    splashLoginBtn: '登录', splashRegisterBtn: '创建账户', splashSkip: '以访客身份浏览',
    splashSubLoggedIn: '有新帖子在等着你', splashContinue: '继续', splashTapHint: '点击任意位置继续'
  },
  ja: {
    title: 'Hostaka', subtitle: '誰でも参加できるオープンソーシャルプラットフォーム',
    search: '投稿を検索...', newPost: '新規投稿', login: 'ログイン / 登録',
    loginTab: 'ログイン', registerTab: '登録',
    email: 'メールアドレス', password: 'パスワード', username: 'ユーザー名',
    loginSubmit: 'ログイン', registerSubmit: 'アカウント作成',
    admin: '管理パネル', profile: 'プロフィール', chat: 'メッセージ', logout: 'ログアウト',
    loading: '読み込み中...', empty: '投稿はありません',
    postModalTitle: '新規投稿', attachMedia: '画像 / 動画', cancel: 'キャンセル', publish: '投稿する',
    react: 'リアクション', comment: 'コメント', delete: '削除', share: 'リンクを共有', message: 'メッセージ',
    reply: 'コメントを追加...', verified: '認証済み', member: 'メンバー', adminRole: '管理者',
    copyLink: 'リンクをコピーしました', verifyRequest: '認証リクエストを送信しました', verifyPending: '審査中',
    deleteConfirm: 'この投稿を削除しますか？', deleteComment: 'このコメントを削除しますか？',
    sortLatest: '最新', sortPopular: '人気順', sortRandom: 'ランダム',
    downloadAndroid: 'Androidアプリをダウンロード', fileTooLarge: 'ファイルが25MBを超えています',
    invalidFile: 'JPG画像とMP4動画のみ許可されています',
    splashWelcomeTitle: 'Hostakaへようこそ', splashWelcomeSub: 'ログインするか、新しいアカウントを作成してコミュニティに参加しましょう',
    splashLoginBtn: 'ログイン', splashRegisterBtn: 'アカウント作成', splashSkip: 'ゲストとして閲覧',
    splashSubLoggedIn: '新しい投稿があなたを待っています', splashContinue: '続ける', splashTapHint: 'どこかをタップして続ける'
  }
};

// ============================================================
//  SPLASH / WELCOME SCREEN GREETINGS (time-aware, per-user)
// ============================================================
const SPLASH_GREETINGS = {
  ar: {
    night:   ['لسا صاحي يا {name}؟', 'سهران يا {name}؟ الليل طويل', 'نور الليل يا {name}'],
    morning: ['صباح الخير يا {name}', 'يوم جديد يا {name}، جاهز؟', 'صباحك سعيد يا {name}'],
    noon:    ['أهلاً يا {name}', 'وحشتنا يا {name}!', 'شو أخبارك يا {name}؟'],
    evening: ['مساء الخير يا {name}', 'مساك نور يا {name}', 'أهلاً بعودتك يا {name}']
  },
  en: {
    night:   ['Up late, {name}?', 'Still awake, {name}?', 'Burning the midnight oil, {name}?'],
    morning: ['Good morning, {name}', 'New day, {name} — ready?', 'Rise and shine, {name}'],
    noon:    ['Hey there, {name}', 'Good to see you, {name}!', "What's up, {name}?"],
    evening: ['Good evening, {name}', 'Welcome back, {name}', 'Evening, {name}']
  }
};

// أيقونة SVG مرتبطة بفترة اليوم (بديل إيموجي الشمس/القمر)
function splashPeriodIcon(period){
  if (period === 'night')   return SVG.moon;
  if (period === 'morning') return SVG.sun;
  if (period === 'evening') return SVG.sunset;
  return SVG.wave; // noon / منتصف اليوم
}

function pickSplashGreeting(name){
  const pool = SPLASH_GREETINGS[currentLang === 'ar' ? 'ar' : 'en'];
  const h = new Date().getHours();
  let period = 'noon';
  if (h >= 0 && h < 5) period = 'night';
  else if (h >= 5 && h < 12) period = 'morning';
  else if (h >= 12 && h < 17) period = 'noon';
  else if (h >= 17 && h < 21) period = 'evening';
  else period = 'night';
  const arr = pool[period];
  const tmpl = arr[Math.floor(Math.random() * arr.length)];
  return { text: tmpl.replace('{name}', name), icon: splashPeriodIcon(period) };
}

function showSplashLoggedIn(user){
  const avatarEl = document.getElementById('splashAvatar');
  if (avatarEl) avatarEl.innerHTML = user.avatar ? `<img src="${esc(user.avatar)}" alt="">` : esc((user.username||'?').charAt(0).toUpperCase());
  const gEl = document.getElementById('splashGreeting');
  if (gEl) {
    const g = pickSplashGreeting(user.username || '');
    gEl.innerHTML = `<span class="splash-greeting-icon">${g.icon}</span> ${esc(g.text)}`;
  }
  const sEl = document.getElementById('splashSub');
  if (sEl) sEl.textContent = t('splashSubLoggedIn');
  const aEl = document.getElementById('splashActions');
  if (aEl) aEl.innerHTML = `<button class="splash-btn-primary" onclick="dismissSplash()">${t('splashContinue')}</button>`;
  const hEl = document.getElementById('splashHint');
  if (hEl) hEl.textContent = t('splashTapHint');
  const splash = document.getElementById('splashScreen');
  if (splash) splash.addEventListener('click', splashClickToDismiss);
  setTimeout(() => dismissSplash(), 2400);
}

function showSplashGuest(){
  const avatarEl = document.getElementById('splashAvatar');
  if (avatarEl) avatarEl.innerHTML = `<img src="hostaka-icon.png" alt="" onerror="this.parentElement.textContent='H'">`;
  const gEl = document.getElementById('splashGreeting');
  if (gEl) gEl.textContent = t('splashWelcomeTitle');
  const sEl = document.getElementById('splashSub');
  if (sEl) sEl.textContent = t('splashWelcomeSub');
  const aEl = document.getElementById('splashActions');
  if (aEl) aEl.innerHTML = `
    <button class="splash-btn-primary" onclick="splashOpenAuth('login')">${t('splashLoginBtn')}</button>
    <button class="splash-btn-secondary" onclick="splashOpenAuth('register')">${t('splashRegisterBtn')}</button>
  `;
  const hEl = document.getElementById('splashHint');
  if (hEl) hEl.innerHTML = `<button class="splash-skip" onclick="dismissSplash()">${t('splashSkip')}</button>`;
}

function splashOpenAuth(tab){
  dismissSplash();
  location.href = '/login' + (tab === 'register' ? '?tab=register' : '');
}

function splashClickToDismiss(e){
  if (e.target && e.target.id === 'splashScreen') dismissSplash();
}

function dismissSplash(){
  const splash = document.getElementById('splashScreen');
  if (!splash || splash.classList.contains('dismissed')) return;
  splash.classList.add('dismissed');
  try { sessionStorage.setItem('hostaka_splash_seen', '1'); } catch(e){}
}

let currentLang = localStorage.getItem('hostaka_lang') || 'en';
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';
let currentSort = 'latest'; // latest, popular, random

// ============================================================
//  CORE FUNCTIONS
// ============================================================
const TOKEN  = localStorage.getItem('hostaka_token') || '';
const stored = localStorage.getItem('hostaka_user');
let ME = null;
let allPosts = [];
let dropVisible = false;
let postMediaBase64 = '';
let postMediaType = ''; // 'image' or 'video'
let postVideoMeta = { width: 0, height: 0, isReel: false }; // أبعاد الفيديو المختار
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// يقرأ عرض/ارتفاع الفيديو من الملف نفسه (بدون رفع) لتصنيفه ريلز أو فيديو عادي
function readVideoDimensions(file){
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.onloadedmetadata = () => {
      const width = v.videoWidth || 0, height = v.videoHeight || 0;
      URL.revokeObjectURL(url);
      resolve({ width, height, isReel: width > 0 && height > 0 && height > width });
    };
    v.onerror = () => { URL.revokeObjectURL(url); resolve({ width:0, height:0, isReel:false }); };
    v.src = url;
  });
}

try { if(stored) ME = JSON.parse(stored); } catch(e) {}

function t(key) {
  return LANG[currentLang]?.[key] || LANG['ar'][key] || key;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  const setText = (sel, val, byId=true) => {
    const el = byId ? document.getElementById(sel) : document.querySelector(sel);
    if (el) el.textContent = val;
  };
  setText('topbarTitle', t('title'));
  setText('pageTitle', t('title'));
  setText('pageSubtitle', t('subtitle'));
  const si = document.getElementById('searchInput'); if (si) si.placeholder = t('search');
  setText('loginBtnText', t('login'));
  setText('tabLoginBtn', t('loginTab'));
  setText('tabRegisterBtn', t('registerTab'));
  setText('lEmailLabel', t('email'));
  setText('lPassLabel', t('password'));
  setText('loginSubmitText', t('loginSubmit'));
  setText('rUserLabel', t('username'));
  setText('rEmailLabel', t('email'));
  setText('rPassLabel', t('password'));
  setText('registerSubmitText', t('registerSubmit'));
  setText('.drop-admin', t('admin'), false);
  setText('.drop-profile', t('profile'), false);
  setText('.drop-download', t('downloadAndroid'), false);
  setText('.drop-logout', t('logout'), false);
  setText('loadingText', t('loading'));
  if (allPosts.length) renderFeed(allPosts);
  else {
    const feed = document.getElementById('feed');
    if (feed && !feed.querySelector('.post-card')) {
      feed.innerHTML = `<div class="empty">${getEmptySvg()}<br>${t('empty')}</div>`;
    }
  }
}

function getEmptySvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`;
}

const THEME_ICON_DARK = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const THEME_ICON_LIGHT = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

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
  userSetTheme = true;
  localStorage.setItem('hostaka_theme_manual', '1');
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// ============================================================
//  WALLPAPER (خلفية المنصة الشخصية + ثيم متكيّف)
// ============================================================
let wallpaperData = null; // { img, blur, dim, auto }
let userSetTheme = localStorage.getItem('hostaka_theme_manual') === '1';

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
      // ضغط الصورة داخل canvas قبل الحفظ
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
  box.style.backgroundImage = 'none';
  document.getElementById('wallpaperPreviewEmpty').style.display = 'inline';
}

// يحسب متوسط سطوع ولون الصورة لضبط الثيم تلقائيًا (فاتح/داكن + لون أساسي)
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
      // Collect all non-grayish pixels
      const pixels = [];
      for(let i=0;i<data.length;i+=4){
        const pr=data[i], pg=data[i+1], pb=data[i+2];
        const max = Math.max(pr,pg,pb), min = Math.min(pr,pg,pb);
        const saturation = max === 0 ? 0 : (max-min)/max;
        // Skip very dark, very light, and low saturation pixels
        if(saturation > 0.15 && max > 40 && max < 240){
          pixels.push({r:pr, g:pg, b:pb, sat: saturation, brightness: (pr+pg+pb)/3});
        }
      }
      // Sort by saturation (most vibrant first)
      pixels.sort((a,b) => b.sat - a.sat);
      // Primary color: most saturated
      const primaryPixels = pixels.slice(0, Math.max(1, Math.floor(pixels.length * 0.15)));
      for(const p of primaryPixels){ r+=p.r; g+=p.g; b+=p.b; count++; }
      // Secondary color: mid saturation
      const midStart = Math.floor(pixels.length * 0.25);
      const secondaryPixels = pixels.slice(midStart, midStart + Math.max(1, Math.floor(pixels.length * 0.15)));
      for(const p of secondaryPixels){ r2+=p.r; g2+=p.g; b2+=p.b; count2++; }
      // Accent color: bright saturated
      const brightPixels = pixels.filter(p => p.brightness > 120).slice(0, Math.max(1, Math.floor(pixels.length * 0.1)));
      for(const p of brightPixels){ r3+=p.r; g3+=p.g; b3+=p.b; count3++; }

      if(count === 0){ // لا يوجد أي بكسل مشبع بالخلفية — نحسب متوسط كل الصورة
        for(let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
      }
      r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
      r2=count2?Math.round(r2/count2):r; g2=count2?Math.round(g2/count2):g; b2=count2?Math.round(b2/count2):b;
      r3=count3?Math.round(r3/count3):r; g3=count3?Math.round(g3/count3):g; b3=count3?Math.round(b3/count3):b;

      // خلفيات قليلة التشبع (رمادي، دخان، رخام، صور أبيض وأسود...) تنتج لونًا
      // مسطحًا شبه رمادي حتى بعد الحساب أعلاه — نفحص تشبع اللون الناتج فعليًا
      // (وليس فقط "هل وُجد بكسل مشبع أصلاً") ونمزجه مع كهرماني هوستاكا كلما قلّ
      // تشبعه، فتبقى الألوان منسجمة مع هوية الموقع بدل رمادي باهت غير متناسق
      const mixTowardBrand = (rr,gg,bb) => {
        const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
        const sat = mx === 0 ? 0 : (mx-mn)/mx;
        if(sat >= 0.18) return [rr,gg,bb];
        const brandR=201, brandG=152, brandB=107; // #C9986B
        const mix = 0.65 - sat; // كلما قلّ التشبع، زاد مزج اللون المميز
        return [
          Math.round(rr*(1-mix) + brandR*mix),
          Math.round(gg*(1-mix) + brandG*mix),
          Math.round(bb*(1-mix) + brandB*mix)
        ];
      };
      [r,g,b] = mixTowardBrand(r,g,b);
      [r2,g2,b2] = mixTowardBrand(r2,g2,b2);
      [r3,g3,b3] = mixTowardBrand(r3,g3,b3);
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
  const overlay = document.getElementById('wallpaperOverlayEl');

  if(!wallpaperData || !wallpaperData.img){
    html.classList.remove('has-wallpaper');
    html.style.removeProperty('--wallpaper-img');
    html.style.removeProperty('--wallpaper-overlay');
    // Reset to default theme colors when no wallpaper
    html.style.removeProperty('--primary');
    html.style.removeProperty('--primary-h');
    html.style.removeProperty('--primary-light');
    html.style.removeProperty('--primary-mid');
    html.style.removeProperty('--primary-border');
    html.style.removeProperty('--accent');
    html.style.removeProperty('--avatar-gradient');
    bg.style.filter = '';
    return;
  }

  html.classList.add('has-wallpaper');
  html.style.setProperty('--wallpaper-img', `url(${wallpaperData.img})`);
  bg.style.filter = `blur(${wallpaperData.blur ?? 6}px)`;

  const dim = (wallpaperData.dim ?? 35) / 100;
  const darkBase = currentTheme === 'dark' ? '0,0,0' : '0,0,0';
  html.style.setProperty('--wallpaper-overlay', `rgba(${darkBase},${dim})`);

  if(wallpaperData.auto !== false){
    analyzeWallpaperColors(wallpaperData.img, (info) => {
      if(!info) return;
      // ثيم فاتح إن كانت الخلفية فاتحة، داكن إن كانت غامقة — فقط إن لم يتدخل المستخدم يدويًا
      if(!userSetTheme){
        const shouldBeDark = info.brightness < 130;
        if(shouldBeDark && currentTheme !== 'dark'){ setTheme('dark'); }
        else if(!shouldBeDark && currentTheme !== 'light'){ setTheme('light'); }
      }
      // لون تراكب مستمد من الخلفية لإحساس أكثر انسجامًا
      html.style.setProperty('--wallpaper-overlay', `rgba(${info.r},${info.g},${info.b},${dim*0.55})`);

      // ===== NEW: Dynamic theme colors from wallpaper =====
      const isDark = currentTheme === 'dark';
      const baseR = info.r, baseG = info.g, baseB = info.b;
      const secR = info.r2 || baseR, secG = info.g2 || baseG, secB = info.b2 || baseB;
      const accR = info.r3 || baseR, accG = info.g3 || baseG, accB = info.b3 || baseB;

      // Calculate lighter/darker variants
      const lighten = (r,g,b,amt) => {
        return `rgb(${Math.min(255, Math.round(r + (255-r)*amt))}, ${Math.min(255, Math.round(g + (255-g)*amt))}, ${Math.min(255, Math.round(b + (255-b)*amt))})`;
      };
      const darken = (r,g,b,amt) => {
        return `rgb(${Math.round(r*amt)}, ${Math.round(g*amt)}, ${Math.round(b*amt)})`;
      };

      // Primary color (dominant vibrant color)
      const primary = `rgb(${baseR},${baseG},${baseB})`;
      const primaryH = isDark ? lighten(baseR,baseG,baseB,0.3) : darken(baseR,baseG,baseB,0.75);
      const primaryLight = isDark 
        ? `rgba(${baseR},${baseG},${baseB},0.15)` 
        : `rgba(${baseR},${baseG},${baseB},0.08)`;
      const primaryMid = isDark 
        ? `rgba(${baseR},${baseG},${baseB},0.25)` 
        : `rgba(${baseR},${baseG},${baseB},0.15)`;
      const primaryBorder = isDark 
        ? `rgba(${baseR},${baseG},${baseB},0.35)` 
        : `rgba(${baseR},${baseG},${baseB},0.25)`;

      // Accent = bright variant
      const accent = `rgb(${accR},${accG},${accB})`;

      // Avatar gradient from primary to secondary
      const avatarGrad = `linear-gradient(145deg, rgb(${baseR},${baseG},${baseB}), rgb(${secR},${secG},${secB}))`;

      // Apply all dynamic colors
      html.style.setProperty('--primary', primary);
      html.style.setProperty('--primary-h', primaryH);
      html.style.setProperty('--primary-light', primaryLight);
      html.style.setProperty('--primary-mid', primaryMid);
      html.style.setProperty('--primary-border', primaryBorder);
      html.style.setProperty('--accent', accent);
      html.style.setProperty('--avatar-gradient', avatarGrad);

      // Also update mine-bg and mine-border to match
      html.style.setProperty('--mine-bg', isDark 
        ? `rgba(${baseR},${baseG},${baseB},0.12)` 
        : `rgba(${baseR},${baseG},${baseB},0.08)`);
      html.style.setProperty('--mine-border', isDark 
        ? `rgba(${baseR},${baseG},${baseB},0.18)` 
        : `rgba(${baseR},${baseG},${baseB},0.12)`);
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
  if (allPosts.length) renderFeed(allPosts);
}

// ============================================================
//  VERIFIED BADGE (Adaptive)
// ============================================================
function verifiedBadge(){
  return `<span class="badge-verified" title="${t('verified')}"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z" fill="var(--badge-verified-fill)" stroke="var(--badge-verified-fill)" stroke-width="0.5"/><path d="M10.6 16.2l-4.1-4.1 1.4-1.4 2.7 2.7 5.5-5.5 1.4 1.4-6.9 6.9z" fill="var(--badge-verified-check)"/></svg></span>`;
}

// ============================================================
//  SORTING ALGORITHMS
// ============================================================
function sortPosts(posts, mode) {
  const sorted = [...posts];
  switch(mode) {
    case 'latest':
      return sorted.sort((a,b) => toUTCDate(b.created_at) - toUTCDate(a.created_at));
    case 'popular': {
      return sorted.sort((a,b) => {
        const aScore = (a.reactions||[]).reduce((s,r)=>s+(r.count||0),0) + (a.comments||[]).length;
        const bScore = (b.reactions||[]).reduce((s,r)=>s+(r.count||0),0) + (b.comments||[]).length;
        return bScore - aScore;
      });
    }
    case 'random':
      return sorted.sort(() => Math.random() - 0.5);
    default:
      return sorted;
  }
}

// ترتيب عشوائي تلقائي للتغذية، مع أولوية 60% لمنشورات الحسابات التي يتابعها المستخدم
function weightedRandomSort(posts) {
  const followed = [], others = [];
  posts.forEach(p => (p.is_followed_author ? followed : others).push(p));
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

// ============================================================
//  REST OF ORIGINAL SCRIPT (with minor translation adaptations)
// ============================================================
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
// The server stores timestamps in UTC without a timezone; we interpret them as UTC so the browser converts them automatically to the user's local time
function toUTCDate(s){
  if(!s) return new Date(NaN);
  if(s instanceof Date) return s;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ','T')+'Z');
  return new Date(s);
}
function fmtDate(s){ if(!s) return ''; return toUTCDate(s).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {year:'numeric', month:'short', day:'numeric'}); }

// دالة لإزالة الإيموجيات من النص
function stripEmojis(text) {
  // تعبير regex يطابق جميع رموز الإيموجي (Unicode Emoji)
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}

async function apiFetch(url, method='GET', body=null){
  const token = localStorage.getItem('hostaka_token') || '';
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+token} };
  if(body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const data = await r.json();
  if(r.status===403 && data?.suspended) handleSuspended(data.reason);
  return data;
}

async function handleSuspended(reason){
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_role');
  await hostakaAlert(t('suspendedMsg',{reason: reason ? ':\n' + reason : ''}));
  window.location = '/';
}

// SVG Icons
const SVG = {
  like:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  comment: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  delete:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  edit:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  send:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  share:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  chevron: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
  empty:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`,
  reel:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="2.5"/><polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none"/></svg>`,
  plus:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  sun:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  sunset:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
  wave:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  close:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  bookmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  pin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 9l1-5h12l1 5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/></svg>`,
};

const REACTIONS = [
  { emoji:'like',  label:t('reactLike'),  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>` },
  { emoji:'heart', label:t('reactLove'),  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { emoji:'haha',  label:t('reactHaha'),  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
  { emoji:'sad',   label:t('reactSad'),  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
  { emoji:'angry', label:t('reactAngry'),  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>` },
];

// ----- Auth / UI -----
function setLoggedInUI(user){
  ME = user;
  document.getElementById('btnLogin').style.display = 'none';
  document.getElementById('userBadgeWrap').style.display = 'block';
  document.getElementById('dropName').textContent = user.username;
  const el = document.getElementById('userBadgeEl');
  el.innerHTML = user.avatar ? `<img src="${esc(user.avatar)}" alt="">` : user.username.charAt(0).toUpperCase();
  const ab = document.getElementById('adminBtn');
  if(ab) ab.style.display = user.role==='admin' ? 'flex' : 'none';
  checkVerifyStatus();
  loadNotifCount();
  renderStoriesBar();
  saveAccountToSwitcher();
  renderAccountSwitcher();
}

function clearUser(){
  ME = null;
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_role');
  clearOAuthRelay();
  document.getElementById('btnLogin').style.display = 'flex';
  document.getElementById('userBadgeWrap').style.display = 'none';
  document.getElementById('notifWrap').style.display = 'none';
  renderStoriesBar();
  renderAccountSwitcher();
}

// يمسح الجلسة المشتركة عند oauth.hostaka.fun (وسيط التحقق) عشان الخروج
// من حساب هنا ما يخلي نطاق فرعي ثاني يلتقط جلسة قديمة بالغلط. طلب صامت.
function clearOAuthRelay(){
  try {
    fetch('https://oauth.hostaka.fun/api/token', { method: 'DELETE', credentials: 'include' }).catch(() => {});
  } catch (e) {}
}

// ============================================================
//  تبديل الحسابات حسب آخر تسجيلات الدخول من هذا الجهاز
// ============================================================
const ACCOUNTS_KEY = 'hostaka_accounts';
const MAX_SAVED_ACCOUNTS = 5;

function getSavedAccounts(){
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch(e) { return []; }
}
function setSavedAccounts(list){
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

// يحفظ الحساب الحالي (من localStorage) في قائمة آخر الحسابات المستخدمة على هذا الجهاز
function saveAccountToSwitcher(){
  if (!ME || !TOKEN) return;
  let list = getSavedAccounts();
  list = list.filter(a => a.username !== ME.username);
  list.unshift({
    username: ME.username,
    display_name: ME.display_name || ME.username,
    avatar: ME.avatar || '',
    role: ME.role || 'user',
    token: TOKEN,
    last_used: Date.now()
  });
  if (list.length > MAX_SAVED_ACCOUNTS) list = list.slice(0, MAX_SAVED_ACCOUNTS);
  setSavedAccounts(list);
}

function renderAccountSwitcher(){
  const wrap = document.getElementById('accountSwitcher');
  if (!wrap) return;
  const list = getSavedAccounts();
  if (!ME || list.length <= 1) {
    // لا داعي لإظهار المبدّل إذا كان هناك حساب واحد فقط محفوظ أو لا يوجد تسجيل دخول
    wrap.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'flex';
  wrap.innerHTML = list.map(a => {
    const isCurrent = ME && a.username === ME.username;
    const av = a.avatar ? `<img src="${esc(a.avatar)}" alt="">` : esc((a.display_name || a.username || '?').charAt(0).toUpperCase());
    return `<div class="acc-item ${isCurrent?'current':''}" onclick="${isCurrent?'':'switchAccount(\''+esc(a.username)+'\')'}">
      ${!isCurrent ? `<span class="acc-remove" onclick="removeAccountFromSwitcher(event,'${esc(a.username)}')">${SVG.close}</span>` : ''}
      <div class="acc-av">${av}</div>
      <span class="acc-label">${esc(a.display_name || a.username)}</span>
    </div>`;
  }).join('') + `<div class="acc-item acc-add" onclick="location.href='/login'">
      <div class="acc-av">${SVG.plus}</div>
      <span class="acc-label">${t('add')}</span>
    </div>`;
}

function switchAccount(username){
  const list = getSavedAccounts();
  const acc = list.find(a => a.username === username);
  if (!acc) return;
  localStorage.setItem('hostaka_token', acc.token);
  localStorage.setItem('hostaka_role', acc.role || 'user');
  localStorage.setItem('hostaka_user', JSON.stringify({ username: acc.username, display_name: acc.display_name, role: acc.role, avatar: acc.avatar }));
  location.reload();
}

function removeAccountFromSwitcher(e, username){
  e.stopPropagation();
  let list = getSavedAccounts().filter(a => a.username !== username);
  setSavedAccounts(list);
  renderAccountSwitcher();
}

function toggleDrop(){ dropVisible=!dropVisible; document.getElementById('userDrop').classList.toggle('show',dropVisible); }
document.addEventListener('click', e=>{ if(!document.getElementById('userBadgeWrap').contains(e.target)){ document.getElementById('userDrop').classList.remove('show'); dropVisible=false; } });

function openAuth(){ location.href = '/login'; }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-bd').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('show'); }));

function switchTab(t){
  document.querySelectorAll('.tab').forEach((b,i)=>b.classList.toggle('active',(i===0&&t==='login')||(i===1&&t==='register')));
  document.getElementById('tabLogin').classList.toggle('active',t==='login');
  document.getElementById('tabReg').classList.toggle('active',t==='register');
  document.getElementById('tab2FA').classList.remove('active');
  document.querySelector('#authModal .tabs').style.display = 'flex';
}

let pending2FAToken = null;
function show2FAStep(pendingToken){
  pending2FAToken = pendingToken;
  document.querySelector('#authModal .tabs').style.display = 'none';
  document.getElementById('tabLogin').classList.remove('active');
  document.getElementById('tabReg').classList.remove('active');
  document.getElementById('tab2FA').classList.add('active');
  document.getElementById('login2faErr').style.display = 'none';
  document.getElementById('login2faCode').value = '';
  setTimeout(()=>document.getElementById('login2faCode')?.focus(), 150);
}

function showToast(msg, type='success'){
  let t = document.querySelector('.toast');
  if(t) t.remove();
  t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, 3000);
}

function getToken(){ return localStorage.getItem('hostaka_token') || ''; }

// ----- API Calls (Login/Register/Logout) -----
async function doLogin(){
  const email=document.getElementById('lEmail').value.trim(), pass=document.getElementById('lPass').value;
  const errEl=document.getElementById('loginErr'); errEl.style.display='none';
  const btn=document.getElementById('loginBtn'); btn.disabled=true; btn.textContent='...';
  try {
    const d = await apiFetch('/api/login','POST',{email,password:pass});
    if(d.requires2FA){
      show2FAStep(d.pendingToken);
    } else if(d.success){
      localStorage.setItem('hostaka_token',d.token);
      localStorage.setItem('hostaka_role',d.role);
      const u={username:d.username,role:d.role,avatar:d.avatar||''};
      localStorage.setItem('hostaka_user',JSON.stringify(u));
      setLoggedInUI(u);
      closeModal('authModal');
      await loadPosts();
      loadUnread();
    } else { errEl.textContent=d.error||t('genericFail'); errEl.style.display='block'; }
  } catch(e){ errEl.textContent=t('cantConnect'); errEl.style.display='block'; }
  finally { btn.disabled=false; btn.innerHTML=`<span id="loginSubmitText">${t('loginSubmit')}</span>`; }
}

async function submit2FALogin(){
  const code = document.getElementById('login2faCode').value.trim();
  const errEl = document.getElementById('login2faErr'); errEl.style.display='none';
  if(!code){ errEl.textContent=t('enter2FACode'); errEl.style.display='block'; return; }
  const btn = document.getElementById('login2faBtn'); btn.disabled=true;
  try {
    const d = await apiFetch('/api/login/2fa-verify','POST',{ pendingToken: pending2FAToken, code });
    if(d.success){
      localStorage.setItem('hostaka_token',d.token);
      localStorage.setItem('hostaka_role',d.role);
      const u={username:d.username,role:d.role,avatar:d.avatar||''};
      localStorage.setItem('hostaka_user',JSON.stringify(u));
      setLoggedInUI(u);
      closeModal('authModal');
      pending2FAToken = null;
      await loadPosts();
      loadUnread();
    } else { errEl.textContent=d.error||t('wrongCode'); errEl.style.display='block'; }
  } catch(e){ errEl.textContent=t('cantConnect'); errEl.style.display='block'; }
  btn.disabled=false;
}

async function doRegister(){
  const username=document.getElementById('rUser').value.trim(), email=document.getElementById('rEmail').value.trim(), pass=document.getElementById('rPass').value;
  const errEl=document.getElementById('regErr'); errEl.style.display='none';
  const btn=document.getElementById('regBtn'); btn.disabled=true; btn.textContent='...';
  try {
    const d = await apiFetch('/api/register','POST',{username,email,password:pass});
    if(d.success){
      localStorage.setItem('hostaka_token',d.token);
      localStorage.setItem('hostaka_role',d.role);
      const u={username:d.username,role:d.role,avatar:''};
      localStorage.setItem('hostaka_user',JSON.stringify(u));
      setLoggedInUI(u);
      closeModal('authModal');
      await loadPosts();
    } else { errEl.textContent=d.error||t('genericFail'); errEl.style.display='block'; }
  } catch(e){ errEl.textContent=t('cantConnect'); errEl.style.display='block'; }
  finally { btn.disabled=false; btn.innerHTML=`<span id="registerSubmitText">${t('registerSubmit')}</span>`; }
}

async function doLogout(){
  if(getToken()) { try{ await apiFetch('/api/logout','POST'); }catch(e){} }
  clearUser();
  await loadPosts();
}

async function loadUnread(){
  try {
    const d = await apiFetch('/api/messages/unread');
    const el = document.getElementById('chatUnread');
    if(d?.count>0){ el.style.display='flex'; el.textContent = d.count > 9 ? '9+' : d.count; }
    else { el.style.display='none'; }
  } catch(e){}
}

// ----- Notifications -----
let notifDropVisible = false;
let notifCache = [];

function timeAgo(dateStr){
  if(!dateStr) return '';
  const diff = (Date.now() - toUTCDate(dateStr).getTime())/1000;
  if(diff < 60) return t('justNow');
  if(diff < 3600) return Math.floor(diff/60) + ' د';
  if(diff < 86400) return Math.floor(diff/3600) + ' س';
  if(diff < 2592000) return t('daysAgo',{n:Math.floor(diff/86400)});
  return fmtDate(dateStr);
}

function notifMessage(n){
  const actor = `<b>${esc(n.actor_name || t('defaultUser'))}</b>`;
  switch(n.type){
    case 'mention_post':    return t('mentionedInPost',{actor});
    case 'mention_comment':  return t('mentionedInComment',{actor});
    case 'comment':          return t('commentedOnPost',{actor});
    case 'report_reply':     return t('supportReplied',{content:esc(n.content||'')});
    case 'admin':            return `${actor}: ${esc(n.content||'')}`;
    default:                 return `${actor} ${esc(n.content||'')}`;
  }
}

async function loadNotifCount(){
  if(!ME || !getToken()) return;
  try {
    const d = await apiFetch('/api/notifications/unread');
    const el = document.getElementById('notifUnread');
    const wrap = document.getElementById('notifWrap');
    if(wrap) wrap.style.display = 'block';
    if(el){
      if(d?.count>0){ el.style.display='flex'; el.textContent = d.count > 9 ? '9+' : d.count; }
      else { el.style.display='none'; }
    }
  } catch(e){}
}

async function loadNotifications(){
  const list = document.getElementById('notifList');
  try {
    const data = await apiFetch('/api/notifications');
    notifCache = Array.isArray(data) ? data : [];
    if(!notifCache.length){
      list.innerHTML = `<div style="text-align:center;padding:26px 10px;color:var(--muted);font-size:0.82rem;">${t('noNotifications')}</div>`;
      return;
    }
    list.innerHTML = notifCache.map(n => `
      <div class="notif-item ${n.read?'':'unread'}" onclick="onNotifClick(${n.id}, ${n.record_id||'null'}, '${esc(n.link||'')}')">
        <div class="notif-avatar">${n.actor_avatar ? `<img src="${esc(n.actor_avatar)}" alt="">` : esc((n.actor_name||'?').charAt(0).toUpperCase())}</div>
        <div class="notif-body">
          <div class="notif-text">${notifMessage(n)}</div>
          <div class="notif-time">${timeAgo(n.created_at)}</div>
        </div>
        <button class="notif-del" onclick="event.stopPropagation();delNotif(${n.id})" title="${t('deleteWord')}">${SVG.delete}</button>
      </div>
    `).join('');
  } catch(e){
    list.innerHTML = `<div style="text-align:center;padding:26px 10px;color:var(--muted);font-size:0.82rem;">${t('cantLoadNotifications')}</div>`;
  }
}

function toggleNotifDrop(){
  if(!ME){ openAuth(); return; }
  notifDropVisible = !notifDropVisible;
  document.getElementById('notifDrop').classList.toggle('show', notifDropVisible);
  if(notifDropVisible) loadNotifications();
}

document.addEventListener('click', e=>{
  const wrap = document.getElementById('notifWrap');
  if(wrap && !wrap.contains(e.target)){ document.getElementById('notifDrop')?.classList.remove('show'); notifDropVisible=false; }
});

async function markAllNotifRead(){
  try {
    await apiFetch('/api/notifications/read-all', 'PUT');
    notifCache.forEach(n=>n.read=1);
    loadNotifications();
    loadNotifCount();
  } catch(e){}
}

async function delNotif(id){
  try {
    await apiFetch('/api/notifications/'+id, 'DELETE');
    notifCache = notifCache.filter(n=>n.id!==id);
    loadNotifications();
    loadNotifCount();
  } catch(e){}
}

function onNotifClick(id, recordId, link){
  apiFetch('/api/notifications/'+id+'/read', 'PUT').catch(()=>{});
  document.getElementById('notifDrop').classList.remove('show');
  notifDropVisible = false;
  loadNotifCount();
  if(link){ window.location = link; }
  else if(recordId){ window.location = '/?p=' + recordId; }
}

// ----- الإشارة (@) والهاشتاغ (#) -----
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
          a.textContent = cleanUrl;
          a.className = 'post-link';
          a.href = cleanUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          frag.appendChild(a);
          if(trail) frag.appendChild(document.createTextNode(trail));
          last = start + full.length;
          continue;
        }
        const a = document.createElement('a');
        a.textContent = sym + word;
        if(sym === '@'){
          a.className = 'mention-tag';
          a.href = '/profile?u=' + encodeURIComponent(word);
        } else {
          a.className = 'hashtag-tag';
          a.href = 'javascript:void(0)';
          a.onclick = (ev)=>{ ev.preventDefault(); ev.stopPropagation(); filterByHashtag(word); };
        }
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

// ============================================================
//  بطاقة معاينة Open Graph للروابط داخل المنشورات
// ============================================================
function extractFirstUrl(text){
  const m = String(text||'').match(/https?:\/\/[^\s<]+/);
  if(!m) return null;
  return m[0].replace(/[.,!?)\]]+$/, '');
}
const linkPreviewCache = {};
async function fetchLinkPreview(url){
  if(linkPreviewCache[url]) return linkPreviewCache[url];
  try {
    const r = await fetch('/api/link-preview?url=' + encodeURIComponent(url));
    const data = await r.json();
    linkPreviewCache[url] = data;
    return data;
  } catch(e){ return null; }
}
function linkPreviewCardHtml(data){
  if(!data || (!data.title && !data.image)) return '';
  return `<a href="${esc(data.url)}" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    ${data.image ? `<img src="${esc(data.image)}" class="link-preview-img" loading="lazy" onerror="this.remove()">` : ''}
    <div class="link-preview-body">
      ${data.site ? `<div class="link-preview-site">${esc(data.site)}</div>` : ''}
      ${data.title ? `<div class="link-preview-title">${esc(data.title)}</div>` : ''}
      ${data.description ? `<div class="link-preview-desc">${esc(data.description)}</div>` : ''}
    </div>
  </a>`;
}
async function loadLinkPreviews(scope){
  const slots = (scope || document).querySelectorAll('.link-preview-slot[data-lp-url]');
  slots.forEach(async (slot)=>{
    const url = slot.getAttribute('data-lp-url');
    if(!url) return;
    const data = await fetchLinkPreview(url);
    if(!slot.isConnected) return;
    if(data && (data.title || data.image)) slot.innerHTML = linkPreviewCardHtml(data);
    else slot.remove();
  });
}

function filterByHashtag(tag){
  const input = document.getElementById('searchInput');
  input.value = '#' + tag;
  input.dispatchEvent(new Event('input'));
  window.scrollTo({ top: document.getElementById('feed').offsetTop - 120, behavior:'smooth' });
}

// ----- خيارات المنشور: الإبلاغ والحظر -----
let blockedUsernames = new Set();

async function loadBlockedSet(){
  if(!ME || !getToken()) return;
  try {
    const list = await apiFetch('/api/block/list');
    blockedUsernames = new Set((Array.isArray(list)?list:[]).map(u=>u.username));
  } catch(e){}
}

function togglePostOpts(id){
  document.querySelectorAll('.post-opts-menu.show').forEach(el=>{ if(el.id !== 'postOpts-'+id) el.classList.remove('show'); });
  document.getElementById('postOpts-'+id)?.classList.toggle('show');
}
function closePostOpts(id){ document.getElementById('postOpts-'+id)?.classList.remove('show'); }
document.addEventListener('click', e=>{
  if(!e.target.closest('.post-opts-wrap')){
    document.querySelectorAll('.post-opts-menu.show').forEach(el=>el.classList.remove('show'));
  }
});

let reportTarget = { type:'general', id:null, owner:'' };
function openReportModal(type, id, owner){
  if(!ME){ openAuth(); return; }
  reportTarget = { type, id, owner };
  document.getElementById('reportModalTitle').textContent = type==='post' ? t('reportPostTitle') : t('reportUserTitle');
  document.getElementById('reportReason').value = 'spam';
  document.getElementById('reportDetails').value = '';
  document.getElementById('reportModal').classList.add('show');
}
async function submitReport(){
  const reasonType = document.getElementById('reportReason').value;
  const details = document.getElementById('reportDetails').value.trim();
  const labels = { spam:t('reasonSpam'), abuse:t('reasonAbuse'), nudity:t('reasonNudity'), fake:t('reasonFake'), other:t('reasonOther') };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportSubmitBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/reports', 'POST', {
      type: reportTarget.type, target_id: reportTarget.id,
      target_owner_username: reportTarget.owner,
      subject: reportTarget.type==='post' ? t('reportPostSubject') : t('reportUserSubject'),
      reason
    });
    if(d.success){ showToast(t('reportSentThanks')); closeModal('reportModal'); }
    else { showToast(d.error||t('sendFail'),'error'); }
  } catch(e){ showToast(t('cantConnect'),'error'); }
  btn.disabled = false;
}

async function toggleBlockUser(username){
  if(!ME){ openAuth(); return; }
  const isBlocked = blockedUsernames.has(username);
  try {
    const d = isBlocked
      ? await apiFetch('/api/block/'+encodeURIComponent(username), 'DELETE')
      : await apiFetch('/api/block/'+encodeURIComponent(username), 'POST');
    if(d.success){
      if(isBlocked){ blockedUsernames.delete(username); showToast(t('unblockedAt',{u:username})); }
      else { blockedUsernames.add(username); showToast(t('blockedAt',{u:username})); }
      loadPosts();
    } else { showToast(d.error||t('operationFailed'),'error'); }
  } catch(e){ showToast(t('cantConnect'),'error'); }
}

async function checkVerifyStatus(){
  if(!ME || !getToken()) return;
  try {
    const d = await apiFetch('/api/verify/status');
    const btn = document.getElementById('verifyBtn');
    if(!btn) return;
    if(d.verified){
      btn.style.display='none';
    } else if(d.status==='pending'){
      btn.style.display='flex';
      btn.title = t('verifyPending');
      btn.style.opacity='0.5';
      btn.onclick=()=>showToast(t('verifyPending'));
    } else {
      btn.style.display='flex';
      btn.title = t('verifyRequest');
      btn.style.opacity='1';
      btn.onclick=requestVerify;
    }
  } catch(e){}
}

async function requestVerify(){
  if(!ME){ openAuth(); return; }
  try {
    const d = await apiFetch('/api/verify/request','POST');
    if(d.success){
      showToast(t('verifyRequest'));
      checkVerifyStatus();
    } else {
      showToast(d.error||t('requestFail'), 'error');
    }
  } catch(e){ showToast(t('cantConnect'),'error'); }
}

// ----- Posts & Feed -----
let feedOrder = [];
let feedVisibleCount = 10;
const FEED_PAGE_SIZE = 10;

async function loadPosts(){
  try {
    const data = await apiFetch('/api/records');
    allPosts = (Array.isArray(data) ? data : []).filter(p => !blockedUsernames.has(p.publisher));
    feedOrder = weightedRandomSort(allPosts);
    feedVisibleCount = FEED_PAGE_SIZE;
    renderFeed(feedOrder.slice(0, feedVisibleCount));
  } catch(e){ document.getElementById('feed').innerHTML='<div class="empty">'+SVG.empty+'<br>'+t('empty')+'</div>'; }
}

function loadMoreFeed(){
  feedVisibleCount += FEED_PAGE_SIZE;
  renderFeed(feedOrder.slice(0, feedVisibleCount));
}

function renderFeedDone(){ loadLinkPreviews(document.getElementById('feed')); }
function renderFeed(posts){
  const feed = document.getElementById('feed');
  if(!posts.length){ feed.innerHTML='<div class="empty">'+SVG.empty+'<br>'+t('empty')+'</div>'; return; }
  let html = posts.map(p => renderPost(p)).join('');
  if (feedOrder.length > posts.length) {
    html += `<button class="load-more-btn" onclick="loadMoreFeed()">${t('loadMorePosts')}</button>`;
  }
  feed.innerHTML = html;
  renderFeedDone();
}

function renderPost(p){
  const name       = p.publisher_name || p.publisher || '?';
  const avatarHtml = p.user_avatar ? `<img src="${esc(p.user_avatar)}" alt="">` : esc(name.charAt(0).toUpperCase());
  const badgeCls   = p.user_role==='Admin' ? 'badge-admin' : 'badge-member';
  const canDel     = ME && (ME.role==='admin' || p.user_id==ME?.id);
  
  // عرض الوسائط (صورة أو فيديو) - استخدام الكلاس المعدل
  let mediaHtml = '';
  if (p.video && Number(p.is_reel) === 1) {
    // فيديو عمودي (ريلز) - يُعرض بنسبة عمودية وينقر لفتحه بطريقة الشورتس في /short
    mediaHtml = `<div class="reel-card" onclick="location.href='/short?id=${p.id}'">
      <video class="reel-thumb-video" muted playsinline preload="metadata"><source src="${esc(p.video)}#t=0.1" type="video/mp4"></video>
      <div class="reel-play-badge">${SVG.reel}</div>
      <div class="reel-tag">${t('reelTag')}</div>
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
      <span>${totalReactions||t('react')}</span>
    </button>
    <div class="react-menu" id="rmenu-${p.id}">
      ${REACTIONS.map(r=>`<button class="react-emoji-btn ${p.userReaction===r.emoji?'active':''}" onclick="toggleReact(${p.id},'${r.emoji}')" title="${r.label}">${r.icon}</button>`).join('')}
    </div>
  </div>`;

  const commCount = (p.comments||[]).length;
  const allComments = p.comments || [];
  const topComments = allComments.filter(c => !c.parent_id);
  function repliesOf(cid){ return allComments.filter(c => Number(c.parent_id) === Number(cid)); }
  function oneCommentHtml(c, postId){
    const ca = c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : esc((c.display_name||c.username||'?').charAt(0).toUpperCase());
    const cBadge = c.user_role==='Admin' ? `<span class="role-badge badge-admin">${t('adminRole')}</span>` : '';
    const canDelC = ME && (ME.role==='admin' || c.user_id==ME?.id);
    const cleanContent = linkifyContent(esc(c.content));
    const replies = repliesOf(c.id);
    const repliesHtml = replies.length ? `<div class="replies-list">${replies.map(r=>oneCommentHtml(r, postId)).join('')}</div>` : '';
    return `<div class="comment" id="cmt-${c.id}">
      <div class="c-avatar">${ca}</div>
      <div class="c-bubble">
        <div class="c-name">${esc(c.display_name||c.username)} ${cBadge}
          ${ME ? `<button class="reply-btn" onclick="toggleReplyInput(${postId},${c.id})">${t('reply')}</button>` : ''}
          ${canDelC?`<button class="c-del" onclick="delComment(${c.id},${postId})">${SVG.delete}</button>`:''}
        </div>
        <div class="c-text">${cleanContent}</div>
      </div>
    </div>
    <div class="reply-input-row" id="replyRow-${c.id}" style="display:none;">
      <input class="comment-input" type="text" placeholder="${t('reply')} @${esc(c.username||'')}" id="ri-${c.id}" onkeydown="if(event.key==='Enter')sendComment(${postId},${c.id})">
      <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ri-${c.id}" title="Emoji"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');

  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="${t('reply')}" id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
    <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ci-${p.id}" title="Emoji"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
    <button class="btn-send-comment" onclick="sendComment(${p.id})">${SVG.send}</button>
  </div>` : '';

  return `<div class="post-card" id="post-${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="pub-row">
        <div class="pub-info">
          <div class="pub-avatar" onclick="goPublisher('${p.page_username?esc(p.page_username):esc(p.publisher)}', ${p.page_id?'true':'false'})">${avatarHtml}</div>
          <div class="pub-meta">
            <div class="pub-name" onclick="goPublisher('${p.page_username?esc(p.page_username):esc(p.publisher)}', ${p.page_id?'true':'false'})">
              <span class="role-badge ${badgeCls}">${p.user_role==='Admin' ? t('adminRole') : (p.user_role==='Page' ? t('pageWord') : t('member'))}</span>
              ${esc(name)}
              ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            </div>
            <div class="pub-date">${fmtDate(p.created_at)}${Number(p.edited)===1 ? ' · <span style="opacity:0.7;">'+esc(t('postEdited'))+'</span>' : ''}</div>
          </div>
        </div>
        <div class="pub-actions">
          ${ME ? `<button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSavePost(${p.id})" title="${p.is_saved?t('unsave'):t('save')}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>` : ''}
          <button class="btn-icon" onclick="sharePost(${p.id})" title="${t('share')}">${SVG.share}</button>
          ${ME && p.user_id && p.user_id!=ME?.id ? `<button class="btn-icon" onclick="location.href='/chat?with=${esc(p.publisher)}'" title="${t('message')}">${SVG.comment}</button>` : ''}
          ${canDel ? `<button class="btn-icon" onclick="delPost(${p.id})" title="${t('delete')}">${SVG.delete}</button>` : ''}
          ${ME && p.user_id && p.user_id!=ME?.id ? `
          <div class="post-opts-wrap">
            <button class="btn-icon" onclick="togglePostOpts(${p.id})" title="${t('optionsWord')}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="post-opts-menu" id="postOpts-${p.id}">
              <button onclick="openReportModal('post', ${p.id}, '${esc(p.publisher)}'); closePostOpts(${p.id});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                ${t('reportPostMenu')}
              </button>
              <button class="danger" onclick="toggleBlockUser('${esc(p.publisher)}'); closePostOpts(${p.id});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                ${t('blockAtUser',{u:esc(p.publisher)})}
              </button>
            </div>
          </div>` : ''}
        </div>
      </div>
      <div class="post-text post-html">${linkifyContent(p.content)}</div>
      ${extractFirstUrl(p.content) ? `<div class="link-preview-slot" data-lp-url="${esc(extractFirstUrl(p.content))}"></div>` : ''}
      <div class="reactions-row">
        ${reactionHtml}
        <button class="react-btn" onclick="toggleComments(${p.id})" id="cmtToggle-${p.id}">
          ${SVG.comment}<span>${commCount} ${t('comment')}</span>
        </button>
      </div>
      <div class="comments-section" id="cmtSec-${p.id}" style="display:none;">
        <div class="comments-list" id="cmtList-${p.id}">${commentsHtml}</div>
        ${commentInputHtml}
      </div>
    </div>
  </div>`;
}

function goProfile(username){ window.location = '/profile?u=' + encodeURIComponent(username); }
function goPublisher(username, isPage){
  window.location = (isPage ? '/page?u=' : '/profile?u=') + encodeURIComponent(username);
}

async function sharePost(id){
  const url = window.location.origin + '/post?id=' + id;
  if(navigator.clipboard){ navigator.clipboard.writeText(url).then(()=>showToast(t('copyLink'))); }
  else { await hostakaPrompt(t('copyLinkPrompt'),url); }
}

document.getElementById('searchInput').addEventListener('input', function(){
  const q = this.value.trim().toLowerCase();
  const filtered = q ? allPosts.filter(p=>p.content.toLowerCase().includes(q)||p.publisher.toLowerCase().includes(q)) : allPosts;
  const sorted = q ? filtered : feedOrder.slice(0, feedVisibleCount);
  renderFeed(sorted);
});

// ----- Post Editor & Media Upload -----
function openPostModal(){
  if(!ME){openAuth();return;}
  editingPostId = null;
  const ed=document.getElementById('postEditor');
  if(ed) ed.innerHTML='';
  document.getElementById('postErr').style.display='none';
  document.getElementById('postMediaPreviewWrap').style.display='none';
  document.getElementById('newPostModalTitle').textContent = t('newPost');
  document.getElementById('publishBtn').textContent = t('publish');
  postMediaBase64='';
  postMediaType='';
  postMediaFileObj=null;
  loadPostAsOptions();
  document.getElementById('postModal').classList.add('show');
  setTimeout(()=>document.getElementById('postEditor')?.focus(),100);
  const emojiBtn = document.getElementById('postEmojiBtn');
  if (emojiBtn && !emojiBtn._femojiWired && window.EmojiFluent) {
    emojiBtn._femojiWired = true;
    EmojiFluent.attachButton(emojiBtn, document.getElementById('postEditor'));
  }
}

let myPagesCache = null;
async function loadPostAsOptions(){
  const wrap = document.getElementById('postAsWrap');
  const sel = document.getElementById('postAsSelect');
  wrap.style.display = 'none';
  try {
    if (myPagesCache === null) myPagesCache = await apiFetch('/api/pages/mine');
    if (!Array.isArray(myPagesCache) || !myPagesCache.length) return;
    sel.innerHTML = `<option value="">${esc(ME.display_name || ME.username)} (${t('myAccount')})</option>` +
      myPagesCache.map(pg => `<option value="${pg.id}">${esc(pg.name)}</option>`).join('');
    wrap.style.display = 'block';
  } catch(e) { /* تجاهل */ }
}

let postMediaFileObj = null; // نحتفظ بملف الفيديو الأصلي لرفعه مباشرة لاحقاً

function onPostMedia(e){
  const f = e.target.files[0];
  if (!f) return;
  
  // التحقق من الحجم
  if (f.size > MAX_FILE_SIZE) {
    showToast(t('fileTooLarge'), 'error');
    e.target.value = '';
    return;
  }

  const isImage = f.type === 'image/jpeg' || f.type === 'image/jpg';
  const isVideo = f.type.startsWith('video/') && (f.type === 'video/mp4' || f.type === 'video/webm');
  
  if (!isImage && !isVideo) {
    showToast(t('invalidFile'), 'error');
    e.target.value = '';
    return;
  }

  postMediaType = isImage ? 'image' : 'video';
  postMediaFileObj = isVideo ? f : null;
  postVideoMeta = { width:0, height:0, isReel:false };
  const reader = new FileReader();
  reader.onload = async ev => {
    postMediaBase64 = ev.target.result;
    const preview = document.getElementById('postMediaPreview');
    if (isImage) {
      preview.innerHTML = `<img src="${postMediaBase64}" alt="${t('imagePreviewAlt')}">`;
    } else {
      postVideoMeta = await readVideoDimensions(f);
      const reelTag = postVideoMeta.isReel ? `<div class="reel-detect-badge">${SVG.reel} <span>${t('reelDetected')}</span></div>` : `<div class="reel-detect-badge">${SVG.reel} <span>${t('willPostAsVideo')}</span></div>`;
      preview.innerHTML = `<video controls style="max-height:200px;width:100%;"><source src="${postMediaBase64}" type="${f.type}"></video>${reelTag}`;
    }
    document.getElementById('postMediaPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(f);
  e.target.value = '';
}

function removePostMedia(){
  postMediaBase64 = '';
  postMediaType = '';
  postMediaFileObj = null;
  postVideoMeta = { width:0, height:0, isReel:false };
  document.getElementById('postMediaPreviewWrap').style.display = 'none';
}

function fmt(cmd){ document.execCommand(cmd, false, null); document.getElementById('postEditor')?.focus(); }
function fmtBlock(tag){
  const sel = window.getSelection();
  if(!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const el = document.createElement(tag);
  el.appendChild(range.extractContents());
  range.insertNode(el);
  document.getElementById('postEditor')?.focus();
}
function fmtList(type){
  document.execCommand(type==='ul'?'insertUnorderedList':'insertOrderedList', false, null);
  document.getElementById('postEditor')?.focus();
}
function fmtLine(){ document.execCommand('insertHorizontalRule', false, null); document.getElementById('postEditor')?.focus(); }
function fmtQuote(){
  const sel = window.getSelection();
  if(!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const bq = document.createElement('blockquote');
  bq.appendChild(range.extractContents());
  range.insertNode(bq);
  document.getElementById('postEditor')?.focus();
}

async function submitPost(){
  const editor = document.getElementById('postEditor');
  const content = editor?.innerHTML?.trim();
  const errEl = document.getElementById('postErr'); errEl.style.display='none';
  if((!content || content==='<br>') && !postMediaBase64){ errEl.textContent=t('contentOrFileRequired'); errEl.style.display='block'; return; }
  const btn=document.getElementById('postBtn'); btn.disabled=true; btn.textContent='...';
  try {
    let imageUrl='', videoUrl='';
    if(postMediaType === 'image' && postMediaBase64){
      const up = await apiFetch('/api/upload', 'POST', { image: postMediaBase64 });
      if (up.url) {
        imageUrl = up.url;
      } else {
        errEl.textContent = up.error || t('uploadFail');
        errEl.style.display='block';
        btn.disabled=false; btn.innerHTML=`<span id="publishBtn">${t('publish')}</span>`;
        return;
      }
    } else if (postMediaType === 'video' && postMediaFileObj) {
      try {
        // 1) نجيب توقيع رفع مؤقت (signature) من السيرفر عندنا
        const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
        if (!sig.signature) throw new Error(sig.error || t('cantPrepVideoUpload'));

        // 2) نرفع الفيديو مباشرة من المتصفح إلى Cloudinary (بدون المرور
        //    عبر سيرفرلس فنكشن عندنا، تفادياً لحد Vercel على حجم الطلب)
        const fd = new FormData();
        fd.append('file', postMediaFileObj);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', sig.timestamp);
        fd.append('folder', sig.folder);
        fd.append('signature', sig.signature);
        const vRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`, {
          method: 'POST',
          body: fd,
        });
        const vData = await vRes.json();
        if (!vRes.ok || !vData.secure_url) {
          console.error('Cloudinary video upload failed:', vData.error);
          reportClientError('cloudinary_video_upload', vData.error);
          throw new Error(t('videoUploadFail'));
        }
        videoUrl = vData.secure_url;
      } catch (upErr) {
        errEl.textContent = t('videoUploadFail');
        errEl.style.display='block';
        btn.disabled=false; btn.innerHTML=`<span id="publishBtn">${t('publish')}</span>`;
        return;
      }
    }
    if (editingPostId) {
      const d = await apiFetch('/api/records/' + editingPostId, 'PUT', {
        content: content || '',
        image: postMediaType === 'image' ? imageUrl : undefined
      });
      if (d.success) {
        closeModal('postModal');
        editingPostId = null;
        await loadPosts();
      } else { errEl.textContent = d.error || t('editFail'); errEl.style.display = 'block'; }
      btn.disabled = false; btn.innerHTML = `<span id="publishBtn">${t('publish')}</span>`;
      return;
    }
    const d = await apiFetch('/api/records','POST',{
      content: content || '',
      image: imageUrl,
      video: videoUrl,
      media_type: postMediaType,
      video_width: postVideoMeta.width || 0,
      video_height: postVideoMeta.height || 0,
      page_id: document.getElementById('postAsSelect')?.value || null
    });
    if(d.success){ closeModal('postModal'); await loadPosts(); }
    else { errEl.textContent=d.error||t('postFail'); errEl.style.display='block'; }
  } catch(e){ errEl.textContent=t('cantConnect'); errEl.style.display='block'; }
  finally { btn.disabled=false; btn.innerHTML=`<span id="publishBtn">${t('publish')}</span>`; }
}

let editingPostId = null;
function openEditPost(id){
  const p = allPosts.find(x => x.id === id);
  if (!p) return;
  editingPostId = id;
  const ed = document.getElementById('postEditor');
  if (ed) ed.innerHTML = p.content || '';
  document.getElementById('postErr').style.display = 'none';
  postMediaBase64 = ''; postMediaFileObj = null;
  postMediaType = p.image ? 'image' : '';
  const preview = document.getElementById('postMediaPreviewWrap');
  if (p.image) {
    document.getElementById('postMediaPreview').innerHTML = `<img src="${esc(p.image)}" alt="">`;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
  document.getElementById('newPostModalTitle').textContent = t('editPost');
  document.getElementById('publishBtn').textContent = t('saveChanges');
  document.getElementById('postModal').classList.add('show');
}

async function delPost(id){
  if(!await hostakaConfirm(t('deleteConfirm'))) return;
  await apiFetch('/api/records/'+id,'DELETE');
  allPosts=allPosts.filter(p=>p.id!==id);
  document.getElementById('post-'+id)?.remove();
}

async function toggleSavePost(id){
  if(!ME){ openAuth(); return; }
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const post = allPosts.find(p=>p.id===id);
  if(post) post.is_saved = d.saved;
  const btn = document.querySelector(`#post-${id} .save-btn`);
  if(btn){
    btn.classList.toggle('saved', d.saved);
    btn.innerHTML = d.saved ? SVG.bookmarkFilled : SVG.bookmark;
    btn.title = d.saved ? t('unsave') : t('save');
  }
  showToast(d.saved ? t('postSaved') : t('postUnsaved'));
}

// ============================================================
//  STORIES (القصص - تختفي تلقائياً بعد 24 ساعة)
// ============================================================
let storiesData = [];     // كما وصلت من السيرفر (مجموعة لكل مستخدم)
let storyViewOrder = [];  // ترتيب العرض الفعلي في العارض (قصتي أولاً ثم البقية)
let currentGroupIdx = 0;
let storySlideIndex = 0;
let storyTimer = null;

async function loadStories(){
  try {
    const data = await apiFetch('/api/stories');
    storiesData = Array.isArray(data) ? data : [];
    renderStoriesBar();
  } catch(e) { /* تجاهل بصمت إن فشل التحميل */ }
}

function storyItemHtml(g, isMine){
  const label = isMine ? t('yourStory') : (g.display_name || g.username || '?');
  const avatarHtml = g.avatar ? `<img src="${esc(g.avatar)}" alt="">` : esc((label).charAt(0).toUpperCase());
  const plusBadge = isMine ? `<span class="story-plus" onclick="event.stopPropagation();openStoryCreate()">${SVG.plus}</span>` : '';
  return `<div class="story-item" onclick="openStoryViewer(${g.user_id})">
    <div class="story-ring ${g.allViewed ? 'seen' : ''}">
      <div class="story-avatar" style="position:relative;">${avatarHtml}${plusBadge}</div>
    </div>
    <span class="story-label">${esc(label)}</span>
  </div>`;
}

function renderStoriesBar(){
  const rail = document.getElementById('storiesRail');
  const track = document.getElementById('storiesTrack');
  if (!rail || !track) return;
  let html = '';
  storyViewOrder = [];

  if (ME) {
    const mine = storiesData.find(g => Number(g.user_id) === Number(ME.id));
    if (mine) {
      storyViewOrder.push(mine);
      html += storyItemHtml(mine, true);
    } else {
      html += `<div class="story-item" onclick="openStoryCreate()">
        <div class="story-ring story-ring-create">
          <div class="story-avatar story-avatar-create">
            ${ME.avatar ? `<img src="${esc(ME.avatar)}" alt="">` : esc((ME.username||'?').charAt(0).toUpperCase())}
            <span class="story-plus">${SVG.plus}</span>
          </div>
        </div>
        <span class="story-label">${esc(t('createStory'))}</span>
      </div>`;
    }
  }

  storiesData.forEach(g => {
    if (ME && Number(g.user_id) === Number(ME.id)) return;
    storyViewOrder.push(g);
    html += storyItemHtml(g, false);
  });

  track.innerHTML = html;
  rail.style.display = html ? '' : 'none';
}

function fmtStoryTime(s){
  const d = toUTCDate(s);
  const diffMin = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  if (diffMin < 60) return diffMin + (currentLang === 'ar' ? ' د' : 'm');
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return diffH + (currentLang === 'ar' ? ' س' : 'h');
  return fmtDate(s);
}

// ----- إنشاء قصة -----
let storyMediaBase64 = '';
let storyMediaType = '';
let storyMediaFileObj = null;

function openStoryCreate(){
  if (!ME) { openAuth(); return; }
  storyMediaBase64 = ''; storyMediaType = ''; storyMediaFileObj = null;
  document.getElementById('storyErr').style.display = 'none';
  document.getElementById('storyCaptionInput').value = '';
  const preview = document.getElementById('storyMediaPreview');
  preview.style.display = 'none'; preview.innerHTML = '';
  const ph = document.getElementById('storyUploadPlaceholder');
  ph.style.display = 'flex';
  ph.innerHTML = `${SVG.plus}<span>${esc(t('storyUploadHint'))}</span>`;
  document.getElementById('storyCreateModal').classList.add('show');
}

function onStoryMedia(e){
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > MAX_FILE_SIZE) { showToast(t('fileTooLarge'), 'error'); e.target.value=''; return; }
  const isImage = f.type === 'image/jpeg' || f.type === 'image/jpg' || f.type === 'image/png';
  const isVideo = f.type.startsWith('video/') && (f.type === 'video/mp4' || f.type === 'video/webm');
  if (!isImage && !isVideo) { showToast(t('invalidFile'), 'error'); e.target.value=''; return; }
  storyMediaType = isImage ? 'image' : 'video';
  storyMediaFileObj = isVideo ? f : null;
  const reader = new FileReader();
  reader.onload = ev => {
    storyMediaBase64 = ev.target.result;
    document.getElementById('storyUploadPlaceholder').style.display = 'none';
    const prev = document.getElementById('storyMediaPreview');
    prev.style.display = 'flex';
    prev.innerHTML = isImage
      ? `<img src="${storyMediaBase64}" alt="">`
      : `<video src="${storyMediaBase64}" controls muted></video>`;
  };
  reader.readAsDataURL(f);
  e.target.value = '';
}

async function submitStory(){
  const errEl = document.getElementById('storyErr'); errEl.style.display = 'none';
  if (!storyMediaBase64) { errEl.textContent = t('storyUploadHint'); errEl.style.display = 'block'; return; }
  const btn = document.getElementById('storyPublishBtn'); btn.disabled = true;
  try {
    let mediaUrl = '';
    if (storyMediaType === 'image') {
      const up = await apiFetch('/api/upload', 'POST', { image: storyMediaBase64 });
      if (!up.url) throw new Error(up.error || t('uploadFail'));
      mediaUrl = up.url;
    } else {
      const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
      if (!sig.signature) throw new Error(sig.error || t('cantPrepVideoUpload'));
      const fd = new FormData();
      fd.append('file', storyMediaFileObj);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', sig.timestamp);
      fd.append('folder', sig.folder);
      fd.append('signature', sig.signature);
      const vRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`, { method:'POST', body: fd });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.secure_url) { console.error('Cloudinary video upload failed:', vData.error);
          reportClientError('cloudinary_video_upload', vData.error); throw new Error(t('videoUploadFail')); }
      mediaUrl = vData.secure_url;
    }
    const caption = document.getElementById('storyCaptionInput').value.trim();
    const d = await apiFetch('/api/stories', 'POST', { media: mediaUrl, media_type: storyMediaType, caption });
    if (d.success) { closeModal('storyCreateModal'); await loadStories(); showToast(t('storyPublish')); }
    else { errEl.textContent = d.error || t('postFail'); errEl.style.display = 'block'; }
  } catch(e) { errEl.textContent = e.message || t('cantConnect'); errEl.style.display = 'block'; }
  finally { btn.disabled = false; }
}

// ----- عارض القصص -----
function openStoryViewer(userId){
  const idx = storyViewOrder.findIndex(g => g.user_id === userId);
  if (idx === -1) return;
  currentGroupIdx = idx;
  storySlideIndex = 0;
  document.getElementById('storyViewer').classList.add('show');
  showStorySlide();
}

function currentStoryGroup(){ return storyViewOrder[currentGroupIdx]; }

function showStorySlide(){
  clearTimeout(storyTimer);
  const group = currentStoryGroup();
  if (!group) { closeStoryViewer(); return; }
  const story = group.stories[storySlideIndex];
  if (!story) {
    if (currentGroupIdx < storyViewOrder.length - 1) { currentGroupIdx++; storySlideIndex = 0; showStorySlide(); }
    else closeStoryViewer();
    return;
  }

  document.getElementById('storyViewerAvatar').innerHTML = group.avatar
    ? `<img src="${esc(group.avatar)}" alt="">`
    : esc((group.display_name || group.username || '?').charAt(0).toUpperCase());
  document.getElementById('storyViewerName').textContent = group.display_name || group.username;
  document.getElementById('storyViewerTime').textContent = fmtStoryTime(story.created_at);
  document.getElementById('storyViewerCaption').textContent = story.caption || '';
  document.getElementById('storyViewerDelete').style.display = (ME && Number(ME.id) === Number(group.user_id)) ? 'flex' : 'none';

  const wrap = document.getElementById('storyProgressWrap');
  wrap.innerHTML = group.stories.map((s,i) =>
    `<div class="story-progress-bar ${i < storySlideIndex ? 'done' : ''}"><div class="story-progress-fill" id="spf-${i}"></div></div>`
  ).join('');

  const mediaEl = document.getElementById('storyViewerMedia');
  if (story.media_type === 'video') {
    mediaEl.innerHTML = `<video id="storyVideoEl" src="${esc(story.media)}" autoplay playsinline></video>`;
    const v = document.getElementById('storyVideoEl');
    v.onloadedmetadata = () => animateStoryProgress(Math.min((v.duration || 5) * 1000, 60000));
    v.onended = () => advanceStory();
  } else {
    mediaEl.innerHTML = `<img src="${esc(story.media)}" alt="">`;
    animateStoryProgress(5000);
  }

  if (ME) { apiFetch('/api/stories/' + story.id + '/view', 'POST').catch(()=>{}); story.viewed = true; }
}

function animateStoryProgress(duration){
  const fill = document.getElementById('spf-' + storySlideIndex);
  if (fill) {
    fill.style.transition = 'none'; fill.style.width = '0%';
    requestAnimationFrame(() => { fill.style.transition = 'width ' + duration + 'ms linear'; fill.style.width = '100%'; });
  }
  storyTimer = setTimeout(advanceStory, duration);
}

function advanceStory(){ storySlideIndex++; showStorySlide(); }
function nextStory(){ clearTimeout(storyTimer); advanceStory(); }
function prevStory(){
  clearTimeout(storyTimer);
  if (storySlideIndex > 0) { storySlideIndex--; showStorySlide(); }
  else if (currentGroupIdx > 0) { currentGroupIdx--; storySlideIndex = Math.max(0, currentStoryGroup().stories.length - 1); showStorySlide(); }
  else showStorySlide();
}

function closeStoryViewer(){
  clearTimeout(storyTimer);
  document.getElementById('storyViewer').classList.remove('show');
  document.getElementById('storyViewerMedia').innerHTML = '';
  renderStoriesBar();
}

async function deleteCurrentStory(){
  clearTimeout(storyTimer); // أوقف التقدم التلقائي فوراً لمنع تسابق يفسد الحذف
  const group = currentStoryGroup();
  const story = group?.stories[storySlideIndex];
  if (!story) return;
  if (!await hostakaConfirm(t('storyDeleteConfirm'))) { showStorySlide(); return; } // نعيد المؤقت إذا ألغى المستخدم
  const targetStoryId = story.id;
  const targetUserId = group.user_id;
  try {
    const d = await apiFetch('/api/stories/' + targetStoryId, 'DELETE');
    if (d && d.error) { showToast(d.error, 'error'); showStorySlide(); return; }
  } catch(e) { showToast(t('cantDeleteStory'), 'error'); showStorySlide(); return; }

  // نعيد إيجاد المجموعة/الفهرس بالاعتماد على المعرّفات لا الفهارس (تحسباً لأي تغيير أثناء الانتظار)
  const gIdx = storyViewOrder.findIndex(g => g.user_id === targetUserId);
  if (gIdx === -1) { closeStoryViewer(); return; }
  const g = storyViewOrder[gIdx];
  const sIdx = g.stories.findIndex(s => s.id === targetStoryId);
  if (sIdx !== -1) g.stories.splice(sIdx, 1);
  storiesData = storiesData.filter(sg => sg.user_id !== g.user_id || g.stories.length > 0);

  if (!g.stories.length) {
    storyViewOrder.splice(gIdx, 1);
    currentGroupIdx = Math.min(gIdx, storyViewOrder.length - 1);
    storySlideIndex = 0;
    if (!storyViewOrder.length) { closeStoryViewer(); return; }
    showStorySlide();
  } else {
    currentGroupIdx = gIdx;
    storySlideIndex = Math.min(sIdx, g.stories.length - 1);
    showStorySlide();
  }
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('storyViewer')?.classList.contains('show')) return;
  if (e.key === 'Escape') closeStoryViewer();
  else if (e.key === 'ArrowLeft') (currentLang === 'ar' ? nextStory() : prevStory());
  else if (e.key === 'ArrowRight') (currentLang === 'ar' ? prevStory() : nextStory());
});

function toggleReactMenu(postId){
  if(!ME){openAuth();return;}
  const menu = document.getElementById('rmenu-'+postId);
  if(!menu) return;
  document.querySelectorAll('.react-menu.show').forEach(m=>{ if(m!==menu) m.classList.remove('show'); });
  menu.classList.toggle('show');
}
document.addEventListener('click', e=>{
  if(!e.target.closest('.react-wrap')) document.querySelectorAll('.react-menu.show').forEach(m=>m.classList.remove('show'));
});

async function toggleReact(postId, emoji){
  if(!ME){openAuth();return;}
  document.querySelectorAll('.react-menu.show').forEach(m=>m.classList.remove('show'));
  const d=await apiFetch('/api/records/'+postId+'/react','POST',{emoji});
  if(!d.success) return;
  const post=allPosts.find(p=>p.id===postId);
  if(post){ post.reactions=d.reactions; post.userReaction=d.userReaction; }
  const card=document.getElementById('post-'+postId);
  if(card){ const newCard=document.createElement('div'); newCard.innerHTML=renderPost(post); card.replaceWith(newCard.firstChild); }
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
  if(!ME){openAuth();return;}
  const input = parentId ? document.getElementById('ri-'+parentId) : document.getElementById('ci-'+postId);
  if(!input||!input.value.trim()) return;
  const content=input.value.trim(); input.value='';
  const d=await apiFetch('/api/records/'+postId+'/comments','POST',{content, parent_id: parentId||null});
  if(!d.success) return;
  const comments=await apiFetch('/api/records/'+postId+'/comments');
  const post=allPosts.find(p=>p.id===postId);
  if(post){ post.comments=comments; }
  const card=document.getElementById('post-'+postId);
  if(card){ const newCard=document.createElement('div'); newCard.innerHTML=renderPost(post); card.replaceWith(newCard.firstChild); document.getElementById('cmtSec-'+postId).style.display='block'; document.getElementById('cmtToggle-'+postId)?.classList.add('expanded'); }
}

async function delComment(commentId, postId){
  if(!await hostakaConfirm(t('deleteComment'))) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

// ============================================================
//  INIT
// ============================================================
(async function init() {
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setThemeIcon(THEME_ICON_DARK);
  }

  loadWallpaperState();
  applyWallpaper();

  window.addEventListener('scroll',()=>{
    document.getElementById('topbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  applyLang();

  if (TOKEN) {
    try {
      const r = await fetch('/api/auth/me', { headers:{'Authorization':'Bearer '+TOKEN} });
      if (r.ok) {
        const u = await r.json();
        if (u && !u.error) {
          ME = { username: u.username, role: u.role, avatar: u.avatar||'', id: u.id };
          localStorage.setItem('hostaka_user', JSON.stringify(ME));
          setLoggedInUI(ME);
          fetch('/api/me', { headers:{'Authorization':'Bearer '+TOKEN} })
            .then(r=>r.ok?r.json():null)
            .then(full=>{ if(full&&!full.error&&full.avatar){ ME.avatar=full.avatar; setLoggedInUI(ME); } })
            .catch(()=>{});
        } else {
          localStorage.removeItem('hostaka_token');
          localStorage.removeItem('hostaka_user');
          ME = null;
        }
      }
    } catch(e) { if (ME) setLoggedInUI(ME); }
  }

  if (!document.documentElement.classList.contains('splash-seen')) {
    if (ME) showSplashLoggedIn(ME); else showSplashGuest();
  }

  if (ME && TOKEN) await loadBlockedSet();
  await loadPosts();
  loadStories();
  if (ME && TOKEN) {
    loadUnread();
    loadNotifCount();
    setInterval(()=>{ loadUnread(); loadNotifCount(); }, 30000);
  }

  const urlPostId = new URLSearchParams(location.search).get('p');
  if(urlPostId){
    setTimeout(()=>{
      const el=document.getElementById('post-'+urlPostId);
      if(el){ el.scrollIntoView({behavior:'smooth',block:'center'}); el.style.border='1px solid var(--primary)'; setTimeout(()=>el.style.border='',4000); }
    },700);
  }

  document.getElementById('lPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  document.getElementById('lEmail').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
})();

/* expose top-level functions for inline onclick handlers */
try { window.splashPeriodIcon = splashPeriodIcon; } catch(e) {}
try { window.pickSplashGreeting = pickSplashGreeting; } catch(e) {}
try { window.showSplashLoggedIn = showSplashLoggedIn; } catch(e) {}
try { window.showSplashGuest = showSplashGuest; } catch(e) {}
try { window.splashOpenAuth = splashOpenAuth; } catch(e) {}
try { window.splashClickToDismiss = splashClickToDismiss; } catch(e) {}
try { window.dismissSplash = dismissSplash; } catch(e) {}
try { window.readVideoDimensions = readVideoDimensions; } catch(e) {}
try { window.t = t; } catch(e) {}
try { window.applyLang = applyLang; } catch(e) {}
try { window.getEmptySvg = getEmptySvg; } catch(e) {}
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
try { window.verifiedBadge = verifiedBadge; } catch(e) {}
try { window.sortPosts = sortPosts; } catch(e) {}
try { window.setSort = setSort; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.stripEmojis = stripEmojis; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.handleSuspended = handleSuspended; } catch(e) {}
try { window.setLoggedInUI = setLoggedInUI; } catch(e) {}
try { window.clearUser = clearUser; } catch(e) {}
try { window.getSavedAccounts = getSavedAccounts; } catch(e) {}
try { window.setSavedAccounts = setSavedAccounts; } catch(e) {}
try { window.saveAccountToSwitcher = saveAccountToSwitcher; } catch(e) {}
try { window.renderAccountSwitcher = renderAccountSwitcher; } catch(e) {}
try { window.switchAccount = switchAccount; } catch(e) {}
try { window.removeAccountFromSwitcher = removeAccountFromSwitcher; } catch(e) {}
try { window.toggleDrop = toggleDrop; } catch(e) {}
try { window.openAuth = openAuth; } catch(e) {}
try { window.closeModal = closeModal; } catch(e) {}
try { window.switchTab = switchTab; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.getToken = getToken; } catch(e) {}
try { window.doLogin = doLogin; } catch(e) {}
try { window.submit2FALogin = submit2FALogin; } catch(e) {}
try { window.show2FAStep = show2FAStep; } catch(e) {}
try { window.doRegister = doRegister; } catch(e) {}
try { window.doLogout = doLogout; } catch(e) {}
try { window.loadUnread = loadUnread; } catch(e) {}
try { window.timeAgo = timeAgo; } catch(e) {}
try { window.notifMessage = notifMessage; } catch(e) {}
try { window.loadNotifCount = loadNotifCount; } catch(e) {}
try { window.loadNotifications = loadNotifications; } catch(e) {}
try { window.toggleNotifDrop = toggleNotifDrop; } catch(e) {}
try { window.markAllNotifRead = markAllNotifRead; } catch(e) {}
try { window.delNotif = delNotif; } catch(e) {}
try { window.onNotifClick = onNotifClick; } catch(e) {}
try { window.linkifyContent = linkifyContent; } catch(e) {}
try { window.extractFirstUrl = extractFirstUrl; } catch(e) {}
try { window.fetchLinkPreview = fetchLinkPreview; } catch(e) {}
try { window.linkPreviewCardHtml = linkPreviewCardHtml; } catch(e) {}
try { window.loadLinkPreviews = loadLinkPreviews; } catch(e) {}
try { window.filterByHashtag = filterByHashtag; } catch(e) {}
try { window.loadBlockedSet = loadBlockedSet; } catch(e) {}
try { window.togglePostOpts = togglePostOpts; } catch(e) {}
try { window.closePostOpts = closePostOpts; } catch(e) {}
try { window.openReportModal = openReportModal; } catch(e) {}
try { window.submitReport = submitReport; } catch(e) {}
try { window.toggleBlockUser = toggleBlockUser; } catch(e) {}
try { window.checkVerifyStatus = checkVerifyStatus; } catch(e) {}
try { window.requestVerify = requestVerify; } catch(e) {}
try { window.loadPosts = loadPosts; } catch(e) {}
try { window.renderFeedDone = renderFeedDone; } catch(e) {}
try { window.renderFeed = renderFeed; } catch(e) {}
try { window.renderPost = renderPost; } catch(e) {}
try { window.goProfile = goProfile; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.sharePost = sharePost; } catch(e) {}
try { window.openPostModal = openPostModal; } catch(e) {}
try { window.loadPostAsOptions = loadPostAsOptions; } catch(e) {}
try { window.onPostMedia = onPostMedia; } catch(e) {}
try { window.removePostMedia = removePostMedia; } catch(e) {}
try { window.fmt = fmt; } catch(e) {}
try { window.fmtBlock = fmtBlock; } catch(e) {}
try { window.fmtList = fmtList; } catch(e) {}
try { window.fmtLine = fmtLine; } catch(e) {}
try { window.fmtQuote = fmtQuote; } catch(e) {}
try { window.submitPost = submitPost; } catch(e) {}
try { window.openEditPost = openEditPost; } catch(e) {}
try { window.delPost = delPost; } catch(e) {}
try { window.toggleSavePost = toggleSavePost; } catch(e) {}
try { window.loadStories = loadStories; } catch(e) {}
try { window.storyItemHtml = storyItemHtml; } catch(e) {}
try { window.renderStoriesBar = renderStoriesBar; } catch(e) {}
try { window.fmtStoryTime = fmtStoryTime; } catch(e) {}
try { window.openStoryCreate = openStoryCreate; } catch(e) {}
try { window.onStoryMedia = onStoryMedia; } catch(e) {}
try { window.submitStory = submitStory; } catch(e) {}
try { window.openStoryViewer = openStoryViewer; } catch(e) {}
try { window.currentStoryGroup = currentStoryGroup; } catch(e) {}
try { window.showStorySlide = showStorySlide; } catch(e) {}
try { window.animateStoryProgress = animateStoryProgress; } catch(e) {}
try { window.advanceStory = advanceStory; } catch(e) {}
try { window.nextStory = nextStory; } catch(e) {}
try { window.prevStory = prevStory; } catch(e) {}
try { window.closeStoryViewer = closeStoryViewer; } catch(e) {}
try { window.deleteCurrentStory = deleteCurrentStory; } catch(e) {}
try { window.toggleReactMenu = toggleReactMenu; } catch(e) {}
try { window.toggleReact = toggleReact; } catch(e) {}
try { window.toggleComments = toggleComments; } catch(e) {}
try { window.sendComment = sendComment; } catch(e) {}
try { window.toggleReplyInput = toggleReplyInput; } catch(e) {}
try { window.delComment = delComment; } catch(e) {}
