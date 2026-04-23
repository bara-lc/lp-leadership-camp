/* ============================================================
   Legacy Club — script.js
   ============================================================ */

/* ----------------------------------------------------------
   Web3Forms — konfigurace
   ---------------------------------------------------------- */
var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

var FORM_MESSAGES = {
  success: 'Děkujeme, vaši poptávku jsme přijali. Ozveme se vám do 24 hodin.',
  error:   'Odeslání se nezdařilo. Zkuste to prosím znovu, nebo nám napište na info@legacyclub.cz.',
  network: 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.',
  validation: {
    name:     'Uveďte prosím své jméno a příjmení.',
    company:  'Vyplňte prosím název firmy.',
    email:    'Zadejte prosím platnou e-mailovou adresu.',
    phone:    'Zadejte prosím platné telefonní číslo.',
    interest: 'Vyberte prosím jednu z možností.',
    consent:  'Pro odeslání je potřeba souhlas se zpracováním osobních údajů.'
  }
};

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
   Form — validace + Web3Forms odeslání
   ---------------------------------------------------------- */
function initForm() {
  var form = document.getElementById('lead-form');
  var button = document.getElementById('form-submit-btn');
  var feedback = document.getElementById('form-feedback');

  if (!form || !button) return;

  // Uchováme si originální label tlačítka pro pozdější reset
  var btnLabelEl = button.querySelector('.btn-label');
  var originalBtnLabel = btnLabelEl ? btnLabelEl.textContent : button.textContent;

  // Vyčisti chybu při úpravě pole
  form.querySelectorAll('.form-input, .consent-checkbox').forEach(function (input) {
    var eventName = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
    input.addEventListener(eventName, function () {
      clearFieldError(input);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Pokud je tlačítko v "sent" stavu, nic nedělej
    if (button.classList.contains('sent')) return;

    // Validace
    var errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      showFieldErrors(form, errors);
      focusFirstError(form, errors);
      return;
    }

    // Skryj předchozí feedback
    hideFeedback(feedback);

    // Loading stav
    setButtonLoading(button, btnLabelEl, true);

    // Sestav payload
    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) {
      // Checkbox "consent" posíláme jako čitelný text
      if (key === 'consent') {
        payload[key] = 'Ano';
      } else {
        payload[key] = value;
      }
    });

    // Odeslání
    fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          handleSuccess(form, button, btnLabelEl, feedback, originalBtnLabel);
        } else {
          var msg = (result.data && result.data.message) ? result.data.message : FORM_MESSAGES.error;
          handleError(button, btnLabelEl, feedback, msg, originalBtnLabel);
        }
      })
      .catch(function () {
        handleError(button, btnLabelEl, feedback, FORM_MESSAGES.network, originalBtnLabel);
      });
  });
}

/* ----- Validace ----- */
function validateForm(form) {
  var errors = {};

  var name     = form.querySelector('#name');
  var company  = form.querySelector('#company');
  var email    = form.querySelector('#email');
  var phone    = form.querySelector('#phone');
  var interest = form.querySelector('#interest');
  var consent  = form.querySelector('#consent');

  if (name && !name.value.trim()) {
    errors.name = FORM_MESSAGES.validation.name;
  }
  if (company && !company.value.trim()) {
    errors.company = FORM_MESSAGES.validation.company;
  }
  if (email && !isValidEmail(email.value)) {
    errors.email = FORM_MESSAGES.validation.email;
  }
  // Telefon je nepovinný — validujeme jen když je vyplněný
  if (phone && phone.value.trim() && !isValidPhone(phone.value)) {
    errors.phone = FORM_MESSAGES.validation.phone;
  }
  if (interest && !interest.value) {
    errors.interest = FORM_MESSAGES.validation.interest;
  }
  if (consent && !consent.checked) {
    errors.consent = FORM_MESSAGES.validation.consent;
  }

  return errors;
}

function isValidEmail(value) {
  if (!value) return false;
  // Jednoduchá a spolehlivá e-mail kontrola
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(value.trim());
}

function isValidPhone(value) {
  if (!value) return false;
  // Povolené: číslice, mezery, +, -, ( ). Musí obsahovat alespoň 9 číslic.
  var cleaned = value.replace(/[\s\-()]/g, '');
  var re = /^\+?\d{9,15}$/;
  return re.test(cleaned);
}

