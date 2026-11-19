import type { Metadata } from "next";
import { FavoritesPanel } from "@/components/favorites-panel";

export const metadata: Metadata = {
  title: "Ciudades favoritas",
  description: "Tus ciudades guardadas y su clima actual.",
};

export default function FavoritosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Tu espacio</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ciudades favoritas</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Guarda ciudades desde el buscador o el pronóstico. Se conservan en tu navegador mediante localStorage.
        </p>
      </div>

      <FavoritesPanel />
    </div>
  );
}
