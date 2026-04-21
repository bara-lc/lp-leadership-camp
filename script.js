/* ============================================================
   script.js — Leadership s Přesahem
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     ---------------------------------------------------------- */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');

    if (!elements.length) return;

    var observer = new IntersectionObserver(
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
     Navbar — background on scroll
     ---------------------------------------------------------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
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
    var questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        if (!item) return;

        var answer = item.querySelector('.faq-answer');
        var isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
          var openAnswer = openItem.querySelector('.faq-answer');
          if (openAnswer) {
            openAnswer.style.maxHeight = '0';
          }
        });

        if (!isOpen && answer) {
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
    var form = document.getElementById('lead-form');
    var btn = document.getElementById('form-submit-btn');

    if (!form || !btn) return;

    function validateForm() {
      var requiredFields = form.querySelectorAll('[required]');
      var isValid = true;

      requiredFields.forEach(function (field) {
        field.classList.remove('error');

        if (!field.value || !field.value.trim()) {
          field.classList.add('error');
          isValid = false;
          return;
        }

        if (field.type === 'email' && !field.value.includes('@')) {
          field.classList.add('error');
          isValid = false;
        }
      });

      return isValid;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!validateForm()) return;

      btn.textContent = 'Odesíláme…';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Poptávka odeslána. Ozveme se vám.';
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