"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Compass, MapPin, SearchX } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { WeatherIcon } from "@/components/weather-icon";
import { useUnits } from "@/context/units-context";
import { cityPath, formatTemperature } from "@/lib/utils";
import type { GeocodingResult } from "@/types/weather";

type Status = "idle" | "loading" | "ready" | "error";

export function SearchExperience() {
  const query = useSearchParams().get("q")?.trim() ?? "";
  const { units } = useUnits();
  const [cities, setCities] = useState<GeocodingResult[]>([]);
  const [weatherByCity, setWeatherByCity] = useState<Record<number, { temp: number; code: number }>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    // El componente se remonta con `key={query}` cuando cambia la URL,
    // por lo que los estados iniciales ya son "idle" y [].
    if (query.length < 2) return;

    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setError("");

      const response = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      const data: { results?: GeocodingResult[]; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo buscar ciudades");
      const found = data.results ?? [];
      setCities(found);
      setWeatherByCity({});
      setStatus("ready");

      const weatherResults = await Promise.allSettled(
        found.slice(0, 6).map(async (city) => {
          const weatherResponse = await fetch(
            `/api/weather?lat=${city.latitude}&lon=${city.longitude}`,
            { signal: controller.signal },
          );
          if (!weatherResponse.ok) return null;
          const weather = await weatherResponse.json();
          return {
            id: city.id,
            temp: weather.current?.temperature_2m as number | undefined,
            code: weather.current?.weather_code as number | undefined,
          };
        }),
      );

      const next: Record<number, { temp: number; code: number }> = {};
      for (const result of weatherResults) {
        if (result.status === "fulfilled" && result.value?.temp != null) {
          next[result.value.id] = { temp: result.value.temp, code: result.value.code ?? 0 };
        }
      }
      if (!controller.signal.aborted) setWeatherByCity(next);
    }

    load().catch((caught: Error) => {
      if (caught.name === "AbortError") return;
      setError(caught.message);
      setStatus("error");
    });

    return () => controller.abort();
  }, [query]);

  if (!query) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <Compass className="mx-auto h-10 w-10 text-cyan-300" />
        <h2 className="mt-4 text-xl font-bold text-white">¿A dónde vamos?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Escribe una ciudad en el buscador para ver coincidencias, temperatura actual y guardarla en favoritos.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass h-36 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="glass rounded-3xl border-rose-300/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-300" />
        <p className="mt-3 font-medium text-white">No pudimos completar la búsqueda</p>
        <p className="mt-1 text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <SearchX className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 text-xl font-bold text-white">Sin resultados para “{query}”</h2>
        <p className="mt-2 text-sm text-slate-400">Prueba con otro nombre o revisa la ortografía.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <article key={`${city.id}-${city.latitude}`} className="glass glass-hover rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2">
            <Link href={cityPath(city)} className="min-w-0 flex-1">
              <h3 className="flex items-center gap-1.5 truncate font-semibold text-white hover:text-cyan-200">
                <MapPin className="h-4 w-4 shrink-0 text-cyan-300" /> {city.name}
              </h3>
              <p className="mt-1 truncate text-xs text-slate-400">
                {[city.admin1, city.country].filter(Boolean).join(", ") || "Ubicación"}
              </p>
            </Link>
            <FavoriteButton city={city} />
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              {weatherByCity[city.id] ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">
                    {formatTemperature(weatherByCity[city.id].temp, units)}
                  </span>
                  <WeatherIcon code={weatherByCity[city.id].code} className="h-6 w-6" />
                </div>
              ) : (
                <span className="text-sm text-slate-500">Consultando clima…</span>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
              </p>
            </div>
            <Link
              href={cityPath(city)}
              className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-cyan-200 hover:bg-white/10"
            >
              Ver <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
