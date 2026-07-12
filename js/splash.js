/* ============================================
   SPLASH SCREEN JS — Particles, Loading, Exit
   ============================================ */

/* ─── Splash Particles (self-cleanup on exit) ─── */
window.__splashFrame = null;
(function(){
  var cv = document.getElementById('c');
  if (!cv) return;
  var cx = cv.getContext('2d');
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var C = ['rgba(225,29,72,','rgba(190,18,60,','rgba(244,114,182,','rgba(251,146,60,','rgba(251,191,36,','rgba(139,92,246,'];
  var P = [], CD = 120, running = true;
  function resize(){
    if (!running) return;
    cv.width = innerWidth; cv.height = innerHeight;
    var n = Math.min(Math.floor(innerWidth * 0.04), 35);
    P = [];
    for (var i = 0; i < n; i++) P.push({
      x: Math.random()*cv.width, y: Math.random()*cv.height,
      r: Math.random()*2.5+0.6, vx:(Math.random()-0.5)*0.3, vy:-(Math.random()*0.45+0.12),
      o: Math.random()*0.45+0.06, c: C[Math.floor(Math.random()*C.length)],
      tp: Math.random()*Math.PI*2, ts: Math.random()*0.018+0.004
    });
  }
  function frame(){
    if (!running) return;
    __splashFrame = requestAnimationFrame(frame);
    cx.clearRect(0,0,cv.width,cv.height);
    var g = cx.createRadialGradient(cv.width/2,-80,0,cv.width/2,-80,480);
    g.addColorStop(0,'rgba(225,29,72,0.04)'); g.addColorStop(1,'rgba(0,0,0,0)');
    cx.fillStyle=g; cx.fillRect(0,0,cv.width,cv.height);
    for (var i = 0; i < P.length; i++){
      for (var j = i+1; j < P.length; j++){
        var dx = P[i].x-P[j].x, dy = P[i].y-P[j].y, dt = Math.sqrt(dx*dx+dy*dy);
        if (dt < CD && dt > 0){
          cx.beginPath(); cx.moveTo(P[i].x,P[i].y); cx.lineTo(P[j].x,P[j].y);
          cx.strokeStyle = 'rgba(225,29,72,'+((1-dt/CD)*0.15)+')';
          cx.lineWidth = 0.5; cx.stroke();
        }
      }
    }
    for (var k = 0; k < P.length; k++){
      var p = P[k], tw = Math.sin(p.tp)*0.35+0.65, a = p.o*tw;
      cx.beginPath(); cx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cx.fillStyle = p.c+a+')'; cx.fill();
      if (p.r > 1.8 && a > 0.15){
        cx.beginPath(); cx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2);
        cx.fillStyle = p.c+(a*0.12)+')'; cx.fill();
      }
      p.x += p.vx; p.y += p.vy; p.tp += p.ts;
      if (p.y < -10){ p.y = cv.height+10; p.x = Math.random()*cv.width; }
      if (p.x < -10) p.x = cv.width+10;
      if (p.x > cv.width+10) p.x = -10;
    }
  }
  function onResize(){clearTimeout(rt);rt=setTimeout(resize,140);}
  var rt; addEventListener('resize',onResize);
  window.__splashResize = function(){ removeEventListener('resize',onResize); };
})();

/* ─── Deferred Scripts: load during splash, execute after ─── */
var __pendingEntrance = false;
var DEFERRED = [
  'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js',
  'js/theme.js','js/email.js','js/whatsapp.js','js/gsap-entrance.js',
  'js/typed.js','js/pwa-install.js','js/stars.js','js/interactions.js','js/touch.js','js/init.js'
];

function loadDeferred() {
  var loaded = 0, total = DEFERRED.length;
  function done() {
    loaded++;
    if (loaded >= total && __pendingEntrance) {
      triggerEntrance(); // deferred until scripts ready
    }
  }
  DEFERRED.forEach(function(src) {
    var s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = done; s.onerror = done;
    document.body.appendChild(s);
  });
}

/* ─── Splash GSAP Timeline ─── */
var splashBar = document.getElementById('bar');
var splashStatus = document.getElementById('statusText');
var splashPct = document.getElementById('pctDisplay');
var STEPS = [
  {p:12,t:'Loading assets'},{p:28,t:'Preparing links'},{p:45,t:'Configuring PWA'},
  {p:65,t:'Compiling shaders'},{p:82,t:'Almost there'},{p:100,t:'Welcome \u2726'}
];
var si = 0, isExiting = false;

