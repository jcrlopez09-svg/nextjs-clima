import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Sunrise, Sunset, Umbrella, Wind } from "lucide-react";
import { AirQualityCard } from "@/components/air-quality-card";
import { CurrentWeatherCard } from "@/components/current-weather-card";
import { ForecastList } from "@/components/forecast-list";
import { HourlyChart } from "@/components/hourly-chart";
import { formatHour, formatSpeed } from "@/lib/utils";
import { getWeatherByCoords, locationFromSearchParams } from "@/lib/weather";

type CityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: CityPageProps): Promise<Metadata> {
  const location = locationFromSearchParams(await searchParams);
  return {
    title: `Clima en ${location.name}`,
    description: `Temperatura actual, pronóstico por horas y calidad del aire en ${location.name}${location.country ? `, ${location.country}` : ""}.`,
  };
}

export default async function CityPage({ searchParams }: CityPageProps) {
  const location = locationFromSearchParams(await searchParams);
  const snapshot = await getWeatherByCoords(location.latitude, location.longitude, location);
  const { daily, airQuality } = snapshot;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <Link href="/" className="hover:text-white">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/buscar" className="hover:text-white">Buscar</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-cyan-200">{location.name}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Pronóstico detallado</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{location.name}</h1>
        </div>
        <Link
          href="/buscar"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-cyan-300/40"
        >
          <ArrowLeft className="h-4 w-4" /> Cambiar ciudad
        </Link>
      </div>

      <div className="space-y-5">
        <CurrentWeatherCard snapshot={snapshot} />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HourlyChart hourly={snapshot.hourly} />
          </div>
          <AirQualityCard airQuality={airQuality} />
        </div>

        <ForecastList daily={daily} />

        <div className="grid gap-3 sm:grid-cols-3">
          <DetailTile
            icon={Sunrise}
            label="Amanecer"
            value={daily.sunrise?.[0] ? formatHour(daily.sunrise[0]) : "--"}
          />
          <DetailTile
            icon={Sunset}
            label="Atardecer"
            value={daily.sunset?.[0] ? formatHour(daily.sunset[0]) : "--"}
          />
          <DetailTile
            icon={Umbrella}
            label="Prob. lluvia hoy"
            value={`${daily.precipitation_probability_max?.[0] ?? 0}%`}
          />
          <DetailTile
            icon={Wind}
            label="Viento máx. hoy"
            value={formatSpeed(daily.wind_speed_10m_max?.[0], "metric")}
          />
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Actualizado: {new Date(snapshot.fetchedAt).toLocaleString("es-ES")} · Lat {location.latitude.toFixed(2)} / Lon {location.longitude.toFixed(2)}
      </p>
    </div>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sunrise;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon className="h-4 w-4 text-cyan-300" /> {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
