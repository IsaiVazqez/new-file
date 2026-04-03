/**
 * Header Component - NewFile Studio
 * Reusable header with navigation, mobile menu, and scroll behavior.
 */

const getBasePath = () => {
  const isFile = window.location.protocol === 'file:';
  if (isFile) {
    return '';
  }
  return '/';
};

const getCurrentPage = () => {
  const path = window.location.pathname;
  const filename = path.split('/').pop();

  if (!filename || filename === '' || filename === 'index.html') {
    return 'index';
  }

  return filename.replace('.html', '');
};

const buildHref = (page) => {
  const base = getBasePath();
  if (page === 'index') {
    return base ? base : 'index.html';
  }
  return `${base}${page}.html`;
};

const headerHTML = () => `
<header class="site-header" id="site-header">
  <div class="header-inner">
    <div class="header-left">
      <a href="${buildHref('index')}" class="header-logo" data-testid="logo-link">
        <img src="${getBasePath()}assets/images/logo-blanco.png" alt="NewFile Studio" />
        <span>NewFile</span>
      </a>
      <nav class="header-nav" data-testid="main-nav">
        <a href="${buildHref('index')}" data-page="index" data-testid="nav-inicio">Inicio</a>
        <a href="${buildHref('portafolio')}" data-page="portafolio" data-testid="nav-portafolio">Portafolio</a>
        <a href="${buildHref('servicios')}" data-page="servicios" data-testid="nav-servicios">Servicios</a>
        <a href="${buildHref('equipo')}" data-page="equipo" data-testid="nav-equipo">Equipo</a>
        <a href="${buildHref('contacto')}" data-page="contacto" data-testid="nav-contacto">Contacto</a>
      </nav>
    </div>
    <div class="header-right">
      <button class="mobile-menu-btn" aria-label="Men\u00fa" data-testid="mobile-menu-toggle">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-menu" id="mobile-menu">
  <button class="mobile-menu-close" aria-label="Cerrar men\u00fa">
    <span class="material-symbols-outlined">close</span>
  </button>
  <nav class="mobile-menu-nav">
    <a href="${buildHref('index')}" data-page="index">Inicio</a>
    <a href="${buildHref('portafolio')}" data-page="portafolio">Portafolio</a>
    <a href="${buildHref('servicios')}" data-page="servicios">Servicios</a>
    <a href="${buildHref('equipo')}" data-page="equipo">Equipo</a>
    <a href="${buildHref('contacto')}" data-page="contacto">Contacto</a>
  </nav>
</div>
`;

const markActiveLinks = () => {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('[data-page]');

  navLinks.forEach((link) => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
};

const setupScrollBehavior = () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const setupMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (!mobileMenu || !menuBtn) return;

  const openMenu = () => {
    mobileMenu.classList.add('active');
    document.body.classList.add('overflow-hidden');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  };

  menuBtn.addEventListener('click', openMenu);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
};

const renderHeader = () => {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) {
    console.warn('header.js: #header-placeholder not found in the DOM.');
    return;
  }

  placeholder.innerHTML = headerHTML();
  markActiveLinks();
  setupScrollBehavior();
  setupMobileMenu();
};

// Expose globally for non-module usage
window.renderHeader = renderHeader;