function splashTick(){
  if (isExiting || si >= STEPS.length) return;
  var step = STEPS[si++];
  splashBar.style.width = step.p + '%';
  splashStatus.textContent = step.t;
  splashPct.textContent = step.p + '%';
  if (si < STEPS.length){
    setTimeout(splashTick, si===1?200:si===5?350:250);
  } else {
    setTimeout(exitSplash, 400);
  }
}

function hideAllSplashElements(){
  // Cancel particle animation loop & remove resize listener
  if (window.__splashFrame) {
    cancelAnimationFrame(window.__splashFrame);
    window.__splashFrame = null;
  }
  if (window.__splashResize) {
    window.__splashResize();
    window.__splashResize = null;
  }
  var splashIds = ['splash','loader','skipBtn','s-exit','c'];
  splashIds.forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.grid-bg, .scanline, .blob, .corner-bracket, .s-loader, .s-orbit-wrap, .s-skip').forEach(function(el){
    if (el) el.style.display = 'none';
  });
}

function triggerEntrance(){
  if (typeof AnimationController !== 'undefined') {
    __pendingEntrance = false;
    AnimationController.runEntrance();
  } else {
    __pendingEntrance = true; // scripts still loading — retry when done
  }
}

function exitSplash(){
  if (isExiting) return;
  isExiting = true;

  // Allow body to scroll
  document.body.style.removeProperty('overflow');

  var ov = document.getElementById('s-exit');
  if (typeof gsap === 'undefined'){
    hideAllSplashElements();
    triggerEntrance();
    return;
  }

  gsap.killTweensOf('.s-orbit-wrap, #loader, .s-skip, .corner-bracket');

  gsap.to('#splash', { opacity: 0, duration: 0.25, ease: 'power2.out' });
  gsap.to('#skipBtn', { opacity: 0, duration: 0.15, ease: 'power2.out' });

  // Brief overlay flash then reveal main content
  gsap.to(ov, {
    opacity: 1, duration: 0.2, ease: 'power2.inOut',
    onComplete: function(){
      // Remove ALL splash elements from DOM so nothing blocks clicks
      hideAllSplashElements();

      // Fade overlay OUT
      ov.style.display = ''; // keep visible for fade
      gsap.to(ov, {
        opacity: 0, duration: 0.35, ease: 'power2.inOut',
        onComplete: function(){
          ov.style.display = 'none';
          triggerEntrance();
        }
      });
    }
  });
}

function runSplashEntrance(){
  // Start loading deferred scripts during splash (downloads in background)
  loadDeferred();

  var reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hasGSAP = typeof gsap !== 'undefined';

  // Prevent body scroll during splash
  document.body.style.overflow = 'hidden';

  if (reduced || !hasGSAP){
    document.querySelectorAll('.s-orbit-wrap, #loader, .s-skip, .corner-bracket')
      .forEach(function(el){ if (el) el.style.opacity = '1'; });
    splashTick();
    return;
  }

  gsap.set('.s-orbit-wrap',   { opacity: 0, scale: 0.2, rotation: 25 });
  gsap.set('#loader',         { opacity: 0, y: 24 });
  gsap.set('.s-skip',         { opacity: 0, scale: 0.5 });
  gsap.set('.corner-bracket', { opacity: 0, scale: 0.5 });

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to('.s-orbit-wrap', { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }, 0.15)
    .to('.corner-bracket', { opacity: 1, scale: 1, duration: 0.3, stagger: { each: 0.04, from: 'start' }, ease: 'back.out(1.4)' }, 0.35)
    .to('#loader', { opacity: 1, y: 0, duration: 0.3 }, 0.6)
    .to('.s-skip', { opacity: 1, scale: 1, duration: 0.25 }, 0.7)
    .call(function(){ splashTick(); }, [], 0.6);
}

document.getElementById('skipBtn').addEventListener('click', function(){
  if (!isExiting) exitSplash();
});

addEventListener('DOMContentLoaded', function(){ setTimeout(runSplashEntrance, 80); });
