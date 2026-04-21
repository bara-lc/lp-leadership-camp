/* ============================================================
   script.js — Leadership s Přesahem
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initReveal();
  initNavbar();
  initFaq();
  initForm();
});

/* ----------------------------------------------------------
   Scroll reveal
   ---------------------------------------------------------- */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ----------------------------------------------------------
   Navbar
   ---------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

/* ----------------------------------------------------------
   FAQ accordion
   ---------------------------------------------------------- */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!button || !answer) return;

    button.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Zavři všechny ostatní
      faqItems.forEach(function (otherItem) {
        if (otherItem === item) return;
        otherItem.classList.remove('open');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '0px';
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        // Změříme skutečnou výšku obsahu
        answer.style.maxHeight = 'none';
        const fullHeight = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        // Requestem dalšího framu zajistíme plynulou animaci
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            answer.style.maxHeight = fullHeight + 'px';
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
  const form = document.getElementById('lead-form');
  const btn = document.getElementById('form-submit-btn');

  if (!form || !btn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    btn.textContent = 'Odesíláme…';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = 'Poptávka odeslána. Ozveme se vám.';
      btn.classList.add('sent');
    }, 1200);
  });
}