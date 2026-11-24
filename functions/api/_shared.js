const enc = new TextEncoder();

function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(value)));
}

export async function makeSession(secret) {
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const payload = b64url(enc.encode(JSON.stringify({ exp, role: 'admin' })));
  return payload + '.' + await sign(payload, secret);
}

export async function validSession(request, secret) {
  const c = request.headers.get('Cookie') || '';
  const m = c.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!m) return false;

  const parts = m[1].split('.');
  if (parts.length !== 2) return false;

  const expected = await sign(parts[0], secret);
  if (expected !== parts[1]) return false;

  try {
    const p = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    return p.role === 'admin' && p.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}
