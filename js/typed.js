/* ============================================
   TYPED.JS INIT
   ============================================ */
const TypedController = {
  init: function () {
    if (typeof Typed === 'undefined') return;

    new Typed('#typed-output', {
      strings: [
        'Full Stack Developer',
        'UI/UX Designer',
        'Python Developer',
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 600,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      smartBackspace: true
    });
  }
};
