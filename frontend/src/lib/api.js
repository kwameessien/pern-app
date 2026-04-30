export function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function apiRequest(path, token, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}
