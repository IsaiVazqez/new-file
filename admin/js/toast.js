const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(message, type = 'success') {
    this.init();

    const icons = {
      success: '✓',
      error: '✗',
      loading: '↻',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span><span>${message}</span>`;
    this.container.appendChild(toast);

    // Auto remove after animation
    if (type !== 'loading') {
      setTimeout(() => toast.remove(), 3500);
    }

    return toast;
  },

  success(msg) { return this.show(msg, 'success'); },
  error(msg) { return this.show(msg, 'error'); },
  loading(msg) { return this.show(msg || 'Cargando...', 'loading'); },

  dismiss(toast) {
    if (toast) toast.remove();
  },
};
