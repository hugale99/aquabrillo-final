import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  BOOKING_COPY,
  BOOKING_DEFAULTS,
  calculateBookingEstimate,
  createPrebookingFolio,
  getFallbackBookingCatalog,
  getFallbackBookingSchedule,
  getCoverageContext,
  getSlotAvailability,
  getWeekdayKeyFromDate,
  parseBookingScheduleCsv,
  parseBookingServicesCsv,
} from '../config/booking';
import { getWhatsAppLink } from '../config/site';
import { createReservation, getReservationStorageStatus, listReservations } from '../services/bookingRepository';
import ScrollReveal from './ui/ScrollReveal';

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const getDateOptions = () => {
  const formatter = new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return Array.from({ length: BOOKING_DEFAULTS.daysToShow }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const day = date.getDay();
    const iso = date.toISOString().slice(0, 10);
    const label = index === 0 ? 'Hoy' : formatter.format(date);

    return {
      id: iso,
      label,
      status: day === 0 ? 'Cupo limitado' : index < 2 ? 'Alta demanda' : 'Disponible',
    };
  });
};

const minutesToLabel = (minutes) => {
  if (!minutes) return 'Selecciona servicios';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} h`;
  return `${hours} h ${rest} min`;
};

const BookingMvp = () => {
  const [catalog, setCatalog] = useState(getFallbackBookingCatalog);
  const [schedule, setSchedule] = useState(getFallbackBookingSchedule);
  const [catalogStatus, setCatalogStatus] = useState('fallback');
  const [scheduleStatus, setScheduleStatus] = useState('fallback');
  const [vehicleId, setVehicleId] = useState(BOOKING_DEFAULTS.vehicleId);
  const [selectedServices, setSelectedServices] = useState(BOOKING_DEFAULTS.serviceIds);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [lastSavedFolio, setLastSavedFolio] = useState('');
  const [reservations, setReservations] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(getReservationStorageStatus);
  const [bookingAlert, setBookingAlert] = useState('');
  const [coverageContext, setCoverageContext] = useState(null);

  const dateOptions = useMemo(() => getDateOptions(), []);
  const { vehicles, services } = catalog;
  const vehicle = vehicles.find((item) => item.id === vehicleId) ?? vehicles[0];
  const selectedServiceItems = services.filter((item) => selectedServices.includes(item.id));

  useEffect(() => {
    let isMounted = true;

    const loadBookingData = async () => {
      try {
        const [catalogResponse, scheduleResponse] = await Promise.all([
          fetch(BOOKING_DEFAULTS.catalogUrl, { cache: 'no-store' }),
          fetch(BOOKING_DEFAULTS.scheduleUrl, { cache: 'no-store' }),
        ]);

        if (!catalogResponse.ok) throw new Error('No se pudo cargar el catalogo');

        const catalogCsvText = await catalogResponse.text();
        const nextCatalog = parseBookingServicesCsv(catalogCsvText);
        const nextSchedule = scheduleResponse.ok
          ? parseBookingScheduleCsv(await scheduleResponse.text())
          : getFallbackBookingSchedule();

        if (!isMounted) return;

        setCatalog(nextCatalog);
        setSchedule(nextSchedule);
        setCatalogStatus('csv');
        setScheduleStatus(scheduleResponse.ok ? 'csv' : 'fallback');
        setVehicleId(nextCatalog.vehicles.find((item) => item.defaultSelected)?.id ?? nextCatalog.vehicles[0]?.id ?? BOOKING_DEFAULTS.vehicleId);
        setSelectedServices(() => {
          const defaults = nextCatalog.services.filter((item) => item.defaultSelected).map((item) => item.id);
          return defaults.length ? defaults : [nextCatalog.services[0]?.id].filter(Boolean);
        });
      } catch {
        if (!isMounted) return;
        setCatalog(getFallbackBookingCatalog());
        setSchedule(getFallbackBookingSchedule());
        setCatalogStatus('fallback');
        setScheduleStatus('fallback');
      }
    };

    loadBookingData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const applyCoverageContext = (context) => {
      setCoverageContext(context);
      if (context?.area) {
        setAddress((current) => current || context.area);
      }
    };

    applyCoverageContext(getCoverageContext());

    const handleCoverageUpdated = (event) => {
      applyCoverageContext(event.detail || getCoverageContext());
    };

    window.addEventListener('aquabrillo:coverage-updated', handleCoverageUpdated);
    return () => window.removeEventListener('aquabrillo:coverage-updated', handleCoverageUpdated);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadReservations = async () => {
      const result = await listReservations();

      if (!isMounted) return;

      setReservations(result.reservations);
      setReservationStatus({
        mode: result.storage,
        localStorageKey: getReservationStorageStatus().localStorageKey,
      });
    };

    const handleReservationsUpdated = (event) => {
      if (Array.isArray(event.detail?.reservations)) {
        setReservations(event.detail.reservations);
        setReservationStatus({
          mode: event.detail.storage || getReservationStorageStatus().mode,
          localStorageKey: getReservationStorageStatus().localStorageKey,
        });
      } else {
        loadReservations();
      }
    };

    loadReservations();
    window.addEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);
    };
  }, []);

  const estimate = useMemo(() => {
    return calculateBookingEstimate({ vehicle, services: selectedServiceItems });
  }, [selectedServiceItems, vehicle]);

  const selectedDateLabel = dateOptions.find((item) => item.id === selectedDate)?.label ?? 'Sin fecha';
  const selectedDayKey = getWeekdayKeyFromDate(selectedDate);
  const availableSlots = useMemo(() => (
    schedule
      .filter((slot) => slot.day === selectedDayKey)
      .map((slot) => {
        const slotAvailability = getSlotAvailability({
          slot,
          date: selectedDate,
          reservations,
          estimatedMinutes: estimate.minutes,
          selectedServices: selectedServiceItems,
        });

        return {
          ...slot,
          ...slotAvailability,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  ), [estimate.minutes, reservations, schedule, selectedDate, selectedDayKey, selectedServiceItems]);
  const selectedSlotIsAvailable = availableSlots.some((slot) => slot.time === selectedTime && slot.available);
  const canPrebook = selectedServices.length > 0 && selectedDate && selectedTime && selectedSlotIsAvailable;
  const prebookingFolio = useMemo(() => createPrebookingFolio({
    date: selectedDate,
    time: selectedTime,
    vehicleId,
    serviceIds: selectedServices,
  }), [selectedDate, selectedServices, selectedTime, vehicleId]);

  const whatsappMessage = [
    'Hola AQUABRILLO, quiero preagendar mi servicio.',
    '',
    `Folio temporal: ${prebookingFolio}`,
    `Vehiculo: ${vehicle.label}`,
    `Servicios: ${selectedServiceItems.map((item) => item.label).join(', ') || 'Sin seleccionar'}`,
    `Fecha: ${selectedDateLabel}`,
    `Hora: ${selectedTime || 'Sin hora'}`,
    `Precio estimado: ${estimate.price ? currency.format(estimate.price) : 'Por calcular'}`,
    `Duracion estimada: ${minutesToLabel(estimate.minutes)}`,
    `Direccion: ${address || '[Escribir direccion]'}`,
    coverageContext ? `Cobertura: ${coverageContext.status} (${coverageContext.tier})` : '',
    coverageContext?.distanceKm ? `Distancia estimada a base: ${Number(coverageContext.distanceKm).toFixed(1)} km` : '',
    coverageContext?.activeZone ? `Zona seleccionada: ${coverageContext.activeZone}` : '',
    '',
    'Quiero confirmar disponibilidad y detalles de mi preagenda.',
  ].filter((line) => line !== '').join('\n');

  const toggleService = (serviceId) => {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    );
  };

  const handlePrebook = async (event) => {
    event.preventDefault();
    if (!canPrebook) return;

    setBookingAlert('');

    const latestReservations = await listReservations();
    setReservations(latestReservations.reservations);
    setReservationStatus({
      mode: latestReservations.storage,
      localStorageKey: getReservationStorageStatus().localStorageKey,
    });

    const currentSlot = schedule.find((slot) => slot.day === selectedDayKey && slot.time === selectedTime);
    const currentSlotAvailability = getSlotAvailability({
      slot: currentSlot,
      date: selectedDate,
      reservations: latestReservations.reservations,
      estimatedMinutes: estimate.minutes,
      selectedServices: selectedServiceItems,
    });

    if (!currentSlotAvailability.available) {
      setSelectedTime('');
      setBookingAlert('Ese horario acaba de ocuparse. Elige otro horario disponible para continuar.');
      window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
        detail: {
          reservations: latestReservations.reservations,
          storage: latestReservations.storage,
        },
      }));
      return;
    }

    const result = await createReservation({
      folio: prebookingFolio,
      vehicle: {
        id: vehicle.id,
        label: vehicle.label,
      },
      services: selectedServiceItems.map((item) => ({
        id: item.id,
        label: item.label,
        price: item.id === 'lavado' ? (vehicle.washPrice || item.price) : item.price,
        minutes: item.id === 'lavado' ? (vehicle.washMinutes || item.minutes) : item.minutes,
      })),
      date: selectedDate,
      dateLabel: selectedDateLabel,
      time: selectedTime,
      estimate,
      address,
      coverage: coverageContext,
      message: whatsappMessage,
    });

    setReservationStatus({
      mode: result.storage,
      localStorageKey: getReservationStorageStatus().localStorageKey,
    });
    setReservations(result.history);
    window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
      detail: {
        reservations: result.history,
        storage: result.storage,
      },
    }));

    if (result.conflict) {
      setSelectedTime('');
      setBookingAlert('Ese horario ya fue tomado por otra preagenda. Selecciona otro horario disponible.');
      return;
    }

    setLastSavedFolio(prebookingFolio);
    window.open(getWhatsAppLink(whatsappMessage), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="cotizador" className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.12)_0%,_transparent_42%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
              <Sparkles className="h-4 w-4" />
              {BOOKING_COPY.eyebrow}
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {BOOKING_COPY.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              {BOOKING_COPY.description}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal delay={100}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 sm:p-6">
              <div className="grid gap-6">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">
                    <Car className="h-4 w-4" />
                    Tipo de vehiculo
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {vehicles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setVehicleId(item.id)}
                        className={`rounded-2xl border px-3 py-3 text-left text-sm font-bold transition ${
                          vehicleId === item.id
                            ? 'border-cyan-300/50 bg-cyan-300/15 text-white'
                            : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/25'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">
                    Servicios
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {services.map((item) => {
                      const checked = selectedServices.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleService(item.id)}
                          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                            checked
                              ? 'border-cyan-300/50 bg-cyan-300/15 text-white'
                              : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/25'
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-bold">{item.label}</span>
                            <span className="text-xs text-slate-500">{currency.format(item.price)} | {minutesToLabel(item.minutes)}</span>
                          </span>
                          <CheckCircle2 className={`h-5 w-5 ${checked ? 'text-cyan-300' : 'text-slate-700'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <div className="sticky top-28 rounded-3xl border border-cyan-300/15 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/25 backdrop-blur-xl sm:p-6">
              <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Estimado</div>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div className="text-4xl font-black text-white">{estimate.price ? currency.format(estimate.price) : '$0'}</div>
                  <div className="text-right text-sm text-slate-400">
                    <Clock className="mb-1 ml-auto h-4 w-4 text-cyan-300" />
                    {minutesToLabel(estimate.minutes)}
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {BOOKING_COPY.disclaimer}
                </p>
                <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-600">
                  Catalogo: {catalogStatus === 'csv' ? 'Excel / CSV activo' : 'configuracion base'} | Horarios: {scheduleStatus === 'csv' ? 'CSV activo' : 'base'} | Reservas: {reservationStatus.mode}
                </p>
              </div>

              <div className="mb-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">
                  <CalendarDays className="h-4 w-4" />
                  Fecha tentativa
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {dateOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.id);
                        setSelectedTime('');
                      }}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${
                        selectedDate === item.id
                          ? 'border-cyan-300/50 bg-cyan-300/15 text-white'
                          : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/25'
                      }`}
                    >
                      <span className="block text-sm font-black capitalize">{item.label}</span>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500">{item.status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">Hora tentativa</div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                  {(selectedDate ? availableSlots : []).map((slot) => {
                    const unavailableReason = !slot.active
                      ? 'Horario inactivo'
                      : slot.remainingCapacity <= 0
                        ? 'Horario ocupado'
                        : 'No disponible para la duracion estimada';

                    return (
                      <button
                        key={`${slot.day}-${slot.time}`}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        title={slot.available ? slot.notes : unavailableReason}
                        className={`min-h-[64px] rounded-2xl border px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${
                          selectedTime === slot.time && slot.available
                            ? 'border-cyan-300/50 bg-cyan-300/15 text-white'
                            : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/25'
                        }`}
                      >
                        <span className="block">{slot.time}</span>
                        <span className="mt-0.5 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                          {slot.remainingCapacity > 0
                            ? `${slot.remainingCapacity}/${slot.effectiveCapacity} cupos`
                            : 'Ocupado'}
                        </span>
                      </button>
                    );
                  })}
                  {selectedDate && availableSlots.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-bold text-slate-400">
                      No hay horarios activos para este dia.
                    </div>
                  )}
                </div>
                {bookingAlert && (
                  <p className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs font-bold text-amber-100" role="status" aria-live="polite">
                    {bookingAlert}
                  </p>
                )}
              </div>

              <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">Resumen</span>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[0.68rem] font-black text-cyan-100">
                    {prebookingFolio}
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Vehiculo</span>
                    <span className="font-bold text-white">{vehicle.label}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Fecha</span>
                    <span className="font-bold text-white">{selectedDate ? selectedDateLabel : 'Por elegir'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Hora</span>
                    <span className="font-bold text-white">{selectedTime || 'Por elegir'}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 text-slate-300">
                    {selectedServiceItems.map((item) => item.label).join(', ') || 'Selecciona al menos un servicio'}
                  </div>
                </div>
              </div>

              <label className="mb-5 block">
                <span className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">Direccion</span>
                {coverageContext && (
                  <div className="mb-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-xs font-bold text-cyan-100">
                    Cobertura: {coverageContext.status} ({coverageContext.tier})
                    {coverageContext.distanceKm ? ` | ${Number(coverageContext.distanceKm).toFixed(1)} km de base` : ''}
                  </div>
                )}
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={3}
                  placeholder="Colonia, calle o referencia para confirmar cobertura"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </label>

              <a
                href={canPrebook ? getWhatsAppLink(whatsappMessage) : '#cotizador'}
                aria-disabled={!canPrebook}
                onClick={handlePrebook}
                className={`flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-black text-white transition ${
                  canPrebook
                    ? 'bg-[#25D366] shadow-xl shadow-[#25D366]/25 hover:bg-[#1EBE5D]'
                    : 'pointer-events-none bg-slate-700 text-slate-400'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Preagendar por WhatsApp
                <ArrowRight className="h-5 w-5" />
              </a>
              {lastSavedFolio === prebookingFolio && (
                <p className="mt-3 text-center text-xs font-bold text-cyan-100/70" role="status" aria-live="polite">
                  Preagenda preparada localmente con folio {prebookingFolio}.
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BookingMvp;
