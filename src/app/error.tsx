"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-3xl p-8 sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-400/10">
          <AlertTriangle className="h-7 w-7 text-rose-300" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white">Algo salió mal</h1>
        <p className="mt-2 text-sm text-slate-400">
          No pudimos cargar los datos del clima. Revisa tu conexión o inténtalo de nuevo.
        </p>
        {error.message && (
          <p className="mt-3 rounded-xl bg-black/30 px-3 py-2 text-xs text-rose-200/80">
            {error.message}
          </p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950"
          >
            <RotateCcw className="h-4 w-4" /> Reintentar
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
