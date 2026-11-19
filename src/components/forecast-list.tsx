"use client";

import { Droplets } from "lucide-react";
import { WeatherIcon } from "@/components/weather-icon";
import { useUnits } from "@/context/units-context";
import { describeWeather } from "@/lib/weather-codes";
import { formatDay, formatTemperature } from "@/lib/utils";
import type { DailyWeather } from "@/types/weather";

export function ForecastList({ daily }: { daily: DailyWeather }) {
  const { units } = useUnits();
  const days = daily.time.map((date, index) => ({
    date,
    code: daily.weather_code[index] ?? 0,
    max: daily.temperature_2m_max[index] ?? 0,
    min: daily.temperature_2m_min[index] ?? 0,
    rain: daily.precipitation_probability_max[index] ?? 0,
  }));

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Pronóstico de 7 días</h2>
          <p className="text-xs text-slate-400">Tendencia diaria y probabilidad de lluvia</p>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Días</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => (
          <article
            key={day.date}
            className="glass-hover rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"
          >
            <p className="text-sm font-semibold capitalize text-slate-200">{formatDay(day.date)}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{day.date.slice(5)}</p>
            <div className="my-3 grid place-items-center">
              <WeatherIcon code={day.code} className="h-9 w-9" />
            </div>
            <p className="text-sm font-bold text-white">
              {formatTemperature(day.max, units)}
              <span className="ml-1 font-normal text-slate-500">
                {formatTemperature(day.min, units)}
              </span>
            </p>
            <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-cyan-200/80">
              <Droplets className="h-3 w-3" /> {day.rain}%
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-500">
              {describeWeather(day.code).label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