/* ----- Zobrazení chyb ----- */
function showFieldErrors(form, errors) {
  Object.keys(errors).forEach(function (fieldName) {
    var input = form.querySelector('[name="' + fieldName + '"]');
    if (!input) return;

    var field = input.closest('.form-field') || input.closest('.form-consent');
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');

    if (field) field.classList.add('has-error');
    if (errorEl) errorEl.textContent = errors[fieldName];

    // Consent checkbox — speciální vizuální stav
    if (fieldName === 'consent') {
      var box = form.querySelector('.consent-box');
      if (box) box.classList.add('has-error');
    }
  });
}

function clearFieldError(input) {
  var field = input.closest('.form-field') || input.closest('.form-consent');
  if (field) field.classList.remove('has-error');

  var name = input.getAttribute('name');
  if (name) {
    var errorEl = document.querySelector('[data-error-for="' + name + '"]');
    if (errorEl) errorEl.textContent = '';
  }

  if (input.id === 'consent') {
    var box = document.querySelector('.consent-box');
    if (box) box.classList.remove('has-error');
  }
}

function focusFirstError(form, errors) {
  var firstField = Object.keys(errors)[0];
  if (!firstField) return;

  var input = form.querySelector('[name="' + firstField + '"]');
  if (input && typeof input.focus === 'function') {
    input.focus({ preventScroll: false });
  }
}

/* ----- Loading / button state ----- */
function setButtonLoading(button, labelEl, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.classList.add('is-loading');
    if (labelEl) {
      labelEl.textContent = 'Odesíláme…';
    } else {
      button.textContent = 'Odesíláme…';
    }
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
  }
}

function resetButton(button, labelEl, originalLabel) {
  button.disabled = false;
  button.classList.remove('is-loading', 'sent');
  if (labelEl) {
    labelEl.textContent = originalLabel;
  } else {
    button.textContent = originalLabel;
  }
}

/* ----- Feedback (success / error) ----- */
function showFeedback(feedback, message, type) {
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove('form-feedback--success', 'form-feedback--error');
  feedback.classList.add('form-feedback--' + type);
  feedback.hidden = false;
}

function hideFeedback(feedback) {
  if (!feedback) return;
  feedback.hidden = true;
  feedback.textContent = '';
  feedback.classList.remove('form-feedback--success', 'form-feedback--error');
}

function scrollToFeedback(feedback) {
  if (!feedback) return;

  var navOffset = window.innerWidth <= 560 ? 76 : 88;
  var y = feedback.getBoundingClientRect().top + window.scrollY - navOffset - 24;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

/* ----- Úspěch / chyba ----- */
function handleSuccess(form, button, labelEl, feedback, originalLabel) {
  setButtonLoading(button, labelEl, false);

  // Vizuální stav tlačítka (zachová zelenou z původního CSS)
  button.classList.add('sent');
  if (labelEl) {
    labelEl.textContent = '✓  Poptávka odeslána';
  }

  // Feedback zpráva
  showFeedback(feedback, FORM_MESSAGES.success, 'success');

  // Reset formuláře (bez dotčení hidden polí a odeslaného tlačítka)
  resetFormFields(form);

  // Scroll na feedback
  setTimeout(function () {
    scrollToFeedback(feedback);
  }, 120);
}

function handleError(button, labelEl, feedback, message, originalLabel) {
  resetButton(button, labelEl, originalLabel);
  showFeedback(feedback, message, 'error');
  setTimeout(function () {
    scrollToFeedback(feedback);
  }, 120);
}

function resetFormFields(form) {
  // Vyčistí viditelná pole, zachová hidden (access_key, subject, from_name, botcheck)
  form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(function (el) {
    el.value = '';
  });
  form.querySelectorAll('select').forEach(function (el) {
    el.selectedIndex = 0;
  });
  var consent = form.querySelector('#consent');
  if (consent) consent.checked = false;

  // Vyčisti případné chyby
  form.querySelectorAll('.has-error').forEach(function (el) {
    el.classList.remove('has-error');
  });
  form.querySelectorAll('.form-error').forEach(function (el) {
    el.textContent = '';
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