/* ============================================================
   Navbar Component - unified navigation injector
   Works with components/navbar.html (template) and
   components/navbar.css (styles).

   Page integration:
     <div id="navbar" data-active="index|best-practices|governance">
       ...<noscript> fallback navigation (no-JS environments)...
     </div>
     <script src="components/navbar.js" defer></script>

   Behavior (see docs/adr/ADR-002-unified-navbar-component.md and
   docs/adr/ADR-013-detail-pages-navbar-and-breadcrumb.md):
   1. fetch the template and inject it into the placeholder;
   2. based on the placeholder's data-active, add .active to
      .nav a[data-nav=...] (the home page marks the Home link);
   3. on non-home pages, prefix relative URLs with the path back to the
      site root — '' for root pages, '../' for one subdirectory, etc. —
      so the logo image, logo href, in-page anchors (`#...` -> `index.html#...`)
      and page links (`architecture.html` etc.) all resolve from any depth;
      on the home page keep the template defaults (same-page anchors + smooth scroll).

   Note: fetch is unavailable under the file:// protocol; use an HTTP
   server for local preview (e.g. python -m http.server). When JS is
   disabled, <noscript> provides basic navigation.
   ============================================================ */
(function () {
  'use strict';

  var host = document.getElementById('navbar');
  if (!host) return;

  function isHomePage() {
    var path = window.location.pathname;
    return /(^|\/)index\.html$/i.test(path) || /\/$/.test(path);
  }

  // Relative prefix from the current page back to the site root:
  // '' for root pages (news.html), '../' for one subdirectory
  // (best-practices/usecase.html), '../../' for two, and so on.
  function getPrefix() {
    var parts = window.location.pathname.replace(/^\//, '').split('/');
    var dirs = parts.slice(0, -1).filter(function (p) { return !!p; });
    var prefix = '';
    for (var i = 0; i < dirs.length; i++) prefix += '../';
    return prefix;
  }

  fetch(getPrefix() + 'components/navbar.html')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (html) {
      host.innerHTML = html;

      // 1. Active state: mark the current page link based on the placeholder's data-active
      var active = host.getAttribute('data-active');
      if (active) {
        var current = host.querySelector('.nav a[data-nav="' + active + '"]');
        if (current) current.classList.add('active');
      }

      // 2. Cross-page link rewrite: on sub-pages, prefix relative URLs with the
      //    path back to the site root ('' for root pages, '../' for subdirectories)
      //    so the single template works from any depth.
      if (!isHomePage()) {
        var prefix = getPrefix();

        var logoImg = host.querySelector('.logo-mark img');
        if (logoImg) logoImg.setAttribute('src', prefix + 'src/images/openan-logo.png');

        var logo = host.querySelector('.logo');
        if (logo) logo.setAttribute('href', prefix + 'index.html');

        host.querySelectorAll('a[href]').forEach(function (a) {
          if (a.classList.contains('logo')) return;
          var href = a.getAttribute('href');
          if (href.charAt(0) === '#') {
            // in-page anchor -> cross-page form to the home page
            a.setAttribute('href', prefix + 'index.html' + href);
          } else if (!/^(https?:|mailto:|#|\/)/i.test(href)) {
            a.setAttribute('href', prefix + href);
          }
        });
      }
    })
    .catch(function (err) {
      // fetch failed (typical when opened directly via file://): the
      // <noscript> inside the placeholder does not render when JS is
      // enabled, so show a visible notice to avoid an empty page top.
      console.error('[navbar] injection failed, please access the site via an HTTP server:', err);
      var note = document.createElement('p');
      note.textContent = 'Navigation failed to load: please access the site via an HTTP server.';
      note.style.cssText =
        'margin:0;padding:12px 24px;font-family:ui-monospace,monospace;' +
        'font-size:0.8rem;color:#e06c75;background:rgba(224,108,117,0.08);' +
        'border-bottom:1px solid rgba(224,108,117,0.3);';
      host.appendChild(note);
    });
})();