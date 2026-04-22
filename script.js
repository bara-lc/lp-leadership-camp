/* ============================================================
   Legacy Club — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initReveal();
  initHeroIntro();
  initHeroParallax();
  initFaq();
  initForm();
  initSmoothAnchors();
});


/* ----------------------------------------------------------
   Navbar — scroll state
   ---------------------------------------------------------- */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var ticking = false;
  function update() {
    if (window.scrollY > 48) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    ticking = false;
  }
  update();

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}


/* ----------------------------------------------------------
   Reveal on scroll
   ---------------------------------------------------------- */
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -60px 0px'
  });

  els.forEach(function (el) { observer.observe(el); });

  // Fallback: pokud je něco ve viewportu po 2.5s a observer to nezachytil,
  // donutit do visible (chrání před edge-case)
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }, 2500);
}


/* ----------------------------------------------------------
   Hero — staggered entry animation
   ---------------------------------------------------------- */
function initHeroIntro() {
  var selectors = [
    '.hero-eyebrow',
    '.hero-h1',
    '.hero-sub',
    '.hero-supporting',
    '.hero-actions',
    '.hero-photo',
    '.hero-meta'
  ];

  var elements = selectors
    .map(function (s) { return document.querySelector(s); })
    .filter(Boolean);

  if (!elements.length) return;

  // Nastav počáteční stav
  elements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.willChange = 'opacity, transform';
  });

  // Spusť staggered s malým delayem, aby font stihl načíst
  window.requestAnimationFrame(function () {
    setTimeout(function () {
      elements.forEach(function (el, i) {
        setTimeout(function () {
          el.style.opacity = '';
          el.style.transform = '';
        }, i * 110);
      });

      // Po dokončení odstraň inline styly
      setTimeout(function () {
        elements.forEach(function (el) {
          el.style.transition = '';
          el.style.willChange = '';
        });
      }, 1400 + elements.length * 110);
    }, 80);
  });
}


/* ----------------------------------------------------------
   Hero — subtle parallax on background
   ---------------------------------------------------------- */
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var bg = document.querySelector('.hero-bg');
  var grain = document.querySelector('.hero-grain');
  if (!bg) return;

  var ticking = false;
  function update() {
    var y = window.scrollY;
    if (y > window.innerHeight) { ticking = false; return; }

    bg.style.transform = 'translate3d(0, ' + (y * 0.18) + 'px, 0)';
    if (grain) grain.style.transform = 'translate3d(0, ' + (y * 0.08) + 'px, 0)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}


/* ----------------------------------------------------------
   FAQ accordion
   ---------------------------------------------------------- */
function initFaq() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Zavři ostatní
      items.forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        var a = other.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = 'none';
        var h = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            answer.style.maxHeight = h + 'px';
          });
        });
      } else {
        item.classList.remove('open');
        answer.style.maxHeight = '0px';
      }
    });
  });
}


/* ----------------------------------------------------------
   Form submit (demo)
   ---------------------------------------------------------- */
function initForm() {
  var form = document.getElementById('lead-form');
  var btn = document.getElementById('form-submit-btn');
  if (!form || !btn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.classList.contains('sent')) return;

    btn.innerHTML = 'Odesíláme…';
    btn.disabled = true;

    setTimeout(function () {
      btn.innerHTML = '✓ &nbsp; Poptávka odeslána. Ozveme se vám.';
      btn.classList.add('sent');
    }, 1100);
  });
}


/* ----------------------------------------------------------
   Smooth anchor scrolling with nav offset
   ---------------------------------------------------------- */
function initSmoothAnchors() {
  var navH = 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}