import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, EyeOff, RefreshCw, Search, Star } from 'lucide-react';
import {
  formatReviewDate,
  REVIEW_FILTER_OPTIONS,
  REVIEW_SORT_OPTIONS,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_STYLES,
} from '../config/reviews';
import { listAdminReviews, updateReviewStatus } from '../services/reviewRepository';

const AdminReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [storageMode, setStorageMode] = useState('supabase');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [updatingReviewId, setUpdatingReviewId] = useState('');

  const visibleReviews = useMemo(() => [...reviews]
    .filter((review) => {
      if (activeFilter !== 'all' && review.status !== activeFilter) return false;

      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) return true;

      return [
        review.name,
        review.vehicle,
        review.service,
        review.text,
        review.status,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearch));
    })
    .sort((a, b) => {
      const priority = { pending: 0, approved: 1, hidden: 2 };
      const priorityDiff = (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
      if (priorityDiff !== 0) return priorityDiff;
      const dateDiff = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return sortOrder === 'oldest' ? -dateDiff : dateDiff;
    }), [activeFilter, reviews, searchTerm, sortOrder]);

  const metrics = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter((review) => review.status === 'pending').length,
    approved: reviews.filter((review) => review.status === 'approved').length,
    hidden: reviews.filter((review) => review.status === 'hidden').length,
  }), [reviews]);

  const refreshReviews = async () => {
    setIsLoading(true);
    const result = await listAdminReviews();
    setReviews(result.reviews);
    setStorageMode(result.storage);
    setLoadError(result.error ? `No se pudieron cargar las opiniones (${result.error.status || 'conexion'}).` : '');
    setIsLoading(false);
  };

  const handleStatusChange = async ({ id, status }) => {
    setUpdatingReviewId(id);

    try {
      await updateReviewStatus({ id, status });
      await refreshReviews();
    } finally {
      setUpdatingReviewId('');
    }
  };

  useEffect(() => {
    queueMicrotask(refreshReviews);
  }, []);

  return (
    <section className="bg-brand-night px-5 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-brand-orange/15 bg-white/[0.03] p-4 shadow-2xl shadow-black/10 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Opiniones de clientes</span>
            <h2 className="mt-2 text-2xl font-black text-white">Aprobación de testimonios</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fuente actual: {storageMode}. Solo las opiniones aprobadas y autorizadas aparecen en el sitio.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshReviews}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-brand-orange/15 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            {isLoading ? 'Actualizando' : 'Actualizar'}
          </button>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-brand-night/55 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Total</div>
            <div className="mt-2 text-2xl font-black text-white">{metrics.total}</div>
          </div>
          <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/10 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Pendientes</div>
            <div className="mt-2 text-2xl font-black text-white">{metrics.pending}</div>
          </div>
          <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Aprobadas</div>
            <div className="mt-2 text-2xl font-black text-white">{metrics.approved}</div>
          </div>
          <div className="rounded-2xl border border-brand-rust/20 bg-brand-rust/10 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Ocultas</div>
            <div className="mt-2 text-2xl font-black text-white">{metrics.hidden}</div>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-brand-night/45 p-2">
          {REVIEW_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                activeFilter === option.value
                  ? 'bg-brand-orange text-brand-night'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="relative block">
            <span className="sr-only">Buscar opinión</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-orange/75" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por cliente, servicio o comentario"
              className="h-12 w-full rounded-2xl border border-white/10 bg-brand-night/55 pl-11 pr-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-brand-orange/45"
            />
          </label>
          <label className="block">
            <span className="sr-only">Ordenar opiniones</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-brand-night/55 px-4 text-sm font-black uppercase tracking-[0.08em] text-slate-300 outline-none transition focus:border-brand-orange/45"
            >
              {REVIEW_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {loadError && (
            <div className="rounded-2xl border border-brand-rust/25 bg-brand-rust/10 p-5 text-sm font-bold text-orange-100 lg:col-span-3">
              {loadError} Verifica que el usuario operativo esté autenticado y que la migración de opiniones esté aplicada.
            </div>
          )}
          {visibleReviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-white/10 bg-brand-night/55 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">{review.name}</h3>
                  <p className="truncate text-xs font-bold text-slate-500">{review.vehicle || review.service}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${REVIEW_STATUS_STYLES[review.status] || REVIEW_STATUS_STYLES.pending}`}>
                  {REVIEW_STATUS_LABELS[review.status] || review.status}
                </span>
              </div>
              <div className="mb-3 flex items-center gap-1">
                {[...Array(review.rating || 5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <p className="text-sm leading-6 text-slate-300">"{review.text}"</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Servicio: {review.service}</p>
                <p>Publicación: {review.publicationConsent ? 'Autorizada' : 'Privada'}</p>
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-orange" />
                  Recibida: {formatReviewDate(review.createdAt)}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={review.status === 'approved' || updatingReviewId === review.id}
                  onClick={() => handleStatusChange({ id: review.id, status: 'approved' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-green/25 bg-brand-green/15 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.08em] text-green-100 transition hover:bg-brand-green/25 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {review.status === 'approved' ? 'Aprobada' : 'Aprobar'}
                </button>
                <button
                  type="button"
                  disabled={review.status === 'hidden' || updatingReviewId === review.id}
                  onClick={() => handleStatusChange({ id: review.id, status: 'hidden' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-rust/25 bg-brand-rust/15 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.08em] text-orange-100 transition hover:bg-brand-rust/25 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  {review.status === 'hidden' ? 'Oculta' : 'Ocultar'}
                </button>
              </div>
            </article>
          ))}
          {!loadError && reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-orange/20 bg-brand-night/45 p-5 text-sm font-bold text-slate-500 lg:col-span-3">
              Aún no hay opiniones registradas.
            </div>
          )}
          {!loadError && reviews.length > 0 && visibleReviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-orange/20 bg-brand-night/45 p-5 text-sm font-bold text-slate-500 lg:col-span-3">
              No hay opiniones que coincidan con este filtro o búsqueda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminReviewsSection;
