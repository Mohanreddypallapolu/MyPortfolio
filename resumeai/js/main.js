/**
 * Pallapolu Mohan Reddy - Portfolio Interactive Scripts
 * Features: Interactive Hero Canvas, ScrollSpy, Scroll Reveal, 
 * Mobile Navigation, Resume Modal, Copy-to-Clipboard, Form Validation & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initHeroCanvas();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initResumeModal();
  initClipboardActions();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. Interactive Tech Particle Canvas (Hero Background)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = window.innerWidth < 768 ? 90 : 130;
  
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(99, 102, 241,';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 1.5;
          const dirY = (dy / dist) * force * 1.5;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    resize();
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ==========================================================================
   2. Sticky Navbar & ScrollSpy
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollPos = window.scrollY;

    // Navbar background toggle
    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active state
    let currentSectionId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const backdrop = document.getElementById('navBackdrop');
  const links = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu || !backdrop) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    toggleBtn.classList.add('active');
    navMenu.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    navMenu.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMenu();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}
/* ==========================================================================
   4. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Resume Viewer Modal
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const openButtons = document.querySelectorAll('.js-open-resume');
  const closeButton = document.getElementById('closeModalBtn');
  const backdrop = document.getElementById('modalOverlay');

  if (!modal) return;

  function openResume() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeResume);
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeResume();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   6. Copy to Clipboard
   ========================================================================== */
function initClipboardActions() {
  const copyButtons = document.querySelectorAll('.js-copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard-text');
      const label = btn.getAttribute('data-copy-label') || 'Information';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopySuccess(btn, label);
        }).catch(() => {
          fallbackCopyText(textToCopy, btn, label);
        });
      } else {
        fallbackCopyText(textToCopy, btn, label);
      }
    });
  });

  function fallbackCopyText(text, btn, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showCopySuccess(btn, label);
    } catch (err) {
      showToast('Failed to copy. Please select manually.', 'error');
    }
    document.body.removeChild(textArea);
  }

  function showCopySuccess(btn, label) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
    btn.style.borderColor = '#10b981';
    btn.style.color = '#34d399';

    showToast(`${label} copied to clipboard!`, 'success');

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2500);
  }
}

/* ==========================================================================
   7. Contact Form Frontend Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');
  const submitBtn = document.getElementById('submitBtn');

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  function setFieldError(field, message) {
    const parent = field.closest('.form-group');
    if (!parent) return;
    parent.classList.add('has-error');
    const errorSpan = parent.querySelector('.form-error-msg');
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearFieldError(field) {
    const parent = field.closest('.form-group');
    if (!parent) return;
    parent.classList.remove('has-error');
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => clearFieldError(field));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'Please enter your name.');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, 'Please enter a subject.');
      isValid = false;
    } else {
      clearFieldError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'Please write your message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (!isValid) return;

    // Simulate sending with nice button spinner
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending Message...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      form.reset();
      showToast('Thank you! Your message has been prepared for delivery.', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   8. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon-box" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon-box" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 400);
  }, 4000);
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}