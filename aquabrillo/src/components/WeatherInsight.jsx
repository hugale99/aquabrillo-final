import { useEffect, useState } from 'react';
import { ArrowRight, CloudSun, Droplets, RefreshCw, Wind } from 'lucide-react';
import { fetchCurrentWeather, getWeatherStatus } from '../services/weatherRepository';

const riskStyles = {
  bajo: 'border-brand-green/25 bg-brand-green/10 text-green-100',
  medio: 'border-brand-orange/30 bg-brand-orange/12 text-orange-100',
  alto: 'border-brand-rust/35 bg-brand-rust/16 text-red-100',
  base: 'border-white/10 bg-white/[0.035] text-slate-300',
};

const formatWeatherUpdate = (value) => {
  if (!value) return 'Pendiente';

  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const WeatherInsight = ({ actionHref = '', actionLabel = '', actionOnClick, compact = false }) => {
  const [weather, setWeather] = useState(() => ({
    ...getWeatherStatus(),
    risk: {
      level: 'base',
      label: 'Clima listo',
      recommendation: 'Conecta OpenWeatherMap para recomendaciones operativas en tiempo real.',
    },
  }));
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      setStatus('loading');
      try {
        const result = await fetchCurrentWeather();
        if (!isMounted) return;
        setWeather(result);
        setStatus('ready');
      } catch (error) {
        if (!isMounted) return;
        setStatus('error');
        setWeather((current) => ({
          ...current,
          risk: {
            level: 'medio',
            label: error?.status === 401 ? 'Key no autorizada' : 'Clima no disponible',
            recommendation: error?.status === 401
              ? 'OpenWeather rechazo la API key. Verifica que este activa y copiada completa.'
              : 'No se pudo leer OpenWeather. Mantén confirmacion manual si el cielo cambia.',
          },
        }));
      }
    };

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  const riskClass = riskStyles[weather.risk?.level] || riskStyles.base;

  return (
    <div className={`rounded-2xl border ${riskClass} ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10 bg-brand-night/65">
            <CloudSun className="h-5 w-5 text-brand-orange" />
          </div>
          <div>
            <div className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-500">Clima operativo</div>
            <div className="mt-1 text-sm font-black text-white">{weather.location?.name || 'Zona AQUABRILLO'}</div>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-brand-night/55 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.1em] text-slate-300">
          {weather.risk?.label}
        </span>
      </div>

      {weather.configured && weather.temperature !== undefined ? (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold text-slate-300">
          <div className="rounded-xl border border-white/10 bg-brand-night/45 p-2">
            <span className="block text-slate-500">Temp.</span>
            <span className="mt-1 block text-base font-black text-white">{weather.temperature} C</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-night/45 p-2">
            <span className="flex items-center gap-1 text-slate-500"><Droplets className="h-3 w-3" /> Hum.</span>
            <span className="mt-1 block text-base font-black text-white">{weather.humidity}%</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-night/45 p-2">
            <span className="flex items-center gap-1 text-slate-500"><Wind className="h-3 w-3" /> Viento</span>
            <span className="mt-1 block text-base font-black text-white">{Math.round(weather.windSpeed)} m/s</span>
          </div>
        </div>
      ) : null}

      <p className="mt-3 text-xs font-bold leading-relaxed text-slate-300">
        {weather.risk?.recommendation}
      </p>

      {actionLabel && (actionHref || actionOnClick) && (
        <button
          type="button"
          onClick={actionOnClick || (() => {
            window.location.href = actionHref;
          })}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1EBE5D]"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-600">
        <span>{weather.description || 'OpenWeatherMap'}</span>
        <span className="inline-flex items-center gap-1">
          <RefreshCw className={`h-3 w-3 ${status === 'loading' ? 'animate-spin' : ''}`} />
          {status === 'error' ? 'Sin lectura' : formatWeatherUpdate(weather.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default WeatherInsight;
