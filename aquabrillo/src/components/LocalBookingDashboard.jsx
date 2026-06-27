import { useMemo, useState } from 'react';
import { RESERVATION_STATUSES } from '../config/booking';
import ScrollReveal from './ui/ScrollReveal';

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const minutesToLabel = (minutes) => {
  if (!minutes) return 'Sin duracion';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} h`;
  return `${hours} h ${rest} min`;
};

const LocalBookingDashboard = ({ prebookings = [], storageMode = 'local', onStatusChange }) => {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('todos');
  const dateOptions = useMemo(() => (
    [...new Set(prebookings.map((item) => item.date).filter(Boolean))]
      .sort()
      .map((date) => ({ id: date, label: date }))
  ), [prebookings]);
  const visiblePrebookings = useMemo(() => prebookings.filter((item) => {
    const statusMatches = statusFilter === 'todos' || item.status === statusFilter;
    const dateMatches = dateFilter === 'todos' || item.date === dateFilter;
    return statusMatches && dateMatches;
  }), [dateFilter, prebookings, statusFilter]);
  const localMetrics = useMemo(() => ({
    count: prebookings.length,
    estimatedRevenue: prebookings.reduce((sum, item) => sum + (item.estimate?.price || 0), 0),
    nextPending: prebookings[0]?.folio || 'Sin folios',
    pending: prebookings.filter((item) => item.status === 'preagenda_whatsapp').length,
  }), [prebookings]);

  return (
    <ScrollReveal delay={260}>
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/10 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">Dashboard admin MVP</span>
            <h3 className="mt-2 text-2xl font-black text-white">Reservas y preagendas</h3>
          </div>
          <p className="max-w-xl text-sm text-slate-500">
            Vista operativa inicial. Fuente actual: {storageMode}. Cuando Supabase este conectado, este panel leera reservas reales.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Preagendas</div>
            <div className="mt-2 text-2xl font-black text-white">{localMetrics.count}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Estimado local</div>
            <div className="mt-2 text-2xl font-black text-white">{currency.format(localMetrics.estimatedRevenue)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Pendientes</div>
            <div className="mt-2 text-2xl font-black text-white">{localMetrics.pending}</div>
            <div className="mt-1 truncate text-xs font-bold text-slate-500">{localMetrics.nextPending}</div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 sm:flex-row">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300/50"
            >
              <option value="todos">Todos</option>
              {RESERVATION_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>{status.label}</option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Fecha</span>
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300/50"
            >
              <option value="todos">Todas</option>
              {dateOptions.map((date) => (
                <option key={date.id} value={date.id}>{date.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {visiblePrebookings.slice(0, 6).map((item) => (
            <div key={item.folio} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-black text-white">{item.folio}</span>
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-cyan-100">
                  {item.status || 'preagenda'}
                </span>
              </div>
              <div className="space-y-1 text-sm text-slate-400">
                <p><span className="text-slate-500">Vehiculo:</span> {item.vehicle?.label}</p>
                <p><span className="text-slate-500">Fecha:</span> {item.dateLabel} {item.time}</p>
                <p><span className="text-slate-500">Servicios:</span> {item.services?.map((service) => service.label).join(', ')}</p>
                {item.coverage && (
                  <p>
                    <span className="text-slate-500">Cobertura:</span> {item.coverage.status} {item.coverage.tier ? `(${item.coverage.tier})` : ''}
                  </p>
                )}
                <p className="font-bold text-white">{currency.format(item.estimate?.price || 0)} | {minutesToLabel(item.estimate?.minutes)}</p>
              </div>
              <label className="mt-3 block">
                <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">Cambiar estado</span>
                <select
                  value={item.status || 'preagenda_whatsapp'}
                  onChange={(event) => onStatusChange?.({ folio: item.folio, status: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none focus:border-cyan-300/50"
                >
                  {RESERVATION_STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
          {visiblePrebookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 p-5 text-sm font-bold text-slate-500 lg:col-span-3">
              No hay preagendas con estos filtros.
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default LocalBookingDashboard;
