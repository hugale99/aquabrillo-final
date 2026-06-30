import { useEffect, useState } from 'react';
import { LockKeyhole, RefreshCw } from 'lucide-react';
import {
  getReservationStorageStatus,
  listReservationEvents,
  listReservations,
  logReservationEvent,
  updateReservation,
  updateReservationStatus,
} from '../services/bookingRepository';
import LocalBookingDashboard from './LocalBookingDashboard';

const AdminReservationsSection = ({ defaultOpen = false, canCollapse = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [reservations, setReservations] = useState([]);
  const [reservationEvents, setReservationEvents] = useState([]);
  const [storageMode, setStorageMode] = useState(getReservationStorageStatus().mode);

  const refreshReservations = async () => {
    const [result, eventsResult] = await Promise.all([
      listReservations(),
      listReservationEvents(),
    ]);

    setReservations(result.reservations);
    setReservationEvents(eventsResult.events);
    setStorageMode(result.storage);
    window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
      detail: {
        reservations: result.reservations,
        events: eventsResult.events,
        storage: result.storage,
      },
    }));
  };

  const handleStatusChange = async ({ folio, status }) => {
    const result = await updateReservationStatus({ folio, status });
    setReservations(result.reservations);
    setStorageMode(result.storage);
    window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
      detail: {
        reservations: result.reservations,
        storage: result.storage,
      },
    }));
  };

  const handleOperationalUpdate = async ({ folio, updates }) => {
    const result = await updateReservation({ folio, updates });
    setReservations(result.reservations);
    setStorageMode(result.storage);
    window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
      detail: {
        reservations: result.reservations,
        storage: result.storage,
      },
    }));
  };

  const handleMessageLog = async (event) => {
    await logReservationEvent(event);
    const eventsResult = await listReservationEvents();
    setReservationEvents(eventsResult.events);
  };

  useEffect(() => {
    const handleReservationsUpdated = (event) => {
      if (Array.isArray(event.detail?.reservations)) {
        setReservations(event.detail.reservations);
        if (Array.isArray(event.detail?.events)) {
          setReservationEvents(event.detail.events);
        }
        setStorageMode(event.detail.storage || getReservationStorageStatus().mode);
      } else {
        refreshReservations();
      }
    };

    window.addEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);
    return () => window.removeEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);
  }, []);

  useEffect(() => {
    if (defaultOpen) {
      queueMicrotask(refreshReservations);
    }
  }, [defaultOpen]);

  return (
    <section id="admin-reservas" className="bg-brand-night px-5 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              refreshReservations();
            }}
            className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:border-brand-orange/30 hover:text-brand-orange"
            aria-expanded={isOpen}
            aria-controls="admin-reservas-panel"
          >
            <LockKeyhole className="h-4 w-4" />
            Acceso operativo
          </button>
        ) : (
          <div id="admin-reservas-panel">
            <div className="mb-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={refreshReservations}
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-brand-orange/15"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              {canCollapse && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-white"
                >
                  Ocultar
                </button>
              )}
            </div>
            <LocalBookingDashboard
              prebookings={reservations}
              reservationEvents={reservationEvents}
              storageMode={storageMode}
              onStatusChange={handleStatusChange}
              onOperationalUpdate={handleOperationalUpdate}
              onMessageLog={handleMessageLog}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminReservationsSection;
