export function WeatherSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6" aria-busy="true" aria-label="Cargando datos del clima">
      <div className="h-6 w-48 animate-pulse rounded-full bg-white/10" />
      <div className="glass h-72 animate-pulse rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass h-56 animate-pulse rounded-3xl" />
        <div className="glass h-56 animate-pulse rounded-3xl" />
      </div>
      <div className="glass h-40 animate-pulse rounded-3xl" />
      <span className="sr-only">Cargando datos del clima...</span>
    </div>
  );
}
