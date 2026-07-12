/* ============================================
   PWA INSTALL PROMOTION ENGINE — StarLink
   ============================================
   Detects: display-mode, iOS Safari, beforeinstallprompt
   Shows:  bottom snackbar (1st visit), banner (2nd+),
           iOS guide overlay, Chrome install prompt
   ============================================ */
(function () {
  'use strict';

  var PWAInstall = {
    deferredPrompt: null,
    isStandalone: false,
    isIOS: false,
    isChrome: false,
    visitCount: 0,
    dismissed: false,
    bannerEl: null,
    iosGuideEl: null,
    initialized: false
  };

  /* ─── Detection ─── */
  PWAInstall.detect = function () {
    // Running as installed app?
    this.isStandalone = window.matchMedia &&
      window.matchMedia('(display-mode: standalone)').matches;

    // iOS Safari?
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream;

    // Chrome-based (beforeinstallprompt supported)?
    this.isChrome = 'onbeforeinstallprompt' in window;
  };

  /* ─── Visit Tracking ─── */
  PWAInstall.trackVisit = function () {
    try {
      var count = parseInt(localStorage.getItem('starlink_visits') || '0', 10);
      count++;
      localStorage.setItem('starlink_visits', String(count));
      this.visitCount = count;

      this.dismissed = localStorage.getItem('starlink_dismiss_install') === 'true';
    } catch (e) {
      // localStorage unavailable (private browsing, etc.)
      this.visitCount = 1;
      this.dismissed = false;
    }
  };

  /* ─── Early-capture beforeinstallprompt (fires before init is called) ─── */
(function () {
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.__earlyDeferredPrompt = e;
  }, { once: true });
})();

PWAInstall.__storeEarlyPrompt = function () {
  if (window.__earlyDeferredPrompt && !this.deferredPrompt) {
    this.deferredPrompt = window.__earlyDeferredPrompt;
    window.__earlyDeferredPrompt = null;
  }
};

