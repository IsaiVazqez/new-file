const Projects = {
  list: [],
  coverFiles: [],
  previewMode: false,

  init() {
    // Setup cover drop zone events
    const zone = document.getElementById('cover-drop-zone');
    const fileInput = document.getElementById('cover-file-input');
    if (!zone || !fileInput) return;

    zone.addEventListener('click', (e) => {
      if (e.target.closest('.thumb-remove')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) this.addCoverFiles(fileInput.files);
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-active');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-active');
      if (e.dataTransfer.files.length) this.addCoverFiles(e.dataTransfer.files);
    });
  },

  addCoverFiles(fileList) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of fileList) {
      if (!allowed.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG o WebP');
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert('El archivo no puede superar 20MB');
        continue;
      }
      this.coverFiles.push(file);
    }
    this.renderCoverThumbs();
  },

  renderCoverThumbs() {
    const thumbs = document.getElementById('cover-thumbs');
    const prompt = document.getElementById('cover-prompt');

    if (this.coverFiles.length === 0) {
      prompt.style.display = 'block';
      thumbs.style.display = 'none';
      return;
    }

    prompt.style.display = 'none';
    thumbs.style.display = 'grid';
    thumbs.innerHTML = '';

    this.coverFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'thumb-item';

      const img = document.createElement('img');
      img.alt = file.name;

      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.readAsDataURL(file);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'thumb-remove';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeCoverFile(index);
      });

      item.appendChild(img);
      item.appendChild(removeBtn);

      if (index === 0) {
        const badge = document.createElement('span');
        badge.className = 'thumb-badge';
        badge.textContent = 'Portada';
        item.appendChild(badge);
      }

      thumbs.appendChild(item);
    });
  },

  removeCoverFile(index) {
    this.coverFiles.splice(index, 1);
    this.renderCoverThumbs();
  },

  removeCover() {
    this.coverFiles = [];
    this.renderCoverThumbs();
    document.getElementById('cover-file-input').value = '';
    document.getElementById('p-cover').value = '';
  },

  async showExistingImages(project) {
    const thumbs = document.getElementById('cover-thumbs');
    const prompt = document.getElementById('cover-prompt');

    // Fetch existing gallery images
    let images = [];
    if (project.id) {
      const res = await api.get(`/api/v1/images?project_id=${project.id}`);
      if (res?.success) images = res.data;
    }

    // Build list: cover first (if exists and not in gallery), then gallery
    const urls = [];
    if (project.cover_image_url) urls.push({ url: project.cover_image_url, isCover: true });
    images.forEach(img => {
      if (img.url !== project.cover_image_url) urls.push({ url: img.url, isCover: false });
    });

    if (!urls.length) return;

    prompt.style.display = 'none';
    thumbs.style.display = 'grid';
    thumbs.innerHTML = '';

    urls.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'thumb-item';

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = '';

      div.appendChild(img);

      if (i === 0) {
        const badge = document.createElement('span');
        badge.className = 'thumb-badge';
        badge.textContent = 'Portada';
        div.appendChild(badge);
      }

      thumbs.appendChild(div);
    });
  },

  setGridSize(w, h) {
    document.getElementById('p-grid-w').value = w;
    document.getElementById('p-grid-h').value = h;
    document.querySelectorAll('.grid-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.w == w && btn.dataset.h == h);
    });
  },

  async load() {
    const res = await api.get('/api/v1/projects');
    if (res?.success) this.list = res.data;
    this.render();
  },

  render() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!this.list.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem 0">No hay proyectos aún. Crea tu primer proyecto.</p>';
      return;
    }

    this.list.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.draggable = true;
      card.dataset.id = p.id;
      card.dataset.index = i;
      card.dataset.testid = `project-card-${p.id}`;

      const coverHtml = p.cover_image_url
        ? `<img src="${this.esc(p.cover_image_url)}" alt="${this.esc(p.title)}" />`
        : `<div class="no-cover"><span>Sin imagen</span></div>`;

      const statusClass = p.is_published ? 'published' : 'draft';
      const statusLabel = p.is_published ? 'Publicado' : 'Borrador';
      const sizeLabels = { '1x1': 'Normal', '2x1': 'Ancho', '1x2': 'Alto', '2x2': 'Grande' };
      const sizeKey = `${p.grid_w || 1}x${p.grid_h || 1}`;

      card.innerHTML = `
        <div class="project-card-cover">
          ${coverHtml}
          <span class="card-order">${i + 1}</span>
          <span class="card-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="project-card-body">
          <h4>${this.esc(p.title)}</h4>
          <span class="card-category">${this.esc(p.category || '')}${sizeKey !== '1x1' ? ` · ${sizeLabels[sizeKey]}` : ''}</span>
        </div>
        <div class="project-card-actions">
          <button class="btn btn-outline" onclick="Projects.openImages(${p.id})" data-testid="btn-images-${p.id}">Imágenes</button>
          <button class="btn btn-outline" onclick="Projects.edit(${p.id})" data-testid="btn-edit-${p.id}">Editar</button>
          <button class="btn btn-danger" onclick="Projects.remove(${p.id})" data-testid="btn-delete-${p.id}">Eliminar</button>
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
      document.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', async (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      const toIdx = parseInt(card.dataset.index);
      if (fromIdx === toIdx) return;

      const [moved] = this.list.splice(fromIdx, 1);
      this.list.splice(toIdx, 0, moved);

      const items = this.list.map((p, i) => ({ id: p.id, order: i }));
      await api.patch('/api/v1/projects/reorder', { items });
      this.render();
    });
  },

  openModal(project = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    form.reset();
    this.coverFiles = [];

    // Reset drop zone
    document.getElementById('cover-thumbs').innerHTML = '';
    document.getElementById('cover-thumbs').style.display = 'none';
    document.getElementById('cover-prompt').style.display = 'block';
    document.getElementById('cover-file-input').value = '';

    document.getElementById('project-id').value = project ? project.id : '';
    this.setGridSize(project?.grid_w || 1, project?.grid_h || 1);
    if (project) {
      document.getElementById('p-title').value = project.title;
      document.getElementById('p-description').value = project.description || '';
      document.getElementById('p-category').value = project.category || '';
      document.getElementById('p-cover').value = project.cover_image_url || '';
      document.getElementById('p-published').checked = !!project.is_published;
      this.showExistingImages(project);
    }
    document.getElementById('modal-title').textContent = project ? 'Editar Proyecto' : 'Nuevo Proyecto';
    modal.classList.add('open');
  },

  closeModal() {
    document.getElementById('project-modal').classList.remove('open');
  },

  edit(id) {
    const project = this.list.find((p) => p.id === id);
    if (project) this.openModal(project);
  },

  async save() {
    const id = document.getElementById('project-id').value;
    let coverUrl = document.getElementById('p-cover').value;
    const loader = Toast.loading('Guardando proyecto...');

    // Upload cover file (first file) if selected
    if (this.coverFiles.length > 0) {
      const formData = new FormData();
      formData.append('cover', this.coverFiles[0]);
      const uploadRes = await api.post('/api/v1/projects/upload-cover', formData);
      if (uploadRes?.success) {
        coverUrl = uploadRes.data.url;
      } else {
        Toast.dismiss(loader);
        Toast.error('Error al subir la imagen de portada');
        return;
      }
    }

    const body = {
      title: document.getElementById('p-title').value,
      description: document.getElementById('p-description').value,
      category: document.getElementById('p-category').value,
      cover_image_url: coverUrl,
      is_published: document.getElementById('p-published').checked,
      sort_order: id ? (this.list.find((p) => p.id == id)?.sort_order || 0) : this.list.length,
      grid_w: parseInt(document.getElementById('p-grid-w').value) || 1,
      grid_h: parseInt(document.getElementById('p-grid-h').value) || 1,
    };

    const res = id
      ? await api.put(`/api/v1/projects/${id}`, body)
      : await api.post('/api/v1/projects', body);

    if (res?.success) {
      const projectId = id || res.data.id;

      // Upload additional files as gallery images
      if (this.coverFiles.length > 1) {
        Toast.dismiss(loader);
        const imgLoader = Toast.loading(`Subiendo ${this.coverFiles.length - 1} imagen(es)...`);
        for (let i = 1; i < this.coverFiles.length; i++) {
          const form = new FormData();
          form.append('image', this.coverFiles[i]);
          form.append('project_id', projectId);
          await api.post('/api/v1/images/upload', form);
        }
        Toast.dismiss(imgLoader);
      } else {
        Toast.dismiss(loader);
      }

      Toast.success(id ? 'Proyecto actualizado' : 'Proyecto creado');
      this.closeModal();
      await this.load();
      if (this.previewMode) this.renderPreview();
    } else {
      Toast.dismiss(loader);
      Toast.error('Error al guardar el proyecto');
    }
  },

  async remove(id) {
    if (!confirm('¿Eliminar este proyecto y todas sus imágenes?')) return;
    const loader = Toast.loading('Eliminando proyecto...');
    const res = await api.delete(`/api/v1/projects/${id}`);
    Toast.dismiss(loader);
    if (res?.success) {
      Toast.success('Proyecto eliminado');
      await this.load();
    } else {
      Toast.error('Error al eliminar');
    }
  },

  togglePreview() {
    this.previewMode = !this.previewMode;
    document.getElementById('projects-grid').style.display = this.previewMode ? 'none' : '';
    const hint = document.querySelector('[data-testid="drag-hint"]');
    if (hint) hint.style.display = this.previewMode ? 'none' : '';
    document.getElementById('projects-preview').style.display = this.previewMode ? 'block' : 'none';
    document.getElementById('btn-toggle-preview').textContent = this.previewMode ? 'Vista Tarjetas' : 'Vista Previa Grid';
    if (this.previewMode) this.renderPreview();
  },

  renderPreview() {
    const grid = document.getElementById('preview-grid');
    grid.innerHTML = '';

    // Only show published projects in preview
    const published = this.list.filter(p => p.is_published);
    if (!published.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem;grid-column:1/-1">No hay proyectos publicados para mostrar en el grid.</p>';
      return;
    }

    published.forEach((p, i) => {
      const w = p.grid_w || 1;
      const h = p.grid_h || 1;

      const item = document.createElement('div');
      item.className = `grid-item item-w-${w} item-h-${h}`;
      item.draggable = true;
      item.dataset.id = p.id;
      item.dataset.index = i;

      item.innerHTML = `
        <div class="item-bg" style="background-image: url('${this.esc(p.cover_image_url || '')}')"></div>
        <div class="item-overlay">
          <span class="item-title">${this.esc(p.title)}</span>
          <div class="size-buttons">
            <button class="size-btn ${w==1&&h==1?'active':''}" onclick="Projects.setPreviewSize(${p.id},1,1)">1\u00d71</button>
            <button class="size-btn ${w==2&&h==1?'active':''}" onclick="Projects.setPreviewSize(${p.id},2,1)">2\u00d71</button>
            <button class="size-btn ${w==1&&h==2?'active':''}" onclick="Projects.setPreviewSize(${p.id},1,2)">1\u00d72</button>
            <button class="size-btn ${w==2&&h==2?'active':''}" onclick="Projects.setPreviewSize(${p.id},2,2)">2\u00d72</button>
          </div>
        </div>
      `;

      // Drag events for reorder
      item.addEventListener('dragstart', (e) => {
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', String(i));
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        grid.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      });
      item.addEventListener('dragover', (e) => { e.preventDefault(); item.classList.add('drag-over'); });
      item.addEventListener('dragleave', () => { item.classList.remove('drag-over'); });
      item.addEventListener('drop', async (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');
        const from = parseInt(e.dataTransfer.getData('text/plain'));
        const to = i;
        if (from === to) return;
        const [moved] = published.splice(from, 1);
        published.splice(to, 0, moved);
        const items = published.map((p, idx) => ({ id: p.id, order: idx }));
        await api.patch('/api/v1/projects/reorder', { items });
        await this.load();
        this.renderPreview();
        Toast.success('Orden actualizado');
      });

      grid.appendChild(item);
    });
  },

  async setPreviewSize(id, w, h) {
    const project = this.list.find(p => p.id === id);
    if (!project) return;
    const loader = Toast.loading('Actualizando tama\u00f1o...');
    await api.put(`/api/v1/projects/${id}`, { ...project, grid_w: w, grid_h: h });
    Toast.dismiss(loader);
    Toast.success('Tama\u00f1o actualizado');
    await this.load();
    this.renderPreview();
  },

  // --- Images sub-section ---
  currentProjectId: null,

  initImagesDrop() {
    const zone = document.getElementById('images-drop-zone');
    if (!zone || zone._initialized) return;
    zone._initialized = true;

    zone.addEventListener('click', () => {
      document.getElementById('image-upload-input').click();
    });
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-active');
    });
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-active');
    });
    zone.addEventListener('drop', async (e) => {
      e.preventDefault();
      zone.classList.remove('drag-active');
      if (e.dataTransfer.files.length) await this.uploadFiles(e.dataTransfer.files);
    });
    document.getElementById('image-upload-input').addEventListener('change', async (e) => {
      if (e.target.files.length) await this.uploadFiles(e.target.files);
      e.target.value = '';
    });
  },

  async openImages(projectId) {
    this.currentProjectId = projectId;
    document.getElementById('section-projects').style.display = 'none';
    document.getElementById('section-images').style.display = 'block';

    const project = this.list.find((p) => p.id === projectId);
    document.getElementById('images-project-title').textContent = project ? project.title : '';
    this.initImagesDrop();
    await this.loadImages();
  },

  closeImages() {
    document.getElementById('section-images').style.display = 'none';
    document.getElementById('section-projects').style.display = 'block';
    this.currentProjectId = null;
  },

  imageList: [],

  async loadImages() {
    const res = await api.get(`/api/v1/images?project_id=${this.currentProjectId}`);
    if (res?.success) this.imageList = res.data;
    this.renderImages();
  },

  renderImages() {
    const grid = document.getElementById('images-grid');
    grid.innerHTML = '';

    if (!this.imageList.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:1rem 0">No hay imágenes. Sube la primera.</p>';
      return;
    }

    this.imageList.forEach((img, i) => {
      const div = document.createElement('div');
      div.className = 'img-thumb';
      div.draggable = true;
      div.dataset.index = i;
      div.dataset.testid = `img-thumb-${img.id}`;
      div.innerHTML = `
        <img src="${this.esc(img.url)}" alt="" />
        <div class="img-overlay"><span class="img-number">${i + 1}</span></div>
        <button class="delete-img" onclick="Projects.deleteImage(${img.id})" data-testid="btn-delete-img-${img.id}">&times;</button>
      `;
      this.addImageDrag(div);
      grid.appendChild(div);
    });

    // Legend below grid
    const legend = document.getElementById('images-legend');
    if (legend) legend.textContent = `La imagen #1 se usa como portada del proyecto. Arrastra para reordenar.`;
  },

  addImageDrag(div) {
    div.addEventListener('dragstart', (e) => {
      div.style.opacity = '0.4';
      e.dataTransfer.setData('text/plain', div.dataset.index);
    });
    div.addEventListener('dragend', () => { div.style.opacity = '1'; });
    div.addEventListener('dragover', (e) => { e.preventDefault(); });
    div.addEventListener('drop', async (e) => {
      e.preventDefault();
      const from = parseInt(e.dataTransfer.getData('text/plain'));
      const to = parseInt(div.dataset.index);
      if (from === to) return;
      const [moved] = this.imageList.splice(from, 1);
      this.imageList.splice(to, 0, moved);
      const items = this.imageList.map((img, i) => ({ id: img.id, order: i }));
      await api.patch('/api/v1/images/reorder', { items });

      // Update cover to the new first image
      const newCoverUrl = this.imageList[0]?.url;
      if (newCoverUrl) {
        const project = this.list.find(p => p.id == this.currentProjectId);
        if (project && project.cover_image_url !== newCoverUrl) {
          await api.put(`/api/v1/projects/${this.currentProjectId}`, { ...project, cover_image_url: newCoverUrl });
          await this.load();
          Toast.success('Portada actualizada');
        }
      }

      this.renderImages();
    });
  },

  async uploadFiles(files) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = Array.from(files).filter(f => {
      if (!allowed.includes(f.type)) { Toast.error(`${f.name}: formato no válido`); return false; }
      if (f.size > 20 * 1024 * 1024) { Toast.error(`${f.name}: supera 20MB`); return false; }
      return true;
    });
    if (!valid.length) return;

    const loader = Toast.loading(`Subiendo ${valid.length} imagen(es)...`);
    let firstUrl = null;
    for (const file of valid) {
      const form = new FormData();
      form.append('image', file);
      form.append('project_id', this.currentProjectId);
      const res = await api.post('/api/v1/images/upload', form);
      if (res?.success && !firstUrl) firstUrl = res.data.url;
    }

    // Auto-set first image as cover if project has no cover
    const project = this.list.find(p => p.id == this.currentProjectId);
    if (project && !project.cover_image_url && firstUrl) {
      await api.put(`/api/v1/projects/${this.currentProjectId}`, {
        ...project,
        cover_image_url: firstUrl,
      });
      await this.load();
    }

    Toast.dismiss(loader);
    Toast.success(`${valid.length} imagen(es) subida(s)`);
    await this.loadImages();
  },

  async deleteImage(id) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    const loader = Toast.loading('Eliminando...');
    await api.delete(`/api/v1/images/${id}`);
    Toast.dismiss(loader);
    Toast.success('Imagen eliminada');
    await this.loadImages();
  },

  esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  },
};
