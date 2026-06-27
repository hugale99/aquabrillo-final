import {
  BOOKING_DEFAULTS,
  getLocalPrebookings,
  saveLocalPrebooking,
  updateLocalPrebookingStatus,
} from '../config/booking';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const RESERVATIONS_TABLE = 'reservations';
const CREATE_RESERVATION_RPC = 'create_reservation_with_capacity';

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const toReservationPayload = (prebooking) => ({
  folio: prebooking.folio,
  status: 'preagenda_whatsapp',
  channel: 'web_whatsapp',
  vehicle_id: prebooking.vehicle?.id,
  vehicle_label: prebooking.vehicle?.label,
  services: prebooking.services,
  service_ids: prebooking.services?.map((service) => service.id) ?? [],
  date: prebooking.date,
  date_label: prebooking.dateLabel,
  time: prebooking.time,
  estimate_price: prebooking.estimate?.price ?? 0,
  estimate_minutes: prebooking.estimate?.minutes ?? 0,
  address: prebooking.address,
  coverage: prebooking.coverage,
  message: prebooking.message,
  source: hasSupabaseConfig ? 'supabase' : 'local',
});

const fromReservationPayload = (reservation) => ({
  folio: reservation.folio,
  status: reservation.status,
  channel: reservation.channel,
  vehicle: {
    id: reservation.vehicle_id,
    label: reservation.vehicle_label,
  },
  services: reservation.services ?? [],
  date: reservation.date,
  dateLabel: reservation.date_label,
  time: reservation.time,
  estimate: {
    price: reservation.estimate_price,
    minutes: reservation.estimate_minutes,
  },
  address: reservation.address,
  coverage: reservation.coverage,
  message: reservation.message,
  createdAt: reservation.created_at,
});

const supabaseRequest = async (path, options = {}) => {
  const extraHeaders = Object.fromEntries(
    Object.entries(options.headers ?? {}).filter(([, value]) => value !== undefined)
  );

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...extraHeaders,
    },
  });

  if (!response.ok) {
    const error = new Error(`Supabase request failed: ${response.status}`);
    error.status = response.status;

    try {
      error.payload = await response.json();
    } catch {
      error.payload = null;
    }

    throw error;
  }

  return response.json();
};

const isReservationConflict = (error) =>
  error?.status === 409 || error?.payload?.code === '23505';

const isMissingReservationRpc = (error) =>
  error?.status === 404 || String(error?.payload?.code || '').startsWith('PGRST');

const createSupabaseReservation = async (prebooking) => {
  const reservationPayload = toReservationPayload(prebooking);

  try {
    return await supabaseRequest(`rpc/${CREATE_RESERVATION_RPC}`, {
      method: 'POST',
      body: JSON.stringify({
        reservation_payload: reservationPayload,
        wash_slot_capacity: BOOKING_DEFAULTS.premiumWashSlotCapacity,
      }),
    });
  } catch (error) {
    if (!isMissingReservationRpc(error)) throw error;

    const [reservation] = await supabaseRequest(RESERVATIONS_TABLE, {
      method: 'POST',
      body: JSON.stringify(reservationPayload),
    });

    return reservation;
  }
};

export const createReservation = async (prebooking) => {
  if (!hasSupabaseConfig) {
    const localHistory = saveLocalPrebooking(prebooking);

    return {
      storage: 'local',
      reservation: localHistory[0],
      history: localHistory,
    };
  }

  try {
    const reservation = await createSupabaseReservation(prebooking);
    const localHistory = saveLocalPrebooking(prebooking);
    const refreshed = await listReservations();

    return {
      storage: 'supabase',
      reservation: fromReservationPayload(reservation),
      history: refreshed.reservations.length ? refreshed.reservations : localHistory,
    };
  } catch (error) {
    if (isReservationConflict(error)) {
      const refreshed = await listReservations();

      return {
        storage: 'supabase_conflict',
        conflict: true,
        error,
        reservation: null,
        history: refreshed.reservations,
      };
    }

    const localHistory = saveLocalPrebooking(prebooking);

    return {
      storage: 'local_fallback',
      error,
      reservation: localHistory[0],
      history: localHistory,
    };
  }
};

export const listLocalReservations = () => getLocalPrebookings();

export const listReservations = async () => {
  const localReservations = getLocalPrebookings();

  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      reservations: localReservations,
    };
  }

  try {
    const rows = await supabaseRequest(`${RESERVATIONS_TABLE}?select=*&order=created_at.desc&limit=25`, {
      method: 'GET',
      headers: {
        Prefer: undefined,
      },
    });

    return {
      storage: 'supabase',
      reservations: rows.map(fromReservationPayload),
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      reservations: localReservations,
    };
  }
};

export const updateReservationStatus = async ({ folio, status }) => {
  const localHistory = updateLocalPrebookingStatus({ folio, status });

  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      reservations: localHistory,
    };
  }

  try {
    await supabaseRequest(`${RESERVATIONS_TABLE}?folio=eq.${encodeURIComponent(folio)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        updated_at: new Date().toISOString(),
      }),
    });

    const refreshed = await listReservations();
    return {
      storage: 'supabase',
      reservations: refreshed.reservations,
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      reservations: localHistory,
    };
  }
};

export const getReservationStorageStatus = () => ({
  mode: hasSupabaseConfig ? 'supabase' : 'local',
  localStorageKey: BOOKING_DEFAULTS.storageKey,
});
