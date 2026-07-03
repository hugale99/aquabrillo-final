import { useEffect, useState } from 'react';
import { ArrowRight, Cloud, CloudRain, CloudSun, Droplets, RefreshCw, Sun, Zap } from 'lucide-react';
import { fetchCurrentWeather, getWeatherStatus } from '../services/weatherRepository';

const riskStyles = {
  bajo: {
    shell: 'border-brand-green/25 bg-[linear-gradient(145deg,rgba(27,46,26,0.96),rgba(38,92,45,0.9)_46%,rgba(255,159,69,0.18))] text-green-100 shadow-brand-green/10',
    accent: 'from-brand-green/35 via-brand-orange/20 to-white/5',
    icon: 'text-brand-orange',
  },
  medio: {
    shell: 'border-brand-orange/30 bg-[linear-gradient(145deg,rgba(27,46,26,0.96),rgba(104,75,29,0.88)_50%,rgba(255,159,69,0.25))] text-orange-100 shadow-brand-orange/10',
    accent: 'from-brand-orange/40 via-brand-rust/16 to-white/5',
    icon: 'text-brand-orange',
  },
  alto: {
    shell: 'border-brand-rust/35 bg-[linear-gradient(145deg,rgba(27,46,26,0.98),rgba(94,41,29,0.92)_52%,rgba(201,71,34,0.24))] text-red-100 shadow-brand-rust/10',
    accent: 'from-brand-rust/38 via-brand-orange/18 to-white/5',
    icon: 'text-brand-rust',
  },
  base: {
    shell: 'border-white/10 bg-[linear-gradient(145deg,rgba(27,46,26,0.96),rgba(40,40,40,0.92)_54%,rgba(255,255,255,0.08))] text-slate-300 shadow-black/15',
    accent: 'from-white/12 via-brand-orange/12 to-white/5',
    icon: 'text-brand-orange',
  },
};

const formatWeatherUpdate = (value) => {
  if (!value) return 'Pendiente';

  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getWeatherIcon = (weather) => {
  const description = String(weather.description || '').toLowerCase();

  if (weather.risk?.level === 'alto' || description.includes('tormenta')) return Zap;
  if (description.includes('lluvia') || description.includes('rain') || description.includes('drizzle')) return CloudRain;
  if (description.includes('nube') || description.includes('cloud')) return Cloud;
  if (description.includes('sol') || description.includes('clear')) return Sun;

  return CloudSun;
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
              : 'No se pudo leer OpenWeather. Manten confirmacion manual si el cielo cambia.',
          },
        }));
      }
    };

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  const riskTheme = riskStyles[weather.risk?.level] || riskStyles.base;
  const hasLiveWeather = weather.configured && weather.temperature !== undefined;
  const WeatherIcon = getWeatherIcon(weather);
  const displayTemperature = hasLiveWeather ? weather.temperature : '--';
  const displayFeelsLike = hasLiveWeather ? `${weather.feelsLike}°` : '--';
  const displayHumidity = hasLiveWeather ? `${weather.humidity}%` : '--';
  const displayRainChance = hasLiveWeather ? `${weather.rainChance ?? 10}%` : '--';

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border shadow-2xl backdrop-blur-2xl ${riskTheme.shell} ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${riskTheme.accent}`} />
      <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-brand-orange/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/50">Clima ahora</div>
            <div className="mt-1 text-base font-black text-white">{weather.location?.name || 'Santa Fe Life Style'}</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.1em] text-white/80">
            <span className={`h-2 w-2 rounded-full ${status === 'loading' ? 'animate-pulse bg-brand-orange' : 'bg-brand-green'}`} />
            {weather.risk?.label}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[0.92fr_1.08fr] sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/10 shadow-inner shadow-white/10 sm:h-28 sm:w-28">
              <div className="absolute inset-2 rounded-[1.35rem] bg-brand-night/25" />
              <WeatherIcon className={`relative h-12 w-12 drop-shadow-2xl sm:h-14 sm:w-14 ${riskTheme.icon}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start">
                <span className="text-6xl font-black leading-none tracking-tight text-white sm:text-7xl">
                  {displayTemperature}
                </span>
                <span className="mt-1 text-2xl font-black text-brand-orange">°</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-black capitalize text-white/75">
                {weather.description || 'Clima actual'}
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/18 p-3.5 backdrop-blur-xl">
            <p className="text-xs font-bold leading-relaxed text-white/75">
              {weather.risk?.recommendation}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[0.68rem] font-bold text-white/65 sm:text-xs">
          <div className="rounded-2xl border border-white/10 bg-white/[0.085] p-2.5 backdrop-blur-xl">
            <span className="block">Sensacion</span>
            <span className="mt-1 block text-base font-black text-white">{displayFeelsLike}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.085] p-2.5 backdrop-blur-xl">
            <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> Hum.</span>
            <span className="mt-1 block text-base font-black text-white">{displayHumidity}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.085] p-2.5 backdrop-blur-xl">
            <span className="flex items-center gap-1"><CloudRain className="h-3 w-3" /> Lluvia</span>
            <span className="mt-1 block text-base font-black text-white">{displayRainChance}</span>
          </div>
        </div>

        {actionLabel && (actionHref || actionOnClick) && (
          <button
            type="button"
            onClick={actionOnClick || (() => {
              window.location.href = actionHref;
            })}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.08em] text-white shadow-xl shadow-[#25D366]/20 transition hover:bg-[#1EBE5D] sm:text-sm"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-white/40">
          <span>OpenWeather</span>
          <span className="inline-flex items-center gap-1">
            <RefreshCw className={`h-3 w-3 ${status === 'loading' ? 'animate-spin' : ''}`} />
            {status === 'error' ? 'Sin lectura' : formatWeatherUpdate(weather.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherInsight;
