/**
 * Instagram Feed Component
 * Fetches latest posts via Netlify function and renders them in a grid.
 */

const IG_ICON = '<svg class="size-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>';

const renderSkeletons = (grid) => {
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'ig-item ig-skeleton';
    skeleton.innerHTML = '<div class="ig-image"></div>';
    grid.appendChild(skeleton);
  }
};

const renderPosts = (grid, posts) => {
  grid.innerHTML = '';
  posts.forEach((post) => {
    const a = document.createElement('a');
    a.href = post.permalink;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'ig-item group';
    a.innerHTML = `
      <div class="ig-image" style="background-image: url('${post.url}');"></div>
      <div class="ig-hover">${IG_ICON}</div>
    `;
    grid.appendChild(a);
  });
};

const renderError = (grid) => {
  grid.innerHTML = `
    <div class="ig-fallback">
      <p>No se pudieron cargar los posts.</p>
      <a href="https://www.instagram.com/new.file" target="_blank" rel="noopener noreferrer">
        Ver perfil en Instagram
      </a>
    </div>
  `;
};

const initInstagramFeed = () => {
  const grid = document.querySelector('.ig-grid');
  if (!grid) return;

  // Show skeleton loaders
  renderSkeletons(grid);

  fetch('/.netlify/functions/instagram')
    .then((res) => {
      if (!res.ok) throw new Error('API error');
      return res.json();
    })
    .then((data) => {
      if (data.posts && data.posts.length > 0) {
        renderPosts(grid, data.posts);
      } else {
        renderError(grid);
      }
    })
    .catch(() => {
      // Keep the static fallback images if API fails
      // Only replace if grid has skeletons (no static content)
      const hasStaticContent = grid.querySelector('a.ig-item');
      if (!hasStaticContent) {
        renderError(grid);
      }
    });
};

window.initInstagramFeed = initInstagramFeed;
