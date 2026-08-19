// DARK STAR CULINARY ENGINE
document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initScrollHeader();
  initGallery();
  initPrivateEventForm();
});

// Canvas Particle Engine (Floating embers)
function initParticleBackground() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width < 768 ? 25 : 50, 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * 0.02 + 0.005
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(223, 178, 96, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#dfb260';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

function initScrollHeader() {
  const header = document.querySelector('.dsc-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Gallery Lightbox & Filtering
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Multi-Step Form Logic for Private Events Intake
function initPrivateEventForm() {
  const form = document.getElementById('private-event-form');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 3;
  const nextBtn = document.getElementById('next-step-btn');
  const prevBtn = document.getElementById('prev-step-btn');
  const submitBtn = document.getElementById('submit-inquiry-btn');
  const steps = document.querySelectorAll('.form-step');
  const nodes = document.querySelectorAll('.step-node');

  function updateSteps() {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === currentStep);
    });

    nodes.forEach((node, idx) => {
      node.classList.toggle('active', idx + 1 === currentStep);
      node.classList.toggle('completed', idx + 1 < currentStep);
    });

    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep < totalSteps) {
        currentStep++;
        updateSteps();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateSteps();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Save inquiry to local safe storage for demonstration / backend link
      const inquiries = JSON.parse(localStorage.getItem('dsc_inquiries') || '[]');
      inquiries.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem('dsc_inquiries', JSON.stringify(inquiries));

      const statusBox = document.getElementById('form-status-message');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <div class="disclaimer-box" style="background: rgba(223, 178, 96, 0.15); border-color: var(--accent-gold);">
            <h4 style="font-family:var(--font-serif); color:var(--accent-gold); margin-bottom:0.5rem;">Inquiry Received</h4>
            <p>Thank you for submitting your event request. Please note: <strong>This request does NOT constitute a confirmed booking</strong>. Our Culinary Director will review your specifications and contact you directly within 24-48 hours.</p>
          </div>
        `;
      }
      form.reset();
    });
  }
}
