function reportClientError(context, detail) {
  try {
    fetch('/api/client-error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify({ context, detail: typeof detail === 'string' ? detail : JSON.stringify(detail) }),
    }).catch(() => {});
  } catch (e) {}
}

window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

// ============================================================
//  TRANSLATIONS (i18n)
// ============================================================
const LANG = {
  ar: {
    back: 'رجوع', profile: 'الملف الشخصي', editProfile: 'تعديل الملف',
    posts: 'المنشورات', edit: 'تعديل الملف', gameId: 'معرّف اللعبة',
    bio: 'نبذة شخصية', save: 'حفظ التغييرات', changeCover: 'تغيير الغلاف',
    changeAvatar: 'تغيير الصورة', member: 'عضو', admin: 'مدير',
    since: 'منذ', noPosts: 'لا توجد منشورات بعد', notFound: 'المستخدم غير موجود',
    pleaseLogin: 'يجب تسجيل الدخول لعرض ملفك الشخصي',
    home: 'الرئيسية', shareLink: 'مشاركة الرابط', linkCopied: 'تم نسخ الرابط',
    saveSuccess: 'تم الحفظ بنجاح', saveError: 'فشل الحفظ',
    connectionError: 'تعذر الاتصال', coverJpg: 'يُقبل JPG/JPEG فقط للغلاف',
    followers: 'متابعون', following: 'يتابع', follow: 'متابعة', unfollow: 'إلغاء المتابعة',
    followError: 'حدث خطأ أثناء المتابعة', followersList: 'المتابعون', followingList: 'المتابَعين',
    noFollowers: 'لا يوجد متابعون', noFollowing: 'لا يتابع أحداً',
    privacy: 'الخصوصية', pages: 'الصفحات', newPost: 'منشور جديد',
    verified: 'حساب موثق', options: 'خيارات', reportUser: 'الإبلاغ عن المستخدم',
    blockUser: 'حظر المستخدم', unblockUser: 'إلغاء حظر المستخدم', privateBadge: 'خاص',
    privateAccountBody: 'هذا الحساب خاص. تابعه عشان تقدر تشوف منشوراته',
    unblockedToast: 'تم إلغاء حظر @{u}', blockedToast: 'تم حظر @{u}',
    operationFailed: 'فشلت العملية', message: 'مراسلة',
    suspendedMsg: 'تم تعليق حسابك من قبل الإدارة{reason}\nللاستفسار يرجى التواصل مع الدعم عبر صفحة /support',
    reactLike: 'أعجبني', reactLove: 'أحببته', reactHaha: 'أضحكني', reactSad: 'أحزنني', reactAngry: 'أغضبني',
    reportReasonAbuse: 'إساءة أو تنمر', reportReasonFake: 'حساب مزيف أو منتحل', reportReasonSpam: 'محتوى مزعج / سبام', reportReasonOther: 'سبب آخر',
    reportSubjectPrefix: 'إبلاغ عن مستخدم @{u}', reportSent: 'تم إرسال البلاغ، شكراً لك', sendFail: 'فشل الإرسال',
    countryLabel: 'الدولة', countryPlaceholder: 'مثال: السعودية', schoolLabel: 'المدرسة/الجامعة', optionalPlaceholder: 'اختياري',
    songLabel: 'الأغنية المفضلة', certLabel: 'الشهادات', privateAccountTitle: 'حساب خاص',
    privateAccountHint: 'لو فعّلته، ما يقدر يشوف منشوراتك إلا متابعينك فقط', whoCanMessage: 'مين يقدر يراسلني؟',
    everyone: 'الجميع', followersOnly: 'المتابعون فقط', noOne: 'لا أحد', closeFriendsLabel: 'الأصدقاء المقربون',
    closeFriendsHint: 'قائمة خاصة تقدر تنشر لها منشورات "أصدقاء مقربون فقط"', manageListBtn: 'إدارة القائمة ({count})',
    createPageChannel: 'إنشاء صفحة/قناة جديدة', loading: 'جارٍ التحميل...', accountNowPrivate: 'صار حسابك خاص',
    accountNowPublic: 'صار حسابك عام', cantSave: 'تعذر الحفظ', msgSettingsUpdated: 'تم تحديث إعدادات المراسلة',
    usernamePlaceholder: 'اسم المستخدم', add: 'إضافة', close: 'إغلاق', listEmpty: 'قائمتك فاضية حالياً',
    remove: 'إزالة', cantLoad: 'تعذر التحميل', added: 'تمت الإضافة', cantAdd: 'تعذر الإضافة',
    removed: 'تمت الإزالة', cantRemove: 'تعذر الإزالة', pinned: 'مثبّت', draft: 'مسودة',
    closeFriendsOnly: 'أصدقاء مقربون', scheduled: 'مجدول', reelsTag: 'ريلز',
    reactWord: 'تفاعل', replyWord: 'رد', replyToPlaceholder: 'رد @{u}', commentPlaceholder: 'اكتب تعليقاً...',
    unsave: 'إلغاء الحفظ', unpin: 'إلغاء التثبيت', pinInProfile: 'تثبيت في الملف الشخصي', share: 'مشاركة',
    del: 'حذف', commentWord: 'تعليق', confirmDeleteComment: 'حذف هذا التعليق؟', confirmDeletePost: 'حذف هذا المنشور نهائياً؟',
    cantDelete: 'تعذر الحذف', postSaved: 'تم حفظ المنشور', postUnsaved: 'تم إلغاء حفظ المنشور',
    cantPin: 'تعذر التثبيت', postPinned: 'تم تثبيت المنشور في ملفك الشخصي', postUnpinned: 'تم إلغاء التثبيت',
    fileTooBig: 'حجم الملف كبير جداً', fileTypeUnsupported: 'نوع الملف غير مدعوم', imagePreviewAlt: 'معاينة الصورة',
    willPostAsReel: 'سيُنشر كريلز', willPostAsVideo: 'سيُنشر في Hostaka Video',
    contentOrFileRequired: 'المحتوى أو الملف مطلوب', uploadFail: 'فشل رفع الملف', cantPrepVideoUpload: 'تعذر تجهيز رفع الفيديو',
    videoUploadFail: 'فشل رفع الفيديو', postedSuccess: 'تم نشر المنشور بنجاح', postFail: 'فشل النشر',
    noPagesYet: 'لا تملك أي صفحة بعد', cantLoadPages: 'تعذر تحميل الصفحات',
    pageNamePrompt: 'اسم الصفحة أو القناة:', pageHandlePrompt: 'معرّف الصفحة (بالإنجليزية بدون مسافات، مثال: my_channel):',
    pageCreated: 'تم إنشاء الصفحة', createFail: 'فشل الإنشاء', linkLabel: 'الرابط:'
  },
  en: {
    back: 'Back', profile: 'Profile', editProfile: 'Edit Profile',
    posts: 'Posts', edit: 'Edit Profile', gameId: 'Game ID',
    bio: 'Bio', save: 'Save Changes', changeCover: 'Change Cover',
    changeAvatar: 'Change Avatar', member: 'Member', admin: 'Admin',
    since: 'Since', noPosts: 'No posts yet', notFound: 'User not found',
    pleaseLogin: 'Please login to view your profile',
    home: 'Home', shareLink: 'Share link', linkCopied: 'Link copied',
    saveSuccess: 'Saved successfully', saveError: 'Save failed',
    connectionError: 'Connection error', coverJpg: 'JPG/JPEG only for cover',
    followers: 'Followers', following: 'Following', follow: 'Follow', unfollow: 'Unfollow',
    followError: 'Error while following', followersList: 'Followers', followingList: 'Following',
    noFollowers: 'No followers yet', noFollowing: 'Not following anyone',
    privacy: 'Privacy', pages: 'Pages', newPost: 'New post',
    verified: 'Verified account', options: 'Options', reportUser: 'Report user',
    blockUser: 'Block user', unblockUser: 'Unblock user', privateBadge: 'Private',
    privateAccountBody: 'This account is private. Follow to see their posts',
    unblockedToast: 'Unblocked @{u}', blockedToast: 'Blocked @{u}',
    operationFailed: 'Operation failed', message: 'Message',
    suspendedMsg: 'Your account has been suspended by the administration{reason}\nFor inquiries, please contact support via the /support page',
    reactLike: 'Like', reactLove: 'Love', reactHaha: 'Haha', reactSad: 'Sad', reactAngry: 'Angry',
    reportReasonAbuse: 'Abuse or harassment', reportReasonFake: 'Fake or impersonation account', reportReasonSpam: 'Spam / unwanted content', reportReasonOther: 'Other reason',
    reportSubjectPrefix: 'Report on user @{u}', reportSent: 'Report sent, thank you', sendFail: 'Failed to send',
    countryLabel: 'Country', countryPlaceholder: 'e.g. Saudi Arabia', schoolLabel: 'School/University', optionalPlaceholder: 'Optional',
    songLabel: 'Favorite song', certLabel: 'Certificates', privateAccountTitle: 'Private account',
    privateAccountHint: 'If enabled, only your followers can see your posts', whoCanMessage: 'Who can message me?',
    everyone: 'Everyone', followersOnly: 'Followers only', noOne: 'No one', closeFriendsLabel: 'Close Friends',
    closeFriendsHint: 'A private list you can publish "Close friends only" posts to', manageListBtn: 'Manage list ({count})',
    createPageChannel: 'Create a new page/channel', loading: 'Loading...', accountNowPrivate: 'Your account is now private',
    accountNowPublic: 'Your account is now public', cantSave: 'Could not save', msgSettingsUpdated: 'Messaging settings updated',
    usernamePlaceholder: 'Username', add: 'Add', close: 'Close', listEmpty: 'Your list is currently empty',
    remove: 'Remove', cantLoad: 'Could not load', added: 'Added', cantAdd: 'Could not add',
    removed: 'Removed', cantRemove: 'Could not remove', pinned: 'Pinned', draft: 'Draft',
    closeFriendsOnly: 'Close friends', scheduled: 'Scheduled', reelsTag: 'Reels',
    reactWord: 'React', replyWord: 'Reply', replyToPlaceholder: 'Reply @{u}', commentPlaceholder: 'Write a comment...',
    unsave: 'Unsave', unpin: 'Unpin', pinInProfile: 'Pin to profile', share: 'Share',
    del: 'Delete', commentWord: 'comment', confirmDeleteComment: 'Delete this comment?', confirmDeletePost: 'Permanently delete this post?',
    cantDelete: 'Could not delete', postSaved: 'Post saved', postUnsaved: 'Post unsaved',
    cantPin: 'Could not pin', postPinned: 'Post pinned to your profile', postUnpinned: 'Post unpinned',
    fileTooBig: 'File is too large', fileTypeUnsupported: 'Unsupported file type', imagePreviewAlt: 'Image preview',
    willPostAsReel: 'Will be posted as a reel', willPostAsVideo: 'Will be posted to Hostaka Video',
    contentOrFileRequired: 'Content or a file is required', uploadFail: 'Failed to upload file', cantPrepVideoUpload: 'Could not prepare video upload',
    videoUploadFail: 'Failed to upload video', postedSuccess: 'Posted successfully', postFail: 'Failed to post',
    noPagesYet: 'You don\'t have a page yet', cantLoadPages: 'Could not load pages',
    pageNamePrompt: 'Page or channel name:', pageHandlePrompt: 'Page handle (English, no spaces, e.g. my_channel):',
    pageCreated: 'Page created', createFail: 'Failed to create', linkLabel: 'Link:'
  },
  fr: {
    back: 'Retour', profile: 'Profil', editProfile: 'Modifier le profil',
    posts: 'Publications', edit: 'Modifier', gameId: 'ID de jeu',
    bio: 'Bio', save: 'Enregistrer', changeCover: 'Changer la couverture',
    changeAvatar: 'Changer l\'avatar', member: 'Membre', admin: 'Admin',
    since: 'Depuis', noPosts: 'Aucune publication', notFound: 'Utilisateur introuvable',
    pleaseLogin: 'Connectez-vous pour voir votre profil',
    home: 'Accueil', shareLink: 'Partager le lien', linkCopied: 'Lien copié',
    saveSuccess: 'Enregistré', saveError: 'Échec',
    connectionError: 'Erreur de connexion', coverJpg: 'JPG/JPEG uniquement',
    followers: 'Abonnés', following: 'Abonnements', follow: 'Suivre', unfollow: 'Ne plus suivre',
    followError: 'Erreur lors du suivi', followersList: 'Abonnés', followingList: 'Abonnements',
    noFollowers: 'Aucun abonné', noFollowing: 'Aucun abonnement',
    privacy: 'Confidentialité', pages: 'Pages', newPost: 'Nouvelle publication'
  },
  ru: {
    back: 'Назад', profile: 'Профиль', editProfile: 'Редактировать профиль',
    posts: 'Посты', edit: 'Редактировать', gameId: 'ID игры',
    bio: 'О себе', save: 'Сохранить', changeCover: 'Сменить обложку',
    changeAvatar: 'Сменить аватар', member: 'Участник', admin: 'Админ',
    since: 'С', noPosts: 'Нет постов', notFound: 'Пользователь не найден',
    pleaseLogin: 'Войдите, чтобы просмотреть профиль',
    home: 'Главная', shareLink: 'Поделиться ссылкой', linkCopied: 'Ссылка скопирована',
    saveSuccess: 'Сохранено', saveError: 'Ошибка',
    connectionError: 'Ошибка соединения', coverJpg: 'Только JPG/JPEG',
    followers: 'Подписчики', following: 'Подписки', follow: 'Подписаться', unfollow: 'Отписаться',
    followError: 'Ошибка при подписке', followersList: 'Подписчики', followingList: 'Подписки',
    noFollowers: 'Нет подписчиков', noFollowing: 'Нет подписок',
    privacy: 'Конфиденциальность', pages: 'Страницы', newPost: 'Новый пост'
  },
  zh: {
    back: '返回', profile: '个人资料', editProfile: '编辑资料',
    posts: '帖子', edit: '编辑', gameId: '游戏ID',
    bio: '简介', save: '保存更改', changeCover: '更换封面',
    changeAvatar: '更换头像', member: '成员', admin: '管理员',
    since: '注册于', noPosts: '暂无帖子', notFound: '用户未找到',
    pleaseLogin: '请登录查看您的个人资料',
    home: '首页', shareLink: '分享链接', linkCopied: '链接已复制',
    saveSuccess: '保存成功', saveError: '保存失败',
    connectionError: '连接错误', coverJpg: '仅支持 JPG/JPEG',
    followers: '关注者', following: '正在关注', follow: '关注', unfollow: '取消关注',
    followError: '关注出错', followersList: '关注者', followingList: '正在关注',
    noFollowers: '暂无关注者', noFollowing: '未关注任何人',
    privacy: '隐私', pages: '页面', newPost: '新帖子'
  },
  ja: {
    back: '戻る', profile: 'プロフィール', editProfile: 'プロフィール編集',
    posts: '投稿', edit: '編集', gameId: 'ゲームID',
    bio: '自己紹介', save: '変更を保存', changeCover: 'カバー変更',
    changeAvatar: 'アバター変更', member: 'メンバー', admin: '管理者',
    since: '登録日', noPosts: '投稿はありません', notFound: 'ユーザーが見つかりません',
    pleaseLogin: 'ログインしてプロフィールを表示',
    home: 'ホーム', shareLink: 'リンクを共有', linkCopied: 'リンクをコピーしました',
    saveSuccess: '保存しました', saveError: '保存に失敗しました',
    connectionError: '接続エラー', coverJpg: 'JPG/JPEGのみ対応',
    followers: 'フォロワー', following: 'フォロー中', follow: 'フォロー', unfollow: 'フォロー解除',
    followError: 'フォロー中にエラーが発生しました', followersList: 'フォロワー', followingList: 'フォロー中',
    noFollowers: 'フォロワーはいません', noFollowing: 'フォローしている人はいません',
    privacy: 'プライバシー', pages: 'ページ', newPost: '新規投稿'
  }
};

