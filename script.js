/* Sets the theme-toggle icon without wiping any sibling label text.
   Targets the .ti-icon wrapper span if present, otherwise falls back
   to the button itself for older markup. */
function setThemeIcon(html) {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var iconWrap = btn.querySelector('.ti-icon');
  if (iconWrap) { iconWrap.innerHTML = html; }
  else { btn.innerHTML = html; }
}

/* ================= error-diagnostics (temporary debugging aid) ================= */
(function () {
  var box = null;
  function showError(msg) {
    try {
      if (!box) {
        box = document.createElement('div');
        box.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;' +
          'background:#d32f2f;color:#fff;font:12px/1.4 monospace;padding:8px 34px 8px 10px;' +
          'direction:ltr;text-align:left;white-space:pre-wrap;word-break:break-all;' +
          'max-height:40vh;overflow:auto;box-shadow:0 2px 8px rgba(0,0,0,.3)';
        var closeBtn = document.createElement('button');
        closeBtn.textContent = '\u2715';
        closeBtn.style.cssText = 'position:absolute;top:4px;right:6px;background:transparent;' +
          'border:none;color:#fff;font-size:16px;cursor:pointer;padding:2px 6px';
        closeBtn.onclick = function () { box.remove(); box = null; };
        box.appendChild(closeBtn);
        var msgEl = document.createElement('div');
        msgEl.className = 'js-err-list';
        box.appendChild(msgEl);
        document.documentElement.appendChild(box);
      }
      var line = document.createElement('div');
      line.style.cssText = 'border-top:1px solid rgba(255,255,255,.3);padding-top:6px;margin-top:6px';
      line.textContent = new Date().toLocaleTimeString() + '  ' + msg;
      box.querySelector('.js-err-list').appendChild(line);
    } catch (e) { /* never let the diagnostic tool itself crash the page */ }
  }
  window.addEventListener('error', function (e) {
    showError((e.error && e.error.stack) || e.message || 'Unknown error');
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    showError('Unhandled promise rejection: ' + ((r && (r.stack || r.message)) || r));
  });
})();

/* ================= admin.html ================= */
if (document.body.classList.contains('page-admin')) {
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

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
      const code = window.prompt('أدخل كود المصادقة الثنائية من تطبيق المصادقة:');
      if(!code){ btn.disabled=false; btn.textContent='دخول'; return; }
      d = await api('/api/login/2fa-verify','POST',{ pendingToken:d.pendingToken, code:code.trim() });
    }
    if(!d.success || d.role!=='admin'){errEl.textContent=d.error||'ليس لديك صلاحية admin';errEl.style.display='block';btn.disabled=false;btn.textContent='دخول';return;}
    TOKEN=d.token; localStorage.setItem('hostaka_token',TOKEN);
    initAdmin(d.username);
  }catch(e){errEl.textContent='فشل الاتصال';errEl.style.display='block';btn.disabled=false;btn.textContent='دخول';}
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
  if(!content){ toast('اكتب نص الإشعار'); return; }
  if(target !== 'all' && !target){ toast('حدد اسم المستخدم'); return; }
  const btn = document.getElementById('ntSendBtn');
  btn.disabled = true; btn.textContent = 'جارٍ الإرسال...';
  try{
    const d = await api('/api/admin/notifications', 'POST', { content, link, target });
    if(d.success){
      toast('تم إرسال الإشعار إلى ' + d.count + ' عضو');
      document.getElementById('ntContent').value = '';
      document.getElementById('ntLink').value = '';
      document.getElementById('ntUsername').value = '';
    } else {
      toast(d.error || 'فشل الإرسال');
    }
  }catch(e){ toast('تعذر الاتصال'); }
  btn.disabled = false; btn.textContent = 'إرسال الإشعار';
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
            ? `<span class="badge badge-suspended" title="${esc(u.suspend_reason||'')}">معلّق</span>`
            : `<span class="badge badge-active">نشط</span>`}
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${u.role!=='admin'?`<button class="btn btn-dark btn-sm" onclick="promoteUser(${u.id})">ترقية</button>`:''}
            ${u.role!=='admin' && !u.suspended?`<button class="btn btn-ghost btn-sm" onclick="suspendUser(${u.id},'${esc(u.username)}')" style="color:var(--danger);">تعليق</button>`:''}
            ${u.role!=='admin' && u.suspended?`<button class="btn btn-ghost btn-sm" onclick="unsuspendUser(${u.id},'${esc(u.username)}')" style="color:#15803d;">رفع التعليق</button>`:''}
            ${Number(u.totp_enabled)===1?`<button class="btn btn-ghost btn-sm" onclick="adminDisable2FA(${u.id},'${esc(u.username)}')" style="color:#a16207;" title="لو المستخدم محظور دخوله بسبب مشكلة بكود المصادقة الثنائية">إلغاء 2FA</button>`:''}
            ${u.role!=='admin'?`<button class="btn btn-ghost btn-sm" onclick="deleteUser(${u.id},'${esc(u.username)}')">حذف</button>`:''}
          </div>
        </td>
      </tr>`).join('');
  }catch(e){toast('فشل تحميل المستخدمين');}
}

async function promoteUser(id){
  if(!confirm('ترقية هذا المستخدم لـ admin؟')) return;
  await api('/api/admin/users/'+id+'/role','PUT',{role:'admin'});
  toast('تمت الترقية'); loadUsers();
}
async function deleteUser(id,name){
  if(!confirm('حذف '+name+'؟')) return;
  await api('/api/admin/users/'+id,'DELETE');
  toast('تم الحذف'); loadUsers();
}
async function suspendUser(id,name){
  const reason = prompt('سبب تعليق حساب @'+name+' (اختياري):','');
  if(reason===null) return;
  await api('/api/admin/users/'+id+'/suspend','PUT',{reason});
  toast('تم تعليق الحساب'); loadUsers();
}
async function unsuspendUser(id,name){
  if(!confirm('رفع التعليق عن @'+name+'؟')) return;
  await api('/api/admin/users/'+id+'/unsuspend','PUT');
  toast('تم رفع التعليق'); loadUsers();
}
async function adminDisable2FA(id,name){
  if(!confirm('إلغاء تفعيل المصادقة الثنائية لحساب @'+name+'؟ استخدم هذا فقط لو المستخدم محظور دخوله بسبب مشكلة بكود المصادقة.')) return;
  const d = await api('/api/admin/users/'+id+'/2fa/disable','PUT');
  if(d.success){ toast('تم إلغاء تفعيل المصادقة الثنائية لحساب @'+name); loadUsers(); }
  else toast(d.error||'تعذر التنفيذ');
}

async function loadPosts(){
  try{
    const posts=await api('/api/records');
    const el=document.getElementById('postsList');
    if(!posts.length){el.innerHTML='<div style="text-align:center;color:var(--muted);padding:24px;">لا توجد منشورات</div>';return;}
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
        <button class="btn btn-ghost btn-sm" onclick="deletePost(${p.id})">حذف</button>
      </div>`).join('');
  }catch(e){toast('فشل تحميل المنشورات');}
}

async function deletePost(id){
  if(!confirm('حذف هذا المنشور؟')) return;
  await api('/api/records/'+id,'DELETE');
  toast('تم الحذف'); loadPosts();
}

