export const BOOKING_COPY = {
  eyebrow: 'MVP de reserva 24/7',
  title: 'Cotiza y preagenda en menos de un minuto',
  description:
    'Selecciona vehiculo, servicios y horario. Recibiras un estimado inmediato y un mensaje listo para confirmar por WhatsApp.',
  disclaimer:
    'Precio sujeto a validacion final segun condiciones reales del vehiculo y zona de servicio.',
};

export const BOOKING_DEFAULTS = {
  vehicleId: 'auto',
  serviceIds: ['lavado'],
  daysToShow: 8,
  catalogUrl: '/data/booking-services.csv',
  scheduleUrl: '/data/booking-time-slots.csv',
  businessEndHour: '18:30',
  storageKey: 'aquabrillo_prebookings',
  maxLocalHistory: 25,
  premiumWashSlotCapacity: 2,
};

export const VEHICLE_TYPES = [
  { id: 'auto', label: 'Auto', multiplier: 1, washPrice: 150, washMinutes: 90, order: 1, defaultSelected: true },
  { id: 'suv', label: 'SUV', multiplier: 1.13, washPrice: 170, washMinutes: 120, order: 2 },
  { id: 'camioneta_grande', label: 'Camioneta Grande', multiplier: 1.33, washPrice: 200, washMinutes: 120, order: 3 },
];

export const BOOKING_SERVICES = [
  { id: 'lavado', label: 'Lavado premium', category: 'lavado', price: 380, minutes: 75, order: 1, defaultSelected: true },
  { id: 'encerado', label: 'Encerado protector', category: 'proteccion', price: 450, minutes: 80, order: 2 },
  { id: 'interior', label: 'Detallado interior', category: 'interior', price: 650, minutes: 120, order: 3 },
  { id: 'exterior', label: 'Detallado exterior', category: 'exterior', price: 650, minutes: 120, order: 4 },
  { id: 'paquete_brillo', label: 'Paquete brillo express', category: 'paquete', price: 850, minutes: 140, order: 5 },
  { id: 'paquete_rescate', label: 'Paquete rescate interior', category: 'paquete', price: 980, minutes: 180, order: 6 },
  { id: 'correccion', label: 'Correccion de pintura', category: 'especializado', price: 1200, minutes: 180, order: 7 },
  { id: 'motor', label: 'Limpieza superficial de motor', category: 'especializado', price: 550, minutes: 70, order: 8 },
  { id: 'faros', label: 'Restauracion de faros', category: 'especializado', price: 650, minutes: 90, order: 9 },
  { id: 'ceramico', label: 'Recubrimiento ceramico', category: 'proteccion', price: 2500, minutes: 300, order: 10 },
  { id: 'mantenimiento_ceramico', label: 'Mantenimiento ceramico', category: 'proteccion', price: 950, minutes: 150, order: 11 },
];

export const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00'];

export const WEEKDAY_KEYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export const RESERVATION_STATUSES = [
  { id: 'preagenda_whatsapp', label: 'Preagenda' },
  { id: 'confirmada', label: 'Confirmada' },
  { id: 'en_camino', label: 'En camino' },
  { id: 'en_servicio', label: 'En servicio' },
  { id: 'terminada', label: 'Terminada' },
  { id: 'cancelada', label: 'Cancelada' },
];

export const BLOCKING_RESERVATION_STATUSES = [
  'preagenda_whatsapp',
  'confirmada',
  'en_camino',
  'en_servicio',
];

export const isBlockingReservationStatus = (status = 'preagenda_whatsapp') =>
  BLOCKING_RESERVATION_STATUSES.includes(status || 'preagenda_whatsapp');

export const getReservationSlotKey = ({ date, time }) => (
  date && time ? `${date}|${time}` : ''
);

export const getOccupiedSlotMap = (reservations = []) =>
  reservations.reduce((slotMap, reservation) => {
    if (!reservation?.date || !reservation?.time || !isBlockingReservationStatus(reservation.status)) {
      return slotMap;
    }

    const slotKey = getReservationSlotKey(reservation);
    slotMap.set(slotKey, (slotMap.get(slotKey) ?? 0) + 1);
    return slotMap;
  }, new Map());

export const isPremiumWashOnlySelection = (services = []) => {
  if (!services.length) return false;

  return services.every((service) => {
    const serviceId = typeof service === 'string' ? service : service?.id;
    return serviceId === 'lavado';
  });
};

const getReservationServiceIds = (reservation) => {
  if (Array.isArray(reservation?.serviceIds)) return reservation.serviceIds;
  if (Array.isArray(reservation?.service_ids)) return reservation.service_ids;
  if (Array.isArray(reservation?.services)) {
    return reservation.services.map((service) => service.id).filter(Boolean);
  }

  return [];
};