let currentLang = localStorage.getItem('hostaka_lang') || 'en';
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';

// ============================================================
//  CORE FUNCTIONS
// ============================================================
const getToken = () => localStorage.getItem('hostaka_token') || '';
const urlParams = new URLSearchParams(location.search);
const viewUsername = urlParams.get('u');
let ME = null;
let newAvBase64 = '';
let newCoverBase64 = '';
let currentTab = 'posts';
let userPosts = [];

function t(key) {
  return LANG[currentLang]?.[key] || LANG['ar'][key] || key;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  document.getElementById('backText').textContent = t('back');
  document.getElementById('topbarTitle').textContent = t('profile');
  document.getElementById('coverEditText').textContent = t('changeCover');
  const tabPosts = document.getElementById('tabPosts');
  const tabEdit = document.getElementById('tabEdit');
  if (tabPosts) tabPosts.textContent = t('posts');
  if (tabEdit) tabEdit.textContent = t('edit');
  const labels = document.querySelectorAll('.fg label');
  if (labels.length >= 1) {
    labels[0].textContent = t('editProfile');
  }
  const bioLabel = document.querySelector('.fg label[for="fBio"]');
  if (bioLabel) bioLabel.textContent = t('bio');
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.innerHTML = `${SVG.save}${t('save')}`;
  const fLabels = document.querySelectorAll('.stat-l');
  if (fLabels.length >= 3) {
    fLabels[1].textContent = t('followers');
    fLabels[2].textContent = t('following');
  }
}

