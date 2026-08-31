import { galleryItems } from './gallery-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  renderGallery();
  initLightbox();
  initMultiStepForm();
  initFormSuccessCheck();
  initDateMinimum();
});

function initMobileNav() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.culinary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const active = nav.classList.toggle('is-active');
    toggle.setAttribute('aria-expanded', String(active));
  });
  document.addEventListener('click', (event) => {
    if (!toggle.contains(event.target) && !nav.contains(event.target)) {
      nav.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = galleryItems.map((item, index) => `
    <article class="gallery-card" data-category="${item.category}" data-orientation="${item.orientation || 'portrait'}"
      data-lightbox-src="${item.src}" data-lightbox-title="${item.title}" data-lightbox-category="${item.label}"
      tabindex="0" role="button" aria-label="Expand ${item.title}">
      <div class="gallery-img-wrapper">
        <img src="${item.src}" alt="${item.alt || item.title}" loading="${index < 8 ? 'eager' : 'lazy'}" decoding="async">
      </div>
      <div class="gallery-meta"><strong>${item.title}</strong><span>${item.label}</span></div>
    </article>
  `).join('');

  const buttons = Array.from(document.querySelectorAll('[data-gallery-filter]'));
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.galleryFilter;
      buttons.forEach(btn => btn.classList.toggle('is-active', btn === button));
      grid.querySelectorAll('.gallery-card').forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
      });
      refreshLightbox();
    });
  });
}

let lightboxCleanup = null;
function initLightbox() { refreshLightbox(); }
function refreshLightbox() {
  if (lightboxCleanup) lightboxCleanup();
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  const modalImg = modal.querySelector('.lightbox-img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalSub = modal.querySelector('.lightbox-sub');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-nav.prev');
  const nextBtn = modal.querySelector('.lightbox-nav.next');
  const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]')).filter(el => !el.classList.contains('is-hidden'));
  let currentIndex = 0;
  if (!triggers.length) return;

  const open = (index) => {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    modalImg.src = trigger.dataset.lightboxSrc;
    modalImg.alt = trigger.dataset.lightboxTitle || '';
    modalTitle.textContent = trigger.dataset.lightboxTitle || '';
    modalSub.textContent = trigger.dataset.lightboxCategory || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    modalImg.src='';
    document.body.style.overflow='';
  };
  const handlers = [];
  triggers.forEach((trigger, idx) => {
    const click = () => open(idx);
    const key = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); } };
    trigger.addEventListener('click', click); trigger.addEventListener('keydown', key);
    handlers.push(() => { trigger.removeEventListener('click', click); trigger.removeEventListener('keydown', key); });
  });
  const closeClick = close, prevClick = () => open(currentIndex-1), nextClick = () => open(currentIndex+1);
  closeBtn?.addEventListener('click',closeClick); prevBtn?.addEventListener('click',prevClick); nextBtn?.addEventListener('click',nextClick);
  const backdrop = (e) => { if (e.target === modal) close(); };
  modal.addEventListener('click',backdrop);
  const keydown = (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prevClick();
    if (e.key === 'ArrowRight') nextClick();
  };
  document.addEventListener('keydown',keydown);
  lightboxCleanup = () => {
    handlers.forEach(fn => fn()); closeBtn?.removeEventListener('click',closeClick); prevBtn?.removeEventListener('click',prevClick); nextBtn?.removeEventListener('click',nextClick); modal.removeEventListener('click',backdrop); document.removeEventListener('keydown',keydown);
  };
}

function initMultiStepForm() {
  const form = document.getElementById('private-event-form');
  if (!form) return;
  const steps = Array.from(form.querySelectorAll('.form-step'));
  const dots = Array.from(form.querySelectorAll('.step-dot'));
  let current = 0;
  const show = (index) => {
    steps.forEach((step,i)=>step.classList.toggle('is-active',i===index));
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    current=index;
  };
  form.querySelectorAll('[data-next-step]').forEach(button => button.addEventListener('click', () => {
    const inputs = Array.from(steps[current].querySelectorAll('input,select,textarea'));
    const invalid = inputs.find(input => !input.checkValidity());
    if (invalid) return invalid.reportValidity();
    if (current < steps.length-1) show(current+1);
  }));
  form.querySelectorAll('[data-prev-step]').forEach(button => button.addEventListener('click', () => { if (current>0) show(current-1); }));
}

function initFormSuccessCheck() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') !== 'true') return;
  const form = document.getElementById('private-event-form') || document.querySelector('form[name="general-contact"]');
  if (!form) return;
  const banner = document.createElement('div');
  banner.className='success-banner';
  banner.innerHTML='<strong>Inquiry received.</strong><div style="margin-top:.25rem;color:#d7d0c8;font-size:.9rem;">Dark Star Culinary will review the details and reply with availability and next steps.</div>';
  form.parentNode.insertBefore(banner, form);
  form.reset();
  history.replaceState({}, document.title, location.pathname);
}

function initDateMinimum() {
  const dateInput = document.getElementById('event-date');
  if (!dateInput) return;
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  dateInput.min = local;
}