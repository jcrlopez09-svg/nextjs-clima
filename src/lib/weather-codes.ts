import type { WeatherCondition } from "@/types/weather";

/** Códigos WMO devueltos por Open-Meteo. */
const CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: "Despejado", icon: "sun" },
  1: { label: "Mayormente despejado", icon: "sun" },
  2: { label: "Parcialmente nublado", icon: "cloud-sun" },
  3: { label: "Nublado", icon: "cloud" },
  45: { label: "Niebla", icon: "fog" },
  48: { label: "Niebla con escarcha", icon: "fog" },
  51: { label: "Llovizna ligera", icon: "drizzle" },
  53: { label: "Llovizna", icon: "drizzle" },
  55: { label: "Llovizna intensa", icon: "drizzle" },
  56: { label: "Llovizna helada", icon: "drizzle" },
  57: { label: "Llovizna helada intensa", icon: "drizzle" },
  61: { label: "Lluvia débil", icon: "rain" },
  63: { label: "Lluvia", icon: "rain" },
  65: { label: "Lluvia intensa", icon: "rain" },
  66: { label: "Lluvia helada", icon: "rain" },
  67: { label: "Lluvia helada intensa", icon: "rain" },
  71: { label: "Nevada débil", icon: "snow" },
  73: { label: "Nevada", icon: "snow" },
  75: { label: "Nevada intensa", icon: "snow" },
  77: { label: "Granos de nieve", icon: "snow" },
  80: { label: "Chubascos débiles", icon: "rain" },
  81: { label: "Chubascos", icon: "rain" },
  82: { label: "Chubascos violentos", icon: "rain" },
  85: { label: "Chubascos de nieve", icon: "snow" },
  86: { label: "Chubascos de nieve intensos", icon: "snow" },
  95: { label: "Tormenta", icon: "storm" },
  96: { label: "Tormenta con granizo", icon: "storm" },
  99: { label: "Tormenta con granizo intenso", icon: "storm" },
};

export function describeWeather(code: number): WeatherCondition {
  return CONDITIONS[code] ?? { label: "Condición desconocida", icon: "cloud" };
}

export function aqiLabel(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Sin datos";
  if (value <= 20) return "Muy buena";
  if (value <= 40) return "Buena";
  if (value <= 60) return "Moderada";
  if (value <= 80) return "Deficiente";
  if (value <= 100) return "Mala";
  return "Muy mala";
}
