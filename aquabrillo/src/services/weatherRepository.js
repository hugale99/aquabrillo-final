import {
  HAS_OPENWEATHER_CONFIG,
  OPENWEATHER_API_KEY,
  WEATHER_CACHE_MS,
  WEATHER_LOCATION,
} from '../config/weather';

let cachedWeather = null;

const getWeatherRisk = (weather) => {
  const main = String(weather?.weather?.[0]?.main || '').toLowerCase();
  const rainMm = weather?.rain?.['1h'] || weather?.rain?.['3h'] || 0;
  const windSpeed = weather?.wind?.speed || 0;

  if (main.includes('thunderstorm')) {
    return {
      level: 'alto',
      label: 'Tormenta probable',
      recommendation: 'Revisa agenda y prioriza servicios bajo techo o reprogramacion.',
    };
  }

  if (main.includes('rain') || main.includes('drizzle') || rainMm > 0) {
    return {
      level: 'medio',
      label: 'Lluvia en zona',
      recommendation: 'Confirma con el cliente si hay cochera o espacio cubierto.',
    };
  }

  if (windSpeed >= 8) {
    return {
      level: 'medio',
      label: 'Viento relevante',
      recommendation: 'Evita trabajos sensibles a polvo y revisa zona antes de aplicar protecciones.',
    };
  }

  return {
    level: 'bajo',
    label: 'Clima favorable',
    recommendation: 'Buen momento para lavado, detallado exterior y servicios programados.',
  };
};

export const getWeatherStatus = () => ({
  configured: HAS_OPENWEATHER_CONFIG,
  location: WEATHER_LOCATION,
});

export const fetchCurrentWeather = async () => {
  if (!HAS_OPENWEATHER_CONFIG) {
    return {
      configured: false,
      location: WEATHER_LOCATION,
      risk: {
        level: 'base',
        label: 'Clima no configurado',
        recommendation: 'Agrega VITE_OPENWEATHER_API_KEY para activar clima en tiempo real.',
      },
    };
  }

  const now = Date.now();
  if (cachedWeather && now - cachedWeather.cachedAt < WEATHER_CACHE_MS) {
    return cachedWeather.data;
  }

  const params = new URLSearchParams({
    lat: String(WEATHER_LOCATION.lat),
    lon: String(WEATHER_LOCATION.lon),
    appid: OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'es',
  });
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);

  if (!response.ok) {
    const error = new Error(`OpenWeather request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  const data = {
    configured: true,
    location: WEATHER_LOCATION,
    temperature: Math.round(payload.main?.temp || 0),
    feelsLike: Math.round(payload.main?.feels_like || 0),
    humidity: payload.main?.humidity || 0,
    windSpeed: payload.wind?.speed || 0,
    description: payload.weather?.[0]?.description || 'Clima actual',
    icon: payload.weather?.[0]?.icon || '',
    updatedAt: new Date().toISOString(),
    risk: getWeatherRisk(payload),
  };

  cachedWeather = {
    cachedAt: now,
    data,
  };

  return data;
};
