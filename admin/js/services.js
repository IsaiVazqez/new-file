const Services = {
  list: [],
  imageFile: null,

  init() {
    const zone = document.getElementById('service-image-zone');
    const fileInput = document.getElementById('service-image-input');
    if (!zone || !fileInput) return;

    zone.addEventListener('click', (e) => {
      if (e.target.closest('.drop-zone-remove')) return;
      fileInput.click();
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) this.setImageFile(fileInput.files[0]);
    });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-active'); });
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-active'); });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-active');
      if (e.dataTransfer.files[0]) this.setImageFile(e.dataTransfer.files[0]);
    });
  },

  setImageFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { Toast.error('Solo JPG, PNG o WebP'); return; }
    if (file.size > 20 * 1024 * 1024) { Toast.error('Máximo 20MB'); return; }
    this.imageFile = file;
    const preview = document.getElementById('service-image-preview');
    const prompt = document.getElementById('service-image-prompt');
    const removeBtn = document.getElementById('service-image-remove');
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      prompt.style.display = 'none';
      removeBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  },

  removeImage() {
    this.imageFile = null;
    document.getElementById('service-image-preview').style.display = 'none';
    document.getElementById('service-image-prompt').style.display = 'block';
    document.getElementById('service-image-remove').style.display = 'none';
    document.getElementById('service-image-input').value = '';
    document.getElementById('s-image-url').value = '';
  },

  showExistingImage(url) {
    if (!url) return;
    const preview = document.getElementById('service-image-preview');
    const prompt = document.getElementById('service-image-prompt');
    const removeBtn = document.getElementById('service-image-remove');
    preview.src = url;
    preview.style.display = 'block';
    prompt.style.display = 'none';
    removeBtn.style.display = 'flex';
  },

  async load() {
    const res = await api.get('/api/v1/services');
    if (res?.success) this.list = res.data;
    this.render();
  },

  render() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!this.list.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem 0">No hay servicios aún.</p>';
      return;
    }

    this.list.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.draggable = true;
      card.dataset.id = s.id;
      card.dataset.index = i;
      card.dataset.testid = `service-card-${s.id}`;

      const imgHtml = s.image_url
        ? `<img src="${this.esc(s.image_url)}" alt="${this.esc(s.title)}" />`
        : `<div class="no-cover"><span>Sin imagen</span></div>`;

      const statusClass = s.is_active ? 'published' : 'draft';
      const statusLabel = s.is_active ? 'Activo' : 'Inactivo';

      card.innerHTML = `
        <div class="project-card-cover">
          ${imgHtml}
          <span class="card-order">${String(i + 1).padStart(2, '0')}</span>
          <span class="card-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="project-card-body">
          <h4>${this.esc(s.title)}</h4>
          <span class="card-category">${this.esc(s.description ? s.description.substring(0, 60) + (s.description.length > 60 ? '...' : '') : '')}</span>
        </div>
        <div class="project-card-actions">
          <button class="btn btn-outline" onclick="Services.edit(${s.id})" data-testid="btn-edit-service-${s.id}">Editar</button>
          <button class="btn btn-danger" onclick="Services.remove(${s.id})" data-testid="btn-delete-service-${s.id}">Eliminar</button>
        </div>
      `;

      this.addDragEvents(card);
      grid.appendChild(card);
    });
  },

  addDragEvents(card) {
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.index);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => { card.classList.remove('drag-over'); });
    card.addEventListener('drop', async (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const from = parseInt(e.dataTransfer.getData('text/plain'));
      const to = parseInt(card.dataset.index);
      if (from === to) return;
      const [moved] = this.list.splice(from, 1);
      this.list.splice(to, 0, moved);
      const items = this.list.map((s, i) => ({ id: s.id, order: i }));
      await api.patch('/api/v1/services/reorder', { items });
      Toast.success('Orden actualizado');
      this.render();
    });
  },

  openModal(service = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    form.reset();
    this.imageFile = null;

    // Reset image drop zone
    document.getElementById('service-image-preview').style.display = 'none';
    document.getElementById('service-image-prompt').style.display = 'block';
    document.getElementById('service-image-remove').style.display = 'none';
    document.getElementById('service-image-input').value = '';
    document.getElementById('s-image-url').value = '';

    document.getElementById('service-id').value = service ? service.id : '';
    if (service) {
      document.getElementById('s-title').value = service.title;
      document.getElementById('s-description').value = service.description || '';
      document.getElementById('s-link').value = service.link_url || '';
      document.getElementById('s-image-url').value = service.image_url || '';
      document.getElementById('s-active').checked = !!service.is_active;
      if (service.image_url) this.showExistingImage(service.image_url);
    }
    document.getElementById('service-modal-title').textContent = service ? 'Editar Servicio' : 'Nuevo Servicio';
    modal.classList.add('open');
  },

  closeModal() {
    document.getElementById('service-modal').classList.remove('open');
  },

  edit(id) {
    const service = this.list.find(s => s.id === id);
    if (service) this.openModal(service);
  },

  async save() {
    const id = document.getElementById('service-id').value;
    let imageUrl = document.getElementById('s-image-url').value;
    const loader = Toast.loading('Guardando servicio...');

    // Upload image if new file
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('image', this.imageFile);
      const uploadRes = await api.post('/api/v1/services/upload-image', formData);
      if (uploadRes?.success) {
        imageUrl = uploadRes.data.url;
      } else {
        Toast.dismiss(loader);
        Toast.error('Error al subir la imagen');
        return;
      }
    }

    const body = {
      title: document.getElementById('s-title').value,
      description: document.getElementById('s-description').value,
      icon_name: '',
      image_url: imageUrl,
      link_url: document.getElementById('s-link').value,
      is_active: document.getElementById('s-active').checked,
      sort_order: id ? (this.list.find(s => s.id == id)?.sort_order || 0) : this.list.length,
    };

    const res = id
      ? await api.put(`/api/v1/services/${id}`, body)
      : await api.post('/api/v1/services', body);

    Toast.dismiss(loader);
    if (res?.success) {
      Toast.success(id ? 'Servicio actualizado' : 'Servicio creado');
      this.closeModal();
      await this.load();
    } else {
      Toast.error('Error al guardar');
    }
  },

  async remove(id) {
    if (!confirm('¿Eliminar este servicio?')) return;
    const loader = Toast.loading('Eliminando...');
    const res = await api.delete(`/api/v1/services/${id}`);
    Toast.dismiss(loader);
    if (res?.success) {
      Toast.success('Servicio eliminado');
      await this.load();
    }
  },

  esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  },
};
