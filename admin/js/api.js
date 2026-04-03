const api = {
  async request(url, options = {}) {
    const headers = options.headers || {};
    const token = Auth.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      const refreshed = await Auth.refresh();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${Auth.getAccessToken()}`;
        const retry = await fetch(url, { ...options, headers });
        return retry.json();
      }
      Auth.logout();
      return;
    }

    return res.json();
  },

  get(url) {
    return this.request(url);
  },

  post(url, body) {
    const isForm = body instanceof FormData;
    return this.request(url, {
      method: 'POST',
      body: isForm ? body : JSON.stringify(body),
    });
  },

  put(url, body) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch(url, body) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(url) {
    return this.request(url, { method: 'DELETE' });
  },
};