function toggleTheme() {
  const html = document.documentElement;
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark');
    currentTheme = 'dark';
    setThemeIcon(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`);
  } else {
    html.removeAttribute('data-theme');
    currentTheme = 'light';
    setThemeIcon(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`);
  }
  localStorage.setItem('hostaka_theme', currentTheme);
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
  if (viewUsername) loadPublicProfile(viewUsername);
  else if (ME) loadMyProfile();
}

// ============================================================
//  VERIFIED BADGE (Adaptive)
// ============================================================
function verifiedBadge() {
  return `<span class="verified-icon" title="${t('verified')}"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z" fill="var(--badge-verified-fill)" stroke="var(--badge-verified-fill)" stroke-width="0.5"/><path d="M10.6 16.2l-4.1-4.1 1.4-1.4 2.7 2.7 5.5-5.5 1.4 1.4-6.9 6.9z" fill="var(--badge-verified-check)"/></svg></span>`;
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
// The server stores timestamps in UTC without a timezone; we interpret them as UTC so the browser converts them automatically to the user's local time
function toUTCDate(s){
  if(!s) return new Date(NaN);
  if(s instanceof Date) return s;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ','T')+'Z');
  return new Date(s);
}
function fmtDate(s) { if(!s) return ''; return toUTCDate(s).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {year:'numeric', month:'long', day:'numeric'}); }

const SVG = {
  user:    `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  post:    `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  edit:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  msg:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  save:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  clock:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mail:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  star:    `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  camera:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  arrow:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  follow:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  send:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  delete:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  comment:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  reel:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  bookmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 9l1-5h12l1 5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/></svg>`,
};

const REACTIONS = [
  { emoji:'like',  label:t('reactLike'),  icon:SVG.like },
  { emoji:'heart', label:t('reactLove'),  icon:SVG.heart },
  { emoji:'haha',  label:t('reactHaha'),  icon:SVG.haha },
  { emoji:'sad',   label:t('reactSad'),  icon:SVG.sad },
  { emoji:'angry', label:t('reactAngry'),  icon:SVG.angry },
];

function stripEmojis(text) {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}
function extractFirstUrl(text){
  const m = String(text||'').match(/https?:\/\/[^\s<]+/);
  if(!m) return null;
  return m[0].replace(/[.,!?)\]]+$/, '');
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

// ============================================================
//  FOLLOW FUNCTIONS (Real API)
// ============================================================
async function apiFetch(url, method = 'GET', body = null) {
  const token = getToken();
  const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json();
  if (res.status===403 && data?.suspended) handleSuspended(data.reason);
  return data;
}

async function handleSuspended(reason){
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_role');
  await hostakaAlert(t('suspendedMsg',{reason: reason ? ':\n' + reason : ''}));
  window.location = '/';
}

async function followUser(username) {
  const data = await apiFetch('/api/follow/' + encodeURIComponent(username), 'POST');
  if (data.success) return { success: true, following: true };
  throw new Error(data.error || t('followError'));
}

async function unfollowUser(username) {
  const data = await apiFetch('/api/follow/' + encodeURIComponent(username), 'DELETE');
  if (data.success) return { success: true, following: false };
  throw new Error(data.error || t('followError'));
}

async function getFollowStatus(username) {
  return await apiFetch('/api/follow/status/' + encodeURIComponent(username));
}

async function getFollowers(username) {
  return await apiFetch('/api/followers/' + encodeURIComponent(username));
}

async function getFollowing(username) {
  return await apiFetch('/api/following/' + encodeURIComponent(username));
}

