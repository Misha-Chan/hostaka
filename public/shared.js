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

