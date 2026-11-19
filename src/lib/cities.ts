import type { GeocodingResult } from "@/types/weather";

/** Ciudades destacadas: enlaces rápidos del dashboard. */
export const FEATURED_CITIES: GeocodingResult[] = [
  { id: 1, name: "Madrid", country: "España", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid" },
  { id: 2, name: "Ciudad de México", country: "México", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City" },
  { id: 3, name: "Buenos Aires", country: "Argentina", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires" },
  { id: 4, name: "Bogotá", country: "Colombia", latitude: 4.711, longitude: -74.0721, timezone: "America/Bogota" },
  { id: 5, name: "Lima", country: "Perú", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima" },
  { id: 6, name: "Barcelona", country: "España", latitude: 41.3874, longitude: 2.1686, timezone: "Europe/Madrid" },
];
