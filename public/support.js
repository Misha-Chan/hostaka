const LANG = {
  ar: {
    suspendedMsg: 'تم تعليق حسابك من قبل الإدارة{reason}',
    typeGeneral: 'استفسار / شكوى عامة', typeBug: 'مشكلة تقنية', typeAbuse: 'إساءة استخدام', typeAccount: 'مشكلة في الحساب', typeSuggestion: 'اقتراح',
    statusPending: 'قيد المراجعة', statusResolved: 'تم الحل', statusDismissed: 'مرفوض',
    requestType: 'نوع الطلب', subject: 'الموضوع', subjectPlaceholder: 'عنوان مختصر لطلبك',
    detailsLabel: 'التفاصيل *', detailsPlaceholder: 'اشرح مشكلتك أو استفسارك بالتفصيل...', sendRequest: 'إرسال الطلب',
    detailsRequired: 'الرجاء كتابة التفاصيل', sending: 'جارٍ الإرسال...', ticketSent: 'تم إرسال طلبك، سنقوم بالرد قريباً',
    sendFail: 'فشل الإرسال', cantConnectServer: 'تعذر الاتصال بالخادم', adminReply: 'رد الإدارة',
    loading: 'جارٍ التحميل...', noPreviousRequests: 'لا توجد طلبات سابقة', cantLoadRequests: 'تعذر تحميل الطلبات',
    membersOnly: 'الدعم متاح للأعضاء المسجلين فقط', loginToSend: 'سجّل الدخول لإرسال شكوى أو بلاغ ومتابعة ردود الإدارة',
    loginBtn: 'تسجيل الدخول', cantVerifyAccount: 'تعذر التحقق من الحساب', backHome: 'العودة للرئيسية',
    supportCenter: 'مركز الدعم', supportSub: 'أرسل شكوى، بلاغاً، أو استفساراً وسيتم الرد عليك من قبل فريق الإدارة',
    newRequest: 'طلب جديد', myRequests: 'طلباتي'
  },
  en: {
    suspendedMsg: 'Your account has been suspended by the administration{reason}',
    typeGeneral: 'General inquiry / complaint', typeBug: 'Technical issue', typeAbuse: 'Abuse', typeAccount: 'Account issue', typeSuggestion: 'Suggestion',
    statusPending: 'Pending', statusResolved: 'Resolved', statusDismissed: 'Dismissed',
    requestType: 'Request type', subject: 'Subject', subjectPlaceholder: 'A short title for your request',
    detailsLabel: 'Details *', detailsPlaceholder: 'Describe your issue or inquiry in detail...', sendRequest: 'Send request',
    detailsRequired: 'Please write the details', sending: 'Sending...', ticketSent: 'Your request has been sent, we will reply soon',
    sendFail: 'Failed to send', cantConnectServer: 'Could not connect to the server', adminReply: 'Admin reply',
    loading: 'Loading...', noPreviousRequests: 'No previous requests', cantLoadRequests: 'Could not load requests',
    membersOnly: 'Support is available for registered members only', loginToSend: 'Log in to send a complaint or report and track admin replies',
    loginBtn: 'Log In', cantVerifyAccount: 'Could not verify the account', backHome: 'Back to home',
    supportCenter: 'Support Center', supportSub: 'Send a complaint, report, or inquiry and the admin team will respond to you',
    newRequest: 'New request', myRequests: 'My requests'
  }
};
let currentLang = localStorage.getItem('hostaka_lang') || 'en';
function t(key, vars){
  var s = (LANG[currentLang] || LANG.en)[key];
  if (s === undefined) return key;
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}
// ===== Theme =====
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
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),300); }, 3000);
}

async function apiFetch(url, method='GET', body=null){
  const token = getToken();
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+token} };
  if(body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const data = await r.json();
  if(r.status===403 && data?.suspended){
    localStorage.removeItem('hostaka_token'); localStorage.removeItem('hostaka_user'); localStorage.removeItem('hostaka_role');
    await hostakaAlert(t('suspendedMsg',{reason: data.reason?':\n'+data.reason:''}));
    window.location = '/';
  }
  return data;
}

function TYPE_LABELS_FN(){ return {
  general: t('typeGeneral'),
  bug: t('typeBug'),
  abuse: t('typeAbuse'),
  account: t('typeAccount'),
  suggestion: t('typeSuggestion')
}; }
function STATUS_LABELS_FN(){ return { pending:t('statusPending'), resolved:t('statusResolved'), dismissed:t('statusDismissed') }; }

let ME = null;

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  return d.toLocaleDateString('ar-SA',{year:'numeric',month:'short',day:'numeric'}) + ' - ' + d.toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'});
}

