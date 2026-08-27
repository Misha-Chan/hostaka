// ============================================================
// ecosystem-switcher.js — floating "switch service" button + panel,
// shared identically across every Hostaka Ecosystem subdomain so
// people can jump between services without typing a new URL (same
// idea as Google's app-switcher grid). Fully self-contained: injects
// its own styles/markup, so it works the same on every page layout
// across every repo without depending on that page's own CSS classes.
// ============================================================
(function () {
  var CURRENT_HOST = window.location.hostname;

  var SERVICES = [
    { key: 'hostaka',    name: 'Hostaka',      url: 'https://hostaka.fun/',              icon: '/icon/hostaka-icon.png' },
    { key: 'orbithub',   name: 'Orbithub',     url: 'https://orbithub.hostaka.fun/',     icon: '/icon/orbithub-icon.png' },
    { key: 'aethercast', name: 'aethercast',   url: 'https://aethercast.hostaka.fun/',   icon: '/icon/aethercast-icon.png' },
    { key: 'apps',       name: 'Hostaka Apps', url: 'https://apps.hostaka.fun/',         icon: '/icon/apps-icon.png' },
    { key: 'wiki',       name: 'Wiki',         url: 'https://wiki.hostaka.fun/',         icon: '/icon/wiki-icon.png' },
    { key: 'laps',       name: 'Laps',         url: 'https://laps.hostaka.fun/',         icon: '/icon/laps-icon.png' },
    { key: 'console',    name: 'Console',      url: 'https://console.hostaka.fun/',      icon: '/icon/console-icon.png' },
    { key: 'olympus',    name: 'Olympus',      url: 'https://olympus.hostaka.fun/',      icon: '/icon/olympus-icon.png' }
  ];

  function isCurrent(svc) {
    try { return CURRENT_HOST === new URL(svc.url).hostname; } catch (e) { return false; }
  }

  function injectStyles() {
    var css = `
#ecoSwitchBtn{position:fixed;top:14px;inset-inline-end:14px;z-index:99998;width:36px;height:36px;
  border-radius:50%;border:1px solid rgba(255,255,255,0.14);background:rgba(30,30,34,0.72);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;
  justify-content:center;cursor:pointer;transition:transform .15s ease,background .15s ease;padding:0;}
#ecoSwitchBtn:hover{transform:scale(1.06);background:rgba(45,45,50,0.85);}
#ecoSwitchBtn:active{transform:scale(0.94);}
#ecoSwitchBtn svg{width:18px;height:18px;color:#fff;}
#ecoSwitchPanel{position:fixed;top:58px;inset-inline-end:14px;z-index:99999;width:300px;
  background:rgba(24,24,28,0.98);border:1px solid rgba(255,255,255,0.1);border-radius:16px;
  box-shadow:0 14px 40px rgba(0,0,0,0.45);padding:14px;display:none;grid-template-columns:repeat(4,1fr);
  gap:10px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
#ecoSwitchPanel.show{display:grid;}
#ecoSwitchPanel a{display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;
  padding:8px 4px;border-radius:10px;transition:background .12s ease;}
#ecoSwitchPanel a:hover{background:rgba(255,255,255,0.06);}
#ecoSwitchPanel a img{width:44px;height:44px;border-radius:12px;object-fit:cover;display:block;}
#ecoSwitchPanel a.current img{outline:2px solid #6ea8ff;outline-offset:2px;}
#ecoSwitchPanel a span{font-size:11px;color:#eaeaef;text-align:center;line-height:1.2;
  max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#ecoSwitchOverlay{position:fixed;inset:0;z-index:99997;display:none;}
#ecoSwitchOverlay.show{display:block;}
@media (max-width:480px){
  #ecoSwitchPanel{width:260px;inset-inline-end:10px;grid-template-columns:repeat(3,1fr);}
  #ecoSwitchBtn{inset-inline-end:10px;}
}
`;
    var style = document.createElement('style');
    style.id = 'ecoSwitchStyle';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildPanel() {
    var panel = document.createElement('div');
    panel.id = 'ecoSwitchPanel';
    SERVICES.forEach(function (svc) {
      var a = document.createElement('a');
      a.href = svc.url;
      if (isCurrent(svc)) a.className = 'current';
      var img = document.createElement('img');
      img.src = svc.icon;
      img.alt = svc.name;
      img.loading = 'lazy';
      var span = document.createElement('span');
      span.textContent = svc.name;
      a.appendChild(img);
      a.appendChild(span);
      panel.appendChild(a);
    });
    return panel;
  }

  function init() {
    if (document.getElementById('ecoSwitchBtn')) return; // تفادي التكرار لو انحقن السكربت أكثر من مرة
    injectStyles();

    var overlay = document.createElement('div');
    overlay.id = 'ecoSwitchOverlay';

    var btn = document.createElement('button');
    btn.id = 'ecoSwitchBtn';
    btn.type = 'button';
    btn.title = 'Hostaka Ecosystem';
    btn.setAttribute('aria-label', 'Switch between Hostaka Ecosystem services');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<circle cx="5" cy="5" r="2.2"/><circle cx="12" cy="5" r="2.2"/><circle cx="19" cy="5" r="2.2"/>' +
      '<circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/>' +
      '<circle cx="5" cy="19" r="2.2"/><circle cx="12" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/>' +
      '</svg>';

    var panel = buildPanel();

    function close() {
      panel.classList.remove('show');
      overlay.classList.remove('show');
    }
    function toggle() {
      var open = panel.classList.toggle('show');
      overlay.classList.toggle('show', open);
    }

    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    document.body.appendChild(overlay);
    document.body.appendChild(btn);
    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
