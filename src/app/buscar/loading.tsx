export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6" aria-busy="true">
      <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
      <div className="mt-3 h-10 w-64 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-8 h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-white/10" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass h-36 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
