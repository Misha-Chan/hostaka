/*
 * Hostaka i18n — synchronous, zero-network translation system.
 *
 * IMPORTANT: translations are embedded directly below as JS objects
 * (not fetched from /translations/*.json). This is intentional: an
 * earlier fetch-based version could show raw "namespace.key" text for
 * a moment (or indefinitely) on slow/unreliable connections. Embedding
 * the dictionaries directly in this file means they are available the
 * instant this script runs — no network round-trip, no race condition,
 * no flash of untranslated keys, ever.
 *
 * If you add a new data-i18n key to any page, add its translation to
 * BOTH the DICTS.en and DICTS.ar objects below (keep them in sync).
 */
(function () {
  var DICTS = {
    en: {
  "admin": {
    "activeNow": "Active Now 🟢",
    "analytics": "Analytics",
    "bounce7d": "Bounce Rate (7 days)",
    "clearLogs": "Clear all logs",
    "colActions": "Actions",
    "colEmail": "Email",
    "colRole": "Role",
    "colStatus": "Status",
    "colUser": "User",
    "colVerify": "Verification",
    "loggedInAs": "Logged in as",
    "loginBtn": "Log In",
    "logout": "Log Out",
    "logsAll": "All",
    "logsErrors": "Errors",
    "logsTitle": "Logs",
    "logsWarnings": "Warnings",
    "menu": "Menu",
    "navDashboard": "Dashboard",
    "navLogs": "Logs",
    "navNotify": "Send Notification",
    "navPosts": "Posts",
    "navReports": "Reports & Support",
    "navUsers": "Users",
    "navVerify": "Verification",
    "navViewPlatform": "View Platform",
    "newSignupsToday": "New Signups Today",
    "notifyContentLabel": "Notification text *",
    "notifyLinkLabel": "Link on tap (optional)",
    "notifyPlaceholderContent": "e.g. New update on the platform!",
    "notifyPlaceholderLink": "/ or /profile?u=...",
    "notifySend": "Send Notification",
    "notifyTarget": "Target",
    "notifyTargetAll": "All members",
    "notifyTargetUser": "Specific user",
    "notifyTitle": "Send Notification to Members",
    "notifyUsernameLabel": "Username (without @)",
    "panel": "Admin Panel",
    "postsTitle": "Posts",
    "refresh": "Refresh",
    "reportsDismissed": "Dismissed",
    "reportsPending": "Pending",
    "reportsResolved": "Resolved",
    "reportsTitle": "Reports & Support Requests",
    "statPosts": "Posts",
    "statUsers": "Users",
    "statVerify": "Verify Requests",
    "topPages7d": "Top Pages (7 days)",
    "topSources7d": "Top Traffic Sources (7 days)",
    "uniqueToday": "Unique Visitors Today",
    "usersTitle": "Users",
    "verifyTitle": "Verification Requests",
    "views7d": "Views (7 days)",
    "viewsToday": "Views Today",
    "visits14d": "Visits — Last 14 Days",
    "welcome": "Welcome to Hostaka Admin"
  },
  "chat": {
    "blockUser": "Block user",
    "chatMedia": "Chat media",
    "chatOptions": "Chat options",
    "chatSettings": "Chat settings",
    "createNewGroup": "Create new group",
    "groupNamePlaceholder": "Group name *",
    "newGroup": "New group",
    "pageTitle": "Hostaka — Messages",
    "reasonSpamMsgs": "Spam messages",
    "reportUser": "Report user",
    "selectConversation": "Select a conversation from the list",
    "title": "Messages"
  },
  "common": {
    "back": "Back",
    "cancel": "Cancel",
    "changeLanguage": "Change language",
    "close": "Close",
    "confirm": "Confirm",
    "create": "Create",
    "delete": "Delete",
    "done": "Done",
    "email": "Email",
    "loading": "Loading...",
    "password": "Password",
    "save": "Save",
    "toggleTheme": "Toggle theme",
    "video": "Video"
  },
  "group": {
    "add": "Add",
    "addMembers": "Add members",
    "deleteGroup": "Delete group",
    "descPlaceholder": "Group description (optional)",
    "groupSettings": "Group settings",
    "leaveGroup": "Leave group",
    "members": "Members",
    "pageTitle": "Hostaka — Group",
    "reasonNudity": "Inappropriate content",
    "reportGroupChat": "Report group chat",
    "reportMessage": "Report message",
    "showReadReceipts": "Show read receipts",
    "viewChatMedia": "View chat media"
  },
  "index": {
    "confirm2FA": "Confirm Two-Factor Authentication",
    "confirmLogin": "Confirm log in",
    "createAccount": "Create account",
    "createStory": "Create story",
    "downloadAndroid": "Download Android app",
    "loadingPosts": "Loading posts...",
    "loginRegister": "Log In / Sign Up",
    "markAllRead": "Mark all as read",
    "noNotifications": "No notifications",
    "notifications": "Notifications",
    "open2FAApp": "Open your authenticator app and enter the 6-digit code, or use one of your backup recovery codes.",
    "publishStory": "Publish story",
    "report": "Report",
    "requestVerify": "Request verification",
    "searchPosts": "Search posts...",
    "tagline": "An open social platform for everyone",
    "wallpaperDescLong": "Choose your own background image — the platform's colors (buttons, interactions, avatars) will automatically adapt to the image's colors for a cohesive visual experience.",
    "writeCaption": "Write a caption (optional)..."
  },
  "login": {
    "backToHostaka": "← Back to Hostaka",
    "backToLogin": "Back to log in",
    "changeEmail": "Change email",
    "codeHint": "We'll send a 6-digit code to your email to verify it.",
    "codeSentTo": "We sent a confirmation code to",
    "confirmAndCreate": "Confirm and create account",
    "confirmCode": "Confirmation code",
    "confirmEmail": "Confirm your email",
    "enterBelowToCreate": "Enter it below to create your account.",
    "enterWithNewPassword": "Enter it along with your new password.",
    "forgotPassword": "Forgot your password?",
    "loginBtn": "Log In",
    "newPassword": "New password",
    "pageTitle": "Log In — Hostaka",
    "passwordMinPlaceholder": "At least 6 characters",
    "recoverPassword": "Recover your password",
    "recoverSub": "Enter your email and we'll send you a confirmation code to reset your password.",
    "resendCode": "Resend code",
    "sendCode": "Send confirmation code",
    "setNewPassword": "Set a new password",
    "setPasswordBtn": "Set password",
    "tabLogin": "Log In",
    "tabRegister": "New Account",
    "username": "Username",
    "usernamePlaceholder": "Your name on the platform"
  },
  "manager": {
    "confirmOperation": "Confirm operation",
    "continueDelete": "Continue deletion",
    "currentOrBackupCode": "Current authentication code or a backup code",
    "currentPassword": "Current password",
    "deleteAccountDesc": "This action cannot be undone. Your account, posts, messages, and all your Hostaka data will be permanently deleted after confirming your password and a code sent to your email.",
    "deleteAccountPermanently": "Permanently delete account",
    "disable2FA": "Disable Two-Factor Authentication",
    "disableIt": "Disable",
    "enable": "Enable",
    "enable2FA": "Enable Two-Factor Authentication",
    "enabledSuccessDesc": "Successfully enabled ✓ Save the following recovery codes somewhere safe — each code can only be used once if you lose access to your authenticator app. These codes will not be shown again.",
    "orEnterSecret": "Or enter this secret manually:",
    "pageTitle": "Hostaka — Account Settings",
    "savedCodes": "Done, I saved them",
    "scanQrDesc": "Scan the QR code below with an authenticator app like Google Authenticator or Authy, then enter the 6-digit code shown to confirm activation.",
    "title": "Account Settings"
  },
  "page": {
    "bio": "Bio",
    "category": "Category",
    "categoryPlaceholder": "Gaming, Tech, Art...",
    "changeAvatar": "Change avatar",
    "changeCover": "Change cover",
    "editPage": "Edit Page",
    "pageName": "Page name",
    "pageTitle": "Hostaka — Page",
    "title": "Page"
  },
  "post": {
    "pageTitle": "Hostaka — Post",
    "title": "Post"
  },
  "profile": {
    "additionalDetails": "Additional details (optional)",
    "attachMedia": "Attach image or video",
    "fmtBold": "Bold",
    "fmtDivider": "Divider",
    "fmtHeading": "Heading",
    "fmtItalic": "Italic",
    "fmtList": "List",
    "fmtQuote": "Quote",
    "fmtSubheading": "Subheading",
    "fmtUnderline": "Underline",
    "followers": "Followers",
    "media": "Media",
    "newPost": "New post",
    "pageTitle": "Hostaka — Profile",
    "postAs": "Post as",
    "postPrivacy": "Post privacy",
    "privacyCloseFriends": "Close friends",
    "privacyDraft": "Draft",
    "privacyPrivate": "Private",
    "privacyPublic": "Public",
    "publish": "Publish",
    "reasonAbuse": "Abuse or harassment",
    "reasonFake": "Fake or impersonation account",
    "reasonOther": "Other reason",
    "reasonSpam": "Spam / unwanted content",
    "removeFile": "Remove file",
    "reportUser": "Report user",
    "scheduleLater": "Schedule for later (optional)",
    "sendReport": "Send report",
    "title": "Profile",
    "writePostHere": "Write your post here..."
  },
  "save": {
    "pageTitle": "Hostaka — Saved",
    "title": "Saved"
  },
  "shiziai": {
    "autoTheme": "Auto-change theme based on background colors",
    "blur": "Background blur",
    "newChat": "New chat",
    "noWallpaper": "No background set",
    "online": "Online now",
    "overlayDim": "Overlay brightness",
    "removeWallpaper": "Remove background",
    "typeMessage": "Type your message...",
    "uploadWallpaper": "Upload background image",
    "wallpaperDesc": "Choose a background image of your own, like a desktop wallpaper — the interface turns into glass cards, and the theme automatically adapts to the image's colors.",
    "wallpaperTitle": "Platform background"
  },
  "short": {
    "addComment": "Add a comment...",
    "comments": "Comments",
    "pageTitle": "Hostaka — Reels",
    "title": "Reels"
  },
  "support": {
    "pageTitle": "Hostaka — Support & Help",
    "title": "Support & Help"
  },
  "video": {
    "title": "Hostaka Video"
  }
},
    ar: {
  "admin": {
    "activeNow": "نشط الآن 🟢",
    "analytics": "التحليلات (Analytics)",
    "bounce7d": "معدل الارتداد (7 أيام)",
    "clearLogs": "مسح كل السجلات",
    "colActions": "إجراءات",
    "colEmail": "البريد",
    "colRole": "الصلاحية",
    "colStatus": "الحالة",
    "colUser": "المستخدم",
    "colVerify": "التوثيق",
    "loggedInAs": "مسجل كـ",
    "loginBtn": "دخول",
    "logout": "تسجيل الخروج",
    "logsAll": "الكل",
    "logsErrors": "أخطاء",
    "logsTitle": "السجلات (Logs)",
    "logsWarnings": "تحذيرات",
    "menu": "القائمة",
    "navDashboard": "الرئيسية",
    "navLogs": "السجلات (Logs)",
    "navNotify": "إرسال إشعار",
    "navPosts": "المنشورات",
    "navReports": "البلاغات والدعم",
    "navUsers": "المستخدمون",
    "navVerify": "التوثيق",
    "navViewPlatform": "عرض المنصة",
    "newSignupsToday": "تسجيلات جديدة اليوم",
    "notifyContentLabel": "نص الإشعار *",
    "notifyLinkLabel": "رابط عند الضغط (اختياري)",
    "notifyPlaceholderContent": "مثال: تحديث جديد على المنصة!",
    "notifyPlaceholderLink": "/ أو /profile?u=...",
    "notifySend": "إرسال الإشعار",
    "notifyTarget": "الوجهة",
    "notifyTargetAll": "جميع الأعضاء",
    "notifyTargetUser": "مستخدم محدد",
    "notifyTitle": "إرسال إشعار للأعضاء",
    "notifyUsernameLabel": "اسم المستخدم (بدون @)",
    "panel": "لوحة الإدارة",
    "postsTitle": "المنشورات",
    "refresh": "تحديث",
    "reportsDismissed": "مرفوض",
    "reportsPending": "قيد المراجعة",
    "reportsResolved": "تم الحل",
    "reportsTitle": "البلاغات وطلبات الدعم",
    "statPosts": "منشور",
    "statUsers": "مستخدم",
    "statVerify": "طلب توثيق",
    "topPages7d": "أكثر الصفحات زيارة (7 أيام)",
    "topSources7d": "مصادر الزيارات (7 أيام)",
    "uniqueToday": "زوار فريدون اليوم",
    "usersTitle": "المستخدمون",
    "verifyTitle": "طلبات التوثيق",
    "views7d": "زيارات آخر 7 أيام",
    "viewsToday": "زيارات اليوم",
    "visits14d": "الزيارات — آخر 14 يوم",
    "welcome": "مرحباً بك في Hostaka Admin"
  },
  "chat": {
    "blockUser": "حظر المستخدم",
    "chatMedia": "وسائط المحادثة",
    "chatOptions": "خيارات المحادثة",
    "chatSettings": "إعدادات المحادثة",
    "createNewGroup": "إنشاء مجموعة جديدة",
    "groupNamePlaceholder": "اسم المجموعة *",
    "newGroup": "جروب جديد",
    "pageTitle": "Hostaka — الرسائل",
    "reasonSpamMsgs": "رسائل مزعجة",
    "reportUser": "الإبلاغ عن المستخدم",
    "selectConversation": "اختر محادثة من القائمة",
    "title": "الرسائل"
  },
  "common": {
    "back": "رجوع",
    "cancel": "إلغاء",
    "changeLanguage": "تغيير اللغة",
    "close": "إغلاق",
    "confirm": "تأكيد",
    "create": "إنشاء",
    "delete": "حذف",
    "done": "تم",
    "email": "البريد الإلكتروني",
    "loading": "جارٍ التحميل...",
    "password": "كلمة المرور",
    "save": "حفظ",
    "toggleTheme": "تبديل الثيم",
    "video": "فيديو"
  },
  "group": {
    "add": "إضافة",
    "addMembers": "إضافة أعضاء",
    "deleteGroup": "حذف المجموعة",
    "descPlaceholder": "وصف المجموعة (اختياري)",
    "groupSettings": "إعدادات المجموعة",
    "leaveGroup": "مغادرة المجموعة",
    "members": "الأعضاء",
    "pageTitle": "Hostaka — المجموعة",
    "reasonNudity": "محتوى غير لائق",
    "reportGroupChat": "الإبلاغ عن الدردشة الجماعية",
    "reportMessage": "الإبلاغ عن رسالة",
    "showReadReceipts": "إظهار مؤشر قراءة الرسائل",
    "viewChatMedia": "عرض وسائط المحادثة"
  },
  "index": {
    "confirm2FA": "تأكيد المصادقة الثنائية",
    "confirmLogin": "تأكيد الدخول",
    "createAccount": "إنشاء الحساب",
    "createStory": "إنشاء قصة",
    "downloadAndroid": "تحميل تطبيق الأندرويد",
    "loadingPosts": "جارٍ تحميل المنشورات...",
    "loginRegister": "دخول / تسجيل",
    "markAllRead": "تعليم الكل كمقروء",
    "noNotifications": "لا توجد إشعارات",
    "notifications": "الإشعارات",
    "open2FAApp": "افتح تطبيق المصادقة على جهازك وأدخل الكود المكوّن من 6 أرقام، أو استخدم أحد أكواد الاسترجاع الاحتياطية.",
    "publishStory": "نشر القصة",
    "report": "الإبلاغ",
    "requestVerify": "طلب التوثيق",
    "searchPosts": "ابحث في المنشورات...",
    "tagline": "منصة تواصل اجتماعي مفتوحة للجميع",
    "wallpaperDescLong": "اختر صورة خلفية خاصة بك — ستتكيّف ألوان المنصة (أزرار، تفاعلات، صور رمزية) تلقائيًا مع ألوان الصورة لتجربة بصرية متناسقة.",
    "writeCaption": "اكتب تعليقاً (اختياري)..."
  },
  "login": {
    "backToHostaka": "→ العودة إلى Hostaka",
    "backToLogin": "العودة لتسجيل الدخول",
    "changeEmail": "تغيير البريد الإلكتروني",
    "codeHint": "سنرسل لك كوداً مكوناً من 6 أرقام إلى بريدك الإلكتروني للتأكد من صحته.",
    "codeSentTo": "أرسلنا كود تأكيد إلى",
    "confirmAndCreate": "تأكيد وإنشاء الحساب",
    "confirmCode": "كود التأكيد",
    "confirmEmail": "تأكيد بريدك الإلكتروني",
    "enterBelowToCreate": "أدخله بالأسفل لإنشاء حسابك.",
    "enterWithNewPassword": "أدخله مع كلمة المرور الجديدة.",
    "forgotPassword": "هل نسيت كلمة المرور؟",
    "loginBtn": "دخول",
    "newPassword": "كلمة المرور الجديدة",
    "pageTitle": "تسجيل الدخول — Hostaka",
    "passwordMinPlaceholder": "6 أحرف على الأقل",
    "recoverPassword": "استعادة كلمة المرور",
    "recoverSub": "أدخل بريدك الإلكتروني وسنرسل لك كود تأكيد لإعادة تعيين كلمة المرور.",
    "resendCode": "إعادة إرسال الكود",
    "sendCode": "إرسال كود التأكيد",
    "setNewPassword": "تعيين كلمة مرور جديدة",
    "setPasswordBtn": "تعيين كلمة المرور",
    "tabLogin": "دخول",
    "tabRegister": "حساب جديد",
    "username": "اسم المستخدم",
    "usernamePlaceholder": "اسمك على المنصة"
  },
  "manager": {
    "confirmOperation": "تأكيد العملية",
    "continueDelete": "متابعة الحذف",
    "currentOrBackupCode": "كود المصادقة الحالي أو كود احتياطي",
    "currentPassword": "كلمة المرور الحالية",
    "deleteAccountDesc": "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف حسابك، منشوراتك، رسائلك، وكل بياناتك على هوستاكا نهائياً بعد تأكيد كلمة المرور وكود يُرسل إلى بريدك الإلكتروني.",
    "deleteAccountPermanently": "حذف الحساب نهائياً",
    "disable2FA": "إلغاء تفعيل المصادقة الثنائية",
    "disableIt": "إلغاء التفعيل",
    "enable": "تفعيل",
    "enable2FA": "تفعيل المصادقة الثنائية",
    "enabledSuccessDesc": "تم التفعيل بنجاح ✓ احفظ أكواد الاسترجاع التالية في مكان آمن — كل كود يُستخدم مرة واحدة فقط لو فقدت الوصول لتطبيق المصادقة. لن تظهر هذه الأكواد مرة أخرى.",
    "orEnterSecret": "أو أدخل هذا السر يدوياً:",
    "pageTitle": "Hostaka — إدارة الحساب",
    "savedCodes": "تم، لقد حفظتها",
    "scanQrDesc": "امسح رمز QR التالي بتطبيق مصادقة مثل Google Authenticator أو Authy، ثم أدخل الكود المكوّن من 6 أرقام الذي يظهر لتأكيد التفعيل.",
    "title": "إدارة الحساب"
  },
  "page": {
    "bio": "نبذة",
    "category": "الفئة",
    "categoryPlaceholder": "ألعاب، تقنية، فن...",
    "changeAvatar": "تغيير الصورة",
    "changeCover": "تغيير الغلاف",
    "editPage": "تعديل الصفحة",
    "pageName": "اسم الصفحة",
    "pageTitle": "Hostaka — صفحة",
    "title": "صفحة"
  },
  "post": {
    "pageTitle": "Hostaka — منشور",
    "title": "منشور"
  },
  "profile": {
    "additionalDetails": "تفاصيل إضافية (اختياري)",
    "attachMedia": "إرفاق صورة أو فيديو",
    "fmtBold": "غامق",
    "fmtDivider": "فاصل",
    "fmtHeading": "عنوان",
    "fmtItalic": "مائل",
    "fmtList": "قائمة",
    "fmtQuote": "اقتباس",
    "fmtSubheading": "عنوان فرعي",
    "fmtUnderline": "تسطير",
    "followers": "المتابعون",
    "media": "وسائط",
    "newPost": "منشور جديد",
    "pageTitle": "Hostaka — الملف الشخصي",
    "postAs": "النشر باسم",
    "postPrivacy": "خصوصية المنشور",
    "privacyCloseFriends": "أصدقاء مقربون",
    "privacyDraft": "مسودة",
    "privacyPrivate": "خاص",
    "privacyPublic": "عام",
    "publish": "نشر",
    "reasonAbuse": "إساءة أو تنمر",
    "reasonFake": "حساب مزيف أو منتحل",
    "reasonOther": "سبب آخر",
    "reasonSpam": "محتوى مزعج / سبام",
    "removeFile": "إزالة الملف",
    "reportUser": "الإبلاغ عن مستخدم",
    "scheduleLater": "جدولة النشر لوقت لاحق (اختياري)",
    "sendReport": "إرسال البلاغ",
    "title": "الملف الشخصي",
    "writePostHere": "اكتب منشورك هنا..."
  },
  "save": {
    "pageTitle": "Hostaka — المحفوظات",
    "title": "المحفوظات"
  },
  "shiziai": {
    "autoTheme": "تغيير الثيم تلقائيًا حسب ألوان الخلفية",
    "blur": "تمويه الخلفية",
    "newChat": "محادثة جديدة",
    "noWallpaper": "لا توجد خلفية محددة",
    "online": "متصلة الآن",
    "overlayDim": "إضاءة التراكب",
    "removeWallpaper": "إزالة الخلفية",
    "typeMessage": "اكتب رسالتك...",
    "uploadWallpaper": "رفع صورة خلفية",
    "wallpaperDesc": "اختر صورة خلفية خاصة بك، مثل خلفية سطح المكتب — تتحول الواجهة لبطاقات زجاجية، ويتكيّف الثيم تلقائيًا مع ألوان الصورة.",
    "wallpaperTitle": "خلفية المنصة"
  },
  "short": {
    "addComment": "أضف تعليقاً...",
    "comments": "التعليقات",
    "pageTitle": "Hostaka — الريلز",
    "title": "الريلز"
  },
  "support": {
    "pageTitle": "Hostaka — الدعم والمساعدة",
    "title": "الدعم والمساعدة"
  },
  "video": {
    "title": "Hostaka Video"
  }
}
  };

  function getLang() {
    var saved = localStorage.getItem('hostaka_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  }

  var currentLang = getLang();
  window.currentLang = currentLang;

  function t(key, fallback) {
    var parts = key.split('.');
    var node = DICTS[currentLang] || DICTS.en;
    for (var i = 0; i < parts.length; i++) {
      if (node && typeof node === 'object' && parts[i] in node) {
        node = node[parts[i]];
      } else {
        node = undefined;
        break;
      }
    }
    if (node === undefined && currentLang !== 'en') {
      // fall back to English if the key is missing in the active language
      node = DICTS.en;
      for (var j = 0; j < parts.length; j++) {
        if (node && typeof node === 'object' && parts[j] in node) node = node[parts[j]];
        else { node = undefined; break; }
      }
    }
    if (typeof node === 'string') return node;
    return fallback !== undefined ? fallback : key;
  }
  window.t = t;

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (el.dataset.i18nFallback === undefined) el.dataset.i18nFallback = el.textContent;
      el.textContent = t(key, el.dataset.i18nFallback);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (el.dataset.i18nPlaceholderFallback === undefined) el.dataset.i18nPlaceholderFallback = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', t(key, el.dataset.i18nPlaceholderFallback));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (el.dataset.i18nTitleFallback === undefined) el.dataset.i18nTitleFallback = el.getAttribute('title') || '';
      el.setAttribute('title', t(key, el.dataset.i18nTitleFallback));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (el.dataset.i18nAriaFallback === undefined) el.dataset.i18nAriaFallback = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', t(key, el.dataset.i18nAriaFallback));
    });
  }
  window.applyTranslations = applyTranslations;

  function applyDocumentDirection() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  window.setHostakaLang = function (lang) {
    if (lang !== 'en' && lang !== 'ar') return;
    currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem('hostaka_lang', lang);
    applyDocumentDirection();
    applyTranslations();
    document.dispatchEvent(new CustomEvent('hostaka:langchange', { detail: { lang: lang } }));
  };

  function init() {
    applyDocumentDirection();
    applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
