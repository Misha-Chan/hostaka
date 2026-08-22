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

/* ================= مزامنة الثيم بين نطاقات هوستاكا الفرعية =================
 * السبب الجذري للمشكلة: كل نطاق فرعي (orbithub.hostaka.fun، console.hostaka.fun،
 * hostaka.fun نفسه...) عنده localStorage منفصل تماماً (كل origin له تخزين خاص
 * بيه، هذا سلوك المتصفح الطبيعي)، فتبديل الثيم بنطاق فرعي واحد ما ينعكس على
 * الباقي. الحل: كوكي واحدة مشتركة على مستوى Domain=.hostaka.fun (تُقرأ من كل
 * النطاقات الفرعية) تُستخدم كمرآة لقيمة hostaka_theme المحلية:
 *   - عند تحميل أي صفحة: لو الكوكي المشتركة تختلف عن القيمة المحلية، نحدّث
 *     localStorage بقيمة الكوكي *قبل* ما كود الصفحة (chat.js/script.js...)
 *     يقرأ hostaka_theme — بما إنه shared.js يُحمَّل (defer) قبل سكربتات
 *     الصفحة بالترتيب دايماً، هذا كافي بدون أي تعديل على كل صفحة لحالها.
 *   - عند أي تغيير فعلي للثيم (بأي صفحة، بأي طريقة: زر يدوي أو تلقائي حسب
 *     النظام) — نراقب تغيّر خاصية data-theme على <html> عبر MutationObserver
 *     بدل ما نعدّل كل دالة setTheme() بكل ملف (مكرّرة بعدة أماكن)، ونعكس
 *     القيمة الجديدة على الكوكي المشتركة فوراً.
 * ملاحظة: لو الموقع يشتغل على نطاق غير hostaka.fun (تطوير محلي / preview)
 * المتصفح ببساطة يتجاهل الكوكي بـ Domain=.hostaka.fun (فشل صامت وآمن) —
 * يبقى localStorage العادي شغّال داخل نفس النطاق كما كان.
 */
(function () {
  var COOKIE_NAME = 'hostaka_theme';
  var LS_KEY = 'hostaka_theme';
  var isHostakaDomain = /(^|\.)hostaka\.fun$/.test(location.hostname);
  var COOKIE_DOMAIN = isHostakaDomain ? '.hostaka.fun' : null;
  var MAX_AGE = 60 * 60 * 24 * 365; // سنة كاملة

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function writeCookie(name, value) {
    if (!COOKIE_DOMAIN) return; // ما نكتب كوكي دومين-واسع على نطاق مش تابع لهوستاكا
    try {
      document.cookie = name + '=' + encodeURIComponent(value) +
        '; Max-Age=' + MAX_AGE + '; Path=/; Domain=' + COOKIE_DOMAIN + '; SameSite=Lax';
    } catch (e) {}
  }

  // 1) مزامنة عند التحميل: الكوكي المشتركة (لو موجودة) هي "آخر قيمة معروفة
  //    عبر كل النطاقات"، فتفوز على القيمة المحلية القديمة بهذا النطاق تحديداً.
  try {
    var cookieVal = readCookie(COOKIE_NAME);
    var localVal = localStorage.getItem(LS_KEY);
    if (cookieVal && cookieVal !== localVal) {
      localStorage.setItem(LS_KEY, cookieVal);
    } else if (!cookieVal && localVal) {
      writeCookie(COOKIE_NAME, localVal); // أول مرة نهجّر فيها قيمة كانت محلية بس
    }
  } catch (e) {}

  // 2) مزامنة عند أي تغيير فعلي (بغض النظر شو الصفحة أو الزر يلي استخدمه):
  //    setTheme() بكل الصفحات دايماً تعدّل data-theme على <html>، فمراقبتها
  //    نقطة مركزية وحيدة تغطي كل الحالات بدون تكرار الكود بكل ملف.
  function mirrorNow() {
    try {
      var v = localStorage.getItem(LS_KEY);
      if (v && v !== readCookie(COOKIE_NAME)) writeCookie(COOKIE_NAME, v);
    } catch (e) {}
  }
  try {
    new MutationObserver(mirrorNow).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme']
    });
  } catch (e) {}
})();

