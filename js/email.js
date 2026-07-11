/* ============================================
   EMAIL CONTROLLER — Pre-filled Project Inquiry
   With left-to-right progress animation on click
   ============================================ */
const EmailController = {
  init: function () {
    const cta = document.querySelector('.hire-cta');
    if (!cta) return;

    cta.addEventListener('click', function (e) {
      e.preventDefault();
      // Prevent double-click during animation
      if (cta.classList.contains('is-loading')) return;
      cta.classList.add('is-loading');

      // Build mailto link
      const to = 'starverse1130@gmail.com';
      const subject = 'Project Inquiry — Let\'s Work Together';

      const body = [
        'Dear Ayush,',
        '',
        'I hope this message finds you well. I came across your profile and was impressed by your work. I would like to discuss a potential collaboration opportunity.',
        '',
        '——— Project Details ———',
        'Full Name: ',
        'Organization / Institution: ',
        'Project Type: (Web Application / UI/UX Design / Python Development / Other)',
        'Estimated Budget: ',
        'Expected Timeline: ',
        '',
        '——— Project Description ———',
        'Please describe your project requirements in brief:',
        '',
        '——— Additional Notes ———',
        '(Any references, links, or specific requirements you\'d like to share)',
        '',
        'Thank you for your time. I look forward to connecting with you.',
        '',
        'Warm Regards,',
        '[Your Full Name]',
        '[Your Contact Number]'
      ].join('\r\n');

      const mailtoLink = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      /* --------------------------------------------------
         LEFT-TO-RIGHT PROGRESS ANIMATION
         Shimmering progress bar sweeps across the button,
         then opens the email client.
         -------------------------------------------------- */

      // Respect reduced motion — skip animation, open immediately
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cta.classList.remove('is-loading');
        window.location.href = mailtoLink;
        return;
      }

      // Create progress bar element
      const progress = document.createElement('span');
      progress.className = 'hire-cta-progress';
      cta.appendChild(progress);

      // Disable pointer events during animation
      cta.style.pointerEvents = 'none';

      // Animate progress bar — fallback if GSAP not available
      const openMail = function () {
        progress.remove();

        // Change button text immediately — user ko pata chalega email client open ho rha hai
        const originalHTML = cta.innerHTML;
        cta.innerHTML = '<i class="ri-mail-open-line"></i><span>Opening Email...</span>';
        cta.classList.add('is-loading');

        // Keep pointer locked for 5s to prevent double-click
        cta.style.pointerEvents = 'none';

        // Restore button after 5 seconds (email may take time to appear)
        setTimeout(function () {
          cta.classList.remove('is-loading');
          cta.style.pointerEvents = '';
          cta.innerHTML = originalHTML;
        }, 5000);

        // Fire mailto immediately
        window.location.href = mailtoLink;
      };

      if (typeof gsap === 'undefined') {
        openMail();
        return;
      }

      gsap.fromTo(progress, {
        scaleX: 0,
        transformOrigin: 'left center'
      }, {
        scaleX: 1,
        duration: 1.2,
        ease: 'expo.out',
        onComplete: openMail
      });

      // Also animate the rocket icon — quick orbit pulse
      const icon = cta.querySelector('i');
      if (icon) {
        gsap.to(icon, {
          rotation: -15,
          scale: 1.2,
          duration: 0.25,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: function () {
            gsap.set(icon, { clearProps: 'rotation,scale' });
          }
        });
      }
    });
  }
};
