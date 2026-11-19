import { Wind } from "lucide-react";
import { aqiLabel } from "@/lib/weather-codes";
import type { AirQuality } from "@/types/weather";

export function AirQualityCard({ airQuality }: { airQuality: AirQuality | null }) {
  const value = airQuality?.europeanAqi ?? null;
  const label = aqiLabel(value);

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <h2 className="text-lg font-bold text-white">Calidad del aire</h2>
      <p className="text-xs text-slate-400">Índice europeo AQI · menor es mejor</p>

      <div className="mt-5 flex items-end gap-4">
        <span className="text-5xl font-bold tracking-tight text-white">{value ?? "--"}</span>
        <span className="mb-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          {label}
        </span>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-50% to-rose-500">
        <div
          className="h-full w-1 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)] transition-all"
          style={{ marginLeft: `${Math.min(Math.max((value ?? 0) / 100, 0), 1) * 99}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500">
        <span>0 · Muy buena</span>
        <span>100 · Muy mala</span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <span className="flex items-center gap-2 text-slate-400">
          <Wind className="h-4 w-4 text-cyan-300" /> PM2.5
        </span>
        <span className="font-semibold text-white">
          {airQuality?.pm25 != null ? `${airQuality.pm25.toFixed(1)} µg/m³` : "Sin datos"}
        </span>
      </div>
    </section>
  );
}
