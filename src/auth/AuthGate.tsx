import React, { useEffect, useState } from 'react';
import { LockKeyhole, LogIn, Loader2, ShieldCheck } from 'lucide-react';

const API_ENDPOINT = import.meta.env.VITE_CMS_API_ENDPOINT || '';
const SESSION_KEY = 'nakama_cms_session_token';

async function api(action: string, payload: Record<string, unknown> = {}) {
  if (!API_ENDPOINT) throw new Error('CMS API endpoint belum dikonfigurasi.');

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' },
    body: JSON.stringify({ action, ...payload }),
    cache: 'no-store',
    redirect: 'follow'
  });

  const raw = await response.text();
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`CMS API tidak mengembalikan JSON (HTTP ${response.status}).`);
  }

  if (!data.ok) throw new Error(data.error || 'CMS API request gagal.');
  return data;
}

export function getCmsSessionToken() {
  return localStorage.getItem(SESSION_KEY) || '';
}

export async function logoutCms() {
  const token = getCmsSessionToken();
  try {
    if (token) await api('logout', { token });
  } finally {
    localStorage.removeItem(SESSION_KEY);
  }
}

const LoginScreen: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError('Password wajib diisi.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const result = await api('login', { password });
      localStorage.setItem(SESSION_KEY, result.token);
      onLogin(result.token);
    } catch (err: any) {
      setError(err?.message || 'Login gagal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl p-7 sm:p-9">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-lg">
              <LockKeyhole className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-7">
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-amber-700">Nakama Premium CMS</p>
            <h1 className="text-2xl font-bold text-neutral-950 mt-2">Customer Login</h1>
            <p className="text-sm text-neutral-500 mt-2">Masukkan password untuk membuka dashboard website Anda.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="cms-password" className="block text-xs font-semibold text-neutral-700 mb-2">Password</label>
              <input
                id="cms-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password CMS"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-xs leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {busy ? 'Memeriksa...' : 'Masuk ke CMS'}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 text-[11px] text-neutral-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Password tidak disimpan di GitHub. Verifikasi dilakukan oleh CMS API.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const token = getCmsSessionToken();

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        await api('health');
        setAuthenticated(true);
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [token]);

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2 text-sm text-neutral-300"><Loader2 className="w-4 h-4 animate-spin" /> Memeriksa sesi CMS...</div>
      </div>
    );
  }

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  return <>{children}</>;
};
