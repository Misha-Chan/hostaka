/* =========================================================================
   Hostaka i18n — shared translation loader
   - Single source of truth for language across every page (replaces the
     5 duplicated LANG/currentLang/t() blocks previously copy-pasted inside
     script.js's per-page IIFEs).
   - Default language: English (per spec). Falls back to Arabic only if the
     visitor has explicitly picked it before (stored in localStorage under
     the SAME key script.js already uses: `hostaka_lang`, so both systems
     stay in sync).
   - Loads BEFORE script.js and BEFORE first paint (non-deferred, placed
     early in <head>) so there is no flash of the wrong language/direction.
   ========================================================================= */
(function () {
  var SUPPORTED = ['en', 'ar', 'fr', 'ru', 'zh', 'ja'];
  var RTL_LANGS = ['ar'];

  var stored = null;
  try { stored = localStorage.getItem('hostaka_lang'); } catch (e) {}
  var lang = SUPPORTED.indexOf(stored) !== -1 ? stored : 'en';

  window.currentLang = lang; // kept for compatibility with existing script.js code
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.indexOf(lang) !== -1 ? 'rtl' : 'ltr';

  var dict = { en: {}, ar: {} };
  var loaded = { en: false, ar: false };

  function deepGet(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  // Public translation function: t('common.cancel')
  window.t = function (key, fallback) {
    var val = deepGet(dict[window.currentLang], key);
    if (val === undefined) val = deepGet(dict.en, key);
    if (val === undefined) val = deepGet(dict.ar, key);
    return val !== undefined ? val : (fallback !== undefined ? fallback : key);
  };

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = window.t(key);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', window.t(el.getAttribute('data-i18n-placeholder')));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', window.t(el.getAttribute('data-i18n-title')));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      el.setAttribute('aria-label', window.t(el.getAttribute('data-i18n-aria-label')));
    });
  }
  window.applyTranslations = applyTranslations;

  // Switch language at runtime; keeps localStorage key in sync with the
  // existing per-page script.js `setLang`/`currentLang` implementations.
  window.setHostakaLang = function (newLang) {
    if (SUPPORTED.indexOf(newLang) === -1) return;
    window.currentLang = newLang;
    try { localStorage.setItem('hostaka_lang', newLang); } catch (e) {}
    document.documentElement.lang = newLang;
    document.documentElement.dir = RTL_LANGS.indexOf(newLang) !== -1 ? 'rtl' : 'ltr';
    applyTranslations();
    document.dispatchEvent(new CustomEvent('hostaka:langchange', { detail: { lang: newLang } }));
  };

  function loadLang(l) {
    if (loaded[l]) return Promise.resolve();
    return fetch('/translations/' + l + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (json) { dict[l] = json; loaded[l] = true; })
      .catch(function () { dict[l] = dict[l] || {}; loaded[l] = true; });
  }

  // Always load English (fallback) + the active language, then apply.
  Promise.all([loadLang('en'), lang !== 'en' ? loadLang(lang) : Promise.resolve()])
    .then(function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { applyTranslations(); });
      } else {
        applyTranslations();
      }
    });
})();
