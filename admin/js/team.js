const Team = {
  list: [],
  photoFile: null,

  init() {
    const zone = document.getElementById('team-photo-zone');
    const fileInput = document.getElementById('team-photo-input');
    if (!zone || !fileInput) return;

    zone.addEventListener('click', (e) => {
      if (e.target.closest('#team-photo-remove')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) this.setPhotoFile(fileInput.files[0]);
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
      if (e.dataTransfer.files.length) this.setPhotoFile(e.dataTransfer.files[0]);
    });
  },

  setPhotoFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Solo se permiten archivos JPG, PNG o WebP');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('El archivo no puede superar 20MB');
      return;
    }
    this.photoFile = file;

    const preview = document.getElementById('team-photo-preview');
    const prompt = document.getElementById('team-photo-prompt');
    const removeBtn = document.getElementById('team-photo-remove');

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      prompt.style.display = 'none';
      removeBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  removePhoto() {
    this.photoFile = null;
    document.getElementById('team-photo-preview').style.display = 'none';
    document.getElementById('team-photo-prompt').style.display = 'block';
    document.getElementById('team-photo-remove').style.display = 'none';
    document.getElementById('team-photo-input').value = '';
    document.getElementById('t-photo').value = '';
  },

  showExistingPhoto(url) {
    if (!url) return;
    const preview = document.getElementById('team-photo-preview');
    const prompt = document.getElementById('team-photo-prompt');
    const removeBtn = document.getElementById('team-photo-remove');

    preview.src = url;
    preview.style.display = 'block';
    prompt.style.display = 'none';
    removeBtn.style.display = 'block';
  },

  async load() {
    const res = await api.get('/api/v1/team');
    if (res?.success) this.list = res.data;
    this.render();
  },

  render() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!this.list.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem 0">No hay miembros aún. Agrega al primer miembro del equipo.</p>';
      return;
    }

    this.list.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.draggable = true;
      card.dataset.id = m.id;
      card.dataset.index = i;
      card.dataset.testid = `team-card-${m.id}`;

      const photoHtml = m.photo_url
        ? `<img src="${this.esc(m.photo_url)}" alt="${this.esc(m.name)}" />`
        : `<div class="no-cover"><span class="material-symbols-outlined" style="font-size:2.5rem;opacity:0.3">person</span></div>`;

      const statusClass = m.is_active ? 'published' : 'draft';
      const statusLabel = m.is_active ? 'Activo' : 'Inactivo';

      card.innerHTML = `
        <div class="project-card-cover">
          ${photoHtml}
          <span class="card-order">${i + 1}</span>
          <span class="card-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="project-card-body">
          <h4>${this.esc(m.name)}</h4>
          <span class="card-category">${this.esc(m.role || '')}</span>
        </div>
        <div class="project-card-actions">
          <button class="btn btn-outline" onclick="Team.edit(${m.id})">Editar</button>
          <button class="btn btn-danger" onclick="Team.remove(${m.id})">Eliminar</button>
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

      const items = this.list.map((m, i) => ({ id: m.id, order: i }));
      await api.patch('/api/v1/team/reorder', { items });
      this.render();
    });
  },

  openModal(member = null) {
    const modal = document.getElementById('team-modal');
    const form = document.getElementById('team-form');
    form.reset();
    this.photoFile = null;

    // Reset photo zone
    document.getElementById('team-photo-preview').style.display = 'none';
    document.getElementById('team-photo-prompt').style.display = 'block';
    document.getElementById('team-photo-remove').style.display = 'none';
    document.getElementById('team-photo-input').value = '';

    document.getElementById('t-id').value = member ? member.id : '';
    if (member) {
      document.getElementById('t-name').value = member.name;
      document.getElementById('t-role').value = member.role || '';
      document.getElementById('t-bio').value = member.bio || '';
      document.getElementById('t-photo').value = member.photo_url || '';
      document.getElementById('t-active').checked = !!member.is_active;
      if (member.photo_url) this.showExistingPhoto(member.photo_url);
    }
    document.getElementById('team-modal-title').textContent = member ? 'Editar Miembro' : 'Nuevo Miembro';
    modal.classList.add('open');
  },

  closeModal() {
    document.getElementById('team-modal').classList.remove('open');
  },

  edit(id) {
    const member = this.list.find((m) => m.id === id);
    if (member) this.openModal(member);
  },

  async save() {
    const id = document.getElementById('t-id').value;
    let photoUrl = document.getElementById('t-photo').value;

    // Upload photo if new file selected
    if (this.photoFile) {
      const formData = new FormData();
      formData.append('photo', this.photoFile);
      const uploadRes = await api.post('/api/v1/team/upload-photo', formData);
      if (uploadRes?.success) {
        photoUrl = uploadRes.data.url;
      } else {
        alert('Error al subir la foto');
        return;
      }
    }

    const body = {
      name: document.getElementById('t-name').value,
      role: document.getElementById('t-role').value,
      bio: document.getElementById('t-bio').value,
      photo_url: photoUrl,
      is_active: document.getElementById('t-active').checked,
      sort_order: id ? (this.list.find((m) => m.id == id)?.sort_order || 0) : this.list.length,
    };

    const res = id
      ? await api.put(`/api/v1/team/${id}`, body)
      : await api.post('/api/v1/team', body);

    if (res?.success) {
      this.closeModal();
      await this.load();
    }
  },

  async remove(id) {
    if (!confirm('¿Eliminar este miembro del equipo?')) return;
    const res = await api.delete(`/api/v1/team/${id}`);
    if (res?.success) await this.load();
  },

  esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  },
};
