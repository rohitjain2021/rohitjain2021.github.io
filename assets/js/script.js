(() => {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();
  const text = document.getElementById('typewriter');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = ['secure cloud platforms.', 'reliable automation.', 'practical AI applications.'];
  let phrase = 0;
  let count = phrases[0].length;
  let deleting = true;
  let timer;
  function tick() {
    if (motion.matches || document.hidden) return;
    count += deleting ? -1 : 1;
    text.textContent = phrases[phrase].slice(0, count);
    let delay = deleting ? 38 : 75;
    if (count === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      delay = 300;
    } else if (count === phrases[phrase].length) {
      deleting = true;
      delay = 2400;
    }
    timer = window.setTimeout(tick, delay);
  }
  function restart() {
    window.clearTimeout(timer);
    if (motion.matches) {
      phrase = 0;
      count = phrases[0].length;
      deleting = true;
      text.textContent = phrases[0];
      return;
    }
    if (!document.hidden) timer = window.setTimeout(tick, 2400);
  }
  motion.addEventListener('change', restart);
  document.addEventListener('visibilitychange', restart);
  restart();

  // Animate cards as they enter view without hiding content before JavaScript runs.
  if ('IntersectionObserver' in window && !motion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motion.matches && typeof entry.target.animate === 'function') {
          entry.target.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)' });
        }
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.experience-card').forEach(card => reveal.observe(card));
    motion.addEventListener('change', () => {
      if (motion.matches) {
        reveal.disconnect();
        document.querySelectorAll('.experience-card').forEach(card => {
          card.getAnimations().forEach(animation => animation.cancel());
        });
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.nav-links a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();
