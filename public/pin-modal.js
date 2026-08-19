/*
 * PIN setup/unlock modal for the E2E encryption identity backup
 * (see crypto.js). Non-blocking: the user can always dismiss it and keep
 * browsing — messages that need the identity just stay shown as locked
 * (🔒) until they come back and enter the PIN.
 *
 * Usage: window.HostakaPinModal.ensureUnlocked()
 *   - Checks HostakaCrypto.getIdentityStatus() and does nothing if 'ready'.
 *   - Shows a "choose a PIN" flow the very first time (status 'needs_setup').
 *   - Shows an "enter your PIN" flow on a new device/origin/session
 *     (status 'needs_unlock'), including the lockout countdown if rate-limited.
 *   - On success, dispatches a `hostaka:identity-unlocked` event on
 *     `window` so the page can re-render/re-decrypt already-loaded content.
 */
(function () {
  if (window.HostakaPinModal) return;

  function isRTL() { return (document.documentElement.getAttribute('dir') || 'ltr') === 'rtl'; }
  function tr(ar, en) { return isRTL() ? ar : en; }

  var STYLE_ID = 'hostaka-pin-modal-styles';
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
.hst-pin-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; opacity: 0; transition: opacity .15s ease;
  font-family: 'Ubuntu', 'El Messiri', sans-serif;
}
.hst-pin-overlay.show { opacity: 1; }
.hst-pin-box {
  background: var(--card-bg, var(--bg, #fff));
  color: var(--text, #1c1c1e);
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  border-radius: 18px;
  width: 100%; max-width: 380px;
  padding: 24px 22px 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  transform: translateY(10px) scale(.97);
  transition: transform .15s ease;
  text-align: center;
}
.hst-pin-overlay.show .hst-pin-box { transform: translateY(0) scale(1); }
.hst-pin-icon { font-size: 30px; margin-bottom: 6px; }
.hst-pin-title { font-size: 1.05rem; font-weight: 800; margin: 0 0 8px; }
.hst-pin-msg { font-size: 0.86rem; color: var(--muted, #8e8e93); line-height: 1.6; margin: 0 0 18px; }
.hst-pin-digits { display: flex; gap: 8px; justify-content: center; margin-bottom: 14px; direction: ltr; }
.hst-pin-digit {
  width: 42px; height: 50px; text-align: center; font-size: 1.3rem; font-weight: 700;
  border-radius: 10px; border: 1.5px solid var(--border, rgba(0,0,0,0.12));
  background: var(--input-bg, transparent); color: var(--text, #1c1c1e); outline: none;
}
.hst-pin-digit:focus { border-color: var(--primary, #8B5E3C); }
.hst-pin-error { color: var(--danger, #ff3b30); font-size: 0.8rem; min-height: 18px; margin-bottom: 10px; font-weight: 600; }
.hst-pin-actions { display: flex; gap: 10px; justify-content: center; }
.hst-pin-btn {
  padding: 10px 22px; border-radius: 10px; border: none;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s ease, transform .1s ease;
}
.hst-pin-btn:active { transform: scale(0.97); }
.hst-pin-btn:disabled { opacity: 0.55; cursor: default; }
.hst-pin-btn-cancel { background: rgba(128,128,128,0.14); color: var(--text, #1c1c1e); }
.hst-pin-btn-ok { background: var(--primary, #8B5E3C); color: #fff; }
`;
    document.head.appendChild(style);
  }

  function buildDigitInputs(container) {
    var inputs = [];
    for (var i = 0; i < 6; i++) {
      var inp = document.createElement('input');
      inp.className = 'hst-pin-digit';
      inp.type = 'tel';
      inp.inputMode = 'numeric';
      inp.maxLength = 1;
      inp.autocomplete = 'off';
      container.appendChild(inp);
      inputs.push(inp);
    }
    inputs.forEach(function (inp, idx) {
      inp.addEventListener('input', function () {
        inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
        if (inp.value && idx < 5) inputs[idx + 1].focus();
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && idx > 0) inputs[idx - 1].focus();
        if (e.key === 'Enter') container.dispatchEvent(new CustomEvent('hst-pin-submit'));
      });
      inp.addEventListener('paste', function (e) {
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (!text) return;
        e.preventDefault();
        for (var j = 0; j < 6; j++) inputs[j].value = text[j] || '';
        (inputs[Math.min(text.length, 5)] || inputs[5]).focus();
      });
    });
    return inputs;
  }

  function readDigits(inputs) { return inputs.map(function (i) { return i.value || ''; }).join(''); }
  function clearDigits(inputs) { inputs.forEach(function (i) { i.value = ''; }); inputs[0].focus(); }

  function buildBase(icon, title, msg) {
    ensureStyles();
    var overlay = document.createElement('div');
    overlay.className = 'hst-pin-overlay';
    var box = document.createElement('div');
    box.className = 'hst-pin-box';
    box.innerHTML =
      '<div class="hst-pin-icon">' + icon + '</div>' +
      '<div class="hst-pin-title">' + title + '</div>' +
      '<div class="hst-pin-msg">' + msg + '</div>';
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    return { overlay: overlay, box: box };
  }
  function close(overlay) {
    overlay.classList.remove('show');
    setTimeout(function () { overlay.remove(); }, 150);
  }

  function runSetupFlow() {
    return new Promise(function (resolve) {
      var d = buildBase(
        '🔐',
        tr('تأمين رسائلك المشفّرة', 'Secure your encrypted messages'),
        tr(
          'اختر رمز PIN من 6 أرقام. هذا الرمز يخوّلك استرجاع رسائلك القديمة لو غيّرت جهازك أو مسحت بيانات المتصفح — احتفظ فيه، ما فيه طريقة لاسترجاعه بدونه.',
          'Choose a 6-digit PIN. It lets you recover your message history if you switch devices or clear your browser data — keep it safe, there is no way to recover it without this PIN.'
        )
      );
      var digitsWrap = document.createElement('div');
      digitsWrap.className = 'hst-pin-digits';
      d.box.appendChild(digitsWrap);
      var inputs = buildDigitInputs(digitsWrap);

      var errorEl = document.createElement('div');
      errorEl.className = 'hst-pin-error';
      d.box.appendChild(errorEl);

      var step = 1; // 1 = enter PIN, 2 = confirm PIN
      var firstPin = '';

      var actions = document.createElement('div');
      actions.className = 'hst-pin-actions';
      var skipBtn = document.createElement('button');
      skipBtn.className = 'hst-pin-btn hst-pin-btn-cancel';
      skipBtn.textContent = tr('لاحقاً', 'Later');
      var okBtn = document.createElement('button');
      okBtn.className = 'hst-pin-btn hst-pin-btn-ok';
      okBtn.textContent = tr('متابعة', 'Continue');
      if (isRTL()) { actions.appendChild(okBtn); actions.appendChild(skipBtn); }
      else { actions.appendChild(skipBtn); actions.appendChild(okBtn); }
      d.box.appendChild(actions);

      skipBtn.onclick = function () { close(d.overlay); resolve(false); };

      async function submit() {
        var val = readDigits(inputs);
        if (!/^\d{6}$/.test(val)) {
          errorEl.textContent = tr('أدخل 6 أرقام', 'Enter 6 digits');
          return;
        }
        if (step === 1) {
          firstPin = val;
          step = 2;
          errorEl.textContent = '';
          d.box.querySelector('.hst-pin-msg').textContent = tr('أعد كتابة نفس الرمز للتأكيد', 'Re-enter the same PIN to confirm');
          clearDigits(inputs);
          return;
        }
        if (val !== firstPin) {
          errorEl.textContent = tr('الرمزان غير متطابقين، حاول من جديد', "PINs don't match, try again");
          step = 1;
          firstPin = '';
          d.box.querySelector('.hst-pin-msg').textContent = tr(
            'اختر رمز PIN من 6 أرقام. هذا الرمز يخوّلك استرجاع رسائلك القديمة لو غيّرت جهازك أو مسحت بيانات المتصفح — احتفظ فيه، ما فيه طريقة لاسترجاعه بدونه.',
            'Choose a 6-digit PIN. It lets you recover your message history if you switch devices or clear your browser data — keep it safe, there is no way to recover it without this PIN.'
          );
          clearDigits(inputs);
          return;
        }
        okBtn.disabled = true; skipBtn.disabled = true;
        errorEl.textContent = '';
        try {
          await window.HostakaCrypto.setupPin(val);
          close(d.overlay);
          resolve(true);
        } catch (e) {
          errorEl.textContent = e.message || tr('تعذر الحفظ، حاول مرة أخرى', 'Failed to save, try again');
          okBtn.disabled = false; skipBtn.disabled = false;
        }
      }
      okBtn.onclick = submit;
      digitsWrap.addEventListener('hst-pin-submit', submit);
      setTimeout(function () { inputs[0].focus(); }, 60);
    });
  }

  function runUnlockFlow(initialLocked, initialLockedUntil) {
    return new Promise(function (resolve) {
      var d = buildBase(
        '🔒',
        tr('أدخل رمز PIN', 'Enter your PIN'),
        tr(
          'هذه جلسة/جهاز جديد. أدخل رمز الـ PIN المكون من 6 أرقام لاسترجاع رسائلك القديمة والجديدة.',
          'This is a new session/device. Enter your 6-digit PIN to unlock your old and new messages.'
        )
      );
      var digitsWrap = document.createElement('div');
      digitsWrap.className = 'hst-pin-digits';
      d.box.appendChild(digitsWrap);
      var inputs = buildDigitInputs(digitsWrap);

      var errorEl = document.createElement('div');
      errorEl.className = 'hst-pin-error';
      d.box.appendChild(errorEl);

      var actions = document.createElement('div');
      actions.className = 'hst-pin-actions';
      var skipBtn = document.createElement('button');
      skipBtn.className = 'hst-pin-btn hst-pin-btn-cancel';
      skipBtn.textContent = tr('لاحقاً', 'Later');
      var okBtn = document.createElement('button');
      okBtn.className = 'hst-pin-btn hst-pin-btn-ok';
      okBtn.textContent = tr('فتح', 'Unlock');
      if (isRTL()) { actions.appendChild(okBtn); actions.appendChild(skipBtn); }
      else { actions.appendChild(skipBtn); actions.appendChild(okBtn); }
      d.box.appendChild(actions);

      skipBtn.onclick = function () { close(d.overlay); resolve(false); };

      function applyLock(lockedUntil) {
        inputs.forEach(function (i) { i.disabled = true; });
        okBtn.disabled = true;
        var untilTxt = '';
        try { untilTxt = new Date(lockedUntil.replace(' ', 'T') + 'Z').toLocaleTimeString(); } catch (e) {}
        errorEl.textContent = tr(
          'تم تجاوز عدد المحاولات المسموحة' + (untilTxt ? ('، حاول بعد ' + untilTxt) : '، حاول لاحقاً'),
          'Too many attempts' + (untilTxt ? (', try again after ' + untilTxt) : ', try again later')
        );
      }
      if (initialLocked) applyLock(initialLockedUntil);

      async function submit() {
        var val = readDigits(inputs);
        if (!/^\d{6}$/.test(val)) {
          errorEl.textContent = tr('أدخل 6 أرقام', 'Enter 6 digits');
          return;
        }
        okBtn.disabled = true; skipBtn.disabled = true;
        errorEl.textContent = '';
        try {
          var ok = await window.HostakaCrypto.unlockWithPin(val);
          if (ok) {
            close(d.overlay);
            resolve(true);
            return;
          }
          errorEl.textContent = tr('رمز PIN غير صحيح', 'Incorrect PIN');
          clearDigits(inputs);
          okBtn.disabled = false; skipBtn.disabled = false;
        } catch (e) {
          if (e.locked) { applyLock(e.lockedUntil || new Date(Date.now() + 15 * 60000).toISOString()); }
          else { errorEl.textContent = e.message || tr('حدث خطأ، حاول مرة أخرى', 'Something went wrong, try again'); }
          okBtn.disabled = false; skipBtn.disabled = false;
        }
      }
      okBtn.onclick = submit;
      digitsWrap.addEventListener('hst-pin-submit', submit);
      setTimeout(function () { if (!initialLocked) inputs[0].focus(); }, 60);
    });
  }

  var _inflight = null;
  async function ensureUnlockedImpl() {
    if (!window.HostakaCrypto) return false;
    var status = await window.HostakaCrypto.getIdentityStatus();
    var ok = false;
    if (status.status === 'ready') {
      ok = true;
    } else if (status.status === 'needs_setup') {
      ok = await runSetupFlow();
    } else if (status.status === 'needs_unlock') {
      ok = await runUnlockFlow(status.locked, status.lockedUntil);
    }
    if (ok) window.dispatchEvent(new CustomEvent('hostaka:identity-unlocked'));
    return ok;
  }

  window.HostakaPinModal = {
    // Shows the setup/unlock modal only if actually needed; safe to call
    // on every page load. Concurrent calls share the same in-flight modal
    // instead of stacking multiple dialogs on top of each other.
    ensureUnlocked: function () {
      if (_inflight) return _inflight;
      _inflight = ensureUnlockedImpl().finally(function () { _inflight = null; });
      return _inflight;
    },
  };
})();
