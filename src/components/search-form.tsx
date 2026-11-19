"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import { cityPath } from "@/lib/utils";
import type { GeocodingResult } from "@/types/weather";

interface SearchFormProps {
  initialQuery?: string;
  size?: "hero" | "compact";
}

export function SearchForm({ initialQuery = "", size = "hero" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      setOpen(false);
    }
  }

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/geocoding?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data: { results?: GeocodingResult[]; error?: string } = await response.json();
        if (!response.ok) throw new Error(data.error ?? "No se pudo completar la búsqueda");
        setResults(data.results ?? []);
        setOpen(true);
      } catch (caught) {
        if ((caught as Error).name !== "AbortError") {
          setError((caught as Error).message);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen(false);
    const term = query.trim();
    if (term.length < 2) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  };

  const isHero = size === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <div
          className={`glass flex items-center gap-3 rounded-2xl px-4 ${
            isHero ? "h-16 shadow-2xl" : "h-14"
          } focus-within:border-cyan-300/50`}
        >
          <Search className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => handleChange(event.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Busca una ciudad: Madrid, Lima, Tokio..."
            aria-label="Buscar ciudad"
            className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          {loading && <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" aria-hidden="true" />}
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90"
          >
            Buscar
          </button>
        </div>
      </form>

      {open && (results.length > 0 || error) && (
        <div className="glass absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-auto rounded-2xl p-2">
          {error ? (
            <p className="px-3 py-3 text-sm text-rose-200">{error}</p>
          ) : (
            <>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Coincidencias
              </p>
              {results.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}`}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(cityPath(city));
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{city.name}</span>
                    <span className="block truncate text-xs text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(", ") || "Ubicación"}
                    </span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
