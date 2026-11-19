import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-3xl p-10">
        <Compass className="mx-auto h-10 w-10 text-cyan-300" />
        <p className="mt-5 text-6xl font-bold text-white">404</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Página no encontrada</h1>
        <p className="mt-2 text-sm text-slate-400">
          La ruta que buscas no existe. Prueba desde el dashboard.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
