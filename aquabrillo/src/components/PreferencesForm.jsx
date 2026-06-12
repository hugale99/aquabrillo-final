import { useState } from 'react';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLe_ChBO2ulwpZtTRvl-4CU-nmqVeTt3d3cTw9MgMkMsRyO9hMGg5n_-fFSM-ifeUC/exec';
const defaultFormData = {
  nombre: '',
  correo: '',
  frecuencia: '',
  valor: '',
  suscripcion: '',
  modalidad: '',
  servicio: [],
  comentarios: ''
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

  const handleToggle = () => setIsOpen((prev) => !prev);
  const closePanel = () => setIsOpen(false);

  const validateForm = () => {
    const newErrors = {};

    if (!isValidEmail(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo válido o deja el campo vacío.';
    }

    if (!formData.frecuencia) newErrors.frecuencia = true;
    if (!formData.valor) newErrors.valor = true;
    if (!formData.suscripcion) newErrors.suscripcion = true;
    if (!formData.modalidad) newErrors.modalidad = true;
    if (formData.servicio.length === 0) newErrors.servicio = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        servicio: checked
          ? [...prev.servicio, value]
          : prev.servicio.filter((item) => item !== value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

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
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setFeedback({
        message: '✅ ¡Gracias por compartir tu opinión! Tus respuestas nos ayudan a mejorar la experiencia AQUABRILLO.',
        type: 'success'
      });
      setFormData(defaultFormData);
    } catch {
      setFeedback({
        message: '⚠️ No se pudo enviar tu respuesta. Intenta nuevamente en unos segundos.',
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

        .pref-widget-fixed {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          min-width: 220px;
          border-radius: 999px;
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 18px 40px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: transform 0.18s ease, background 0.18s ease;
        }

        .pref-widget-fixed:hover {
          transform: translateY(-50%) scale(1.02);
          background: rgba(15,23,42,1);
        }

        .pref-widget-icon {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          font-size: 18px;
          transition: transform 0.2s ease, background 0.2s ease;
          animation: prefWidgetPulse 6s ease-in-out infinite;
        }

        .pref-widget-fixed:hover .pref-widget-icon {
          transform: scale(1.08);
          background: rgba(255,255,255,0.14);
        }

        .pref-widget-fixed span {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        @keyframes prefWidgetPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

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

        @media (max-width: 1024px) {
          .pref-widget-fixed {
            right: 12px;
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

          .pref-widget-fixed {
            right: 16px;
            left: auto;
            top: 90px;
            bottom: auto;
            transform: translateY(0);
            width: auto;
            min-width: unset;
            padding: 10px 14px;
            gap: 8px;
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
          }

          .pref-widget-icon {
            width: 28px;
            height: 28px;
            font-size: 16px;
          }

          .pref-widget-fixed span {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="pref-form-wrapper px-6 lg:px-8">
        <button className="pref-widget-fixed" type="button" onClick={handleToggle} aria-expanded={isOpen} aria-controls="preferences-drawer">
          <span className="pref-widget-icon">💬</span>
          <span>Tu opinión nos interesa</span>
        </button>
      </div>

      <div className={`pref-overlay ${isOpen ? 'show' : ''}`} onClick={closePanel} />
      <div id="preferences-drawer" className={`pref-drawer ${isOpen ? 'show' : ''}`} aria-hidden={!isOpen}>
        <div className="pref-panel-header">
          <div>
            <h2 className="pref-panel-title">Tu opinión nos interesa</h2>
            <p className="pref-panel-description">Tus respuestas nos ayudan a crear mejores paquetes, promociones y experiencias para ti.</p>
          </div>
          <button className="pref-drawer-close" type="button" onClick={closePanel} aria-label="Cerrar formulario de preferencias">
            ✕
          </button>
        </div>
        <div className="pref-panel-inner">
          <div className="pref-form-container">
            <form className="pref-form" onSubmit={handleSubmit} noValidate>
              <div className="pref-section-label">Datos opcionales</div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="nombre">Nombre</label>
                <div className="pref-hint">Opcional. Nos ayuda a personalizar mejor nuestras ofertas.</div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="pref-input"
                  placeholder="Escribe tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="correo">Correo electrónico</label>
                <div className="pref-hint">Opcional. Solo lo usaremos si deseas recibir promociones o novedades.</div>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="pref-input"
                  placeholder="ejemplo@correo.com"
                  value={formData.correo}
                  onChange={handleChange}
                />
                {errors.correo && <div className="pref-error show">Por favor ingresa un correo válido o deja el campo vacío.</div>}
              </div>

              <div className="pref-section-label">Preferencias de servicio</div>

              <div className="pref-field">
                <label className="pref-question">¿Con qué frecuencia lavas tu auto?</label>
                <div className="pref-hint">Esto nos ayuda a entender tus hábitos de cuidado automotriz.</div>
                <div className="pref-options">
                  {['Semanal', 'Quincenal', 'Mensual'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="frecuencia"
                        value={opt}
                        checked={formData.frecuencia === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.frecuencia && <div className="pref-error show">Selecciona una opción para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">¿Qué valoras más en un autolavado?</label>
                <div className="pref-hint">Elige el factor más importante para ti.</div>
                <div className="pref-options">
                  {['Rapidez', 'Calidad', 'Precio', 'Ubicación'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="valor"
                        value={opt}
                        checked={formData.valor === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.valor && <div className="pref-error show">Selecciona una opción para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">¿Te interesaría un servicio de suscripción mensual para lavados ilimitados?</label>
                <div className="pref-hint">Estamos evaluando nuevas opciones para clientes frecuentes.</div>
                <div className="pref-options">
                  {['Sí', 'No', 'Tal vez'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="suscripcion"
                        value={opt}
                        checked={formData.suscripcion === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.suscripcion && <div className="pref-error show">Selecciona una opción para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">¿Prefieres servicios a domicilio o en punto físico?</label>
                <div className="pref-hint">Queremos adaptar el servicio a tu estilo de vida.</div>
                <div className="pref-options">
                  {['A domicilio', 'Punto físico', 'Me da igual', 'Depende de la situación'].map((opt) => (
                    <label key={opt} className="pref-option-card">
                      <input
                        type="radio"
                        name="modalidad"
                        value={opt}
                        checked={formData.modalidad === opt}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.modalidad && <div className="pref-error show">Selecciona una opción para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question">¿Qué servicio de detallado te gustaría probar?</label>
                <div className="pref-hint">Puedes elegir más de una opción.</div>
                <div className="pref-options">
                  {['Cerámico', 'Corrección de pintura', 'Detallado Interior', 'Detallado Exterior'].map((opt) => (
                    <label key={opt} className="pref-option-card pref-checkbox">
                      <input
                        type="checkbox"
                        name="servicio"
                        value={opt}
                        checked={formData.servicio.includes(opt)}
                        onChange={handleChange}
                      />
                      <div className="pref-custom-control"></div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.servicio && <div className="pref-error show">Selecciona al menos una opción para continuar.</div>}
              </div>

              <div className="pref-field">
                <label className="pref-question" htmlFor="comentarios">
                  ¿Algún comentario, sugerencia o servicio que te gustaría ver?
                </label>
                <div className="pref-hint">Tu opinión nos ayuda a crear una mejor experiencia para ti y tu vehículo.</div>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  className="pref-textarea"
                  placeholder="Escribe aquí tu comentario..."
                  value={formData.comentarios}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="pref-actions">
                <button type="submit" className="pref-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando respuestas...' : 'Enviar mis respuestas'}
                </button>
                <div className="pref-small-note">
                  Al enviar este formulario aceptas que tus respuestas sean utilizadas únicamente para mejorar la oferta de servicios de AQUABRILLO.
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