export const getSlotUsage = ({ date, time, reservations = [] }) => {
  const slotReservations = reservations.filter((reservation) => (
    reservation?.date === date
    && reservation?.time === time
    && isBlockingReservationStatus(reservation.status)
  ));

  return {
    total: slotReservations.length,
    hasExclusiveReservation: slotReservations.some((reservation) => (
      !isPremiumWashOnlySelection(getReservationServiceIds(reservation))
    )),
  };
};

export const getSlotAvailability = ({
  slot,
  date,
  reservations = [],
  estimatedMinutes,
  selectedServices = [],
}) => {
  if (!slot || !date) {
    return {
      usedCapacity: 0,
      remainingCapacity: 0,
      effectiveCapacity: 0,
      longEnough: false,
      available: false,
    };
  }

  const requestedWashOnly = isPremiumWashOnlySelection(selectedServices);
  const slotUsage = getSlotUsage({ date, time: slot.time, reservations });
  const effectiveCapacity = requestedWashOnly && !slotUsage.hasExclusiveReservation
    ? Math.max(slot.capacity, BOOKING_DEFAULTS.premiumWashSlotCapacity)
    : Math.min(slot.capacity, 1);
  const remainingCapacity = Math.max(effectiveCapacity - slotUsage.total, 0);
  const longEnough = isSlotLongEnough({
    slotTime: slot.time,
    estimatedMinutes,
  });

  return {
    usedCapacity: slotUsage.total,
    remainingCapacity,
    effectiveCapacity,
    longEnough,
    available: slot.active && !slotUsage.hasExclusiveReservation && remainingCapacity > 0 && longEnough,
  };
};

export const calculateBookingEstimate = ({ vehicle, services }) => {
  const servicesPrice = services.reduce((sum, item) => {
    if (item.id === 'lavado') return sum + (vehicle.washPrice || item.price);
    return sum + item.price * vehicle.multiplier;
  }, 0);
  const servicesTime = services.reduce((sum, item) => {
    if (item.id === 'lavado') return sum + (vehicle.washMinutes || item.minutes);
    return sum + item.minutes * Math.max(vehicle.multiplier, 0.85);
  }, 0);
  const price = Math.round(servicesPrice / 10) * 10;
  const minutes = Math.ceil(servicesTime / 5) * 5;

  return { price, minutes };
};

const normalizeId = (value) =>
  String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(String(value || '').replace(/[$,\s]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isActive = (value) => {
  const normalized = normalizeId(value);
  return !normalized || ['si', 'yes', 'true', '1', 'activo'].includes(normalized);
};

export const getFallbackBookingCatalog = () => ({
  vehicles: VEHICLE_TYPES,
  services: BOOKING_SERVICES,
});

export const getFallbackBookingSchedule = () =>
  WEEKDAY_KEYS.flatMap((day) =>
    TIME_SLOTS.map((time) => ({
      day,
      time,
      capacity: day === 'domingo' ? 0 : 1,
      active: day !== 'domingo',
      notes: day === 'domingo' ? 'Activar solo por campana' : 'Horario base',
    }))
  );

export const parseBookingServicesCsv = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return getFallbackBookingCatalog();

  const [headerLine, ...rows] = lines;
  const headers = parseCsvLine(headerLine).map((header) => normalizeId(header));
  const records = rows.map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = values[index] ?? '';
      return record;
    }, {});
  });

  const activeRecords = records.filter((record) => isActive(record.activo));
  const vehicles = activeRecords
    .filter((record) => normalizeId(record.tipo) === 'vehiculo')
    .map((record) => ({
      id: normalizeId(record.id || record.nombre),
      label: record.nombre || record.id,
      multiplier: toNumber(record.multiplicador, 0),
      washPrice: toNumber(record.precio_mxn, 0),
      washMinutes: toNumber(record.duracion_min, 0),
      order: toNumber(record.orden, 999),
      defaultSelected: normalizeId(record.seleccion_default) === 'si',
    }))
    .sort((a, b) => a.order - b.order);

  const serviceRecords = activeRecords.filter((record) => normalizeId(record.tipo) === 'servicio');
  const washServiceRecords = serviceRecords.filter((record) => normalizeId(record.categoria) === 'lavado');
  const baseWashRecord = washServiceRecords[0];
  const baseWashPrice = vehicles.find((item) => item.defaultSelected)?.washPrice || toNumber(baseWashRecord?.precio_mxn, 0) || 1;
  const normalizedVehicles = vehicles.map((vehicle, index) => {
    const sourceWashRecord = washServiceRecords[index] ?? baseWashRecord;
    const washPrice = vehicle.washPrice || toNumber(sourceWashRecord?.precio_mxn, 0);
    const washMinutes = vehicle.washMinutes || toNumber(sourceWashRecord?.duracion_min, 0);

    return {
      ...vehicle,
      washPrice,
      washMinutes,
      multiplier: vehicle.multiplier || Math.max(washPrice / baseWashPrice, 0.1),
    };
  });

  const washService = washServiceRecords.length
    ? [{
        id: 'lavado',
        label: 'Lavado premium',
        category: 'lavado',
        price: toNumber(washServiceRecords[0].precio_mxn, 0),
        minutes: toNumber(washServiceRecords[0].duracion_min, 0),
        order: toNumber(washServiceRecords[0].orden, 1),
        defaultSelected: washServiceRecords.some((record) => normalizeId(record.seleccion_default) === 'si'),
      }]
    : [];

  const services = [
    ...washService,
    ...serviceRecords
      .filter((record) => normalizeId(record.categoria) !== 'lavado')
    .map((record) => ({
      id: normalizeId(record.id || record.nombre),
      label: record.nombre || record.id,
      category: normalizeId(record.categoria) || 'servicio',
      price: toNumber(record.precio_mxn, 0),
      minutes: toNumber(record.duracion_min, 0),
      order: toNumber(record.orden, 999),
      defaultSelected: normalizeId(record.seleccion_default) === 'si',
    })),
  ]
    .sort((a, b) => a.order - b.order);

  return {
    vehicles: normalizedVehicles.length ? normalizedVehicles : VEHICLE_TYPES,
    services: services.length ? services : BOOKING_SERVICES,
  };
};

