import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchExperience } from "@/components/search-experience";
import { SearchForm } from "@/components/search-form";

export const metadata: Metadata = {
  title: "Buscar ciudades",
  description: "Encuentra cualquier ciudad del mundo y consulta su clima actual.",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Explorador</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Buscar ciudades</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Escribe al menos dos caracteres. La búsqueda usa una Route Handler interna que consume la API de geocodificación.
        </p>
      </div>

      <div className="mb-8 max-w-2xl">
        <SearchForm key={rawQuery ?? ""} initialQuery={rawQuery ?? ""} size="compact" />
      </div>

      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass h-36 animate-pulse rounded-2xl" />
            ))}
          </div>
        }
      >
        <SearchExperience key={rawQuery ?? ""} />
      </Suspense>
    </div>
  );
}