// ============================================================
//  MAIN LOGIC
// ============================================================
async function init() {
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    setThemeIcon(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`);
  }
  applyLang();

  window.addEventListener('scroll', () => {
    document.getElementById('topbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  const token = getToken();
  if (viewUsername) {
    await loadPublicProfile(viewUsername);
    return;
  }
  if (!token) { renderNotLogged(); return; }
  try {
    const r = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!r.ok) { renderNotLogged(); return; }
    const u = await r.json();
    if (!u || u.error) { renderNotLogged(); return; }
    ME = u;
    await loadMyProfile();
  } catch (e) { renderNotLogged(); }
}

async function loadPublicProfile(username) {
  try {
    const token = getToken();
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    const pr = await fetch('/api/profile/' + encodeURIComponent(username), { headers }).then(r => r.json());
    if (pr.error) { renderNotFound(); return; }
    const ps = await fetch('/api/user/' + encodeURIComponent(username) + '/posts').then(r => r.json());
    document.getElementById('topbarTitle').textContent = pr.display_name || pr.username;
    renderCover(pr.cover || '', false);
    
    // Use the data from pr directly (since the server returns is_following when a token is passed)
    const followStatus = {
      following: pr.is_following || false,
      followers_count: pr.followers_count || 0,
      following_count: pr.following_count || 0
    };
    console.log('Follow status from profile:', followStatus);
    renderPublic(pr, Array.isArray(ps) ? ps : [], followStatus);
  } catch (e) {
    console.error('Error loading public profile:', e);
    renderNotFound();
  }
}

async function loadMyProfile() {
  if (!ME) return;
  try {
    const token = getToken();
    const [full, posts] = await Promise.all([
      fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.ok ? r.json() : null),
      fetch('/api/user/' + ME.username + '/posts').then(r => r.ok ? r.json() : [])
    ]);
    if (full && !full.error) {
      ME = full;
      renderCover(full.cover || '', true);
      renderMyProfile(full, Array.isArray(posts) ? posts : []);
    } else {
      renderMyProfile(ME, Array.isArray(posts) ? posts : []);
    }
  } catch (e) {
    renderMyProfile(ME, []);
  }
}

function renderCover(url, editable) {
  const img = document.getElementById('coverImg');
  const ph = document.getElementById('coverPlaceholder');
  const btn = document.getElementById('coverEditBtn');
  if (url) { img.src = url; img.style.display = 'block'; ph.style.display = 'none'; }
  else { img.style.display = 'none'; ph.style.display = 'flex'; }
  if (editable) btn.style.display = 'flex';
}

function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (t) t.remove();
  t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

function closeModal(id) { document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-bd').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); }));

function renderNotFound() {
  document.getElementById('profileSection').innerHTML = `<div class="not-logged">${SVG.user}<h2>${t('notFound')}</h2><p>${t('notFound')}</p><a href="/" class="btn-go">${SVG.arrow}${t('home')}</a></div>`;
}
function renderNotLogged() {
  document.getElementById('profileSection').innerHTML = `<div class="not-logged">${SVG.user}<h2>${t('pleaseLogin')}</h2><p>${t('pleaseLogin')}</p><a href="/" class="btn-go">${SVG.arrow}${t('home')}</a></div>`;
}

function roleBadge(role) {
  const label = (role === 'admin') ? t('admin') : t('member');
  return role === 'admin'
    ? `<span class="role-badge badge-admin">${SVG.star}${label}</span>`
    : `<span class="role-badge badge-member">${label}</span>`;
}

function avatarInner(user) {
  return user.avatar ? `<img src="${esc(user.avatar)}" alt="">` : (esc((user.display_name || user.username || '?').charAt(0).toUpperCase()));
}

// Variable for the current follow state of the displayed user
let currentFollowStatus = { following: false, followers_count: 0, following_count: 0 };

function renderPublic(user, posts, followStatus) {
  userPosts = posts;
  currentFollowStatus = followStatus; // save the state
  const token = getToken();
  const isOwn = token && ME && ME.username === user.username;
  const isFollowing = followStatus.following || false;
  const followersCount = followStatus.followers_count || 0;
  const followingCount = followStatus.following_count || 0;
  const isLocked = Number(user.is_private) === 1 && !isOwn && !isFollowing;

  const canMessage = user.message_privacy === 'none' ? false
    : user.message_privacy === 'followers' ? isFollowing
    : true; // 'everyone' or unspecified

  let actionsHtml = '';
  if (isOwn) {
    actionsHtml = `<button class="btn-edit" onclick="switchTab('edit')">${SVG.edit}${t('editProfile')}</button>`;
  } else if (token) {
    actionsHtml = `
      ${canMessage ? `<a href="/chat?with=${esc(user.username)}" class="btn-msg">${SVG.msg}${t('message')}</a>` : ''}
      <button class="btn-follow ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${esc(user.username)}', this)">
        ${isFollowing ? SVG.check : SVG.follow}
        <span>${isFollowing ? t('unfollow') : t('follow')}</span>
      </button>
      <div class="btn-more-wrap">
        <button class="btn-more" onclick="toggleMoreMenu()" title="${t('options')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        <div class="more-menu" id="moreMenu">
          <button onclick="openReportUserModal('${esc(user.username)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${t('reportUser')}
          </button>
          <button class="danger" id="blockToggleBtn" onclick="toggleBlockProfile('${esc(user.username)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span id="blockToggleText">${t('blockUser')}</span>
          </button>
        </div>
      </div>
    `;
  }

  const aboutItems = [
    user.country ? `<div class="about-chip">${SVG.clock}${esc(user.country)}</div>` : '',
    user.school ? `<div class="about-chip">${esc(user.school)}</div>` : '',
    user.favorite_song ? `<div class="about-chip">🎵 ${esc(user.favorite_song)}</div>` : '',
    user.certificates ? `<div class="about-chip">🎓 ${esc(user.certificates)}</div>` : '',
  ].filter(Boolean).join('');

  document.getElementById('profileSection').innerHTML = `
    <div class="avatar-pull">
      <div class="avatar-big" style="cursor:default;">${avatarInner(user)}</div>
      <div class="profile-actions">${actionsHtml}</div>
    </div>
    <div class="profile-meta">
      <div class="meta-name">${esc(user.display_name || user.username)} ${user.verified ? verifiedBadge() : ''} ${Number(user.is_private)===1 ? '<span class="private-badge">🔒 ' + t('privateBadge') + '</span>' : ''}</div>
      <div class="meta-un">@${esc(user.username)}</div>
      ${roleBadge(user.role)}
      ${user.bio ? `<div class="meta-bio">${esc(user.bio)}</div>` : ''}
      ${aboutItems ? `<div class="about-chips">${aboutItems}</div>` : ''}
      <div class="meta-info">
        <div class="info-item">${SVG.clock}${t('since')} ${fmtDate(user.created_at)}</div>
      </div>
      <div class="meta-stats">
        <div class="stat"><div class="stat-n">${posts.length}</div><div class="stat-l">${t('posts')}</div></div>
        <div class="stat stat-clickable" onclick="showFollowersModal('${esc(user.username)}')"><div class="stat-n">${followersCount}</div><div class="stat-l">${t('followers')}</div></div>
        <div class="stat stat-clickable" onclick="showFollowingModal('${esc(user.username)}')"><div class="stat-n">${followingCount}</div><div class="stat-l">${t('following')}</div></div>
      </div>
    </div>
    <div class="tabs-bar">
      <button class="tab-btn active" onclick="switchTab('posts')">${t('posts')}</button>
    </div>
    <div class="posts-tab" id="postsTab">${isLocked ? `
      <div class="post-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <div>${t('privateAccountBody')}</div>
      </div>` : renderPosts(posts)}</div>`;

  if (!isOwn && token) checkBlockStatus(user.username);
}

// ----- Block and report a user -----
function toggleMoreMenu(){
  document.getElementById('moreMenu')?.classList.toggle('show');
}
document.addEventListener('click', e=>{
  if(!e.target.closest('.btn-more-wrap')) document.getElementById('moreMenu')?.classList.remove('show');
});

async function checkBlockStatus(username){
  try{
    const d = await apiFetch('/api/block/status/' + encodeURIComponent(username));
    const txt = document.getElementById('blockToggleText');
    if(txt) txt.textContent = d.blocked ? t('unblockUser') : t('blockUser');
  }catch(e){}
}

async function toggleBlockProfile(username){
  document.getElementById('moreMenu')?.classList.remove('show');
  const txt = document.getElementById('blockToggleText');
  const isBlocked = txt && txt.textContent === t('unblockUser');
  try{
    const d = isBlocked
      ? await apiFetch('/api/block/' + encodeURIComponent(username), 'DELETE')
      : await apiFetch('/api/block/' + encodeURIComponent(username), 'POST');
    if(d.success){
      showToast(isBlocked ? t('unblockedToast',{u:username}) : t('blockedToast',{u:username}));
      checkBlockStatus(username);
    } else { showToast(d.error || t('operationFailed'), 'error'); }
  }catch(e){ showToast(t('connectionError'), 'error'); }
}

function openReportUserModal(username){
  document.getElementById('moreMenu')?.classList.remove('show');
  document.getElementById('reportUserTarget').value = username;
  document.getElementById('reportUserReason').value = 'abuse';
  document.getElementById('reportUserDetails').value = '';
  document.getElementById('reportUserModal').classList.add('show');
}
async function submitUserReport(){
  const username = document.getElementById('reportUserTarget').value;
  const reasonType = document.getElementById('reportUserReason').value;
  const details = document.getElementById('reportUserDetails').value.trim();
  const labels = { abuse:t('reportReasonAbuse'), fake:t('reportReasonFake'), spam:t('reportReasonSpam'), other:t('reportReasonOther') };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportUserSubmitBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/reports', 'POST', {
      type: 'user', target_owner_username: username,
      subject: t('reportSubjectPrefix',{u:username}), reason
    });
    if(d.success){ showToast(t('reportSent')); document.getElementById('reportUserModal').classList.remove('show'); }
    else { showToast(d.error || t('sendFail'), 'error'); }
  }catch(e){ showToast(t('connectionError'), 'error'); }
  btn.disabled = false;
}

function renderMyProfile(user, posts) {
  userPosts = posts;
  document.getElementById('topbarTitle').textContent = user.display_name || user.username;
  const followersCount = user.followers_count || 0;
  const followingCount = user.following_count || 0;

  document.getElementById('profileSection').innerHTML = `
    <div class="avatar-pull">
      <div class="avatar-big" id="avBig" onclick="document.getElementById('avFile').click()" title="${t('changeAvatar')}">
        ${avatarInner(user)}
        <div class="av-overlay">${SVG.camera}</div>
      </div>
      <div class="profile-actions">
        <button class="btn-edit" onclick="switchTab('edit')">${SVG.edit}${t('editProfile')}</button>
      </div>
    </div>
    <div class="profile-meta">
      <div class="meta-name">${esc(user.display_name || user.username)} ${user.verified ? verifiedBadge() : ''}</div>
      <div class="meta-un">@${esc(user.username)}</div>
      ${roleBadge(user.role)}
      ${user.bio ? `<div class="meta-bio">${esc(user.bio)}</div>` : ''}
      <div class="meta-info">
        <div class="info-item">${SVG.clock}${t('since')} ${fmtDate(user.created_at)}</div>
      </div>
      <div class="meta-stats">
        <div class="stat"><div class="stat-n">${posts.length}</div><div class="stat-l">${t('posts')}</div></div>
        <div class="stat stat-clickable" onclick="showFollowersModal('${esc(user.username)}')"><div class="stat-n">${followersCount}</div><div class="stat-l">${t('followers')}</div></div>
        <div class="stat stat-clickable" onclick="showFollowingModal('${esc(user.username)}')"><div class="stat-n">${followingCount}</div><div class="stat-l">${t('following')}</div></div>
      </div>
    </div>
    <div class="tabs-bar">
      <button class="tab-btn active" id="tabPosts" onclick="switchTab('posts')">${t('posts')}</button>
      <button class="tab-btn" id="tabEdit" onclick="switchTab('edit')">${t('editProfile')}</button>
      <button class="tab-btn" id="tabPrivacy" onclick="switchTab('privacy')">${t('privacy')}</button>
      <button class="tab-btn" id="tabPages" onclick="switchTab('pages')">${t('pages')}</button>
    </div>
    <div class="posts-tab" id="postsTab">
      <button class="create-post-cta" onclick="openPostModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('newPost')}
      </button>
      ${renderPosts(posts)}
    </div>
      <div class="alert alert-err" id="pErr"></div>
      <div class="alert alert-ok" id="pOk"></div>
      <div class="fg-row">
        <div class="fg"><label>${t('editProfile')}</label><input type="text" id="fName" value="${esc(user.display_name || '')}" placeholder="${t('editProfile')}"></div>
      </div>
      <div class="fg"><label>${t('bio')}</label><textarea id="fBio" placeholder="${t('bio')}">${esc(user.bio || '')}</textarea></div>
      <div class="fg-row">
        <div class="fg"><label>${t('countryLabel')}</label><input type="text" id="fCountry" value="${esc(user.country || '')}" placeholder="${t('countryPlaceholder')}"></div>
        <div class="fg"><label>${t('schoolLabel')}</label><input type="text" id="fSchool" value="${esc(user.school || '')}" placeholder="${t('optionalPlaceholder')}"></div>
      </div>
      <div class="fg-row">
        <div class="fg"><label>${t('songLabel')}</label><input type="text" id="fSong" value="${esc(user.favorite_song || '')}" placeholder="${t('optionalPlaceholder')}"></div>
        <div class="fg"><label>${t('certLabel')}</label><input type="text" id="fCert" value="${esc(user.certificates || '')}" placeholder="${t('optionalPlaceholder')}"></div>
      </div>
      <button class="btn-save" id="saveBtn" onclick="save()">${SVG.save}${t('save')}</button>
    </div>
    <div class="edit-section" id="privacyTab" style="display:none;">
      <div class="alert alert-err" id="privErr"></div>
      <div class="alert alert-ok" id="privOk"></div>
      <div class="privacy-row">
        <div>
          <div class="privacy-row-title">${t('privateAccountTitle')}</div>
          <div class="privacy-row-hint">${t('privateAccountHint')}</div>
        </div>
        <label class="switch"><input type="checkbox" id="fPrivate" ${Number(user.is_private)===1?'checked':''} onchange="saveAccountPrivacy()"><span class="slider"></span></label>
      </div>
      <div class="fg" style="margin-top:16px;">
        <label>${t('whoCanMessage')}</label>
        <select id="fMsgPrivacy" onchange="saveMessagePrivacy()">
          <option value="everyone" ${user.message_privacy==='everyone'?'selected':''}>${t('everyone')}</option>
          <option value="followers" ${user.message_privacy==='followers'?'selected':''}>${t('followersOnly')}</option>
          <option value="none" ${user.message_privacy==='none'?'selected':''}>${t('noOne')}</option>
        </select>
      </div>
      <div class="fg" style="margin-top:20px;">
        <label>${t('closeFriendsLabel')}</label>
        <div class="privacy-row-hint" style="margin-bottom:10px;">${t('closeFriendsHint')}</div>
        <button class="btn-save" style="width:auto;padding:9px 20px;" onclick="openCloseFriendsModal()">${t('manageListBtn',{count:closeFriendsCount})}</button>
      </div>
    </div>
    <div class="edit-section" id="pagesTab" style="display:none;">
      <button class="btn-save" style="margin-bottom:16px;" onclick="openCreatePage()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('createPageChannel')}
      </button>
      <div id="myPagesList"><div class="post-empty">${t('loading')}</div></div>
    </div>`;
}

let profilePosts = [];
let closeFriendsCount = 0;

async function loadCloseFriendsCount(){
  try{
    const list = await apiFetch('/api/account/close-friends');
    closeFriendsCount = Array.isArray(list) ? list.length : 0;
    const btn = document.querySelector('#privacyTab .btn-save');
    if(btn) btn.textContent = t('manageListBtn',{count:closeFriendsCount});
  }catch(e){}
}

async function saveAccountPrivacy(){
  const checked = document.getElementById('fPrivate').checked;
  const d = await apiFetch('/api/account/privacy', 'PUT', { is_private: checked });
  if(d.success){ showToast(checked ? t('accountNowPrivate') : t('accountNowPublic')); if(ME) ME.is_private = checked?1:0; }
  else showToast(d.error||t('cantSave'), 'error');
}

async function saveMessagePrivacy(){
  const pref = document.getElementById('fMsgPrivacy').value;
  const d = await apiFetch('/api/account/message-privacy', 'PUT', { pref });
  if(d.success) showToast(t('msgSettingsUpdated'));
  else showToast(d.error||t('cantSave'), 'error');
}

async function openCloseFriendsModal(){
  let modal = document.getElementById('closeFriendsModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'modal-bd';
    modal.id = 'closeFriendsModal';
    modal.innerHTML = `<div class="modal-box">
      <div class="modal-t">${t('closeFriendsLabel')}</div>
      <div class="fg-row" style="margin-bottom:12px;">
        <input type="text" id="cfUsernameInput" class="fg" placeholder="${t('usernamePlaceholder')}" style="flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--input-bg);color:var(--text);">
        <button class="btn-save" style="width:auto;padding:9px 16px;" onclick="addCloseFriendByUsername()">${t('add')}</button>
      </div>
      <div class="err" id="cfErr" style="display:none;color:var(--danger);font-size:0.8rem;margin-bottom:8px;"></div>
      <div id="closeFriendsList"><div class="post-empty">${t('loading')}</div></div>
      <div class="modal-footer" style="margin-top:16px;display:flex;justify-content:flex-end;">
        <button class="btn-edit" onclick="document.getElementById('closeFriendsModal').classList.remove('show')">${t('close')}</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
  }
  modal.classList.add('show');
  await renderCloseFriendsList();
}