export const parseBookingScheduleCsv = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return getFallbackBookingSchedule();

  const [headerLine, ...rows] = lines;
  const headers = parseCsvLine(headerLine).map((header) => normalizeId(header));

  return rows
    .map((line) => {
      const values = parseCsvLine(line);
      const record = headers.reduce((nextRecord, header, index) => {
        nextRecord[header] = values[index] ?? '';
        return nextRecord;
      }, {});

      return {
        day: normalizeId(record.dia),
        time: record.hora_inicio,
        capacity: toNumber(record.capacidad, 1),
        active: isActive(record.activo),
        notes: record.notas || 'Horario base',
      };
    })
    .filter((slot) => slot.day && slot.time)
    .sort((a, b) => a.day.localeCompare(b.day) || a.time.localeCompare(b.time));
};

export const getWeekdayKeyFromDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T12:00:00`);
  return WEEKDAY_KEYS[date.getDay()] ?? '';
};

export const timeToMinutes = (time) => {
  const [hours = 0, minutes = 0] = String(time || '').split(':').map(Number);
  return hours * 60 + minutes;
};

export const isSlotLongEnough = ({ slotTime, estimatedMinutes, businessEndHour = BOOKING_DEFAULTS.businessEndHour }) => {
  if (!slotTime || !estimatedMinutes) return true;
  return timeToMinutes(slotTime) + estimatedMinutes <= timeToMinutes(businessEndHour);
};

export const createPrebookingFolio = ({ date, time, vehicleId, serviceIds }) => {
  const rawValue = [date, time, vehicleId, ...serviceIds].filter(Boolean).join('|') || 'aquabrillo';
  const hash = rawValue.split('').reduce((sum, char) => (
    (sum * 31 + char.charCodeAt(0)) % 46656
  ), 0);
  const code = hash.toString(36).toUpperCase().padStart(3, '0');
  const datePart = String(date || 'pendiente').replace(/-/g, '').slice(2, 8).toUpperCase();
  const timePart = String(time || '0000').replace(':', '');

  return `AQB-${datePart}-${timePart}-${code}`;
};

export const saveLocalPrebooking = (prebooking) => {
  if (typeof window === 'undefined') return [];

  try {
    const current = JSON.parse(window.localStorage.getItem(BOOKING_DEFAULTS.storageKey) || '[]');
    const nextRecord = {
      ...prebooking,
      status: 'preagenda_whatsapp',
      channel: 'web_whatsapp',
      createdAt: new Date().toISOString(),
    };
    const deduped = current.filter((item) => item.folio !== nextRecord.folio);
    const next = [nextRecord, ...deduped].slice(0, BOOKING_DEFAULTS.maxLocalHistory);
    window.localStorage.setItem(BOOKING_DEFAULTS.storageKey, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
};

export const getLocalPrebookings = () => {
  if (typeof window === 'undefined') return [];

  try {
    const current = JSON.parse(window.localStorage.getItem(BOOKING_DEFAULTS.storageKey) || '[]');
    return Array.isArray(current) ? current : [];
  } catch {
    return [];
  }
};

export const updateLocalPrebookingStatus = ({ folio, status }) => {
  if (typeof window === 'undefined') return [];

  try {
    const current = getLocalPrebookings();
    const next = current.map((item) => (
      item.folio === folio
        ? { ...item, status, updatedAt: new Date().toISOString() }
        : item
    ));
    window.localStorage.setItem(BOOKING_DEFAULTS.storageKey, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
};
