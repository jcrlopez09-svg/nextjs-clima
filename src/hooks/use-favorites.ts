"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import type { GeocodingResult } from "@/types/weather";

const STORAGE_KEY = "clima:favorites";
const CHANGE_EVENT = "clima:favorites-changed";
const EMPTY: GeocodingResult[] = [];

let cacheKey: string | null = null;
let cacheValue: GeocodingResult[] = [];

function parseFavorites(raw: string | null): GeocodingResult[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is GeocodingResult =>
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        typeof item.latitude === "number" &&
        typeof item.longitude === "number",
    );
  } catch {
    return [];
  }
}

/** Snapshot estable: devuelve la misma referencia mientras localStorage no cambie. */
function getSnapshot(): GeocodingResult[] {
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cacheKey) {
    cacheKey = raw;
    cacheValue = parseFavorites(raw);
  }
  return cacheValue;
}

function getServerSnapshot(): GeocodingResult[] {
  return EMPTY;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) onStoreChange();
  };
  const handleCustom = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, handleCustom);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleCustom);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();

  const persist = useCallback((next: GeocodingResult[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }, []);

  const addFavorite = useCallback(
    (city: GeocodingResult) => {
      if (favorites.some((favorite) => favorite.id === city.id)) return;
      persist([...favorites, city]);
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    (id: number) => persist(favorites.filter((favorite) => favorite.id !== id)),
    [favorites, persist],
  );

  const toggleFavorite = useCallback(
    (city: GeocodingResult) => {
      if (favorites.some((favorite) => favorite.id === city.id)) {
        removeFavorite(city.id);
      } else {
        addFavorite(city);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites],
  );

  return { favorites, hydrated, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
