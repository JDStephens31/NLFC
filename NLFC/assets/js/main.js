/* New Life Family Church — site behaviour
   Progressive enhancement only: every page works without this file. */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state if the viewport grows past the mobile breakpoint.
    var wide = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else wide.addListener(onChange);
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll effects: header shadow + hero sunrise ---------------------- */
  var header = document.querySelector('.site-header');
  var stages = document.querySelectorAll('[data-sunrise]');

  // With reduced motion the CSS pins --sunrise to a lit value; don't animate it.
  var animateSun = stages.length > 0 && !reduced;

  if (header || animateSun) {
    var ticking = false;

    var update = function () {
      ticking = false;

      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);

      if (!animateSun) return;

      for (var i = 0; i < stages.length; i++) {
        var el = stages[i];
        var rect = el.getBoundingClientRect();
        // The sun completes its arc once the stage has scrolled 85% of its own
        // height past the top of the viewport.
        var travel = rect.height * 0.85;
        var p = travel > 0 ? -rect.top / travel : 0;
        if (p < 0) p = 0; else if (p > 1) p = 1;
        el.style.setProperty('--sunrise', p.toFixed(4));
      }
    };

    var onScroll = function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', update);
  }

  /* ---- Footer year ------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Reveal on scroll -------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(items, function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
    observer.observe(el);
  });
})();