async function loadVerify(){
  try{
    const reqs=await api('/api/admin/verify');
    const el=document.getElementById('verifyList');
    if(!reqs.length){el.innerHTML='<div style="text-align:center;color:var(--muted);padding:24px;">لا توجد طلبات معلقة</div>';return;}
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
          <button class="btn btn-dark btn-sm" onclick="approveVerify(${r.user_id})">موافقة</button>
          <button class="btn btn-ghost btn-sm" onclick="rejectVerify(${r.user_id})">رفض</button>
        </div>
      </div>`).join('');
    const vb=document.getElementById('verifyBadge');
    if(reqs.length){vb.textContent=reqs.length;vb.style.display='inline';}
  }catch(e){toast('فشل تحميل الطلبات');}
}

async function approveVerify(id){
  await api('/api/admin/verify/'+id,'PUT',{action:'approve'});
  toast('تم منح التوثيق'); loadVerify(); loadDashboard();
}
async function rejectVerify(id){
  if(!confirm('رفض الطلب؟')) return;
  await api('/api/admin/verify/'+id,'PUT',{action:'reject'});
  toast('تم الرفض'); loadVerify();
}

// ============================================================
// البلاغات وطلبات الدعم
// ============================================================
let reportsFilter = 'pending';
const REPORT_TYPE_LABELS = { post:'منشور', comment:'تعليق', message:'رسالة', user:'مستخدم', general:'عام', bug:'مشكلة تقنية', abuse:'إساءة استخدام', account:'مشكلة حساب', suggestion:'اقتراح' };
const REPORT_STATUS_LABELS = { pending:'قيد المراجعة', resolved:'تم الحل', dismissed:'مرفوض' };

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
  el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px;">جارٍ التحميل...</div>';
  try{
    const url = reportsFilter ? '/api/admin/reports?status='+reportsFilter : '/api/admin/reports';
    const reports = await api(url);
    if(!Array.isArray(reports) || !reports.length){
      el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px;">لا توجد بلاغات هنا</div>';
      return;
    }
    el.innerHTML = reports.map(r => `
      <div class="card" style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-user">${esc(REPORT_TYPE_LABELS[r.type]||r.type)}</span>
            <strong style="font-size:0.86rem;">${esc(r.reporter_name||'مستخدم')}</strong>
            ${r.target_owner_name ? `<span style="font-size:0.78rem;color:var(--muted);">← بحق @${esc(r.target_owner_name)}</span>` : ''}
          </div>
          <span class="badge badge-${r.status==='pending'?'pending':(r.status==='resolved'?'active':'suspended')}">${esc(REPORT_STATUS_LABELS[r.status]||r.status)}</span>
        </div>
        ${r.subject ? `<div style="font-weight:700;font-size:0.88rem;margin-bottom:4px;">${esc(r.subject)}</div>` : ''}
        <div style="font-size:0.84rem;color:#444;line-height:1.6;margin-bottom:10px;">${esc(r.reason)}</div>
        ${r.admin_reply ? `<div style="background:var(--primary-light);border-radius:var(--radius-sm);padding:8px 10px;font-size:0.82rem;margin-bottom:10px;"><strong style="font-size:0.72rem;color:var(--muted);display:block;margin-bottom:3px;">ردك السابق</strong>${esc(r.admin_reply)}</div>` : ''}
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:10px;">${fmtDate(r.created_at)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <input type="text" class="form-input" id="reply-${r.id}" placeholder="اكتب رداً (اختياري)..." style="flex:1;min-width:180px;margin-bottom:0;">
          <button class="btn btn-dark btn-sm" onclick="replyReport(${r.id},'resolved')">حل + رد</button>
          <button class="btn btn-ghost btn-sm" onclick="replyReport(${r.id},'dismissed')">رفض</button>
        </div>
      </div>`).join('');
  }catch(e){ el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px;">فشل تحميل البلاغات</div>'; }
}

async function replyReport(id, status){
  const replyEl = document.getElementById('reply-'+id);
  const admin_reply = replyEl ? replyEl.value.trim() : '';
  try{
    const d = await api('/api/admin/reports/'+id, 'PUT', { status, admin_reply });
    if(d.success){ toast('تم الحفظ'); loadReports(); loadDashboard(); }
    else { toast(d.error || 'فشل الحفظ'); }
  }catch(e){ toast('تعذر الاتصال'); }
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
}

/* ================= chat.html ================= */
if (document.body.classList.contains('page-chat')) {
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
    reportUser: 'الإبلاغ عن المستخدم', blockUser: 'حظر المستخدم', deleteConversation: 'حذف المحادثة',
    noMedia: 'لا توجد وسائط', confirmDeleteConversation: 'سيتم حذف كل الرسائل في هذه المحادثة نهائياً. متابعة؟',
    conversationDeleted: 'تم حذف المحادثة', selectChat: 'اختر محادثة من القائمة', seenAt: 'شوهدت'
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
    reportUser: 'Report user', blockUser: 'Block user', deleteConversation: 'Delete conversation',
    noMedia: 'No media yet', confirmDeleteConversation: 'All messages in this conversation will be permanently deleted. Continue?',
    conversationDeleted: 'Conversation deleted', selectChat: 'Select a conversation from the list', seenAt: 'Seen'
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
function onWallpaperFile(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  if(file.size > 8*1024*1024){ alert('الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB'); return; }
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

function handleSuspended(reason){
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_role');
  alert('تم تعليق حسابك من قبل الإدارة' + (reason ? ':\n' + reason : '') + '\nللاستفسار يرجى التواصل مع الدعم عبر صفحة /support');
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
  { emoji:'like',  label:'أعجبني',  icon:SVG.like },
  { emoji:'heart', label:'أحببته',  icon:SVG.heart },
  { emoji:'haha',  label:'أضحكني',  icon:SVG.haha },
  { emoji:'sad',   label:'أحزنني',  icon:SVG.sad },
  { emoji:'angry', label:'أغضبني',  icon:SVG.angry },
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
    const label = d.blocked ? 'إلغاء حظر المستخدم' : 'حظر المستخدم';
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
  const isBlocked = txt && txt.textContent.includes('إلغاء');
  try{
    const d = isBlocked
      ? await apiFetch('/api/block/' + encodeURIComponent(currentPeerUsername), 'DELETE')
      : await apiFetch('/api/block/' + encodeURIComponent(currentPeerUsername), 'POST');
    if(d.success){
      showToast(isBlocked ? 'تم إلغاء الحظر' : 'تم حظر المستخدم');
      checkPeerBlockStatus();
    } else { showToast(d.error || 'فشلت العملية', 'error'); }
  }catch(e){ showToast('تعذر الاتصال', 'error'); }
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
      <button onclick="viewPeerProfile()">${SVG.user || ''}<span>${t('viewProfile')}</span></button>
      <button onclick="openConversationMedia()">${SVG.imageIc || ''}<span>${t('viewMedia')}</span></button>
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
  if (!confirm(t('confirmDeleteConversation'))) return;
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
  document.getElementById('reportPeerModalTitle').textContent = 'الإبلاغ عن المستخدم';
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
  const labels = { abuse:'إساءة أو تنمر', spam:'رسائل مزعجة', fake:'حساب مزيف أو منتحل', other:'سبب آخر' };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportPeerBtn');
  btn.disabled = true;
  try{
    const payload = reportMode === 'message'
      ? { type:'message', target_id: reportMsgTargetId, target_owner_username: currentPeerUsername, subject: t('reportMsgTitle'), reason }
      : { type:'user', target_owner_username: currentPeerUsername, subject: 'إبلاغ عن مستخدم @' + currentPeerUsername, reason };
    const d = await apiFetch('/api/reports', 'POST', payload);
    if(d.success){ showToast(reportMode === 'message' ? t('reportSent') : 'تم إرسال البلاغ'); closeModal('reportPeerModal'); }
    else { showToast(d.error || 'فشل الإرسال', 'error'); }
  }catch(e){ showToast('تعذر الاتصال', 'error'); }
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
async function loadMsgs(username, scroll = true) {
  const area = document.getElementById('msgsArea');
  try {
    const msgs = await apiFetch('/api/messages/' + encodeURIComponent(username));
    if (!Array.isArray(msgs)) {
      console.error('Expected array, got:', msgs);
      if (area) area.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-left:4px;"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> خطأ في تحميل الرسائل</div>';
      return;
    }
    await loadMsgReactions(msgs);
    renderMsgs(msgs, scroll);
  } catch (e) {
    console.error('loadMsgs failed:', e);
    if (area) area.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px;font-size:0.85rem;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-left:4px;"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> ' + (e.message || 'تعذر الاتصال بالخادم') + '</div>';
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
    showToast('فشل إرسال التفاعل', 'error');
  }
}

// ============================================================
//  الصور والإرسال
// ============================================================
function onChatImg(e) {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.match('image/jpeg')) { showToast('JPG/JPEG فقط', 'error'); return; }
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
  if (!confirm(t('deleteMsgConfirm'))) return;
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
      const d = await apiFetch('/api/messages/' + mid, 'PUT', { content });
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
    await apiFetch('/api/messages/' + encodeURIComponent(currentPeer), 'POST', { content, image: imageUrl, reply_to: replyTo });
    await loadMsgs(currentPeer);
    loadSidebar();
  } catch (e) {
    console.error('sendMsg failed:', e);
    showToast(e.message || 'فشل إرسال الرسالة', 'error');
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
    showToast('اضغط مطولاً على الصورة لحفظها', 'info');
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
}

/* ================= group.html ================= */
if (document.body.classList.contains('page-group')) {
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
    readReceiptsToggle:'إظهار مؤشر قراءة الرسائل', seenBy:'شاهدها'
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
    readReceiptsToggle:'Show read receipts', seenBy:'Seen by'
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
// الخادم يخزّن التوقيت بصيغة UTC بدون منطقة زمنية؛ نفسّرها كـ UTC ليحوّلها المتصفح تلقائياً لتوقيت جهاز المستخدم
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
function onWallpaperFile(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  if(file.size > 8*1024*1024){ alert('الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB'); return; }
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

function handleSuspended(reason){
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_role');
  alert('تم تعليق حسابك من قبل الإدارة' + (reason ? ':\n' + reason : '') + '\nللاستفسار يرجى التواصل مع الدعم عبر صفحة /support');
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
  const val = prompt(t('setNicknamePromptTitle'), current || '');
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
  if (!confirm(t('confirmBlockMember'))) return;
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
  const labels = { abuse:'إساءة أو تنمر', spam:'رسائل مزعجة', nudity:'محتوى غير لائق', other:'سبب آخر' };
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
  if (!confirm(t('confirmLeave'))) return;
  try {
    await apiFetch(`/api/groups/${GROUP_ID}/members/${ME.id}`, 'DELETE');
    showToast(t('leftGroup'));
    setTimeout(()=> location.href = '/chat', 700);
  } catch(e){ showToast(e.message || t('error'), 'error'); }
}

async function deleteGroupConfirm(){
  if (!confirm(t('confirmDelete'))) return;
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
  if (!f.type.match('image/jpeg')){ showToast('JPG/JPEG فقط', 'error'); return; }
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
  if (!confirm(t('deleteMsgConfirm'))) return;
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
  const labels = { spam:'محتوى مزعج / سبام', abuse:'إساءة أو تنمر', nudity:'محتوى غير لائق', other:'سبب آخر' };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const m = _lastMsgs.find(x => x.id === reportMsgTargetId);
  const btn = document.getElementById('reportMsgBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/reports', 'POST', {
      type: 'group_message', target_id: reportMsgTargetId, target_owner_username: m?.from_name || '',
      subject: 'إبلاغ عن رسالة مجموعة', reason
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
    showToast('اضغط مطولاً على الصورة لحفظها', 'info');
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
}

/* ================= index.html ================= */
if (document.body.classList.contains('page-index')) {
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
    storyUploadHint: 'اختر صورة أو فيديو للقصة', yourStory: 'قصتك'
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
    storyUploadHint: 'Choose a photo or video for your story', yourStory: 'Your Story'
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

function onWallpaperFile(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  if(file.size > 8*1024*1024){ alert('الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB'); return; }
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

      if(count === 0){ // fallback to average of all
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
// الخادم يخزّن التوقيت بصيغة UTC بدون منطقة زمنية؛ نفسّرها كـ UTC ليحوّلها المتصفح تلقائياً لتوقيت جهاز المستخدم
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

function handleSuspended(reason){
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_role');
  alert('تم تعليق حسابك من قبل الإدارة' + (reason ? ':\n' + reason : '') + '\nللاستفسار يرجى التواصل مع الدعم عبر صفحة /support');
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
  { emoji:'like',  label:'أعجبني',  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>` },
  { emoji:'heart', label:'أحببته',  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { emoji:'haha',  label:'أضحكني',  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
  { emoji:'sad',   label:'أحزنني',  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
  { emoji:'angry', label:'أغضبني',  icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>` },
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
  document.getElementById('btnLogin').style.display = 'flex';
  document.getElementById('userBadgeWrap').style.display = 'none';
  document.getElementById('notifWrap').style.display = 'none';
  renderStoriesBar();
  renderAccountSwitcher();
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
      <span class="acc-label">${currentLang === 'ar' ? 'إضافة' : 'Add'}</span>
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
    } else { errEl.textContent=d.error||'فشل'; errEl.style.display='block'; }
  } catch(e){ errEl.textContent='تعذر الاتصال'; errEl.style.display='block'; }
  finally { btn.disabled=false; btn.innerHTML=`<span id="loginSubmitText">${t('loginSubmit')}</span>`; }
}

async function submit2FALogin(){
  const code = document.getElementById('login2faCode').value.trim();
  const errEl = document.getElementById('login2faErr'); errEl.style.display='none';
  if(!code){ errEl.textContent='أدخل كود المصادقة'; errEl.style.display='block'; return; }
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
    } else { errEl.textContent=d.error||'كود غير صحيح'; errEl.style.display='block'; }
  } catch(e){ errEl.textContent='تعذر الاتصال'; errEl.style.display='block'; }
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
    } else { errEl.textContent=d.error||'فشل'; errEl.style.display='block'; }
  } catch(e){ errEl.textContent='تعذر الاتصال'; errEl.style.display='block'; }
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
  if(diff < 60) return 'الآن';
  if(diff < 3600) return Math.floor(diff/60) + ' د';
  if(diff < 86400) return Math.floor(diff/3600) + ' س';
  if(diff < 2592000) return Math.floor(diff/86400) + ' يوم';
  return fmtDate(dateStr);
}

function notifMessage(n){
  const actor = `<b>${esc(n.actor_name || 'مستخدم')}</b>`;
  switch(n.type){
    case 'mention_post':    return `${actor} أشار إليك في منشور`;
    case 'mention_comment':  return `${actor} أشار إليك في تعليق`;
    case 'comment':          return `${actor} علّق على منشورك`;
    case 'report_reply':     return `رد فريق الدعم على بلاغك: ${esc(n.content||'')}`;
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
      list.innerHTML = '<div style="text-align:center;padding:26px 10px;color:var(--muted);font-size:0.82rem;">لا توجد إشعارات</div>';
      return;
    }
    list.innerHTML = notifCache.map(n => `
      <div class="notif-item ${n.read?'':'unread'}" onclick="onNotifClick(${n.id}, ${n.record_id||'null'}, '${esc(n.link||'')}')">
        <div class="notif-avatar">${n.actor_avatar ? `<img src="${esc(n.actor_avatar)}" alt="">` : esc((n.actor_name||'?').charAt(0).toUpperCase())}</div>
        <div class="notif-body">
          <div class="notif-text">${notifMessage(n)}</div>
          <div class="notif-time">${timeAgo(n.created_at)}</div>
        </div>
        <button class="notif-del" onclick="event.stopPropagation();delNotif(${n.id})" title="حذف">${SVG.delete}</button>
      </div>
    `).join('');
  } catch(e){
    list.innerHTML = '<div style="text-align:center;padding:26px 10px;color:var(--muted);font-size:0.82rem;">تعذر تحميل الإشعارات</div>';
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
    wrapper.innerHTML = html;
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
  document.getElementById('reportModalTitle').textContent = type==='post' ? 'الإبلاغ عن المنشور' : 'الإبلاغ عن مستخدم';
  document.getElementById('reportReason').value = 'spam';
  document.getElementById('reportDetails').value = '';
  document.getElementById('reportModal').classList.add('show');
}
async function submitReport(){
  const reasonType = document.getElementById('reportReason').value;
  const details = document.getElementById('reportDetails').value.trim();
  const labels = { spam:'محتوى مزعج / سبام', abuse:'إساءة أو تنمر', nudity:'محتوى غير لائق', fake:'حساب مزيف أو منتحل', other:'سبب آخر' };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportSubmitBtn');
  btn.disabled = true;
  try {
    const d = await apiFetch('/api/reports', 'POST', {
      type: reportTarget.type, target_id: reportTarget.id,
      target_owner_username: reportTarget.owner,
      subject: reportTarget.type==='post' ? 'إبلاغ عن منشور' : 'إبلاغ عن مستخدم',
      reason
    });
    if(d.success){ showToast('تم إرسال البلاغ، شكراً لك'); closeModal('reportModal'); }
    else { showToast(d.error||'فشل الإرسال','error'); }
  } catch(e){ showToast('تعذر الاتصال','error'); }
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
      if(isBlocked){ blockedUsernames.delete(username); showToast('تم إلغاء حظر @'+username); }
      else { blockedUsernames.add(username); showToast('تم حظر @'+username); }
      loadPosts();
    } else { showToast(d.error||'فشلت العملية','error'); }
  } catch(e){ showToast('تعذر الاتصال','error'); }
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
      showToast(d.error||'فشل الطلب', 'error');
    }
  } catch(e){ showToast('تعذر الاتصال','error'); }
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
    mediaHtml = `<video class="card-video" controls><source src="${esc(p.video)}" type="video/mp4"></video>`;
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
    const cleanContent = linkifyContent(stripEmojis(esc(c.content)));
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
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');

  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="${t('reply')}" id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
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
              <span class="role-badge ${badgeCls}">${p.user_role==='Admin' ? t('adminRole') : (p.user_role==='Page' ? 'صفحة' : t('member'))}</span>
              ${esc(name)}
              ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            </div>
            <div class="pub-date">${fmtDate(p.created_at)}${Number(p.edited)===1 ? ' · <span style="opacity:0.7;">'+esc(t('postEdited'))+'</span>' : ''}</div>
          </div>
        </div>
        <div class="pub-actions">
          ${ME ? `<button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSavePost(${p.id})" title="${p.is_saved?t('unsave')||'إلغاء الحفظ':t('save')||'حفظ'}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>` : ''}
          <button class="btn-icon" onclick="sharePost(${p.id})" title="${t('share')}">${SVG.share}</button>
          ${ME && p.user_id && p.user_id!=ME?.id ? `<button class="btn-icon" onclick="location.href='/chat?with=${esc(p.publisher)}'" title="${t('message')}">${SVG.comment}</button>` : ''}
          ${canDel ? `<button class="btn-icon" onclick="delPost(${p.id})" title="${t('delete')}">${SVG.delete}</button>` : ''}
          ${ME && p.user_id && p.user_id!=ME?.id ? `
          <div class="post-opts-wrap">
            <button class="btn-icon" onclick="togglePostOpts(${p.id})" title="خيارات">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="post-opts-menu" id="postOpts-${p.id}">
              <button onclick="openReportModal('post', ${p.id}, '${esc(p.publisher)}'); closePostOpts(${p.id});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                الإبلاغ عن المنشور
              </button>
              <button class="danger" onclick="toggleBlockUser('${esc(p.publisher)}'); closePostOpts(${p.id});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                حظر @${esc(p.publisher)}
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

function sharePost(id){
  const url = window.location.origin + '/post?id=' + id;
  if(navigator.clipboard){ navigator.clipboard.writeText(url).then(()=>showToast(t('copyLink'))); }
  else { prompt('انسخ الرابط:',url); }
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
}

let myPagesCache = null;
async function loadPostAsOptions(){
  const wrap = document.getElementById('postAsWrap');
  const sel = document.getElementById('postAsSelect');
  wrap.style.display = 'none';
  try {
    if (myPagesCache === null) myPagesCache = await apiFetch('/api/pages/mine');
    if (!Array.isArray(myPagesCache) || !myPagesCache.length) return;
    sel.innerHTML = `<option value="">${esc(ME.display_name || ME.username)} (${currentLang === 'ar' ? 'حسابي' : 'my account'})</option>` +
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
      preview.innerHTML = `<img src="${postMediaBase64}" alt="معاينة الصورة">`;
    } else {
      postVideoMeta = await readVideoDimensions(f);
      const reelTag = postVideoMeta.isReel ? `<div class="reel-detect-badge">${SVG.reel} <span>${t('reelDetected')}</span></div>` : '';
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
  if((!content || content==='<br>') && !postMediaBase64){ errEl.textContent='المحتوى أو الملف مطلوب'; errEl.style.display='block'; return; }
  const btn=document.getElementById('postBtn'); btn.disabled=true; btn.textContent='...';
  try {
    let imageUrl='', videoUrl='';
    if(postMediaType === 'image' && postMediaBase64){
      const up = await apiFetch('/api/upload', 'POST', { image: postMediaBase64 });
      if (up.url) {
        imageUrl = up.url;
      } else {
        errEl.textContent = up.error || 'فشل رفع الملف';
        errEl.style.display='block';
        btn.disabled=false; btn.innerHTML=`<span id="publishBtn">${t('publish')}</span>`;
        return;
      }
    } else if (postMediaType === 'video' && postMediaFileObj) {
      try {
        // 1) نجيب توقيع رفع مؤقت (signature) من السيرفر عندنا
        const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
        if (!sig.signature) throw new Error(sig.error || 'تعذر تجهيز رفع الفيديو');

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
          throw new Error(vData.error?.message || 'فشل رفع الفيديو');
        }
        videoUrl = vData.secure_url;
      } catch (upErr) {
        errEl.textContent = upErr.message || 'فشل رفع الفيديو';
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
      } else { errEl.textContent = d.error || 'فشل التعديل'; errEl.style.display = 'block'; }
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
    else { errEl.textContent=d.error||'فشل النشر'; errEl.style.display='block'; }
  } catch(e){ errEl.textContent='تعذر الاتصال'; errEl.style.display='block'; }
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
  if(!confirm(t('deleteConfirm'))) return;
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
    btn.title = d.saved ? (t('unsave')||'إلغاء الحفظ') : (t('save')||'حفظ');
  }
  showToast(d.saved ? 'تم حفظ المنشور' : 'تم إلغاء حفظ المنشور');
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
      if (!up.url) throw new Error(up.error || 'فشل رفع الملف');
      mediaUrl = up.url;
    } else {
      const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
      if (!sig.signature) throw new Error(sig.error || 'تعذر تجهيز رفع الفيديو');
      const fd = new FormData();
      fd.append('file', storyMediaFileObj);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', sig.timestamp);
      fd.append('folder', sig.folder);
      fd.append('signature', sig.signature);
      const vRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`, { method:'POST', body: fd });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.secure_url) throw new Error(vData.error?.message || 'فشل رفع الفيديو');
      mediaUrl = vData.secure_url;
    }
    const caption = document.getElementById('storyCaptionInput').value.trim();
    const d = await apiFetch('/api/stories', 'POST', { media: mediaUrl, media_type: storyMediaType, caption });
    if (d.success) { closeModal('storyCreateModal'); await loadStories(); showToast(t('storyPublish')); }
    else { errEl.textContent = d.error || 'فشل النشر'; errEl.style.display = 'block'; }
  } catch(e) { errEl.textContent = e.message || 'تعذر الاتصال'; errEl.style.display = 'block'; }
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
  if (!confirm(t('storyDeleteConfirm'))) { showStorySlide(); return; } // نعيد المؤقت إذا ألغى المستخدم
  const targetStoryId = story.id;
  const targetUserId = group.user_id;
  try {
    const d = await apiFetch('/api/stories/' + targetStoryId, 'DELETE');
    if (d && d.error) { showToast(d.error, 'error'); showStorySlide(); return; }
  } catch(e) { showToast('تعذر حذف القصة', 'error'); showStorySlide(); return; }

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
  if(!confirm(t('deleteComment'))) return;
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
}

/* ================= login.html ================= */
if (document.body.classList.contains('page-login')) {
// ----- الثيم (متوافق مع باقي المنصة) -----
(function(){
  const saved = localStorage.getItem('hostaka_theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme','dark');
  }
})();

// إن كان المستخدم مسجّلاً دخوله بالفعل، أعده للصفحة الرئيسية
if (localStorage.getItem('hostaka_token')) {
  location.href = '/';
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

// افتح التبويب المطلوب عبر ?tab=register
(function(){
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'register') switchTab('register');
})();

function setLoggedIn(d){
  localStorage.setItem('hostaka_token', d.token);
  localStorage.setItem('hostaka_role', d.role);
  localStorage.setItem('hostaka_user', JSON.stringify({ username:d.username, role:d.role, avatar:d.avatar||'' }));
}

function showErr(id, msg){
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}
function hideErr(id){ document.getElementById(id).style.display='none'; }

// ----- تسجيل الدخول -----
async function doLogin(){
  const email = document.getElementById('lEmail').value.trim();
  const pass  = document.getElementById('lPass').value;
  hideErr('loginErr');
  if (!email || !pass) return showErr('loginErr','البريد وكلمة المرور مطلوبان');
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    let d = await apiFetch('/api/login','POST',{ email, password: pass });
    if (d.requires2FA) {
      const code = window.prompt('أدخل كود المصادقة الثنائية من تطبيق المصادقة:');
      if (!code) { btn.disabled = false; btn.textContent = 'دخول'; return; }
      d = await apiFetch('/api/login/2fa-verify','POST',{ pendingToken: d.pendingToken, code: code.trim() });
    }
    if (d.success) { setLoggedIn(d); location.href = '/'; }
    else showErr('loginErr', d.error || 'فشل تسجيل الدخول');
  } catch(e) { showErr('loginErr','تعذر الاتصال بالخادم'); }
  finally { btn.disabled = false; btn.textContent = 'دخول'; }
}
document.getElementById('lPass').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
document.getElementById('lEmail').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });

// ----- إنشاء حساب: الخطوة 1 -----
let regPayload = null;

async function startRegister(){
  const username = document.getElementById('rUser').value.trim();
  const email    = document.getElementById('rEmail').value.trim();
  const password = document.getElementById('rPass').value;
  hideErr('regErr');
  if (!username || !email || !password) return showErr('regErr','جميع الحقول مطلوبة');
  if (password.length < 6) return showErr('regErr','كلمة المرور 6 أحرف على الأقل');

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
      showErr('regErr', d.error || 'تعذر إرسال كود التأكيد');
    }
  } catch(e) { showErr('regErr','تعذر الاتصال بالخادم'); }
  finally { btn.disabled = false; btn.textContent = 'إرسال كود التأكيد'; }
}

// ----- إنشاء حساب: الخطوة 2 (تأكيد الكود) -----
async function verifyRegister(){
  if (!regPayload) return backToStart();
  const code = document.getElementById('vCode').value.trim();
  hideErr('verifyErr');
  if (!/^\d{6}$/.test(code)) return showErr('verifyErr','أدخل كود التأكيد المكون من 6 أرقام');

  const btn = document.getElementById('verifyBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/register/verify','POST',{ email: regPayload.email, code });
    if (d.success) {
      setLoggedIn(d);
      location.href = '/';
    } else {
      showErr('verifyErr', d.error || 'كود غير صحيح');
      if (d.expired) backToStart();
    }
  } catch(e) { showErr('verifyErr','تعذر الاتصال بالخادم'); }
  finally { btn.disabled = false; btn.textContent = 'تأكيد وإنشاء الحساب'; }
}
document.getElementById('vCode').addEventListener('keydown', e => { if (e.key==='Enter') verifyRegister(); });

// ----- إعادة إرسال الكود مع عداد تنازلي -----
let resendTimer = null;
function startResendCooldown(seconds, btnId){
  const btn = document.getElementById(btnId || 'resendBtn');
  btn.disabled = true;
  let left = seconds;
  const timerRef = btnId === 'resendForgotBtn' ? 'forgotResendTimer' : 'resendTimer';
  btn.textContent = `إعادة الإرسال بعد ${left} ثانية`;
  clearInterval(window[timerRef]);
  window[timerRef] = setInterval(() => {
    left--;
    if (left <= 0) {
      clearInterval(window[timerRef]);
      btn.disabled = false;
      btn.textContent = 'إعادة إرسال الكود';
    } else {
      btn.textContent = `إعادة الإرسال بعد ${left} ثانية`;
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
      ok.textContent = 'تم إرسال كود جديد إلى بريدك الإلكتروني';
      ok.style.display = 'block';
      setTimeout(() => ok.style.display='none', 4000);
      startResendCooldown(45, 'resendBtn');
    } else {
      showErr('verifyErr', d.error || 'تعذر إعادة إرسال الكود');
      startResendCooldown(45, 'resendBtn');
    }
  } catch(e) { showErr('verifyErr','تعذر الاتصال بالخادم'); btn.disabled=false; }
}

// ----- نسيت كلمة المرور: الخطوة 1 -----
let forgotEmail = null;

async function startForgot(){
  const email = document.getElementById('fEmail').value.trim();
  hideErr('forgotErr');
  if (!email) return showErr('forgotErr','البريد الإلكتروني مطلوب');

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
      showErr('forgotErr', d.error || 'تعذر إرسال كود التأكيد');
    }
  } catch(e) { showErr('forgotErr','تعذر الاتصال بالخادم'); }
  finally { btn.disabled = false; btn.textContent = 'إرسال كود التأكيد'; }
}

// ----- نسيت كلمة المرور: الخطوة 2 (تأكيد الكود + كلمة مرور جديدة) -----
async function doResetPassword(){
  if (!forgotEmail) return backToForgotStart();
  const code = document.getElementById('fCode').value.trim();
  const newPassword = document.getElementById('fNewPass').value;
  hideErr('resetErr');
  if (!/^\d{6}$/.test(code)) return showErr('resetErr','أدخل كود التأكيد المكون من 6 أرقام');
  if (newPassword.length < 6) return showErr('resetErr','كلمة المرور 6 أحرف على الأقل');

  const btn = document.getElementById('resetBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
  try {
    const d = await apiFetch('/api/auth/password/reset','POST',{ email: forgotEmail, code, newPassword });
    if (d.success) {
      setLoggedIn(d);
      location.href = '/';
    } else {
      showErr('resetErr', d.error || 'تعذر إعادة تعيين كلمة المرور');
      if (d.expired) backToForgotStart();
    }
  } catch(e) { showErr('resetErr','تعذر الاتصال بالخادم'); }
  finally { btn.disabled = false; btn.textContent = 'تعيين كلمة المرور'; }
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
      ok.textContent = 'تم إرسال كود جديد إلى بريدك الإلكتروني';
      ok.style.display = 'block';
      setTimeout(() => ok.style.display='none', 4000);
      startResendCooldown(45, 'resendForgotBtn');
    } else {
      showErr('resetErr', d.error || 'تعذر إعادة إرسال الكود');
      startResendCooldown(45, 'resendForgotBtn');
    }
  } catch(e) { showErr('resetErr','تعذر الاتصال بالخادم'); btn.disabled=false; }
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
}

/* ================= page.html ================= */
if (document.body.classList.contains('page-page')) {
if (localStorage.getItem('hostaka_theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}
const TOKEN = localStorage.getItem('hostaka_token') || '';
let ME = null;
try { const s = localStorage.getItem('hostaka_user'); if (s) ME = JSON.parse(s); } catch(e) {}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
async function apiFetch(url, method='GET', body=null){
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  return r.json();
}
function toUTCDate(s){
  if (!s) return new Date(NaN);
  if (typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s.replace(' ', 'T') + 'Z');
  return new Date(s);
}
function fmtDate(s){
  const d = toUTCDate(s);
  return d.toLocaleDateString('ar', { day:'numeric', month:'short', year:'numeric' });
}

const username = new URLSearchParams(location.search).get('u') || '';
let pageData = null;

async function loadPage(){
  if (!username) { showEmpty('لم يتم تحديد الصفحة'); return; }
  try {
    const d = await apiFetch('/api/pages/' + encodeURIComponent(username));
    if (d.error) { showEmpty(d.error); return; }
    pageData = d;
    document.title = 'Hostaka — ' + d.name;
    render();
  } catch(e) { showEmpty('تعذر تحميل الصفحة'); }
}

function showEmpty(msg){
  document.getElementById('content').innerHTML = `<div class="empty">${esc(msg)}</div>`;
}

function render(){
  const p = pageData;
  const avatarHtml = p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc((p.name||'?').charAt(0).toUpperCase());
  const followBtn = ME
    ? (p.isOwner
        ? `<button class="btn btn-ghost" onclick="openEditPage()">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
             تعديل الصفحة
           </button>`
        : `<button class="btn ${p.isFollowing ? 'btn-primary following' : 'btn-primary'}" id="followBtn" onclick="toggleFollow()">${p.isFollowing ? 'متابَع' : 'متابعة'}</button>`)
    : `<button class="btn btn-primary" onclick="location.href='/login'">تسجيل الدخول للمتابعة</button>`;

  const postsHtml = (p.posts && p.posts.length)
    ? p.posts.map(postCardHtml).join('')
    : `<div class="empty">لا توجد منشورات بعد</div>`;

  document.getElementById('content').innerHTML = `
    <div class="cover">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : ''}</div>
    <div class="page-head">
      <div class="page-avatar">${avatarHtml}</div>
      <div class="page-info">
        <div class="page-name">${esc(p.name)}${p.verified ? verifiedBadge() : ''}</div>
        <div class="page-handle">@${esc(p.username)}${p.category ? ' · ' + esc(p.category) : ''}</div>
        ${p.bio ? `<div class="page-bio">${esc(p.bio)}</div>` : ''}
        <div class="page-stats"><span><b id="followerCount">${p.followerCount || 0}</b> متابع</span><span><b>${(p.posts||[]).length}</b> منشور</span></div>
        <div class="page-actions">${followBtn}</div>
      </div>
    </div>
    <div class="posts-wrap">${postsHtml}</div>
  `;
}

function verifiedBadge(){
  return `<svg width="16" height="16" viewBox="0 0 24 24" style="fill:var(--primary)"><path d="M12 2l2.4 2.2 3.2-.6.6 3.2L20.4 9l-1.8 2.8L20.4 15l-2.2 2.2-.6 3.2-3.2-.6L12 22l-2.4-2.2-3.2.6-.6-3.2L3.6 15l1.8-2.8L3.6 9l2.2-2.2.6-3.2 3.2.6z"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function postCardHtml(post){
  const avatarHtml = pageData.avatar ? `<img src="${esc(pageData.avatar)}" alt="">` : esc((pageData.name||'?').charAt(0).toUpperCase());
  let mediaHtml = '';
  if (post.video) mediaHtml = `<div class="post-media"><video controls src="${esc(post.video)}"></video></div>`;
  else if (post.image) mediaHtml = `<div class="post-media"><img src="${esc(post.image)}" loading="lazy"></div>`;
  return `<div class="post-card">
    <div class="post-head">
      <div class="post-av">${avatarHtml}</div>
      <div>
        <div class="post-name">${esc(pageData.name)}</div>
        <div class="post-date">${fmtDate(post.created_at)}${Number(post.edited)===1 ? ' · معدّلة' : ''}</div>
      </div>
    </div>
    ${post.content ? `<div class="post-content">${esc(post.content)}</div>` : ''}
    ${mediaHtml}
  </div>`;
}

async function toggleFollow(){
  if (!ME) { location.href = '/login'; return; }
  const btn = document.getElementById('followBtn');
  btn.disabled = true;
  try {
    const action = pageData.isFollowing ? 'unfollow' : 'follow';
    const d = await apiFetch('/api/pages/' + pageData.id + '/' + action, 'POST');
    if (d.success) {
      pageData.isFollowing = !pageData.isFollowing;
      pageData.followerCount = d.followerCount;
      render();
    }
  } catch(e) {}
  if (btn) btn.disabled = false;
}

let editAvatarBase64 = '';
let editCoverBase64 = '';
function openEditPage(){
  document.getElementById('epName').value = pageData.name || '';
  document.getElementById('epCategory').value = pageData.category || '';
  document.getElementById('epBio').value = pageData.bio || '';
  document.getElementById('editPageErr').style.display = 'none';
  editAvatarBase64 = '';
  editCoverBase64 = '';
  document.getElementById('editPageModal').classList.add('show');
}
function closeEditPage(){ document.getElementById('editPageModal').classList.remove('show'); }
function onEditAvatar(e){
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => { editAvatarBase64 = ev.target.result; };
  reader.readAsDataURL(f);
}
function onEditCover(e){
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => { editCoverBase64 = ev.target.result; showToast('تم اختيار الغلاف، اضغط حفظ لتطبيقه'); };
  reader.readAsDataURL(f);
}
async function savePageEdit(){
  const errEl = document.getElementById('editPageErr'); errEl.style.display = 'none';
  const name = document.getElementById('epName').value.trim();
  if (!name) { errEl.textContent = 'اسم الصفحة مطلوب'; errEl.style.display = 'block'; return; }
  const btn = document.getElementById('epSaveBtn'); btn.disabled = true;
  try {
    let avatarUrl = pageData.avatar;
    if (editAvatarBase64) {
      const up = await apiFetch('/api/upload', 'POST', { image: editAvatarBase64 });
      if (up.url) avatarUrl = up.url;
    }
    let coverUrl = pageData.cover;
    if (editCoverBase64) {
      const up = await apiFetch('/api/upload', 'POST', { image: editCoverBase64 });
      if (up.url) coverUrl = up.url;
    }
    const d = await apiFetch('/api/pages/' + pageData.id, 'PUT', {
      name, avatar: avatarUrl, cover: coverUrl, bio: document.getElementById('epBio').value.trim(),
      category: document.getElementById('epCategory').value.trim()
    });
    if (d.success) { closeEditPage(); await loadPage(); }
    else { errEl.textContent = d.error || 'فشل الحفظ'; errEl.style.display = 'block'; }
  } catch(e) { errEl.textContent = 'تعذر الاتصال'; errEl.style.display = 'block'; }
  btn.disabled = false;
}

loadPage();

/* expose top-level functions for inline onclick handlers */
try { window.esc = esc; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.toUTCDate = toUTCDate; } catch(e) {}
try { window.fmtDate = fmtDate; } catch(e) {}
try { window.loadPage = loadPage; } catch(e) {}
try { window.showEmpty = showEmpty; } catch(e) {}
try { window.render = render; } catch(e) {}
try { window.verifiedBadge = verifiedBadge; } catch(e) {}
try { window.postCardHtml = postCardHtml; } catch(e) {}
try { window.toggleFollow = toggleFollow; } catch(e) {}
try { window.openEditPage = openEditPage; } catch(e) {}
try { window.closeEditPage = closeEditPage; } catch(e) {}
try { window.onEditAvatar = onEditAvatar; } catch(e) {}
try { window.savePageEdit = savePageEdit; } catch(e) {}
}

/* ================= profile.html ================= */
if (document.body.classList.contains('page-profile')) {
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
    noFollowers: 'لا يوجد متابعون', noFollowing: 'لا يتابع أحداً'
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
    noFollowers: 'No followers yet', noFollowing: 'Not following anyone'
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
    noFollowers: 'Aucun abonné', noFollowing: 'Aucun abonnement'
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
    noFollowers: 'Нет подписчиков', noFollowing: 'Нет подписок'
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
    noFollowers: '暂无关注者', noFollowing: '未关注任何人'
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
    noFollowers: 'フォロワーはいません', noFollowing: 'フォローしている人はいません'
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
  document.getElementById('langMenu').classList.remove('show');
  applyLang();
  if (viewUsername) loadPublicProfile(viewUsername);
  else if (ME) loadMyProfile();
}

// ============================================================
//  VERIFIED BADGE (Adaptive)
// ============================================================
function verifiedBadge() {
  return `<span class="verified-icon" title="${t('verified') || 'حساب موثق'}"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z" fill="var(--badge-verified-fill)" stroke="var(--badge-verified-fill)" stroke-width="0.5"/><path d="M10.6 16.2l-4.1-4.1 1.4-1.4 2.7 2.7 5.5-5.5 1.4 1.4-6.9 6.9z" fill="var(--badge-verified-check)"/></svg></span>`;
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
// الخادم يخزّن التوقيت بصيغة UTC بدون منطقة زمنية؛ نفسّرها كـ UTC ليحوّلها المتصفح تلقائياً لتوقيت جهاز المستخدم
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
  { emoji:'like',  label:'أعجبني',  icon:SVG.like },
  { emoji:'heart', label:'أحببته',  icon:SVG.heart },
  { emoji:'haha',  label:'أضحكني',  icon:SVG.haha },
  { emoji:'sad',   label:'أحزنني',  icon:SVG.sad },
  { emoji:'angry', label:'أغضبني',  icon:SVG.angry },
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
    wrapper.innerHTML = html;
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

function handleSuspended(reason){
  localStorage.removeItem('hostaka_token');
  localStorage.removeItem('hostaka_user');
  localStorage.removeItem('hostaka_role');
  alert('تم تعليق حسابك من قبل الإدارة' + (reason ? ':\n' + reason : '') + '\nللاستفسار يرجى التواصل مع الدعم عبر صفحة /support');
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
    
    // استخدام البيانات من pr مباشرة (لأن الخادم يعيد is_following عند تمرير التوكن)
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

// متغير لحالة المتابعة الحالية للمستخدم المعروض
let currentFollowStatus = { following: false, followers_count: 0, following_count: 0 };

function renderPublic(user, posts, followStatus) {
  userPosts = posts;
  currentFollowStatus = followStatus; // حفظ الحالة
  const token = getToken();
  const isOwn = token && ME && ME.username === user.username;
  const isFollowing = followStatus.following || false;
  const followersCount = followStatus.followers_count || 0;
  const followingCount = followStatus.following_count || 0;
  const isLocked = Number(user.is_private) === 1 && !isOwn && !isFollowing;

  const canMessage = user.message_privacy === 'none' ? false
    : user.message_privacy === 'followers' ? isFollowing
    : true; // 'everyone' أو غير محدد

  let actionsHtml = '';
  if (isOwn) {
    actionsHtml = `<button class="btn-edit" onclick="switchTab('edit')">${SVG.edit}${t('editProfile')}</button>`;
  } else if (token) {
    actionsHtml = `
      ${canMessage ? `<a href="/chat?with=${esc(user.username)}" class="btn-msg">${SVG.msg}${t('message') || 'مراسلة'}</a>` : ''}
      <button class="btn-follow ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${esc(user.username)}', this)">
        ${isFollowing ? SVG.check : SVG.follow}
        <span>${isFollowing ? t('unfollow') : t('follow')}</span>
      </button>
      <div class="btn-more-wrap">
        <button class="btn-more" onclick="toggleMoreMenu()" title="خيارات">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        <div class="more-menu" id="moreMenu">
          <button onclick="openReportUserModal('${esc(user.username)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            الإبلاغ عن المستخدم
          </button>
          <button class="danger" id="blockToggleBtn" onclick="toggleBlockProfile('${esc(user.username)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span id="blockToggleText">حظر المستخدم</span>
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
      <div class="meta-name">${esc(user.display_name || user.username)} ${user.verified ? verifiedBadge() : ''} ${Number(user.is_private)===1 ? '<span class="private-badge">🔒 خاص</span>' : ''}</div>
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
        <div>هذا الحساب خاص. تابعه عشان تقدر تشوف منشوراته</div>
      </div>` : renderPosts(posts)}</div>`;

  if (!isOwn && token) checkBlockStatus(user.username);
}

// ----- الحظر والإبلاغ عن مستخدم -----
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
    if(txt) txt.textContent = d.blocked ? 'إلغاء حظر المستخدم' : 'حظر المستخدم';
  }catch(e){}
}

async function toggleBlockProfile(username){
  document.getElementById('moreMenu')?.classList.remove('show');
  const txt = document.getElementById('blockToggleText');
  const isBlocked = txt && txt.textContent.includes('إلغاء');
  try{
    const d = isBlocked
      ? await apiFetch('/api/block/' + encodeURIComponent(username), 'DELETE')
      : await apiFetch('/api/block/' + encodeURIComponent(username), 'POST');
    if(d.success){
      showToast(isBlocked ? 'تم إلغاء حظر @'+username : 'تم حظر @'+username);
      checkBlockStatus(username);
    } else { showToast(d.error || 'فشلت العملية', 'error'); }
  }catch(e){ showToast('تعذر الاتصال', 'error'); }
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
  const labels = { abuse:'إساءة أو تنمر', fake:'حساب مزيف أو منتحل', spam:'محتوى مزعج / سبام', other:'سبب آخر' };
  const reason = labels[reasonType] + (details ? ' — ' + details : '');
  const btn = document.getElementById('reportUserSubmitBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/reports', 'POST', {
      type: 'user', target_owner_username: username,
      subject: 'إبلاغ عن مستخدم @' + username, reason
    });
    if(d.success){ showToast('تم إرسال البلاغ، شكراً لك'); document.getElementById('reportUserModal').classList.remove('show'); }
    else { showToast(d.error || 'فشل الإرسال', 'error'); }
  }catch(e){ showToast('تعذر الاتصال', 'error'); }
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
      <button class="tab-btn" id="tabPrivacy" onclick="switchTab('privacy')">الخصوصية</button>
      <button class="tab-btn" id="tabPages" onclick="switchTab('pages')">الصفحات</button>
    </div>
    <div class="posts-tab" id="postsTab">
      <button class="create-post-cta" onclick="openPostModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        منشور جديد
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
        <div class="fg"><label>الدولة</label><input type="text" id="fCountry" value="${esc(user.country || '')}" placeholder="مثال: السعودية"></div>
        <div class="fg"><label>المدرسة/الجامعة</label><input type="text" id="fSchool" value="${esc(user.school || '')}" placeholder="اختياري"></div>
      </div>
      <div class="fg-row">
        <div class="fg"><label>الأغنية المفضلة</label><input type="text" id="fSong" value="${esc(user.favorite_song || '')}" placeholder="اختياري"></div>
        <div class="fg"><label>الشهادات</label><input type="text" id="fCert" value="${esc(user.certificates || '')}" placeholder="اختياري"></div>
      </div>
      <button class="btn-save" id="saveBtn" onclick="save()">${SVG.save}${t('save')}</button>
    </div>
    <div class="edit-section" id="privacyTab" style="display:none;">
      <div class="alert alert-err" id="privErr"></div>
      <div class="alert alert-ok" id="privOk"></div>
      <div class="privacy-row">
        <div>
          <div class="privacy-row-title">حساب خاص</div>
          <div class="privacy-row-hint">لو فعّلته، ما يقدر يشوف منشوراتك إلا متابعينك فقط</div>
        </div>
        <label class="switch"><input type="checkbox" id="fPrivate" ${Number(user.is_private)===1?'checked':''} onchange="saveAccountPrivacy()"><span class="slider"></span></label>
      </div>
      <div class="fg" style="margin-top:16px;">
        <label>مين يقدر يراسلني؟</label>
        <select id="fMsgPrivacy" onchange="saveMessagePrivacy()">
          <option value="everyone" ${user.message_privacy==='everyone'?'selected':''}>الجميع</option>
          <option value="followers" ${user.message_privacy==='followers'?'selected':''}>المتابعون فقط</option>
          <option value="none" ${user.message_privacy==='none'?'selected':''}>لا أحد</option>
        </select>
      </div>
      <div class="fg" style="margin-top:20px;">
        <label>الأصدقاء المقربون</label>
        <div class="privacy-row-hint" style="margin-bottom:10px;">قائمة خاصة تقدر تنشر لها منشورات "أصدقاء مقربون فقط"</div>
        <button class="btn-save" style="width:auto;padding:9px 20px;" onclick="openCloseFriendsModal()">إدارة القائمة (${closeFriendsCount})</button>
      </div>
    </div>
    <div class="edit-section" id="pagesTab" style="display:none;">
      <button class="btn-save" style="margin-bottom:16px;" onclick="openCreatePage()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        إنشاء صفحة/قناة جديدة
      </button>
      <div id="myPagesList"><div class="post-empty">جارٍ التحميل...</div></div>
    </div>`;
}

let profilePosts = [];
let closeFriendsCount = 0;

async function loadCloseFriendsCount(){
  try{
    const list = await apiFetch('/api/account/close-friends');
    closeFriendsCount = Array.isArray(list) ? list.length : 0;
    const btn = document.querySelector('#privacyTab .btn-save');
    if(btn) btn.textContent = `إدارة القائمة (${closeFriendsCount})`;
  }catch(e){}
}

async function saveAccountPrivacy(){
  const checked = document.getElementById('fPrivate').checked;
  const d = await apiFetch('/api/account/privacy', 'PUT', { is_private: checked });
  if(d.success){ showToast(checked ? 'صار حسابك خاص' : 'صار حسابك عام'); if(ME) ME.is_private = checked?1:0; }
  else showToast(d.error||'تعذر الحفظ', 'error');
}

async function saveMessagePrivacy(){
  const pref = document.getElementById('fMsgPrivacy').value;
  const d = await apiFetch('/api/account/message-privacy', 'PUT', { pref });
  if(d.success) showToast('تم تحديث إعدادات المراسلة');
  else showToast(d.error||'تعذر الحفظ', 'error');
}

async function openCloseFriendsModal(){
  let modal = document.getElementById('closeFriendsModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'modal-bd';
    modal.id = 'closeFriendsModal';
    modal.innerHTML = `<div class="modal-box">
      <div class="modal-t">الأصدقاء المقربون</div>
      <div class="fg-row" style="margin-bottom:12px;">
        <input type="text" id="cfUsernameInput" class="fg" placeholder="اسم المستخدم" style="flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--input-bg);color:var(--text);">
        <button class="btn-save" style="width:auto;padding:9px 16px;" onclick="addCloseFriendByUsername()">إضافة</button>
      </div>
      <div class="err" id="cfErr" style="display:none;color:var(--danger);font-size:0.8rem;margin-bottom:8px;"></div>
      <div id="closeFriendsList"><div class="post-empty">جارٍ التحميل...</div></div>
      <div class="modal-footer" style="margin-top:16px;display:flex;justify-content:flex-end;">
        <button class="btn-edit" onclick="document.getElementById('closeFriendsModal').classList.remove('show')">إغلاق</button>
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
    if(!list.length){ box.innerHTML = '<div class="post-empty" style="padding:20px;">قائمتك فاضية حالياً</div>'; return; }
    box.innerHTML = list.map(f => `
      <div class="session-row">
        <div class="session-icon">${f.avatar?`<img src="${esc(f.avatar)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`:esc((f.display_name||f.username||'?').charAt(0).toUpperCase())}</div>
        <div class="session-info"><div class="session-name">${esc(f.display_name||f.username)}</div><div class="session-meta">@${esc(f.username)}</div></div>
        <button class="btn-outline-danger" style="padding:6px 12px;font-size:0.76rem;" onclick="removeCloseFriend('${esc(f.username)}')">إزالة</button>
      </div>
    `).join('');
  }catch(e){ box.innerHTML = '<div class="post-empty">تعذر التحميل</div>'; }
}

async function addCloseFriendByUsername(){
  const input = document.getElementById('cfUsernameInput');
  const username = input.value.trim().replace(/^@/, '');
  const errEl = document.getElementById('cfErr');
  errEl.style.display = 'none';
  if(!username) return;
  const d = await apiFetch('/api/account/close-friends/' + encodeURIComponent(username), 'POST');
  if(d.success){ input.value = ''; renderCloseFriendsList(); showToast('تمت الإضافة'); }
  else { errEl.textContent = d.error || 'تعذر الإضافة'; errEl.style.display = 'block'; }
}

async function removeCloseFriend(username){
  const d = await apiFetch('/api/account/close-friends/' + encodeURIComponent(username), 'DELETE');
  if(d.success){ renderCloseFriendsList(); showToast('تمت الإزالة'); }
  else showToast(d.error||'تعذر الإزالة', 'error');
}

function postStatusBadge(p){
  let out = '';
  if (Number(p.pinned) === 1) out += `<span class="post-status-badge st-pinned">${SVG.pin} مثبّت</span>`;
  if (p.privacy === 'draft') out += `<span class="post-status-badge st-draft">مسودة</span>`;
  else if (p.privacy === 'private') out += `<span class="post-status-badge st-private">خاص</span>`;
  else if (p.privacy === 'close_friends') out += `<span class="post-status-badge st-close-friends">أصدقاء مقربون</span>`;
  else if (p.scheduled_at && new Date(p.scheduled_at.replace(' ','T')+'Z').getTime() > Date.now()) out += `<span class="post-status-badge st-scheduled">مجدول</span>`;
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
      <div class="reel-tag">ريلز</div>
    </div>`;
  } else if (p.video) {
    mediaHtml = `<video class="card-video" controls><source src="${esc(p.video)}" type="video/mp4"></video>`;
  } else if (p.image) {
    mediaHtml = `<img class="card-img" src="${esc(p.image)}" loading="lazy" onerror="this.style.display='none'">`;
  }

  const totalReactions = (p.reactions||[]).reduce((s,r)=>s+(r.count||0),0);
  const userR = p.userReaction;
  const activeReact = userR ? REACTIONS.find(r=>r.emoji===userR) : null;
  const reactionHtml = `<div class="react-wrap">
    <button class="react-main-btn ${userR?'reacted':''}" onclick="toggleReactMenu(${p.id})">
      ${activeReact ? activeReact.icon : SVG.like}
      <span>${totalReactions||'تفاعل'}</span>
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
    const cleanContent = linkifyContent(stripEmojis(esc(c.content)));
    const replies = repliesOf(c.id);
    const repliesHtml = replies.length ? `<div class="replies-list">${replies.map(r=>oneCommentHtml(r, postId)).join('')}</div>` : '';
    return `<div class="comment" id="cmt-${c.id}">
      <div class="c-avatar">${ca}</div>
      <div class="c-bubble">
        <div class="c-name">${esc(c.display_name||c.username)}
          ${ME ? `<button class="reply-btn" onclick="toggleReplyInput(${postId},${c.id})">رد</button>` : ''}
          ${canDelC?`<button class="c-del" onclick="delComment(${c.id},${postId})">${SVG.delete}</button>`:''}
        </div>
        <div class="c-text">${cleanContent}</div>
      </div>
    </div>
    <div class="reply-input-row" id="replyRow-${c.id}" style="display:none;">
      <input class="comment-input" type="text" placeholder="رد @${esc(c.username||'')}" id="ri-${c.id}" onkeydown="if(event.key==='Enter')sendComment(${postId},${c.id})">
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');
  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="اكتب تعليقاً..." id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
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
          ${ME ? `<button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSavePost(${p.id})" title="${p.is_saved?'إلغاء الحفظ':'حفظ'}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>` : ''}
          ${canDel ? `<button class="btn-icon pin-btn ${Number(p.pinned)===1?'pinned':''}" onclick="togglePinPost(${p.id})" title="${Number(p.pinned)===1?'إلغاء التثبيت':'تثبيت في الملف الشخصي'}">${SVG.pin}</button>` : ''}
          <button class="btn-icon" onclick="sharePost(${p.id})" title="مشاركة">${SVG.share}</button>
          ${canDel ? `<button class="btn-icon" onclick="delPost(${p.id})" title="حذف">${SVG.delete}</button>` : ''}
        </div>
      </div>
      <div class="pub-date">${fmtDate(p.created_at)}</div>
      <div class="post-text post-html">${linkifyContent(p.content||'')}</div>
      <div class="reactions-row">
        ${reactionHtml}
        <button class="react-btn" onclick="toggleComments(${p.id})" id="cmtToggle-${p.id}">
          ${SVG.comment}<span>${allComments.length} تعليق</span>
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
  if(!confirm('حذف هذا التعليق؟')) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

async function delPost(id){
  if(!confirm('حذف هذا المنشور نهائياً؟')) return;
  const d = await apiFetch('/api/records/'+id, 'DELETE');
  if(d.success){
    profilePosts = profilePosts.filter(p => p.id !== id);
    document.getElementById('post-'+id)?.remove();
  } else {
    showToast(d.error || 'تعذر الحذف', 'error');
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
    btn.title = d.saved ? 'إلغاء الحفظ' : 'حفظ';
  }
  showToast(d.saved ? 'تم حفظ المنشور' : 'تم إلغاء حفظ المنشور');
}

async function togglePinPost(id){
  const d = await apiFetch('/api/records/'+id+'/pin', 'POST');
  if(!d.success){ showToast(d.error||'تعذر التثبيت', 'error'); return; }
  profilePosts.forEach(p => { p.pinned = (p.id === id) ? (d.pinned?1:0) : 0; });
  profilePosts.sort((a,b) => (Number(b.pinned)||0) - (Number(a.pinned)||0));
  const tab = document.getElementById('postsTab');
  if(tab){
    const cta = tab.querySelector('.create-post-cta');
    tab.innerHTML = (cta ? cta.outerHTML : '') + renderPosts(profilePosts);
  }
  showToast(d.pinned ? 'تم تثبيت المنشور في ملفك الشخصي' : 'تم إلغاء التثبيت');
}

// ============================================================
//  إنشاء منشور جديد (الوسائط + التنسيق + الخصوصية + الجدولة)
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
}

function selectPostPrivacy(p){
  selectedPostPrivacy = p;
  document.querySelectorAll('#privacyChoices .privacy-opt').forEach(b=>b.classList.toggle('active', b.dataset.privacy===p));
}

function onPostMedia(e){
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > MAX_FILE_SIZE) { showToast('حجم الملف كبير جداً', 'error'); e.target.value=''; return; }
  const isImage = f.type === 'image/jpeg' || f.type === 'image/jpg';
  const isVideo = f.type.startsWith('video/') && (f.type === 'video/mp4' || f.type === 'video/webm');
  if (!isImage && !isVideo) { showToast('نوع الملف غير مدعوم', 'error'); e.target.value=''; return; }
  postMediaType = isImage ? 'image' : 'video';
  postMediaFileObj = isVideo ? f : null;
  postVideoMeta = { width:0, height:0, isReel:false };
  const reader = new FileReader();
  reader.onload = async ev => {
    postMediaBase64 = ev.target.result;
    const preview = document.getElementById('postMediaPreview');
    if (isImage) {
      preview.innerHTML = `<img src="${postMediaBase64}" alt="معاينة الصورة">`;
    } else {
      postVideoMeta = await readVideoDimensions(f);
      const reelTag = postVideoMeta.isReel ? `<div class="reel-detect-badge">${SVG.reel} <span>سيُنشر كريلز</span></div>` : '';
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
  if((!content || content==='<br>') && !postMediaBase64){ errEl.textContent='المحتوى أو الملف مطلوب'; errEl.style.display='block'; return; }
  const btn=document.getElementById('postBtn'); btn.disabled=true;
  const scheduleVal = document.getElementById('postScheduleInput')?.value || '';
  try {
    let imageUrl='', videoUrl='';
    if(postMediaType === 'image' && postMediaBase64){
      const up = await apiFetch('/api/upload', 'POST', { image: postMediaBase64 });
      if (up.url) { imageUrl = up.url; }
      else {
        errEl.textContent = up.error || 'فشل رفع الملف'; errEl.style.display='block';
        btn.disabled=false; return;
      }
    } else if (postMediaType === 'video' && postMediaFileObj) {
      try {
        const sig = await apiFetch('/api/upload/video/signature', 'POST', {});
        if (!sig.signature) throw new Error(sig.error || 'تعذر تجهيز رفع الفيديو');
        const fd = new FormData();
        fd.append('file', postMediaFileObj);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', sig.timestamp);
        fd.append('folder', sig.folder);
        fd.append('signature', sig.signature);
        const vRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`, { method:'POST', body:fd });
        const vData = await vRes.json();
        if (!vRes.ok || !vData.secure_url) throw new Error(vData.error?.message || 'فشل رفع الفيديو');
        videoUrl = vData.secure_url;
      } catch (upErr) {
        errEl.textContent = upErr.message || 'فشل رفع الفيديو'; errEl.style.display='block';
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
      showToast('تم نشر المنشور بنجاح');
      await loadMyProfile();
    } else { errEl.textContent=d.error||'فشل النشر'; errEl.style.display='block'; }
  } catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.style.display='block'; }
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
//  الصفحات/القنوات التابعة للحساب
// ============================================================
async function loadMyPages(){
  const list = document.getElementById('myPagesList');
  try {
    const pages = await apiFetch('/api/pages/mine');
    if (!Array.isArray(pages) || !pages.length) {
      list.innerHTML = `<div class="post-empty">لا تملك أي صفحة بعد</div>`;
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
  } catch(e) { list.innerHTML = `<div class="post-empty">تعذر تحميل الصفحات</div>`; }
}

function openCreatePage(){
  const name = prompt('اسم الصفحة أو القناة:');
  if (!name || !name.trim()) return;
  const handle = prompt('معرّف الصفحة (بالإنجليزية بدون مسافات، مثال: my_channel):', name.trim().toLowerCase().replace(/\s+/g,'_'));
  if (!handle || !handle.trim()) return;
  createPage(name.trim(), handle.trim());
}

async function createPage(name, username){
  try {
    const d = await apiFetch('/api/pages', 'POST', { name, username });
    if (d.success) { showToast('تم إنشاء الصفحة'); loadMyPages(); }
    else showToast(d.error || 'فشل الإنشاء', 'error');
  } catch(e) { showToast('تعذر الاتصال', 'error'); }
}

function sharePost(id) {
  const url = window.location.origin + '/post?id=' + id;
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast(t('linkCopied')));
  else prompt('الرابط:', url);
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
      // تحديث الزر والمظهر
      btnEl.classList.toggle('following', result.following);
      const span = btnEl.querySelector('span');
      if (span) span.textContent = result.following ? t('unfollow') : t('follow');
      // تحديث الأيقونة باستبدال العنصر بالكامل
      const icon = btnEl.querySelector('svg');
      if (icon) {
        const newIcon = document.createElement('span');
        newIcon.innerHTML = result.following ? SVG.check : SVG.follow;
        icon.parentNode.replaceChild(newIcon.firstChild, icon);
      }
      // تحديث الحالة المخزنة
      currentFollowStatus.following = result.following;
      // تحديث الإحصائيات من الخادم
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
}

/* ================= shiziai.html ================= */
if (document.body.classList.contains('page-shiziai')) {
const LANG = {
  ar: {
    back:'Hostaka', status:'متصلة الآن', placeholder:'اكتب رسالتك...', remainingLabel:'متصلة الآن · باقي {n} رسالة اليوم',
    welcomeTitle:'أهلاً، أنا شيزي', welcomeText:'مساعدتك الذكية في منصة Hostaka. اسأليني أي شيء وبقدر أساعدك فيه!',
    s1:'ما هي منصة Hostaka؟', s2:'اقترح علي فكرة منشور', s3:'ساعدني في كتابة وصف بروفايل', s4:'أخبرني نكتة لطيفة',
    loginRequired:'يجب تسجيل الدخول', loginText:'سجّلي الدخول لبدء الدردشة مع شيزي', home:'الرئيسية',
    clearedMsg:'بدأنا محادثة جديدة', errorMsg:'حدث خطأ، حاولي مرة أخرى', notConfigured:'لم يتم إعداد Shizi AI بعد'
  },
  en: {
    back:'Hostaka', status:'Online now', placeholder:'Type a message to Shizi...', remainingLabel:'Online now · {n} messages left today',
    welcomeTitle:"Hi, I'm Shizi", welcomeText:'Your smart assistant on Hostaka. Ask me anything!',
    s1:'What is Hostaka?', s2:'Suggest a post idea', s3:'Help me write a bio', s4:'Tell me a fun fact',
    loginRequired:'Login required', loginText:'Please login to chat with Shizi', home:'Home',
    clearedMsg:'Started a new chat', errorMsg:'Something went wrong, try again', notConfigured:'Shizi AI is not configured yet'
  },
  fr: {
    back:'Hostaka', status:'En ligne', placeholder:'Écrivez à Shizi...', remainingLabel:'En ligne · {n} messages restants aujourd\'hui',
    welcomeTitle:'Salut, je suis Shizi', welcomeText:'Votre assistante intelligente sur Hostaka. Demandez-moi tout !',
    s1:"Qu'est-ce que Hostaka ?", s2:'Suggère une idée de post', s3:'Aide-moi à écrire ma bio', s4:'Raconte-moi une anecdote',
    loginRequired:'Connexion requise', loginText:'Connectez-vous pour discuter avec Shizi', home:'Accueil',
    clearedMsg:'Nouvelle discussion', errorMsg:'Une erreur est survenue', notConfigured:"Shizi AI n'est pas encore configurée"
  },
  ru: {
    back:'Hostaka', status:'В сети', placeholder:'Напишите Shizi...', remainingLabel:'В сети · осталось {n} сообщений сегодня',
    welcomeTitle:'Привет, я Shizi', welcomeText:'Ваш умный помощник на Hostaka. Спросите меня о чём угодно!',
    s1:'Что такое Hostaka?', s2:'Предложи идею для поста', s3:'Помоги написать био', s4:'Расскажи интересный факт',
    loginRequired:'Требуется вход', loginText:'Войдите, чтобы общаться с Shizi', home:'Главная',
    clearedMsg:'Новый чат', errorMsg:'Произошла ошибка', notConfigured:'Shizi AI ещё не настроена'
  },
  zh: {
    back:'Hostaka', status:'在线', placeholder:'给 Shizi 发消息...', remainingLabel:'在线 · 今日剩余 {n} 条消息',
    welcomeTitle:'嗨，我是 Shizi', welcomeText:'Hostaka 平台的智能助手。问我任何问题！',
    s1:'Hostaka 是什么？', s2:'给我一个发帖灵感', s3:'帮我写个人简介', s4:'讲个有趣的事实',
    loginRequired:'需要登录', loginText:'请登录以与 Shizi 聊天', home:'首页',
    clearedMsg:'开始新对话', errorMsg:'出错了，请重试', notConfigured:'Shizi AI 尚未配置'
  },
  ja: {
    back:'Hostaka', status:'オンライン', placeholder:'Shiziにメッセージを送る...', remainingLabel:'オンライン · 本日の残り {n} 件',
    welcomeTitle:'こんにちは、Shiziです', welcomeText:'Hostakaのスマートアシスタントです。何でも聞いてください！',
    s1:'Hostakaとは？', s2:'投稿アイデアを提案して', s3:'プロフィール文を手伝って', s4:'面白い豆知識を教えて',
    loginRequired:'ログインが必要です', loginText:'Shiziとチャットするにはログインしてください', home:'ホーム',
    clearedMsg:'新しいチャットを開始しました', errorMsg:'エラーが発生しました', notConfigured:'Shizi AIはまだ設定されていません'
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
function onWallpaperFile(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  if(file.size > 8*1024*1024){ alert('الصورة كبيرة جدًا، الرجاء اختيار صورة أصغر من 8MB'); return; }
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
    messages.pop(); // نتراجع عن الرسالة المضافة محلياً لأنها لم تُحفظ فعلياً
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
}

/* ================= short.html ================= */
if (document.body.classList.contains('page-short')) {
const TOKEN = localStorage.getItem('hostaka_token') || '';
let ME = null;
try { const stored = localStorage.getItem('hostaka_user'); if (stored) ME = JSON.parse(stored); } catch(e) {}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function apiFetch(url, method='GET', body=null){
  const opts = { method, headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  return r.json();
}

const HEART_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const HEART_FILLED = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const COMMENT_ICON = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const SHARE_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
const BOOKMARK_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const BOOKMARK_FILLED = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const MUTE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const UNMUTE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

let reels = [];
let reelsOrder = [];
let reelsVisibleCount = 10;
const REELS_PAGE_SIZE = 10;
let soundOn = false;
let activeCommentReelId = null;

// نفس منطق الترجيح 60% لصالح المتابَعين المستخدم في الصفحة الرئيسية
function weightedRandomSortReels(list) {
  const followed = [], others = [];
  list.forEach(p => (p.is_followed_author ? followed : others).push(p));
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

function reactCount(reel){ return (reel.reactions||[]).reduce((s,r)=>s+(r.count||0),0); }

function reelSlideHtml(r){
  const name = r.publisher_name || r.publisher || '?';
  const avatarHtml = r.user_avatar ? `<img src="${esc(r.user_avatar)}" alt="">` : esc(name.charAt(0).toUpperCase());
  const liked = r.userReaction === 'like';
  return `
  <div class="reel-slide" id="reel-${r.id}" data-id="${r.id}">
    <video src="${esc(r.video)}" loop playsinline muted preload="metadata"></video>
    <div class="reel-tap-layer" onclick="onSlideTap(${r.id})"></div>
    <div class="reel-mute-hint" id="muteHint-${r.id}"></div>
    <div class="reel-gradient-bottom"></div>
    <div class="reel-info">
      <div class="reel-pub">
        <div class="reel-avatar">${avatarHtml}</div>
        <div class="reel-pub-name">${esc(r.publisher_name || r.publisher || '')}</div>
      </div>
      ${r.content ? `<div class="reel-caption">${esc(stripHtml(r.content))}</div>` : ''}
    </div>
    <div class="reel-actions">
      <button class="reel-act-btn ${liked?'liked':''}" id="likeBtn-${r.id}" onclick="toggleReelLike(${r.id})">
        <div class="reel-act-circle">${liked?HEART_FILLED:HEART_ICON}</div>
        <span class="reel-act-count" id="likeCount-${r.id}">${reactCount(r)||''}</span>
      </button>
      <button class="reel-act-btn" onclick="openComments(${r.id})">
        <div class="reel-act-circle">${COMMENT_ICON}</div>
        <span class="reel-act-count" id="cmtCount-${r.id}">${(r.comments||[]).length||''}</span>
      </button>
      <button class="reel-act-btn" onclick="shareReel(${r.id})">
        <div class="reel-act-circle">${SHARE_ICON}</div>
      </button>
      <button class="reel-act-btn save-btn ${r.is_saved?'saved':''}" id="saveBtn-${r.id}" onclick="toggleSaveReel(${r.id})">
        <div class="reel-act-circle">${r.is_saved?BOOKMARK_FILLED:BOOKMARK_ICON}</div>
      </button>
    </div>
  </div>`;
}

function stripHtml(html){
  const d = document.createElement('div'); d.innerHTML = html;
  return (d.textContent || d.innerText || '').trim();
}

async function loadReels(){
  try {
    reels = await apiFetch('/api/reels');
    if (!Array.isArray(reels)) reels = [];
  } catch(e) { reels = []; }
  reelsOrder = weightedRandomSortReels(reels);
  reelsVisibleCount = REELS_PAGE_SIZE;
  document.getElementById('loader').style.display = 'none';
  renderReelsFeed();

  const wantedId = new URLSearchParams(location.search).get('id');
  if (wantedId) {
    const el = document.getElementById('reel-' + wantedId);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior:'instant', block:'start' }));
  }
}

function renderReelsFeed(){
  const feed = document.getElementById('reelsFeed');
  if (!reelsOrder.length) {
    feed.innerHTML = `<div class="empty-state">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2.5"/><polygon points="10.5 9.5 15 12 10.5 14.5"/></svg>
      <div>لا توجد فيديوهات ريلز بعد</div>
    </div>`;
    return;
  }
  const visible = reelsOrder.slice(0, reelsVisibleCount);
  let html = visible.map(reelSlideHtml).join('');
  if (reelsOrder.length > visible.length) {
    html += `<div class="reel-slide reel-load-more-slide">
      <button class="load-more-btn" onclick="loadMoreReels()">المزيد من الريلز</button>
    </div>`;
  }
  feed.innerHTML = html;
  setupObserver();
}

function loadMoreReels(){
  reelsVisibleCount += REELS_PAGE_SIZE;
  renderReelsFeed();
}

let observer = null;
function setupObserver(){
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        video.muted = !soundOn;
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.6, 1] });
  document.querySelectorAll('.reel-slide').forEach(s => observer.observe(s));
}

function onSlideTap(id){
  soundOn = !soundOn;
  document.querySelectorAll('.reel-slide video').forEach(v => v.muted = !soundOn);
  const hint = document.getElementById('muteHint-' + id);
  if (hint) {
    hint.innerHTML = soundOn ? UNMUTE_ICON : MUTE_ICON;
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 600);
  }
}

function goLogin(){ location.href = '/login'; }

async function toggleReelLike(id){
  if (!ME) { goLogin(); return; }
  const d = await apiFetch('/api/records/' + id + '/react', 'POST', { emoji: 'like' });
  if (!d.success) return;
  const reel = reels.find(r => r.id === id);
  if (!reel) return;
  reel.reactions = d.reactions; reel.userReaction = d.userReaction;
  const liked = reel.userReaction === 'like';
  const btn = document.getElementById('likeBtn-' + id);
  btn.classList.toggle('liked', liked);
  btn.querySelector('.reel-act-circle').innerHTML = liked ? HEART_FILLED : HEART_ICON;
  document.getElementById('likeCount-' + id).textContent = reactCount(reel) || '';
}

function openComments(id){
  if (!ME) { goLogin(); return; }
  activeCommentReelId = id;
  document.getElementById('commentsSheetBd').classList.add('show');
  renderComments();
}
function closeComments(){
  document.getElementById('commentsSheetBd').classList.remove('show');
  activeCommentReelId = null;
}

let replyingToCommentId = null;

async function renderComments(){
  const list = document.getElementById('commentsList');
  list.innerHTML = '<div class="comment-empty">جارٍ التحميل...</div>';
  const comments = await apiFetch('/api/records/' + activeCommentReelId + '/comments');
  const reel = reels.find(r => r.id === activeCommentReelId);
  if (reel) { reel.comments = comments; const cEl = document.getElementById('cmtCount-' + activeCommentReelId); if (cEl) cEl.textContent = comments.length || ''; }
  document.getElementById('commentsCount').textContent = comments.length ? (comments.length + ' تعليق') : 'التعليقات';
  if (!comments.length) { list.innerHTML = '<div class="comment-empty">لا توجد تعليقات بعد، كن أول من يعلّق</div>'; return; }
  const top = comments.filter(c => !c.parent_id);
  const repliesOf = (cid) => comments.filter(c => Number(c.parent_id) === Number(cid));
  function row(c){
    const replies = repliesOf(c.id);
    return `<div class="comment-row">
      <div class="comment-avatar">${c.avatar ? `<img src="${esc(c.avatar)}" alt="">` : esc((c.display_name||c.username||'?').charAt(0).toUpperCase())}</div>
      <div style="flex:1;">
        <div class="comment-name">${esc(c.display_name || c.username)}
          ${ME ? `<button class="reply-btn" onclick="startReplyTo(${c.id}, '${esc(c.username||'')}')">رد</button>` : ''}
        </div>
        <div class="comment-text">${esc(c.content)}</div>
        ${replies.length ? `<div class="replies-list">${replies.map(row).join('')}</div>` : ''}
      </div>
    </div>`;
  }
  list.innerHTML = top.map(row).join('');
}

function startReplyTo(commentId, username){
  replyingToCommentId = commentId;
  const input = document.getElementById('commentInput');
  input.value = '';
  input.placeholder = 'الرد على @' + username;
  input.focus();
}

async function sendReelComment(){
  if (!ME) { goLogin(); return; }
  const input = document.getElementById('commentInput');
  const content = input.value.trim();
  if (!content || !activeCommentReelId) return;
  input.value = '';
  input.placeholder = 'أضف تعليقاً...';
  const parentId = replyingToCommentId;
  replyingToCommentId = null;
  const d = await apiFetch('/api/records/' + activeCommentReelId + '/comments', 'POST', { content, parent_id: parentId||null });
  if (d.success) renderComments();
}

function shareReel(id){
  const url = location.origin + '/short?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(() => showShareToast()).catch(() => showShareToast());
}
function showShareToast(){
  let el = document.createElement('div');
  el.textContent = 'تم نسخ رابط الريلز';
  el.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.95);color:#000;padding:10px 20px;border-radius:24px;font-size:0.85rem;font-weight:700;z-index:200;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

async function toggleSaveReel(id){
  if(!TOKEN){ goLogin(); return; }
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const reel = reels.find(r=>r.id===id);
  if(reel) reel.is_saved = d.saved;
  const btn = document.getElementById('saveBtn-'+id);
  if(btn){
    btn.classList.toggle('saved', d.saved);
    btn.querySelector('.reel-act-circle').innerHTML = d.saved ? BOOKMARK_FILLED : BOOKMARK_ICON;
  }
}

loadReels();

/* expose top-level functions for inline onclick handlers */
try { window.esc = esc; } catch(e) {}
try { window.apiFetch = apiFetch; } catch(e) {}
try { window.reactCount = reactCount; } catch(e) {}
try { window.reelSlideHtml = reelSlideHtml; } catch(e) {}
try { window.stripHtml = stripHtml; } catch(e) {}
try { window.loadReels = loadReels; } catch(e) {}
try { window.renderReelsFeed = renderReelsFeed; } catch(e) {}
try { window.loadMoreReels = loadMoreReels; } catch(e) {}
try { window.setupObserver = setupObserver; } catch(e) {}
try { window.onSlideTap = onSlideTap; } catch(e) {}
try { window.goLogin = goLogin; } catch(e) {}
try { window.toggleReelLike = toggleReelLike; } catch(e) {}
try { window.openComments = openComments; } catch(e) {}
try { window.closeComments = closeComments; } catch(e) {}
try { window.renderComments = renderComments; } catch(e) {}
try { window.startReplyTo = startReplyTo; } catch(e) {}
try { window.sendReelComment = sendReelComment; } catch(e) {}
try { window.shareReel = shareReel; } catch(e) {}
try { window.toggleSaveReel = toggleSaveReel; } catch(e) {}
try { window.showShareToast = showShareToast; } catch(e) {}
}

/* ================= support.html ================= */
if (document.body.classList.contains('page-support')) {
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
    alert('تم تعليق حسابك من قبل الإدارة' + (data.reason?':\n'+data.reason:''));
    window.location = '/';
  }
  return data;
}

const TYPE_LABELS = {
  general: 'استفسار / شكوى عامة',
  bug: 'مشكلة تقنية',
  abuse: 'إساءة استخدام',
  account: 'مشكلة في الحساب',
  suggestion: 'اقتراح'
};
const STATUS_LABELS = { pending:'قيد المراجعة', resolved:'تم الحل', dismissed:'مرفوض' };

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
    <label class="f-label">نوع الطلب</label>
    <select class="f-input" id="spType">
      ${Object.entries(TYPE_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
    </select>
    <label class="f-label">الموضوع</label>
    <input class="f-input" type="text" id="spSubject" placeholder="عنوان مختصر لطلبك" maxlength="120">
    <label class="f-label">التفاصيل *</label>
    <textarea class="f-input" id="spReason" placeholder="اشرح مشكلتك أو استفسارك بالتفصيل..."></textarea>
    <button class="btn-submit" id="spBtn" onclick="submitTicket()">إرسال الطلب</button>
  </div>`;
}

async function submitTicket(){
  const type = document.getElementById('spType').value;
  const subject = document.getElementById('spSubject').value.trim();
  const reason = document.getElementById('spReason').value.trim();
  if(!reason){ showToast('الرجاء كتابة التفاصيل', 'error'); return; }
  const btn = document.getElementById('spBtn');
  btn.disabled = true; btn.textContent = 'جارٍ الإرسال...';
  try{
    const d = await apiFetch('/api/reports', 'POST', { type, subject, reason });
    if(d.success){
      showToast('تم إرسال طلبك، سنقوم بالرد قريباً');
      document.getElementById('spSubject').value = '';
      document.getElementById('spReason').value = '';
      switchTab('mine');
    } else {
      showToast(d.error || 'فشل الإرسال', 'error');
    }
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
  btn.disabled = false; btn.textContent = 'إرسال الطلب';
}

function ticketCard(r){
  const statusCls = r.status==='resolved' ? 'st-resolved' : (r.status==='dismissed' ? 'st-dismissed' : 'st-pending');
  return `<div class="ticket">
    <div class="ticket-top">
      <span class="ticket-type">${esc(TYPE_LABELS[r.type] || r.type)}</span>
      <span class="ticket-status ${statusCls}">${esc(STATUS_LABELS[r.status] || r.status)}</span>
    </div>
    ${r.subject ? `<div class="ticket-subject">${esc(r.subject)}</div>` : ''}
    <div class="ticket-reason">${esc(r.reason)}</div>
    ${r.admin_reply ? `<div class="ticket-reply"><b>رد الإدارة</b>${esc(r.admin_reply)}</div>` : ''}
    <div class="ticket-date">${fmtDate(r.created_at)}</div>
  </div>`;
}

async function loadMine(){
  const wrap = document.getElementById('tabContent');
  wrap.innerHTML = '<div class="empty-state">جارٍ التحميل...</div>';
  try{
    const data = await apiFetch('/api/reports/mine');
    const list = Array.isArray(data) ? data : [];
    if(!list.length){
      wrap.innerHTML = '<div class="empty-state">لا توجد طلبات سابقة</div>';
      return;
    }
    wrap.innerHTML = list.map(ticketCard).join('');
  }catch(e){
    wrap.innerHTML = '<div class="empty-state">تعذر تحميل الطلبات</div>';
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
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">الدعم متاح للأعضاء المسجلين فقط</div>
        <div style="color:var(--muted);font-size:0.85rem;">سجّل الدخول لإرسال شكوى أو بلاغ ومتابعة ردود الإدارة</div>
        <a href="/">تسجيل الدخول</a>
      </div>`;
    return;
  }
  try{
    ME = await apiFetch('/api/me');
    if(!ME || ME.error){ throw new Error('unauth'); }
  }catch(e){
    document.getElementById('wrap').innerHTML = `<div class="login-gate"><div style="font-weight:800;">تعذر التحقق من الحساب</div><a href="/">العودة للرئيسية</a></div>`;
    return;
  }
  document.getElementById('wrap').innerHTML = `
    <div class="page-title">مركز الدعم</div>
    <div class="page-sub">أرسل شكوى، بلاغاً، أو استفساراً وسيتم الرد عليك من قبل فريق الإدارة</div>
    <div class="tabs">
      <button class="tab-btn active" data-tab="new" onclick="switchTab('new')">طلب جديد</button>
      <button class="tab-btn" data-tab="mine" onclick="switchTab('mine')">طلباتي</button>
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
}

// ============================================================
//  صفحة إدارة الحساب — /manager
// ============================================================
if (document.body.classList.contains('page-manager')) {

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
    alert('تم تعليق حسابك من قبل الإدارة' + (data.reason?':\n'+data.reason:''));
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
  return d.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
}

function initials(name){
  const s = String(name||'').trim();
  return s ? s[0].toUpperCase() : 'H';
}

const OTP_LABELS = {
  username: { title:'تأكيد تغيير اسم المستخدم', desc:(email)=>`أرسلنا كود تأكيد إلى بريدك الحالي (${esc(email)}). أدخله لإتمام تغيير اسم المستخدم.` },
  email:    { title:'تأكيد البريد الإلكتروني الجديد', desc:(email)=>`أرسلنا كود تأكيد إلى بريدك الجديد (${esc(email)}) للتحقق من ملكيته.` },
  password: { title:'تأكيد تغيير كلمة المرور', desc:(email)=>`أرسلنا كود تأكيد إلى بريدك (${esc(email)}) لإتمام تغيير كلمة المرور.` },
  delete:   { title:'تأكيد حذف الحساب', desc:(email)=>`أرسلنا كود تأكيد إلى بريدك (${esc(email)}). إدخاله سيحذف حسابك نهائياً ولا يمكن التراجع عن ذلك.` },
};

function openOtpModal(purpose, maskedEmail){
  otpState.purpose = purpose;
  const label = OTP_LABELS[purpose];
  document.getElementById('otpTitle').textContent = label.title;
  document.getElementById('otpDesc').textContent = label.desc(maskedEmail||'');
  document.getElementById('otpErr').classList.remove('show');
  document.getElementById('otpCode').value = '';
  document.getElementById('otpConfirmBtn').textContent = purpose === 'delete' ? 'تأكيد الحذف' : 'تأكيد';
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
      cd.textContent = `يمكنك إعادة الإرسال خلال ${secs} ثانية`;
    }
  }, 1000);
}

async function resendOtp(){
  if(!otpState.purpose) return;
  try{
    const d = await apiFetch('/api/account/change/resend', 'POST', { purpose: otpState.purpose });
    if(d.success){ showToast('تم إرسال كود جديد'); startOtpCooldown(); }
    else { const e = document.getElementById('otpErr'); e.textContent = d.error||'تعذر إعادة الإرسال'; e.classList.add('show'); }
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
}

async function confirmOtp(){
  const purpose = otpState.purpose;
  if(!purpose) return;
  const code = document.getElementById('otpCode').value.trim();
  const errEl = document.getElementById('otpErr');
  errEl.classList.remove('show');
  if(!/^\d{6}$/.test(code)){ errEl.textContent='أدخل كود التأكيد المكوّن من 6 أرقام'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('otpConfirmBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/verify', 'POST', { purpose, code });
    if(d.success){
      if(purpose === 'delete'){
        localStorage.removeItem('hostaka_token');
        localStorage.removeItem('hostaka_user');
        localStorage.removeItem('hostaka_role');
        showToast('تم حذف حسابك نهائياً');
        closeOtpModal();
        setTimeout(()=>{ window.location = '/'; }, 1200);
        return;
      }
      if(d.token) localStorage.setItem('hostaka_token', d.token);
      const u = { username:d.username, role:d.role, avatar:d.avatar||'' };
      localStorage.setItem('hostaka_user', JSON.stringify(u));
      showToast('تم تنفيذ التعديل بنجاح');
      closeOtpModal();
      await loadMe();
    } else {
      errEl.textContent = d.error || 'كود غير صحيح';
      errEl.classList.add('show');
    }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- تغيير اسم المستخدم -----
async function requestUsernameChange(){
  const val = document.getElementById('newUsernameInput').value.trim();
  const errEl = document.getElementById('usernameErr');
  errEl.classList.remove('show');
  if(!val){ errEl.textContent='أدخل اسم المستخدم الجديد'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('usernameBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'username', newUsername: val });
    if(d.success){ showToast(d.message||'تم إرسال كود التأكيد'); openOtpModal('username', d.maskedEmail); }
    else { errEl.textContent = d.error||'تعذر تنفيذ الطلب'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- تغيير البريد الإلكتروني -----
async function requestEmailChange(){
  const val = document.getElementById('newEmailInput').value.trim();
  const errEl = document.getElementById('emailErr');
  errEl.classList.remove('show');
  if(!val){ errEl.textContent='أدخل البريد الإلكتروني الجديد'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('emailBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'email', newEmail: val });
    if(d.success){ showToast(d.message||'تم إرسال كود التأكيد'); openOtpModal('email', d.maskedEmail); }
    else { errEl.textContent = d.error||'تعذر تنفيذ الطلب'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- تغيير كلمة المرور -----
async function requestPasswordChange(){
  const cur = document.getElementById('curPasswordInput').value;
  const nw = document.getElementById('newPasswordInput').value;
  const cf = document.getElementById('confirmPasswordInput').value;
  const errEl = document.getElementById('passwordErr');
  errEl.classList.remove('show');
  if(!cur || !nw || !cf){ errEl.textContent='جميع الحقول مطلوبة'; errEl.classList.add('show'); return; }
  if(nw.length < 6){ errEl.textContent='كلمة المرور الجديدة 6 أحرف على الأقل'; errEl.classList.add('show'); return; }
  if(nw !== cf){ errEl.textContent='كلمة المرور الجديدة وتأكيدها غير متطابقين'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('passwordBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'password', currentPassword: cur, newPassword: nw });
    if(d.success){
      showToast(d.message||'تم إرسال كود التأكيد');
      document.getElementById('curPasswordInput').value = '';
      document.getElementById('newPasswordInput').value = '';
      document.getElementById('confirmPasswordInput').value = '';
      openOtpModal('password', d.maskedEmail);
    } else { errEl.textContent = d.error||'تعذر تنفيذ الطلب'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- تاريخ الميلاد -----
async function saveBirthdate(){
  const val = document.getElementById('birthdateInput').value;
  const btn = document.getElementById('birthdateBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/birthdate', 'PUT', { birth_date: val });
    if(d.success){ showToast('تم حفظ تاريخ الميلاد'); ME.birth_date = val; }
    else { showToast(d.error||'تعذر الحفظ', 'error'); }
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
  btn.disabled = false;
}

// ----- طلب التوثيق -----
async function requestVerifyBadge(){
  try{
    const d = await apiFetch('/api/verify/request', 'POST');
    if(d.success){ showToast('تم إرسال طلب التوثيق، سيتم مراجعته من الإدارة'); await refreshVerifyStatus(); render(); }
    else { showToast(d.error||'تعذر إرسال الطلب', 'error'); }
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
}
async function refreshVerifyStatus(){
  try{ VERIFY_STATUS = await apiFetch('/api/verify/status'); }catch(e){ VERIFY_STATUS = null; }
}

// ----- الأجهزة وجلسات الدخول -----
const DEVICE_ICONS = {
  'جوال': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
  'تابلت': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
  'حاسوب': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
};

async function loadSessions(){
  const box = document.getElementById('sessionsList');
  if(!box) return;
  try{
    const sessions = await apiFetch('/api/account/sessions');
    if(!Array.isArray(sessions) || !sessions.length){ box.innerHTML = '<div class="section-hint">لا توجد جلسات نشطة</div>'; return; }
    box.innerHTML = sessions.map(s => `
      <div class="session-row">
        <div class="session-icon">${DEVICE_ICONS[s.device] || DEVICE_ICONS['حاسوب']}</div>
        <div class="session-info">
          <div class="session-name">${esc(s.browser)} · ${esc(s.os)} ${s.is_current ? '<span class="status-pill st-verified" style="margin-inline-start:6px;">هذا الجهاز</span>' : ''}</div>
          <div class="session-meta">${esc(s.ip || 'IP غير معروف')} · ${esc(s.last_active_text)}</div>
        </div>
        ${!s.is_current ? `<button class="btn-outline-danger" style="padding:6px 12px;font-size:0.76rem;" onclick="revokeSession(${s.id})">إنهاء</button>` : ''}
      </div>
    `).join('');
  }catch(e){ box.innerHTML = '<div class="section-hint">تعذر تحميل الجلسات</div>'; }
}

async function revokeSession(id){
  if(!confirm('إنهاء هذه الجلسة؟ سيتم تسجيل الخروج منها فوراً.')) return;
  const d = await apiFetch('/api/account/sessions/'+id+'/revoke', 'POST');
  if(d.success){ showToast('تم إنهاء الجلسة'); loadSessions(); }
  else showToast(d.error||'تعذر إنهاء الجلسة', 'error');
}

async function revokeAllSessions(){
  if(!confirm('تسجيل الخروج من كل الأجهزة الأخرى؟ ستبقى فقط هذه الجلسة الحالية مفعّلة.')) return;
  const d = await apiFetch('/api/account/sessions/revoke-all', 'POST');
  if(d.success){ showToast('تم تسجيل الخروج من كل الأجهزة الأخرى'); loadSessions(); }
  else showToast(d.error||'تعذر تنفيذ الطلب', 'error');
}

// ----- تنبيهات الأمان -----
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
    if(!Array.isArray(events) || !events.length){ box.innerHTML = '<div class="section-hint">لا توجد أحداث أمنية مسجّلة بعد</div>'; return; }
    box.innerHTML = events.map(ev => `
      <div class="session-row">
        <div class="session-icon">${SECURITY_ICONS[ev.icon] || SECURITY_ICONS.bell}</div>
        <div class="session-info">
          <div class="session-name">${esc(ev.title)}</div>
          <div class="session-meta">${esc(ev.description||'')} · ${esc(ev.time_text)}</div>
        </div>
      </div>
    `).join('');
  }catch(e){ box.innerHTML = '<div class="section-hint">تعذر تحميل السجل</div>'; }
}

// ----- النسخ الاحتياطي وGoogle Drive -----
async function downloadBackup(e){
  e.preventDefault();
  try{
    const r = await fetch('/api/account/backup', { headers:{ 'Authorization':'Bearer '+getToken() } });
    if(!r.ok){ showToast('تعذر إنشاء النسخة الاحتياطية', 'error'); return false; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hostaka-backup.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast('جارٍ تنزيل نسخة بياناتك');
  }catch(err){ showToast('تعذر الاتصال بالخادم', 'error'); }
  return false;
}

async function checkDriveConfigured(){
  const btn = document.getElementById('driveBackupBtn');
  if(!btn) return;
  try{
    const d = await apiFetch('/api/account/backup/drive/status');
    if(!d.configured){ btn.disabled = true; btn.title = 'هذه الميزة غير مفعّلة على الخادم حالياً'; }
  }catch(e){}
}

async function connectGoogleDrive(){
  try{
    const d = await apiFetch('/api/account/backup/drive/connect');
    if(d.url) window.location.href = d.url;
    else showToast(d.error||'ميزة Google Drive غير مفعّلة حالياً', 'error');
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
}

// ----- المصادقة الثنائية (2FA) -----
let tfaSetupInFlight = false;
async function start2FASetup(){
  if(tfaSetupInFlight) return; // يمنع الضغط المتكرر السريع من إنشاء أكثر من سر بنفس الوقت (كان يسبب عدم تطابق الكود مع QR المعروض)
  tfaSetupInFlight = true;
  const triggerBtns = document.querySelectorAll('[onclick="start2FASetup()"]');
  triggerBtns.forEach(b => b.disabled = true);
  try{
    const d = await apiFetch('/api/account/2fa/setup', 'POST');
    if(!d.success){ showToast(d.error||'تعذر بدء الإعداد', 'error'); return; }
    document.getElementById('tfaErr').classList.remove('show');
    document.getElementById('tfaQrImg').src = d.qrCode;
    document.getElementById('tfaSecretText').textContent = d.secret;
    document.getElementById('tfaEnableCode').value = '';
    document.getElementById('tfaStepQr').style.display = 'block';
    document.getElementById('tfaStepBackup').style.display = 'none';
    document.getElementById('tfaStepTitle').textContent = 'تفعيل المصادقة الثنائية';
    openModal('tfaSetupModal');
  }catch(e){ showToast('تعذر الاتصال بالخادم', 'error'); }
  finally{
    tfaSetupInFlight = false;
    triggerBtns.forEach(b => b.disabled = false);
  }
}

async function confirm2FAEnable(){
  const code = document.getElementById('tfaEnableCode').value.trim();
  const errEl = document.getElementById('tfaErr');
  errEl.classList.remove('show');
  if(!/^\d{6}$/.test(code)){ errEl.textContent='أدخل كود التطبيق المكوّن من 6 أرقام'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('tfaEnableBtn'); btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/2fa/enable', 'POST', { code });
    if(d.success){
      ME.totp_enabled = true;
      document.getElementById('tfaStepTitle').textContent = 'احفظ أكواد الاسترجاع';
      document.getElementById('tfaStepQr').style.display = 'none';
      document.getElementById('tfaBackupCodesList').innerHTML = d.backupCodes.map(c=>`<div>${esc(c)}</div>`).join('');
      document.getElementById('tfaStepBackup').style.display = 'block';
    } else { errEl.textContent = d.error||'كود غير صحيح'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

function finish2FASetup(){
  closeModal('tfaSetupModal');
  showToast('تم تفعيل المصادقة الثنائية بنجاح');
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
  if(!password || !code){ errEl.textContent='جميع الحقول مطلوبة'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('tfaDisableBtn'); btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/2fa/disable', 'POST', { password, code });
    if(d.success){
      ME.totp_enabled = false;
      closeModal('tfaDisableModal');
      showToast('تم إلغاء تفعيل المصادقة الثنائية');
      render();
    } else { errEl.textContent = d.error||'تعذر إلغاء التفعيل'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- حذف الحساب -----
function openDeleteModal(){
  document.getElementById('deleteErr').classList.remove('show');
  document.getElementById('deletePassword').value = '';
  openModal('deleteModal');
}
async function requestDeleteAccount(){
  const pass = document.getElementById('deletePassword').value;
  const errEl = document.getElementById('deleteErr');
  errEl.classList.remove('show');
  if(!pass){ errEl.textContent='أدخل كلمة المرور الحالية'; errEl.classList.add('show'); return; }
  const btn = document.getElementById('deleteConfirmBtn');
  btn.disabled = true;
  try{
    const d = await apiFetch('/api/account/change/request', 'POST', { purpose:'delete', currentPassword: pass });
    if(d.success){
      closeModal('deleteModal');
      showToast(d.message||'تم إرسال كود التأكيد');
      openOtpModal('delete', d.maskedEmail);
    } else { errEl.textContent = d.error||'تعذر تنفيذ الطلب'; errEl.classList.add('show'); }
  }catch(e){ errEl.textContent='تعذر الاتصال بالخادم'; errEl.classList.add('show'); }
  btn.disabled = false;
}

// ----- عرض الصفحة -----
function verifyStatusPill(){
  if(ME?.verified) return `<span class="status-pill st-verified">حساب موثّق ✓</span>`;
  if(VERIFY_STATUS?.status === 'pending') return `<span class="status-pill st-pending">طلبك قيد المراجعة</span>`;
  return `<span class="status-pill st-none">غير موثّق</span>`;
}

function render(){
  const wrap = document.getElementById('wrap');
  const avatarHtml = ME.avatar ? `<img src="${esc(ME.avatar)}" alt="">` : initials(ME.display_name||ME.username);
  wrap.innerHTML = `
    <div class="page-title">إدارة الحساب</div>
    <div class="page-sub">تحكّم في بيانات حسابك، أمانه، وخصوصيتك في هوستاكا</div>

    <div class="acc-summary">
      <div class="acc-avatar">${avatarHtml}</div>
      <div>
        <div class="acc-name">${esc(ME.display_name||ME.username)} ${ME.verified ? `<span class="badge-verified"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></span>` : ''}</div>
        <div class="acc-meta">عضو منذ ${fmtDate(ME.created_at)}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        اسم المستخدم
      </div>
      <div class="section-hint">يتطلب تغيير اسم المستخدم تأكيد كود يُرسل إلى بريدك الإلكتروني الحالي.</div>
      <div class="f-current">اسم المستخدم الحالي: <b>@${esc(ME.username)}</b></div>
      <div class="err" id="usernameErr"></div>
      <div class="fg"><input type="text" id="newUsernameInput" class="f-input" placeholder="اسم المستخدم الجديد" dir="ltr"></div>
      <button class="btn-submit" id="usernameBtn" onclick="requestUsernameChange()">إرسال كود التأكيد</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
        البريد الإلكتروني
      </div>
      <div class="section-hint">سيتم إرسال كود تأكيد إلى بريدك الجديد للتحقق من ملكيته قبل ربطه بحسابك.</div>
      <div class="f-current">البريد الحالي: <b>${esc(ME.email||'')}</b></div>
      <div class="err" id="emailErr"></div>
      <div class="fg"><input type="email" id="newEmailInput" class="f-input" placeholder="example@mail.com" dir="ltr"></div>
      <button class="btn-submit" id="emailBtn" onclick="requestEmailChange()">إرسال كود التأكيد</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        كلمة المرور
      </div>
      <div class="section-hint">يتطلب تغيير كلمة المرور إدخال كلمة المرور الحالية وتأكيد كود يُرسل إلى بريدك.</div>
      <div class="err" id="passwordErr"></div>
      <div class="fg"><label class="f-label">كلمة المرور الحالية</label><input type="password" id="curPasswordInput" class="f-input" placeholder="••••••••" autocomplete="current-password"></div>
      <div class="fg"><label class="f-label">كلمة المرور الجديدة</label><input type="password" id="newPasswordInput" class="f-input" placeholder="6 أحرف على الأقل" autocomplete="new-password"></div>
      <div class="fg"><label class="f-label">تأكيد كلمة المرور الجديدة</label><input type="password" id="confirmPasswordInput" class="f-input" placeholder="••••••••" autocomplete="new-password"></div>
      <button class="btn-submit" id="passwordBtn" onclick="requestPasswordChange()">إرسال كود التأكيد</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        تاريخ الميلاد
      </div>
      <div class="section-hint">يساعدنا في تخصيص تجربتك على المنصة. يمكن تعديله متى شئت دون الحاجة لتأكيد بريد.</div>
      <div class="fg"><input type="date" id="birthdateInput" class="f-input" value="${esc(ME.birth_date||'')}"></div>
      <button class="btn-submit" id="birthdateBtn" onclick="saveBirthdate()">حفظ</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        توثيق الحساب
      </div>
      <div class="section-hint">احصل على علامة التوثيق الزرقاء بعد مراجعة طلبك من فريق الإدارة.</div>
      <div class="verify-status">
        ${verifyStatusPill()}
        ${(!ME.verified && VERIFY_STATUS?.status !== 'pending') ? `<button class="btn-submit" onclick="requestVerifyBadge()">طلب التوثيق</button>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        المصادقة الثنائية (2FA)
      </div>
      <div class="section-hint">طبقة حماية إضافية: بعد التفعيل، سيُطلب منك عند تسجيل الدخول إدخال كود يتولّد في تطبيق مصادقة (مثل Google Authenticator) بجانب كلمة المرور.</div>
      <div class="verify-status">
        ${ME.totp_enabled ? `<span class="status-pill st-verified">مفعّلة ✓</span>` : `<span class="status-pill st-none">غير مفعّلة</span>`}
        ${ME.totp_enabled
          ? `<button class="btn-outline-danger" onclick="open2FADisableModal()">إلغاء التفعيل</button>`
          : `<button class="btn-submit" onclick="start2FASetup()">تفعيل المصادقة الثنائية</button>`}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        الأجهزة وجلسات الدخول
      </div>
      <div class="section-hint">كل الأجهزة والأماكن اللي سجّلت منها دخولك. لو فيه جلسة ما تعرفها، أنهِها فوراً.</div>
      <div id="sessionsList"><div class="section-hint">جارٍ التحميل...</div></div>
      <button class="btn-outline-danger" style="margin-top:10px;" onclick="revokeAllSessions()">تسجيل الخروج من كل الأجهزة الأخرى</button>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        تنبيهات الأمان
      </div>
      <div class="section-hint">سجل بكل الأحداث الأمنية المهمة بحسابك: تسجيل دخول جديد، تغيير كلمة المرور أو البريد، وغيرها.</div>
      <div id="securityEventsList"><div class="section-hint">جارٍ التحميل...</div></div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        النسخ الاحتياطي وتنزيل البيانات
      </div>
      <div class="section-hint">نزّل نسخة من بياناتك (منشوراتك، ملفك الشخصي، محفوظاتك) بصيغة JSON، أو ارفعها مباشرة إلى Google Drive.</div>
      <div class="verify-status">
        <a class="btn-submit" style="text-decoration:none;display:inline-flex;align-items:center;" href="/api/account/backup" onclick="return downloadBackup(event)">تنزيل نسخة من بياناتي</a>
        <button class="btn-ghost" id="driveBackupBtn" onclick="connectGoogleDrive()">رفع نسخة إلى Google Drive</button>
      </div>
    </div>

    <div class="section danger-zone">
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        منطقة الخطر
      </div>
      <div class="section-hint">حذف حسابك سيؤدي لإزالة جميع بياناتك ومنشوراتك ورسائلك نهائياً من هوستاكا، ولا يمكن التراجع عن هذا الإجراء.</div>
      <button class="btn-outline-danger" onclick="openDeleteModal()">حذف الحساب نهائياً</button>
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
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">إدارة الحساب متاحة للأعضاء المسجلين فقط</div>
        <div style="color:var(--muted);font-size:0.85rem;">سجّل الدخول للتحكم في اسم المستخدم، البريد، كلمة المرور، وباقي إعدادات حسابك</div>
        <a href="/">تسجيل الدخول</a>
      </div>`;
    return;
  }
  try{
    ME = await apiFetch('/api/me');
    if(!ME || ME.error) throw new Error('unauth');
  }catch(e){
    document.getElementById('wrap').innerHTML = `<div class="login-gate"><div style="font-weight:800;">تعذر التحقق من الحساب</div><a href="/">العودة للرئيسية</a></div>`;
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
}

// ============================================================
//  صفحة المحفوظات — /save
// ============================================================
if (document.body.classList.contains('page-save')) {

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
  return data;
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  return d.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
}

const SVG = {
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  send:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  delete:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  comment:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  reel:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  check:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
};
const REACTIONS = [
  { emoji:'like',  label:'أعجبني',  icon:SVG.like },
  { emoji:'heart', label:'أحببته',  icon:SVG.heart },
  { emoji:'haha',  label:'أضحكني',  icon:SVG.haha },
  { emoji:'sad',   label:'أحزنني',  icon:SVG.sad },
  { emoji:'angry', label:'أغضبني',  icon:SVG.angry },
];

function verifiedBadge(){ return `<span class="badge-verified">${SVG.check}</span>`; }
function stripEmojis(text) {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}
function linkifyContent(html){
  try {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
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
function sharePost(id){
  const url = location.origin + '/post?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(()=>showToast('تم نسخ رابط المنشور')).catch(()=>showToast('تعذر النسخ','error'));
}

let ME = null;
let savedItems = [];

function postStatusBadge(p){
  if (p.privacy === 'draft') return `<span class="post-status-badge st-draft">مسودة</span>`;
  if (p.privacy === 'private') return `<span class="post-status-badge st-private">خاص</span>`;
  return '';
}

function findSavedItem(id){ return savedItems.find(p => p.id === id); }
function rerenderSaved(id){
  const post = findSavedItem(id);
  const card = document.getElementById('post-'+id);
  if (post && card) {
    const wrap = document.createElement('div');
    wrap.innerHTML = renderSavedCard(post);
    card.replaceWith(wrap.firstChild);
  }
}

function renderSavedCard(p){
  const canDel = ME && (ME.role==='admin' || p.user_id==ME?.id);
  let mediaHtml = '';
  if (p.video && Number(p.is_reel) === 1) {
    mediaHtml = `<div class="reel-card" onclick="location.href='/short?id=${p.id}'">
      <video class="reel-thumb-video" muted playsinline preload="metadata"><source src="${esc(p.video)}#t=0.1" type="video/mp4"></video>
      <div class="reel-play-badge">${SVG.reel}</div>
      <div class="reel-tag">ريلز</div>
    </div>`;
  } else if (p.video) {
    mediaHtml = `<video class="card-video" controls><source src="${esc(p.video)}" type="video/mp4"></video>`;
  } else if (p.image) {
    mediaHtml = `<img class="card-img" src="${esc(p.image)}" loading="lazy" onerror="this.style.display='none'">`;
  }

  const totalReactions = (p.reactions||[]).reduce((s,r)=>s+(r.count||0),0);
  const userR = p.userReaction;
  const activeReact = userR ? REACTIONS.find(r=>r.emoji===userR) : null;
  const reactionHtml = `<div class="react-wrap">
    <button class="react-main-btn ${userR?'reacted':''}" onclick="toggleReactMenu(${p.id})">
      ${activeReact ? activeReact.icon : SVG.like}
      <span>${totalReactions||'تفاعل'}</span>
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
    const cleanContent = linkifyContent(stripEmojis(esc(c.content)));
    const replies = repliesOf(c.id);
    const repliesHtml = replies.length ? `<div class="replies-list">${replies.map(r=>oneCommentHtml(r, postId)).join('')}</div>` : '';
    return `<div class="comment" id="cmt-${c.id}">
      <div class="c-avatar">${ca}</div>
      <div class="c-bubble">
        <div class="c-name">${esc(c.display_name||c.username)}
          ${ME ? `<button class="reply-btn" onclick="toggleReplyInput(${postId},${c.id})">رد</button>` : ''}
          ${canDelC?`<button class="c-del" onclick="delComment(${c.id},${postId})">${SVG.delete}</button>`:''}
        </div>
        <div class="c-text">${cleanContent}</div>
      </div>
    </div>
    <div class="reply-input-row" id="replyRow-${c.id}" style="display:none;">
      <input class="comment-input" type="text" placeholder="رد @${esc(c.username||'')}" id="ri-${c.id}" onkeydown="if(event.key==='Enter')sendComment(${postId},${c.id})">
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');
  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="اكتب تعليقاً..." id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
    <button class="btn-send-comment" onclick="sendComment(${p.id})">${SVG.send}</button>
  </div>` : '';

  return `<div class="post-card" id="post-${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="pub-row">
        <div class="pub-info">
          <div class="pub-name" style="cursor:pointer;" onclick="goPublisher('${esc(p.publisher)}')">
            ${esc(p.publisher_name || p.publisher)}
            ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            ${postStatusBadge(p)}
          </div>
        </div>
        <div class="pub-actions">
          <button class="btn-icon save-btn saved" onclick="unsaveItem(${p.id})" title="إلغاء الحفظ">${SVG.bookmarkFilled}</button>
          <button class="btn-icon" onclick="sharePost(${p.id})" title="مشاركة">${SVG.share}</button>
        </div>
      </div>
      <div class="pub-date">${fmtDate(p.created_at)}</div>
      <div class="post-text post-html">${linkifyContent(p.content||'')}</div>
      <div class="reactions-row">
        ${reactionHtml}
        <button class="react-btn" onclick="toggleComments(${p.id})" id="cmtToggle-${p.id}">
          ${SVG.comment}<span>${allComments.length} تعليق</span>
        </button>
      </div>
      <div class="comments-section" id="cmtSec-${p.id}" style="display:none;">
        <div class="comments-list" id="cmtList-${p.id}">${commentsHtml}</div>
        ${commentInputHtml}
      </div>
    </div>
  </div>`;
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
  if(!ME) return;
  document.querySelectorAll('.react-menu.show').forEach(m => m.classList.remove('show'));
  const d = await apiFetch('/api/records/'+id+'/react', 'POST', { emoji });
  if(!d.success) return;
  const post = findSavedItem(id);
  if(post){ post.reactions = d.reactions; post.userReaction = d.userReaction; }
  rerenderSaved(id);
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
  const post=findSavedItem(postId);
  if(post){ post.comments=comments; }
  rerenderSaved(postId);
  document.getElementById('cmtSec-'+postId).style.display='block';
  document.getElementById('cmtToggle-'+postId)?.classList.add('expanded');
}
async function delComment(commentId, postId){
  if(!confirm('حذف هذا التعليق؟')) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

async function unsaveItem(id){
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  savedItems = savedItems.filter(p => p.id !== id);
  const card = document.getElementById('post-'+id);
  if(card) card.remove();
  showToast('تم إلغاء حفظ المنشور');
  if(!savedItems.length) renderEmpty();
}

function renderEmpty(){
  document.getElementById('wrap').innerHTML = `
    <div class="page-title">المحفوظات</div>
    <div class="page-sub">كل المنشورات والريلز اللي حفظتها بمكان واحد</div>
    <div class="post-empty">${SVG.share}<div>لا يوجد أي شيء محفوظ بعد</div></div>
  `;
}

async function loadSaved(){
  const token = getToken();
  if(!token){
    document.getElementById('wrap').innerHTML = `
      <div class="login-gate">
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">المحفوظات متاحة للأعضاء المسجلين فقط</div>
        <div style="color:var(--muted);font-size:0.85rem;">سجّل الدخول لرؤية المنشورات والريلز اللي حفظتها</div>
        <a href="/">تسجيل الدخول</a>
      </div>`;
    return;
  }
  try{ ME = await apiFetch('/api/me'); }catch(e){ ME = null; }
  try{
    savedItems = await apiFetch('/api/saved');
    if(!Array.isArray(savedItems)) savedItems = [];
  }catch(e){ savedItems = []; }

  if(!savedItems.length){ renderEmpty(); return; }

  document.getElementById('wrap').innerHTML = `
    <div class="page-title">المحفوظات</div>
    <div class="page-sub">كل المنشورات والريلز اللي حفظتها بمكان واحد</div>
    <div id="savedList">${savedItems.map(p=>renderSavedCard(p)).join('')}</div>
  `;
}

loadSaved();

try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.sharePost = sharePost; } catch(e) {}
try { window.toggleReactMenu = toggleReactMenu; } catch(e) {}
try { window.toggleReact = toggleReact; } catch(e) {}
try { window.toggleComments = toggleComments; } catch(e) {}
try { window.toggleReplyInput = toggleReplyInput; } catch(e) {}
try { window.sendComment = sendComment; } catch(e) {}
try { window.delComment = delComment; } catch(e) {}
try { window.unsaveItem = unsaveItem; } catch(e) {}
}

// ============================================================
//  صفحة منشور واحد — /post
// ============================================================
if (document.body.classList.contains('page-post')) {

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
  return data;
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function fmtDate(s){
  if(!s) return '';
  let d;
  if(typeof s === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(s)) d = new Date(s.replace(' ','T')+'Z');
  else d = new Date(s);
  return d.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
}

const SVG = {
  like:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  haha:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  sad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  angry:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16c-1.5-1-2.5-1.5-4-1.5s-2.5.5-4 1.5"/><path d="M8 8l2 2"/><path d="M16 8l-2 2"/></svg>`,
  send:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  delete:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  comment:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  reel:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>`,
  bookmarkFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  check:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
};
const REACTIONS = [
  { emoji:'like',  label:'أعجبني',  icon:SVG.like },
  { emoji:'heart', label:'أحببته',  icon:SVG.heart },
  { emoji:'haha',  label:'أضحكني',  icon:SVG.haha },
  { emoji:'sad',   label:'أحزنني',  icon:SVG.sad },
  { emoji:'angry', label:'أغضبني',  icon:SVG.angry },
];

function verifiedBadge(){ return `<span class="badge-verified">${SVG.check}</span>`; }
function stripEmojis(text) {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}
function linkifyContent(html){
  try {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
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
function sharePost(id){
  const url = location.origin + '/post?id=' + id;
  if (navigator.share) { navigator.share({ url }).catch(()=>{}); return; }
  navigator.clipboard?.writeText(url).then(()=>showToast('تم نسخ رابط المنشور')).catch(()=>showToast('تعذر النسخ','error'));
}

let ME = null;
let postList = [];

function postStatusBadge(p){
  if (p.privacy === 'draft') return `<span class="post-status-badge st-draft">مسودة</span>`;
  if (p.privacy === 'private') return `<span class="post-status-badge st-private">خاص</span>`;
  return '';
}

function findPostItem(id){ return postList.find(p => p.id === id); }
function rerenderPostItem(id){
  const post = findPostItem(id);
  const card = document.getElementById('post-'+id);
  if (post && card) {
    const wrap = document.createElement('div');
    wrap.innerHTML = renderPostCard(post);
    card.replaceWith(wrap.firstChild);
  }
}

function renderPostCard(p){
  const canDel = ME && (ME.role==='admin' || p.user_id==ME?.id);
  let mediaHtml = '';
  if (p.video && Number(p.is_reel) === 1) {
    mediaHtml = `<div class="reel-card" onclick="location.href='/short?id=${p.id}'">
      <video class="reel-thumb-video" muted playsinline preload="metadata"><source src="${esc(p.video)}#t=0.1" type="video/mp4"></video>
      <div class="reel-play-badge">${SVG.reel}</div>
      <div class="reel-tag">ريلز</div>
    </div>`;
  } else if (p.video) {
    mediaHtml = `<video class="card-video" controls><source src="${esc(p.video)}" type="video/mp4"></video>`;
  } else if (p.image) {
    mediaHtml = `<img class="card-img" src="${esc(p.image)}" loading="lazy" onerror="this.style.display='none'">`;
  }

  const totalReactions = (p.reactions||[]).reduce((s,r)=>s+(r.count||0),0);
  const userR = p.userReaction;
  const activeReact = userR ? REACTIONS.find(r=>r.emoji===userR) : null;
  const reactionHtml = `<div class="react-wrap">
    <button class="react-main-btn ${userR?'reacted':''}" onclick="toggleReactMenu(${p.id})">
      ${activeReact ? activeReact.icon : SVG.like}
      <span>${totalReactions||'تفاعل'}</span>
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
    const cleanContent = linkifyContent(stripEmojis(esc(c.content)));
    const replies = repliesOf(c.id);
    const repliesHtml = replies.length ? `<div class="replies-list">${replies.map(r=>oneCommentHtml(r, postId)).join('')}</div>` : '';
    return `<div class="comment" id="cmt-${c.id}">
      <div class="c-avatar">${ca}</div>
      <div class="c-bubble">
        <div class="c-name">${esc(c.display_name||c.username)}
          ${ME ? `<button class="reply-btn" onclick="toggleReplyInput(${postId},${c.id})">رد</button>` : ''}
          ${canDelC?`<button class="c-del" onclick="delComment(${c.id},${postId})">${SVG.delete}</button>`:''}
        </div>
        <div class="c-text">${cleanContent}</div>
      </div>
    </div>
    <div class="reply-input-row" id="replyRow-${c.id}" style="display:none;">
      <input class="comment-input" type="text" placeholder="رد @${esc(c.username||'')}" id="ri-${c.id}" onkeydown="if(event.key==='Enter')sendComment(${postId},${c.id})">
      <button class="btn-send-comment" onclick="sendComment(${postId},${c.id})">${SVG.send}</button>
    </div>
    ${repliesHtml}`;
  }
  const commentsHtml = topComments.map(c => oneCommentHtml(c, p.id)).join('');
  const commentInputHtml = ME ? `<div class="comment-input-row">
    <input class="comment-input" type="text" placeholder="اكتب تعليقاً..." id="ci-${p.id}" onkeydown="if(event.key==='Enter')sendComment(${p.id})">
    <button class="btn-send-comment" onclick="sendComment(${p.id})">${SVG.send}</button>
  </div>` : '';

  return `<div class="post-card" id="post-${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="pub-row">
        <div class="pub-info">
          <div class="pub-name" style="cursor:pointer;" onclick="goPublisher('${esc(p.publisher)}')">
            ${esc(p.publisher_name || p.publisher)}
            ${(p.publisher_verified||p.user_verified) ? verifiedBadge() : ''}
            ${postStatusBadge(p)}
          </div>
        </div>
        <div class="pub-actions">
          <button class="btn-icon save-btn ${p.is_saved?'saved':''}" onclick="toggleSaveItem(${p.id})" title="${p.is_saved?'إلغاء الحفظ':'حفظ'}">${p.is_saved?SVG.bookmarkFilled:SVG.bookmark}</button>
          <button class="btn-icon" onclick="sharePost(${p.id})" title="مشاركة">${SVG.share}</button>
          ${canDel ? `<button class="btn-icon" onclick="deletePostItem(${p.id})" title="حذف">${SVG.delete}</button>` : ''}
        </div>
      </div>
      <div class="pub-date">${fmtDate(p.created_at)}</div>
      <div class="post-text post-html">${linkifyContent(p.content||'')}</div>
      <div class="reactions-row">
        ${reactionHtml}
        <button class="react-btn" onclick="toggleComments(${p.id})" id="cmtToggle-${p.id}">
          ${SVG.comment}<span>${allComments.length} تعليق</span>
        </button>
      </div>
      <div class="comments-section" id="cmtSec-${p.id}" style="display:none;">
        <div class="comments-list" id="cmtList-${p.id}">${commentsHtml}</div>
        ${commentInputHtml}
      </div>
    </div>
  </div>`;
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
  if(!ME) return;
  document.querySelectorAll('.react-menu.show').forEach(m => m.classList.remove('show'));
  const d = await apiFetch('/api/records/'+id+'/react', 'POST', { emoji });
  if(!d.success) return;
  const post = findPostItem(id);
  if(post){ post.reactions = d.reactions; post.userReaction = d.userReaction; }
  rerenderPostItem(id);
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
  const post=findPostItem(postId);
  if(post){ post.comments=comments; }
  rerenderPostItem(postId);
  document.getElementById('cmtSec-'+postId).style.display='block';
  document.getElementById('cmtToggle-'+postId)?.classList.add('expanded');
}
async function delComment(commentId, postId){
  if(!confirm('حذف هذا التعليق؟')) return;
  await apiFetch('/api/comments/'+commentId,'DELETE');
  document.getElementById('cmt-'+commentId)?.remove();
}

async function toggleSaveItem(id){
  if(!ME) return;
  const d = await apiFetch('/api/records/'+id+'/save', 'POST');
  if(!d.success) return;
  const post = findPostItem(id);
  if(post) post.is_saved = d.saved;
  rerenderPostItem(id);
  showToast(d.saved ? 'تم حفظ المنشور' : 'تم إلغاء حفظ المنشور');
}

async function deletePostItem(id){
  if(!confirm('حذف هذا المنشور نهائياً؟')) return;
  const d = await apiFetch('/api/records/'+id, 'DELETE');
  if(d.success){ showToast('تم الحذف'); setTimeout(()=>{ location.href='/'; }, 800); }
  else showToast(d.error||'تعذر الحذف', 'error');
}

function renderEmpty(msg){
  document.getElementById('wrap').innerHTML = `
    <div class="post-empty" style="margin-top:60px;">${SVG.share}<div>${msg || 'هذا المنشور غير متاح'}</div></div>
  `;
}

async function loadSinglePost(){
  const id = new URLSearchParams(location.search).get('id');
  if(!id){ renderEmpty('لم يتم تحديد منشور'); return; }
  try{ ME = await apiFetch('/api/me'); }catch(e){ ME = null; }
  try{
    const post = await apiFetch('/api/records/'+id+'/single');
    if(post.error){ renderEmpty(post.error); return; }
    postList = [post];
    document.getElementById('wrap').innerHTML = `
      <div class="page-title">منشور</div>
      <div id="postSingle">${renderPostCard(post)}</div>
    `;
  }catch(e){ renderEmpty(); }
}

loadSinglePost();

try { window.setTheme = setTheme; } catch(e) {}
try { window.toggleTheme = toggleTheme; } catch(e) {}
try { window.goPublisher = goPublisher; } catch(e) {}
try { window.sharePost = sharePost; } catch(e) {}
try { window.toggleReactMenu = toggleReactMenu; } catch(e) {}
try { window.toggleReact = toggleReact; } catch(e) {}
try { window.toggleComments = toggleComments; } catch(e) {}
try { window.toggleReplyInput = toggleReplyInput; } catch(e) {}
try { window.sendComment = sendComment; } catch(e) {}
try { window.delComment = delComment; } catch(e) {}
try { window.toggleSaveItem = toggleSaveItem; } catch(e) {}
try { window.deletePostItem = deletePostItem; } catch(e) {}
}