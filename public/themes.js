/*
 * Hostaka — نظام "الثيمات" (20 نمط صناعي/Switchboard).
 * يُحمَّل في كل صفحة بعد سكربت الصفحة نفسها (index.js, profile.js, ...)
 * حتى يبقى هو المرجع الأخير لقيمة data-theme، لأن بعض السكربتات القديمة
 * لسا تفترض إما 'light' وإما 'dark' فقط وتمسح أي قيمة data-theme أخرى.
 *
 * الاستخدام:
 *   window.setHostakaTheme('night');   // تطبيق + حفظ + مزامنة مع الخادم
 *   window.openThemesPicker();         // فتح نافذة اختيار الثيمات الـ20
 */
(function () {
  var THEMES = [
    { id: 'brass',         ar: 'نحاسي',         en: 'Brass',          swatch: '#C1904E' },
    { id: 'night',         ar: 'إشارة الليل',    en: 'Night Signal',   swatch: '#5FC9D6' },
    { id: 'field',         ar: 'راديو الميدان',  en: 'Field Radio',    swatch: '#C9A227' },
    { id: 'crimson-line',  ar: 'خط قرمزي',       en: 'Crimson Line',   swatch: '#C1443A' },
    { id: 'verdigris',     ar: 'صدأ نحاسي',      en: 'Verdigris',      swatch: '#4E9C86' },
    { id: 'slate-wire',    ar: 'سلك إردوازي',    en: 'Slate Wire',     swatch: '#7C93B0' },
    { id: 'ember',         ar: 'جمرة',           en: 'Ember',          swatch: '#D97B3F' },
    { id: 'arctic-signal', ar: 'إشارة قطبية',    en: 'Arctic Signal',  swatch: '#7FD9E8' },
    { id: 'rust-belt',     ar: 'حزام الصدأ',     en: 'Rust Belt',      swatch: '#B5602E' },
    { id: 'moss-relay',    ar: 'مرحّل الطحلب',   en: 'Moss Relay',     swatch: '#8FA05B' },
    { id: 'plum-circuit',  ar: 'دارة الخوخ',     en: 'Plum Circuit',   swatch: '#9B6FB0' },
    { id: 'graphite',      ar: 'غرافيت',         en: 'Graphite',       swatch: '#8FA3A8' },
    { id: 'indigo-dial',   ar: 'قرص نيلي',       en: 'Indigo Dial',    swatch: '#6C7FD6' },
    { id: 'cobalt-patch',  ar: 'رقعة الكوبالت',  en: 'Cobalt Patch',   swatch: '#4D7FC4' },
    { id: 'copper-dusk',   ar: 'نحاس الغسق',     en: 'Copper Dusk',    swatch: '#C97A8E' },
    { id: 'pine-signal',   ar: 'إشارة الصنوبر',  en: 'Pine Signal',    swatch: '#4E8B5C' },
    { id: 'desert-line',   ar: 'خط الصحراء',     en: 'Desert Line',    swatch: '#3FA6A0' },
    { id: 'ink-well',      ar: 'محبرة',          en: 'Ink Well',       swatch: '#9AA5B8' },
    { id: 'amber-grid',    ar: 'شبكة العنبر',    en: 'Amber Grid',     swatch: '#E0A93D' },
    { id: 'sandstorm',     ar: 'عاصفة رملية',    en: 'Sandstorm',      swatch: '#D68A4E' }
  ];
  window.HOSTAKA_THEMES = THEMES;

  var STORAGE_KEY = 'hostaka_theme';

  function isRTL() {
    return (document.documentElement.getAttribute('dir') || 'ltr') === 'rtl' ||
           window.currentLang === 'ar' || !window.currentLang;
  }
  function label(t) { return isRTL() ? t.ar : t.en; }

  function apply(themeId, opts) {
    opts = opts || {};
    var html = document.documentElement;
    if (themeId && themeId !== 'light') {
      html.setAttribute('data-theme', themeId);
    } else {
      html.removeAttribute('data-theme');
    }
    try { localStorage.setItem(STORAGE_KEY, themeId || 'light'); } catch (e) {}
    if (!opts.silent) {
      document.querySelectorAll('.hst-theme-swatch').forEach(function (b) {
        b.classList.toggle('active', b.dataset.themeId === themeId);
      });
    }
  }

  window.setHostakaTheme = function (themeId) {
    apply(themeId);
    // مزامنة مع الحساب إن كان المستخدم مسجّل دخول — فشل الطلب لا يهم بصريًا
    // لأن التطبيق المحلي (localStorage) هو المصدر الفوري على هذا الجهاز.
    try {
      fetch('/api/account/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ theme: themeId })
      }).catch(function () {});
    } catch (e) {}
  };

  // إعادة تطبيق القيمة المحفوظة بعد أن ينتهي سكربت الصفحة من عمله — هذا هو
  // سبب وجود هذا الملف كسكربت منفصل يُحمَّل أخيراً (راجع تعليق الرأس).
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) apply(saved, { silent: true });
  } catch (e) {}

  // ---------- نافذة اختيار الثيم ----------
  var STYLE_ID = 'hst-themes-style';
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.hst-themes-overlay{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);' +
      'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;' +
      'justify-content:center;padding:20px;opacity:0;transition:opacity .15s ease;font-family:var(--font-family);}' +
      '.hst-themes-overlay.show{opacity:1;}' +
      '.hst-themes-box{background:var(--card);color:var(--text);border:1px solid var(--border);' +
      'border-radius:var(--radius-lg,16px);width:100%;max-width:420px;max-height:80vh;overflow-y:auto;' +
      'padding:20px 18px;box-shadow:0 20px 50px rgba(0,0,0,.45);transform:translateY(10px) scale(.97);' +
      'transition:transform .15s ease;}' +
      '.hst-themes-overlay.show .hst-themes-box{transform:translateY(0) scale(1);}' +
      '.hst-themes-title{font-size:1.02rem;font-weight:700;margin:0 0 4px;}' +
      '.hst-themes-sub{font-size:.8rem;color:var(--muted);margin:0 0 16px;}' +
      '.hst-themes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:10px;}' +
      '.hst-theme-swatch{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;' +
      'border:none;padding:8px 4px;border-radius:10px;cursor:pointer;color:var(--text);}' +
      '.hst-theme-swatch:hover{background:var(--primary-light);}' +
      '.hst-theme-swatch .dot{width:34px;height:34px;border-radius:50%;border:2px solid transparent;' +
      'box-shadow:0 0 0 1px var(--border) inset;}' +
      '.hst-theme-swatch.active .dot{border-color:var(--text);}' +
      '.hst-theme-swatch span{font-size:.68rem;text-align:center;line-height:1.2;color:var(--muted);}' +
      '.hst-themes-close{position:absolute;top:14px;inset-inline-end:14px;background:none;border:none;' +
      'color:var(--muted);font-size:1.1rem;cursor:pointer;line-height:1;}';
    document.head.appendChild(style);
  }

  window.openThemesPicker = function () {
    ensureStyles();
    var current = (function () { try { return localStorage.getItem(STORAGE_KEY) || 'brass'; } catch (e) { return 'brass'; } })();

    var overlay = document.createElement('div');
    overlay.className = 'hst-themes-overlay';
    overlay.style.position = 'fixed';

    var box = document.createElement('div');
    box.className = 'hst-themes-box';
    box.style.position = 'relative';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'hst-themes-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = close;

    var title = document.createElement('div');
    title.className = 'hst-themes-title';
    title.textContent = isRTL() ? 'الثيمات' : 'Themes';

    var sub = document.createElement('div');
    sub.className = 'hst-themes-sub';
    sub.textContent = isRTL() ? '20 نمطًا صناعيًا — يُطبَّق فورًا على كل المنصة' : '20 industrial finishes — applied instantly across the platform';

    var grid = document.createElement('div');
    grid.className = 'hst-themes-grid';

    THEMES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'hst-theme-swatch' + (t.id === current ? ' active' : '');
      btn.dataset.themeId = t.id;
      btn.type = 'button';
      var dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.background = t.swatch;
      var span = document.createElement('span');
      span.textContent = label(t);
      btn.appendChild(dot);
      btn.appendChild(span);
      btn.onclick = function () { window.setHostakaTheme(t.id); };
      grid.appendChild(btn);
    });

    box.appendChild(closeBtn);
    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(grid);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 150);
    }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
    requestAnimationFrame(function () { overlay.classList.add('show'); });
  };
})();
