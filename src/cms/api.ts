const SESSION_KEY = 'nakama_cms_session_token';

export function getCmsApiEndpoint(configEndpoint?: string) {
  return String(import.meta.env.VITE_CMS_API_ENDPOINT || configEndpoint || '').trim();
}

export function getCmsSessionToken() {
  return localStorage.getItem(SESSION_KEY) || '';
}

export function clearCmsSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function cmsApi(endpoint: string, action: string, payload: Record<string, unknown> = {}) {
  if (!endpoint) throw new Error('CMS API endpoint belum dikonfigurasi.');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' },
    body: JSON.stringify({ action, ...payload }),
    cache: 'no-store',
    redirect: 'follow'
  });

  const raw = await response.text();
  let data: any;
  try { data = JSON.parse(raw); }
  catch { throw new Error(`CMS API tidak mengembalikan JSON (HTTP ${response.status}).`); }

  if (!data.ok) throw new Error(data.error || 'CMS API request gagal.');
  return data;
}

export async function logoutCms(configEndpoint?: string) {
  const endpoint = getCmsApiEndpoint(configEndpoint);
  const token = getCmsSessionToken();
  try {
    if (endpoint && token) await cmsApi(endpoint, 'logout', { token });
  } finally {
    clearCmsSession();
  }
}

export { SESSION_KEY };
