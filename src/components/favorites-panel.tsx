"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { WeatherIcon } from "@/components/weather-icon";
import { useUnits } from "@/context/units-context";
import { useFavorites } from "@/hooks/use-favorites";
import { describeWeather } from "@/lib/weather-codes";
import { cityPath, formatTemperature } from "@/lib/utils";
import type { GeocodingResult } from "@/types/weather";

interface FavoriteWeather {
  temp: number;
  code: number;
  isDay: number;
}

export function FavoritesPanel() {
  const { favorites, hydrated, removeFavorite } = useFavorites();
  const { units } = useUnits();
  const [weather, setWeather] = useState<Record<number, FavoriteWeather>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<number[]>([]);

  useEffect(() => {
    if (!hydrated || favorites.length === 0) return;

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setFailed([]);

      const results = await Promise.allSettled(
        favorites.map(async (city) => {
          const response = await fetch(
            `/api/weather?lat=${city.latitude}&lon=${city.longitude}`,
            { signal: controller.signal },
          );
          if (!response.ok) throw new Error("No disponible");
          const data = await response.json();
          return {
            id: city.id,
            weather: {
              temp: data.current.temperature_2m as number,
              code: data.current.weather_code as number,
              isDay: data.current.is_day as number,
            },
          };
        }),
      );

      const next: Record<number, FavoriteWeather> = {};
      const errors: number[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") next[result.value.id] = result.value.weather;
        else errors.push(favorites[index].id);
      });
      if (!controller.signal.aborted) {
        setWeather(next);
        setFailed(errors);
        setLoading(false);
      }
    }

    load().catch(() => {
      if (!controller.signal.aborted) {
        setFailed(favorites.map((city) => city.id));
        setLoading(false);
      }
    });

    return () => controller.abort();
  }, [favorites, hydrated]);

  if (!hydrated) {
    return <div className="glass h-48 animate-pulse rounded-3xl" aria-busy="true" />;
  }

  if (favorites.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-400/10">
          <Heart className="h-7 w-7 text-rose-300" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">Aún no tienes favoritos</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Busca una ciudad y pulsa el corazón para guardarla. Sus temperaturas aparecerán aquí.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950"
        >
          Buscar ciudades
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {favorites.length} {favorites.length === 1 ? "ciudad guardada" : "ciudades guardadas"}
        </p>
        {loading && <span className="text-xs text-cyan-300">Actualizando clima…</span>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((city: GeocodingResult) => {
          const current = weather[city.id];
          return (
            <article key={city.id} className="glass glass-hover rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={cityPath(city)} className="min-w-0">
                  <h3 className="flex items-center gap-1.5 truncate font-semibold text-white hover:text-cyan-200">
                    <MapPin className="h-4 w-4 shrink-0 text-cyan-300" /> {city.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{city.country ?? "Ubicación"}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavorite(city.id)}
                  aria-label={`Eliminar ${city.name} de favoritos`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-rose-300/40 hover:text-rose-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between">
                {current ? (
                  <>
                    <div className="flex items-center gap-3">
                      <WeatherIcon code={current.code} isDay={current.isDay === 1} className="h-10 w-10" />
                      <div>
                        <p className="text-3xl font-bold text-white">
                          {formatTemperature(current.temp, units)}
                        </p>
                        <p className="text-xs text-slate-400">{describeWeather(current.code).label}</p>
                      </div>
                    </div>
                  </>
                ) : failed.includes(city.id) ? (
                  <p className="text-sm text-rose-200">No se pudo cargar el clima</p>
                ) : (
                  <div className="h-12 w-32 animate-pulse rounded-xl bg-white/10" />
                )}
              </div>

              <Link
                href={cityPath(city)}
                className="mt-5 block border-t border-white/10 pt-3 text-xs text-cyan-300 hover:underline"
              >
                Ver pronóstico completo →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
