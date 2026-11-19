import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { WeatherIcon } from "@/components/weather-icon";
import { describeWeather } from "@/lib/weather-codes";
import { cityPath, formatTemperature } from "@/lib/utils";
import type { GeocodingResult, WeatherSnapshot } from "@/types/weather";

export function FeaturedCities({ snapshots }: { snapshots: WeatherSnapshot[] }) {
  if (snapshots.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Explora otras ciudades</h2>
          <p className="text-sm text-slate-400">Un vistazo rápido al clima alrededor del mundo</p>
        </div>
        <Link href="/buscar" className="hidden items-center gap-1 text-sm text-cyan-300 hover:underline sm:flex">
          Ver todas <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {snapshots.map(({ location, current }) => (
          <CityTile key={location.id} location={location} code={current.weather_code} temp={current.temperature_2m} />
        ))}
      </div>
    </section>
  );
}

function CityTile({
  location,
  code,
  temp,
}: {
  location: GeocodingResult;
  code: number;
  temp: number;
}) {
  return (
    <Link
      href={cityPath(location)}
      className="glass glass-hover flex items-center justify-between rounded-2xl p-4"
    >
      <div>
        <p className="flex items-center gap-1.5 font-semibold text-white">
          <MapPin className="h-3.5 w-3.5 text-cyan-300" /> {location.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{location.country}</p>
        <p className="mt-2 text-xs text-slate-500">{describeWeather(code).label}</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-white">{formatTemperature(temp, "metric")}</p>
        <WeatherIcon code={code} className="ml-auto h-6 w-6" />
      </div>
    </Link>
  );
}
