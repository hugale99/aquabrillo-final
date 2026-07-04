import {
  BOOKING_DEFAULTS,
  getLocalReservationPayments,
  getLocalPrebookings,
  saveLocalReservationPayment,
  saveLocalPrebooking,
  updateLocalPrebooking,
  updateLocalPrebookingStatus,
} from '../config/booking';
import { HAS_SUPABASE_CONFIG, SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/supabase';

const RESERVATIONS_TABLE = 'reservations';
const RESERVATION_EVENTS_TABLE = 'reservation_events';
const RESERVATION_PAYMENTS_TABLE = 'reservation_payments';
const CREATE_RESERVATION_RPC = 'create_reservation_with_capacity';

let supabaseAccessToken = '';

export const setSupabaseAccessToken = (accessToken = '') => {
  supabaseAccessToken = accessToken;
};

const toReservationPayload = (prebooking) => ({
  folio: prebooking.folio,
  status: 'preagenda_whatsapp',
  channel: 'web_whatsapp',
  customer_name: prebooking.customerName,
  customer_phone: prebooking.customerPhone,
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
  notes: prebooking.notes,
  payment_status: prebooking.paymentStatus || 'pendiente',
  assigned_to: prebooking.assignedTo || null,
  message: prebooking.message,
  source: HAS_SUPABASE_CONFIG ? 'supabase' : 'local',
});

const fromReservationPayload = (reservation) => ({
  folio: reservation.folio,
  status: reservation.status,
  channel: reservation.channel,
  customerName: reservation.customer_name,
  customerPhone: reservation.customer_phone,
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
  notes: reservation.notes,
  paymentStatus: reservation.payment_status,
  assignedTo: reservation.assigned_to,
  message: reservation.message,
  createdAt: reservation.created_at,
  updatedAt: reservation.updated_at,
});

const fromReservationEventPayload = (event) => ({
  id: event.id,
  folio: event.reservation_folio,
  eventType: event.event_type,
  channel: event.channel,
  deliveryStatus: event.delivery_status,
  customerPhone: event.customer_phone,
  message: event.message,
  metadata: event.metadata ?? {},
  createdAt: event.created_at,
});

const fromReservationPaymentPayload = (payment) => ({
  id: payment.id,
  folio: payment.reservation_folio,
  amount: Number(payment.amount_mxn || 0),
  method: payment.method,
  reference: payment.reference,
  notes: payment.notes,
  createdBy: payment.created_by,
  paidAt: payment.paid_at,
  createdAt: payment.created_at,
});

const toReservationPaymentPayload = (payment) => ({
  reservation_folio: payment.folio,
  amount_mxn: Number(payment.amount || 0),
  method: payment.method || 'efectivo',
  reference: payment.reference || null,
  notes: payment.notes || null,
  created_by: payment.createdBy || null,
  paid_at: payment.paidAt || new Date().toISOString(),
});

const toReservationUpdatePayload = (updates = {}) => {
  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.paymentStatus !== undefined) payload.payment_status = updates.paymentStatus;
  if (updates.assignedTo !== undefined) payload.assigned_to = updates.assignedTo || null;
  if (updates.notes !== undefined) payload.notes = updates.notes || null;

  return payload;
};

const toLocalReservationUpdates = (updates = {}) => ({
  ...(updates.status !== undefined ? { status: updates.status } : {}),
  ...(updates.paymentStatus !== undefined ? { paymentStatus: updates.paymentStatus } : {}),
  ...(updates.assignedTo !== undefined ? { assignedTo: updates.assignedTo } : {}),
  ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
});

