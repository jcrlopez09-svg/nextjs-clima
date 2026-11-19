"use client";

import { useUnits } from "@/context/units-context";

export function UnitToggle({ compact = false }: { compact?: boolean }) {
  const { units, setUnits } = useUnits();

  return (
    <div
      className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5"
      role="group"
      aria-label="Unidades de temperatura"
    >
      {(["metric", "imperial"] as const).map((system) => (
        <button
          key={system}
          type="button"
          onClick={() => setUnits(system)}
          aria-pressed={units === system}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            units === system
              ? "bg-cyan-300/90 text-slate-950"
              : "text-slate-300 hover:text-white"
          } ${compact ? "px-2" : ""}`}
        >
          °{system === "metric" ? "C" : "F"}
        </button>
      ))}
    </div>
  );
}
