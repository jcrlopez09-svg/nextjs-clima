import type { UnitSystem } from "@/types/weather";

const SLUG_NORMALIZATION: Record<string, string> = {
  á: "a", à: "a", ä: "a", â: "a", ã: "a",
  é: "e", è: "e", ë: "e", ê: "e",
  í: "i", ì: "i", ï: "i", î: "i",
  ó: "o", ò: "o", ö: "o", ô: "o", õ: "o",
  ú: "u", ù: "u", ü: "u", û: "u",
  ñ: "n", ç: "c",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => SLUG_NORMALIZATION[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatTemperature(
  celsius: number | null | undefined,
  units: UnitSystem,
  withUnit = false,
): string {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return "--";
  const value = units === "imperial" ? celsius * 1.8 + 32 : celsius;
  const rounded = Math.round(value);
  return withUnit ? `${rounded}°${units === "imperial" ? "F" : "C"}` : `${rounded}°`;
}

export function formatSpeed(
  kmh: number | null | undefined,
  units: UnitSystem,
): string {
  if (kmh === null || kmh === undefined || Number.isNaN(kmh)) return "--";
  const value = units === "imperial" ? kmh * 0.621371 : kmh;
  return `${Math.round(value)} ${units === "imperial" ? "mph" : "km/h"}`;
}

export function formatHour(iso: string): string {
  return iso.slice(11, 16);
}

export function formatDay(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", { weekday: "short" })
    .format(date)
    .replace(".", "");
}

export function formatLongDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function windDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return directions[Math.round(degrees / 45) % 8];
}

export function cityPath(params: {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}): string {
  const query = new URLSearchParams({
    lat: params.latitude.toFixed(4),
    lon: params.longitude.toFixed(4),
    name: params.name,
  });
  if (params.country) query.set("country", params.country);
  return `/ciudad/${slugify(params.name) || "ubicacion"}?${query.toString()}`;
}
