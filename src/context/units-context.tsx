"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { UnitSystem } from "@/types/weather";

const STORAGE_KEY = "clima:units";
const CHANGE_EVENT = "clima:units-changed";

let cacheKey: string | null = null;
let cacheValue: UnitSystem = "metric";

function getSnapshot(): UnitSystem {
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cacheKey) {
    cacheKey = raw;
    cacheValue = raw === "imperial" ? "imperial" : "metric";
  }
  return cacheValue;
}

function getServerSnapshot(): UnitSystem {
  return "metric";
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

interface UnitsContextValue {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  toggleUnits: () => void;
}

const UnitsContext = createContext<UnitsContextValue | null>(null);

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const units = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setUnits = useCallback((next: UnitSystem) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }, []);

  const toggleUnits = useCallback(() => {
    setUnits(getSnapshot() === "metric" ? "imperial" : "metric");
  }, [setUnits]);

  const value = useMemo<UnitsContextValue>(
    () => ({ units, setUnits, toggleUnits }),
    [units, setUnits, toggleUnits],
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits(): UnitsContextValue {
  const context = useContext(UnitsContext);
  if (!context) throw new Error("useUnits debe usarse dentro de UnitsProvider");
  return context;
}
