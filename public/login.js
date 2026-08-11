const LANG = {
  ar: {
    login: 'دخول', enter2faCode: 'أدخل كود المصادقة الثنائية من تطبيق المصادقة:',
    emailPassRequired: 'البريد وكلمة المرور مطلوبان', loginFail: 'فشل تسجيل الدخول', cantConnectServer: 'تعذر الاتصال بالخادم',
    allFieldsRequired: 'جميع الحقول مطلوبة', passMin6: 'كلمة المرور 6 أحرف على الأقل', sendCode: 'إرسال كود التأكيد',
    cantSendCode: 'تعذر إرسال كود التأكيد', enter6DigitCode: 'أدخل كود التأكيد المكون من 6 أرقام',
    wrongCode: 'كود غير صحيح', confirmAndCreate: 'تأكيد وإنشاء الحساب', resendIn: 'إعادة الإرسال بعد {s} ثانية',
    resendCode: 'إعادة إرسال الكود', newCodeSent: 'تم إرسال كود جديد إلى بريدك الإلكتروني', cantResend: 'تعذر إعادة إرسال الكود',
    emailRequired: 'البريد الإلكتروني مطلوب', cantResetPass: 'تعذر إعادة تعيين كلمة المرور', setPassword: 'تعيين كلمة المرور'
  },
  en: {
    login: 'Log In', enter2faCode: 'Enter the two-factor code from your authenticator app:',
    emailPassRequired: 'Email and password are required', loginFail: 'Log in failed', cantConnectServer: 'Could not connect to the server',
    allFieldsRequired: 'All fields are required', passMin6: 'Password must be at least 6 characters', sendCode: 'Send confirmation code',
    cantSendCode: 'Could not send confirmation code', enter6DigitCode: 'Enter the 6-digit confirmation code',
    wrongCode: 'Incorrect code', confirmAndCreate: 'Confirm and create account', resendIn: 'Resend in {s}s',
    resendCode: 'Resend code', newCodeSent: 'A new code has been sent to your email', cantResend: 'Could not resend the code',
    emailRequired: 'Email is required', cantResetPass: 'Could not reset password', setPassword: 'Set password'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
// ----- Theme (consistent with the rest of the platform) -----
(function(){
  const saved = localStorage.getItem('hostaka_theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme','dark');
  }
})();

// ===== دعم ?next= للعودة للنطاق الفرعي اللي طلب تسجيل الدخول (orbithub/aethercast/console...) =====
function getNextUrl() {
  const params = new URLSearchParams(location.search);
  const next = params.get('next');
  if (!next) return '/';
  try {
    const u = new URL(next, location.origin);
    // أمان: نسمح فقط بالتحويل لنطاقات هوستاكا نفسها (منع open redirect)
    if (/^([a-z0-9-]+\.)?hostaka\.fun$/i.test(u.hostname)) return u.href;
  } catch (e) {}
  return '/';
}

// If the user is already logged in, redirect them to the home page (or ?next=)
if (localStorage.getItem('hostaka_token')) {
  location.href = getNextUrl();
}

async function apiFetch(url, method='GET', body=null){
  const opts = { method, headers:{'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  let d = {};
  try { d = await r.json(); } catch(e){}
  d.__status = r.status;
  return d;
}

function switchTab(tab){
  document.getElementById('tabLoginBtn').classList.toggle('active', tab==='login');
  document.getElementById('tabRegisterBtn').classList.toggle('active', tab!=='login');
  document.getElementById('paneLogin').classList.toggle('active', tab==='login');
  document.getElementById('paneRegStart').classList.toggle('active', tab!=='login');
  document.getElementById('paneRegVerify').classList.remove('active');
  document.getElementById('paneForgotStart').classList.remove('active');
  document.getElementById('paneForgotReset').classList.remove('active');
}

function goToForgot(){
  document.getElementById('paneLogin').classList.remove('active');
  document.getElementById('paneRegStart').classList.remove('active');
  document.getElementById('paneRegVerify').classList.remove('active');
  document.getElementById('paneForgotReset').classList.remove('active');
  document.getElementById('paneForgotStart').classList.add('active');
  document.getElementById('tabLoginBtn').classList.remove('active');
  document.getElementById('tabRegisterBtn').classList.remove('active');
  hideErr('forgotErr');
  const f = document.getElementById('fEmail');
  const l = document.getElementById('lEmail').value.trim();
  if (l) f.value = l;
}

function backToForgotStart(){
  document.getElementById('paneForgotReset').classList.remove('active');
  document.getElementById('paneForgotStart').classList.add('active');
}

function backToStart(){
  document.getElementById('paneRegVerify').classList.remove('active');
  document.getElementById('paneRegStart').classList.add('active');
}

// Open the requested tab via ?tab=register
(function(){
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'register') switchTab('register');
})();

function setLoggedIn(d){
  localStorage.setItem('hostaka_token', d.token);
  localStorage.setItem('hostaka_role', d.role);
  localStorage.setItem('hostaka_user', JSON.stringify({ username:d.username, role:d.role, avatar:d.avatar||'' }));
  relayTokenToOAuth(d.token);
}

// يرسل التوكن لـ oauth.hostaka.fun (وسيط التحقق) عشان يخزّنه بكوكي مشترك
// بين كل النطاقات الفرعية (Domain=.hostaka.fun). بعدها أي نطاق فرعي
// (orbithub/aethercast/console...) يقدر يسحب الجلسة تلقائياً وبصمت عند
// أول تحميل، بدون ما يحتاج المستخدم يمر برحلة تسجيل دخول يدوية كل مرة.
// طلب صامت (fire-and-forget) — فشله لا يوقف تسجيل الدخول نفسه.
function relayTokenToOAuth(token){
  try {
    fetch('https://oauth.hostaka.fun/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token })
    }).catch(() => {});
  } catch (e) {}
}

function showErr(id, msg){
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}
function hideErr(id){ document.getElementById(id).style.display='none'; }

// ----- Log in -----
async function doLogin(){
  const email = document.getElementById('lEmail').value.trim();
  const pass  = document.getElementById('lPass').value;
  hideErr('loginErr');
  if (!email || !pass) return showErr('loginErr',t('emailPassRequired'));
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    let d = await apiFetch('/api/login','POST',{ email, password: pass });
    if (d.requires2FA) {
      const code = await hostakaPrompt(t('enter2faCode'));
      if (!code) { btn.disabled = false; btn.textContent = t('login'); return; }
      d = await apiFetch('/api/login/2fa-verify','POST',{ pendingToken: d.pendingToken, code: code.trim() });
    }
    if (d.success) { setLoggedIn(d); location.href = getNextUrl(); }
    else showErr('loginErr', d.error || t('loginFail'));
  } catch(e) { showErr('loginErr',t('cantConnectServer')); }
  finally { btn.disabled = false; btn.textContent = t('login'); }
}
document.getElementById('lPass').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
document.getElementById('lEmail').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });

