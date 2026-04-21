/* ============================================================
   script.js — Leadership s Přesahem
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     ---------------------------------------------------------- */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Navbar — background on scroll
     ---------------------------------------------------------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     FAQ accordion
     ---------------------------------------------------------- */
  function initFaq() {
    var questions = document.querySelectorAll('.faq-question');

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var answer = item.querySelector('.faq-answer');
        var isOpen = item.classList.contains('open');

        // Close all open items
        document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Form submit (demo handler)
     ---------------------------------------------------------- */
  function initForm() {
    var btn = document.getElementById('form-submit-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      btn.textContent = 'Odesíláme…';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Odesláno. Ozveme se do 48 hodin.';
        btn.classList.add('sent');
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     Init on DOMContentLoaded
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNavbar();
    initFaq();
    initForm();
  });

})();