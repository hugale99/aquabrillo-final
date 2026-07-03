/* global process */

const DEFAULT_LAT = '18.7816';
const DEFAULT_LON = '-99.2310';

export default async function handler(request, response) {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    response.status(500).json({
      error: 'missing_openweather_key',
      message: 'Configura OPENWEATHER_API_KEY o VITE_OPENWEATHER_API_KEY en Vercel.',
    });
    return;
  }

  const lat = request.query.lat || DEFAULT_LAT;
  const lon = request.query.lon || DEFAULT_LON;
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: 'metric',
    lang: 'es',
  });

  try {
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);
    const payload = await weatherResponse.json();

    if (!weatherResponse.ok) {
      response.status(weatherResponse.status).json(payload);
      return;
    }

    response.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    response.status(200).json(payload);
  } catch (error) {
    response.status(502).json({
      error: 'openweather_unavailable',
      message: error?.message || 'No fue posible consultar OpenWeather.',
    });
  }
}
