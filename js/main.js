/**
 * NewFile Studio — Main JavaScript Orchestrator
 * Vanilla JS (no modules). Expects header.js and footer.js loaded before this.
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Page Loader
     Waits for all images to load, then reveals content.
     ------------------------------------------------ */
  const initLoader = () => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const progressBar = loader.querySelector('.loader-progress');
    const images = Array.from(document.querySelectorAll('img, [style*="background-image"]'));
    let loaded = 0;
    const total = Math.max(images.length, 1);

    const updateProgress = () => {
      loaded++;
      const pct = Math.min((loaded / total) * 100, 100);
      if (progressBar) progressBar.style.width = pct + '%';

      if (loaded >= total) {
        finishLoading();
      }
    };

    const finishLoading = () => {
      // Small delay for visual polish
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.classList.add('page-loaded');
        // Remove loader from DOM after transition
        setTimeout(() => {
          loader.remove();
        }, 700);
      }, 400);
    };

    // Track image loading
    images.forEach((el) => {
      if (el.tagName === 'IMG') {
        if (el.complete) {
          updateProgress();
        } else {
          el.addEventListener('load', updateProgress);
          el.addEventListener('error', updateProgress);
        }
      } else {
        // Background images — extract URL and preload
        const style = el.getAttribute('style') || '';
        const match = style.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          const img = new Image();
          img.onload = updateProgress;
          img.onerror = updateProgress;
          img.src = match[1];
        } else {
          updateProgress();
        }
      }
    });

    // Safety timeout — never block longer than 6 seconds
    setTimeout(finishLoading, 6000);
  };

  /* ------------------------------------------------
     Scroll Animations (IntersectionObserver)
     ------------------------------------------------ */
  const initScrollAnimations = () => {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .blur-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  };

  /* ------------------------------------------------
     Projects Carousel
     ------------------------------------------------ */
  const initCarousel = () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const firstItem = track.querySelector('.carousel-item');
    if (!firstItem) return;

    const getScrollAmount = () => {
      const gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap, 10) || 0;
      return firstItem.offsetWidth + gap;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
    }
  };

  /* ------------------------------------------------
     Smooth Scroll for Anchor Links
     ------------------------------------------------ */
  const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  };

  /* ------------------------------------------------
     Contact Form Handler
     ------------------------------------------------ */
  const initContactForm = () => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const prev = form.parentNode.querySelector('.form-success-message');
      if (prev) prev.remove();

      const msg = document.createElement('div');
      msg.className = 'form-success-message';
      msg.textContent = 'Mensaje enviado correctamente';
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.4s ease';
      form.parentNode.insertBefore(msg, form.nextSibling);

      requestAnimationFrame(() => { msg.style.opacity = '1'; });
      form.reset();
    });
  };

  /* ------------------------------------------------
     Bootstrap
     ------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    // Render components
    if (typeof renderHeader === 'function') renderHeader();
    if (typeof renderFooter === 'function') renderFooter();

    // Init loader (tracks image loading)
    initLoader();

    // Init features
    initScrollAnimations();
    initCarousel();
    initSmoothScroll();
    initContactForm();
  });

})();
