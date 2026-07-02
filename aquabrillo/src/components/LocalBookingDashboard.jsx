import { useMemo, useState } from 'react';
import { CalendarDays, MessageCircle, Search } from 'lucide-react';
import { PAYMENT_STATUSES, RESERVATION_STATUSES } from '../config/booking';
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

const getTodayIso = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizePhone = (value) => String(value || '').replace(/\D/g, '');

const eventTypeLabels = {
  confirmada: 'Confirmada por WhatsApp',
  recordatorio_24h: 'Recordatorio 24h',
  en_camino: 'Aviso en camino',
  terminada: 'Servicio terminado',
};

const formatEventDate = (value) => {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getCustomerWhatsAppLink = (item) => {
  const phone = normalizePhone(item.customerPhone);
  if (phone.length < 10) return '';

  const message = [
    `Hola ${item.customerName || ''}`.trim() + ', te contactamos de AQUABRILLO para dar seguimiento a tu preagenda.',
    '',
    `Folio: ${item.folio}`,
    `Servicio: ${item.services?.map((service) => service.label || service.name).join(', ') || 'Servicio AQUABRILLO'}`,
    `Fecha y hora: ${item.dateLabel || item.date || 'Por confirmar'} ${item.time || ''}`.trim(),
    '',
    '¿Nos confirmas si mantenemos este horario?'
  ].join('\n');

  return `https://wa.me/52${phone.slice(-10)}?text=${encodeURIComponent(message)}`;
};

const getServiceLabel = (item) =>
  item.services?.map((service) => service.label || service.name).filter(Boolean).join(', ') || 'Servicio AQUABRILLO';

const getReservationDateTimeLabel = (item) =>
  `${item.dateLabel || item.date || 'Por confirmar'} ${item.time || ''}`.trim();

const getOperationalWhatsAppLink = (item, message) => {
  const phone = normalizePhone(item.customerPhone);
  if (phone.length < 10) return '';

  return `https://wa.me/52${phone.slice(-10)}?text=${encodeURIComponent(message)}`;
};

const buildOperationalMessages = (item) => {
  const customerName = item.customerName || 'cliente';
  const serviceLabel = getServiceLabel(item);
  const dateTimeLabel = getReservationDateTimeLabel(item);

  return [
    {
      id: 'confirmada',
      label: 'Confirmar cita',
      status: 'confirmada',
      message: [
        `Hola ${customerName}, tu cita AQUABRILLO queda confirmada.`,
        '',
        `Folio: ${item.folio}`,
        `Servicio: ${serviceLabel}`,
        `Fecha y hora: ${dateTimeLabel}`,
        '',
        'Gracias por confiar en AQUABRILLO.'
      ].join('\n')
    },
    {
      id: 'recordatorio_24h',
      label: 'Recordatorio 24h',
      message: [
        `Hola ${customerName}, te recordamos tu servicio AQUABRILLO programado.`,
        '',
        `Folio: ${item.folio}`,
        `Servicio: ${serviceLabel}`,
        `Fecha y hora: ${dateTimeLabel}`,
        '',
        'Si necesitas ajustar la direccion o el horario, puedes responder este mensaje.'
      ].join('\n')
    },
    {
      id: 'en_camino',
      label: 'En camino',
      status: 'en_camino',
      message: [
        `Hola ${customerName}, el equipo AQUABRILLO va en camino a tu servicio.`,
        '',
        `Folio: ${item.folio}`,
        `Servicio: ${serviceLabel}`,
        '',
        'Te avisamos al llegar.'
      ].join('\n')
    },
    {
      id: 'terminada',
      label: 'Terminado',
      status: 'terminada',
      message: [
        `Hola ${customerName}, tu servicio AQUABRILLO ha finalizado.`,
        '',
        `Folio: ${item.folio}`,
        `Servicio: ${serviceLabel}`,
        '',
        'Gracias por tu preferencia. Si todo quedo perfecto, nos encantaria volver a atenderte.'
      ].join('\n')
    }
  ];
};

const quickStatusActions = [
  { id: 'confirmada', label: 'Confirmar' },
  { id: 'en_camino', label: 'En camino' },
  { id: 'en_servicio', label: 'En servicio' },
  { id: 'terminada', label: 'Terminar' },
];

const sortOptions = [
  { id: 'upcoming', label: 'Proximas citas' },
  { id: 'newest', label: 'Mas recientes' },
  { id: 'highest_amount', label: 'Mayor monto' },
];

const getReservationTimestamp = (item) => {
  if (!item?.date) return Number.MAX_SAFE_INTEGER;
  return new Date(`${item.date}T${item.time || '00:00'}`).getTime();
};

const getReservationStatusLabel = (statusId) =>
  RESERVATION_STATUSES.find((status) => status.id === statusId)?.label || statusId || 'Preagenda';

const getReservationStatusTone = (statusId) => {
  const tones = {
    preagenda_whatsapp: 'border-brand-orange/25 bg-brand-orange/12 text-orange-100',
    confirmada: 'border-brand-green/25 bg-brand-green/12 text-green-100',
    en_camino: 'border-sky-400/25 bg-sky-400/12 text-sky-100',
    en_servicio: 'border-brand-orange/35 bg-brand-orange/18 text-orange-50',
    terminada: 'border-white/10 bg-white/[0.06] text-slate-300',
    cancelada: 'border-brand-rust/30 bg-brand-rust/14 text-red-100',
  };

  return tones[statusId] || 'border-white/10 bg-white/[0.06] text-slate-300';
};

const getDateDisplayLabel = (value) => {
  if (!value) return 'Hoy';

  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${value}T12:00:00`));
};

const LocalBookingDashboard = ({
  prebookings = [],
  reservationEvents = [],
  storageMode = 'local',
  onStatusChange,
  onOperationalUpdate,
  onMessageLog,
}) => {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('upcoming');
  const todayIso = getTodayIso();
  const dateOptions = useMemo(() => (
    [...new Set(prebookings.map((item) => item.date).filter(Boolean))]
      .sort()
      .map((date) => ({ id: date, label: date }))
  ), [prebookings]);
  const visiblePrebookings = useMemo(() => prebookings
    .filter((item) => {
      const statusMatches = statusFilter === 'todos' || item.status === statusFilter;
      const dateMatches = dateFilter === 'todos' || item.date === dateFilter;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const searchMatches = !normalizedSearch || [
        item.folio,
        item.customerName,
        item.customerPhone,
        item.vehicle?.label,
        item.address,
        item.notes,
        item.status,
        item.paymentStatus,
        item.assignedTo,
        item.date,
        item.dateLabel,
        item.time,
        item.services?.map((service) => service.label || service.name).join(' '),
      ].filter(Boolean).join(' ').toLowerCase().includes(normalizedSearch);

      return statusMatches && dateMatches && searchMatches;
    })
    .sort((a, b) => {
      if (sortOrder === 'highest_amount') {
        return (b.estimate?.price || 0) - (a.estimate?.price || 0);
      }

      if (sortOrder === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      return getReservationTimestamp(a) - getReservationTimestamp(b);
    }), [dateFilter, prebookings, searchTerm, sortOrder, statusFilter]);
  const todayPrebookings = useMemo(() => (
    prebookings
      .filter((item) => item.date === todayIso)
      .sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')))
  ), [prebookings, todayIso]);
  const nextTodayFolio = todayPrebookings.find((item) =>
    !['terminada', 'cancelada'].includes(item.status)
  )?.folio || todayPrebookings[0]?.folio;
  const localMetrics = useMemo(() => ({
    count: prebookings.length,
    estimatedRevenue: prebookings.reduce((sum, item) => sum + (item.estimate?.price || 0), 0),
    nextPending: prebookings[0]?.folio || 'Sin folios',
    pending: prebookings.filter((item) => item.status === 'preagenda_whatsapp').length,
    today: prebookings.filter((item) => item.date === todayIso).length,
  }), [prebookings, todayIso]);
  const eventsByFolio = useMemo(() => reservationEvents.reduce((grouped, event) => {
    if (!event.folio) return grouped;

    return {
      ...grouped,
      [event.folio]: [...(grouped[event.folio] || []), event],
    };
  }, {}), [reservationEvents]);

  return (
    <ScrollReveal delay={260}>
      <div className="mt-6 rounded-3xl border border-brand-orange/15 bg-white/[0.03] p-4 shadow-2xl shadow-black/10 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Dashboard admin MVP</span>
            <h3 className="mt-2 text-2xl font-black text-white">Reservas y preagendas</h3>
          </div>
          <p className="max-w-xl text-sm text-slate-500">
            Vista operativa inicial. Fuente actual: {storageMode}. Cuando Supabase este conectado, este panel leera reservas reales.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-brand-night/55 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Preagendas</div>
            <div className="mt-2 text-2xl font-black text-white">{localMetrics.count}</div>
          </div>
          <button
            type="button"
            onClick={() => setDateFilter(todayIso)}
            className="rounded-2xl border border-brand-orange/20 bg-brand-orange/10 p-4 text-left transition hover:border-brand-orange/40"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              <CalendarDays className="h-4 w-4 text-brand-orange" />
              Hoy
            </div>
            <div className="mt-2 text-2xl font-black text-white">{localMetrics.today}</div>
          </button>
          <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Estimado local</div>
            <div className="mt-2 text-2xl font-black text-white">{currency.format(localMetrics.estimatedRevenue)}</div>
          </div>
          <div className="rounded-2xl border border-brand-rust/20 bg-brand-rust/10 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Pendientes</div>
            <div className="mt-2 text-2xl font-black text-white">{localMetrics.pending}</div>
            <div className="mt-1 truncate text-xs font-bold text-slate-500">{localMetrics.nextPending}</div>
          </div>
        </div>

        <div className="mb-5 overflow-hidden rounded-2xl border border-brand-orange/15 bg-gradient-to-br from-brand-orange/12 via-white/[0.035] to-brand-green/10 p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Agenda de hoy</div>
              <div className="mt-1 text-lg font-black capitalize text-white">{getDateDisplayLabel(todayIso)}</div>
            </div>
            <div className="rounded-full border border-white/10 bg-brand-night/65 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-300">
              {todayPrebookings.length} servicio{todayPrebookings.length === 1 ? '' : 's'}
            </div>
          </div>

          {todayPrebookings.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {todayPrebookings.slice(0, 6).map((item) => {
                const todayWhatsAppActions = buildOperationalMessages(item)
                  .filter((action) => ['confirmada', 'en_camino'].includes(action.id));
                const isNextToday = item.folio === nextTodayFolio;

                return (
                  <div
                    key={`today-${item.folio}`}
                    className={`rounded-2xl border bg-brand-night/70 p-3 text-sm shadow-xl shadow-black/10 ${
                      isNextToday ? 'border-brand-orange/35 ring-1 ring-brand-orange/20' : 'border-white/10'
                    }`}
                  >
                    {isNextToday && (
                      <div className="mb-2 inline-flex rounded-full bg-brand-orange px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-brand-night">
                        Siguiente servicio
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-2xl font-black text-white">{item.time || '--:--'}</div>
                        <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">{item.folio}</div>
                      </div>
                      <span className={`max-w-[9rem] rounded-full border px-2.5 py-1 text-right text-[0.62rem] font-black uppercase tracking-[0.1em] ${getReservationStatusTone(item.status || 'preagenda_whatsapp')}`}>
                        {getReservationStatusLabel(item.status || 'preagenda_whatsapp')}
                      </span>
                    </div>

                    <div className="mt-3 min-w-0">
                      <p className="truncate text-base font-black text-slate-100">{item.customerName || 'Cliente sin nombre'}</p>
                      <p className="mt-1 line-clamp-2 text-xs font-bold text-slate-500">{getServiceLabel(item)}</p>
                      <p className="mt-2 text-xs font-black text-white">
                        {currency.format(item.estimate?.price || 0)}
                        <span className="mx-2 text-slate-600">|</span>
                        {minutesToLabel(item.estimate?.minutes)}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {todayWhatsAppActions.map((action) => {
                        const href = getOperationalWhatsAppLink(item, action.message);

                        if (!href) {
                          return (
                            <button
                              key={`${item.folio}-${action.id}-today-disabled`}
                              type="button"
                              disabled
                              className="rounded-xl border border-dashed border-white/10 px-2 py-2 text-[0.62rem] font-black uppercase tracking-[0.08em] text-slate-600"
                            >
                              Sin telefono
                            </button>
                          );
                        }

                        return (
                          <a
                            key={`${item.folio}-${action.id}-today`}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              if (action.status) {
                                onStatusChange?.({ folio: item.folio, status: action.status });
                              }
                              onMessageLog?.({
                                folio: item.folio,
                                eventType: action.id,
                                channel: 'manual_whatsapp',
                                deliveryStatus: 'manual_opened',
                                customerPhone: item.customerPhone,
                                message: action.message,
                                metadata: {
                                  source: 'today_agenda',
                                  statusApplied: action.status || null,
                                },
                              });
                            }}
                            className="flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-2 py-2 text-center text-[0.62rem] font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#1EBE5D]"
                          >
                            {action.id === 'confirmada' ? 'Confirmar' : action.label}
                          </a>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => onStatusChange?.({ folio: item.folio, status: 'en_servicio' })}
                        className="col-span-2 min-h-11 rounded-xl border border-brand-green/25 bg-brand-green/10 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.08em] text-green-100 transition hover:border-brand-green/45 hover:bg-brand-green/15"
                      >
                        Marcar en servicio
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
              {todayPrebookings.length > 6 && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter(todayIso);
                    setSortOrder('upcoming');
                  }}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-300 transition hover:border-brand-orange/30 hover:text-brand-orange"
                >
                  Ver {todayPrebookings.length - 6} servicio{todayPrebookings.length - 6 === 1 ? '' : 's'} mas en la lista
                </button>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-brand-night/55 p-5 text-sm font-bold text-slate-500">
              Sin servicios programados para hoy.
            </div>
          )}
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-brand-night/45 p-2">
          <button
            type="button"
            onClick={() => setStatusFilter('todos')}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
              statusFilter === 'todos'
                ? 'bg-brand-orange text-brand-night'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            Todas
          </button>
          {RESERVATION_STATUSES.map((status) => (
            <button
              key={`quick-${status.id}`}
              type="button"
              onClick={() => setStatusFilter(status.id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                statusFilter === status.id
                  ? 'bg-brand-orange text-brand-night'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-brand-night/45 p-3 md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr]">
          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Buscar cliente</span>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-brand-night px-3 py-2 focus-within:border-brand-orange/55">
              <Search className="h-4 w-4 text-brand-orange/75" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cliente, telefono, folio, pago o servicio"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </label>
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-orange/55"
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
              className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-orange/55"
            >
              <option value="todos">Todas</option>
              <option value={todayIso}>Hoy</option>
              {dateOptions.map((date) => (
                <option key={date.id} value={date.id}>{date.label}</option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Orden</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-orange/55"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
          <span>
            Mostrando {Math.min(visiblePrebookings.length, 6)} de {visiblePrebookings.length} resultado{visiblePrebookings.length === 1 ? '' : 's'}
          </span>
          {(searchTerm || statusFilter !== 'todos' || dateFilter !== 'todos' || sortOrder !== 'upcoming') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setDateFilter('todos');
                setSortOrder('upcoming');
              }}
              className="rounded-full border border-white/10 px-3 py-1.5 font-black uppercase tracking-[0.12em] text-slate-400 transition hover:border-brand-orange/30 hover:text-brand-orange"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {visiblePrebookings.slice(0, 6).map((item) => (
            <div key={item.folio} className="rounded-2xl border border-white/10 bg-brand-night/55 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-black text-white">{item.folio}</span>
                <span className="rounded-full bg-brand-orange/12 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-orange-100">
                  {item.status || 'preagenda'}
                </span>
              </div>
              <div className="space-y-1 text-sm text-slate-400">
                <p><span className="text-slate-500">Cliente:</span> {item.customerName || 'Sin nombre'}</p>
                <p><span className="text-slate-500">Telefono:</span> {item.customerPhone || 'Sin telefono'}</p>
                <p><span className="text-slate-500">Vehiculo:</span> {item.vehicle?.label}</p>
                <p><span className="text-slate-500">Fecha:</span> {item.dateLabel} {item.time}</p>
                <p><span className="text-slate-500">Servicios:</span> {item.services?.map((service) => service.label || service.name).join(', ')}</p>
                {item.coverage && (
                  <p>
                    <span className="text-slate-500">Cobertura:</span> {item.coverage.status} {item.coverage.tier ? `(${item.coverage.tier})` : ''}
                  </p>
                )}
                {item.notes && <p><span className="text-slate-500">Notas:</span> {item.notes}</p>}
                <p>
                  <span className="text-slate-500">Pago:</span> {item.paymentStatus || 'pendiente'}
                  {item.assignedTo ? ` | Asignado: ${item.assignedTo}` : ''}
                </p>
                <p className="font-bold text-white">{currency.format(item.estimate?.price || 0)} | {minutesToLabel(item.estimate?.minutes)}</p>
              </div>
              {(() => {
                const itemEvents = eventsByFolio[item.folio] || [];
                const lastEvent = itemEvents[0];

                return (
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-500">Ultimo contacto</span>
                      <span className="text-[0.65rem] font-bold text-slate-500">
                        {lastEvent ? formatEventDate(lastEvent.createdAt) : 'Sin registro'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-300">
                      {lastEvent ? eventTypeLabels[lastEvent.eventType] || lastEvent.eventType : 'Aun no hay acciones de WhatsApp'}
                    </p>
                    {itemEvents.length > 1 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {itemEvents.slice(1, 4).map((event) => (
                          <span
                            key={event.id}
                            className="rounded-full border border-white/10 bg-brand-night/70 px-2 py-1 text-[0.62rem] font-bold text-slate-500"
                          >
                            {eventTypeLabels[event.eventType] || event.eventType}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              <label className="mt-3 block">
                <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">Cambiar estado</span>
                <select
                  value={item.status || 'preagenda_whatsapp'}
                  onChange={(event) => onStatusChange?.({ folio: item.folio, status: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-orange/55"
                >
                  {RESERVATION_STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {quickStatusActions.map((action) => (
                  <button
                    key={`${item.folio}-${action.id}`}
                    type="button"
                    onClick={() => onStatusChange?.({ folio: item.folio, status: action.id })}
                    className={`rounded-xl border px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.08em] transition ${
                      item.status === action.id
                        ? 'border-brand-orange/50 bg-brand-orange/20 text-orange-100'
                        : 'border-white/10 bg-white/[0.035] text-slate-400 hover:border-brand-orange/25 hover:text-white'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">Pago</span>
                  <select
                    value={item.paymentStatus || 'pendiente'}
                    onChange={(event) => onOperationalUpdate?.({
                      folio: item.folio,
                      updates: { paymentStatus: event.target.value },
                    })}
                    className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-orange/55"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">Asignado</span>
                  <input
                    defaultValue={item.assignedTo || ''}
                    onBlur={(event) => onOperationalUpdate?.({
                      folio: item.folio,
                      updates: { assignedTo: event.target.value.trim() },
                    })}
                    placeholder="Responsable"
                    className="w-full rounded-xl border border-white/10 bg-brand-night px-3 py-2 text-xs font-bold text-white outline-none placeholder:text-slate-600 focus:border-brand-orange/55"
                  />
                </label>
              </div>
              {getCustomerWhatsAppLink(item) ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-2">
                  <div className="mb-2 flex items-center gap-2 px-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-500">
                    <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                    WhatsApp operativo
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {buildOperationalMessages(item).map((action) => {
                      const href = getOperationalWhatsAppLink(item, action.message);

                      return (
                        <a
                          key={`${item.folio}-${action.id}-whatsapp`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (action.status) {
                              onStatusChange?.({ folio: item.folio, status: action.status });
                            }
                            onMessageLog?.({
                              folio: item.folio,
                              eventType: action.id,
                              channel: 'manual_whatsapp',
                              deliveryStatus: 'manual_opened',
                              customerPhone: item.customerPhone,
                              message: action.message,
                              metadata: {
                                source: 'admin_dashboard',
                                statusApplied: action.status || null,
                              },
                            });
                          }}
                          className="flex items-center justify-center rounded-lg bg-[#25D366] px-3 py-2 text-center text-[0.65rem] font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#1EBE5D]"
                        >
                          {action.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-white/10 px-4 py-3 text-center text-xs font-bold text-slate-600">
                  Sin telefono valido para WhatsApp
                </div>
              )}
            </div>
          ))}
          {visiblePrebookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-orange/20 bg-brand-night/45 p-5 text-sm font-bold text-slate-500 lg:col-span-3">
              No hay preagendas con estos filtros.
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default LocalBookingDashboard;
