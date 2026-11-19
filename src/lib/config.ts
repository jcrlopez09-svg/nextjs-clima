/**
 * Configuración centralizada del servidor.
 * Todos los valores sensibles o desplegables viven en `.env.local`.
 * Nunca se importa desde un Client Component.
 */
function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const weatherConfig = {
  geocodingUrl:
    process.env.OPEN_METEO_GEO_URL ??
    "https://geocoding-api.open-meteo.com/v1/search",
  forecastUrl:
    process.env.OPEN_METEO_FORECAST_URL ??
    "https://api.open-meteo.com/v1/forecast",
  airQualityUrl:
    process.env.OPEN_METEO_AIR_URL ??
    "https://air-quality-api.open-meteo.com/v1/air-quality",
  /** Token opcional para un proveedor privado; se envía como Bearer. */
  apiToken: process.env.WEATHER_API_TOKEN?.trim() || undefined,
  defaultCity: process.env.DEFAULT_CITY ?? "Madrid",
  defaultCountry: process.env.DEFAULT_COUNTRY ?? "España",
  defaultLatitude: numberFromEnv(process.env.DEFAULT_LAT, 40.4168),
  defaultLongitude: numberFromEnv(process.env.DEFAULT_LON, -3.7038),
  forecastDays: Math.min(numberFromEnv(process.env.FORECAST_DAYS, 7), 14),
  revalidateSeconds: numberFromEnv(process.env.REVALIDATE_SECONDS, 1800),
} as const;
