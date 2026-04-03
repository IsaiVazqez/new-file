// Lazy load images: swap data-src → src using IntersectionObserver
(function () {
  function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => {
      observer.observe(img);
    });
  } else {
    // Fallback: load all immediately
    document.querySelectorAll('img[data-src]').forEach(loadImage);
  }
})();