// ----- Create account: Step 1 -----
let regPayload = null;

async function startRegister(){
  const username = document.getElementById('rUser').value.trim();
  const email    = document.getElementById('rEmail').value.trim();
  const password = document.getElementById('rPass').value;
  hideErr('regErr');
  if (!username || !email || !password) return showErr('regErr',t('allFieldsRequired'));
  if (password.length < 6) return showErr('regErr',t('passMin6'));

  const btn = document.getElementById('regStartBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/register/start','POST',{ username, email, password });
    if (d.success) {
      regPayload = { username, email };
      document.getElementById('sentToEmail').textContent = email;
      document.getElementById('paneRegStart').classList.remove('active');
      document.getElementById('paneRegVerify').classList.add('active');
      hideErr('verifyErr');
      startResendCooldown(45);
    } else {
      showErr('regErr', d.error || t('cantSendCode'));
    }
  } catch(e) { showErr('regErr',t('cantConnectServer')); }
  finally { btn.disabled = false; btn.textContent = t('sendCode'); }
}

// ----- Create account: Step 2 (confirm code) -----
async function verifyRegister(){
  if (!regPayload) return backToStart();
  const code = document.getElementById('vCode').value.trim();
  hideErr('verifyErr');
  if (!/^\d{6}$/.test(code)) return showErr('verifyErr',t('enter6DigitCode'));

  const btn = document.getElementById('verifyBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/register/verify','POST',{ email: regPayload.email, code });
    if (d.success) {
      setLoggedIn(d);
      location.href = getNextUrl();
    } else {
      showErr('verifyErr', d.error || t('wrongCode'));
      if (d.expired) backToStart();
    }
  } catch(e) { showErr('verifyErr',t('cantConnectServer')); }
  finally { btn.disabled = false; btn.textContent = t('confirmAndCreate'); }
}
document.getElementById('vCode').addEventListener('keydown', e => { if (e.key==='Enter') verifyRegister(); });

// ----- Resend code with countdown -----
let resendTimer = null;
function startResendCooldown(seconds, btnId){
  const btn = document.getElementById(btnId || 'resendBtn');
  btn.disabled = true;
  let left = seconds;
  const timerRef = btnId === 'resendForgotBtn' ? 'forgotResendTimer' : 'resendTimer';
  btn.textContent = t('resendIn',{s:left});
  clearInterval(window[timerRef]);
  window[timerRef] = setInterval(() => {
    left--;
    if (left <= 0) {
      clearInterval(window[timerRef]);
      btn.disabled = false;
      btn.textContent = t('resendCode');
    } else {
      btn.textContent = t('resendIn',{s:left});
    }
  }, 1000);
}

