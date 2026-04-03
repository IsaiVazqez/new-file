function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, maxAge) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict; max-age=${maxAge}`;
}

const Auth = {
  getAccessToken() {
    return getCookie('access_token');
  },

  getRefreshToken() {
    return getCookie('refresh_token');
  },

  setTokens(access, refresh) {
    if (access) setCookie('access_token', access, 900);
    if (refresh) setCookie('refresh_token', refresh, 604800);
  },

  clearTokens() {
    setCookie('access_token', '', 0);
    setCookie('refresh_token', '', 0);
  },

  async refresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      this.setTokens(data.data.accessToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  },

  async logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    this.clearTokens();
    window.location.href = '/admin/';
  },

  async requireAuth() {
    if (!this.getAccessToken()) {
      const refreshed = await this.refresh();
      if (!refreshed) {
        window.location.href = '/admin/';
        return;
      }
    }
  },
};
