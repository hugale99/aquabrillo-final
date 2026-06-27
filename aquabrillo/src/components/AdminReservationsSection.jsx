import { useEffect, useState } from 'react';
import { LockKeyhole, RefreshCw } from 'lucide-react';
import { getReservationStorageStatus, listReservations, updateReservationStatus } from '../services/bookingRepository';
import LocalBookingDashboard from './LocalBookingDashboard';

const AdminReservationsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [storageMode, setStorageMode] = useState(getReservationStorageStatus().mode);

  const refreshReservations = async () => {
    const result = await listReservations();
    setReservations(result.reservations);
    setStorageMode(result.storage);
    window.dispatchEvent(new CustomEvent('aquabrillo:reservations-updated', {
      detail: {
        reservations: result.reservations,
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

  useEffect(() => {
    const handleReservationsUpdated = (event) => {
      if (Array.isArray(event.detail?.reservations)) {
        setReservations(event.detail.reservations);
        setStorageMode(event.detail.storage || getReservationStorageStatus().mode);
      } else {
        refreshReservations();
      }
    };

    window.addEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);
    return () => window.removeEventListener('aquabrillo:reservations-updated', handleReservationsUpdated);
  }, []);

  return (
    <section id="admin-reservas" className="bg-slate-950 px-5 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              refreshReservations();
            }}
            className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:border-cyan-300/25 hover:text-cyan-200"
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
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-300/15"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-white"
              >
                Ocultar
              </button>
            </div>
            <LocalBookingDashboard
              prebookings={reservations}
              storageMode={storageMode}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminReservationsSection;
