/*
 * Hostaka i18n system.
 *
 * Translations are fetched from /translations/en.json and /translations/ar.json
 * (JSON is always decoded as UTF-8 by the Fetch API regardless of server
 * headers, which is the safest way to ship Arabic/English text reliably
 * across all browsers/WebViews — unlike embedding raw non-ASCII text
 * directly inside a .js file, where a handful of older/non-standard
 * WebViews can misinterpret the file's encoding and corrupt it).
 *
 * To avoid ever showing a raw "namespace.key" string while the network
 * request is in flight (or on a slow/flaky connection), this file:
 *   1) Applies a cached copy from localStorage INSTANTLY, synchronously,
 *      before any network request even starts (if we have one saved from
 *      a previous visit).
 *   2) Always still fetches a fresh copy in the background and re-applies
 *      once it arrives, keeping the cache up to date for next time.
 *   3) If neither cache nor network is available yet, every data-i18n
 *      element keeps whatever readable fallback text is already written
 *      in the HTML (e.g. "Chat settings") instead of ever showing the key.
 */
(function () {
  var dict = { en: null, ar: null };
  var loaded = { en: false, ar: false };

  function getLang() {
    var saved = localStorage.getItem('hostaka_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  }
  var lang = getLang();
  window.currentLang = lang;

  function t(key, fallback) {
    var parts = key.split('.');
    function lookup(d) {
      var node = d;
      for (var i = 0; i < parts.length; i++) {
        if (node && typeof node === 'object' && parts[i] in node) node = node[parts[i]];
        else return undefined;
      }
      return typeof node === 'string' ? node : undefined;
    }
    var v = dict[lang] ? lookup(dict[lang]) : undefined;
    if (v === undefined && lang !== 'en' && dict.en) v = lookup(dict.en);
    if (v !== undefined) return v;
    return fallback !== undefined ? fallback : key;
  }
  window.t = t;

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (el.dataset.i18nFallback === undefined) el.dataset.i18nFallback = el.textContent;
      el.textContent = t(key, el.dataset.i18nFallback);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (el.dataset.i18nPlaceholderFallback === undefined) el.dataset.i18nPlaceholderFallback = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', t(key, el.dataset.i18nPlaceholderFallback));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (el.dataset.i18nTitleFallback === undefined) el.dataset.i18nTitleFallback = el.getAttribute('title') || '';
      el.setAttribute('title', t(key, el.dataset.i18nTitleFallback));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (el.dataset.i18nAriaFallback === undefined) el.dataset.i18nAriaFallback = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', t(key, el.dataset.i18nAriaFallback));
    });
  }
  window.applyTranslations = applyTranslations;

  function applyDocumentDirection() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function applyWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { applyTranslations(); });
    } else {
      applyTranslations();
    }
  }

  function loadLang(l) {
    if (loaded[l]) return Promise.resolve();
    try {
      var cached = localStorage.getItem('hostaka_i18n_cache_' + l);
      if (cached) { dict[l] = JSON.parse(cached); loaded[l] = true; }
    } catch (e) {}
    return fetch('/translations/' + l + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (json) {
        if (json) {
          dict[l] = json;
          try { localStorage.setItem('hostaka_i18n_cache_' + l, JSON.stringify(json)); } catch (e) {}
        }
        loaded[l] = true;
      })
      .catch(function () { loaded[l] = true; });
  }

  applyDocumentDirection();

  var enPromise = loadLang('en');
  var langPromise = lang !== 'en' ? loadLang(lang) : Promise.resolve();

  // Apply immediately if a cached copy was available synchronously above.
  if (loaded.en && (lang === 'en' || loaded[lang])) applyWhenReady();

  // Re-apply once the network response arrives (covers first-ever visit,
  // and keeps things fresh if translations changed since the cache was set).
  Promise.all([enPromise, langPromise]).then(applyWhenReady);

  window.setHostakaLang = function (newLang) {
    if (newLang !== 'en' && newLang !== 'ar') return;
    lang = newLang;
    window.currentLang = newLang;
    localStorage.setItem('hostaka_lang', newLang);
    applyDocumentDirection();
    Promise.all([loadLang('en'), loadLang(newLang)]).then(function () {
      applyTranslations();
      document.dispatchEvent(new CustomEvent('hostaka:langchange', { detail: { lang: newLang } }));
    });
  };
})();
