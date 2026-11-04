/* =========================================================
   GUSTAVO MÔNACO YONEKURA — PORTFÓLIO
   JavaScript — Interactions, Animations, UI Logic
   ========================================================= */

'use strict';

// ============ UTILS ============
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ CURSOR ============
(function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

// ============ HEADER SCROLL ============
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

// ============ MOBILE MENU ============
(function initMobileMenu() {
  const burger = $('#burger');
  const overlay = $('#navOverlay');
  const overlayLinks = $$('.overlay-link');
  if (!burger || !overlay) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    burger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    isOpen = false;
    burger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => isOpen ? close() : open());

  overlayLinks.forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
})();

// ============ SCROLL REVEAL ============
(function initReveal() {
  if (prefersReducedMotion) {
    $$('.rv').forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('in');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -6% 0px'
  });

  $$('.rv').forEach(el => observer.observe(el));
})();

// ============ SMOOTH SCROLLING ============
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = $('#header')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'instant' : 'smooth'
      });
    });
  });
})();

// ============ ACTIVE NAV LINK ON SCROLL ============
(function initActiveNav() {
  const sections = $$('section[id], div[id]');
  const navLinks = $$('.nav-link');
  const headerHeight = 100;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= headerHeight + 10) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

// ============ FOOTER YEAR ============
(function initYear() {
  const yearEl = $('#footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ============ CONTACT FORM ============
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = $('#nome')?.value.trim();
    const email = $('#email')?.value.trim();
    const mensagem = $('#mensagem')?.value.trim();

    // Simple validation
    if (!nome || !email || !mensagem) {
      showFormMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('.form-submit');
    const originalText = btn.querySelector('span').textContent;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Enviando...';

    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = originalText;
      showFormMessage('Mensagem enviada! Em breve entrarei em contato.', 'success');
      form.reset();
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(message, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      form.appendChild(msg);
    }

    msg.textContent = message;
    msg.className = `form-message form-message--${type}`;
    msg.style.cssText = `
      margin-top: 12px; padding: 12px 16px;
      border-radius: 6px; font-size: 13px; font-weight: 500;
      background: ${type === 'success' ? 'rgba(94,196,160,0.1)' : 'rgba(255,80,80,0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(94,196,160,0.3)' : 'rgba(255,80,80,0.3)'};
      color: ${type === 'success' ? '#5ec4a0' : '#ff7070'};
    `;

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.5s';
      setTimeout(() => msg.remove(), 500);
    }, 5000);
  }
})();

// ============ HERO PARALLAX ============
(function initParallax() {
  if (prefersReducedMotion) return;

  const heroGlow = $('.hero-glow');
  if (!heroGlow) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.5) {
      heroGlow.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
})();

// ============ MARQUEE PAUSE ON HOVER ============
(function initMarquee() {
  const track = $('.marquee-track');
  if (!track) return;

  const wrap = track.parentElement;
  wrap.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  wrap.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

// ============ PROJECT HOVER EFFECTS ============
(function initProjectHover() {
  const items = $$('.projeto-item');
  items.forEach(item => {
    const frame = item.querySelector('.preview-frame');
    if (!frame) return;

    item.addEventListener('mouseenter', () => {
      frame.style.boxShadow = '0 24px 60px rgba(0,0,0,0.6)';
    });
    item.addEventListener('mouseleave', () => {
      frame.style.boxShadow = '';
    });
  });
})();

// ============ NAV LINK ACTIVE STYLE ============
(function addNavActiveStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--text);
    }
    .nav-link.active::after {
      width: 100%;
    }
  `;
  document.head.appendChild(style);
})();

// ============ TYPED EFFECT FOR TERMINAL ============
(function initTerminalEffect() {
  const terminal = $('.aw-terminal-body');
  if (!terminal || prefersReducedMotion) return;

  const lines = [
    '▮ Iniciando AutoWork...',
    '▮ Carregando rotinas...',
    '▮ Sistema pronto.',
    '▮ Aguardando instrução...',
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentText = '';
  let isTyping = false;

  function typeLine() {
    if (!isTyping) return;
    if (charIndex < lines[lineIndex].length) {
      currentText += lines[lineIndex][charIndex];
      terminal.textContent = currentText;
      charIndex++;
      setTimeout(typeLine, 60);
    } else {
      setTimeout(() => {
        lineIndex = (lineIndex + 1) % lines.length;
        charIndex = 0;
        currentText = '';
        typeLine();
      }, 1800);
    }
  }

  // Start when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isTyping) {
        isTyping = true;
        typeLine();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(terminal);
})();

// ============ COUNTER ANIMATION ============
(function initCounters() {
  if (prefersReducedMotion) return;

  const counters = $$('.counter-num');
  const targets = ['02', '∞', '01'];

  counters.forEach((counter, i) => {
    if (targets[i] === '∞') return;

    const target = parseInt(targets[i], 10);
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * target);
            counter.textContent = current.toString().padStart(2, '0');
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
})();

// ============ SECTION TRANSITIONS ============
(function initSectionTransitions() {
  if (prefersReducedMotion) return;

  const sections = $$('section');
  sections.forEach(section => {
    section.style.transition = 'opacity 0.3s ease';
  });
})();
