import React, { useEffect, useState } from 'react';
import { LockKeyhole, LogIn, Loader2, ShieldCheck } from 'lucide-react';
import { useCms } from '../cms/CmsContext';
import { cmsApi, clearCmsSession, getCmsApiEndpoint, getCmsSessionToken, SESSION_KEY } from '../cms/api';

const LoginScreen: React.FC<{ endpoint: string; onLogin: (token: string) => void }> = ({ endpoint, onLogin }) => {
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
      const result = await cmsApi(endpoint, 'login', { password });
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
              <input id="cms-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password CMS" className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10" />
            </div>
            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-xs leading-relaxed">{error}</div>}
            <button type="submit" disabled={busy || !endpoint} className="w-full rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {busy ? 'Memeriksa...' : 'Masuk ke CMS'}
            </button>
          </form>
          {!endpoint && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">CMS API endpoint belum dikonfigurasi untuk website ini.</div>}
          <div className="mt-6 flex items-start gap-2 text-[11px] text-neutral-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Password tidak disimpan di GitHub. Verifikasi dilakukan oleh CMS API dan sesi memiliki masa berlaku terbatas.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useCms();
  const endpoint = getCmsApiEndpoint(config.apiEndpoint);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const token = getCmsSessionToken();
      if (!token || !endpoint) {
        if (active) setChecking(false);
        return;
      }
      try {
        await cmsApi(endpoint, 'validateSession', { token });
        if (active) setAuthenticated(true);
      } catch {
        clearCmsSession();
        if (active) setAuthenticated(false);
      } finally {
        if (active) setChecking(false);
      }
    };
    check();
    return () => { active = false; };
  }, [endpoint]);

  if (checking) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white"><div className="flex items-center gap-2 text-sm text-neutral-300"><Loader2 className="w-4 h-4 animate-spin" /> Memeriksa sesi CMS...</div></div>;
  if (!authenticated) return <LoginScreen endpoint={endpoint} onLogin={() => setAuthenticated(true)} />;
  return <>{children}</>;
};
