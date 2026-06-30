import { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import AdminReviewsSection from './AdminReviewsSection';
import AdminReservationsSection from './AdminReservationsSection';
import { getAdminUser, getStoredAdminSession, signInAdmin, signOutAdmin } from '../services/supabaseAuth';

const AdminPanelPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(() => getStoredAdminSession());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(session));
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      if (!session?.access_token) {
        setIsLoading(false);
        return;
      }

      const adminUser = await getAdminUser();

      if (!isMounted) return;

      if (adminUser) {
        setUser(adminUser);
      } else {
        setSession(null);
      }

      setIsLoading(false);
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const nextSession = await signInAdmin({ email: email.trim(), password });
      setSession(nextSession);
      setPassword('');
    } catch {
      setError('No se pudo iniciar sesion. Verifica usuario y contrasena.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setSession(null);
    setUser(null);
  };

  if (!session?.access_token) {
    return (
      <main className="min-h-screen bg-brand-night px-5 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
          <a
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:border-brand-orange/30 hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </a>

          <div className="rounded-3xl border border-brand-orange/15 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/25 bg-brand-orange/10">
                <LockKeyhole className="h-6 w-6 text-brand-orange" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">AQUABRILLO Operacion</span>
              <h1 className="mt-3 text-3xl font-black text-white">Acceso operativo</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Ingresa con tu usuario autorizado para revisar preagendas, pagos, contactos y seguimiento por WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Correo</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-brand-night px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-brand-orange/55"
                  placeholder="operacion@aquabrillo.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Contrasena</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-brand-night px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-brand-orange/55"
                  placeholder="Tu contrasena"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-brand-rust/30 bg-brand-rust/10 px-4 py-3 text-sm font-bold text-orange-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-brand-night transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                {isLoading ? 'Validando...' : 'Entrar al panel'}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-night text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">AQUABRILLO Operacion</span>
          <h1 className="mt-2 text-3xl font-black text-white">Panel privado</h1>
          <p className="mt-1 text-sm text-slate-500">{user?.email || 'Sesion activa'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:border-brand-orange/30 hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Sitio publico
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-brand-rust/30 bg-brand-rust/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-brand-rust/20"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </div>
      </div>

      <AdminReservationsSection defaultOpen canCollapse={false} />
      <AdminReviewsSection />
    </main>
  );
};

export default AdminPanelPage;