async function resendCode(){
  if (!regPayload) return backToStart();
  hideErr('verifyErr');
  const btn = document.getElementById('resendBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/auth/register/resend','POST',{ email: regPayload.email });
    if (d.success) {
      const ok = document.getElementById('verifyOk');
      ok.textContent = t('newCodeSent');
      ok.style.display = 'block';
      setTimeout(() => ok.style.display='none', 4000);
      startResendCooldown(45, 'resendBtn');
    } else {
      showErr('verifyErr', d.error || t('cantResend'));
      startResendCooldown(45, 'resendBtn');
    }
  } catch(e) { showErr('verifyErr',t('cantConnectServer')); btn.disabled=false; }
}

// ----- Forgot password: Step 1 -----
let forgotEmail = null;

async function startForgot(){
  const email = document.getElementById('fEmail').value.trim();
  hideErr('forgotErr');
  if (!email) return showErr('forgotErr',t('emailRequired'));

  const btn = document.getElementById('forgotStartBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/password/forgot','POST',{ email });
    if (d.success) {
      forgotEmail = email;
      document.getElementById('sentToEmailForgot').textContent = email;
      document.getElementById('paneForgotStart').classList.remove('active');
      document.getElementById('paneForgotReset').classList.add('active');
      hideErr('resetErr');
      startResendCooldown(45, 'resendForgotBtn');
    } else {
      showErr('forgotErr', d.error || t('cantSendCode'));
    }
  } catch(e) { showErr('forgotErr',t('cantConnectServer')); }
  finally { btn.disabled = false; btn.textContent = t('sendCode'); }
}

// ----- Forgot password: Step 2 (confirm code + new password) -----
async function doResetPassword(){
  if (!forgotEmail) return backToForgotStart();
  const code = document.getElementById('fCode').value.trim();
  const newPassword = document.getElementById('fNewPass').value;
  hideErr('resetErr');
  if (!/^\d{6}$/.test(code)) return showErr('resetErr',t('enter6DigitCode'));
  if (newPassword.length < 6) return showErr('resetErr',t('passMin6'));

  const btn = document.getElementById('resetBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/password/reset','POST',{ email: forgotEmail, code, newPassword });
    if (d.success) {
      setLoggedIn(d);
      location.href = getNextUrl();
    } else {
      showErr('resetErr', d.error || t('cantResetPass'));
      if (d.expired) backToForgotStart();
    }
  } catch(e) { showErr('resetErr',t('cantConnectServer')); }
  finally { btn.disabled = false; btn.textContent = t('setPassword'); }
}
document.getElementById('fNewPass').addEventListener('keydown', e => { if (e.key==='Enter') doResetPassword(); });

async function resendForgotCode(){
  if (!forgotEmail) return backToForgotStart();
  hideErr('resetErr');
  const btn = document.getElementById('resendForgotBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/auth/password/resend','POST',{ email: forgotEmail });
    if (d.success) {
      const ok = document.getElementById('resetOk');
      ok.textContent = t('newCodeSent');
      ok.style.display = 'block';
      setTimeout(() => ok.style.display='none', 4000);
      startResendCooldown(45, 'resendForgotBtn');
    } else {
      showErr('resetErr', d.error || t('cantResend'));
      startResendCooldown(45, 'resendForgotBtn');
    }
  } catch(e) { showErr('resetErr',t('cantConnectServer')); btn.disabled=false; }
}

/* expose top-level functions for inline onclick handlers */
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.switchTab = switchTab; } catch(e) {}
try { window.goToForgot = goToForgot; } catch(e) {}
try { window.backToForgotStart = backToForgotStart; } catch(e) {}
try { window.backToStart = backToStart; } catch(e) {}
try { window.setLoggedIn = setLoggedIn; } catch(e) {}
try { window.showErr = showErr; } catch(e) {}
try { window.hideErr = hideErr; } catch(e) {}
try { window.doLogin = doLogin; } catch(e) {}
try { window.startRegister = startRegister; } catch(e) {}
try { window.verifyRegister = verifyRegister; } catch(e) {}
try { window.startResendCooldown = startResendCooldown; } catch(e) {}
try { window.resendCode = resendCode; } catch(e) {}
try { window.startForgot = startForgot; } catch(e) {}
try { window.doResetPassword = doResetPassword; } catch(e) {}
try { window.resendForgotCode = resendForgotCode; } catch(e) {}
