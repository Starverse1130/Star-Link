<div align="center">

<img src="assets/image/Ayush.png" alt="Ayush Gupta" width="100" style="border-radius: 50%;">

# StarLink

**One link to connect with Ayush Gupta across 10+ platforms.**

<p align="center">
  <a href="https://aayush.rf.gd" style="display: inline-block; padding: 14px 28px; background: #1a1a1a; color: #E11D48; border-radius: 12px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 1.1rem; font-weight: 600; border: 1.5px solid #E11D48; transition: all 0.2s ease;">
    🌐 aayush.rf.gd
  </a>
</p>

<p align="center">
  <a href="https://github.com/AyushEduverse/Star-Link">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub">
  </a>
</p>

</div>

---

## Features

- **Animated Splash Screen** — Cinematic orbit entrance with particles, loading bar, and fade-off exit
- **10 Social Links** — GitHub, LinkedIn, Portfolio, Instagram, X/Twitter, Threads, Snapchat, Resume, WhatsApp, Facebook
- **GSAP Entrance** — Staggered cinematic timeline after splash exit
- **Dark/Light Mode** — System preference detection + manual toggle with localStorage persistence
- **Typed.js Terminal** — Cycling typewriter effect for role titles
- **Long-Press to Copy** — Clipboard copy with animated checkmark toast + haptic feedback
- **Smart Hire CTA** — Email with progress bar feedback
- **Touch Feedback** — Ripple effects, 3D avatar tilt, finger trail stars  - **PWA** — Installable, offline-ready with service worker (v2)
  - **PWA Install Promotion** — Smart banner (snackbar 1st visit, rich 2nd+), iOS guide overlay, beforeinstallprompt handling, display-mode detection
- **SEO Optimized** — Open Graph, Twitter Cards, JSON-LD structured data, meta tags

## Tech Stack

| Technology | Usage |
|:---|---:|
| **HTML5** | Semantic page structure, PWA manifest, Open Graph/Twitter meta tags, JSON-LD schema |
| **CSS3** | Custom properties for theming, splash screen animations, conic gradients, responsive breakpoints |
| **Vanilla JS** | Modular controller pattern — no frameworks, no build step |
| **GSAP 3.12** | Splash entrance, main content staggered timeline, theme toggle effects |
| **Typed.js 2.1** | Typewriter effect for role cycling |
| **Remix Icons** | Social brand icons, theme icons, CTA icon |
| **Google Fonts** | Poppins, DM Sans, JetBrains Mono |
| **Service Worker** | Cache v2 — pre-caches all assets, CDN network-first, offline fallback |

## Quick Start

```bash
git clone https://github.com/AyushEduverse/Star-Link.git
cd Star-Link
# Serve with any HTTP server (e.g., npx serve .) — no build step needed
```

## Setup Guide

### 1. Replace Social Links
Edit `index.html` — update `href` on each `.social-icon-btn`.

### 2. Update Profile Image
- Replace `assets/image/Ayush.png` (splash avatar) and `assets/image/Aayush.webp` (main avatar)
- Update `alt` text in `<img>` tags

### 3. Update Resume
- Replace `assets/pdf/Ayush_Resume.pdf` with your resume

### 4. Update Email & WhatsApp
- **Email:** Change `starverse1130@gmail.com` in `js/email.js` and `.hire-cta` href
- **WhatsApp:** Change phone in `js/whatsapp.js` and `#whatsappBtn` href

### 5. Update Typed Roles
Edit `js/typed.js` — update the `strings` array.

### 6. Customize Colors
Edit variables in `index.html` inline `<style>` (critical CSS) — change `--accent`, `--bg-primary`, etc.

### 7. PWA Icons
Replace icons in `assets/icons/` and update `site.webmanifest`.

## Project Structure

