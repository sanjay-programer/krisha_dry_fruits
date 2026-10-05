// In dev with `netlify dev`, functions run on port 8888
// In prod, netlify.toml redirects /api/* -> /.netlify/functions/:splat
const BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/api';

function getAdminSecret(): string {
  if (typeof window !== 'undefined') {
    const sessionPasskey = sessionStorage.getItem('admin_passkey_value');
    if (sessionPasskey) return sessionPasskey;
  }
  return import.meta.env.VITE_ADMIN_PASSKEY || import.meta.env.VITE_ADMIN_SECRET || '';
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

function adminHeaders(extra?: Record<string, string>) {
  const secret = getAdminSecret();
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}`, ...extra };
}

// ── Public ───────────────────────────────────────────────────────────────────

export const api = {
  products: {
    list: () => req<any[]>('/products'),
    get: (id: string) => req<any>(`/products?id=${id}`),
  },
  orders: {
    create: (order: any) =>
      req<any>('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }),
    get: (orderId: string) => req<any>(`/orders?orderId=${orderId}`),
  },
};

// ── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  products: {
    list: () => req<any[]>('/admin-products', { headers: adminHeaders() }),
    create: (data: any) =>
      req<any>('/admin-products', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      req<any>(`/admin-products?id=${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<any>(`/admin-products?id=${id}`, { method: 'DELETE', headers: adminHeaders() }),
    seed: () =>
      req<any>('/admin-products?action=seed', { method: 'POST', headers: adminHeaders() }),
  },
  orders: {
    list: (params?: { status?: string; search?: string; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.page) q.set('page', String(params.page));
      return req<any>(`/admin-orders?${q}`, { headers: adminHeaders() });
    },
    get: (id: string) => req<any>(`/admin-orders?id=${id}`, { headers: adminHeaders() }),
    update: (id: string, data: any) =>
      req<any>(`/admin-orders?id=${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<any>(`/admin-orders?id=${id}`, { method: 'DELETE', headers: adminHeaders() }),
    stats: () => req<any>('/admin-orders?action=stats', { headers: adminHeaders() }),
  },
  upload: (dataUrl: string) =>
    req<{ url: string; publicId: string }>('/upload', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ data: dataUrl }),
    }),
};