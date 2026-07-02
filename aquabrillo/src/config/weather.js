export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export const WEATHER_LOCATION = {
  name: 'Santa Fe Life Style',
  postalCode: '62793',
  lat: Number(import.meta.env.VITE_WEATHER_LAT || 18.7816),
  lon: Number(import.meta.env.VITE_WEATHER_LON || -99.2310),
};

export const HAS_OPENWEATHER_CONFIG = Boolean(OPENWEATHER_API_KEY);

export const WEATHER_CACHE_MS = 1000 * 60 * 10;
