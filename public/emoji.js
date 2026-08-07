/*
 * emoji.js — حزمة إيموجي Fluent Emoji (مايكروسوفت)
 * المصدر: https://github.com/microsoft/fluentui-emoji (رخصة MIT)
 * الصور تُحمَّل مباشرة من نسخة الريبو على jsDelivr (CDN عام لمستودعات GitHub)
 * بدل تضمين آلاف الملفات داخل المشروع، لتفادي تضخيم حجم النشر.
 * قائمة الإيموجي (الاسم/التصنيف/الكلمات المفتاحية) موجودة محلياً بملف
 * emoji-catalog.json المولّد من نفس المستودع (metadata.json لكل إيموجي).
 * ------------------------------------------------------------
 * الاستخدام:
 *   EmojiFluent.render(htmlOrText)   → يستبدل رموز الإيموجي بصور <img> صغيرة متسقة الشكل
 *   EmojiFluent.attachButton(btn, target) → يربط زر بمنتقي إيموجي يُدرج بـ target
 *     (target يقبل <textarea>/<input> عادي أو عنصر contenteditable)
 */
(function (global) {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/';
  const CATALOG_URL = '/emoji-catalog.json';

  let catalog = null;         // مصفوفة كل الإيموجي
  let catalogPromise = null;  // وعد تحميل القائمة (مرة واحدة فقط)
  let glyphRegex = null;      // Regex لاكتشاف الرموز داخل النص
  let glyphToEntry = null;    // خريطة: رمز الإيموجي → بيانات الإيموجي

  function assetUrl(relPath) {
    // ترميز كل جزء من المسار على حدة (أسماء المجلدات فيها مسافات)
    return CDN_BASE + relPath.replace('assets/', '').split('/').map(encodeURIComponent).join('/');
  }

  async function loadCatalog() {
    if (catalog) return catalog;
    if (!catalogPromise) {
      catalogPromise = fetch(CATALOG_URL).then(r => r.json()).then(data => {
        catalog = data;
        glyphToEntry = new Map();
        for (const e of data) glyphToEntry.set(e.glyph, e);
        // فرز الرموز من الأطول للأقصر لضمان تطابق التسلسلات المركّبة أولاً
        const glyphs = data.map(e => e.glyph).sort((a, b) => b.length - a.length);
        const escaped = glyphs.map(g => g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        glyphRegex = new RegExp(escaped.join('|'), 'gu');
        return catalog;
      }).catch(err => {
        console.warn('EmojiFluent: تعذر تحميل قائمة الإيموجي', err);
        catalog = [];
        glyphToEntry = new Map();
        glyphRegex = null;
        return catalog;
      });
    }
    return catalogPromise;
  }

  // يستبدل رموز يونيكود للإيموجي داخل نص/HTML بصور <img> صغيرة (نمط Fluent Color)
  // ملاحظة: يعمل بأمان على نص تم تجهيزه بالفعل (escaped) أو HTML جاهز، لأن رموز
  // الإيموجي نفسها لا تحتوي أبداً على < > & ' " فلا خطر من كسر الوسوم المحيطة.
  function render(html) {
    if (!html) return html;
    if (!glyphRegex) return html; // لم تُحمَّل القائمة بعد؛ سيُعاد العرض لاحقاً عند الحاجة
    return String(html).replace(glyphRegex, (m) => {
      const entry = glyphToEntry.get(m);
      if (!entry || !entry.color) return m;
      const src = assetUrl(entry.color);
      return `<img src="${src}" alt="${m}" title="${entry.name || ''}" class="femoji" loading="lazy" draggable="false">`;
    });
  }

  // يبدأ تحميل القائمة فوراً عند إدراج السكربت كي تكون جاهزة بأقرب وقت
  loadCatalog();

  // ============================================================
  // منتقي الإيموجي (Picker UI)
  // ============================================================
  let panelEl = null;
  let activeTarget = null;
  let activeOnPick = null;

  function ensurePanel() {
    if (panelEl) return panelEl;
    panelEl = document.createElement('div');
    panelEl.className = 'femoji-picker';
    panelEl.innerHTML = `
      <div class="femoji-picker-search">
        <input type="text" placeholder="بحث..." class="femoji-search-input">
      </div>
      <div class="femoji-picker-tabs"></div>
      <div class="femoji-picker-grid"></div>
    `;
    document.body.appendChild(panelEl);
    panelEl.querySelector('.femoji-search-input').addEventListener('input', (e) => {
      renderGrid({ search: e.target.value });
    });
    document.addEventListener('mousedown', (e) => {
      if (panelEl && panelEl.classList.contains('show') && !panelEl.contains(e.target) && e.target !== activeAnchorEl) {
        closePanel();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panelEl.classList.contains('show')) closePanel();
    });
    return panelEl;
  }

  const GROUP_LABELS = {
    'Smileys & Emotion': '😀 وجوه',
    'People & Body': '🧑 أشخاص',
    'Animals & Nature': '🐾 طبيعة',
    'Food & Drink': '🍔 طعام',
    'Activities': '⚽ أنشطة',
    'Travel & Places': '✈️ سفر',
    'Objects': '💡 أدوات',
    'Symbols': '🔣 رموز',
    'Flags': '🚩 أعلام'
  };
  const GROUP_ORDER = Object.keys(GROUP_LABELS);
  let currentGroup = GROUP_ORDER[0];
  let activeAnchorEl = null;

  function renderTabs() {
    const tabsEl = panelEl.querySelector('.femoji-picker-tabs');
    tabsEl.innerHTML = GROUP_ORDER.map(g =>
      `<button type="button" class="femoji-tab ${g === currentGroup ? 'active' : ''}" data-group="${g}" title="${g}">${GROUP_LABELS[g].split(' ')[0]}</button>`
    ).join('');
    tabsEl.querySelectorAll('.femoji-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        currentGroup = btn.getAttribute('data-group');
        panelEl.querySelector('.femoji-search-input').value = '';
        renderTabs();
        renderGrid({});
      });
    });
  }

  function renderGrid({ search }) {
    const gridEl = panelEl.querySelector('.femoji-picker-grid');
    if (!catalog) {
      gridEl.innerHTML = `<div class="femoji-empty">...جارِ التحميل</div>`;
      return;
    }
    let list;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = catalog.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.keywords || []).some(k => k.toLowerCase().includes(q))
      ).slice(0, 200);
    } else {
      list = catalog.filter(e => e.group === currentGroup);
    }
    if (!list.length) {
      gridEl.innerHTML = `<div class="femoji-empty">لا توجد نتائج</div>`;
      return;
    }
    gridEl.innerHTML = list.map(e =>
      `<button type="button" class="femoji-item" data-glyph="${e.glyph}" title="${e.name || ''}">
        <img src="${assetUrl(e.color)}" alt="${e.glyph}" loading="lazy" draggable="false">
      </button>`
    ).join('');
    gridEl.querySelectorAll('.femoji-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const glyph = btn.getAttribute('data-glyph');
        if (activeOnPick) activeOnPick(glyph);
        closePanel();
      });
    });
  }

  function openPicker(anchorEl, onPick) {
    ensurePanel();
    activeOnPick = onPick;
    activeAnchorEl = anchorEl;
    loadCatalog().then(() => renderGrid({}));
    renderTabs();
    renderGrid({});
    panelEl.classList.add('show');
    positionPanel(anchorEl);
    setTimeout(() => panelEl.querySelector('.femoji-search-input')?.focus(), 30);
  }

  function positionPanel(anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const panelW = 300, panelH = 360;
    let top = rect.bottom + 8;
    let left = rect.left;
    if (top + panelH > window.innerHeight) top = Math.max(8, rect.top - panelH - 8);
    if (left + panelW > window.innerWidth) left = window.innerWidth - panelW - 12;
    panelEl.style.top = `${top + window.scrollY}px`;
    panelEl.style.left = `${Math.max(8, left) + window.scrollX}px`;
  }

  function closePanel() {
    if (panelEl) panelEl.classList.remove('show');
    activeOnPick = null;
    activeAnchorEl = null;
  }

  // يُدرج الرمز داخل عنصر إدخال عادي (textarea/input) أو عنصر contenteditable
  function insertGlyph(target, glyph) {
    if (!target) return;
    const isEditable = target.isContentEditable;
    if (isEditable) {
      target.focus();
      const ok = document.execCommand && document.execCommand('insertText', false, glyph);
      if (!ok) target.textContent += glyph;
    } else {
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? target.value.length;
      const val = target.value || '';
      target.value = val.slice(0, start) + glyph + val.slice(end);
      const pos = start + glyph.length;
      target.selectionStart = target.selectionEnd = pos;
      target.focus();
    }
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function attachButton(buttonEl, target) {
    if (!buttonEl || !target) return;
    buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPicker(buttonEl, (glyph) => insertGlyph(target, glyph));
    });
  }

  global.EmojiFluent = { render, openPicker, attachButton, insertGlyph, loadCatalog };
})(window);
