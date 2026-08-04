window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

const LANG = {
  ar: {
    login: 'دخول', enter2faCode: 'أدخل كود المصادقة الثنائية من تطبيق المصادقة:',
    noAdminPerm: 'ليس لديك صلاحية admin', connFail: 'فشل الاتصال',
    writeNotifText: 'اكتب نص الإشعار', selectUsername: 'حدد اسم المستخدم', sending: 'جارٍ الإرسال...',
    notifSentTo: 'تم إرسال الإشعار إلى {count} عضو', sendFail: 'فشل الإرسال', cantConnect: 'تعذر الاتصال',
    sendNotifBtn: 'إرسال الإشعار', noEnoughData: 'لا توجد بيانات كافية بعد', loading: 'جارٍ التحميل...',
    noLogs: 'لا توجد سجلات — كل شيء يعمل بشكل طبيعي ✅', fetchLogsFail: 'فشل تحميل السجلات',
    confirmClearLogs: 'مسح كل السجلات نهائياً؟', logsCleared: 'تم مسح السجلات', clearFail: 'فشل المسح',
    suspended: 'معلّق', active: 'نشط', promote: 'ترقية', suspend: 'تعليق', unsuspend: 'رفع التعليق',
    disable2FATitle: 'لو المستخدم محظور دخوله بسبب مشكلة بكود المصادقة الثنائية', disable2FABtn: 'إلغاء 2FA',
    del: 'حذف', fetchUsersFail: 'فشل تحميل المستخدمين', confirmPromote: 'ترقية هذا المستخدم لـ admin؟',
    promoted: 'تمت الترقية', confirmDeleteUser: 'حذف {name}؟', deleted: 'تم الحذف',
    suspendReasonPrompt: 'سبب تعليق حساب @{name} (اختياري):', suspendedToast: 'تم تعليق الحساب',
    confirmUnsuspend: 'رفع التعليق عن @{name}؟', unsuspendedToast: 'تم رفع التعليق',
    confirmDisable2FA: 'إلغاء تفعيل المصادقة الثنائية لحساب @{name}؟ استخدم هذا فقط لو المستخدم محظور دخوله بسبب مشكلة بكود المصادقة.',
    disabled2FAToast: 'تم إلغاء تفعيل المصادقة الثنائية لحساب @{name}', execFail: 'تعذر التنفيذ',
    noPosts: 'لا توجد منشورات', fetchPostsFail: 'فشل تحميل المنشورات', confirmDeletePost: 'حذف هذا المنشور؟',
    noPendingRequests: 'لا توجد طلبات معلقة', approve: 'موافقة', reject: 'رفض', verifyGranted: 'تم منح التوثيق',
    confirmRejectRequest: 'رفض الطلب؟', rejected: 'تم الرفض', fetchRequestsFail: 'فشل تحميل الطلبات',
    reportTypePost: 'منشور', reportTypeComment: 'تعليق', reportTypeMessage: 'رسالة', reportTypeUser: 'مستخدم',
    reportTypeGeneral: 'عام', reportTypeBug: 'مشكلة تقنية', reportTypeAbuse: 'إساءة استخدام',
    reportTypeAccount: 'مشكلة حساب', reportTypeSuggestion: 'اقتراح',
    reportStatusPending: 'قيد المراجعة', reportStatusResolved: 'تم الحل', reportStatusDismissed: 'مرفوض',
    reporterDefault: 'مستخدم', againstPrefix: '← بحق @', prevReply: 'ردك السابق',
    replyPlaceholder: 'اكتب رداً (اختياري)...', resolveReply: 'حل + رد', noReportsHere: 'لا توجد بلاغات هنا',
    fetchReportsFail: 'فشل تحميل البلاغات', saved: 'تم الحفظ', saveFail: 'فشل الحفظ', visitsWord: 'زيارة'
  },
  en: {
    login: 'Log In', enter2faCode: 'Enter the two-factor code from your authenticator app:',
    noAdminPerm: 'You do not have admin permission', connFail: 'Connection failed',
    writeNotifText: 'Write the notification text', selectUsername: 'Specify a username', sending: 'Sending...',
    notifSentTo: 'Notification sent to {count} member(s)', sendFail: 'Failed to send', cantConnect: 'Could not connect',
    sendNotifBtn: 'Send notification', noEnoughData: 'Not enough data yet', loading: 'Loading...',
    noLogs: 'No logs — everything is running normally ✅', fetchLogsFail: 'Failed to load logs',
    confirmClearLogs: 'Permanently clear all logs?', logsCleared: 'Logs cleared', clearFail: 'Clear failed',
    suspended: 'Suspended', active: 'Active', promote: 'Promote', suspend: 'Suspend', unsuspend: 'Unsuspend',
    disable2FATitle: 'Use only if the user is locked out due to a two-factor code issue', disable2FABtn: 'Disable 2FA',
    del: 'Delete', fetchUsersFail: 'Failed to load users', confirmPromote: 'Promote this user to admin?',
    promoted: 'Promoted', confirmDeleteUser: 'Delete {name}?', deleted: 'Deleted',
    suspendReasonPrompt: 'Reason for suspending @{name} (optional):', suspendedToast: 'Account suspended',
    confirmUnsuspend: 'Unsuspend @{name}?', unsuspendedToast: 'Suspension lifted',
    confirmDisable2FA: 'Disable two-factor authentication for @{name}? Use this only if the user is locked out due to a 2FA code issue.',
    disabled2FAToast: 'Disabled two-factor authentication for @{name}', execFail: 'Could not execute',
    noPosts: 'No posts', fetchPostsFail: 'Failed to load posts', confirmDeletePost: 'Delete this post?',
    noPendingRequests: 'No pending requests', approve: 'Approve', reject: 'Reject', verifyGranted: 'Verification granted',
    confirmRejectRequest: 'Reject this request?', rejected: 'Rejected', fetchRequestsFail: 'Failed to load requests',
    reportTypePost: 'Post', reportTypeComment: 'Comment', reportTypeMessage: 'Message', reportTypeUser: 'User',
    reportTypeGeneral: 'General', reportTypeBug: 'Technical issue', reportTypeAbuse: 'Abuse',
    reportTypeAccount: 'Account issue', reportTypeSuggestion: 'Suggestion',
    reportStatusPending: 'Pending', reportStatusResolved: 'Resolved', reportStatusDismissed: 'Dismissed',
    reporterDefault: 'User', againstPrefix: '← against @', prevReply: 'Your previous reply',
    replyPlaceholder: 'Write a reply (optional)...', resolveReply: 'Resolve + reply', noReportsHere: 'No reports here',
    fetchReportsFail: 'Failed to load reports', saved: 'Saved', saveFail: 'Save failed', visitsWord: 'visits'
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
const THEME_ICON_DARK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const THEME_ICON_LIGHT = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
let currentTheme = localStorage.getItem('hostaka_theme') || 'light';
function setTheme(theme){
  const html = document.documentElement;
  if(theme === 'dark'){ html.setAttribute('data-theme','dark'); }
  else{ html.removeAttribute('data-theme'); }
  currentTheme = theme;
  localStorage.setItem('hostaka_theme', currentTheme);
  const btn = document.getElementById('themeToggle');
  if(btn) btn.innerHTML = theme === 'dark' ? THEME_ICON_DARK : THEME_ICON_LIGHT;
}
function toggleTheme(){ setTheme(currentTheme === 'light' ? 'dark' : 'light'); }
setTheme(currentTheme);

let TOKEN = localStorage.getItem('hostaka_token')||'';

async function api(url,method='GET',body=null){
  const opts={method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN}};
  if(body) opts.body=JSON.stringify(body);
  const r=await fetch(url,opts); return r.json();
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function toUTCDate(s){if(!s)return new Date(NaN);if(s instanceof Date)return s;if(typeof s==='string'&&!/[zZ]|[+-]\d\d:?\d\d$/.test(s))return new Date(s.replace(' ','T')+'Z');return new Date(s);}
function fmtDate(s){if(!s)return'';return toUTCDate(s).toLocaleDateString('ar-SA',{year:'numeric',month:'short',day:'numeric'});}

// Login
async function doLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pass=document.getElementById('loginPass').value;
  const errEl=document.getElementById('loginErr'); errEl.style.display='none';
  const btn=document.getElementById('loginBtn'); btn.disabled=true; btn.textContent='...';
  try{
    let d=await api('/api/login','POST',{email,password:pass});
    if(d.requires2FA){
      const code = await hostakaPrompt(t('enter2faCode'));
      if(!code){ btn.disabled=false; btn.textContent=t('login'); return; }
      d = await api('/api/login/2fa-verify','POST',{ pendingToken:d.pendingToken, code:code.trim() });
    }
    if(!d.success || d.role!=='admin'){errEl.textContent=d.error||t('noAdminPerm');errEl.style.display='block';btn.disabled=false;btn.textContent=t('login');return;}
    TOKEN=d.token; localStorage.setItem('hostaka_token',TOKEN);
    initAdmin(d.username);
  }catch(e){errEl.textContent=t('connFail');errEl.style.display='block';btn.disabled=false;btn.textContent=t('login');}
}
document.getElementById('loginPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});

function doLogout(){TOKEN='';localStorage.removeItem('hostaka_token');location.reload();}

function initAdmin(username){
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('sidebar').style.display='flex';
  document.getElementById('mainContent').style.display='block';
  document.getElementById('adminName').textContent=username;
  loadDashboard();
}

(async function checkSession(){
  if(!TOKEN) return;
  try{
    const r=await fetch('/api/auth/me',{headers:{'Authorization':'Bearer '+TOKEN}});
    const u=await r.json();
    if(!u||u.error||u.role!=='admin'){TOKEN='';localStorage.removeItem('hostaka_token');return;}
    initAdmin(u.username);
  }catch(e){TOKEN='';localStorage.removeItem('hostaka_token');}
})();

function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  event?.currentTarget?.classList.add('active');
  if(name==='users') loadUsers();
  if(name==='posts') loadPosts();
  if(name==='verify') loadVerify();
  if(name==='dashboard') loadDashboard();
  if(name==='reports') loadReports();
  if(name==='logs') loadLogs();
  toggleAdminSidebar(false); // close sidebar automatically after mobile navigation
}

// Open/close sidebar on small screens (admin panel)
function toggleAdminSidebar(force){
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('adminSidebarBackdrop');
  if(!sidebar || !backdrop) return;
  const shouldOpen = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', shouldOpen);
  backdrop.classList.toggle('show', shouldOpen);
}

document.getElementById('ntTarget')?.addEventListener('change', function(){
  document.getElementById('ntUserWrap').style.display = this.value==='user' ? 'block' : 'none';
});

async function sendAdminNotif(){
  const target = document.getElementById('ntTarget').value === 'user'
    ? document.getElementById('ntUsername').value.trim()
    : 'all';
  const content = document.getElementById('ntContent').value.trim();
  const link = document.getElementById('ntLink').value.trim();
  if(!content){ toast(t('writeNotifText')); return; }
  if(target !== 'all' && !target){ toast(t('selectUsername')); return; }
  const btn = document.getElementById('ntSendBtn');
  btn.disabled = true; btn.textContent = t('sending');
  try{
    const d = await api('/api/admin/notifications', 'POST', { content, link, target });
    if(d.success){
      toast(t('notifSentTo',{count:d.count}));
      document.getElementById('ntContent').value = '';
      document.getElementById('ntLink').value = '';
      document.getElementById('ntUsername').value = '';
    } else {
      toast(d.error || t('sendFail'));
    }
  }catch(e){ toast(t('cantConnect')); }
  btn.disabled = false; btn.textContent = t('sendNotifBtn');
}

async function loadDashboard(){
  try{
    const[users,posts,verify]=await Promise.all([api('/api/admin/users'),api('/api/records'),api('/api/admin/verify')]);
    document.getElementById('sUsers').textContent=users.length||0;
    document.getElementById('sPosts').textContent=posts.length||0;
    document.getElementById('sVerify').textContent=verify.length||0;
    const vb=document.getElementById('verifyBadge');
    if(verify.length){vb.textContent=verify.length;vb.style.display='inline';}
  }catch(e){}
  try{
    const pending = await api('/api/admin/reports?status=pending');
    const rb = document.getElementById('reportsBadge');
    if(Array.isArray(pending) && pending.length){ rb.textContent=pending.length; rb.style.display='inline'; }
    else if(rb){ rb.style.display='none'; }
  }catch(e){}
  loadAnalytics();
  startActiveNowPolling();
}

// ============================================================
// Analytics — visits, active now, bounce rate
// ============================================================
let activeNowTimer = null;
function startActiveNowPolling(){
  if(activeNowTimer) clearInterval(activeNowTimer);
  activeNowTimer = setInterval(async ()=>{
    if(!document.getElementById('page-dashboard')?.classList.contains('active')){
      clearInterval(activeNowTimer); activeNowTimer=null; return;
    }
    try{
      const d = await api('/api/admin/analytics/overview');
      document.getElementById('aActiveNow').textContent = d.activeNow ?? 0;
    }catch(e){}
  }, 15000);
}

function fmtShortDate(d){
  try{ return toUTCDate(d).toLocaleDateString('ar-SA',{month:'short',day:'numeric'}); }catch(e){ return d; }
}

async function loadAnalytics(){
  try{
    const d = await api('/api/admin/analytics/overview');
    document.getElementById('aActiveNow').textContent = d.activeNow ?? 0;
    document.getElementById('aViewsToday').textContent = d.viewsToday ?? 0;
    document.getElementById('aViews7d').textContent = d.views7d ?? 0;
    document.getElementById('aUniqueToday').textContent = d.uniqueToday ?? 0;
    document.getElementById('aBounce').textContent = (d.bounceRate7d ?? 0) + '%';
    document.getElementById('aNewSignups').textContent = d.newSignupsToday ?? 0;

    // simple bar chart for the last 14 days (no external library)
    const series = d.dailySeries || [];
    const max = Math.max(1, ...series.map(s=>s.c));
    document.getElementById('analyticsChart').innerHTML = series.length ? series.map(s => `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;" title="${esc(s.d)}: ${s.c} ${t('visitsWord')}">
        <div style="width:100%;background:var(--primary);border-radius:4px 4px 0 0;height:${Math.max(4, Math.round((s.c/max)*100))}px;transition:height .3s;"></div>
        <div style="font-size:0.62rem;color:var(--muted);white-space:nowrap;">${fmtShortDate(s.d)}</div>
      </div>`).join('') : `<div style="color:var(--muted);font-size:0.82rem;">${t('noEnoughData')}</div>`;

    const tp = d.topPages || [];
    document.getElementById('topPagesList').innerHTML = tp.length ? tp.map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.84rem;">
        <span style="direction:ltr;text-align:right;color:var(--text);">${esc(p.path)}</span>
        <span style="font-weight:800;color:var(--primary);flex-shrink:0;margin-right:10px;">${p.c}</span>
      </div>`).join('') : `<div style="color:var(--muted);font-size:0.82rem;">${t('noEnoughData')}</div>`;

    const tr = d.topReferrers || [];
    document.getElementById('topRefList').innerHTML = tr.length ? tr.map(r => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.84rem;">
        <span style="direction:ltr;text-align:right;color:var(--text);word-break:break-all;">${esc(r.ref)}</span>
        <span style="font-weight:800;color:var(--primary);flex-shrink:0;margin-right:10px;">${r.c}</span>
      </div>`).join('') : `<div style="color:var(--muted);font-size:0.82rem;">${t('noEnoughData')}</div>`;
  }catch(e){}
}

