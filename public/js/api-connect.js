// Connects the landing page to the backend API
// Fetches services and published projects dynamically

(function () {
  const API_BASE = '/api/v1';

  // --- Services ---
  async function loadServices() {
    const container = document.getElementById('api-services');
    if (!container) return;

    try {
      const res = await fetch(`${API_BASE}/services?active=true`);
      const data = await res.json();
      if (!data.success || !data.data.length) return;

      container.innerHTML = data.data
        .map(
          (s, i) => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} fade-in">
          <div class="${i % 2 !== 0 ? 'md:order-2' : ''}">
            <span class="text-7xl font-bold text-white/10">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="text-2xl font-bold mt-2">${esc(s.title)}</h3>
            <p class="text-white/60 mt-4 leading-relaxed">${esc(s.description || '')}</p>
          </div>
          <div class="${i % 2 !== 0 ? 'md:order-1' : ''}">
            ${s.icon_name ? `<span class="material-symbols-outlined text-6xl text-white/20">${esc(s.icon_name)}</span>` : ''}
          </div>
        </div>
      `
        )
        .join('<hr class="border-white/10 my-12" />');
    } catch {
      // Silently fail — static content remains
    }
  }

  // --- Published Projects ---
  async function loadProjects() {
    const container = document.getElementById('api-projects');
    if (!container) return;

    try {
      const res = await fetch(`${API_BASE}/projects/published`);
      const data = await res.json();
      if (!data.success || !data.data.length) return;

      container.innerHTML = data.data
        .map(
          (p) => `
        <div class="portfolio-item fade-in">
          <img data-src="${esc(p.cover_image_url || '')}" alt="${esc(p.title)}" loading="lazy" class="w-full h-full object-cover" />
          <div class="portfolio-overlay">
            <span class="text-xs tracking-widest uppercase text-white/60">${esc(p.category || '')}</span>
            <h3 class="text-lg font-bold mt-1">${esc(p.title)}</h3>
          </div>
        </div>
      `
        )
        .join('');
    } catch {
      // Silently fail
    }
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  // Run after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadProjects();
  });
})();