function renderForm(){
  return `
  <div class="card">
    <label class="f-label">${t('requestType')}</label>
    <select class="f-input" id="spType">
      ${Object.entries(TYPE_LABELS_FN()).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
    </select>
    <label class="f-label">${t('subject')}</label>
    <input class="f-input" type="text" id="spSubject" placeholder="${t('subjectPlaceholder')}" maxlength="120">
    <label class="f-label">${t('detailsLabel')}</label>
    <textarea class="f-input" id="spReason" placeholder="${t('detailsPlaceholder')}"></textarea>
    <button class="btn-submit" id="spBtn" onclick="submitTicket()">${t('sendRequest')}</button>
  </div>`;
}

async function submitTicket(){
  const type = document.getElementById('spType').value;
  const subject = document.getElementById('spSubject').value.trim();
  const reason = document.getElementById('spReason').value.trim();
  if(!reason){ showToast(t('detailsRequired'), 'error'); return; }
  const btn = document.getElementById('spBtn');
  btn.disabled = true; btn.textContent = t('sending');
  try{
    const d = await apiFetch('/api/reports', 'POST', { type, subject, reason });
    if(d.success){
      showToast(t('ticketSent'));
      document.getElementById('spSubject').value = '';
      document.getElementById('spReason').value = '';
      switchTab('mine');
    } else {
      showToast(d.error || t('sendFail'), 'error');
    }
  }catch(e){ showToast(t('cantConnectServer'), 'error'); }
  btn.disabled = false; btn.textContent = t('sendRequest');
}

function ticketCard(r){
  const statusCls = r.status==='resolved' ? 'st-resolved' : (r.status==='dismissed' ? 'st-dismissed' : 'st-pending');
  return `<div class="ticket">
    <div class="ticket-top">
      <span class="ticket-type">${esc(TYPE_LABELS_FN()[r.type] || r.type)}</span>
      <span class="ticket-status ${statusCls}">${esc(STATUS_LABELS_FN()[r.status] || r.status)}</span>
    </div>
    ${r.subject ? `<div class="ticket-subject">${esc(r.subject)}</div>` : ''}
    <div class="ticket-reason">${esc(r.reason)}</div>
    ${r.admin_reply ? `<div class="ticket-reply"><b>${t('adminReply')}</b>${esc(r.admin_reply)}</div>` : ''}
    <div class="ticket-date">${fmtDate(r.created_at)}</div>
  </div>`;
}

async function loadMine(){
  const wrap = document.getElementById('tabContent');
  wrap.innerHTML = `<div class="empty-state">${t('loading')}</div>`;
  try{
    const data = await apiFetch('/api/reports/mine');
    const list = Array.isArray(data) ? data : [];
    if(!list.length){
      wrap.innerHTML = `<div class="empty-state">${t('noPreviousRequests')}</div>`;
      return;
    }
    wrap.innerHTML = list.map(ticketCard).join('');
  }catch(e){
    wrap.innerHTML = `<div class="empty-state">${t('cantLoadRequests')}</div>`;
  }
}

let currentTab = 'new';
function switchTab(tab){
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  const wrap = document.getElementById('tabContent');
  if(tab==='new'){ wrap.innerHTML = renderForm(); }
  else { loadMine(); }
}

async function loadMe(){
  const token = getToken();
  if(!token){
    document.getElementById('wrap').innerHTML = `
      <div class="login-gate">
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">${t('membersOnly')}</div>
        <div style="color:var(--muted);font-size:0.85rem;">${t('loginToSend')}</div>
        <a href="/">${t('loginBtn')}</a>
      </div>`;
    return;
  }
  try{
    ME = await apiFetch('/api/me');
    if(!ME || ME.error){ throw new Error('unauth'); }
  }catch(e){
    document.getElementById('wrap').innerHTML = `<div class="login-gate"><div style="font-weight:800;">${t('cantVerifyAccount')}</div><a href="/">${t('backHome')}</a></div>`;
    return;
  }
  document.getElementById('wrap').innerHTML = `
    <div class="page-title">${t('supportCenter')}</div>
    <div class="page-sub">${t('supportSub')}</div>
    <div class="tabs">
      <button class="tab-btn active" data-tab="new" onclick="switchTab('new')">${t('newRequest')}</button>
      <button class="tab-btn" data-tab="mine" onclick="switchTab('mine')">${t('myRequests')}</button>
    </div>
    <div id="tabContent"></div>
  `;
  switchTab('new');
}

loadMe();

/* expose top-level functions for inline onclick handlers */
try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.getToken = getToken; } catch(e) {}
try { window.showToast = showToast; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.renderForm = renderForm; } catch(e) {}
try { window.submitTicket = submitTicket; } catch(e) {}
try { window.ticketCard = ticketCard; } catch(e) {}
try { window.loadMine = loadMine; } catch(e) {}
try { window.switchTab = switchTab; } catch(e) {}
try { window.loadMe = loadMe; } catch(e) {}
