import type { Metadata } from "next";
import { CheckCircle2, Database, Layers, LockKeyhole, Server, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Acerca del proyecto",
  description: "Arquitectura, tecnologías y requisitos cubiertos por clima.now.",
};

const STACK = [
  { title: "Next.js 16", detail: "App Router, Route Handlers y optimización de imágenes/fuentes." },
  { title: "TypeScript", detail: "Tipado estricto en páginas, servicios, API y componentes." },
  { title: "Tailwind CSS 4", detail: "Sistema de diseño responsive con utilidades y CSS personalizado." },
  { title: "Open-Meteo", detail: "API externa de pronóstico, geocodificación y calidad del aire." },
];

const FEATURES = [
  "5 rutas distintas: inicio, búsqueda, detalle de ciudad, favoritos y acerca de.",
  "Dos Route Handlers internos: /api/geocoding y /api/weather.",
  "Server Components para datos y Client Components para interactividad.",
  "Hooks useState y useEffect para búsqueda, favoritos y unidades.",
  "Estados de carga con loading.tsx y Suspense; errores con error.tsx.",
  "Diseño adaptable a móvil y escritorio.",
  "Configuración y posibles claves de API en .env.local.",
];

export default function AcercaPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">El proyecto</p>
        <h1 className="text-gradient mt-2 text-4xl font-bold sm:text-5xl">Construido con Next.js 16</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
          clima.now es un dashboard meteorológico de demostración que combina renderizado en servidor,
          APIs externas y estado en el cliente dentro de una sola aplicación.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Layers className="h-5 w-5 text-cyan-300" /> Stack tecnológico
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STACK.map((item) => (
            <article key={item.title} className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <CheckCircle2 className="h-5 w-5 text-cyan-300" /> Requisitos cubiertos
          </h2>
          <ul className="mt-4 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <LockKeyhole className="h-5 w-5 text-cyan-300" /> Variables de entorno
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Los endpoints, la ciudad por defecto y un token opcional de proveedor se leen desde{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">.env.local</code>, que está
            excluido del repositorio. El archivo{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">.env.example</code> sirve
            como plantilla.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed text-slate-300">
{`OPEN_METEO_FORECAST_URL=...
WEATHER_API_TOKEN=
DEFAULT_CITY=Madrid
REVALIDATE_SECONDS=1800`}
          </pre>
          <p className="mt-4 text-xs text-slate-500">
            Open-Meteo no requiere key, pero el código ya soporta un Bearer token si se migra a un proveedor privado.
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <Server className="h-5 w-5 text-cyan-300" />
          <h3 className="mt-3 font-semibold text-white">Server Components</h3>
          <p className="mt-1 text-xs text-slate-400">Páginas y servicios que consultan la API en el servidor.</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <Database className="h-5 w-5 text-cyan-300" />
          <h3 className="mt-3 font-semibold text-white">Route Handlers</h3>
          <p className="mt-1 text-xs text-slate-400">Endpoints propios que envuelven y validan la API externa.</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <Smartphone className="h-5 w-5 text-cyan-300" />
          <h3 className="mt-3 font-semibold text-white">Responsive</h3>
          <p className="mt-1 text-xs text-slate-400">Rejillas y menú adaptados a móvil, tablet y escritorio.</p>
        </div>
      </section>

      <p className="mt-12 text-center text-sm text-slate-400">
        Datos proporcionados por{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
          Open-Meteo
        </a>
        .
      </p>
    </div>
  );
}
