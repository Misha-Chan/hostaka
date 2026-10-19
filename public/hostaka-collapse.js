// ============================================================
//  Hostaka — collapsible post text.
//
//  Long post bodies are clamped to a few lines (see shared.css) and
//  get a "Show more / Show less" button. The clamp class is added by
//  JS only, so visitors without JavaScript still see the full text.
//
//  Usage: <div class="post-text" data-collapse>...</div>
// ============================================================
(function () {
  'use strict';

  var SELECTOR = '[data-collapse]';
  var TOLERANCE = 2;

  function isArabic() {
    return (window.currentLang || document.documentElement.lang) === 'ar';
  }

  // Each page overrides window.t with its own flat dictionary, so the
  // button is translated through the global i18n system (data-i18n +
  // applyTranslations), with a readable hardcoded fallback.
  function setLabel(btn, expanded) {
    btn.setAttribute('data-i18n', expanded ? 'common.showLess' : 'common.showMore');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded
      ? (isArabic() ? 'عرض أقل' : 'Show less')
      : (isArabic() ? 'عرض المزيد' : 'Show more');
    btn.dataset.i18nFallback = btn.textContent;
    if (typeof window.applyTranslations === 'function') {
      try { window.applyTranslations(btn.parentElement || btn); } catch (e) {}
    }
  }

  function makeButton(el) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'post-more-btn';
    setLabel(btn, false);

    btn.addEventListener('click', function (e) {
      // The feed wraps the whole post in a click-to-open handler.
      e.preventDefault();
      e.stopPropagation();

      var expanded = !el.classList.contains('is-expanded');
      el.classList.toggle('is-expanded', expanded);
      el.classList.toggle('is-collapsed', !expanded);
      setLabel(btn, expanded);
    });

    return btn;
  }

  function buttonAfter(el) {
    var next = el.nextElementSibling;
    return next && next.classList.contains('post-more-btn') ? next : null;
  }

  function process(el) {
    if (!el.isConnected) return;
    if (!el.classList.contains('post-collapse')) el.classList.add('post-collapse');

    // The reader already chose to expand it — keep it open.
    if (el.classList.contains('is-expanded')) return;

    // Inside a hidden container there is nothing to measure yet. The
    // ResizeObserver will call us again once it gets a real size.
    if (el.clientHeight === 0 && el.scrollHeight === 0) return;

    var overflows = (el.scrollHeight - el.clientHeight) > TOLERANCE;
    var btn = buttonAfter(el);

    if (overflows) {
      el.classList.add('is-collapsed');
      if (!btn) {
        var button = makeButton(el);
        if (el.parentNode) el.parentNode.insertBefore(button, el.nextSibling);
      }
    } else {
      el.classList.remove('is-collapsed');
      if (btn) btn.remove();
    }

    // Inline images can change the height after they finish loading.
    el.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) {
        img.addEventListener('load', function () { process(el); }, { once: true });
      }
    });
  }

  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var ro = null;

  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) { process(entry.target); });
    });
  }

  function watch(el) {
    if (!el || el.nodeType !== 1) return;
    if (seen) {
      if (seen.has(el)) return;
      seen.add(el);
    }
    if (ro) ro.observe(el);
    process(el);
  }

  function forget(el) {
    if (!el || el.nodeType !== 1) return;
    if (ro) ro.unobserve(el);
    if (seen) seen.delete(el);
  }

  function scan(root) {
    (root || document).querySelectorAll(SELECTOR).forEach(watch);
  }

  function start() {
    scan(document);

    if (typeof MutationObserver === 'function' && document.body) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (!node || node.nodeType !== 1) return;
            if (node.matches && node.matches(SELECTOR)) watch(node);
            if (node.querySelectorAll) node.querySelectorAll(SELECTOR).forEach(watch);
          });
          // Feed refreshes replace whole cards — stop observing the old
          // nodes so they can be garbage-collected.
          m.removedNodes.forEach(function (node) {
            if (!node || node.nodeType !== 1) return;
            if (node.matches && node.matches(SELECTOR)) forget(node);
            if (node.querySelectorAll) node.querySelectorAll(SELECTOR).forEach(forget);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }

    // Fallback for browsers without ResizeObserver.
    if (!ro) {
      var timer = null;
      window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { scan(document); }, 200);
      });
    }

    document.addEventListener('hostaka:langchange', function () {
      document.querySelectorAll('.post-more-btn').forEach(function (btn) {
        setLabel(btn, btn.getAttribute('aria-expanded') === 'true');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.HostakaCollapse = { refresh: scan };
})();
