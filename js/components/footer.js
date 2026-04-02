/**
 * Footer Component — NewFile Studio
 * Reusable footer for all pages.
 */

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <!-- Brand column -->
      <div class="footer-brand">
        <h4 class="footer-title">NewFile</h4>
        <p class="footer-subtitle">Estudio de Arquitectura &amp; Visualización</p>
      </div>

      <!-- Info columns -->
      <div class="footer-columns">
        <!-- Contact -->
        <div class="footer-col">
          <h5>Contacto</h5>
          <ul>
            <li>
              <span class="material-symbols-outlined">call</span>
              <span>+52 (999) 123 4567</span>
            </li>
            <li>
              <span class="material-symbols-outlined">mail</span>
              <a href="mailto:hola@newfile.studio">hola@newfile.studio</a>
            </li>
          </ul>
        </div>

        <!-- Location -->
        <div class="footer-col">
          <h5>Ubicación</h5>
          <p>Calle 60 #450, Centro Histórico<br>Mérida, Yucatán, CP 97000<br>México</p>
        </div>

        <!-- Social -->
        <div class="footer-col">
          <h5>Social</h5>
          <div class="social-links">
            <a href="#" aria-label="Instagram">
              <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <p>&copy; <span id="footer-year"></span> NewFile Studio. Todos los derechos reservados.</p>
      <div class="footer-legal">
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
      </div>
    </div>
  </div>
</footer>
`;

/**
 * Renders the footer into #footer-placeholder and sets the copyright year.
 */
const renderFooter = () => {
  const placeholder = document.querySelector('#footer-placeholder');
  if (!placeholder) return;

  placeholder.innerHTML = FOOTER_HTML;

  const yearEl = document.querySelector('#footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// Expose globally for non-module usage
window.renderFooter = renderFooter;
