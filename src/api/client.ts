const API = import.meta.env.VITE_API_BASE;

if (!API) {
  console.error("VITE_API_BASE is not defined");
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw data || { error: 'API error' };
  }

  return data;
}