/* ─── beforeinstallprompt listener ─── */
PWAInstall.setupPrompt = function () {
  var self = this;

  // Pick up any early-captured prompt
  self.__storeEarlyPrompt();

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    self.deferredPrompt = e;
  });

  window.addEventListener('appinstalled', function () {
    self.deferredPrompt = null;
    self.hideBanner();
    // Mark as installed in localStorage
    try { localStorage.setItem('starlink_installed', 'true'); } catch (e) {}
  });
};

  /* ─── Banner Logic ─── */
  PWAInstall.showBanner = function () {
    if (this.isStandalone) return;           // Already installed & running
    if (this.dismissed) return;              // User said no
    if (this.bannerEl && this.bannerEl.classList.contains('pwa-banner--visible')) return;

    // Check if previously installed
    try {
      if (localStorage.getItem('starlink_installed') === 'true') return;
    } catch (e) {}

    // iOS → show iOS guide
    if (this.isIOS) {
      this.showIOSGuide();
      return;
    }

    // Choose banner type based on visit count
    var banner = this.bannerEl;
    if (!banner) return;

    banner.className = 'pwa-banner';

    if (this.visitCount <= 1) {
      // First visit — compact snackbar
      banner.classList.add('pwa-banner--snack');
      banner.innerHTML =
        '<div class="pwa-banner__inner">' +
          '<div class="pwa-banner__icon">' +
            '<svg width="28" height="28" viewBox="0 0 28 28" fill="none">' +
              '<rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" stroke-width="1.5"/>' +
              '<path d="M14 8v12m-6-6h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '</svg>' +
          '</div>' +
          '<div class="pwa-banner__text">' +
            '<span class="pwa-banner__title">Install StarLink App</span>' +
            '<span class="pwa-banner__desc">Fast • Offline • 1-Tap Access</span>' +
          '</div>' +
          '<button class="pwa-banner__action" data-action="install" aria-label="Install App">Install</button>' +
          '<button class="pwa-banner__close" data-action="dismiss" aria-label="Dismiss">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>';
    } else {
      // Returning visitor — rich banner
      banner.classList.add('pwa-banner--rich');
      banner.innerHTML =
        '<div class="pwa-banner__inner">' +
          '<button class="pwa-banner__close pwa-banner__close--top" data-action="dismiss" aria-label="Dismiss">' +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9m0-9l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<div class="pwa-banner__icon-large">' +
            '<svg width="48" height="48" viewBox="0 0 48 48" fill="none">' +
              '<rect x="4" y="4" width="40" height="40" rx="12" stroke="var(--accent)" stroke-width="1.5"/>' +
              '<path d="M24 12v24m-12-12h24" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>' +
              '<circle cx="24" cy="24" r="8" stroke="var(--accent)" stroke-width="1" fill="none" opacity="0.3"/>' +
            '</svg>' +
          '</div>' +
          '<div class="pwa-banner__text">' +
            '<span class="pwa-banner__title">Get StarLink App</span>' +
            '<span class="pwa-banner__desc">Install for offline access, instant launch &amp; cleaner experience</span>' +
          '</div>' +
          '<div class="pwa-banner__features">' +
            '<span class="pwa-banner__feature">⚡ Instant</span>' +
            '<span class="pwa-banner__feature">📴 Offline</span>' +
            '<span class="pwa-banner__feature">🔒 Secure</span>' +
          '</div>' +
          '<button class="pwa-banner__action" data-action="install">Install Now</button>' +
          '<button class="pwa-banner__action pwa-banner__action--secondary" data-action="dismiss">Maybe Later</button>' +
        '</div>';
    }

    // Animate in
    requestAnimationFrame(function () {
      banner.classList.add('pwa-banner--visible');
    });
  };

  PWAInstall.hideBanner = function () {
    var banner = this.bannerEl;
    if (!banner) return;
    banner.classList.remove('pwa-banner--visible');
  };

  /* ─── iOS Guide Overlay ─── */
  PWAInstall.showIOSGuide = function () {
    if (this.isStandalone) return;
    try {
      if (localStorage.getItem('starlink_ios_guide_shown') === 'true') return;
    } catch (e) {}

    var guide = this.iosGuideEl;
    if (!guide) return;

    guide.innerHTML =
      '<div class="pwa-ios-guide__overlay" data-action="close-guide"></div>' +
      '<div class="pwa-ios-guide__panel" role="dialog" aria-label="Install StarLink on iPhone">' +
        '<button class="pwa-ios-guide__close" data-action="close-guide" aria-label="Close">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10m0-10l-10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
        '</button>' +
        '<div class="pwa-ios-guide__icon">' +
          '<svg width="40" height="40" viewBox="0 0 28 28" fill="none">' +
            '<rect x="3" y="3" width="22" height="22" rx="7" stroke="var(--accent)" stroke-width="1.5"/>' +
            '<path d="M14 9v10m-5-5h10" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>' +
          '</svg>' +
        '</div>' +
        '<h3 class="pwa-ios-guide__title">Install StarLink on your iPhone</h3>' +
        '<ol class="pwa-ios-guide__steps">' +
          '<li><span class="pwa-ios-guide__step-icon">' +
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="4" fill="currentColor"/></svg>' +
          '</span> Tap Share <svg class="pwa-ios-guide__share-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 6v10m-4-4l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> in Safari</li>' +
          '<li><span class="pwa-ios-guide__step-icon">②</span> Scroll down &amp; tap <strong>Add to Home Screen</strong></li>' +
          '<li><span class="pwa-ios-guide__step-icon">③</span> Tap <strong>Add</strong> in the top-right corner</li>' +
        '</ol>' +
        '<button class="pwa-banner__action" data-action="close-guide">Got it!</button>' +
      '</div>';

    requestAnimationFrame(function () {
      guide.classList.add('pwa-ios-guide--visible');
    });
  };

  PWAInstall.hideIOSGuide = function () {
    var guide = this.iosGuideEl;
    if (!guide) return;
    guide.classList.remove('pwa-ios-guide--visible');
    try { localStorage.setItem('starlink_ios_guide_shown', 'true'); } catch (e) {}
  };

  /* ─── Event Handling ─── */
  PWAInstall.handleAction = function (action) {
    var self = this;

    switch (action) {
      case 'install':
        if (self.deferredPrompt) {
          // Chrome install prompt
          self.deferredPrompt.prompt();
          self.deferredPrompt.userChoice.then(function (choice) {
            if (choice.outcome === 'accepted') {
              try { localStorage.setItem('starlink_installed', 'true'); } catch (e) {}
            }
            self.deferredPrompt = null;
          });
        }
        self.hideBanner();
        break;

      case 'dismiss':
        self.hideBanner();
        try { localStorage.setItem('starlink_dismiss_install', 'true'); } catch (e) {}
        break;

      case 'close-guide':
        self.hideIOSGuide();
        break;
    }
  };

  /* ─── Timer: show banner after delay ─── */
  PWAInstall.scheduleBanner = function () {
    var self = this;

    // Wait for splash exit + content entrance animation to settle
    var delay = 3000; // 3 seconds after splash + content visible

    // If already standalone, no need
    if (this.isStandalone) return;
    if (this.dismissed) return;

    // Check first visit timing
    setTimeout(function () {
      // Don't show if user already interacted with install
      if (self.dismissed) return;
      if (self.isStandalone) return;
      self.showBanner();
    }, delay);
  };

  /* ─── Init ─── */
  PWAInstall.init = function () {
    if (this.initialized) return;
    this.initialized = true;

    this.bannerEl = document.getElementById('pwa-banner');
    this.iosGuideEl = document.getElementById('pwa-ios-guide');

    this.detect();
    this.trackVisit();

    // Skip everything if already installed
    if (this.isStandalone) {
      try { localStorage.setItem('starlink_installed', 'true'); } catch (e) {}
      return;
    }

    // Setup beforeinstallprompt listener
    this.setupPrompt();

    // Delegate click events on banner/guide
    var self = this;
    document.addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      var action = actionEl.getAttribute('data-action');
      if (action === 'install' || action === 'dismiss' || action === 'close-guide') {
        e.preventDefault();
        self.handleAction(action);
      }
    });

    // Schedule banner appearance
    this.scheduleBanner();
  };

  /* ─── Export ─── */
  window.PWAInstall = PWAInstall;

})();