/* ================= مزامنة جلسة الدخول مع orbithub (نظام المراسلات) =================
 * orbithub.hostaka.fun فرع تابع لـ Hostaka وليس منتجاً مستقلاً — ما فيه
 * تسجيل دخول خاص فيه، لازم يستخدم نفس جلسة Hostaka. نفس مشكلة الثيم أعلاه
 * بالضبط (localStorage معزول لكل نطاق فرعي)، ونفس الحل: كوكي مشتركة على
 * Domain=.hostaka.fun، بس هذه المرة لمفاتيح الجلسة (hostaka_token/
 * hostaka_user/hostaka_role) بدل الثيم.
 * بما إن هذي المفاتيح تُكتب/تُحذف مباشرة عبر localStorage.setItem/removeItem
 * بعدة ملفات (login.js، script.js دالة doLogout عبر clearUser...) بدل ما
 * نلاحق كل مكان، نعترض الدالتين نفسهما مرة وحدة هنا فقط لهذه المفاتيح
 * الثلاثة تحديداً — أي كود موجود أو مستقبلي يكتب/يحذف hostaka_token بأي
 * ملف ينعكس تلقائياً على الكوكي المشتركة بدون أي تعديل إضافي.
 */
(function () {
  var SESSION_KEYS = ['hostaka_token', 'hostaka_user', 'hostaka_role'];
  var COOKIE_DOMAIN = /(^|\.)hostaka\.fun$/.test(location.hostname) ? '.hostaka.fun' : null;
  var MAX_AGE = 60 * 60 * 24 * 30; // 30 يوم (نفس مدة صلاحية التوكن تقريباً)

  var SECURE = location.protocol === 'https:' ? '; Secure' : '';
  function writeSessionCookie(name, value) {
    if (!COOKIE_DOMAIN) return;
    try {
      if (value) {
        document.cookie = name + '=' + encodeURIComponent(value) +
          '; Max-Age=' + MAX_AGE + '; Path=/; Domain=' + COOKIE_DOMAIN + '; SameSite=Lax' + SECURE;
      } else {
        document.cookie = name + '=; Max-Age=0; Path=/; Domain=' + COOKIE_DOMAIN + SECURE;
      }
    } catch (e) {}
  }
  function readSessionCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // عند التحميل: لو فيه جلسة محلية بهذا النطاق ولسا ما انعكست على الكوكي
  // المشتركة (أول مرة بعد هذا التحديث مثلاً)، صدّرها فوراً.
  try {
    SESSION_KEYS.forEach(function (k) {
      var local = localStorage.getItem(k);
      if (local && readSessionCookie(k) !== local) writeSessionCookie(k, local);
    });
  } catch (e) {}

  // اعتراض الكتابة/الحذف المستقبلية لمفاتيح الجلسة فقط — بقية مفاتيح
  // localStorage (لغة، ثيم محلي، تفضيلات...) تمر بدون أي تغيير في السلوك.
  try {
    var _setItem = localStorage.setItem.bind(localStorage);
    var _removeItem = localStorage.removeItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      _setItem(key, value);
      if (SESSION_KEYS.indexOf(key) !== -1) writeSessionCookie(key, value);
    };
    localStorage.removeItem = function (key) {
      _removeItem(key);
      if (SESSION_KEYS.indexOf(key) !== -1) writeSessionCookie(key, '');
    };
  } catch (e) {}
})();

/* ================= تتبّع الزيارات (لوحة الإدارة) ================= */
(function () {
  try {
    if (document.body.classList.contains('page-admin')) return; // لا نتتبع استخدام لوحة الإدارة نفسها
    let sid = localStorage.getItem('hostaka_sid');
    if (!sid) {
      sid = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('hostaka_sid', sid);
    }
    function send(url, extra) {
      const token = localStorage.getItem('hostaka_token') || '';
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(Object.assign({ sid, path: location.pathname }, extra || {})),
        keepalive: true
      }).catch(()=>{});
    }
    send('/api/track', { ref: document.referrer || '' });
    setInterval(() => { if (!document.hidden) send('/api/track/ping'); }, 25000);
  } catch (e) { /* التتبع لا يجب أن يكسر أي صفحة */ }
})();

