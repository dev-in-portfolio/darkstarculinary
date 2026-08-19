// ==========================================================================
// DARK STAR CULINARY — CLIENT ENGINE
// Lightbox Gallery, Mobile Nav, Multi-Step Form Validation & Netlify Submission
// Zero localStorage persistence.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initLightbox();
  initMultiStepForm();
  initFormSuccessCheck();
});

// 1. MOBILE NAVIGATION TOGGLE
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.culinary-nav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('is-active');
    toggleBtn.setAttribute('aria-expanded', isActive);
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// 2. LIGHTBOX GALLERY ENGINE
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalSub = modal.querySelector('.lightbox-sub');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-nav.prev');
  const nextBtn = modal.querySelector('.lightbox-nav.next');

  const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let currentIndex = 0;

  if (triggers.length === 0) return;

  function openLightbox(index) {
    currentIndex = index;
    const trigger = triggers[currentIndex];
    const src = trigger.getAttribute('data-lightbox-src');
    const title = trigger.getAttribute('data-lightbox-title') || '';
    const category = trigger.getAttribute('data-lightbox-category') || '';

    modalImg.src = src;
    modalTitle.textContent = title;
    modalSub.textContent = category;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => openLightbox(idx));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      openLightbox(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % triggers.length;
      openLightbox(currentIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

// 3. MULTI-STEP PRIVATE EVENT INTAKE FORM VALIDATOR
function initMultiStepForm() {
  const form = document.getElementById('private-event-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const dots = Array.from(form.querySelectorAll('.step-dot'));
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, idx) => {
      step.classList.toggle('is-active', idx === stepIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === stepIndex);
    });
    currentStep = stepIndex;
  }

  form.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepEl = steps[currentStep];
      const inputs = Array.from(currentStepEl.querySelectorAll('input, select, textarea'));
      
      // Validate current step required inputs
      let isValid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
        }
      });

      if (isValid && currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  form.querySelectorAll('[data-prev-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  });
}

// 4. NETLIFY FORM SUCCESS NOTICE CHECK
function initFormSuccessCheck() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === 'true') {
    const eventForm = document.getElementById('private-event-form');
    const contactForm = document.querySelector('form[name="general-contact"]');
    const targetForm = eventForm || contactForm;

    if (targetForm) {
      const banner = document.createElement('div');
      banner.className = 'success-banner';
      banner.innerHTML = `
        <svg style="width:24px; height:24px; fill:currentColor;" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <div>
          <strong>Inquiry Submitted Successfully</strong>
          <p style="font-size:0.85rem; margin-top:0.2rem;">Thank you for contacting Dark Star Culinary. We will review your event details and reach out regarding availability and next steps.</p>
        </div>
      `;
      targetForm.parentNode.insertBefore(banner, targetForm);
      targetForm.reset();
    }
  }
}
