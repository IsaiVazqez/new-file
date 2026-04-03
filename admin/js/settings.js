const SiteSettings = {
  data: [],

  async load() {
    const res = await api.get('/api/v1/settings');
    if (res?.success) this.data = res.data;
    this.render();
  },

  render() {
    const categories = {
      general: document.getElementById('settings-general'),
      contacto: document.getElementById('settings-contacto'),
      redes: document.getElementById('settings-redes'),
    };

    // Clear all
    Object.values(categories).forEach(el => { if (el) el.innerHTML = ''; });

    this.data.forEach(setting => {
      const container = categories[setting.category];
      if (!container) return;

      const div = document.createElement('div');
      div.className = 'form-group';
      div.style.marginBottom = '1rem';

      const label = document.createElement('label');
      label.textContent = setting.label || setting.key;
      label.style.fontSize = '0.8rem';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = setting.value;
      input.dataset.key = setting.key;
      input.className = 'setting-input';
      input.placeholder = setting.label || '';

      div.appendChild(label);
      div.appendChild(input);
      container.appendChild(div);
    });
  },

  async saveAll() {
    const inputs = document.querySelectorAll('.setting-input');
    const items = [];
    inputs.forEach(input => {
      items.push({ key: input.dataset.key, value: input.value });
    });

    const loader = Toast.loading('Guardando configuración...');
    const res = await api.put('/api/v1/settings', { items });
    Toast.dismiss(loader);
    if (res?.success) {
      Toast.success('Configuración guardada');
      await this.load();
    } else {
      Toast.error('Error al guardar');
    }
  },
};
