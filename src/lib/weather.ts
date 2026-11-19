import { weatherConfig } from "@/lib/config";
import type {
  AirQuality,
  CurrentWeather,
  DailyWeather,
  GeocodingResult,
  HourlyWeather,
  WeatherSnapshot,
} from "@/types/weather";

interface GeocodingApiResult {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

interface GeocodingApiResponse {
  results?: GeocodingApiResult[];
}

interface ForecastApiResponse {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

interface AirQualityApiResponse {
  current?: {
    european_aqi?: number;
    us_aqi?: number;
    pm2_5?: number;
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function fetchJson<T>(rawUrl: string, revalidate: number): Promise<T> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("La URL de la API del clima no es válida. Revisa .env.local");
  }

  const headers: HeadersInit = weatherConfig.apiToken
    ? { Authorization: `Bearer ${weatherConfig.apiToken}` }
    : {};

  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      next: { revalidate },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("El servicio del clima tardó demasiado en responder.");
    }
    throw new Error("No se pudo conectar con el servicio del clima.");
  }

  if (!response.ok) {
    throw new Error(`La API del clima respondió con el estado ${response.status}.`);
  }

  return (await response.json()) as T;
}

function normalizeLocation(result: GeocodingApiResult, index = 0): GeocodingResult {
  return {
    id: result.id ?? index + 1,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    countryCode: result.country_code,
    admin1: result.admin1,
    timezone: result.timezone,
  };
}

export function defaultLocation(): GeocodingResult {
  return {
    id: 0,
    name: weatherConfig.defaultCity,
    country: weatherConfig.defaultCountry,
    latitude: weatherConfig.defaultLatitude,
    longitude: weatherConfig.defaultLongitude,
  };
}

export async function searchCities(query: string, count = 8): Promise<GeocodingResult[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  const url = new URL(weatherConfig.geocodingUrl);
  url.searchParams.set("name", name);
  url.searchParams.set("count", String(Math.min(Math.max(count, 1), 10)));
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const data = await fetchJson<GeocodingApiResponse>(url.toString(), 86_400);
  return (data.results ?? []).map(normalizeLocation);
}

export async function getWeatherByCoords(
  latitude: number,
  longitude: number,
  location?: GeocodingResult,
): Promise<WeatherSnapshot> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Coordenadas no válidas.");
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Coordenadas fuera de rango.");
  }

  const forecastUrl = new URL(weatherConfig.forecastUrl);
  forecastUrl.searchParams.set("latitude", String(latitude));
  forecastUrl.searchParams.set("longitude", String(longitude));
  forecastUrl.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
  );
  forecastUrl.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,precipitation_probability",
  );
  forecastUrl.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max",
  );
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", String(weatherConfig.forecastDays));
  forecastUrl.searchParams.set("forecast_hours", "24");
  forecastUrl.searchParams.set("wind_speed_unit", "kmh");

  const airUrl = new URL(weatherConfig.airQualityUrl);
  airUrl.searchParams.set("latitude", String(latitude));
  airUrl.searchParams.set("longitude", String(longitude));
  airUrl.searchParams.set("current", "european_aqi,us_aqi,pm2_5");
  airUrl.searchParams.set("timezone", "auto");

  const [forecast, air] = await Promise.all([
    fetchJson<ForecastApiResponse>(forecastUrl.toString(), weatherConfig.revalidateSeconds),
    fetchJson<AirQualityApiResponse>(airUrl.toString(), weatherConfig.revalidateSeconds).catch(
      () => null,
    ),
  ]);

  if (!forecast.current || !forecast.daily || !forecast.hourly) {
    throw new Error("La API del clima devolvió una respuesta incompleta.");
  }

  const airQuality: AirQuality | null = air?.current
    ? {
        europeanAqi: air.current.european_aqi ?? null,
        usAqi: air.current.us_aqi ?? null,
        pm25: air.current.pm2_5 ?? null,
      }
    : null;

  return {
    location: location ?? defaultLocation(),
    current: forecast.current,
    hourly: forecast.hourly,
    daily: forecast.daily,
    airQuality,
    fetchedAt: new Date().toISOString(),
  };
}

export function locationFromSearchParams(params: SearchParams): GeocodingResult {
  const lat = Number(firstValue(params.lat));
  const lon = Number(firstValue(params.lon));
  const name = firstValue(params.name)?.trim();
  const country = firstValue(params.country)?.trim();

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return defaultLocation();
  }

  return {
    id: Number(firstValue(params.id)) || 0,
    name: name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    country: country || undefined,
    latitude: lat,
    longitude: lon,
  };
}
