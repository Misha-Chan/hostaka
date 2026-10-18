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

/* ================= تهريب قيمة نصية للاستخدام داخل سلسلة JS بسمة HTML =================
 * دالة esc() تُهرّب HTML لكنها تُترك ' كما هي؛ ولأن قيمة سمة onclick تُفكّ ترميز
 * الـ HTML أولاً ثم تُحلّل كـ JS، فإن ' غير مهرّبة تسمح بكسر السلسلة وحقن كود
 * (مثلاً اسم عرض يحوي: '); alert(1); //). هذه الدالة تُهرّب للسياقين معاً:
 * HTML (& < > ") ثم JS (\ ' والسطور الجديدة).
 */
function escJs(s) {
  var str = String(s == null ? '' : s);
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');
}
window.escJs = escJs;

/* ================= تنقية HTML المحتوى الغني (حماية من XSS مخزّن) =================
 * محتوى المنشورات يُخزَّن كـ HTML من محرر contenteditable، ويُعرض عبر innerHTML
 * (دالة linkifyContent) في كل صفحات العرض (index/post/profile/save). ننقّي هنا
 * داخل المتصفح باستخدام محلّل الـ DOM نفسه (أدق وأأمن من أي regex)، بقائمة بيضاء
 * ضيقة من وسوم التنسيق فقط وبلا أي سمات عدا href/title على <a>. هذا خط دفاع ثانٍ
 * مكمّل للتنقية على السيرفر، ويحيّد أيضاً أي منشور قديم مخزّن قبل تطبيق التنقية.
 */
function sanitizeRichHtml(html) {
  if (html == null) return '';
  var ALLOWED = {
    B: 1, STRONG: 1, I: 1, EM: 1, U: 1, S: 1, STRIKE: 1, DEL: 1, BR: 1, P: 1,
    DIV: 1, SPAN: 1, A: 1, UL: 1, OL: 1, LI: 1, BLOCKQUOTE: 1,
    H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, CODE: 1, PRE: 1, HR: 1
  };
  var DROP_WITH_CONTENT = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, IFRAME: 1, OBJECT: 1,
    EMBED: 1, SVG: 1, MATH: 1, LINK: 1, META: 1, BASE: 1, TITLE: 1, HEAD: 1,
    BODY: 1, HTML: 1, FORM: 1, INPUT: 1, BUTTON: 1, TEXTAREA: 1, SELECT: 1,
    OPTION: 1, VIDEO: 1, AUDIO: 1, IMG: 1, SOURCE: 1, TRACK: 1, CANVAS: 1,
    APPLET: 1, FRAME: 1, FRAMESET: 1
  };
  var doc, host;
  try {
    doc = document.implementation.createHTMLDocument('');
    host = doc.createElement('div');
    host.innerHTML = String(html);
  } catch (e) { return ''; }

  var nodes = host.querySelectorAll('*');
  for (var i = nodes.length - 1; i >= 0; i--) {
    var el = nodes[i];
    var parent = el.parentNode;
    if (!parent) continue;
    var tag = (el.tagName || '').toUpperCase();
    // أي محتوى أجنبي (SVG/MathML مثل <svg onload>) نُزيله كاملاً — بؤرة XSS شائعة
    if (el.namespaceURI && el.namespaceURI !== 'http://www.w3.org/1999/xhtml') { parent.removeChild(el); continue; }
    if (DROP_WITH_CONTENT[tag]) { parent.removeChild(el); continue; }
    if (!ALLOWED[tag]) {
      // وسم غير مسموح لكنه غير خطير: نُبقي محتواه النصي فقط (unwap)
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
      continue;
    }
    // تنظيف السمات: فقط href/title على <a>، مع رفض أي مخطط غير آمن
    var attrs = el.attributes;
    for (var j = attrs.length - 1; j >= 0; j--) {
      var name = attrs[j].name;
      var lname = name.toLowerCase();
      if (tag === 'A' && lname === 'href') {
        var href = (el.getAttribute(name) || '').trim();
        if (!/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href)) el.removeAttribute(name);
        continue;
      }
      if (tag === 'A' && lname === 'title') continue;
      el.removeAttribute(name);
    }
    if (tag === 'A') {
      el.setAttribute('rel', 'noopener noreferrer');
      el.setAttribute('target', '_blank');
    }
  }
  return host.innerHTML;
}
window.sanitizeRichHtml = sanitizeRichHtml;

