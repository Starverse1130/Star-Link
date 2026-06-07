/* ============================================
   MASTER INIT
   ============================================ */
(function () {
  'use strict';

  ThemeController.init();
  EmailController.init();
  WhatsAppController.init();
  AnimationController.runEntrance();
  TypedController.init();
  SocialInteraction.init();
  TouchController.init();
  StarsController.init();

  // Cleanup touch resources on page unload
  window.addEventListener('beforeunload', function () {
    TouchController.destroy();
  });

  // Register Service Worker for PWA offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
        console.log('[PWA] ServiceWorker registered:', registration.scope);
      }).catch(function (err) {
        console.warn('[PWA] ServiceWorker registration failed:', err);
      });
    });
  }
})();
