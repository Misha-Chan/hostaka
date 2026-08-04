/*
 * Hostaka custom dialog system.
 * Replaces the browser's native alert()/confirm()/prompt() with styled,
 * on-brand modals so the platform never shows an unstyled OS dialog box.
 *
 * Usage:
 *   await window.hostakaAlert('Something happened');
 *   const ok = await window.hostakaConfirm('Delete this post?', { danger: true });
 *   const value = await window.hostakaPrompt('Group name:', 'Default name');
 *
 * All three return Promises so calling code should be inside an async
 * function and use `await` at the call site (exactly like the native
 * versions were used, just with `await` in front).
 */
(function () {
  if (window.hostakaAlert) return; // already loaded

  function isRTL() {
    return (document.documentElement.getAttribute('dir') || 'ltr') === 'rtl';
  }

  function label(key, fallbackAr, fallbackEn) {
    if (window.t) {
      try {
        var v = window.t(key);
        if (v && v !== key) return v;
      } catch (e) {}
    }
    return isRTL() ? fallbackAr : fallbackEn;
  }

  var STYLE_ID = 'hostaka-dialog-styles';
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
.hst-dlg-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; opacity: 0; transition: opacity .15s ease;
  font-family: 'Cairo', sans-serif;
}
.hst-dlg-overlay.show { opacity: 1; }
.hst-dlg-box {
  background: var(--card-bg, var(--bg, #fff));
  color: var(--text, #1c1c1e);
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  border-radius: 18px;
  width: 100%; max-width: 360px;
  padding: 22px 20px 18px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  transform: translateY(10px) scale(.97);
  transition: transform .15s ease;
}
.hst-dlg-overlay.show .hst-dlg-box { transform: translateY(0) scale(1); }
.hst-dlg-title {
  font-size: 1.02rem; font-weight: 800; margin: 0 0 8px;
  line-height: 1.4;
}
.hst-dlg-msg {
  font-size: 0.88rem; color: var(--muted, #8e8e93);
  line-height: 1.6; margin: 0 0 16px; white-space: pre-wrap;
}
.hst-dlg-input {
  width: 100%; box-sizing: border-box;
  padding: 10px 14px; border-radius: 10px;
  border: 1.5px solid var(--border, rgba(0,0,0,0.12));
  background: var(--input-bg, transparent);
  color: var(--text, #1c1c1e);
  font-family: inherit; font-size: 0.9rem; margin-bottom: 16px;
  outline: none;
}
.hst-dlg-input:focus { border-color: var(--primary, #8B5E3C); }
.hst-dlg-actions { display: flex; gap: 10px; justify-content: flex-end; }
.hst-dlg-btn {
  padding: 9px 18px; border-radius: 10px; border: none;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s ease, transform .1s ease;
}
.hst-dlg-btn:active { transform: scale(0.97); }
.hst-dlg-btn-cancel {
  background: rgba(128,128,128,0.14); color: var(--text, #1c1c1e);
}
.hst-dlg-btn-cancel:hover { background: rgba(128,128,128,0.22); }
.hst-dlg-btn-ok {
  background: var(--primary, #8B5E3C); color: #fff;
}
.hst-dlg-btn-ok:hover { filter: brightness(1.08); }
.hst-dlg-btn-danger { background: var(--danger, #ff3b30); color: #fff; }
.hst-dlg-btn-danger:hover { filter: brightness(1.08); }
`;
    document.head.appendChild(style);
  }

  function buildBase(title, message) {
    ensureStyles();
    var overlay = document.createElement('div');
    overlay.className = 'hst-dlg-overlay';
    var box = document.createElement('div');
    box.className = 'hst-dlg-box';
    if (title) {
      var t = document.createElement('div');
      t.className = 'hst-dlg-title';
      t.textContent = title;
      box.appendChild(t);
    }
    if (message) {
      var m = document.createElement('div');
      m.className = 'hst-dlg-msg';
      m.textContent = message;
      box.appendChild(m);
    }
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    return { overlay: overlay, box: box };
  }

  function closeDialog(overlay, cb) {
    overlay.classList.remove('show');
    setTimeout(function () {
      overlay.remove();
      if (cb) cb();
    }, 150);
  }

  window.hostakaAlert = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var d = buildBase(opts.title, message);
      var actions = document.createElement('div');
      actions.className = 'hst-dlg-actions';
      var okBtn = document.createElement('button');
      okBtn.className = 'hst-dlg-btn hst-dlg-btn-ok';
      okBtn.textContent = opts.okText || label('common.ok', 'حسناً', 'OK');
      okBtn.onclick = function () { closeDialog(d.overlay, function () { resolve(); }); };
      actions.appendChild(okBtn);
      d.box.appendChild(actions);
      okBtn.focus();
      d.overlay.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Enter' || e.key === 'Escape') { okBtn.click(); }
      });
    });
  };

  window.hostakaConfirm = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var d = buildBase(opts.title, message);
      var actions = document.createElement('div');
      actions.className = 'hst-dlg-actions';
      var cancelBtn = document.createElement('button');
      cancelBtn.className = 'hst-dlg-btn hst-dlg-btn-cancel';
      cancelBtn.textContent = opts.cancelText || label('common.cancel', 'إلغاء', 'Cancel');
      cancelBtn.onclick = function () { closeDialog(d.overlay, function () { resolve(false); }); };
      var okBtn = document.createElement('button');
      okBtn.className = 'hst-dlg-btn ' + (opts.danger ? 'hst-dlg-btn-danger' : 'hst-dlg-btn-ok');
      okBtn.textContent = opts.okText || label('common.confirm', 'تأكيد', 'Confirm');
      okBtn.onclick = function () { closeDialog(d.overlay, function () { resolve(true); }); };
      if (isRTL()) { actions.appendChild(okBtn); actions.appendChild(cancelBtn); }
      else { actions.appendChild(cancelBtn); actions.appendChild(okBtn); }
      d.box.appendChild(actions);
      d.overlay.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') cancelBtn.click();
        if (e.key === 'Enter') okBtn.click();
      });
      okBtn.focus();
    });
  };

  window.hostakaPrompt = function (message, defaultValue, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var d = buildBase(opts.title, message);
      var input = document.createElement('input');
      input.type = opts.type || 'text';
      input.className = 'hst-dlg-input';
      input.value = defaultValue || '';
      if (opts.placeholder) input.placeholder = opts.placeholder;
      d.box.appendChild(input);
      var actions = document.createElement('div');
      actions.className = 'hst-dlg-actions';
      var cancelBtn = document.createElement('button');
      cancelBtn.className = 'hst-dlg-btn hst-dlg-btn-cancel';
      cancelBtn.textContent = opts.cancelText || label('common.cancel', 'إلغاء', 'Cancel');
      cancelBtn.onclick = function () { closeDialog(d.overlay, function () { resolve(null); }); };
      var okBtn = document.createElement('button');
      okBtn.className = 'hst-dlg-btn hst-dlg-btn-ok';
      okBtn.textContent = opts.okText || label('common.confirm', 'تأكيد', 'Confirm');
      okBtn.onclick = function () { var v = input.value; closeDialog(d.overlay, function () { resolve(v); }); };
      if (isRTL()) { actions.appendChild(okBtn); actions.appendChild(cancelBtn); }
      else { actions.appendChild(cancelBtn); actions.appendChild(okBtn); }
      d.box.appendChild(actions);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') okBtn.click();
        if (e.key === 'Escape') cancelBtn.click();
      });
      setTimeout(function () { input.focus(); input.select(); }, 60);
    });
  };
})();
