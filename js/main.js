/* Купольная мечеть · Актобе — main.js
   nav (solid on scroll, mobile menu, active link) · scroll-reveal · counters ·
   hero parallax · tabs · layer hover · lightbox */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- NAV ---------- */
  const nav = $('#nav');
  const hero = $('.hero');
  const onScroll = () => {
    const solid = window.scrollY > (hero ? hero.offsetHeight - 80 : 80);
    nav.classList.toggle('is-solid', solid);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('.burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) nav.classList.add('is-solid'); else onScroll();
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); closeLightbox(); } });

  // active anchor highlight
  const links = $$('.nav__links a');
  const targets = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- REVEAL ---------- */
  const reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => ro.observe(el));
  }

  /* ---------- COUNTERS ---------- */
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduced) { el.textContent = fmt(target, dec); return; }
    const dur = 1200, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(target * ease(p), dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!('IntersectionObserver' in window)) counters.forEach(runCounter);
    else {
      const co = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => { if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); } });
      }, { threshold: 0.5 });
      counters.forEach(c => co.observe(c));
    }
  }

  /* ---------- HERO PARALLAX ---------- */
  const bg = $('[data-parallax]');
  if (bg && !reduced) {
    let ticking = false;
    const move = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) bg.style.transform = `translate3d(0,${y * 0.15}px,0)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(move); ticking = true; } }, { passive: true });
    move();
  }

  /* ---------- TABS ---------- */
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    const select = (tab) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = $('#' + t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      tab.focus({ preventScroll: true });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length]);
        if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length]);
      });
    });
  });

  /* ---------- LAYER HOVER ---------- */
  $$('.layer-list li').forEach(li => {
    li.addEventListener('mouseenter', () => li.classList.add('is-hot'));
    li.addEventListener('mouseleave', () => li.classList.remove('is-hot'));
  });

  /* ---------- LIGHTBOX ---------- */
  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  const lbCap = $('figcaption', lb);
  let lastFocus = null;
  const openLightbox = (src, cap, alt) => {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || cap || '';
    lbCap.textContent = cap || '';
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.lightbox__close', lb).focus();
  };
  function closeLightbox() {
    if (!lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-lightbox]').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = $('img', btn);
      openLightbox(btn.dataset.lightbox, btn.dataset.caption, img && img.alt);
    });
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lightbox__close')) closeLightbox(); });

  /* ---------- LANG (placeholder for KZ) ---------- */
  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    b.title = 'Қазақша нұсқа дайындалуда';
  }));
})();