async function renderCloseFriendsList(){
  const box = document.getElementById('closeFriendsList');
  try{
    const list = await apiFetch('/api/account/close-friends');
    closeFriendsCount = Array.isArray(list) ? list.length : 0;
    if(!list.length){ box.innerHTML = `<div class="post-empty" style="padding:20px;">${t('listEmpty')}</div>`; return; }
    box.innerHTML = list.map(f => `
      <div class="session-row">
        <div class="session-icon">${f.avatar?`<img src="${esc(f.avatar)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`:esc((f.display_name||f.username||'?').charAt(0).toUpperCase())}</div>
        <div class="session-info"><div class="session-name">${esc(f.display_name||f.username)}</div><div class="session-meta">@${esc(f.username)}</div></div>
        <button class="btn-outline-danger" style="padding:6px 12px;font-size:0.76rem;" onclick="removeCloseFriend('${esc(f.username)}')">${t('remove')}</button>
      </div>
    `).join('');
  }catch(e){ box.innerHTML = `<div class="post-empty">${t('cantLoad')}</div>`; }
}

async function addCloseFriendByUsername(){
  const input = document.getElementById('cfUsernameInput');
  const username = input.value.trim().replace(/^@/, '');
  const errEl = document.getElementById('cfErr');
  errEl.style.display = 'none';
  if(!username) return;
  const d = await apiFetch('/api/account/close-friends/' + encodeURIComponent(username), 'POST');
  if(d.success){ input.value = ''; renderCloseFriendsList(); showToast(t('added')); }
  else { errEl.textContent = d.error || t('cantAdd'); errEl.style.display = 'block'; }
}

async function removeCloseFriend(username){
  const d = await apiFetch('/api/account/close-friends/' + encodeURIComponent(username), 'DELETE');
  if(d.success){ renderCloseFriendsList(); showToast(t('removed')); }
  else showToast(d.error||t('cantRemove'), 'error');
}

function postStatusBadge(p){
  let out = '';
  if (Number(p.pinned) === 1) out += `<span class="post-status-badge st-pinned">${SVG.pin} ${t('pinned')}</span>`;
  if (p.privacy === 'draft') out += `<span class="post-status-badge st-draft">${t('draft')}</span>`;
  else if (p.privacy === 'private') out += `<span class="post-status-badge st-private">${t('privateBadge')}</span>`;
  else if (p.privacy === 'close_friends') out += `<span class="post-status-badge st-close-friends">${t('closeFriendsOnly')}</span>`;
  else if (p.scheduled_at && new Date(p.scheduled_at.replace(' ','T')+'Z').getTime() > Date.now()) out += `<span class="post-status-badge st-scheduled">${t('scheduled')}</span>`;
  return out;
}

function renderPosts(posts) {
  profilePosts = Array.isArray(posts) ? posts : [];
  if (!profilePosts.length) return `<div class="post-empty">${SVG.post}<div>${t('noPosts')}</div></div>`;
  return profilePosts.map(p => renderOnePost(p)).join('');
}

function renderOnePost(p){
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
    const ca = c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : esc((c.display_name||c.username||'?').charAt(0).toUpperCase());
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
      <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ri-${c.id}" title="Emoji">😀</button>
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');
  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="${t('commentPlaceholder')}" id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
    <button type="button" class="btn-icon-sm femoji-comment-btn" data-target="ci-${p.id}" title="Emoji">😀</button>
    <button class="btn-send-comment" onclick="sendComment(${p.id})">${SVG.send}</button>
  </div>` : '';

  return `<div class="post-card" id="post-${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="pub-row">
        <div class="pub-info">
          <div class="pub-name">
            ${esc(p.publisher_name || p.publisher)}
            ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            ${postStatusBadge(p)}
          </div>
        </div>
        <div class="pub-actions">
          ${ME ? `<button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSavePost(${p.id})" title="${p.is_saved?t('unsave'):t('save')}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>` : ''}
          ${canDel ? `<button class="btn-icon pin-btn ${Number(p.pinned)===1?'pinned':''}" onclick="togglePinPost(${p.id})" title="${Number(p.pinned)===1?t('unpin'):t('pinInProfile')}">${SVG.pin}</button>` : ''}
          <button class="btn-icon" onclick="sharePost(${p.id})" title="${t('share')}">${SVG.share}</button>
          ${canDel ? `<button class="btn-icon" onclick="delPost(${p.id})" title="${t('del')}">${SVG.delete}</button>` : ''}
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

function findProfilePost(id){ return profilePosts.find(p => p.id === id); }
function rerenderPost(id){
  const post = findProfilePost(id);
  const card = document.getElementById('post-'+id);
  if (post && card) {
    const wrap = document.createElement('div');
    wrap.innerHTML = renderOnePost(post);
    card.replaceWith(wrap.firstChild);
  }
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
  if(!ME){ openAuth?.(); return; }
  document.querySelectorAll('.react-menu.show').forEach(m => m.classList.remove('show'));
  const d = await apiFetch('/api/records/'+id+'/react', 'POST', { emoji });
  if(!d.success) return;
  const post = findProfilePost(id);
  if(post){ post.reactions = d.reactions; post.userReaction = d.userReaction; }
  rerenderPost(id);
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
  const post=findProfilePost(postId);
  if(post){ post.comments=comments; }
  rerenderPost(postId);
  document.getElementById('cmtSec-'+postId).style.display='block';
  document.getElementById('cmtToggle-'+postId)?.classList.add('expanded');
}

async function delComment(commentId, postId){
  if(!await hostakaConfirm(t('confirmDeleteComment'))) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

async function delPost(id){
  if(!await hostakaConfirm(t('confirmDeletePost'))) return;
  const d = await apiFetch('/api/records/'+id, 'DELETE');
  if(d.success){
    profilePosts = profilePosts.filter(p => p.id !== id);
    document.getElementById('post-'+id)?.remove();
  } else {
    showToast(d.error || t('cantDelete'), 'error');
  }
}

async function toggleSavePost(id){
  if(!ME) return;
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const post = findProfilePost(id);
  if(post) post.is_saved = d.saved;
  const btn = document.querySelector(`#post-${id} .save-btn`);
  if(btn){
    btn.classList.toggle('saved', d.saved);
    btn.innerHTML = d.saved ? SVG.bookmarkFilled : SVG.bookmark;
    btn.title = d.saved ? t('unsave') : t('save');
  }
  showToast(d.saved ? t('postSaved') : t('postUnsaved'));
}

async function togglePinPost(id){
  const d = await apiFetch('/api/records/'+id+'/pin', 'POST');
  if(!d.success){ showToast(d.error||t('cantPin'), 'error'); return; }
  profilePosts.forEach(p => { p.pinned = (p.id === id) ? (d.pinned?1:0) : 0; });
  profilePosts.sort((a,b) => (Number(b.pinned)||0) - (Number(a.pinned)||0));
  const tab = document.getElementById('postsTab');
  if(tab){
    const cta = tab.querySelector('.create-post-cta');
    tab.innerHTML = (cta ? cta.outerHTML : '') + renderPosts(profilePosts);
  }
  showToast(d.pinned ? t('postPinned') : t('postUnpinned'));
}

// ============================================================
//  Create a new post (media + formatting + privacy + scheduling)
// ============================================================
let postMediaBase64 = '';
let postMediaType = '';
let postMediaFileObj = null;
let postVideoMeta = { width:0, height:0, isReel:false };
let selectedPostPrivacy = 'public';
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function readVideoDimensions(file){
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata'; v.muted = true;
    v.onloadedmetadata = () => {
      const width = v.videoWidth || 0, height = v.videoHeight || 0;
      URL.revokeObjectURL(url);
      resolve({ width, height, isReel: width > 0 && height > 0 && height > width });
    };
    v.onerror = () => { URL.revokeObjectURL(url); resolve({ width:0, height:0, isReel:false }); };
    v.src = url;
  });
}

