const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(opts.headers as HeadersInit || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: 'API error' };
    return data;
  } catch (err) {
    // non-json response fallback
    if (!res.ok) throw { message: text || 'API error' };
    return null;
  }
}
