export type UnitSystem = "metric" | "imperial";

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface AirQuality {
  europeanAqi: number | null;
  usAqi: number | null;
  pm25: number | null;
}

export interface WeatherSnapshot {
  location: GeocodingResult;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  airQuality: AirQuality | null;
  fetchedAt: string;
}

export interface WeatherCondition {
  label: string;
  icon: "sun" | "cloud-sun" | "cloud" | "drizzle" | "rain" | "snow" | "storm" | "fog";
}

export interface ApiErrorResponse {
  error: string;
}
