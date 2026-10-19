// ============================================================
//  Hostaka Player — video.js integration.
//
//  - Loads video.js + its base CSS only when a player is needed
//    (pages with no videos never download ~700 KB).
//  - Boots players lazily when they approach the viewport.
//  - Disposes players when their DOM nodes are removed, so feed
//    re-renders don't leak video.js instances.
//  - The look is defined in hostaka-player.css and follows the
//    platform theme through CSS variables.
//
//  Usage: <video class="video-js vjs-hostaka" controls ...>
// ============================================================
(function () {
  'use strict';

  var VJS_BASE = '/vendor/videojs/';
  var loading = null;
  var booting = typeof WeakSet === 'function' ? new WeakSet() : null;

  function ensureVideoJs() {
    if (window.videojs) return Promise.resolve(window.videojs);
    if (loading) return loading;

    loading = new Promise(function (resolve, reject) {
      // Put video.js's base stylesheet *before* our skin so the
      // cascade is predictable even on browsers without :where().
      if (!document.querySelector('link[data-hostaka-vjs]')) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = VJS_BASE + 'video-js.min.css';
        css.setAttribute('data-hostaka-vjs', '');
        var ours = document.querySelector('link[href*="hostaka-player.css"]');
        if (ours && ours.parentNode) ours.parentNode.insertBefore(css, ours);
        else document.head.appendChild(css);
      }

      var script = document.createElement('script');
      script.src = VJS_BASE + 'video.min.js';
      script.async = true;
      script.onload = function () {
        if (window.videojs) resolve(window.videojs);
        else reject(new Error('video.js did not register'));
      };
      script.onerror = function () {
        reject(new Error('video.js failed to load'));
      };
      document.head.appendChild(script);
    });

    return loading;
  }

  function isHostakaVideo(el) {
    return !!el && el.nodeType === 1 && el.tagName === 'VIDEO' &&
      el.classList.contains('vjs-hostaka');
  }

  function boot(el) {
    if (!isHostakaVideo(el)) return;
    if (el.classList.contains('vjs-booted')) return;
    if (booting && booting.has(el)) return;
    if (booting) booting.add(el);

    ensureVideoJs().then(function (videojs) {
      if (booting) booting.delete(el);
      if (!document.documentElement.contains(el)) return;
      if (el.classList.contains('vjs-booted')) return;

      try {
        var player = videojs(el, {
          fluid: true,
          responsive: true,
          preload: el.getAttribute('preload') || 'metadata',
          autoplay: el.hasAttribute('autoplay'),
          controlBar: {
            pictureInPictureToggle: true,
            remainingTimeDisplay: false
          }
        });
        el.classList.add('vjs-booted');

        // video.js moves our classes onto a wrapper <div> and turns the
        // original <video> into .vjs-tech. Mark the wrapper so removed
        // players can be disposed when the feed re-renders.
        var root = player && typeof player.el === 'function' ? player.el() : null;
        if (root) {
          root.setAttribute('data-hostaka-mounted', '');
          root.__hostakaPlayer = player;
        }
      } catch (e) {
        el.classList.remove('vjs-booted');
      }
    }).catch(function () {
      if (booting) booting.delete(el);
      // Keep the native `controls` attribute as a graceful fallback.
      el.classList.remove('vjs-booted');
    });
  }

  function disposeRoot(root) {
    if (!root || !root.hasAttribute || !root.hasAttribute('data-hostaka-mounted')) return;
    try {
      var player = root.__hostakaPlayer ||
        (window.videojs && typeof window.videojs.getPlayer === 'function'
          ? window.videojs.getPlayer(root)
          : null);
      if (player && typeof player.dispose === 'function') player.dispose();
    } catch (e) { /* already disposed */ }
  }

  var io = null;
  if (typeof IntersectionObserver === 'function') {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        boot(entry.target);
      });
    }, { rootMargin: '400px 0px' });
  }

  function watch(el) {
    if (!isHostakaVideo(el)) return;
    if (el.classList.contains('vjs-booted')) return;
    if (el.player) return;
    if (io) io.observe(el);
    else boot(el);
  }

  function scan(root) {
    (root || document).querySelectorAll('video.vjs-hostaka').forEach(watch);
  }

  function handleAdded(node) {
    if (!node || node.nodeType !== 1) return;
    // Ignore the many nodes video.js itself adds inside a mounted player.
    if (node.closest && node.closest('[data-hostaka-mounted]')) return;
    if (isHostakaVideo(node)) watch(node);
    if (node.querySelectorAll) {
      node.querySelectorAll('video.vjs-hostaka').forEach(watch);
    }
  }

  function handleRemoved(node) {
    if (!node || node.nodeType !== 1) return;
    // video.js moves the <video> into its own wrapper, which fires a
    // "removed" mutation even though the node is still in the document.
    if (document.documentElement.contains(node)) return;
    if (node.matches && node.matches('[data-hostaka-mounted]')) disposeRoot(node);
    if (node.querySelectorAll) {
      node.querySelectorAll('[data-hostaka-mounted]').forEach(disposeRoot);
    }
  }

  function start() {
    scan(document);
    if (typeof MutationObserver !== 'function' || !document.body) return;
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes) m.addedNodes.forEach(handleAdded);
        if (m.removedNodes) m.removedNodes.forEach(handleRemoved);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.HostakaPlayer = {
    refresh: scan,
    boot: boot,
    ensure: ensureVideoJs
  };
})();
