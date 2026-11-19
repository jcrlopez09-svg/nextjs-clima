"use client";

import { Clock } from "lucide-react";
import { WeatherIcon } from "@/components/weather-icon";
import { useUnits } from "@/context/units-context";
import { formatHour, formatTemperature } from "@/lib/utils";
import type { HourlyWeather } from "@/types/weather";

export function HourlyChart({ hourly }: { hourly: HourlyWeather }) {
  const { units } = useUnits();
  const hours = hourly.time.map((time, index) => ({
    time,
    temp: hourly.temperature_2m[index] ?? 0,
    code: hourly.weather_code[index] ?? 0,
    rain: hourly.precipitation_probability[index] ?? 0,
  }));

  if (hours.length < 2) return null;

  const temps = hours.map((hour) => (units === "imperial" ? hour.temp * 1.8 + 32 : hour.temp));
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;
  const width = 720;
  const height = 150;
  const points = temps.map((temp, index) => {
    const x = (index / (temps.length - 1)) * width;
    const y = height - ((temp - min) / range) * (height - 30) - 15;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.join(" ");
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Próximas 24 horas</h2>
          <p className="text-xs text-slate-400">Temperatura y probabilidad de precipitación</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
          <Clock className="h-3.5 w-3.5 text-cyan-300" /> Ahora
        </span>
      </div>

      <div className="overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height + 10}`}
          preserveAspectRatio="none"
          className="h-36 w-full sm:h-44"
          role="img"
          aria-label="Gráfica de temperatura por hora"
        >
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tempLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#tempFill)" />
          <polyline
            points={line}
            fill="none"
            stroke="url(#tempLine)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mt-2 grid grid-cols-6 gap-1 sm:grid-cols-12">
          {hours.filter((_, index) => index % 2 === 0).map((hour) => (
            <div key={hour.time} className="text-center">
              <WeatherIcon code={hour.code} className="mx-auto h-5 w-5" />
              <p className="mt-1 text-[11px] font-medium text-white">
                {formatTemperature(hour.temp, units)}
              </p>
              <p className="text-[10px] text-slate-500">{formatHour(hour.time)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
