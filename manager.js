const LANG = {
  ar: {
    suspendedMsg: 'تم تعليق حسابك من قبل الإدارة{reason}', cantVerifyAccount: 'تعذر التحقق من الحساب', backHome: 'العودة للرئيسية',
    confirmUsernameTitle: 'تأكيد تغيير اسم المستخدم', confirmUsernameDesc: 'أرسلنا كود تأكيد إلى بريدك الحالي ({email}). أدخله لإتمام تغيير اسم المستخدم.',
    confirmEmailTitle: 'تأكيد البريد الإلكتروني الجديد', confirmEmailDesc: 'أرسلنا كود تأكيد إلى بريدك الجديد ({email}) للتحقق من ملكيته.',
    confirmPasswordTitle: 'تأكيد تغيير كلمة المرور', confirmPasswordDesc: 'أرسلنا كود تأكيد إلى بريدك ({email}) لإتمام تغيير كلمة المرور.',
    confirmDeleteTitle: 'تأكيد حذف الحساب', confirmDeleteDesc: 'أرسلنا كود تأكيد إلى بريدك ({email}). إدخاله سيحذف حسابك نهائياً ولا يمكن التراجع عن ذلك.',
    confirmDeleteBtn: 'تأكيد الحذف', confirm: 'تأكيد', resendIn: 'يمكنك إعادة الإرسال خلال {s} ثانية',
    newCodeSent: 'تم إرسال كود جديد', cantResend: 'تعذر إعادة الإرسال', cantConnectServer: 'تعذر الاتصال بالخادم',
    enter6DigitCode: 'أدخل كود التأكيد المكوّن من 6 أرقام', accountDeletedFinal: 'تم حذف حسابك نهائياً', changeApplied: 'تم تنفيذ التعديل بنجاح', wrongCode: 'كود غير صحيح',
    enterNewUsername: 'أدخل اسم المستخدم الجديد', codeSent: 'تم إرسال كود التأكيد', requestFail: 'تعذر تنفيذ الطلب',
    enterNewEmail: 'أدخل البريد الإلكتروني الجديد', allFieldsRequired: 'جميع الحقول مطلوبة',
    newPassMin6: 'كلمة المرور الجديدة 6 أحرف على الأقل', passwordsMismatch: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
    birthdateSaved: 'تم حفظ تاريخ الميلاد', cantSave: 'تعذر الحفظ', verifyRequestSent: 'تم إرسال طلب التوثيق، سيتم مراجعته من الإدارة', cantSendRequest: 'تعذر إرسال الطلب',
    mobile: 'جوال', tablet: 'تابلت', computer: 'حاسوب', noActiveSessions: 'لا توجد جلسات نشطة',
    thisDevice: 'هذا الجهاز', ipUnknown: 'IP غير معروف', endSession: 'إنهاء', cantLoadSessions: 'تعذر تحميل الجلسات',
    confirmEndSession: 'إنهاء هذه الجلسة؟ سيتم تسجيل الخروج منها فوراً.', sessionEnded: 'تم إنهاء الجلسة', cantEndSession: 'تعذر إنهاء الجلسة',
    confirmLogoutAllOther: 'تسجيل الخروج من كل الأجهزة الأخرى؟ ستبقى فقط هذه الجلسة الحالية مفعّلة.', loggedOutAllOther: 'تم تسجيل الخروج من كل الأجهزة الأخرى',
    noSecurityEventsYet: 'لا توجد أحداث أمنية مسجّلة بعد', cantLoadLog: 'تعذر تحميل السجل',
    cantCreateBackup: 'تعذر إنشاء النسخة الاحتياطية', downloadingBackup: 'جارٍ تنزيل نسخة بياناتك',
    secEv_login: 'تسجيل دخول جديد', secEv_username_changed: 'تغيير اسم المستخدم', secEv_email_changed: 'تغيير البريد الإلكتروني',
    secEv_password_changed: 'تغيير كلمة المرور', secEv_2fa_enabled: 'تفعيل المصادقة الثنائية', secEv_2fa_disabled: 'إلغاء تفعيل المصادقة الثنائية',
    secEv_admin_2fa_disabled: 'قامت الإدارة بإلغاء تفعيل المصادقة الثنائية لحسابك (إنقاذ طارئ)', secEv_session_revoked: 'إنهاء جلسة',
    secEv_sessions_revoked_all: 'تسجيل خروج من كل الأجهزة', secEv_drive_backup: 'رفع نسخة احتياطية إلى Google Drive',
    justNow: 'الآن', minutesAgo: 'منذ {n} دقيقة', hoursAgo: 'منذ {n} ساعة', daysAgo: 'منذ {n} يوم', unknown: 'غير معروف',
    driveFeatureDisabled: 'هذه الميزة غير مفعّلة على الخادم حالياً', driveFeatureUnavailable: 'ميزة Google Drive غير مفعّلة حالياً',
    cantStartSetup: 'تعذر بدء الإعداد', enable2FATitle: 'تفعيل المصادقة الثنائية', saveBackupCodesTitle: 'احفظ أكواد الاسترجاع',
    enter6DigitAppCode: 'أدخل كود التطبيق المكوّن من 6 أرقام', tfaEnabledSuccess: 'تم تفعيل المصادقة الثنائية بنجاح',
    tfaDisabled: 'تم إلغاء تفعيل المصادقة الثنائية', cantDisable: 'تعذر إلغاء التفعيل', enterCurrentPassword: 'أدخل كلمة المرور الحالية',
    accountManagement: 'إدارة الحساب', accountManagementSub: 'تحكّم في بيانات حسابك، أمانه، وخصوصيتك في هوستاكا',
    memberSince: 'عضو منذ {date}', usernameLabel: 'اسم المستخدم', usernameChangeHint: 'يتطلب تغيير اسم المستخدم تأكيد كود يُرسل إلى بريدك الإلكتروني الحالي.',
    currentUsernameIs: 'اسم المستخدم الحالي: {u}', newUsernamePlaceholder: 'اسم المستخدم الجديد', sendConfirmCode: 'إرسال كود التأكيد',
    emailLabel: 'البريد الإلكتروني', emailChangeHint: 'سيتم إرسال كود تأكيد إلى بريدك الجديد للتحقق من ملكيته قبل ربطه بحسابك.',
    currentEmailIs: 'البريد الحالي: {e}', passwordLabel: 'كلمة المرور', passwordChangeHint: 'يتطلب تغيير كلمة المرور إدخال كلمة المرور الحالية وتأكيد كود يُرسل إلى بريدك.',
    currentPassword: 'كلمة المرور الحالية', newPassword: 'كلمة المرور الجديدة', confirmNewPassword: 'تأكيد كلمة المرور الجديدة', passwordMinPlaceholder: '6 أحرف على الأقل',
    birthdate: 'تاريخ الميلاد', birthdateHint: 'يساعدنا في تخصيص تجربتك على المنصة. يمكن تعديله متى شئت دون الحاجة لتأكيد بريد.', save: 'حفظ',
    accountVerification: 'توثيق الحساب', verificationHint: 'احصل على علامة التوثيق الزرقاء بعد مراجعة طلبك من فريق الإدارة.', requestVerification: 'طلب التوثيق',
    verifiedAccount: 'حساب موثّق ✓', requestPending: 'طلبك قيد المراجعة', notVerified: 'غير موثّق',
    twoFactorAuth: 'المصادقة الثنائية (2FA)', twoFactorHint: 'طبقة حماية إضافية: بعد التفعيل، سيُطلب منك عند تسجيل الدخول إدخال كود يتولّد في تطبيق مصادقة (مثل Google Authenticator) بجانب كلمة المرور.',
    enabled: 'مفعّلة ✓', notEnabled: 'غير مفعّلة', disable: 'إلغاء التفعيل', enable2FA: 'تفعيل المصادقة الثنائية',
    devicesSessions: 'الأجهزة وجلسات الدخول', devicesSessionsHint: 'كل الأجهزة والأماكن اللي سجّلت منها دخولك. لو فيه جلسة ما تعرفها، أنهِها فوراً.',
    loading: 'جارٍ التحميل...', logoutAllOther: 'تسجيل الخروج من كل الأجهزة الأخرى',
    securityAlerts: 'تنبيهات الأمان', securityAlertsHint: 'سجل بكل الأحداث الأمنية المهمة بحسابك: تسجيل دخول جديد، تغيير كلمة المرور أو البريد، وغيرها.',
    backupTitle: 'النسخ الاحتياطي وتنزيل البيانات', backupHint: 'نزّل نسخة من بياناتك (منشوراتك، ملفك الشخصي، محفوظاتك) بصيغة JSON، أو ارفعها مباشرة إلى Google Drive.',
    downloadMyData: 'تنزيل نسخة من بياناتي', uploadToDrive: 'رفع نسخة إلى Google Drive',
    dangerZone: 'منطقة الخطر', dangerZoneHint: 'حذف حسابك سيؤدي لإزالة جميع بياناتك ومنشوراتك ورسائلك نهائياً من هوستاكا، ولا يمكن التراجع عن هذا الإجراء.', deleteAccountPermanently: 'حذف الحساب نهائياً',
    managerMembersOnly: 'إدارة الحساب متاحة للأعضاء المسجلين فقط', managerLoginHint: 'سجّل الدخول للتحكم في اسم المستخدم، البريد، كلمة المرور، وباقي إعدادات حسابك', loginBtn: 'تسجيل الدخول'
  },
  en: {
    suspendedMsg: 'Your account has been suspended by the administration{reason}', cantVerifyAccount: 'Could not verify the account', backHome: 'Back to home',
    confirmUsernameTitle: 'Confirm username change', confirmUsernameDesc: 'We sent a confirmation code to your current email ({email}). Enter it to complete the username change.',
    confirmEmailTitle: 'Confirm new email', confirmEmailDesc: 'We sent a confirmation code to your new email ({email}) to verify ownership.',
    confirmPasswordTitle: 'Confirm password change', confirmPasswordDesc: 'We sent a confirmation code to your email ({email}) to complete the password change.',
    confirmDeleteTitle: 'Confirm account deletion', confirmDeleteDesc: 'We sent a confirmation code to your email ({email}). Entering it will permanently delete your account and this cannot be undone.',
    confirmDeleteBtn: 'Confirm deletion', confirm: 'Confirm', resendIn: 'You can resend in {s}s',
    newCodeSent: 'A new code has been sent', cantResend: 'Could not resend', cantConnectServer: 'Could not connect to the server',
    enter6DigitCode: 'Enter the 6-digit confirmation code', accountDeletedFinal: 'Your account has been permanently deleted', changeApplied: 'Change applied successfully', wrongCode: 'Incorrect code',
    enterNewUsername: 'Enter the new username', codeSent: 'Confirmation code sent', requestFail: 'Could not complete the request',
    enterNewEmail: 'Enter the new email', allFieldsRequired: 'All fields are required',
    newPassMin6: 'New password must be at least 6 characters', passwordsMismatch: "New password and confirmation don't match",
    birthdateSaved: 'Birthdate saved', cantSave: 'Could not save', verifyRequestSent: 'Verification request sent, it will be reviewed by admins', cantSendRequest: 'Could not send the request',
    mobile: 'Mobile', tablet: 'Tablet', computer: 'Computer', noActiveSessions: 'No active sessions',
    thisDevice: 'This device', ipUnknown: 'Unknown IP', endSession: 'End', cantLoadSessions: 'Could not load sessions',
    confirmEndSession: 'End this session? It will be logged out immediately.', sessionEnded: 'Session ended', cantEndSession: 'Could not end the session',
    confirmLogoutAllOther: 'Log out of all other devices? Only this current session will remain active.', loggedOutAllOther: 'Logged out of all other devices',
    noSecurityEventsYet: 'No security events recorded yet', cantLoadLog: 'Could not load the log',
    cantCreateBackup: 'Could not create the backup', downloadingBackup: 'Downloading your data backup',
    secEv_login: 'New login', secEv_username_changed: 'Username changed', secEv_email_changed: 'Email changed',
    secEv_password_changed: 'Password changed', secEv_2fa_enabled: 'Two-factor authentication enabled', secEv_2fa_disabled: 'Two-factor authentication disabled',
    secEv_admin_2fa_disabled: 'Admins disabled two-factor authentication on your account (emergency recovery)', secEv_session_revoked: 'Session ended',
    secEv_sessions_revoked_all: 'Logged out of all devices', secEv_drive_backup: 'Backup uploaded to Google Drive',
    justNow: 'Just now', minutesAgo: '{n} min ago', hoursAgo: '{n}h ago', daysAgo: '{n}d ago', unknown: 'Unknown',
    driveFeatureDisabled: 'This feature is not enabled on the server right now', driveFeatureUnavailable: 'Google Drive feature is not enabled right now',
    cantStartSetup: 'Could not start setup', enable2FATitle: 'Enable Two-Factor Authentication', saveBackupCodesTitle: 'Save your recovery codes',
    enter6DigitAppCode: 'Enter the 6-digit code from the app', tfaEnabledSuccess: 'Two-factor authentication enabled successfully',
    tfaDisabled: 'Two-factor authentication disabled', cantDisable: 'Could not disable', enterCurrentPassword: 'Enter your current password',
    accountManagement: 'Account Settings', accountManagementSub: 'Control your account data, security, and privacy on Hostaka',
    memberSince: 'Member since {date}', usernameLabel: 'Username', usernameChangeHint: 'Changing your username requires confirming a code sent to your current email.',
    currentUsernameIs: 'Current username: {u}', newUsernamePlaceholder: 'New username', sendConfirmCode: 'Send confirmation code',
    emailLabel: 'Email', emailChangeHint: 'A confirmation code will be sent to your new email to verify ownership before linking it to your account.',
    currentEmailIs: 'Current email: {e}', passwordLabel: 'Password', passwordChangeHint: 'Changing your password requires your current password and confirming a code sent to your email.',
    currentPassword: 'Current password', newPassword: 'New password', confirmNewPassword: 'Confirm new password', passwordMinPlaceholder: 'At least 6 characters',
    birthdate: 'Birthdate', birthdateHint: 'Helps us personalize your experience on the platform. You can change it anytime without email confirmation.', save: 'Save',
    accountVerification: 'Account Verification', verificationHint: 'Get the blue verification badge after your request is reviewed by the admin team.', requestVerification: 'Request verification',
    verifiedAccount: 'Verified account ✓', requestPending: 'Your request is under review', notVerified: 'Not verified',
    twoFactorAuth: 'Two-Factor Authentication (2FA)', twoFactorHint: 'An extra layer of protection: once enabled, you will be asked to enter a code generated by an authenticator app (like Google Authenticator) in addition to your password when logging in.',
    enabled: 'Enabled ✓', notEnabled: 'Not enabled', disable: 'Disable', enable2FA: 'Enable Two-Factor Authentication',
    devicesSessions: 'Devices & login sessions', devicesSessionsHint: 'All the devices and places you have logged in from. If you see a session you don\'t recognize, end it immediately.',
    loading: 'Loading...', logoutAllOther: 'Log out of all other devices',
    securityAlerts: 'Security alerts', securityAlertsHint: 'A log of all important security events on your account: new logins, password or email changes, and more.',
    backupTitle: 'Backup & data export', backupHint: 'Download a copy of your data (posts, profile, saved items) as JSON, or upload it directly to Google Drive.',
    downloadMyData: 'Download a copy of my data', uploadToDrive: 'Upload a copy to Google Drive',
    dangerZone: 'Danger zone', dangerZoneHint: 'Deleting your account will permanently remove all your data, posts, and messages from Hostaka, and this action cannot be undone.', deleteAccountPermanently: 'Permanently delete account',
    managerMembersOnly: 'Account settings are available for registered members only', managerLoginHint: 'Log in to manage your username, email, password, and other account settings', loginBtn: 'Log In'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
// ----- Theme -----
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
  if(r.status===403 && data?.suspended){
    localStorage.removeItem('hostaka_token'); localStorage.removeItem('hostaka_user'); localStorage.removeItem('hostaka_role');
    await hostakaAlert(t('suspendedMsg',{reason: data.reason?':\n'+data.reason:''}));
    window.location = '/';
  }
  return data;
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

let ME = null;
let VERIFY_STATUS = null;
let otpState = { purpose:null, cooldownTimer:null };

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  const locale = currentLang === 'ar' ? 'ar-SA' : 'en-US';
  return d.toLocaleDateString(locale,{year:'numeric',month:'long',day:'numeric'});
}

function timeAgo(dateStr){
  if(!dateStr) return t('unknown');
  let d;
  if(typeof dateStr === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(dateStr)) d = new Date(dateStr.replace(' ','T')+'Z');
  else d = new Date(dateStr);
  const ms = Date.now() - d.getTime();
  if (Number.isNaN(ms)) return t('unknown');
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return t('justNow');
  if (mins < 60) return t('minutesAgo', {n: mins});
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('hoursAgo', {n: hrs});
  const days = Math.floor(hrs / 24);
  return t('daysAgo', {n: days});
}

function initials(name){
  const s = String(name||'').trim();
  return s ? s[0].toUpperCase() : 'H';
}

function OTP_LABELS_FN(){ return {
  username: { title:t('confirmUsernameTitle'), desc:(email)=>t('confirmUsernameDesc',{email:esc(email)}) },
  email:    { title:t('confirmEmailTitle'), desc:(email)=>t('confirmEmailDesc',{email:esc(email)}) },
  password: { title:t('confirmPasswordTitle'), desc:(email)=>t('confirmPasswordDesc',{email:esc(email)}) },
  delete:   { title:t('confirmDeleteTitle'), desc:(email)=>t('confirmDeleteDesc',{email:esc(email)}) },
}; }

function openOtpModal(purpose, maskedEmail){
  otpState.purpose = purpose;
  const label = OTP_LABELS_FN()[purpose];
  document.getElementById('otpTitle').textContent = label.title;
  document.getElementById('otpDesc').textContent = label.desc(maskedEmail||'');
  document.getElementById('otpErr').classList.remove('show');
  document.getElementById('otpCode').value = '';
  document.getElementById('otpConfirmBtn').textContent = purpose === 'delete' ? t('confirmDeleteBtn') : t('confirm');
  startOtpCooldown();
  openModal('otpModal');
  setTimeout(()=>document.getElementById('otpCode').focus(), 150);
}
function closeOtpModal(){
  closeModal('otpModal');
  if(otpState.cooldownTimer) clearInterval(otpState.cooldownTimer);
  otpState.purpose = null;
}

function startOtpCooldown(){
  let secs = 45;
  const btn = document.getElementById('otpResendBtn');
  const cd = document.getElementById('otpCooldown');
  btn.disabled = true;
  if(otpState.cooldownTimer) clearInterval(otpState.cooldownTimer);
  otpState.cooldownTimer = setInterval(()=>{
    secs--;
    if(secs<=0){
      clearInterval(otpState.cooldownTimer);
      btn.disabled = false;
      cd.textContent = '';
    } else {
      cd.textContent = t('resendIn',{s:secs});
    }
  }, 1000);
}

async function resendOtp(){
  if(!otpState.purpose) return;
  try{
    const d = await apiFetch('/api/account/change/resend', 'POST', { purpose: otpState.purpose });
    if(d.success){ showToast(t('newCodeSent')); startOtpCooldown(); }
    else { const e = document.getElementById('otpErr'); e.textContent = d.error||t('cantResend'); e.classList.add('show'); }
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
}

async function confirmOtp(){
  const purpose = otpState.purpose;
  if(!purpose) return;
  const code = document.getElementById('otpCode').value.trim();
  const errEl = document.getElementById('otpErr');
  errEl.classList.remove('show');
  if(!/^\d{6}$/.test(code)){ errEl.textContent=t('enter6DigitCode'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('otpConfirmBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/verify', 'POST', { purpose, code });
    if(d.success){
      if(purpose === 'delete'){
        localStorage.removeItem('hostaka_token');
        localStorage.removeItem('hostaka_user');
        localStorage.removeItem('hostaka_role');
        showToast(t('accountDeletedFinal'));
        closeOtpModal();
        setTimeout(()=>{ window.location = '/'; }, 1200);
        return;
      }
      if(d.token) localStorage.setItem('hostaka_token', d.token);
      const u = { username:d.username, role:d.role, avatar:d.avatar||'' };
      localStorage.setItem('hostaka_user', JSON.stringify(u));
      showToast(t('changeApplied'));
      closeOtpModal();
      await loadMe();
    } else {
      errEl.textContent = d.error || t('wrongCode');
      errEl.classList.add('show');
    }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Change username -----
async function requestUsernameChange(){
  const val = document.getElementById('newUsernameInput').value.trim();
  const errEl = document.getElementById('usernameErr');
  errEl.classList.remove('show');
  if(!val){ errEl.textContent=t('enterNewUsername'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('usernameBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'username', newUsername: val });
    if(d.success){ showToast(d.message||t('codeSent')); openOtpModal('username', d.maskedEmail); }
    else { errEl.textContent = d.error||t('requestFail'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Change email -----
async function requestEmailChange(){
  const val = document.getElementById('newEmailInput').value.trim();
  const errEl = document.getElementById('emailErr');
  errEl.classList.remove('show');
  if(!val){ errEl.textContent=t('enterNewEmail'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('emailBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'email', newEmail: val });
    if(d.success){ showToast(d.message||t('codeSent')); openOtpModal('email', d.maskedEmail); }
    else { errEl.textContent = d.error||t('requestFail'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Change password -----
async function requestPasswordChange(){
  const cur = document.getElementById('curPasswordInput').value;
  const nw = document.getElementById('newPasswordInput').value;
  const cf = document.getElementById('confirmPasswordInput').value;
  const errEl = document.getElementById('passwordErr');
  errEl.classList.remove('show');
  if(!cur || !nw || !cf){ errEl.textContent=t('allFieldsRequired'); errEl.classList.add('show'); return; }
  if(nw.length < 6){ errEl.textContent=t('newPassMin6'); errEl.classList.add('show'); return; }
  if(nw !== cf){ errEl.textContent=t('passwordsMismatch'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('passwordBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'password', currentPassword: cur, newPassword: nw });
    if(d.success){
      showToast(d.message||t('codeSent'));
      document.getElementById('curPasswordInput').value = '';
      document.getElementById('newPasswordInput').value = '';
      document.getElementById('confirmPasswordInput').value = '';
      openOtpModal('password', d.maskedEmail);
    } else { errEl.textContent = d.error||t('requestFail'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Birthdate -----
async function saveBirthdate(){
  const val = document.getElementById('birthdateInput').value;
  const btn = document.getElementById('birthdateBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/birthdate', 'PUT', { birth_date: val });
    if(d.success){ showToast(t('birthdateSaved')); ME.birth_date = val; }
    else { showToast(d.error||t('cantSave'), 'error'); }
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
  btn.disabled = false;
}

// ----- Request verification -----
async function requestVerifyBadge(){
  try{
    const d = await apiFetch('/api/verify/request', 'POST');
    if(d.success){ showToast(t('verifyRequestSent')); await refreshVerifyStatus(); render(); }
    else { showToast(d.error||t('cantSendRequest'), 'error'); }
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
}
async function refreshVerifyStatus(){
  try{ VERIFY_STATUS = await apiFetch('/api/verify/status'); }catch(e){ VERIFY_STATUS = null; }
}

// ----- Devices and login sessions -----
const DEVICE_ICONS = {
  'جوال': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
  'تابلت': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
  'حاسوب': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
};
// Note: DEVICE_ICONS keys stay in Arabic since the backend returns device type strings in Arabic ('جوال'/'تابلت'/'حاسوب'); UI label is localized separately via t().

async function loadSessions(){
  const box = document.getElementById('sessionsList');
  if(!box) return;
  try{
    const sessions = await apiFetch('/api/account/sessions');
    if(!Array.isArray(sessions) || !sessions.length){ box.innerHTML = `<div class="section-hint">${t('noActiveSessions')}</div>`; return; }
    box.innerHTML = sessions.map(s => `
      <div class="session-row">
        <div class="session-icon">${DEVICE_ICONS[s.device] || DEVICE_ICONS['حاسوب']}</div>
        <div class="session-info">
          <div class="session-name">${esc(s.browser)} · ${esc(s.os)} ${s.is_current ? '<span class="status-pill st-verified" style="margin-inline-start:6px;">'+t('thisDevice')+'</span>' : ''}</div>
          <div class="session-meta">${esc(s.ip || t('ipUnknown'))} · ${esc(timeAgo(s.last_active))}</div>
        </div>
        ${!s.is_current ? `<button class="btn-outline-danger" style="padding:6px 12px;font-size:0.76rem;" onclick="revokeSession(${s.id})">${t('endSession')}</button>` : ''}
      </div>
    `).join('');
  }catch(e){ box.innerHTML = `<div class="section-hint">${t('cantLoadSessions')}</div>`; }
}

async function revokeSession(id){
  if(!await hostakaConfirm(t('confirmEndSession'))) return;
  const d = await apiFetch('/api/account/sessions/'+id+'/revoke', 'POST');
  if(d.success){ showToast(t('sessionEnded')); loadSessions(); }
  else showToast(d.error||t('cantEndSession'), 'error');
}

async function revokeAllSessions(){
  if(!await hostakaConfirm(t('confirmLogoutAllOther'))) return;
  const d = await apiFetch('/api/account/sessions/revoke-all', 'POST');
  if(d.success){ showToast(t('loggedOutAllOther')); loadSessions(); }
  else showToast(d.error||t('requestFail'), 'error');
}

// ----- Security alerts -----
const SECURITY_ICONS = {
  login:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  edit:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  mail:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>`,
  lock:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  shield: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  logout: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  bell:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
};

async function loadSecurityEvents(){
  const box = document.getElementById('securityEventsList');
  if(!box) return;
  try{
    const events = await apiFetch('/api/account/security-events');
    if(!Array.isArray(events) || !events.length){ box.innerHTML = `<div class="section-hint">${t('noSecurityEventsYet')}</div>`; return; }
    box.innerHTML = events.map(ev => `
      <div class="session-row">
        <div class="session-icon">${SECURITY_ICONS[ev.icon] || SECURITY_ICONS.bell}</div>
        <div class="session-info">
          <div class="session-name">${esc(t('secEv_'+ev.type) !== 'secEv_'+ev.type ? t('secEv_'+ev.type) : ev.type)}</div>
          <div class="session-meta">${esc(ev.description||'')} · ${esc(timeAgo(ev.created_at))}</div>
        </div>
      </div>
    `).join('');
  }catch(e){ box.innerHTML = `<div class="section-hint">${t('cantLoadLog')}</div>`; }
}

// ----- Backup and Google Drive -----
async function downloadBackup(e){
  e.preventDefault();
  try{
    const r = await fetch('/api/account/backup', { headers:{ 'Authorization':'Bearer '+getToken() } });
    if(!r.ok){ showToast(t('cantCreateBackup'), 'error'); return false; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hostaka-backup.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast(t('downloadingBackup'));
  }catch(err){ showToast(t('cantConnectServer'), 'error'); }
  return false;
}

async function checkDriveConfigured(){
  const btn = document.getElementById('driveBackupBtn');
  if(!btn) return;
  try{
    const d = await apiFetch('/api/account/backup/drive/status');
    if(!d.configured){ btn.disabled = true; btn.title = t('driveFeatureDisabled'); }
  }catch(e){}
}

async function connectGoogleDrive(){
  try{
    const d = await apiFetch('/api/account/backup/drive/connect');
    if(d.url) window.location.href = d.url;
    else showToast(d.error||t('driveFeatureUnavailable'), 'error');
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
}

// ----- Two-factor authentication (2FA) -----
let tfaSetupInFlight = false;
async function start2FASetup(){
  if(tfaSetupInFlight) return; // prevents rapid repeated clicks from creating more than one secret at a time (used to cause the code to mismatch the displayed QR)
  tfaSetupInFlight = true;
  const triggerBtns = document.querySelectorAll('[onclick="start2FASetup()"]');
  triggerBtns.forEach(b => b.disabled = true);
  try{
    const d = await apiFetch('/api/account/2fa/setup', 'POST');
    if(!d.success){ showToast(d.error||t('cantStartSetup'), 'error'); return; }
    document.getElementById('tfaErr').classList.remove('show');
    document.getElementById('tfaQrImg').src = d.qrCode;
    document.getElementById('tfaSecretText').textContent = d.secret;
    document.getElementById('tfaEnableCode').value = '';
    document.getElementById('tfaStepQr').style.display = 'block';
    document.getElementById('tfaStepBackup').style.display = 'none';
    document.getElementById('tfaStepTitle').textContent = t('enable2FATitle');
    openModal('tfaSetupModal');
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
  finally{
    tfaSetupInFlight = false;
    triggerBtns.forEach(b => b.disabled = false);
  }
}

async function confirm2FAEnable(){
  const code = document.getElementById('tfaEnableCode').value.trim();
  const errEl = document.getElementById('tfaErr');
  errEl.classList.remove('show');
  if(!/^\d{6}$/.test(code)){ errEl.textContent=t('enter6DigitAppCode'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('tfaEnableBtn'); btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/2fa/enable', 'POST', { code });
    if(d.success){
      ME.totp_enabled = true;
      document.getElementById('tfaStepTitle').textContent = t('saveBackupCodesTitle');
      document.getElementById('tfaStepQr').style.display = 'none';
      document.getElementById('tfaBackupCodesList').innerHTML = d.backupCodes.map(c=>`<div>${esc(c)}</div>`).join('');
      document.getElementById('tfaStepBackup').style.display = 'block';
    } else { errEl.textContent = d.error||t('wrongCode'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

function finish2FASetup(){
  closeModal('tfaSetupModal');
  showToast(t('tfaEnabledSuccess'));
  render();
}

function open2FADisableModal(){
  document.getElementById('tfaDisableErr').classList.remove('show');
  document.getElementById('tfaDisablePassword').value = '';
  document.getElementById('tfaDisableCode').value = '';
  openModal('tfaDisableModal');
}

async function submit2FADisable(){
  const password = document.getElementById('tfaDisablePassword').value;
  const code = document.getElementById('tfaDisableCode').value.trim();
  const errEl = document.getElementById('tfaDisableErr');
  errEl.classList.remove('show');
  if(!password || !code){ errEl.textContent=t('allFieldsRequired'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('tfaDisableBtn'); btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/2fa/disable', 'POST', { password, code });
    if(d.success){
      ME.totp_enabled = false;
      closeModal('tfaDisableModal');
      showToast(t('tfaDisabled'));
      render();
    } else { errEl.textContent = d.error||t('cantDisable'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Delete account -----
function openDeleteModal(){
  document.getElementById('deleteErr').classList.remove('show');
  document.getElementById('deletePassword').value = '';
  openModal('deleteModal');
}
async function requestDeleteAccount(){
  const pass = document.getElementById('deletePassword').value;
  const errEl = document.getElementById('deleteErr');
  errEl.classList.remove('show');
  if(!pass){ errEl.textContent=t('enterCurrentPassword'); errEl.classList.add('show'); return; }
  const btn = document.getElementById('deleteConfirmBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'delete', currentPassword: pass });
    if(d.success){
      closeModal('deleteModal');
      showToast(d.message||t('codeSent'));
      openOtpModal('delete', d.maskedEmail);
    } else { errEl.textContent = d.error||t('requestFail'); errEl.classList.add('show'); }
  }catch(e){ errEl.textContent=t('cantConnectServer'); errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- Render the page -----
function verifyStatusPill(){
  if(ME?.verified) return `<span class="status-pill st-verified">${t('verifiedAccount')}</span>`;
  if(VERIFY_STATUS?.status === 'pending') return `<span class="status-pill st-pending">${t('requestPending')}</span>`;
  return `<span class="status-pill st-none">${t('notVerified')}</span>`;
}

function render(){
  const wrap = document.getElementById('wrap');
  const avatarHtml = ME.avatar ? `<img src="${esc(ME.avatar)}" alt="">` : `<img src="/default-avatar.jpg" alt="">`;
  wrap.innerHTML = `
    <div class="page-title">${t('accountManagement')}</div>
    <div class="page-sub">${t('accountManagementSub')}</div>

    <div class="acc-summary">
      <div class="acc-avatar">${avatarHtml}</div>
      <div>
        <div class="acc-name">${esc(ME.display_name||ME.username)} ${ME.verified ? `<span class="badge-verified"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></span>` : ''}</div>
        <div class="acc-meta">${t('memberSince',{date:fmtDate(ME.created_at)})}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${t('usernameLabel')}
      </div>
      <div class="section-hint">${t('usernameChangeHint')}</div>
      <div class="f-current">${t('currentUsernameIs',{u:'<b>@'+esc(ME.username)+'</b>'})}</div>
      <div class="err" id="usernameErr"></div>
      <div class="fg"><input type="text" id="newUsernameInput" class="f-input" placeholder="${t('newUsernamePlaceholder')}" dir="ltr"></div>
      <button class="btn-submit" id="usernameBtn" onclick="requestUsernameChange()">${t('sendConfirmCode')}</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
        ${t('emailLabel')}
      </div>
      <div class="section-hint">${t('emailChangeHint')}</div>
      <div class="f-current">${t('currentEmailIs',{e:'<b>'+esc(ME.email||'')+'</b>'})}</div>
      <div class="err" id="emailErr"></div>
      <div class="fg"><input type="email" id="newEmailInput" class="f-input" placeholder="example@mail.com" dir="ltr"></div>
      <button class="btn-submit" id="emailBtn" onclick="requestEmailChange()">${t('sendConfirmCode')}</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ${t('passwordLabel')}
      </div>
      <div class="section-hint">${t('passwordChangeHint')}</div>
      <div class="err" id="passwordErr"></div>
      <div class="fg"><label class="f-label">${t('currentPassword')}</label><input type="password" id="curPasswordInput" class="f-input" placeholder="••••••••" autocomplete="current-password"></div>
      <div class="fg"><label class="f-label">${t('newPassword')}</label><input type="password" id="newPasswordInput" class="f-input" placeholder="${t('passwordMinPlaceholder')}" autocomplete="new-password"></div>
      <div class="fg"><label class="f-label">${t('confirmNewPassword')}</label><input type="password" id="confirmPasswordInput" class="f-input" placeholder="••••••••" autocomplete="new-password"></div>
      <button class="btn-submit" id="passwordBtn" onclick="requestPasswordChange()">${t('sendConfirmCode')}</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${t('birthdate')}
      </div>
      <div class="section-hint">${t('birthdateHint')}</div>
      <div class="fg"><input type="date" id="birthdateInput" class="f-input" value="${esc(ME.birth_date||'')}"></div>
      <button class="btn-submit" id="birthdateBtn" onclick="saveBirthdate()">${t('save')}</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        ${t('accountVerification')}
      </div>
      <div class="section-hint">${t('verificationHint')}</div>
      <div class="verify-status">
        ${verifyStatusPill()}
        ${(!ME.verified && VERIFY_STATUS?.status !== 'pending') ? `<button class="btn-submit" onclick="requestVerifyBadge()">${t('requestVerification')}</button>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ${t('twoFactorAuth')}
      </div>
      <div class="section-hint">${t('twoFactorHint')}</div>
      <div class="verify-status">
        ${ME.totp_enabled ? `<span class="status-pill st-verified">${t('enabled')}</span>` : `<span class="status-pill st-none">${t('notEnabled')}</span>`}
        ${ME.totp_enabled
          ? `<button class="btn-outline-danger" onclick="open2FADisableModal()">${t('disable')}</button>`
          : `<button class="btn-submit" onclick="start2FASetup()">${t('enable2FA')}</button>`}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        ${t('devicesSessions')}
      </div>
      <div class="section-hint">${t('devicesSessionsHint')}</div>
      <div id="sessionsList"><div class="section-hint">${t('loading')}</div></div>
      <button class="btn-outline-danger" style="margin-top:10px;" onclick="revokeAllSessions()">${t('logoutAllOther')}</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        ${t('securityAlerts')}
      </div>
      <div class="section-hint">${t('securityAlertsHint')}</div>
      <div id="securityEventsList"><div class="section-hint">${t('loading')}</div></div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('backupTitle')}
      </div>
      <div class="section-hint">${t('backupHint')}</div>
      <div class="verify-status">
        <a class="btn-submit" style="text-decoration:none;display:inline-flex;align-items:center;" href="/api/account/backup" onclick="return downloadBackup(event)">${t('downloadMyData')}</a>
        <button class="btn-ghost" id="driveBackupBtn" onclick="connectGoogleDrive()">${t('uploadToDrive')}</button>
      </div>
    </div>

    <div class="section danger-zone">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        ${t('dangerZone')}
      </div>
      <div class="section-hint">${t('dangerZoneHint')}</div>
      <button class="btn-outline-danger" onclick="openDeleteModal()">${t('deleteAccountPermanently')}</button>
    </div>
  `;
  loadSessions();
  loadSecurityEvents();
  checkDriveConfigured();
}

async function loadMe(){
  const token = getToken();
  if(!token){
    document.getElementById('wrap').innerHTML = `
      <div class="login-gate">
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">${t('managerMembersOnly')}</div>
        <div style="color:var(--muted);font-size:0.85rem;">${t('managerLoginHint')}</div>
        <a href="/">${t('loginBtn')}</a>
      </div>`;
    return;
  }
  try{
    ME = await apiFetch('/api/me');
    if(!ME || ME.error) throw new Error('unauth');
  }catch(e){
    document.getElementById('wrap').innerHTML = `<div class="login-gate"><div style="font-weight:800;">${t('cantVerifyAccount')}</div><a href="/">${t('backHome')}</a></div>`;
    return;
  }
  await refreshVerifyStatus();
  render();
}

loadMe();

/* expose top-level functions for inline onclick handlers */
try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.getToken = getToken; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.openModal = openModal; } catch(e) {}
try { window.closeModal = closeModal; } catch(e) {}
try { window.openOtpModal = openOtpModal; } catch(e) {}
try { window.closeOtpModal = closeOtpModal; } catch(e) {}
try { window.resendOtp = resendOtp; } catch(e) {}
try { window.confirmOtp = confirmOtp; } catch(e) {}
try { window.requestUsernameChange = requestUsernameChange; } catch(e) {}
try { window.requestEmailChange = requestEmailChange; } catch(e) {}
try { window.requestPasswordChange = requestPasswordChange; } catch(e) {}
try { window.saveBirthdate = saveBirthdate; } catch(e) {}
try { window.requestVerifyBadge = requestVerifyBadge; } catch(e) {}
try { window.start2FASetup = start2FASetup; } catch(e) {}
try { window.confirm2FAEnable = confirm2FAEnable; } catch(e) {}
try { window.finish2FASetup = finish2FASetup; } catch(e) {}
try { window.open2FADisableModal = open2FADisableModal; } catch(e) {}
try { window.submit2FADisable = submit2FADisable; } catch(e) {}
try { window.openDeleteModal = openDeleteModal; } catch(e) {}
try { window.requestDeleteAccount = requestDeleteAccount; } catch(e) {}
try { window.revokeSession = revokeSession; } catch(e) {}
try { window.revokeAllSessions = revokeAllSessions; } catch(e) {}
try { window.downloadBackup = downloadBackup; } catch(e) {}
try { window.connectGoogleDrive = connectGoogleDrive; } catch(e) {}
try { window.render = render; } catch(e) {}
try { window.loadMe = loadMe; } catch(e) {}
