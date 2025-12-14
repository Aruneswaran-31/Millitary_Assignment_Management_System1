const API =
  import.meta.env.VITE_API_BASE ||
  "https://millitary-assignment-management-system-2.onrender.com/api";

export async function apiFetch(
  path: string,
  opts: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore JSON parse error
  }

  if (!res.ok) {
    throw data || { message: "API error" };
  }

  return data;
}
