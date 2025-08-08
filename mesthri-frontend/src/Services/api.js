const BASE_URL = 'http://localhost:8082';

async function handleJsonOrText(res) {
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, data: text }; }
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const { ok, data } = await handleJsonOrText(res);
  if (!ok) throw new Error(typeof data === 'string' ? data : (data?.message || 'Registration failed'));
  return data;
}

export async function login(payload) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const { ok, data } = await handleJsonOrText(res);
  if (!ok) throw new Error(typeof data === 'string' ? data : (data?.message || 'Login failed'));
  return data;
}
