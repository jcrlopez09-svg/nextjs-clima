"use client";

import { Droplets, MapPin, Thermometer, Wind } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { WeatherIcon } from "@/components/weather-icon";
import { useUnits } from "@/context/units-context";
import { describeWeather } from "@/lib/weather-codes";
import {
  formatLongDate,
  formatSpeed,
  formatTemperature,
  windDirection,
} from "@/lib/utils";
import type { WeatherSnapshot } from "@/types/weather";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon className="h-4 w-4 text-cyan-300" />
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function CurrentWeatherCard({ snapshot }: { snapshot: WeatherSnapshot }) {
  const { units } = useUnits();
  const { current, daily, location } = snapshot;
  const condition = describeWeather(current.weather_code);

  return (
    <section className="glass overflow-hidden rounded-3xl">
      <div className="relative border-b border-white/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-cyan-300" />
              <span className="font-semibold text-white">{location.name}</span>
              {location.admin1 && <span className="text-slate-500">· {location.admin1}</span>}
              {location.country && <span className="text-slate-500">· {location.country}</span>}
            </div>
            <p className="mt-1 text-xs capitalize text-slate-500">
              {formatLongDate(daily.time[0] ?? current.time.slice(0, 10))}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <WeatherIcon
                code={current.weather_code}
                isDay={current.is_day === 1}
                className="h-16 w-16 sm:h-20 sm:w-20"
              />
              <div>
                <p className="text-6xl font-bold leading-none tracking-tighter text-white sm:text-7xl">
                  {formatTemperature(current.temperature_2m, units)}
                </p>
                <p className="mt-1 text-sm font-medium text-cyan-200">{condition.label}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              Máx.{" "}
              <span className="font-semibold text-white">
                {formatTemperature(daily.temperature_2m_max[0], units)}
              </span>{" "}
              · Mín.{" "}
              <span className="font-semibold text-white">
                {formatTemperature(daily.temperature_2m_min[0], units)}
              </span>
            </p>
          </div>

          <FavoriteButton city={location} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-6">
        <Stat
          icon={Thermometer}
          label="Sensación"
          value={formatTemperature(current.apparent_temperature, units, true)}
        />
        <Stat icon={Droplets} label="Humedad" value={`${current.relative_humidity_2m}%`} />
        <Stat
          icon={Wind}
          label="Viento"
          value={`${formatSpeed(current.wind_speed_10m, units)} ${windDirection(current.wind_direction_10m)}`}
        />
        <Stat icon={Droplets} label="Precipitación" value={`${current.precipitation} mm`} />
      </div>
    </section>
  );
}