```
├── index.html              ← Main entry (splash + portfolio)
├── sw.js                   ← Service worker v2 (offline caching)
├── LICENSE                 ← MIT License
├── css/
│   ├── splash.css          ← Splash screen styles (orbit, loader, particles)
│   ├── hero.css            ← Avatar ring, typography
│   ├── components.css      ← Social grid, tooltips, CTA, footer
│   ├── animations.css      ← Keyframes, reduced motion
│   ├── responsive.css      ← Breakpoints
│   └── touch.css           ← Ripples, toast, touch gestures
├── js/
│   ├── splash.js           ← Splash logic + deferred script loader
│   ├── init.js             ← Boots controllers + SW registration
│   ├── theme.js            ← Dark/light toggle
│   ├── email.js            ← Email CTA
│   ├── whatsapp.js         ← WhatsApp CTA
│   ├── gsap-entrance.js    ← Main content GSAP timeline
│   ├── typed.js            ← Typed.js role cycling
│   ├── pwa-install.js      ← PWA install promotion engine
│   ├── stars.js            ← Background stars canvas
│   ├── interactions.js     ← Magnetic hover, avatar tilt
│   └── touch.js            ← Ripples, long-press copy, trail
└── assets/
    ├── image/
    │   ├── Ayush.png       ← Splash avatar
    │   └── Aayush.webp     ← Main avatar
    ├── pdf/Ayush_Resume.pdf
    ├── icons/              ← PWA icons + manifest
    └── screenshots/        ← PWA install screenshots
```

## Splash Screen

The splash screen features:
- **Orbit animation** — 3 rotating rings with colored orbiting dots + conic gradient ring
- **Particle system** — Floating constellation particles with connection lines
- **Loading bar** — 6-step animated progress with status text and percentage
- **Corner brackets** — Tech-style framing in all 4 corners
- **Fade-off exit** — Content fades smoothly, then main portfolio entrance plays
- **Skip button** — Dark glass button (12px radius, backdrop-filter, rose glow hover), instant exit to main content at any time

## Deferred JS Loading

Only GSAP + splash.js are loaded synchronously. All other JS is loaded dynamically **during** the splash animation, reducing blocking time for first paint. Scripts are preloaded via `<link rel="preload">` hints and execute in dependency order (`async=false`).

## PWA Offline

Service worker (`sw.js`) v2 uses three caching strategies:
- **Cache-first** — Local CSS/JS/images/fonts (serve instantly, update in background)
- **Network-first** — CDN resources (jsdelivr, Google Fonts)
- **Stale-while-revalidate** — HTML navigation (always fresh, always fast)

### PWA Install Promotion

StarLink includes a smart install promotion system (`js/pwa-install.js`) that:

| Scenario | Behavior |
|:---|---:|
| **Already installed** (standalone mode) | Automatically detected — nothing shown |
| **First visit** | Compact glass snackbar slides up after 3s |
| **Returning visit** (2nd+) | Rich banner with app benefits + Install Now |
| **iOS Safari** | 3-step "Add to Home Screen" guide overlay |
| **Dismissed** | Never shown again (localStorage flag) |
| **Chrome install** | Captures `beforeinstallprompt`, triggers native dialog |

**Install:**
- **Android (Chrome):** Install banner → tap Install
- **Desktop (Chrome/Edge):** Click install icon in address bar, or use banner
- **iOS (Safari):** Share → Add to Home Screen (guide provided)

## Accessibility (WCAG AA)

- `role="status"` + `aria-label` on splash for screen readers
- Skip-to-content link, semantic landmarks, `:focus-visible` on controls
- `prefers-reduced-motion` respected on all animations (disables orbits, particles, blobs)
- All social links have descriptive `aria-label` attributes
- Text uses `rem` units for proper scaling
- `user-select: none` for touch optimization

---

## License

This project is licensed under the [MIT License](LICENSE) — © 2026 Ayush Gupta (Starverse).

---

<div align="center">
  <strong>Ayush Gupta</strong><br>
  Full Stack Developer · UI/UX Designer · Python Developer<br><br>
  <a href="https://github.com/AyushEduverse">GitHub</a> ·
  <a href="https://linkedin.com/in/ayushgupta1103">LinkedIn</a> ·
  <a href="https://x.com/ayushgupta1102">X</a> ·
  <a href="https://aayush.rf.gd">Portfolio</a>
  <br><br>
  Built with ❤️ under <strong>Starverse</strong>
</div>
