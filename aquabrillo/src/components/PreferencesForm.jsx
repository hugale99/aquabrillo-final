import { useEffect, useState } from 'react';
import { createCustomerReview } from '../services/reviewRepository';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLe_ChBO2ulwpZtTRvl-4CU-nmqVeTt3d3cTw9MgMkMsRyO9hMGg5n_-fFSM-ifeUC/exec';
const defaultFormData = {
  nombre: '',
  correo: '',
  vehiculo: '',
  servicio: '',
  calificacion: '5',
  comentarios: '',
  publicacion: 'Sí'
};

const PreferencesForm = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => {
    if (!email) return true;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const closePanel = () => setIsOpen(false);

  useEffect(() => {
    const openPanel = () => setIsOpen(true);
    window.addEventListener('aquabrillo:open-review-form', openPanel);
    return () => window.removeEventListener('aquabrillo:open-review-form', openPanel);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!isValidEmail(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo válido o deja el campo vacío.';
    }

    if (!formData.nombre.trim()) newErrors.nombre = true;
    if (!formData.servicio.trim()) newErrors.servicio = true;
    if (!formData.comentarios.trim()) newErrors.comentarios = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      try {
        await createCustomerReview(formData);
      } catch {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            tipo: 'opinion_cliente',
            fecha: new Date().toISOString()
          })
        });
      }

      setFeedback({
        message: 'Gracias por compartir tu opinión. La revisaremos antes de publicarla en el sitio.',
        type: 'success'
      });
      setFormData(defaultFormData);
    } catch {
      setFeedback({
        message: 'No se pudo enviar tu opinión. Intenta nuevamente en unos segundos.',
        type: 'error'
      });
    } finally {
      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 6000);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #05070b;
          --card: #10141f;
          --card-soft: #151b2a;
          --text: #ffffff;
          --muted: #aeb7c8;
          --line: rgba(255,255,255,0.12);
          --primary: #2f80ff;
          --primary-soft: rgba(47,128,255,0.16);
          --success: #33d69f;
          --danger: #ff5c5c;
        }

        .pref-form-wrapper {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
        }

        .pref-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(2px);z-index:45;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease}
        .pref-overlay.show{opacity:1;visibility:visible}
        .pref-drawer{position:fixed;top:0;right:0;height:100vh;width:min(100%,760px);background:rgba(8,11,19,.98);box-shadow:-24px 0 80px rgba(0,0,0,.35);z-index:50;transform:translateX(100%);transition:transform .3s ease;display:flex;flex-direction:column;overflow-y:auto}
        .pref-drawer.show{transform:translateX(0)}
        .pref-panel-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:24px 28px 0}
        .pref-panel-title{font-size:24px;font-weight:800;margin:0;color:#ffffff}
        .pref-panel-description{margin:10px 0 0;color:var(--muted);font-size:15px;line-height:1.7;max-width:680px}
        .pref-drawer-close{width:44px;height:44px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(15,23,42,.85);color:#ffffff;cursor:pointer;display:grid;place-items:center;transition:background .18s ease}
        .pref-drawer-close:hover{background:rgba(47,128,255,.15)}
        .pref-panel-inner{padding:0 28px 28px}
        .pref-form{background:rgba(16,20,31,.94);border:1px solid var(--line);border-radius:32px;box-shadow:0 24px 70px rgba(0,0,0,.35);padding:28px;backdrop-filter:blur(18px)}
        .pref-section-label{
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--primary);
          margin: 10px 0 18px;
          font-weight: 700;
        }

        .pref-field {
          margin-bottom: 28px;
        }

        .pref-question {
          display: block;
          font-size: 20px;
          font-weight: 750;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
          color: #ffffff;
        }

        .pref-hint {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .pref-input,
        .pref-textarea {
          width: 100%;
          background: var(--card-soft);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 15px 16px;
          color: var(--text);
          font-size: 16px;
          outline: none;
          transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        .pref-input::placeholder,
        .pref-textarea::placeholder {
          color: #738096;
        }

        .pref-input:focus,
        .pref-textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-soft);
          background: #111827;
        }

        .pref-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .pref-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .pref-option-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 58px;
          padding: 14px 16px;
          background: var(--card-soft);
          border: 1px solid var(--line);
          border-radius: 18px;
          cursor: pointer;
          transition: transform 0.18s ease, border 0.18s ease, background 0.18s ease;
          user-select: none;
        }

        .pref-option-card:hover {
          transform: translateY(-1px);
          border-color: rgba(47,128,255,0.6);
          background: #182033;
        }

        .pref-option-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .pref-custom-control {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          border: 2px solid #748199;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          transition: all 0.18s ease;
        }

        .pref-checkbox .pref-custom-control {
          border-radius: 6px;
        }

        .pref-custom-control::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--primary);
          transform: scale(0);
          transition: transform 0.18s ease;
        }

        .pref-checkbox .pref-custom-control::after {
          width: 10px;
          height: 6px;
          border-radius: 0;
          background: transparent;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(-45deg) scale(0);
          margin-top: -2px;
        }

        .pref-option-card input:checked + .pref-custom-control {
          border-color: var(--primary);
          background: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-soft);
        }

        .pref-option-card input:checked + .pref-custom-control::after {
          transform: scale(1);
          background: #fff;
        }

        .pref-checkbox input:checked + .pref-custom-control::after {
          transform: rotate(-45deg) scale(1);
        }

        .pref-option-card span {
          font-size: 15px;
          font-weight: 650;
          color: #edf3ff;
        }

        .pref-error {
          color: var(--danger);
          font-size: 13px;
          margin-top: 10px;
          display: none;
        }

        .pref-error.show {
          display: block;
        }

        .pref-actions {
          margin-top: 34px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
        }

        .pref-button {
          width: 100%;
          border: 0;
          border-radius: 18px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #2f80ff, #1d5fd8);
          color: white;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .pref-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.06);
        }

        .pref-button:disabled {
          cursor: wait;
          opacity: 0.72;
          transform: none;
          filter: none;
        }

        .pref-small-note {
          color: var(--muted);
          font-size: 13px;
          text-align: center;
          line-height: 1.5;
          max-width: 520px;
        }

        .pref-message{display:none;margin-top:22px;padding:18px;border-radius:20px;color:#fff;line-height:1.5;text-align:center;animation:slideIn .4s ease}
        .pref-message.show{display:block}
        .pref-message.success{border:1px solid rgba(51,214,159,.35);background:rgba(51,214,159,.12);color:#d9fff2}
        .pref-message.error{border:1px solid rgba(239,68,68,.35);background:rgba(239,68,68,.12);color:#ffe3e3}

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .pref-drawer {
            width: 100%;
          }

          .pref-form {
            padding: 22px;
            border-radius: 26px;
          }

          .pref-options {
            grid-template-columns: 1fr;
          }

          .pref-question {
            font-size: 18px;
          }

        }
      `}</style>

      <div className={`pref-overlay ${isOpen ? 'show' : ''}`} onClick={closePanel} />
      <div
        id="preferences-drawer"
        className={`pref-drawer ${isOpen ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
        aria-hidden={!isOpen}
      >
        <div className="pref-panel-header">
          <div>
            <h2 id="preferences-title" className="pref-panel-title">Comparte tu experiencia</h2>
            <p className="pref-panel-description">Tu opinión nos ayuda a mejorar el servicio y a que otros clientes conozcan la experiencia AQUABRILLO.</p>
          </div>
          <button className="pref-drawer-close" type="button" onClick={closePanel} aria-label="Cerrar formulario de preferencias">
            ✕
          </button>
        </div>
        <div className="pref-panel-inner">
          <div className="pref-form-container">
            <form className="pref-form" onSubmit={handleSubmit} noValidate>
              <div className="pref-section-label">Opinion del cliente</div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="nombre">Nombre</label>
                <div className="pref-hint">Así podremos identificar tu opinión en nuestro equipo.</div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="pref-input"
                  placeholder="Escribe tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.nombre)}
                />
                {errors.nombre && <div className="pref-error show">Escribe tu nombre para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="correo">Correo electrónico</label>
                <div className="pref-hint">Opcional. Solo lo usaremos si necesitamos dar seguimiento a tu experiencia.</div>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="pref-input"
                  placeholder="ejemplo@correo.com"
                  value={formData.correo}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.correo)}
                  aria-describedby={errors.correo ? 'correo-error' : undefined}
                />
                {errors.correo && <div id="correo-error" className="pref-error show">Por favor ingresa un correo válido o deja el campo vacío.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="vehiculo">Vehículo atendido</label>
                <div className="pref-hint">Opcional. Ejemplo: Jeep Renegade, BYD King, MG ONE.</div>
                <input
                  type="text"
                  id="vehiculo"
                  name="vehiculo"
                  className="pref-input"
                  placeholder="Marca, modelo o tipo de vehículo"
                  value={formData.vehiculo}
                  onChange={handleChange}
                />
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="servicio">Servicio recibido</label>
                <div className="pref-hint">Cuéntanos qué servicio realizamos.</div>
                <input
                  type="text"
                  id="servicio"
                  name="servicio"
                  className="pref-input"
                  placeholder="Lavado premium, interior, cerámico, pulido..."
                  value={formData.servicio}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.servicio)}
                />
                {errors.servicio && <div className="pref-error show">Escribe el servicio recibido.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">Calificación</label>
                <div className="pref-hint">Selecciona cómo fue tu experiencia con AQUABRILLO.</div>
                <div className="pref-options">
                  {['5', '4', '3'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="calificacion"
                        value={opt}
                        checked={formData.calificacion === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{'★'.repeat(Number(opt))}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="comentarios">Tu opinión</label>
                <div className="pref-hint">Describe cómo fue el servicio, puntualidad, atención y resultado final.</div>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  className="pref-textarea"
                  placeholder="Escribe aquí tu experiencia..."
                  value={formData.comentarios}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.comentarios)}
                ></textarea>
                {errors.comentarios && <div className="pref-error show">Escribe tu opinión para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">Publicación de la opinión</label>
                <div className="pref-hint">Indícanos si podemos mostrar tu opinión en el sitio de AQUABRILLO.</div>
                <div className="pref-options">
                  {['Sí', 'No'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="publicacion"
                        value={opt}
                        checked={formData.publicacion === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt === 'Sí' ? 'Sí, pueden publicarla' : 'No, sólo feedback privado'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pref-actions">
                <button type="submit" className="pref-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando opinión...' : 'Enviar mi opinión'}
                </button>
                <div className="pref-small-note">
                  Al enviar tu opinión aceptas que AQUABRILLO la revise para mejorar el servicio y, si autorizas, pueda mostrarla como testimonio.
                </div>
              </div>

              {feedback.message && (
                <div className={`pref-message ${feedback.type} show`} role="status" aria-live="polite">
                  {feedback.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesForm;