// ============================================================
// Logs — like Vercel Logs
// ============================================================
let logsFilter = '';
function setLogsFilter(level){
  logsFilter = level;
  document.querySelectorAll('.lg-tab').forEach(b=>{
    const active = b.dataset.level === level;
    b.classList.toggle('btn-dark', active);
    b.classList.toggle('btn-ghost', !active);
  });
  loadLogs();
}

const LOG_LEVEL_COLORS = { error:'var(--danger)', warn:'#a16207', http:'var(--muted)', info:'var(--primary)' };

async function loadLogs(){
  const el = document.getElementById('logsList');
  el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('loading')}</div>`;
  try{
    const url = logsFilter ? '/api/admin/logs?level='+logsFilter : '/api/admin/logs';
    const logs = await api(url);
    if(!Array.isArray(logs) || !logs.length){
      el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('noLogs')}</div>`;
      const lb=document.getElementById('logsBadge'); if(lb) lb.style.display='none';
      return;
    }
    el.innerHTML = `<div class="card" style="padding:0;overflow:hidden;">` + logs.map(l => `
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-family:'SF Mono',Consolas,monospace;font-size:0.78rem;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap;">
          <span style="color:${LOG_LEVEL_COLORS[l.level]||'var(--muted)'};font-weight:800;text-transform:uppercase;">${esc(l.level)}</span>
          ${l.status_code ? `<span style="color:var(--muted);">${esc(l.method||'')} ${esc(l.path||'')} → ${l.status_code}</span>` : ''}
          <span style="color:var(--muted);margin-right:auto;font-family:'Cairo';">${fmtDate(l.created_at)} ${toUTCDate(l.created_at).toLocaleTimeString('ar-SA')}</span>
        </div>
        <div style="white-space:pre-wrap;word-break:break-all;color:var(--text);line-height:1.6;">${esc(l.message)}</div>
      </div>`).join('') + `</div>`;
    const errCount = logs.filter(l=>l.level==='error').length;
    const lb=document.getElementById('logsBadge');
    if(lb){ if(errCount){ lb.textContent=errCount; lb.style.display='inline'; } else lb.style.display='none'; }
  }catch(e){ el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('fetchLogsFail')}</div>`; }
}

async function clearLogs(){
  if(!await hostakaConfirm(t('confirmClearLogs'))) return;
  const d = await api('/api/admin/logs','DELETE');
  if(d.success){ toast(t('logsCleared')); loadLogs(); }
  else toast(d.error||t('clearFail'));
}

async function loadUsers(){
  try{
    const users=await api('/api/admin/users');
    document.getElementById('usersTable').innerHTML=users.map(u=>`
      <tr>
        <td><strong>${esc(u.display_name||u.username)}</strong><div style="font-size:0.75rem;color:var(--muted);">@${esc(u.username)}</div></td>
        <td style="font-size:0.82rem;color:var(--muted);" dir="ltr">${esc(u.email)}</td>
        <td><span class="badge badge-${u.role==='admin'?'admin':'user'}">${u.role==='admin'?'Admin':'User'}</span></td>
        <td>${u.verified?'<svg width="14" height="14" viewBox="0 0 24 24" fill="#3b9eff"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>':'–'}</td>
        <td>
          ${u.suspended
            ? `<span class="badge badge-suspended" title="${esc(u.suspend_reason||'')}">${t('suspended')}</span>`
            : `<span class="badge badge-active">${t('active')}</span>`}
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${u.role!=='admin'?`<button class="btn btn-dark btn-sm" onclick="promoteUser(${u.id})">${t('promote')}</button>`:''}
            ${u.role!=='admin' && !u.suspended?`<button class="btn btn-ghost btn-sm" onclick="suspendUser(${u.id},'${esc(u.username)}')" style="color:var(--danger);">${t('suspend')}</button>`:''}
            ${u.role!=='admin' && u.suspended?`<button class="btn btn-ghost btn-sm" onclick="unsuspendUser(${u.id},'${esc(u.username)}')" style="color:#15803d;">${t('unsuspend')}</button>`:''}
            ${Number(u.totp_enabled)===1?`<button class="btn btn-ghost btn-sm" onclick="adminDisable2FA(${u.id},'${esc(u.username)}')" style="color:#a16207;" title="${t('disable2FATitle')}">${t('disable2FABtn')}</button>`:''}
            ${u.role!=='admin'?`<button class="btn btn-ghost btn-sm" onclick="deleteUser(${u.id},'${esc(u.username)}')">${t('del')}</button>`:''}
          </div>
        </td>
      </tr>`).join('');
  }catch(e){toast(t('fetchUsersFail'));}
}

async function promoteUser(id){
  if(!await hostakaConfirm(t('confirmPromote'))) return;
  await api('/api/admin/users/'+id+'/role','PUT',{role:'admin'});
  toast(t('promoted')); loadUsers();
}
async function deleteUser(id,name){
  if(!await hostakaConfirm(t('confirmDeleteUser',{name}))) return;
  await api('/api/admin/users/'+id,'DELETE');
  toast(t('deleted')); loadUsers();
}
async function suspendUser(id,name){
  const reason = await hostakaPrompt(t('suspendReasonPrompt',{name}),'');
  if(reason===null) return;
  await api('/api/admin/users/'+id+'/suspend','PUT',{reason});
  toast(t('suspendedToast')); loadUsers();
}
async function unsuspendUser(id,name){
  if(!await hostakaConfirm(t('confirmUnsuspend',{name}))) return;
  await api('/api/admin/users/'+id+'/unsuspend','PUT');
  toast(t('unsuspendedToast')); loadUsers();
}
async function adminDisable2FA(id,name){
  if(!await hostakaConfirm(t('confirmDisable2FA',{name}))) return;
  const d = await api('/api/admin/users/'+id+'/2fa/disable','PUT');
  if(d.success){ toast(t('disabled2FAToast',{name})); loadUsers(); }
  else toast(d.error||t('execFail'));
}

async function loadPosts(){
  try{
    const posts=await api('/api/records');
    const el=document.getElementById('postsList');
    if(!posts.length){el.innerHTML=`<div style="text-align:center;color:var(--muted);padding:24px;">${t('noPosts')}</div>`;return;}
    el.innerHTML=posts.map(p=>`
      <div style="border-bottom:1px solid var(--border);padding:14px 0;display:flex;gap:12px;align-items:flex-start;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <strong style="font-size:0.88rem;">${esc(p.publisher)}</strong>
            <span class="badge badge-${p.user_role==='Admin'?'admin':'user'}">${esc(p.user_role)}</span>
            <span style="font-size:0.75rem;color:var(--muted);">${fmtDate(p.created_at)}</span>
          </div>
          <div style="font-size:0.85rem;color:#444;line-height:1.6;">${(p.content||'').replace(/<[^>]+>/g,'').slice(0,120)}${(p.content||'').length>120?'...':''}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="deletePost(${p.id})">${t('del')}</button>
      </div>`).join('');
  }catch(e){toast(t('fetchPostsFail'));}
}

async function deletePost(id){
  if(!await hostakaConfirm(t('confirmDeletePost'))) return;
  await api('/api/records/'+id,'DELETE');
  toast(t('deleted')); loadPosts();
}

async function loadVerify(){
  try{
    const reqs=await api('/api/admin/verify');
    const el=document.getElementById('verifyList');
    if(!reqs.length){el.innerHTML=`<div style="text-align:center;color:var(--muted);padding:24px;">${t('noPendingRequests')}</div>`;return;}
    el.innerHTML=reqs.map(r=>`
      <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);">
        <div style="width:38px;height:38px;border-radius:var(--radius-full);background:var(--avatar-gradient, var(--primary));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;flex-shrink:0;overflow:hidden;">
          ${r.avatar?`<img src="${esc(r.avatar)}" style="width:100%;height:100%;object-fit:cover;">`:(r.display_name||r.username||'?').charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;">
          <strong>${esc(r.display_name||r.username)}</strong>
          <div style="font-size:0.75rem;color:var(--muted);">@${esc(r.username)} · ${fmtDate(r.created_at)}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-dark btn-sm" onclick="approveVerify(${r.user_id})">${t('approve')}</button>
          <button class="btn btn-ghost btn-sm" onclick="rejectVerify(${r.user_id})">${t('reject')}</button>
        </div>
      </div>`).join('');
    const vb=document.getElementById('verifyBadge');
    if(reqs.length){vb.textContent=reqs.length;vb.style.display='inline';}
  }catch(e){toast(t('fetchRequestsFail'));}
}

async function approveVerify(id){
  await api('/api/admin/verify/'+id,'PUT',{action:'approve'});
  toast(t('verifyGranted')); loadVerify(); loadDashboard();
}
async function rejectVerify(id){
  if(!await hostakaConfirm(t('confirmRejectRequest'))) return;
  await api('/api/admin/verify/'+id,'PUT',{action:'reject'});
  toast(t('rejected')); loadVerify();
}

// ============================================================
// Reports and support requests
// ============================================================
let reportsFilter = 'pending';
function REPORT_TYPE_LABELS(key){ return { post:t('reportTypePost'), comment:t('reportTypeComment'), message:t('reportTypeMessage'), user:t('reportTypeUser'), general:t('reportTypeGeneral'), bug:t('reportTypeBug'), abuse:t('reportTypeAbuse'), account:t('reportTypeAccount'), suggestion:t('reportTypeSuggestion') }[key]; }
function REPORT_STATUS_LABELS(key){ return { pending:t('reportStatusPending'), resolved:t('reportStatusResolved'), dismissed:t('reportStatusDismissed') }[key]; }

function setReportsFilter(status){
  reportsFilter = status;
  document.querySelectorAll('.rf-tab').forEach(b=>{
    const active = b.dataset.status === status;
    b.classList.toggle('btn-dark', active);
    b.classList.toggle('btn-ghost', !active);
  });
  loadReports();
}

async function loadReports(){
  const el = document.getElementById('reportsList');
  el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('loading')}</div>`;
  try{
    const url = reportsFilter ? '/api/admin/reports?status='+reportsFilter : '/api/admin/reports';
    const reports = await api(url);
    if(!Array.isArray(reports) || !reports.length){
      el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('noReportsHere')}</div>`;
      return;
    }
    el.innerHTML = reports.map(r => `
      <div class="card" style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-user">${esc(REPORT_TYPE_LABELS(r.type)||r.type)}</span>
            <strong style="font-size:0.86rem;">${esc(r.reporter_name||t('reporterDefault'))}</strong>
            ${r.target_owner_name ? `<span style="font-size:0.78rem;color:var(--muted);">${t('againstPrefix')}${esc(r.target_owner_name)}</span>` : ''}
          </div>
          <span class="badge badge-${r.status==='pending'?'pending':(r.status==='resolved'?'active':'suspended')}">${esc(REPORT_STATUS_LABELS(r.status)||r.status)}</span>
        </div>
        ${r.subject ? `<div style="font-weight:700;font-size:0.88rem;margin-bottom:4px;">${esc(r.subject)}</div>` : ''}
        <div style="font-size:0.84rem;color:#444;line-height:1.6;margin-bottom:10px;">${esc(r.reason)}</div>
        ${r.admin_reply ? `<div style="background:var(--primary-light);border-radius:var(--radius-sm);padding:8px 10px;font-size:0.82rem;margin-bottom:10px;"><strong style="font-size:0.72rem;color:var(--muted);display:block;margin-bottom:3px;">${t('prevReply')}</strong>${esc(r.admin_reply)}</div>` : ''}
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:10px;">${fmtDate(r.created_at)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <input type="text" class="form-input" id="reply-${r.id}" placeholder="${t('replyPlaceholder')}" style="flex:1;min-width:180px;margin-bottom:0;">
          <button class="btn btn-dark btn-sm" onclick="replyReport(${r.id},'resolved')">${t('resolveReply')}</button>
          <button class="btn btn-ghost btn-sm" onclick="replyReport(${r.id},'dismissed')">${t('reject')}</button>
        </div>
      </div>`).join('');
  }catch(e){ el.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;">${t('fetchReportsFail')}</div>`; }
}