const supabaseRequest = async (path, options = {}) => {
  const extraHeaders = Object.fromEntries(
    Object.entries(options.headers ?? {}).filter(([, value]) => value !== undefined)
  );

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${supabaseAccessToken || SUPABASE_ANON_KEY}`,
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
  if (!HAS_SUPABASE_CONFIG) {
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

  if (!HAS_SUPABASE_CONFIG) {
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

export const listReservationEvents = async () => {
  if (!HAS_SUPABASE_CONFIG) {
    return {
      storage: 'local',
      events: [],
    };
  }

  try {
    const rows = await supabaseRequest(
      `${RESERVATION_EVENTS_TABLE}?select=*&order=created_at.desc&limit=100`,
      {
        method: 'GET',
        headers: {
          Prefer: undefined,
        },
      }
    );

    return {
      storage: 'supabase',
      events: rows.map(fromReservationEventPayload),
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      events: [],
    };
  }
};

export const listReservationPayments = async () => {
  const localPayments = getLocalReservationPayments();

  if (!HAS_SUPABASE_CONFIG) {
    return {
      storage: 'local',
      payments: localPayments,
    };
  }

  try {
    const rows = await supabaseRequest(
      `${RESERVATION_PAYMENTS_TABLE}?select=*&order=paid_at.desc&limit=200`,
      {
        method: 'GET',
        headers: {
          Prefer: undefined,
        },
      }
    );

    return {
      storage: 'supabase',
      payments: rows.map(fromReservationPaymentPayload),
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      payments: localPayments,
    };
  }
};

export const updateReservationStatus = async ({ folio, status }) => {
  const localHistory = updateLocalPrebookingStatus({ folio, status });

  if (!HAS_SUPABASE_CONFIG) {
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

export const updateReservation = async ({ folio, updates }) => {
  const localHistory = updateLocalPrebooking({
    folio,
    updates: toLocalReservationUpdates(updates),
  });

  if (!HAS_SUPABASE_CONFIG) {
    return {
      storage: 'local',
      reservations: localHistory,
    };
  }

  try {
    await supabaseRequest(`${RESERVATIONS_TABLE}?folio=eq.${encodeURIComponent(folio)}`, {
      method: 'PATCH',
      body: JSON.stringify(toReservationUpdatePayload(updates)),
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

export const createReservationPayment = async ({ folio, amount, method, reference = '', notes = '', createdBy = '', estimatePrice = 0 }) => {
  const normalizedAmount = Number(amount || 0);
  const localPayments = saveLocalReservationPayment({
    folio,
    amount: normalizedAmount,
    method,
    reference,
    notes,
    createdBy,
  });
  const folioPaymentsTotal = localPayments
    .filter((payment) => payment.folio === folio)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const nextPaymentStatus = folioPaymentsTotal >= Number(estimatePrice || 0) && Number(estimatePrice || 0) > 0
    ? 'pagado'
    : normalizedAmount > 0
      ? 'anticipo'
      : 'pendiente';

  if (!HAS_SUPABASE_CONFIG) {
    const reservations = updateLocalPrebooking({
      folio,
      updates: { paymentStatus: nextPaymentStatus },
    });

    return {
      storage: 'local',
      payments: localPayments,
      reservations,
    };
  }

  try {
    await supabaseRequest(RESERVATION_PAYMENTS_TABLE, {
      method: 'POST',
      body: JSON.stringify(toReservationPaymentPayload({
        folio,
        amount: normalizedAmount,
        method,
        reference,
        notes,
        createdBy,
      })),
    });

    await supabaseRequest(`${RESERVATIONS_TABLE}?folio=eq.${encodeURIComponent(folio)}`, {
      method: 'PATCH',
      body: JSON.stringify(toReservationUpdatePayload({ paymentStatus: nextPaymentStatus })),
    });

    const [refreshedReservations, refreshedPayments] = await Promise.all([
      listReservations(),
      listReservationPayments(),
    ]);

    return {
      storage: 'supabase',
      payments: refreshedPayments.payments,
      reservations: refreshedReservations.reservations,
    };
  } catch (error) {
    try {
      await supabaseRequest(`${RESERVATIONS_TABLE}?folio=eq.${encodeURIComponent(folio)}`, {
        method: 'PATCH',
        body: JSON.stringify(toReservationUpdatePayload({ paymentStatus: nextPaymentStatus })),
      });
    } catch {
      updateLocalPrebooking({
        folio,
        updates: { paymentStatus: nextPaymentStatus },
      });
    }

    const refreshedReservations = await listReservations();

    return {
      storage: 'local_fallback',
      error,
      payments: localPayments,
      reservations: refreshedReservations.reservations,
    };
  }
};

export const logReservationEvent = async ({
  folio,
  eventType,
  channel = 'manual_whatsapp',
  deliveryStatus = 'manual_opened',
  message = '',
  customerPhone = '',
  metadata = {},
}) => {
  const eventPayload = {
    reservation_folio: folio,
    event_type: eventType,
    channel,
    delivery_status: deliveryStatus,
    customer_phone: customerPhone,
    message,
    metadata,
  };

  if (!HAS_SUPABASE_CONFIG) {
    return {
      storage: 'local',
      event: eventPayload,
    };
  }

  try {
    const [event] = await supabaseRequest(RESERVATION_EVENTS_TABLE, {
      method: 'POST',
      body: JSON.stringify(eventPayload),
    });

    return {
      storage: 'supabase',
      event,
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      event: eventPayload,
    };
  }
};

export const getReservationStorageStatus = () => ({
  mode: HAS_SUPABASE_CONFIG ? 'supabase' : 'local',
  localStorageKey: BOOKING_DEFAULTS.storageKey,
});
