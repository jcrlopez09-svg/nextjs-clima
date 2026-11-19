import Link from "next/link";
import { ArrowRight, CloudSun, MapPin, ShieldCheck, Zap } from "lucide-react";
import { AirQualityCard } from "@/components/air-quality-card";
import { CurrentWeatherCard } from "@/components/current-weather-card";
import { FeaturedCities } from "@/components/featured-cities";
import { ForecastList } from "@/components/forecast-list";
import { HourlyChart } from "@/components/hourly-chart";
import { SearchForm } from "@/components/search-form";
import { FEATURED_CITIES } from "@/lib/cities";
import { defaultLocation, getWeatherByCoords } from "@/lib/weather";
import { cityPath } from "@/lib/utils";
import type { WeatherSnapshot } from "@/types/weather";

export const revalidate = 1800;

export default async function HomePage() {
  const location = defaultLocation();
  const [mainResult, ...featuredResults] = await Promise.allSettled([
    getWeatherByCoords(location.latitude, location.longitude, location),
    ...FEATURED_CITIES.slice(1, 4).map((city) =>
      getWeatherByCoords(city.latitude, city.longitude, city),
    ),
  ]);

  // Si falla la petición principal, se activa `app/error.tsx`.
  if (mainResult.status === "rejected") throw mainResult.reason;

  const main = mainResult.value;
  const featured = featuredResults
    .filter((result): result is PromiseFulfilledResult<WeatherSnapshot> => result.status === "fulfilled")
    .map((result) => result.value);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-4 pt-12 sm:px-6 sm:pt-16">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
          <Zap className="h-3.5 w-3.5" /> Next.js 16 · App Router · Open-Meteo
        </span>
        <h1 className="text-gradient mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          El clima, claro y al instante.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          Consulta la temperatura actual, el pronóstico por horas y la calidad del aire de cualquier ciudad del mundo.
        </p>

        <div className="mx-auto mt-8 max-w-2xl">
          <SearchForm />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="mr-1">Popular:</span>
          {FEATURED_CITIES.slice(0, 3).map((city) => (
            <Link
              key={city.id}
              href={cityPath(city)}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:border-cyan-300/40 hover:text-white"
            >
              <MapPin className="h-3 w-3 text-cyan-300" /> {city.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 space-y-5">
        <CurrentWeatherCard snapshot={main} />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HourlyChart hourly={main.hourly} />
          </div>
          <AirQualityCard airQuality={main.airQuality} />
        </div>

        <ForecastList daily={main.daily} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <InfoPill
          icon={CloudSun}
          title="Datos en tiempo real"
          description="Pronóstico de hasta 14 días actualizado cada 30 minutos."
        />
        <InfoPill
          icon={ShieldCheck}
          title="Sin API key"
          description="Open-Meteo es gratuito; la configuración vive en .env.local."
        />
        <InfoPill
          icon={MapPin}
          title="Busca y guarda"
          description="Encuentra ciudades y guárdalas en tus favoritos locales."
        />
      </div>

      <FeaturedCities snapshots={featured} />

      <div className="mt-10 text-center">
        <Link
          href="/acerca"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:underline"
        >
          Conoce la tecnología detrás de este proyecto <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CloudSun;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className="h-5 w-5 text-cyan-300" />
      <p className="mt-3 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