async function replyReport(id, status){
  const replyEl = document.getElementById('reply-'+id);
  const admin_reply = replyEl ? replyEl.value.trim() : '';
  try{
    const d = await api('/api/admin/reports/'+id, 'PUT', { status, admin_reply });
    if(d.success){ toast(t('saved')); loadReports(); loadDashboard(); }
    else { toast(d.error || t('saveFail')); }
  }catch(e){ toast(t('cantConnect')); }
}

/* expose top-level functions for inline onclick handlers */
try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.api = api; } catch(e) {}
try { window.toast = toast; } catch(e) {}
try { window.esc = esc; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.doLogin = doLogin; } catch(e) {}
try { window.doLogout = doLogout; } catch(e) {}
try { window.initAdmin = initAdmin; } catch(e) {}
try { window.showPage = showPage; } catch(e) {}
try { window.sendAdminNotif = sendAdminNotif; } catch(e) {}
try { window.loadDashboard = loadDashboard; } catch(e) {}
try { window.loadUsers = loadUsers; } catch(e) {}
try { window.promoteUser = promoteUser; } catch(e) {}
try { window.deleteUser = deleteUser; } catch(e) {}
try { window.suspendUser = suspendUser; } catch(e) {}
try { window.unsuspendUser = unsuspendUser; } catch(e) {}
try { window.adminDisable2FA = adminDisable2FA; } catch(e) {}
try { window.loadPosts = loadPosts; } catch(e) {}
try { window.deletePost = deletePost; } catch(e) {}
try { window.loadVerify = loadVerify; } catch(e) {}
try { window.approveVerify = approveVerify; } catch(e) {}
try { window.rejectVerify = rejectVerify; } catch(e) {}
try { window.setReportsFilter = setReportsFilter; } catch(e) {}
try { window.loadReports = loadReports; } catch(e) {}
try { window.replyReport = replyReport; } catch(e) {}
try { window.loadAnalytics = loadAnalytics; } catch(e) {}
try { window.setLogsFilter = setLogsFilter; } catch(e) {}
try { window.loadLogs = loadLogs; } catch(e) {}
try { window.clearLogs = clearLogs; } catch(e) {}
