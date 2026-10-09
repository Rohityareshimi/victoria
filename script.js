/**
 * Victoria Transport Co. — script.js
 * Handles: navbar scroll, mobile menu, active nav links,
 *          scroll animations, back-to-top, footer year.
 */

'use strict';

// ── Utility: debounce ──────────────────────────────────────────
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// ── DOM References ────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const backToTop   = document.getElementById('back-to-top');
const footerYear  = document.getElementById('footer-year');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id], div[id]');

// ── Footer Year ───────────────────────────────────────────────
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ── Navbar: scroll shadow ─────────────────────────────────────
function onScroll() {
  const scrollY = window.scrollY;

  // Add shadow on scroll
  if (scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show / hide back-to-top
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link highlighting
  updateActiveNavLink();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Hamburger Mobile Menu ─────────────────────────────────────
if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ── Active Nav Link (scroll spy) ─────────────────────────────
function updateActiveNavLink() {
  const scrollY    = window.scrollY;
  const navHeight  = navbar ? navbar.offsetHeight : 72;
  const threshold  = navHeight + 40;

  let currentSection = '';

  document.querySelectorAll('section[id]').forEach(function (sec) {
    const top = sec.offsetTop - threshold;
    if (scrollY >= top) {
      currentSection = sec.getAttribute('id');
    }
  });

  allNavLinks.forEach(function (link) {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

// ── Scroll-triggered Animations (IntersectionObserver) ────────
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.about-card, .office-card, .contact-info-card, ' +
    '.section-header, .contact-cta-banner'
  );

  targets.forEach(function (el) {
    el.classList.add('animate-on-scroll');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    targets.forEach(function (el) {
      el.classList.add('in-view');
    });
  }
}

// ── Staggered card animation ──────────────────────────────────
function initStaggeredCards() {
  const cardGroups = [
    '.about-grid .about-card',
    '.offices-grid .office-card',
    '.contact-grid .contact-info-card'
  ];

  cardGroups.forEach(function (selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(function (card, index) {
      card.style.transitionDelay = (index * 0.1) + 's';
    });
  });
}

// ── Back to Top ───────────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

// ── Telephone link pulse effect ───────────────────────────────
// Adds a subtle pulse to phone links to draw attention
function initPhoneLinkEffects() {
  const phoneLinks = document.querySelectorAll('.phone-link, .contact-action-link');
  phoneLinks.forEach(function (link) {
    if (link.getAttribute('href') && link.getAttribute('href').startsWith('tel:')) {
      link.addEventListener('mouseenter', function () {
        this.style.letterSpacing = '0.03em';
      });
      link.addEventListener('mouseleave', function () {
        this.style.letterSpacing = '';
      });
    }
  });
}

// ── Logo click → scroll to top ────────────────────────────────
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  navLogo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initStaggeredCards();
  initPhoneLinkEffects();
  onScroll(); // set initial state
});
