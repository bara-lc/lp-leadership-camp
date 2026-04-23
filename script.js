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
    if (window.scrollY > 48) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
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
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) {
      el.classList.add('visible');
    });
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

  elements.forEach(function (el) {
    observer.observe(el);
  });

  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
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
    .map(function (selector) {
      return document.querySelector(selector);
    })
    .filter(Boolean);

  if (!elements.length) return;

  elements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.willChange = 'opacity, transform';
  });

  window.requestAnimationFrame(function () {
    setTimeout(function () {
      elements.forEach(function (el, index) {
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 110);
      });

      setTimeout(function () {
        elements.forEach(function (el) {
          el.style.transition = '';
          el.style.willChange = '';
          el.style.opacity = '';
          el.style.transform = '';
        });
      }, 1600 + elements.length * 110);
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

    if (y > window.innerHeight) {
      ticking = false;
      return;
    }

    bg.style.transform = 'translate3d(0, ' + (y * 0.18) + 'px, 0)';
    if (grain) {
      grain.style.transform = 'translate3d(0, ' + (y * 0.08) + 'px, 0)';
    }

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
    var button = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (!button || !answer) return;

    button.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      items.forEach(function (otherItem) {
        var otherAnswer = otherItem.querySelector('.faq-answer');
        otherItem.classList.remove('open');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '0px';
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', function () {
    var openItem = document.querySelector('.faq-item.open');
    if (!openItem) return;

    var openAnswer = openItem.querySelector('.faq-answer');
    if (!openAnswer) return;

    openAnswer.style.maxHeight = openAnswer.scrollHeight + 'px';
  });
}

/* ----------------------------------------------------------
   Form submit (demo)
   ---------------------------------------------------------- */
function initForm() {
  var form = document.getElementById('lead-form');
  var button = document.getElementById('form-submit-btn');

  if (!form || !button) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (button.classList.contains('sent')) return;

    var consent = document.getElementById('consent');
    if (consent && !consent.checked) {
      consent.focus();

      var box = document.querySelector('.consent-box');
      if (box) {
        box.style.borderColor = '#b54a3a';
        setTimeout(function () {
          box.style.borderColor = '';
        }, 1800);
      }
      return;
    }

    button.innerHTML = 'Odesíláme…';
    button.disabled = true;

    setTimeout(function () {
      button.innerHTML = '✓ &nbsp; Poptávka odeslána. Ozveme se vám.';
      button.classList.add('sent');
    }, 1100);
  });
}

/* ----------------------------------------------------------
   Smooth anchor scrolling with nav offset
   ---------------------------------------------------------- */
function initSmoothAnchors() {
  function getNavHeight() {
    return window.innerWidth <= 560 ? 76 : 88;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      var target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      var offset = getNavHeight();
      var y = target.getBoundingClientRect().top + window.scrollY - offset + 1;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    });
  });
}