function openPostModal(){
  if(!ME){ return; }
  const ed=document.getElementById('postEditor');
  if(ed) ed.innerHTML='';
  document.getElementById('postErr').style.display='none';
  document.getElementById('postMediaPreviewWrap').style.display='none';
  postMediaBase64=''; postMediaType=''; postMediaFileObj=null;
  selectedPostPrivacy = 'public';
  document.querySelectorAll('#privacyChoices .privacy-opt').forEach(b=>b.classList.toggle('active', b.dataset.privacy==='public'));
  const sched = document.getElementById('postScheduleInput');
  if (sched) sched.value = '';
  document.getElementById('postModal').classList.add('show');
  setTimeout(()=>document.getElementById('postEditor')?.focus(),100);
  const emojiBtn = document.getElementById('postEmojiBtn');
  if (emojiBtn && !emojiBtn._femojiWired && window.EmojiFluent) {
    emojiBtn._femojiWired = true;
    EmojiFluent.attachButton(emojiBtn, document.getElementById('postEditor'));
  }
}

function selectPostPrivacy(p){
  selectedPostPrivacy = p;
  document.querySelectorAll('#privacyChoices .privacy-opt').forEach(b=>b.classList.toggle('active', b.dataset.privacy===p));
}

function onPostMedia(e){
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > MAX_FILE_SIZE) { showToast(t('fileTooBig'), 'error'); e.target.value=''; return; }
  const isImage = f.type === 'image/jpeg' || f.type === 'image/jpg';
  const isVideo = f.type.startsWith('video/') && (f.type === 'video/mp4' || f.type === 'video/webm');
  if (!isImage && !isVideo) { showToast(t('fileTypeUnsupported'), 'error'); e.target.value=''; return; }
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
      const reelTag = postVideoMeta.isReel ? `<div class="reel-detect-badge">${SVG.reel} <span>${t('willPostAsReel')}</span></div>` : `<div class="reel-detect-badge">${SVG.reel} <span>${t('willPostAsVideo')}</span></div>`;
      preview.innerHTML = `<video controls style="max-height:200px;width:100%;"><source src="${postMediaBase64}" type="${f.type}"></video>${reelTag}`;
    }
    document.getElementById('postMediaPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(f);
  e.target.value = '';
}

function removePostMedia(){
  postMediaBase64=''; postMediaType=''; postMediaFileObj=null;
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
  const btn=document.getElementById('postBtn'); btn.disabled=true;
  const scheduleVal = document.getElementById('postScheduleInput')?.value || '';
  try {
    let imageUrl='', videoUrl='';
    if(postMediaType === 'image' && postMediaBase64){
      const up = await apiFetch('/api/upload', 'POST', { image: postMediaBase64 });
      if (up.url) { imageUrl = up.url; }
      else {
        errEl.textContent = up.error || t('uploadFail'); errEl.style.display='block';
        btn.disabled=false; return;
      }
    } else if (postMediaType === 'video' && postMediaFileObj) {
      try {
        const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
        if (!sig.signature) throw new Error(sig.error || t('cantPrepVideoUpload'));
        const fd = new FormData();
        fd.append('file', postMediaFileObj);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', sig.timestamp);
        fd.append('folder', sig.folder);
        fd.append('signature', sig.signature);
        const vRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`, { method:'POST', body:fd });
        const vData = await vRes.json();
        if (!vRes.ok || !vData.secure_url) { console.error('Cloudinary video upload failed:', vData.error);
          reportClientError('cloudinary_video_upload', vData.error); throw new Error(t('videoUploadFail')); }
        videoUrl = vData.secure_url;
      } catch (upErr) {
        errEl.textContent = t('videoUploadFail'); errEl.style.display='block';
        btn.disabled=false; return;
      }
    }
    const d = await apiFetch('/api/records','POST',{
      content: content || '',
      image: imageUrl,
      video: videoUrl,
      media_type: postMediaType,
      video_width: postVideoMeta.width || 0,
      video_height: postVideoMeta.height || 0,
      privacy: selectedPostPrivacy,
      scheduled_at: scheduleVal ? new Date(scheduleVal).toISOString() : null
    });
    if(d.success){
      closeModal('postModal');
      showToast(t('postedSuccess'));
      await loadMyProfile();
    } else { errEl.textContent=d.error||t('postFail'); errEl.style.display='block'; }
  } catch(e){ errEl.textContent=t('cantConnectServer'); errEl.style.display='block'; }
  finally { btn.disabled=false; }
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const postsTab = document.getElementById('postsTab');
  const editTab = document.getElementById('editTab');
  const pagesTab = document.getElementById('pagesTab');
  const privacyTab = document.getElementById('privacyTab');
  [postsTab, editTab, pagesTab, privacyTab].forEach(el => { if (el) el.style.display = 'none'; });
  if (tab === 'posts') {
    document.getElementById('tabPosts')?.classList.add('active');
    if (postsTab) postsTab.style.display = 'block';
  } else if (tab === 'pages') {
    document.getElementById('tabPages')?.classList.add('active');
    if (pagesTab) { pagesTab.style.display = 'block'; loadMyPages(); }
  } else if (tab === 'privacy') {
    document.getElementById('tabPrivacy')?.classList.add('active');
    if (privacyTab) { privacyTab.style.display = 'block'; loadCloseFriendsCount(); }
  } else {
    document.getElementById('tabEdit')?.classList.add('active');
    if (editTab) editTab.style.display = 'block';
  }
}

// ============================================================
//  Pages/channels belonging to the account
// ============================================================
async function loadMyPages(){
  const list = document.getElementById('myPagesList');
  try {
    const pages = await apiFetch('/api/pages/mine');
    if (!Array.isArray(pages) || !pages.length) {
      list.innerHTML = `<div class="post-empty">${t('noPagesYet')}</div>`;
      return;
    }
    list.innerHTML = pages.map(pg => `
      <div class="post-card" style="display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="location.href='/page?u='+encodeURIComponent('${esc(pg.username)}')">
        <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(145deg,#000,#333);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;overflow:hidden;flex:0 0 auto;">
          ${pg.avatar ? `<img src="${esc(pg.avatar)}" style="width:100%;height:100%;object-fit:cover;" alt="">` : esc((pg.name||'?').charAt(0).toUpperCase())}
        </div>
        <div style="flex:1;">
          <div style="font-weight:800;">${esc(pg.name)}</div>
          <div style="font-size:0.78rem;color:var(--muted);">@${esc(pg.username)}</div>
        </div>
      </div>
    `).join('');
  } catch(e) { list.innerHTML = `<div class="post-empty">${t('cantLoadPages')}</div>`; }
}

async function openCreatePage(){
  const name = await hostakaPrompt(t('pageNamePrompt'));
  if (!name || !name.trim()) return;
  const handle = await hostakaPrompt(t('pageHandlePrompt'), name.trim().toLowerCase().replace(/\s+/g,'_'));
  if (!handle || !handle.trim()) return;
  createPage(name.trim(), handle.trim());
}

async function createPage(name, username){
  try {
    const d = await apiFetch('/api/pages', 'POST', { name, username });
    if (d.success) { showToast(t('pageCreated')); loadMyPages(); }
    else showToast(d.error || t('createFail'), 'error');
  } catch(e) { showToast(t('connectionError'), 'error'); }
}

async function sharePost(id) {
  const url = window.location.origin + '/post?id=' + id;
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast(t('linkCopied')));
  else await hostakaPrompt(t('linkLabel'), url);
}

// ============================================================
//  FOLLOW / UNFOLLOW HANDLER
// ============================================================
async function toggleFollow(username, btnEl) {
  if (!getToken()) {
    showToast(t('pleaseLogin'), 'error');
    return;
  }
  const isFollowing = btnEl.classList.contains('following');
  try {
    let result;
    if (isFollowing) {
      result = await unfollowUser(username);
    } else {
      result = await followUser(username);
    }
    if (result.success) {
      // Update the button and appearance
      btnEl.classList.toggle('following', result.following);
      const span = btnEl.querySelector('span');
      if (span) span.textContent = result.following ? t('unfollow') : t('follow');
      // Update the icon by fully replacing the element
      const icon = btnEl.querySelector('svg');
      if (icon) {
        const newIcon = document.createElement('span');
        newIcon.innerHTML = result.following ? SVG.check : SVG.follow;
        icon.parentNode.replaceChild(newIcon.firstChild, icon);
      }
      // Update the stored state
      currentFollowStatus.following = result.following;
      // Update stats from the server
      const freshStatus = await getFollowStatus(username);
      if (freshStatus) {
        currentFollowStatus.followers_count = freshStatus.followers_count || 0;
        currentFollowStatus.following_count = freshStatus.following_count || 0;
        const stats = document.querySelectorAll('.stat-n');
        if (stats.length >= 3) {
          stats[1].textContent = freshStatus.followers_count || 0;
          stats[2].textContent = freshStatus.following_count || 0;
        }
      }
    } else {
      showToast(result.error || t('followError'), 'error');
    }
  } catch (e) {
    showToast(t('followError'), 'error');
  }
}

// ============================================================
//  FOLLOWERS / FOLLOWING MODALS
// ============================================================
async function showFollowersModal(username) {
  const modal = document.getElementById('userListModal');
  const title = document.getElementById('modalTitle');
  const list = document.getElementById('modalUserList');
  title.textContent = t('followersList');
  modal.classList.add('show');
  list.innerHTML = `<div class="spin" style="margin:20px auto;"></div>`;
  try {
    const data = await getFollowers(username);
    renderUserList(list, data, t('noFollowers'));
  } catch (e) {
    list.innerHTML = `<div class="modal-empty">${t('connectionError')}</div>`;
  }
}

async function showFollowingModal(username) {
  const modal = document.getElementById('userListModal');
  const title = document.getElementById('modalTitle');
  const list = document.getElementById('modalUserList');
  title.textContent = t('followingList');
  modal.classList.add('show');
  list.innerHTML = `<div class="spin" style="margin:20px auto;"></div>`;
  try {
    const data = await getFollowing(username);
    renderUserList(list, data, t('noFollowing'));
  } catch (e) {
    list.innerHTML = `<div class="modal-empty">${t('connectionError')}</div>`;
  }
}

function renderUserList(container, users, emptyMsg) {
  if (!users || !users.length) {
    container.innerHTML = `<div class="modal-empty">${emptyMsg}</div>`;
    return;
  }
  container.innerHTML = users.map(u => `
    <div class="modal-user-item" onclick="window.location='/profile?u=${encodeURIComponent(u.username)}'">
      <div class="u-av">${u.avatar ? `<img src="${esc(u.avatar)}" alt="">` : esc((u.display_name || u.username || '?').charAt(0).toUpperCase())}</div>
      <div class="u-info">
        <div class="u-name">${esc(u.display_name || u.username)} ${u.verified ? verifiedBadge() : ''}</div>
        <div class="u-un">@${esc(u.username)}</div>
      </div>
    </div>
  `).join('');
}

// ============================================================
//  AVATAR / COVER UPLOAD & SAVE
// ============================================================
function onAvatar(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    newAvBase64 = ev.target.result;
    const el = document.getElementById('avBig');
    if (el) el.innerHTML = `<img src="${newAvBase64}" alt=""><div class="av-overlay">${SVG.camera}</div>`;
  };
  r.readAsDataURL(f);
}

function onCover(e) {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.match('image/jpeg')) { showToast(t('coverJpg'), 'error'); return; }
  const r = new FileReader();
  r.onload = ev => { newCoverBase64 = ev.target.result; renderCover(newCoverBase64, true); };
  r.readAsDataURL(f);
  e.target.value = '';
}

async function save() {
  const display_name = document.getElementById('fName')?.value.trim() || '';
  const bio = document.getElementById('fBio')?.value.trim() || '';
  const country = document.getElementById('fCountry')?.value.trim() || '';
  const school = document.getElementById('fSchool')?.value.trim() || '';
  const favorite_song = document.getElementById('fSong')?.value.trim() || '';
  const certificates = document.getElementById('fCert')?.value.trim() || '';
  const errEl = document.getElementById('pErr'), okEl = document.getElementById('pOk');
  errEl.style.display = 'none'; okEl.style.display = 'none';
  const btn = document.getElementById('saveBtn');
  btn.disabled = true;
  btn.textContent = '...';
  const token = getToken();
  try {
    let avatarUrl = ME?.avatar || '';
    let coverUrl = ME?.cover || '';
    if (newAvBase64) {
      const up = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ image: newAvBase64 }) });
      const ud = await up.json();
      if (ud.url) avatarUrl = ud.url;
    }
    if (newCoverBase64) {
      const up = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ image: newCoverBase64 }) });
      const ud = await up.json();
      if (ud.url) coverUrl = ud.url;
    }
    const r = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ display_name, bio, avatar: avatarUrl, cover: coverUrl, country, school, favorite_song, certificates }) });
    const d = await r.json();
    if (d.success) {
      try { const u = JSON.parse(localStorage.getItem('hostaka_user') || '{}'); u.avatar = avatarUrl; u.display_name = display_name; localStorage.setItem('hostaka_user', JSON.stringify(u)); } catch (e) {}
      okEl.textContent = t('saveSuccess');
      okEl.style.display = 'block';
      newAvBase64 = '';
      newCoverBase64 = '';
      showToast(t('saveSuccess'));
      window.location.reload();
    } else {
      errEl.textContent = d.error || t('saveError');
      errEl.style.display = 'block';
      showToast(d.error || t('saveError'), 'error');
    }
  } catch (e) {
    errEl.textContent = t('connectionError');
    errEl.style.display = 'block';
    showToast(t('connectionError'), 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `${SVG.save}${t('save')}`;
  }
}

// ============================================================
//  START
// ============================================================
init();

/* expose top-level functions for inline onclick handlers */
try { window.getToken = getToken; } catch(e) {}
try { window.t = t; } catch(e) {}
try { window.applyLang = applyLang; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.toggleLangMenu = toggleLangMenu; } catch(e) {}
try { window.setLang = setLang; } catch(e) {}
try { window.verifiedBadge = verifiedBadge; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.handleSuspended = handleSuspended; } catch(e) {}
try { window.followUser = followUser; } catch(e) {}
try { window.unfollowUser = unfollowUser; } catch(e) {}
try { window.getFollowStatus = getFollowStatus; } catch(e) {}
try { window.getFollowers = getFollowers; } catch(e) {}
try { window.getFollowing = getFollowing; } catch(e) {}
try { window.init = init; } catch(e) {}
try { window.loadPublicProfile = loadPublicProfile; } catch(e) {}
try { window.loadMyProfile = loadMyProfile; } catch(e) {}
try { window.renderCover = renderCover; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.closeModal = closeModal; } catch(e) {}
try { window.renderNotFound = renderNotFound; } catch(e) {}
try { window.renderNotLogged = renderNotLogged; } catch(e) {}
try { window.roleBadge = roleBadge; } catch(e) {}
try { window.avatarInner = avatarInner; } catch(e) {}
try { window.renderPublic = renderPublic; } catch(e) {}
try { window.toggleMoreMenu = toggleMoreMenu; } catch(e) {}
try { window.checkBlockStatus = checkBlockStatus; } catch(e) {}
try { window.toggleBlockProfile = toggleBlockProfile; } catch(e) {}
try { window.openReportUserModal = openReportUserModal; } catch(e) {}
try { window.submitUserReport = submitUserReport; } catch(e) {}
try { window.renderMyProfile = renderMyProfile; } catch(e) {}
try { window.renderPosts = renderPosts; } catch(e) {}
try { window.switchTab = switchTab; } catch(e) {}
try { window.loadMyPages = loadMyPages; } catch(e) {}
try { window.openCreatePage = openCreatePage; } catch(e) {}
try { window.createPage = createPage; } catch(e) {}
try { window.sharePost = sharePost; } catch(e) {}
try { window.toggleFollow = toggleFollow; } catch(e) {}
try { window.showFollowersModal = showFollowersModal; } catch(e) {}
try { window.showFollowingModal = showFollowingModal; } catch(e) {}
try { window.renderUserList = renderUserList; } catch(e) {}
try { window.onAvatar = onAvatar; } catch(e) {}
try { window.onCover = onCover; } catch(e) {}
try { window.save = save; } catch(e) {}
try { window.toggleReactMenu = toggleReactMenu; } catch(e) {}
try { window.toggleReact = toggleReact; } catch(e) {}
try { window.toggleComments = toggleComments; } catch(e) {}
try { window.toggleReplyInput = toggleReplyInput; } catch(e) {}
try { window.sendComment = sendComment; } catch(e) {}
try { window.delComment = delComment; } catch(e) {}
try { window.delPost = delPost; } catch(e) {}
try { window.toggleSavePost = toggleSavePost; } catch(e) {}
try { window.togglePinPost = togglePinPost; } catch(e) {}
try { window.loadCloseFriendsCount = loadCloseFriendsCount; } catch(e) {}
try { window.saveAccountPrivacy = saveAccountPrivacy; } catch(e) {}
try { window.saveMessagePrivacy = saveMessagePrivacy; } catch(e) {}
try { window.openCloseFriendsModal = openCloseFriendsModal; } catch(e) {}
try { window.addCloseFriendByUsername = addCloseFriendByUsername; } catch(e) {}
try { window.removeCloseFriend = removeCloseFriend; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.openPostModal = openPostModal; } catch(e) {}
try { window.selectPostPrivacy = selectPostPrivacy; } catch(e) {}
try { window.onPostMedia = onPostMedia; } catch(e) {}
try { window.removePostMedia = removePostMedia; } catch(e) {}
try { window.fmt = fmt; } catch(e) {}
try { window.fmtBlock = fmtBlock; } catch(e) {}
try { window.fmtList = fmtList; } catch(e) {}
try { window.fmtLine = fmtLine; } catch(e) {}
try { window.fmtQuote = fmtQuote; } catch(e) {}
try { window.submitPost = submitPost; } catch(e) {}
